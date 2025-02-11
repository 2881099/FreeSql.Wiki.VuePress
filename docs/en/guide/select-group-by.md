# Group By

```csharp
IFreeSql fsql; // For how to create it, please refer to the introductory documentation

class Topic
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## 1. Single Table Grouping

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { tt2 = a.Title.Substring(0, 2), mod4 = a.Id % 4 })
    .Having(g => g.Count() > 0 && g.Avg(g.Key.mod4) > 0 && g.Max(g.Key.mod4) > 0)
    .Having(g => g.Count() < 300 || g.Avg(g.Key.mod4) < 100)
    .OrderBy(g => g.Key.tt2)
    .OrderByDescending(g => g.Count())
    .ToList(g => new
    {
        g.Key,
        cou1 = g.Count(),
        arg1 = g.Avg(g.Value.Clicks),
        arg2 = g.Sum(g.Value.Clicks > 100 ? 1 : 0)
    });
//SELECT
//substr(a.`Title`, 1, 2) as1,
//(a.`Id` % 4) as2,
//count(1) as3,
//avg(a.`Clicks`) as4,
//sum(case when a.`Clicks` > 100 then 1 else 0 end) as5
//FROM `Topic` a
//GROUP BY substr(a.`Title`, 1, 2), (a.`Id` % 4)
//HAVING (count(1) > 0 AND avg((a.`Id` % 4)) > 0 AND max((a.`Id` % 4)) > 0) AND (count(1) < 300 OR avg((a.`Id` % 4)) < 100)
//ORDER BY substr(a.`Title`, 1, 2), count(1) DESC
```

> To compute aggregate values without grouping, use ToAggregate instead of ToList

```csharp
var list = fsql.Select<Topic>()
    .ToAggregate(g => new
    {
        cou1 = g.Count(),
        arg1 = g.Avg(g.Key.Clicks),
        arg2 = g.Sum(g.Key.Clicks > 100 ? 1 : 0)
    });
```

## 2. Multi-Table Grouping

```csharp
var list = fsql.Select<Topic, Category, Area>()
    .InnerJoin((a, b, c) => b.Id == a.CategoryId)
    .InnerJoin((a, b, c) => c.Id == b.AreaId)
    .GroupBy((a, b, c) => new { a.Title, c.Name })
    .Having(g => g.Count() < 300 || g.Avg(g.Value.Item1.Clicks) < 100)
    .ToList(g => new { count = g.Count(), Name = g.Key.Name });
//SELECT count(1), c.name
//FROM topic a
//LEFT JOIN cagetory b ON b.id = a.category_id
//LEFT JOIN area c ON c.id = b.area_id
//GROUP BY a.title, c.name
//HAVING count(1) < 300 AND avg(a.clicks) < 100
```

- g.Value.Item1 corresponds to Topic
- g.Value.Item2 corresponds to Category
- g.Value.Item3 corresponds to Area

| Description | Method             | SQL                          |
| ----------- | ------------------ | ---------------------------- |
| Count       | .Count()           | select count(\*) from ...    |
| Sum         | .Sum(a => a.Score) | select sum([Score]) from ... |
| Average     | .Avg(a => a.Score) | select avg([Score]) from ... |
| Maximum     | .Max(a => a.Score) | select max([Score]) from ... |
| Minimum     | .Min(a => a.Score) | select min([Score]) from ... |

| lambda                                              | sql                                                | Description                       |
| --------------------------------------------------- | -------------------------------------------------- | --------------------------------- |
| SqlExt.IsNull(id, 0)                                | isnull/ifnull/coalesce/nvl                         | Compatible with various databases |
| SqlExt.DistinctCount(id)                            | count(distinct id)                                 |                                   |
| SqlExt.GreaterThan                                  | &gt;                                               | Greater than                      |
| SqlExt.GreaterThanOrEqual                           | &gt;=                                              | Greater than or equal to          |
| SqlExt.LessThan                                     | &lt;                                               | Less than                         |
| SqlExt.LessThanOrEqual                              | &lt;=                                              | Less than or equal to             |
| SqlExt.EqualIsNull                                  | IS NULL                                            | Is NULL                           |
| SqlExt.Case(dictionary)                             | case when .. end                                   | Case based on dictionary          |
| SqlExt.GroupConcat                                  | group_concat(distinct .. order by .. separator ..) | MySql                             |
| SqlExt.FindInSet                                    | find_in_set(str, strlist)                          | MySql                             |
| SqlExt.StringAgg                                    | string_agg(.., ..)                                 | PostgreSQL                        |
| SqlExt.Rank().Over().PartitionBy().ToValue()        | rank() over(partition by xx)                       | Window function                   |
| SqlExt.DenseRank().Over().PartitionBy().ToValue()   | dense_rank() over(partition by xx)                 |                                   |
| SqlExt.Count(id).Over().PartitionBy().ToValue()     | count(id) over(partition by xx)                    |                                   |
| SqlExt.Sum(id).Over().PartitionBy().ToValue()       | sum(id) over(partition by xx)                      |                                   |
| SqlExt.Avg(id).Over().PartitionBy().ToValue()       | avg(id) over(partition by xx)                      |                                   |
| SqlExt.Max(id).Over().PartitionBy().ToValue()       | max(id) over(partition by xx)                      |                                   |
| SqlExt.Min(id).Over().PartitionBy().ToValue()       | min(id) over(partition by xx)                      |                                   |
| SqlExt.RowNumber(id).Over().PartitionBy().ToValue() | row_number(id) over(partition by xx)               |                                   |

## 3. First Record in Group

```cs
fsql.Select<User1>()
    .Where(a => a.Id < 1000)
    .WithTempQuery(a => new
    {
        item = a,
        rownum = SqlExt.RowNumber().Over().PartitionBy(a.Nickname).OrderBy(a.Id).ToValue()
    })
    .Where(a => a.rownum == 1)
    .ToList();
```

> Tip: Supports multi-table nested queries, fsql.Select<User1, UserGroup1>()

```sql
SELECT *
FROM (
    SELECT a.[Id], a.[Nickname], row_number() over( partition by a.[Nickname] order by a.[Id]) [rownum]
    FROM [User1] a
    WHERE a.[Id] < 1000
) a
WHERE (a.[rownum] = 1)
```

If the database does not support window functions, you can use grouped nested queries to solve this:

```csharp
fsql.Select<User1>()
    .Where(a => a.Id < 1000)
    .GroupBy(a => a.Nickname)
    .WithTempQuery(g => new { min = g.Min(g.Value.Id) })
    .From<User1>()
    .InnerJoin((a, b) => a.min == b.Id)
    .ToList((a, b) => b);
```

```sql
SELECT b.[Id], b.[Nickname]
FROM (
    SELECT min(a.[Id]) [min]
    FROM [User1] a
    WHERE a.[Id] < 1000
    GROUP BY a.[Nickname] ) a
INNER JOIN [User1] b ON a.[min] = b.[Id]
```

> See more in the [《Nested Queries》](withtempquery.md) documentation

## 4. Aggregate

### Distinct

```csharp
var list = fsql.Select<Topic>()
    .Aggregate(a => Convert.ToInt32("count(distinct title)"), out var count)
    .ToList();
```

> SELECT count(distinct title) as1
> FROM "Topic" a

> SELECT a."Id", a."Clicks", a."Title", a."CreateTime"
> FROM "Topic" a

### SqlExt.DistinctCount

```csharp
fsql.Select<Topic>()
    .Aggregate(a => SqlExt.DistinctCount(a.Key.Title), out var count);
```

> SELECT count(distinct a."title") as1 FROM "Topic" a

### ToAggregate + SqlExt.DistinctCount

```csharp
var distinctAggregate = fsql.Select<Topic>().ToAggregate(a => new
    {
        TitleCount = SqlExt.DistinctCount(a.Key.Title),
        ClicksCount= SqlExt.DistinctCount(a.Key.Clicks),
    }
);
```

> SELECT count(distinct a."Title") as1, count(distinct a."Clicks") as2
> FROM "Topic" a

## 5. Navigation Property Grouping

If the `Topic` class has a navigation property `Category`, and `Category` has a navigation property `Area`, the code for grouping by navigation properties is as follows:

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(g => new { g.Key.Category.Area.Name });
```

Note: The above code will throw an error because `a.Key.Category.Area.Name` cannot be resolved. To fix this, use Include:

```csharp
var list = fsql.Select<Topic>()
    .Include(a => a.Category.Area)
    // This line must be added, otherwise it will only group by Category without including its subordinate navigation property Area

    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(g => new { g.Key.Category.Area.Name });
```

Alternatively, you can solve it this way:

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category, a.Category.Area })
    .ToList(g => new { g.Key.Area.Name });
```

## API

| Method           | Return Type | Parameters    | Description                                                                                                                                                                                                   |
| ---------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| ToSql            | string      |               | Returns the SQL query that will be executed                                                                                                                                                                   |
| ToList\<T\>      | List\<T\>   | Lambda        | Executes the SQL query and returns a list of records for the specified fields; if no records exist, returns a list with Count 0                                                                               |
| ToList\<T\>      | List\<T\>   | string field  | Executes the SQL query and returns a list of records for the field specified by `field`, which can be received as a tuple or basic type (int, string, long); if no records exist, returns a list with Count 0 |
| ToAggregate\<T\> | List\<T\>   | Lambda        | Executes the SQL query and returns aggregated results for the specified fields (suitable for cases where GroupBy is not needed)                                                                               |
| Sum              | T           | Lambda        | Specifies a column to calculate the sum                                                                                                                                                                       |
| Min              | T           | Lambda        | Specifies a column to calculate the minimum value                                                                                                                                                             |
| Max              | T           | Lambda        | Specifies a column to calculate the maximum value                                                                                                                                                             |
| Avg              | T           | Lambda        | Specifies a column to calculate the average value                                                                                                                                                             |
| **Group**        |
| GroupBy          | \<this\>    | Lambda        | Groups by selected columns, e.g., GroupBy(a => a.Name)                                                                                                                                                        | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy          | \<this\>    | string, parms | Groups by native SQL syntax, e.g., GroupBy("concat(name, @cc)", new { cc = 1 })                                                                                                                               |
| Having           | \<this\>    | string, parms | Filters aggregated conditions by native SQL syntax, e.g., Having("count(name) = @cc", new { cc = 1 })                                                                                                         |
| **Members**      |
| Key              |             |               | Returns the object selected by GroupBy                                                                                                                                                                        |
| Value            |             |               | Returns the field selector for the main table or From\<T2,T3....\>                                                                                                                                            |
