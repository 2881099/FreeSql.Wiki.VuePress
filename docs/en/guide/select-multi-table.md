# Multiple Tables ✨

```csharp
IFreeSql fsql; // For creation details, please refer to the Getting Started document

class Topic 
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
    public int Clicks { get; set; }
    public DateTime CreateTime { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
}
class Category 
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Name { get; set; }

    public int ParentId { get; set; }
    public CategoryType Parent { get; set; }
    public List<Topic> Topics { get; set; }
}
class CategoryType
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

## 1. Multiple Table Joins

```csharp
fsql.Select<Topic, Category, CategoryType>()
    .LeftJoin((a,b,c) => a.CategoryId == b.Id)
    .LeftJoin((a,b,c) => b.ParentId == c.Id)
    .Where((a,b,c) => c.Id > 0)
    .ToList((a,b,c) => new { a,b,c });

// Or
fsql.Select<Topic>().From<Category, CategoryType>((s, b, c) => s
    .LeftJoin(a => a.CategoryId == b.Id)
    .LeftJoin(a => b.ParentId == c.Id))
    .Where((a,b,c) => c.Id > 0)
    .ToList((a,b,c) => new { a,b,c });
  
// Reducing the definition of a,b,c
fsql.Select<Topic, Category, CategoryType>()
    .LeftJoin(w => w.t1.CategoryId == w.t2.Id)
    .LeftJoin(w => w.t2.ParentId == w.t3.Id)
    .Where(w => w.t3.Id > 0)
    .ToList(w => new { w.t1,w.t2,w.t3 });
  
// SELECT ...
// FROM `Topic` a
// LEFT JOIN `Category` b ON a.`CategoryId` = b.`Id`
// LEFT JOIN `CategoryType` c ON b.`ParentId` = c.`Id`
// WHERE c.`Id` > 0
```

> Experience: [One-to-Many, Only Retrieve the Last Record from Split Tables](https://github.com/dotnetcore/FreeSql/issues/430)

## 2. Navigation Property Joins

```csharp
fsql.Select<Topic>()
    .LeftJoin(a => a.Category.Id == a.CategoryId)
    .LeftJoin(a => a.Category.Parent.Id == a.Category.ParentId)
    .Where(a => a.Category.Parent.Id > 0)
    .ToList();
// SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`, a__Category.`Id` as6, a__Category.`Name`, a__Category.`ParentId`
// FROM `Topic` a
// LEFT JOIN `Category` a__Category ON a__Category.`Id` = a.`CategoryId`
// LEFT JOIN `CategoryType` a__Category__Parent ON a__Category__Parent.`Id` = a__Category.`ParentId`
```

> Tip: After correctly configuring the [Navigation Relations], there's no need to manually call `LeftJoin`.

## 3. WithSql

```csharp
fsql.Select<Topic, Category, CategoryType>()
    .WithSql(
        "select * from Topic where id=@id1",
        "select * from Category where id=@id2",
        null, // No SQL specified for CategoryType
        new { id1 = 10, id2 = 11, id3 = 13 }
    )
    .LeftJoin((a,b,c) => a.CategoryId == b.Id)
    .LeftJoin((a,b,c) => b.ParentId == c.Id)
    .ToList();
// SELECT ...
// FROM ( select * from Topic where id=@id1 ) a
// LEFT JOIN ( select * from Category where id=@id2 ) b ON a.`CategoryId` = b.`Id`
// LEFT JOIN `CategoryType` c ON b.`ParentId` = c.`Id`
```

> Tip: `ISelect.ToSql` can be used with `WithSql`.

## 4. Sub-table Exists

```csharp
fsql.Select<Topic>()
    .Where(a => fsql.Select<Topic>().As("b").Where(b => b.Id == a.Id).Any())
    .ToList();
// SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
// FROM `Topic` a
// WHERE (exists(SELECT 1
//    FROM `Topic` b
//    WHERE (b.`Id` = a.`Id`)
//    limit 0,1))
```

> Tip: Since the entity classes for subqueries are the same as the upper-level ones, use `As("b")` to specify an alias for differentiation.

## 5. Sub-table In

```csharp
fsql.Select<Topic>()
    .Where(a => fsql.Select<Topic>().As("b").ToList(b => b.Id).Contains(a.Id))
    .ToList();
// SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
// FROM `Topic` a
// WHERE (((a.`Id`) in (SELECT b.`Id`
//    FROM `Topic` b)))
```

## 6. Sub-table List Navigation Property

```csharp
fsql.Select<Category>()
    .Where(a => a.Topics.Any(b => b.Title.Contains("xx"))) // Use a.Topics.AsSelect() for versions below v3.2.600
    .ToList();
```

The effect is equivalent to:

```csharp
fsql.Select<Category>()
    .Where(a => fsql.Select<Topic>().Any(b => b.CategoryId == a.Id && b.Title.Contains("xx")))
    .ToList();
```

Quickly convert collection properties to `ISelect` for subquery operations.

## 7. Sub-table String.Join

From v1.8.0+, `string.Join` + `ToList` concatenates multiple rows of results from a subquery into a single string, e.g., "1,2,3,4".

```csharp
fsql.Select<Topic>().ToList(a => new
{
    id = a.Id,
    concat = string.Join(",", fsql.Select<StringJoin01>().ToList(b => b.Id))
});
// SELECT a.`Id`, (SELECT group_concat(b.`Id` separator ',') 
//    FROM `StringJoin01` b) 
// FROM `Topic` a
```

> Tip: Subquery `string.Join` + `ToList` is adapted for sqlserver/pgsql/oracle/mysql/sqlite/firebird/duckdb/kingbase/gbase/hangao [#405](https://github.com/dotnetcore/FreeSql/issues/405)

## 8. Sub-table First/Count/Sum/Max/Min/Avg

```csharp
fsql.Select<Category>().ToList(a => new 
{
    all = a,
    first = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).First(b => b.Id),
    count = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Count(),
    sum = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Sum(b => b.Clicks),
    max = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Max(b => b.Clicks),
    min = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Min(b => b.Clicks),
    avg = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Avg(b => b.Clicks)
});
```

## 9. Sub-table ToList

> For versions v3.2.650+, at most 3 SQL queries are executed

```csharp
fsql.Select<Topic>().ToList(a => new
{
    all = a,
    list1 = fsql.Select<T2>().ToList(),
    list2 = fsql.Select<T2>().Where(b => b.TopicId == a.Id).ToList()
});

fsql.Select<Topic>()
    .GroupBy(a => new { a.Author })
    .WithTempQuery(a => new { Author = a.Key.Author, Count = a.Count() })
    .ToList(a => new
    {
        a.Author, a.Count,
        list1 = fsql.Select<T2>().ToList(),
        list2 = fsql.Select<T2>().Where(b => b.Author == a.Author).ToList()
    });
```

## 10. WhereCascade

When querying multiple tables, applying conditions like `isdeleted` to each table can be cumbersome. `WhereCascade` applies this condition to all tables when generating SQL.

For example:

```csharp
fsql.Select<t1>()
    .LeftJoin<t2>(...)
    .WhereCascade(x => x.IsDeleted == false)
    .ToList();
```

The resulting SQL:

```sql
SELECT ...
FROM t1
LEFT JOIN t2 on ... AND (t2.IsDeleted = 0) 
WHERE t1.IsDeleted = 0
```

This feature is effective when entities can attach expressions and supports sub-table queries. The more tables used in a single query, the greater the benefit.

Applicable Scope:

- Subqueries, one-to-many, many-to-many, and custom subqueries.
- Join queries, navigation properties, and custom Join queries.
- Sub-collection queries using Include/[IncludeMany](select-include.md).

> Broadcast of [Lazy Loading] properties is not currently supported.

> This feature differs from [Filters]; it is used for propagating conditions in a single multi-table query.