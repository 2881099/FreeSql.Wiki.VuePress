# 分页查询

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10")
    .Build(); //请务必定义成 Singleton 单例模式

class Topic {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
    public int Clicks { get; set; }
    public DateTime CreateTime { get; set; }

    public int CategoryId { get; set; }
}
```

## 每页 20 条数据，查询第 1 页

```csharp
var list = fsql.Select<Topic>()
    .Where(a => a.Id > 10)
    .Count(out var total) //总记录数量
    .Page(1, 20)
    .Tolist();
```

> 注意： 上述例子是对单表进行的查询。如果您正在对多表进行查询，必须要在 Count 之前先进行排序，防止出现不可理解的分页情况。当然，即使是单表，为了防止让分页的次序明确，也建议先排序。

```csharp
var list = fsql.Select<Topic>()
    .Where(a => a.Id > 10)
    .OrderBy(a => a.MsgTime)
    .Count(out var total) //总记录数量
    .Page(1, 20)
    .Tolist();
```

## 优化

SqlServer 2012 以前的版本，使用 row_number 分页；

SqlServer 2012+ 版本，使用最新的 fetch next rows 分页；

## API

| 方法        | 返回值     | 参数                        | 描述                                                                                                                  |
| ----------- | ---------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ToSql       | string     |                             | 返回即将执行的 SQL 语句                                                                                               |
| ToList      | List\<T1\> |                             | 执行 SQL 查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表           |
| ToList\<T\> | List\<T\>  | Lambda                      | 执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表                                                 |
| ToList\<T\> | List\<T\>  | string field                | 执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表 |
| 【分页】    |
| Count       | long       |                             | 查询的记录数量                                                                                                        |
| Count       | \<this\>   | out long                    | 查询的记录数量，以参数 out 形式返回                                                                                   |
| Skip        | \<this\>   | int offset                  | 查询向后偏移行数                                                                                                      |
| Offset      | \<this\>   | int offset                  | 查询向后偏移行数                                                                                                      |
| Limit       | \<this\>   | int limit                   | 查询多少条数据                                                                                                        |
| Take        | \<this\>   | int limit                   | 查询多少条数据                                                                                                        |
| Page        | \<this\>   | int pageIndex, int pageSize | 分页                                                                                                                  |
