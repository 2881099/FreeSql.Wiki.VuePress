# Query from Single Table

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    .Build(); //Be sure to define as singleton mode

class Topic {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
    public int Clicks { get; set; }
    public DateTime CreateTime { get; set; }

    public int CategoryId { get; set; }
}
```

## Single Table

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

## WithSql
```csharp
fsql.Select<Topic>()
  .WithSql("select * from Topic where clicks > @val", new { val = 10 })
  .Page(1, 10)
  .ToList()
//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime` 
//FROM (select * from Topic where clicks > @val) a 
```

> When `WithSql` is used multiple times, it will be converted to `UNION ALL` query

## Reference

- [《Query from Multi Tables》](Query-from-Multi-Tables)
- [《Return Data》](Return-Data)
- [《LinqToSql》](Linq-to-Sql)
- [《Repository Layer》](Repository-Layer)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
- [《Performance》](Performance)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Tenant》](Tenant)