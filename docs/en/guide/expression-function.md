# Expression Functions

This is one of FreeSql's very special features, so don't miss the details in the documentation. Types that can be mapped can basically use corresponding expression functions, such as date, string, `IN` queries, arrays (PostgreSQL arrays), dictionaries (PostgreSQL HStore), etc.

SqlExt.xxx provides commonly used custom functions by default in FreeSql. For details, see [Window Functions](#window-functions).

## Lambda Concatenation

- Single Table

```csharp
Expression<Func<T, bool>> where = null;
where = where.And(b => b.num > 0);
where = where.Or(b => b.num > 0);
fsql.Select<T>().Where(where)
```
- Multiple Tables

```csharp
Expression<Func<HzyTuple<T1, T2, T3, T4, T5, T6>, bool>> where = null;
where = where.Or(a => a.t6.Id > 0);
fsql.Select<T1, T2, T3, T4, T5, T6>().Where(where)
```

## IN Query

```csharp
var t1 = fsql.Select<T>()
  .Where(a => new[] { 1, 2, 3 }.Contains(a.Id))
  .ToList();
//SELECT .. FROM ..
//WHERE (a.`Id` in (1,2,3))
```

> Optimized to prevent SQL errors when too many elements are in the `where in` clause, such as:
>
> [Err] ORA-01795: maximum number of expressions in a list is 1000
>
> Originally: where id in (1..1333)
>
> Now: where id in (1..500) or id in (501..1000) or id in (1001..1333)

## IN Multi-Column Query

```csharp
// Tuple Collection
var lst = new List<(Guid, DateTime)>();
lst.Add((Guid.NewGuid(), DateTime.Now));
lst.Add((Guid.NewGuid(), DateTime.Now));

var t2 = fsql.Select<T>()
  .Where(a => lst.Contains(a.Id, a.ct1))
  .ToList();
//SELECT .. FROM ..
//WHERE (a."Id" = '685ee1f6-bdf6-4719-a291-c709b8a1378f' AND a."ct1" = '2019-12-07 23:55:27' OR 
//a."Id" = '5ecd838a-06a0-4c81-be43-1e77633b7404' AND a."ct1" = '2019-12-07 23:55:27')
```

> v3.2.650 uses .Where(a => list.Any(b => b.Item1 == a.Id && b.Item2 == a.ct1))
>
> WHERE (id, code) in ((1,'code1'), (2,'code2')) Implementation code: [Multi-Column IN Query, Custom Expression Implementation](../extra/issues-in-valuetype.md)

## IN Subquery

```csharp
fsql.Select<Topic>()
  .Where(a => fsql.Select<Topic>().As("b").ToList(b => b.Id).Contains(a.Id))
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//WHERE (((a.`Id`) in (SELECT b.`Id`
//    FROM `Topic` b)))
```

## EXISTS Subquery

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

> Tip: Since the subquery entity class is the same as the upper level, use As("b") to specify the alias for differentiation

## Find Data Created Today

```csharp
fsql.Select<T>()
  .Where(a => a.CreateTime.Date == DateTime.Today)
  .ToList();
//This line of code demonstrates the powerful expression parsing of FreeSql, not all ORMs support this

fsql.Select<T>()
  .Where(a => a.CreateTime.Between(DateTime.Today, DateTime.Today.AddDays(1)))
  .ToList();
//Normal usage should be like this
```

> SqlServer nvarchar/varchar is compatible with expression parsing, and is parsed as: N'' and '', optimizing the index execution plan;

## Date Formatting

```csharp
fsql.Select<T>()
  .First(a => a.CreateTime.ToString("HH:mm:ss"));
// SELECT date_format(a.`CreateTime`, '%H:%i:%s') as1 
// FROM `xxx` a 
// limit 0,1
```

> v1.5.0 supports common C# date formats: yyyy MM dd HH mm ss yy M d H hh h m s tt t

> tt t stands for AM PM

## Window Functions

```csharp
fsql.Select<T1, T2>()
  .InnerJoin((a, b) => b.Id == a.Id)
  .ToList((a, b) => new
  {
    Id = a.Id,
    EdiId = b.Id,
    over1 = SqlExt.Rank().Over().OrderBy(a.Id).OrderByDescending(b.EdiId).ToValue()
  });
```

> v1.6.0 adds support for [custom parsing](#custom-parsing) features, including SqlExt.Rank().Over().PartitionBy(...), MySql group_concat functions. PR contributions are welcome.

FreeSql integrates SqlExt.cs extension parsing methods by default:

| lambda | sql | Description |
| -- | -- | -- |
| SqlExt.IsNull(id, 0) | isnull/ifnull/coalesce/nvl | Compatible with major databases |
| SqlExt.DistinctCount(id) | count(distinct id) | |
| SqlExt.GreaterThan | &gt; | Greater than |
| SqlExt.GreaterThanOrEqual | &gt;= | Greater than or equal to |
| SqlExt.LessThan | &lt; | Less than |
| SqlExt.LessThanOrEqual | &lt;= | Less than or equal to |
| SqlExt.EqualIsNull | IS NULL | Is NULL |
| SqlExt.Case(Dictionary) | case when .. end | Case based on dictionary |
| SqlExt.GroupConcat | group_concat(distinct .. order by .. separator ..) | MySql |
| SqlExt.FindInSet | find_in_set(str, strlist) | MySql |
| SqlExt.StringAgg | string_agg(.., ..) | PostgreSQL |
| SqlExt.Rank().Over().PartitionBy().ToValue() | rank() over(partition by xx) | Window function |
| SqlExt.DenseRank().Over().PartitionBy().ToValue() | dense_rank() over(partition by xx) | |
| SqlExt.Count(id).Over().PartitionBy().ToValue() | count(id) over(partition by xx) | |
| SqlExt.Sum(id).Over().PartitionBy().ToValue() | sum(id) over(partition by xx) | |
| SqlExt.Avg(id).Over().PartitionBy().ToValue() | avg(id) over(partition by xx) | |
| SqlExt.Max(id).Over().PartitionBy().ToValue() | max(id) over(partition by xx) | |
| SqlExt.Min(id).Over().PartitionBy().ToValue() | min(id) over(partition by xx) | |
| SqlExt.RowNumber(id).Over().PartitionBy().ToValue() | row_number(id) over(partition by xx) | |

> The above functionalities are implemented using the [custom parsing](#custom-parsing) feature

## Subquery Join

> v1.8.0+ uses string.Join + ToList to concatenate multiple rows of subquery results into a single string, such as "1,2,3,4"

```csharp
fsql.Select<Topic>().ToList(a => new {
  id = a.Id,
  concat = string.Join(",", fsql.Select<StringJoin01>().ToList(b => b.Id))
});
//SELECT a.`Id`, (SELECT group_concat(b.`Id` separator ',') 
//    FROM `StringJoin01` b) 
//FROM `Topic` a
```

> Tip: Subquery string.Join + ToList adapts to sqlserver/pgsql/oracle/mysql/sqlite/firebird/DuckDB/达梦/金仓/南大/翰高 [#405](https://github.com/dotnetcore/FreeSql/issues/405)

## Subtable First/Count/Sum/Max/Min/Avg

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

## Subtable ToList

> Versions 3.2.650+ execute at most 3 SQL queries

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

## Custom Parsing

```csharp
[ExpressionCall]
public static class DbFunc {
  // Required definition static + ThreadLocal
  static ThreadLocal<ExpressionCallContext> context = new ThreadLocal<ExpressionCallContext>();

  public static DateTime FormatDateTime(this DateTime that, string arg1)
  {
    var up = context.Value;
    if (up.DataType == FreeSql.DataType.Sqlite) // Rewrite content
      up.Result = $"date_format({up.ParsedContent["that"]}, {up.ParsedContent["arg1"]})";
    return that;
  }
}

var sql1 = fsql.Select<SysModule>()
  .ToSql(a => a.CreateTime.FormatDateTime("yyyy-MM-dd"));
//SELECT date_format(a."CreateTime", 'yyyy-MM-dd') as1 
//FROM "SysModule" a
```

The `[ExpressionCall]` attribute can be marked on static extension classes as well as on individual static methods.

| ExpressionCallContext Property | Type                         | Description                             |
| ------------------------------ | ---------------------------- | --------------------------------------- |
| DataType                       | FreeSql.DataType             | Used to implement different database adaptation conditions |
| ParsedContent                  | Dictionary\<string, string\> | Parsing results of function parameters  |
| DbParameter                    | DbParameter                  | The parameterized object for `that` (may be null) |
| UserParameters                 | List\<DbParameter\>          | Additional parameterized objects        |
| Result                         | string                       | The SQL string representing the expression function |

> When the return value of the extension method is `string`, its return value can also be used as `context.Value.Result`.

> To skip parsing specific parameters, use the `[RawValue]` attribute.

## DbParameter

By default, parameters parsed from `Where(lambda)` are treated as plain text (to prevent SQL injection). If the execution plan of the database is particularly stringent, you can enable lambda parameterization functionality.

```csharp
var fsql = new FreeSqlBuilder() // Be sure to define it as a Singleton
  .UseGenerateCommandParameterWithLambda(true)
  ...

var id = 1;
fsql.Select<Song>().Where(a => a.Id == id).ToList();
//SELECT .. FROM `Song` a WHERE `Id` = @exp_0
```

The generated parameter objects' `DbType`, `Size`, `Precision`, and `Scale` values are set to default optimizations, consistent with the entity property definitions.

**Special Operation:**

> If you don't want the `string` parameter's `Size` to match the entity property, you can use custom expression function functionality, as shown below:

```csharp
var name = "testname";
fsql.Select<TestMySqlStringIsNullable>()
  .Where(a => a.varchar == name).ToList();

fsql.Select<TestMySqlStringIsNullable>()
  .Where(a => a.varchar == name.SetDbParameter(10)).ToList();

public class TestMySqlStringIsNullable {
  public Guid id { get; set; }

  [Column(DbType = "varchar(100)")]
  public string varchar { get; set; }
}

[ExpressionCall]
public static class DbFunc {
  static ThreadLocal<ExpressionCallContext> context = new ThreadLocal<ExpressionCallContext>();

  public static string SetDbParameter(this string that, int size)
  {
    if (context.Value.DbParameter != null)
      context.Value.DbParameter.Size = size;
    return context.Value.ParsedContent["that"];
  }
}
```

In the first statement, the parameter object's `Size` is 100, while in the second, it is 10:

![image](https://user-images.githubusercontent.com/16286519/69433211-2c5fcf80-0d76-11ea-8eec-963eb37199c5.png)
