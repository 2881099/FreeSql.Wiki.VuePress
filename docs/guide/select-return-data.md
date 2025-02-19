# 返回数据 ✨

FreeSql 使用 ExpressionTree 读取数据记录，.NET 技术下除了原生代码，最快的方案是 Emit 和 ExpressionTree。

ExpressionTree 天然支持 .NET AOT 编译，FreeSql 在 2018 年做出的技术决策将在未来一直受益。

## 1、返回单条记录

```csharp
Topic t1 = fsql.Select<Topic>().ToOne();
```

> FreeSql 约定，ToOne/First 永远返回 null 或 有数据的实体对象，ToList 永远返回非 null 的 List\<实体类型\>

## 2、返回 List

```csharp
List<Topic> t1 = fsql.Select<Topic>().ToList();
```

## 3、返回 TreeList

```csharp
List<Area> t2 = fsql.Select<Area>.ToTreeList();
List<Area> t3 = fsql.Select<Area>.Where(a => a.Name = "湖北").AsTreeCte().ToTreeList();
//v1.6.0 AsTreeCte() 递归CTE查询 湖北 下的所有子分类
```

> 查询数据加工为树型，注意：实体需要配置[父子导航属性](select-as-tree.md)

## 4、返回 List + 导航属性的数据

```csharp
List<Topic> t4 = fsql.Select<Topic>().LeftJoin(a => a.Category.Id == a.CategoryId).ToList();
//此时会查询 Topic普通字段 + 导航对象Category 字段
```

更多导航属性的数据返回：[贪婪加载](select-include.md)

## 5、指定返回

```csharp
//返回一个字段
List<int> t5 = fsql.Select<Topic>().ToList(a => a.Id);

//返回匿名类
List<匿名类> t6 = fsql.Select<Topic>().ToList(a => new { a.Id, a.Title });

//返回元组
List<(int, string)> t7 = fsql.Select<Topic>().ToList<(int, string)>("id, title");

//返回导航属性
List<匿名类> t8 = fsql.Select<Topic>().ToList(a => new
{
    a.Id, a.Title,
    a.Category //导航属性
});

//返回SQL字段
List<匿名类> t9 = fsql.Select<Topic>().ToList(a => new
{
    cstitle = "substr(a.title, 0, 2)", //将 substr(a.title, 0, 2) 作为查询字段
    csnow = Convert.ToDateTime("now()"), //将 now() 作为查询字段
});

//返回子查询的字段
List<匿名类> t10 = fsql.Select<Topic>().ToList(a => new
{
    a.Id,
    count = fsql.Select<T2>().Count(),
    max = fsql.Select<T2>().Max(b => b.Id),
    min = fsql.Select<T2>().Min(b => b.Id),
    name = fsql.Select<2>().First(b => b.name)
});

//返回子查询集合 v3.2.650+ 以下最多执行3次 SQL
List<匿名类> t11 = fsql.Select<Topic>().ToList(a => new
{
    a.Id,
    list1 = fsql.Select<T2>().ToList(),
    list2 = fsql.Select<T2>().Where(b => b.TopicId == a.Id).ToList()
});
List<匿名类> t12 = fsql.Select<Topic>()
    .GroupBy(a => new { a.Author })
    .WithTempQuery(a => new { Author = a.Key.Author, Count = a.Count() })
    .ToList(a => new
    {
        a.Author, a.Count,
        list1 = fsql.Select<T2>().ToList(),
        list2 = fsql.Select<T2>().Where(b => b.Author == a.Author).ToList()
    });
```

> 常量机制早期留给了原生 SQL，如果真的需要返回该字符串："'xxx'"

## 6、忽略字段返回

参考实现：[https://github.com/dotnetcore/FreeSql/issues/528](https://github.com/dotnetcore/FreeSql/issues/528)

## 7、Dto 映射返回

```csharp
fsql.Select<Song>().ToList<Dto>();
//情况1：Dto 与 Song 属性名相同的字段被查询，返回 List<Dto>

fsql.Select<Song>().ToList(a => new Dto { xxx = a.ext })
//情况2：Dto 与 Song 属性名相同的字段被查询，纠正映射 ext，返回 List<Dto>

fsql.Select<Song>().ToList(a => new Song { id = a.id })
//情况3：Lambda 与 Song 类型一样，只查询指定字段 id，返回 List<Song>

fsql.Select<Song>().ToList(a => new { id = a.id })
//情况4：Lambda 匿名类型，只查询指定字段 id，返回 List<匿名对象>
```

> 请仔细处理区别，请仔细处理区别，请仔细处理区别

```csharp
fsql.Select<Song>().ToList(a => new Dto(a.id))
//情况5：只查询 id，返回 List<Dto>

fsql.Select<Song>().ToList(a => new Dto(a.id) { xxx = a.ext })
//情况6：查询 id, ext，返回 List<Dto>

fsql.Select<Song>().ToList(a => new Song(a.id))
//情况7：查询 id，返回 List<Song>

fsql.Select<Song>().ToList(a => new Song(a.id) { xxx = a.ext })
//情况8：查询 id, ext，返回 List<Song>
```

> GroupBy 所有方法不使用 DTO 映射规则

这种映射支持单表/多表，在查询数据之前映射（不是先查询所有字段再到内存映射）

查找规则，查找属性名，会循环内部对象 \_tables（join 查询后会增长），以 主表优先查，直到查到相同的字段。

如：

A, B, C 都有 id，Dto { id, a1, a2, b1, b2 }，A.id 被映射。也可以指定 id = C.id 映射。

DTO 查询只映射默认字段（普通属性），映射对象请使用：

> 导航对象：ToList(a => new Dto { Catalog = a.Catalog })

> 多表对象：ToList((a, b) => new Dto { Catalog = b })

## 8、ToChunk 分段返回

执行查询，分块返回数据，可减少内存开销。比如读取 10 万条数据，每次返回 100 条处理。

```csharp
fsql.Select<Song>().OrderBy(a => a.Id).ToChunk(100, done =>
{
    List<Song> list = done.Object;
    //done.IsBreak = true; v1.7.0 停止读取
});
```

## 9、ToSql

每个 ToList 都可以使用 ToSql 返回 SQL String，有两个选项：

- FieldAliasOptions.AsIndex(默认) 自动产生 as1, as2, as3 .... 字段别名，可以最大程度防止多表，存在相同字段的问题；
- FieldAliasOptions.AsProperty 使用属性名作为字段别名，合适使用二次构造 SQL 再次执行；

## 10、执行 SQL

```csharp
class xxx
{
    public int Id { get; set; }
    public string Path { get; set; }
    public string Title2 { get; set; }
}

List<xxx> t11 = fsql.Ado.Query<xxx>("select * from song");
List<(int, string ,string)> t12 = fsql.Ado.Query<(int, string, string)>("select * from song");
List<dynamic> t13 = fsql.Ado.Query<dynamic>("select * from song");
```

> 注意：Ado.Query 的实体特性是无效的，比如 [Column(Name = "xxx")] 无效

## 11、API

| 方法          | 返回值      | 参数                                                     | 描述                                                                                                                |
| ------------- | ----------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ToSql         | string      |                                                          | 返回即将执行的SQL语句                                                                                               |
| ToList        | List\<T1\>  |                                                          | 执行SQL查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表           |
| ToList\<Dto\> | List\<Dto\> | Lambda                                                   | 执行SQL查询，返回指定字段或Dto映射的记录，记录不存在时返回 Count 为 0 的列表                                        |
| ToList\<T\>   | List\<T\>   | string field                                             | 执行SQL查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表 |
| ToOne         | T1          |                                                          | 执行SQL查询，返回 T1 实体所有字段的第一条记录，记录不存在时返回 null                                                |
| ToChunk       | \<空\>      | int size, Action\<FetchCallbackArgs\<List\<T1\>\>\> done | 执行SQL查询，分块返回数据，可减少内存开销。比如读取10万条数据，每次返回100条处理。                                  |
| Any           | bool        |                                                          | 执行SQL查询，是否有记录                                                                                             |
| Sum           | T           | Lambda                                                   | 指定一个列求和                                                                                                      |
| Min           | T           | Lambda                                                   | 指定一个列求最小值                                                                                                  |
| Max           | T           | Lambda                                                   | 指定一个列求最大值                                                                                                  |
| Avg           | T           | Lambda                                                   | 指定一个列求平均值                                                                                                  |
