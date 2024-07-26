# Single Table

```csharp
IFreeSql fsql; // For creation instructions, please refer to the introductory documentation.

class Topic
{
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
//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime`
//FROM `Topic` a
//WHERE (a.`Id` = 10)

fsql.Select<Topic>()
    .Where(a => a.Id == 10 && a.Id > 10 || a.Clicks > 100)
    .ToList();
//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime`
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

> Using WithSql multiple times is equivalent to UNION ALL queries.

> v3.2.666 [UnionAll Union Queries](unionall), [WithTempQuery + FromQuery Nested Queries](withtempquery)

> v3.2.666 WithMemory for querying using in-memory data.

> Assuming cross-database servers or cached data tables, WithMemory can achieve data table and memory-related queries.

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