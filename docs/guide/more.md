# 你不知道的功能 ✨

## 1、备注 -> 迁移到数据库

FreeSql CodeFirst 支持将 c# 代码内的注释，迁移至数据库的备注。先决条件：

1、实体类所在程序集，需要开启 xml 文档功能；

2、xml 文件必须与程序集同目录，且文件名：xxx.dll -> xxx.xml；

> v1.5.0+ 版本增加了对 Description 特性的解析，优先级低于 c# 代码注释；

---

## 2、NoneParameter

这个方法可以设置不使用 参数化 执行 SQL 命令，方便开发调试。

```sql
INSERT INTO `tb_topic`(`Title`) VALUES(?Title0)

INSERT INTO `tb_topic`(`Title`) VALUES('Title_1')
```

在 new FreeSqlBuilder().UseNoneParameter(true) 可以全局设置。

在 单次 IInsert、IUpdate 上使用 NoneParameter() 设置单次生效。

---

## 3、添加或修改

```csharp
var repo = fsql.GetRepository<T>();
repo.InsertOrUpdate(实体);
```

> 更多内容可参阅：[添加或修改](insert-or-update.md)

---

## 4、弱类型 CURD

```csharp
fsql.Insert<object>().AsType(实体类型)
  .AppendData(data)
  .ExecuteAffrows();

fsql.Update<object>().AsType(实体类型)
  .SetSource(data)
  .ExecuteAffrows();

fsql.Select<object>().AsType(实体类型)
  .Where(a => (a as BaseEntity).Id == 1)
  .ExecuteAffrows();

//或者仓储
var repo = fsql.GetRepository<object>();
repo.AsType(实体类型);

repo.Insert(..);
repo.Update(..);
repo.Delete(..);
repo.InsertOrUpdate(..);

//或者字典
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
fsql.UpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
fsql.InsertOrUpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
```

---

## 5、WithSql

```csharp
fsql.Select<Topic>()
  .WithSql("select * from Topic where clicks > @val", new { val = 10 })
  .Page(1, 10)
  .ToList()
//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime` 
//FROM (select * from Topic where clicks > @val) a 
```

- [WithSql](withsql.md)使用多次为 UNION ALL 查询

> v3.2.666 [WithTempQuery + FromQuery 嵌套查询](%e5%b5%8c%e5%a5%97%e6%9f%a5%e8%af%a2)

> v3.2.666 WithMemory 使用内存数据进行查询

> 假设跨数据库服务器，或者数据表被缓存过，WithMemory 便可以实现数据表与内存关联查询。

```csharp
var list = new List<Topic>();
list.Add(new Topic { ... });
list.Add(new Topic { ... });

fsql.Select<Topic>()
  .WithMemory(list)
  .ToList()
//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime` 
//FROM (
//  SELECT ...
//  UNION ALL
//  SELECT ...
//) a 
```

---

## 6、你不知道的，指定字段返回

```csharp
fsql.Select<t1>()
  .ToList(a => new {
    a.Id,
    a.Title,
    cstitle = "substr(a.title, 0, 2)", //将 substr(a.title, 0, 2) 作为查询字段
    csnow = Convert.ToDateTime("now()"), //将 now() 作为查询字段
    //奇思妙想：怎么查询开窗函数的结果

    count = fsql.Select<T2>().Count(),
    max = fsql.Select<T2>().Max(b => b.Id),
    min = fsql.Select<T2>().Min(b => b.Id),
    name = fsql.Select<T2>().First(b => b.name),

    //导航属性
    t1Type = a.Type,

    //子查询
    childs = fsql.Select<T2>().Where(b => b.t1_id == a.id).ToList()
  });
```

---

## 7、Dto 映射查询

映射查询支持单表/多表，在查询数据之前映射（不是先查询所有字段再到内存映射）

规则：查找属性名，会循环内部对象 _tables（多表会增长），以 主表优先查，直到查到相同的字段。

如：

A, B, C 都有 id，Dto { id, a1, a2, b1, b2 }，A.id 被映射。也可以指定 id = C.id 映射。

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

DTO 查询只映射默认字段（普通属性），映射对象请使用：

> 导航对象：ToList(a => new Dto { Catalog = a.Catalog })

> 多表对象：ToList((a, b) => new Dto { Catalog = b })

---

## 8、父子关系表

```csharp
List<Category> t2 = fsql.Select<Category>.ToTreeList();
List<Category> t3 = fsql.Select<Category>.Where(a => a.Name = "家电").AsTreeCte().ToTreeList();
//v1.6.0 AsTreeCte() 递归CTE查询 家电 下的所有子分类
```

ToTreeList 查询数据后加工为树型，注意：实体需要配置父子导航属性

```csharp
//返回 AsTreeCte() 树状层级信息
t4 = fsql.Select<Area>()
  .Where(a => a.Name == "中国")
  .AsTreeCte(a => a.Name + "[" + a.Code + "]")
  .OrderBy(a => a.Code)
  .ToList(a => new { item = a, level = Convert.ToInt32("a.cte_level"), path = "a.cte_path" });
Assert.Equal(4, t4.Count);
Assert.Equal("100000", t4[0].item.Code);
Assert.Equal("110000", t4[1].item.Code);
Assert.Equal("110100", t4[2].item.Code);
Assert.Equal("110101", t4[3].item.Code);
Assert.Equal("中国[100000]", t4[0].path);
Assert.Equal("中国[100000] -> 北京[110000]", t4[1].path);
Assert.Equal("中国[100000] -> 北京[110000] -> 北京市[110100]", t4[2].path);
Assert.Equal("中国[100000] -> 北京[110000] -> 东城区[110101]", t4[3].path);
```

## 9、级联加载

有设置导航属性关系的（支持一对多、多对多）：

```csharp
fsql.Select<Tag>().IncludeMany(a => a.Goods).ToList();
```

未设置导航属性关系的，临时指定关系（只支持一对多）：

```csharp
fsql.Select<Goods>().IncludeMany(a => a.Comment.Where(b => b.TagId == a.Id));
```

只查询每项子集合的前几条数据，避免像 EfCore 加载所有数据导致 IO 性能低下（比如某商品下有 2000 条评论）：

```csharp
fsql.Select<Goods>().IncludeMany(a => a.Comment.Take(10));
```

在 Dto 上做映射 IncludeMany：

```csharp
//定义临时类，也可以是 Dto 类
class Dto {
    public int TypeId { get; set; }
    public List<Goods > GoodsList { get; set; }
}

//查询 Goods 商品表，分类1、分类2、分类3 各10条数据
var dto = new [] { 1,2,3 }.Select(a => new Dto { TypeId = a }).ToList();
dto.IncludeMany(d => d.GoodsList.Take(10).Where(gd => gd.TypeId == d.TypeId));

//执行后，dto 每个元素.GoodsList 将只有 10条记录
```

查询子集合表的部分字段，避免子集合字段过多的问题：

```csharp
fsql.Select<Tag>().IncludeMany(a => a.Goods.Select(b => new Goods { Id = b.Id, Title = b.Title }));
//只查询 goods 表 id, title 字段，再作填充
```

---

## 10、WhereCascade

多表查询时，像 isdeleted 每个表都给条件，挺麻烦的。WhereCascade 使用后生成 sql 时，所有表都附上这个条件。

如：

```csharp
fsql.Select<t1>()
    .LeftJoin<t2>(...)
    .WhereCascade(x => x.IsDeleted == false)
    .ToList();
```

得到的 SQL：

```sql
SELECT ...
FROM t1
LEFT JOIN t2 on ... AND (t2.IsDeleted = 0)
WHERE t1.IsDeleted = 0
```

实体可附加表达式时才生效，支持子表查询。单次查询使用的表数目越多收益越大。

---

## 11、WhereDynamicFilter

ISelect.WhereDynamicFilter 方法实现动态过滤条件（与前端交互），支持的操作符：

- Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith：包含/不包含，like '%xx%'，或者 like 'xx%'，或者 like '%xx'
- Equal/NotEqual：等于/不等于
- GreaterThan/GreaterThanOrEqual：大于/大于等于
- LessThan/LessThanOrEqual：小于/小于等于
- Range：范围查询
- DateRange：日期范围，有特殊处理 value\[1\] + 1
- Any/NotAny：是否符合 value 中任何一项（直白的说是 SQL IN）
- Custom：自定义解析

```csharp
DynamicFilterInfo dyfilter = JsonConvert.DeserializeObject<DynamicFilterInfo>(@"
{
    ""Logic"": ""And"",
    ""Filters"":
    [
        { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 1 },
        {
            ""Logic"": ""Or"",
            ""Filters"":
            [
                { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 2 },
                { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 3 }
            ]
        }
    ]
}");
fsql.Select<Region>().WhereDynamicFilter(dyfilter).ToList();
//WHERE id = 1 AND (id = 2 OR id = 3)
```

---

## 12、ISelect.ToDelete、ISelect.ToUpdate

默认 IDelete 不支持导航对象，多表关联等。ISelect.ToDelete 可将查询转为删除对象，以便支持导航对象或其他查询功能删除数据，如下：

```csharp
fsql.Select<T1>().Where(a => a.Options.xxx == 1).ToDelete().ExecuteAffrows();
```

注意：此方法不是将数据查询到内存循环删除，上面的代码产生如下 SQL 执行：

```sql
DELETE FROM `T1` WHERE id in (select a.id from T1 a left join Options b on b.t1id = a.id where b.xxx = 1)
```

复杂删除使用该方案的好处：

- 删除前可预览测试数据，防止错误删除操作；
- 支持更加复杂的删除操作（IDelete 默认只支持简单的操作），甚至在 ISelect 上使用 Limit(10) 将只删除附合条件的前 10 条记录；

> ISelect.ToUpdate 操作类似

---

## 13、保存多对多数据 SaveMany

之前：

FreeSql.DbContext 和 仓储实现，已经实现了联级保存功能，可实现保存对象的时候，将其【OneToMany】、【ManyToMany】导航属性集合也一并保存。

全局关闭：

```csharp
fsql.SetDbContextOptions(opt => opt.EnableCascadeSave = false);
```

局部关闭：

```csharp
var repo = fsql.GetRepository<T>();
repo.DbContextOptions.EnableCascadeSave = false;
```

### 导航属性

保存实体的指定【一对多】、【多对多】导航属性，SaveMany 方法实现在 BaseRepository、DbContext。

解决问题：当实体类导航数据过于复杂的时候，选择关闭联级保存的功能是明智之选，但是此时【一对多】、【多对多】数据保存功能写起来非常繁琐麻烦（与现有数据对比后保存）。

```csharp
var song = new Song { Id = 1 };
song.Tags = new List<Tag>();
song.Tags.Add(new Tag ...);
song.Tags.Add(new Tag ...);
song.Tags.Add(new Tag ...);
repo.SaveMany(song, "Tags");
//轻松保存 song 与 tag 表的关联
```

SaveMany【一对多】的机制是完整对比保存。

SaveMany【多对多】的机制规则与联级保存的一样，如下：

我们对中间表的保存是完整对比操作，对外部实体的操作只作新增（注意不会更新）

- 属性集合为空时，删除他们的所有关联数据（中间表）
- 属性集合不为空时，与数据库存在的关联数据（中间表）完全对比，计算出应该删除和添加的记录

---

## 14、自定义表达式函数

```csharp
[ExpressionCall]
public static class DbFunc {
  //必要定义 static + ThreadLocal
  static ThreadLocal<ExpressionCallContext> context = new ThreadLocal<ExpressionCallContext>();

  public static DateTime FormatDateTime(this DateTime that, string arg1)
  {
    var up = context.Value;
    if (up.DataType == FreeSql.DataType.Sqlite) //重写内容
      up.Result = $"date_format({up.ParsedContent["that"]}, {up.ParsedContent["arg1"]})";
    return that;
  }
}

var sql1 = fsql.Select<SysModule>()
  .ToSql(a => a.CreateTime.FormatDateTime("yyyy-MM-dd"));
//SELECT date_format(a."CreateTime", 'yyyy-MM-dd') as1
//FROM "SysModule" a
```

\[ExpressionCall\] 特性可在静态扩展类上标记，也可以在单个静态方法上标记；

| ExpressionCallContext 属性 | 类型                         | 描述                                |
| -------------------------- | ---------------------------- | ----------------------------------- |
| DataType                   | FreeSql.DataType             | 用于实现不同数据库的适配判断条件    |
| ParsedContent              | Dictionary\<string, string\> | 函数的各参数解析结果                |
| DbParameter                | DbParameter                  | that 被参数化的对象（有可能为 null) |
| UserParameters             | List\<DbParameter\>          | 可附加参数化对象                    |
| Result                     | string                       | 返回表达式函数表示的 SQL 字符串     |

> 当扩展方法返回值为 string 时，其返回值也可以当作 context.Value.Result 设置

> 当不想解析指定参数时，使用特性 \[RawValue\] 标记

---

## 15、自定义实体特性、与其他 ORM 共用特性

本功能可实现与其他 ORM 使用一套 Attribute，避免维护两份实体特性的烦恼：

> v1.4.0+ 已自动识别 EFCore 实体特性 Key/Required/NotMapped/MaxLength/StringLength/DatabaseGenerated/Table/Column

```csharp
fsql.Aop.ConfigEntity += (s, e) => {
  var attr = e.EntityType.GetCustomAttributes(typeof(MyTableAttribute), false).FirstOrDefault() as MyTableAttribute;
  if (attr != null)
    e.ModifyResult.Name = attr.Name; //表名
};
fsql.Aop.ConfigEntityProperty += (s, e) => {
  var attr = e.Property.GetCustomAttributes(typeof(MyColumnAttribute), false).FirstOrDefault() as MyColumnAttribute;
  if (attr != null)
    e.ModifyResult.Name = attr.Name; //字段名
};

[MyTable("xxx")]
class YourEntity {
  [MyColumn("id")]
  public int pkid { get; set; }
}

class MyTableAttribute : Attribute {
  public string Name { get; }
  public MyTableAttribute(string name)
  {
    this.Name = name;
  }
}
class MyColumnAttribute : Attribute {
  public string Name { get; }
  public MyColumnAttribute(string name)
  {
    this.Name = name;
  }
}
```

---

## 16 CURD

如果因为某个 sql 骚操作耗时很高，没有一个相关的审计功能，排查起来可以说无从下手。

FreeSql 支持简单的类似功能：

```csharp
fsql.Aop.CurdAfter += (s, e) => {
 if (e.ElapsedMilliseconds > 200) {
  //记录日志
  //发送短信给负责人
 }
};
```

只需要一个事件，就可以对全局起到作用。

还有一个 CurdBefore 在执行 sql 之前触发，常用于记录日志或开发调试。

---

## 17、审计属性值

实现插入/更新时统一处理某些值，比如某属性的雪花算法值、创建时间值、甚至是业务值。

```csharp
fsql.Aop.AuditValue += (s, e) => {
  if (e.Column.CsType == typeof(long) && 
    e.Property.GetCustomAttribute<SnowflakeAttribute>(false) != null && 
    e.Value?.ToString() == "0")
    e.Value = new Snowflake().GetId();
};

class Order {
  [Snowflake]
  public long Id { get; set; }
  //...
}
```

当属性的类型是 long，并且标记了 [Snowflake]，并且当前值是 0，那么在插入/更新时它的值将设置为雪花id值。

> 说明：SnowflakeAttribute 是使用者您来定义，new Snowflake().GetId() 也是由使用者您来实现

如果命名规范，可以在 aop 里判断，if (e.Property.Name == "createtime") e.Value = DateTime.Now;

> v3.2.666 可设置 e.ObjectAuditBreak = true 中断对象审计，变相实现每个对象只触发一次 AuditValue 事件

## 18、Ado.Net 扩展方法

提供了类似 Dapper 的使用方法，FreeSql 增加了 IDbConnection/IDbTransaction 对象的扩展方法 Select/Insert/Update/Delete 实现 CRUD。

```csharp
using FreeSql;

using (var conn = new SqlConnection(...))
{
  IFreeSql fsql = conn.GetIFreeSql();
  fsql.CodeFirst.IsNoneCommandParameter = true;
  fsql.CodeFirst.IsSyncStructureToUpper = true;
  fsql.Aop.CommandBefore += (_, e) => Trace.WriteLine(e.Command.CommandText);
  //以上整个程序只需要设置一次

  conn.Select<T>().Where(...).ToList();

  conn.Insert(new T {}).ExecuteAffrows();
  conn.Update().SetSource(new T {}).ExecuteAffrows();
  conn.InsertOrUpdate().SetSource(new T {}).ExecuteAffrows();

  conn.Delete<T>().Where(...).ExecuteAffrows();
}
```

- 每个 SqlConnection GetFreeSql() 返回的 IFreeSql 实例相同；
- 可以对 fsql 设置 Aop 事件，比如监视 SQL；
- IFreeSql 自身的成员 IDbFirst、Transaction 不可用；

利用本功能可以快速将 FreeSql 使用到项目中，只需要处理好实体类的特性。

提示：FreeSql 兼容 EFCore 99% 的实体特性
