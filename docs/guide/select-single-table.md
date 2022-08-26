# 单表查询

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

## 单表

```csharp
fsql.Select<Topic>()
  .Where(a => a.Id == 10)
  .ToList();
///SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime`
//FROM `Topic` a
//WHERE (a.`Id` = 10)

fsql.Select<Topic>()
  .Where(a => a.Id == 10 && a.Id > 10 || a.Clicks > 100)
  .ToList();
///SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime`
//FROM `Topic` a
//WHERE (a.`Id` = 10 AND a.`Id` > 10 OR a.`Clicks` > 100)

fsql.Select<Topic>()
  .Where(a => new []{1,2,3}.Contains(a.Id))
  .ToList();
//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime`
//FROM `Topic` a
//WHERE (a.`Id` in (1,2,3))
```

## [WithSql](withsql.md)

```csharp
fsql.Select<Topic>()
  .WithSql("select * from Topic where clicks > @val", new { val = 10 })
  .Page(1, 10)
  .ToList()
//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime` 
//FROM (select * from Topic where clicks > @val) a 
```

> 关于[WithSql](withsql.md)的详情文档， 使用多次为 UNION ALL 查询

> v3.2.666 [UnionAll 联合查询](unionall.md)、[WithTempQuery + FromQuery 嵌套查询](withtempquery.md)

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
