# Group Aggregation Query
```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
     //Be sure to define as singleton mode
    .Build(); 

class Topic 
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## Group Aggregation

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { tt2 = a.Title.Substring(0, 2), mod4 = a.Id % 4 })
    .Having(a => a.Count() > 0 && a.Avg(a.Key.mod4) > 0 && a.Max(a.Key.mod4) > 0)
    .Having(a => a.Count() < 300 || a.Avg(a.Key.mod4) < 100)
    .OrderBy(a => a.Key.tt2)
    .OrderByDescending(a => a.Count())
    .ToList(a => new { a.Key, cou1 = a.Count(), arg1 = a.Avg(a.Value.Clicks) });

//SELECT substr(a.`Title`, 1, 2) as1, count(1) as2, avg(a.`Id`) as3 
//FROM `Topic` a 
//GROUP BY substr(a.`Title`, 1, 2), (a.`Id` % 4) 
//HAVING (count(1) > 0 AND avg((a.`Id` % 4)) > 0 AND max((a.`Id` % 4)) > 0) AND (count(1) < 300 OR avg((a.`Id` % 4)) < 100) 
//ORDER BY substr(a.`Title`, 1, 2), count(1) DESC
```

> To find the aggregate value without grouping, please use `ToAggregate` instead of `ToList`

## Navigation Property Grouping

If `Topic` has the navigation property `Category`, and `Category` has the navigation property `Area`, the navigation property grouping code is as follows:

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(a => new { a.Key.Category.Area.Name });
```

Note: Write as above, an error will be reported and cannot be resolved `a.Key.Category.Area.Name`. The solution is to use `Include`:

```csharp
var list = fsql.Select<Topic>()
    .Include(a => a.Category.Area)
    //This line must be added, 
    //otherwise only the Category will be grouped without its sub-navigation property Area

    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(a => new { a.Key.Category.Area.Name });
```

However, you can also solve it like this:

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category, a.Category.Area })
    .ToList(a => new { a.Key.Area.Name });
```

## Multi-table Grouping

```csharp
var list = fsql.Select<Topic, Category, Area>()
    .GroupBy((a, b, c) => new { a.Title, c.Name })
    .Having(g => g.Count() < 300 || g.Avg(g.Value.Item1.Clicks) < 100)
    .ToList(g => new { count = g.Count(), Name = g.Key.Name });
```

- `g.Value.Item1` corresponds to `Topic`
- `g.Value.Item2` corresponds to `Category`
- `g.Value.Item3` corresponds to `Area`

## Aggregate

```csharp
var list = fsql.Select<Topic>()
    .Aggregate(a => Convert.ToInt32("count(distinct title)"), out var count)
    .ToList();
```

## API

| Method           | Return    | Parameter     | Description                                                                                                                                                                                         |
| ---------------- | --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ToSql            | string    |               | Return the SQL statement to be executed                                                                                                                                                             |
| ToList\<T\>      | List\<T\> | Lambda        | Execute SQL query and return the records of the specified field. When the record does not exist, return a list with Count of 0.                                                                     |
| ToList\<T\>      | List\<T\> | string field  | Execute SQL query, and return the record of the field specified by field, and receive it as a tuple or basic type (int, string, long). If the record does not exist, return a list with Count of 0. |
| ToAggregate\<T\> | List\<T\> | Lambda        | Execute SQL query and return the aggregate result of the specified field. (Suitable for scenarios where GroupBy is not required)                                                                    |
| Sum              | T         | Lambda        | Specify a column to sum.                                                                                                                                                                            |
| Min              | T         | Lambda        | Specify a column to find the minimum.                                                                                                                                                               |
| Max              | T         | Lambda        | Specify a column to find the maximum.                                                                                                                                                               |
| Avg              | T         | Lambda        | Specify a column to average.                                                                                                                                                                        |
| 【Grouping】     |
| GroupBy          | \<this\>  | Lambda        | Group by the selected column, GroupBy(a => a.Name)                                                                                                                                                  | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy          | \<this\>  | string, parms | Group by raw sql statement, GroupBy("concat(name, @cc)", new { cc = 1 })                                                                                                                            |
| Having           | \<this\>  | string, parms | Filter by raw SQL statement aggregation conditions, Having("count(name) = @cc", new { cc = 1 })                                                                                                     |
| 【Members】      |
| Key              |           |               | Returns the object selected by GroupBy                                                                                                                                                              |
| Value            |           |               | Return to the main table or the field selector of From\<T2,T3....\>                                                                                                                                 |

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
- [《Tenant》](Tenant)