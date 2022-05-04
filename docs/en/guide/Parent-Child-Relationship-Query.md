# Parent Child Relationship Query

Unlimited classification (father and child) is a commonly used table design. Each design method highlights advantages but also brings defects, such as:

- Way 1：There is only the `parent_id` field in the table design, which is **troublesome**: query trouble (this article can solve it).
- Way 2：The redundant child id in the table design is easy to query, and it is **troublesome**: it needs to be recalculated when insert/update/delete;
- Way 3：The left and right value codes are stored in the table design, **troublesome**: the same as above;

Way 1: The design is the simplest. This article solves its recursive query problem and makes the use transparent.

## Parent-child Navigation Properties

Among the FreeSql navigation properties, there are settings for the parent-child relationship, as follows:

```csharp
public class Area
{
  [Column(IsPrimary = true)]
  public string Code { get; set; }

  public string Name { get; set; }
  public string ParentCode { get; set; }

  [Navigate(nameof(ParentCode))]
  public Area Parent { get; set; }
  [Navigate(nameof(ParentCode))]
  public List<Area> Childs { get; set; }
}
```

Define the Parent property, in the expression can be like this:

```csharp
fsql.Select<Area>().Where(a => a.Parent.Parent.Parent.Name == "中国").First();
```

Define the Childs attribute, in the expression (subquery):

```csharp
fsql.Select<Area>().Where(a => a.Childs.Any(c => c.Name == "北京")).First();
```

To define the Childs property, you can also use [Cascade Saving](Cascade-Saving), [Greed Loading](Greed-Loading) and so on.

```csharp
fsql.Delete<Area>().Where("1=1").ExecuteAffrows();
var repo = fsql.GetRepository<Area>();
repo.DbContextOptions.EnableCascadeSave = true;
repo.DbContextOptions.NoneParameter = true;
repo.Insert(new Area
{
  Code = "100000",
  Name = "中国",
  Childs = new List<Area>(new[] {
    new Area
    {
      Code = "110000",
      Name = "北京",
      Childs = new List<Area>(new[] {
        new Area{ Code="110100", Name = "北京市" },
        new Area{ Code="110101", Name = "东城区" },
      })
    }
  })
});
```

## ToTreeList

After configuring the parent-child properties, you can use it like this:

```csharp
var t1 = fsql.Select<Area>().ToTreeList();
Assert.Single(t1);
Assert.Equal("100000", t1[0].Code);
Assert.Single(t1[0].Childs);
Assert.Equal("110000", t1[0].Childs[0].Code);
Assert.Equal(2, t1[0].Childs[0].Childs.Count);
Assert.Equal("110100", t1[0].Childs[0].Childs[0].Code);
Assert.Equal("110101", t1[0].Childs[0].Childs[1].Code);
```

The query data is originally flat. The `ToTreeList` method processes the returned flat data into a tree list in memory and returns it.

## Delete Recursively - AsTreeCte

Very common infinite level classification table function, when deleting a tree node, the child nodes are also processed.

```csharp
fsql.Select<Area>()
  .Where(a => a.Name == "中国")
  .AsTreeCte()
  .ToDelete()
  .ExecuteAffrows(); //Delete all records under 中国.
```

If logically delete:

```csharp
fsql.Select<Area>()
  .Where(a => a.Name == "中国")
  .AsTreeCte()
  .ToUpdate()
  .Set(a => a.IsDeleted, true)
  .ExecuteAffrows(); //Logically delete all records under 中国.
```

## Query Recursively - AsTreeCte

If you do not design an infinite level classification table with data redundancy, recursive query is essential. `AsTreeCte` is the package for solving recursive query. Method parameters description:

| Parameter                | Description                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| (Optional) pathSelector  | Path content selection, you can set the query to return: `中国 -> 北京 -> 东城区`                           |
| (Optional) up            | _false_ (default): recursive query from parent to child; <br />_true_: recursive query from child to parent |
| (Optional) pathSeparator | Set the connector of `pathSelector`, default: `->`                                                          |
| (Optional) level         | Set recursion level                                                                                         |

> Databases that have passed the test: MySql8.0, SqlServer, PostgreSQL, Oracle, Sqlite, Firebird, 达梦, 人大金仓, 神舟通用, 南大通用, 翰高, MSAccess And ClickHouse.

Practice 1: AsTreeCte() + ToTreeList

```csharp
var t2 = fsql.Select<Area>()
  .Where(a => a.Name == "中国")
  .AsTreeCte() //Query all records under 中国
  .OrderBy(a => a.Code)
  .ToTreeList(); //Not necessary, you can also use ToList (see Practice 2)
Assert.Single(t2);
Assert.Equal("100000", t2[0].Code);
Assert.Single(t2[0].Childs);
Assert.Equal("110000", t2[0].Childs[0].Code);
Assert.Equal(2, t2[0].Childs[0].Childs.Count);
Assert.Equal("110100", t2[0].Childs[0].Childs[0].Code);
Assert.Equal("110101", t2[0].Childs[0].Childs[1].Code);

// WITH "as_tree_cte"
// as
// (
// SELECT 0 as cte_level, a."Code", a."Name", a."ParentCode" 
// FROM "Area" a 
// WHERE (a."Name" = '中国')

// union all

// SELECT wct1.cte_level + 1 as cte_level, wct2."Code", wct2."Name", wct2."ParentCode" 
// FROM "as_tree_cte" wct1 
// INNER JOIN "Area" wct2 ON wct2."ParentCode" = wct1."Code"
// )
// SELECT a."Code", a."Name", a."ParentCode" 
// FROM "as_tree_cte" a 
// ORDER BY a."Code"
```

Practice 2: AsTreeCte() + ToList
```csharp
var t3 = fsql.Select<Area>()
  .Where(a => a.Name == "中国")
  .AsTreeCte()
  .OrderBy(a => a.Code)
  .ToList();
Assert.Equal(4, t3.Count);
Assert.Equal("100000", t3[0].Code);
Assert.Equal("110000", t3[1].Code);
Assert.Equal("110100", t3[2].Code);
Assert.Equal("110101", t3[3].Code);
//The executed SQL is the same as Practice 1
```

Practice 3: AsTreeCte(pathSelector) + ToList

After setting the `pathSelector` parameter, how to return the hidden field?

```csharp
var t4 = fsql.Select<Area>()
  .Where(a => a.Name == "中国")
  .AsTreeCte(a => a.Name + "[" + a.Code + "]")
  .OrderBy(a => a.Code)
  .ToList(a => new { 
    item = a, 
    level = Convert.ToInt32("a.cte_level"), 
    path = "a.cte_path" 
  });
Assert.Equal(4, t4.Count);
Assert.Equal("100000", t4[0].item.Code);
Assert.Equal("110000", t4[1].item.Code);
Assert.Equal("110100", t4[2].item.Code);
Assert.Equal("110101", t4[3].item.Code);
Assert.Equal("中国[100000]", t4[0].path);
Assert.Equal("中国[100000] -> 北京[110000]", t4[1].path);
Assert.Equal("中国[100000] -> 北京[110000] -> 北京市[110100]", t4[2].path);
Assert.Equal("中国[100000] -> 北京[110000] -> 东城区[110101]", t4[3].path);

// WITH "as_tree_cte"
// as
// (
// SELECT 0 as cte_level, a."Name" || '[' || a."Code" || ']' as cte_path, a."Code", a."Name", a."ParentCode" 
// FROM "Area" a 
// WHERE (a."Name" = '中国')

// union all

// SELECT wct1.cte_level + 1 as cte_level, wct1.cte_path || ' -> ' || wct2."Name" || '[' || wct2."Code" || ']' as cte_path, wct2."Code", wct2."Name", wct2."ParentCode" 
// FROM "as_tree_cte" wct1 
// INNER JOIN "Area" wct2 ON wct2."ParentCode" = wct1."Code"
// )
// SELECT a."Code" as1, a."Name" as2, a."ParentCode" as5, a.cte_level as6, a.cte_path as7 
// FROM "as_tree_cte" a 
// ORDER BY a."Code"
```

> More practice...please try according to the code comments.

## Reference

- [《Query from Multi Tables》](Query-from-Multi-Tablea)
- [《Return Data》](Return-Data)
- [《LinqToSql》](Linq-to-Sql)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
- [《Performance》](Performance)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Tenant》](Tenant)