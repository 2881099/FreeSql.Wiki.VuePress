# Query from Multi Tables

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
    public Category Category { get; set; }
}
class Category {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Name { get; set; }

    public int ParentId { get; set; }
    public CategoryType Parent { get; set; }
    public List<Topic> Topics { get; set; }
}
class CategoryType {
    public int Id { get; set; }
    public string Name { get; set; }
}
```

## 1. Navigation Property Table

```csharp
fsql.Select<Topic>()
  .LeftJoin(a => a.Category.Id == a.CategoryId)
  .LeftJoin(a => a.Category.Parent.Id == a.Category.ParentId)
  .Where(a => a.Category.Parent.Id > 0)
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`, a__Category.`Id` as6, a__Category.`Name`, a__Category.`ParentId`
//FROM `Topic` a
//LEFT JOIN `Category` a__Category ON a__Category.`Id` = a.`CategoryId`
//LEFT JOIN `CategoryType` a__Category__Parent ON a__Category__Parent.`Id` = a__Category.`ParentId`
```

> Tip: After [the navigation relationship](Entity-Relationship) is configured correctly, you no longer need to manually call `LeftJoin`.

## 2. Complex multi-table join

```csharp
fsql.Select<Topic, Category, CategoryType>()
  .LeftJoin((a,b,c) => a.CategoryId == b.Id)
  .LeftJoin((a,b,c) => b.ParentId == c.Id)
  .Where((a,b,c) => c.Id > 0)
  .ToList((a,b,c) => new { a,b,c });

//OR
fsql.Select<Topic>().From<Category, CategoryType>((s, b, c) => s
  .LeftJoin(a => a.CategoryId == b.Id)
  .LeftJoin(a => b.ParentId == c.Id))
  .Where((a,b,c) => c.Id > 0)
  .ToList((a,b,c) => new { a,b,c });

//WITHOUT DEFINE a, b, c
fsql.Select<Topic, Category, CategoryType>()
  .LeftJoin(w => w.t1.CategoryId == w.t2.Id)
  .LeftJoin(w => w.t2.ParentId == w.t3.Id)
  .Where(w => w.t3.Id > 0)
  .ToList(w => new { w.t1,w.t2,w.t3 });

//SELECT ...
//FROM `Topic` a
//LEFT JOIN `Category` b ON a.`CategoryId` = b.`Id`
//LEFT JOIN `CategoryType` c ON b.`ParentId` = c.`Id`
//WHERE c. `Id` > 0
```

> Experience: [One-to-many, only the last record is taken from the associated table ](https://github.com/dotnetcore/FreeSql/issues/430)

## 3. WithSql

```csharp
fsql.Select<Topic, Category, CategoryType>()
  .WithSql(
      "select * from Topic where id=@id1",
      "select * from Category where id=@id2",
      null, //Do not set the SQL corresponding to CategoryType
      new { id1 = 10, id2 = 11, id3 = 13 }
  )
  .LeftJoin((a,b,c) => a.CategoryId == b.Id)
  .LeftJoin((a,b,c) => b.ParentId == c.Id)
  .ToList();

//SELECT ...
//FROM ( select * from Topic where id=@id1 ) a
//LEFT JOIN ( select * from Category where id=@id2 ) b ON a.`CategoryId` = b.`Id`
//LEFT JOIN `CategoryType` c ON b.`ParentId` = c.`Id`
```

> Tip: `ISelect.ToSql` can be used with `WithSql`

## 4. SQL join table

```csharp
fsql.Select<Topic>()
  .LeftJoin("Category b on b.Id = a.CategoryId and b.Name = @bname", new { bname = "xxx" })
  .ToList();

//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//LEFT JOIN Category b on b.Id = a.CategoryId and b.Name = @bname
```

Extended question: How to specify the fields of the SQL join table `b` in `ToList`?

```csharp
.ToList(a => new {
  bid = Convert.ToInt32("b.Id"),
  bName = "b.Name"
})
```

## 5. Subtable: Exists

```csharp
fsql.Select<Topic>()
  .Where(a => fsql.Select<Topic>().As("b").Where(b => b.Id == a.Id).Any())
  .ToList();

//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//WHERE (exists(SELECT 1
//    FROM `Topic` b
//    WHERE (b.`Id` = a.`Id`)
//    limit 0,1))
```

> Tip: Since the entity class of the subquery is the same as the upper layer, use `As("b")` to specify the alias to distinguish.

## 6. Subtable: In

```csharp
fsql.Select<Topic>()
  .Where(a => fsql.Select<Topic>().As("b").ToList(b => b.Id).Contains(a.Id))
  .ToList();

//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//WHERE (((a.`Id`) in (SELECT b.`Id`
//    FROM `Topic` b)))
```

## 7. Subtable: Join

Since version 1.8.0, `string.Join` + `ToList` can concatenate the results of multiple rows of sub-queries into one string, such as: "1,2,3,4":

```csharp
fsql.Select<Topic>().ToList(a => new {
  id = a.Id,
  concat = string.Join(",", fsql.Select<StringJoin01>().ToList(b => b.Id))
});

//SELECT a.`Id`, (SELECT group_concat(b.`Id` separator ',') 
//    FROM `StringJoin01` b) 
//FROM `Topic` a
```

> Tip: The subquery `string.Join` + `ToList` is adapted to sqlserver/pgsql/oracle/mysql/sqlite/firebird/Dameng/KingbaseES/翰高[#405](https://github.com/dotnetcore/FreeSql/issues/405)

## 8. Subtable: First/Count/Sum/Max/Min/Avg

```csharp
fsql.Select<Category>().ToList(a => new  {
  all = a,
  first = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).First(b => b.Id),
  count = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Count(),
  sum = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Sum(b => b.Clicks),
  max = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Max(b => b.Clicks),
  min = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Min(b => b.Clicks),
  avg = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Avg(b => b.Clicks)
});
```

## 9. AsSelect

```csharp
fsql.Select<Category>()
  .Where(a => a.Topics.AsSelect().Any(b => b.Title.Contains("xx")))
  .ToList();
```

The effect is equivalent to:

```csharp
fsql.Select<Category>()
  .Where(a => fsql.Select<Topic>().Any(b => b.Title.Contains("xx")))
  .ToList();
```

Quickly convert the collection properties to `ISelect` for sub-query operations.

## 10. WhereCascade

When querying multiple tables, it is troublesome to add conditions to each table like `ISelect`, and `WhereCascade` came into being. After using `WhereCascade`, when SQL is generated, all tables will be attached to this condition.

Such as:

```csharp
fsql.Select<t1>()
.LeftJoin<t2>(...)
.WhereCascade(x => x.IsDeleted == false)
.ToList();
```

The SQL obtained is:

```sql
SELECT ...
FROM t1
LEFT JOIN t2 on ... AND (t2.IsDeleted = 0) 
WHERE t1.IsDeleted = 0
```

It will only take effect when the entity can attach expressions, and supports sub-table query. The more tables used in a single query, the greater the benefits.

Applicable to: 

- Subqueries, one-to-many, many-to-many, and custom sub-queries;
- Join query, navigation properties, custom Join query;
- Include/[IncludeMany](Lazy-Loading#2-Navigation-Property-OneToManyManyToMany) sub-collection query; 

> The propagation of **Lazy Property** is temporarily not supported; 

> This function is different from **Filter**, this function is used for the propagation of single multi-table query conditions; 

## Reference

- [《Return Data》](Return-Data)
- [《Repository Layer》](Repository-Layer)
- [《LinqToSql》](Linq-to-Sql)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
- [《Performance》](Performance)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Tenant》](Tenant)