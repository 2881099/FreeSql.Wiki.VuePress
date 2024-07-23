# 分组聚合

```csharp
IFreeSql fsql; //如何创建请移步入门文档

class Topic 
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## 1、单表分组

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

> 不分组求聚合值，请使用 ToAggregate 替代 ToList

```csharp
var list = fsql.Select<Topic>()
    .ToAggregate(g => new 
    {
        cou1 = g.Count(), 
        arg1 = g.Avg(g.Key.Clicks), 
        arg2 = g.Sum(g.Key.Clicks > 100 ? 1 : 0)
    });
```

## 2、多表分组

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

- g.Value.Item1 对应 Topic
- g.Value.Item2 对应 Category
- g.Value.Item3 对应 Area

| 说明 | 方法 | SQL |
| --- | --- | --- |
| 总数 | .Count() | select count(*) from ... |
| 求和 | .Sum(a => a.Score) | select sum([Score]) from ... |
| 平均 | .Avg(a => a.Score) | select avg([Score]) from ... |
| 最大值 | .Max(a => a.Score) | select max([Score]) from ... |
| 最小值 | .Min(a => a.Score) | select min([Score]) from ... |

| lambda | sql | 说明 |
| -- | -- | -- |
| SqlExt.IsNull(id, 0) | isnull/ifnull/coalesce/nvl | 兼容各大数据库 |
| SqlExt.DistinctCount(id) | count(distinct id) | |
| SqlExt.GreaterThan | &gt; | 大于 |
| SqlExt.GreaterThanOrEqual | &gt;= | 大于或等于 |
| SqlExt.LessThan | &lt; | 小于 |
| SqlExt.LessThanOrEqual | &lt;= | 小于 |
| SqlExt.EqualIsNull | IS NULL | 是否为 NULL |
| SqlExt.Case(字典) | case when .. end | 根据字典 case |
| SqlExt.GroupConcat | group_concat(distinct .. order by .. separator ..) | MySql |
| SqlExt.FindInSet | find_in_set(str, strlist) | MySql |
| SqlExt.StringAgg | string_agg(.., ..) | PostgreSQL |
| SqlExt.Rank().Over().PartitionBy().ToValue() | rank() over(partition by xx) | 开窗函数 |
| SqlExt.DenseRank().Over().PartitionBy().ToValue() | dense_rank() over(partition by xx) | |
| SqlExt.Count(id).Over().PartitionBy().ToValue() | count(id) over(partition by xx) | |
| SqlExt.Sum(id).Over().PartitionBy().ToValue() | sum(id) over(partition by xx) | |
| SqlExt.Avg(id).Over().PartitionBy().ToValue() | avg(id) over(partition by xx) | |
| SqlExt.Max(id).Over().PartitionBy().ToValue() | max(id) over(partition by xx) | |
| SqlExt.Min(id).Over().PartitionBy().ToValue() | min(id) over(partition by xx) | |
| SqlExt.RowNumber(id).Over().PartitionBy().ToValue() | row_number(id) over(partition by xx) | |

## 3、分组第一条记录

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

> 提示：支持多表嵌套查询，fsql.Select\<User1, UserGroup1\>()

```sql
SELECT *
FROM (
    SELECT a.[Id], a.[Nickname], row_number() over( partition by a.[Nickname] order by a.[Id]) [rownum]
    FROM [User1] a
    WHERE a.[Id] < 1000
) a
WHERE (a.[rownum] = 1)
```

如果数据库不支持开窗函数，可以使用分组嵌套查询解决：

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

> 查看更多[《嵌套查询》](withtempquery.md)文档

## 4、Aggregate

### Distinct

```csharp
var list = fsql.Select<Topic>()
    .Aggregate(a => Convert.ToInt32("count(distinct title)"), out var count)
    .ToList();
```
> SELECT count(distinct title) as1 
FROM "Topic" a

> SELECT a."Id", a."Clicks", a."Title", a."CreateTime" 
FROM "Topic" a

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
FROM "Topic" a

## 5、导航属性分组

假如 Topic 有导航属性 Category，Category 又有导航属性 Area，导航属性分组代码如下：

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(g => new { g.Key.Category.Area.Name });
```

注意：如上这样编写，会报错无法解析 a.Key.Category.Area.Name，解决办法使用 Include：

```csharp
var list = fsql.Select<Topic>()
    .Include(a => a.Category.Area)
    //必须添加此行，否则只分组 Category 而不包含它的下级导航属性 Area

    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(g => new { g.Key.Category.Area.Name });
```

但是，你还可以这样解决：

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category, a.Category.Area })
    .ToList(g => new { g.Key.Area.Name });
```

## API

| 方法 | 返回值 | 参数 | 描述 |
| ------------- | - | - | - |
| ToSql            | string    |               | 返回即将执行的 SQL 语句                                                                                               |
| ToList\<T\>      | List\<T\> | Lambda        | 执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表                                                 |
| ToList\<T\>      | List\<T\> | string field  | 执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表 |
| ToAggregate\<T\> | List\<T\> | Lambda        | 执行 SQL 查询，返回指定字段的聚合结果（适合不需要 GroupBy 的场景）                                                    |
| Sum              | T         | Lambda        | 指定一个列求和                                                                                                        |
| Min              | T         | Lambda        | 指定一个列求最小值                                                                                                    |
| Max              | T         | Lambda        | 指定一个列求最大值                                                                                                    |
| Avg              | T         | Lambda        | 指定一个列求平均值                                                                                                    |
| 【分组】 |
| GroupBy | \<this\> | Lambda | 按选择的列分组，GroupBy(a => a.Name) | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy | \<this\> | string, parms | 按原生sql语法分组，GroupBy("concat(name, @cc)", new { cc = 1 }) |
| Having | \<this\> | string, parms | 按原生sql语法聚合条件过滤，Having("count(name) = @cc", new { cc = 1 }) |
| 【成员】 |
| Key              |           |               | 返回 GroupBy 选择的对象                                                                                               |
| Value            |           |               | 返回主表 或 From\<T2,T3....\> 的字段选择器                                                                            |
