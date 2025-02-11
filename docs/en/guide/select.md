# Select

FreeSql has invested heavily in querying data, offering features like fluent style, multi-table queries, expression functions, and strong support for navigation properties.

|                                                        |                                                    |                                                      |
| ------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| [《Paging Queries》](paging.md)                        | [《Repository Layer》](repository.md)              | [《Read-Write Separation》](read-write-splitting.md) |
| [《Single Table Queries》](select-single-table.md)     | [《Filters》](filters.md)                          |                                                      |
| [《Multi-Table Queries》](select-multi-table.md)       | [《Lazy Loading》](select-lazy-loading.md)         | [《Performance》](performance.md)                    |
| [《Nested Queries》](withtempquery.md)                 | [《Eager Loading》](select-include.md)             | [《Sharding》](sharding.md)                          |
| [《Group By Aggregation Queries》](select-group-by.md) | [《Expression Functions》](expression-function.md) | [《Multi-Tenancy》](multi-tenancy.md)                |
| [《Return Data》](select-return-data.md)               |                                                    |                                                      |

## Expression Functions

| Description     | Lambda Expression                                              | SQL                                          |
| --------------- | -------------------------------------------------------------- | -------------------------------------------- |
| in              | Where(a => new [] { 1,2,3 }.Contains(a.Id))                    | [Id] in (1,2,3)                              |
| not in          | Where(a => !new [] { 1,2,3 }.Contains(a.Id))                   | [Id] not in (1,2,3)                          |
| Multi-column in | Where(a => list.Any(b => b.Item1 == a.Id && b.Item2 == a.ct1)) | ([Id]=1 and [ct1]=1) or ([Id]=2 and [ct1]=2) |
| like '%xxx%'    | Where(a => a.Title.Contains("xxx"))                            | [Title] like '%xxx%'                         |
| like 'xxx%'     | Where(a => a.Title.StartsWith("xxx"))                          | [Title] like 'xxx%'                          |
| like '%xxx'     | Where(a => a.Title.EndsWith("xxx"))                            | [Title] like '%xxx'                          |
| Date range      | Where(a => a.Time.Between(time1, time2))                       | [Time] between @time1 and @time2             |
| Exists          | .Any()                                                         | select 1 from ...                            |
| Count           | .Count()                                                       | select count(\*) from ...                    |
| Sum             | .Sum(a => a.Score)                                             | select sum([Score]) from ...                 |
| Average         | .Avg(a => a.Score)                                             | select avg([Score]) from ...                 |
| Maximum         | .Max(a => a.Score)                                             | select max([Score]) from ...                 |
| Minimum         | .Min(a => a.Score)                                             | select min([Score]) from ...                 |

For more details, see [《Expression Functions》](expression-function.md)

## SqlServer WithLock/WithIndex

```csharp
var list = fsql.Select<Region>()
    .WithLock()
    .Limit(1).ToList();
//SELECT TOP 1 ... FROM [Region] a With(NoLock)

var list = fsql.Select<Region>()
    .WithLock(SqlServerLock.NoLock | SqlServerLock.NoWait)
    .Limit(1).ToList();
//SELECT TOP 1 ... FROM [Region] a With(NoLock, NoWait)

var list = fsql.Select<Region>()
    .WithLock()
    .WithIndex("idx_01")
    .Limit(1).ToList();
//SELECT TOP 1 ... FROM [Region] a With(index=idx_01, NoLock)
```

Multi-table:

```csharp
var list = Select<Region, T2>()
    .InnerJoin((a, b) => a.x == b.xx)
    .WithLock(SqlServerLock.NoLock, new Dictionary<Type, bool>
    {
        [typeof(T2)] = false
    })
    .WithIndex("idx_01", new Dictionary<Type, string>
    {
        [typeof(T2)] = "idx_02"
    })
    .Limit(1).ToList();
//SELECT TOP 1 ..
//FROM [Region] a With(index=idx_01, NoLock)
//INNER JOIN [T2] b With(index=idx_02) ON a.[x] = b.[xx]
```

Global NoLock Setting:

```csharp
//Applies to all entity classes
fsql.SetGlobalSelectWithLock(SqlServerLock.NoLock, null);

//【Specific】entity classes
fsql.SetGlobalSelectWithLock(SqlServerLock.NoLock, new Dictionary<Type, bool>
{
    [typeof(Region)] = true,
    [typeof(T2)] = true
});
```

## Dynamic Filtering WhereDynamicFilter

[《Efficient Understanding of FreeSql WhereDynamicFilter and Insights into Its Design》](https://www.cnblogs.com/FreeSql/p/16485310.html)

The ISelect.WhereDynamicFilter method implements dynamic filtering conditions (interacting with the frontend), supporting the following operators:

- Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith: Contains/Does not contain, like '%xx%', or like 'xx%', or like '%xx'
- Equal/NotEqual: Equals/Not equals
- GreaterThan/GreaterThanOrEqual: Greater than/Greater than or equal
- LessThan/LessThanOrEqual: Less than/Less than or equal
- Range: Range query
- DateRange: Date range, with special handling value[1] + 1
- Any/NotAny: Whether it matches any item in value (essentially SQL IN)
- Custom: [Custom parsing](https://github.com/dotnetcore/FreeSql/discussions/1550)

```csharp
DynamicFilterInfo dyfilter = JsonConvert.DeserializeObject<DynamicFilterInfo>(@"
{
  ""Logic"": ""And"",
  ""Filters"":
  [
    { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 1 },
    {
      ""Logic"": ""Or"",
      ""Filters"":
      [
        { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 2 },
        { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 3 }
      ]
    }
  ]
}");
fsql.Select<Region>().WhereDynamicFilter(dyfilter).ToList();
//WHERE id = 1 AND (id = 2 OR id = 3)
```

> Dynamic Table Names: ISelect.AsTable((t, old) => $"{old}\_201903")

> Dynamic Sorting: ISelect.OrderByPropertyName("Parent.Code")

> Dynamic Returns: ISelect.ToDataTableByPropertyName(new string[] { "Parent.Code", "Id" })

> Dynamic Eager Loading: ISelect.IncludeByPropertyName("Parent.Parent").IncludeByPropertyName("Parent.Childs")

## Clone Queries ISelect

For your information: C# 7.0 supports local functions, which allows defining temporary methods within a method. This feature is highly recommended as it is very effective in many scenarios.

When a method is defined inside another method, it is called: local function/nested method.

```csharp
public void Test()
{
    ISelect<AdmRoute> getSelect() => fsql.Select<AdmRoute>().Include(a => a.Parent)
        .WhereIf(!string.IsNullOrEmpty(key), a => a.Name.Contains(key) || ...)
        .WhereIf(Parent_Id?.Any() == true, a => Parent_Id.Contains(a.ParentId))
        .WhereIf(mn_Roles_Id?.Any() == true, a => a.Roles.Any(b => mn_Roles_Id.Contains(b.Id)));

    var select1 = getSelect();
    var select2 = getSelect();
    select1.Where(a => a.Status == 0);
    // At this point, select2 will not have the a.Status == 0 condition
}
```

## API

| Method              | Return Type       | Parameters                                                    | Description                                                                                                                                                                                                                                            |                                  |
| ------------------- | ----------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| ToSql               | string            |                                                               | Returns the SQL statement to be executed                                                                                                                                                                                                               |
| ToList              | List\<T1\>        |                                                               | Executes SQL query and returns records of all fields of the T1 entity; if navigation properties exist, they are also queried and returned. If no records exist, returns a list with Count 0.                                                           |
| ToList\<T\>         | List\<T\>         | Lambda                                                        | Executes SQL query and returns records of specified fields; if no records exist, returns a list with Count 0.                                                                                                                                          |
| ToList\<T\>         | List\<T\>         | string field                                                  | Executes SQL query and returns records of the field specified, and can be received as a tuple or basic types (int, string, long); if no records exist, returns a list with Count 0.                                                                    |
| ToOne               | T1                |                                                               | Executes SQL query and returns the first record of all fields of the T1 entity; if no record exists, returns null.                                                                                                                                     |
| ToAggregate\<T\>    | List\<T\>         | Lambda                                                        | Executes SQL query and returns aggregate results of specified fields (suitable for scenarios where GroupBy is not required).                                                                                                                           |
| Any                 | bool              |                                                               | Executes SQL query to check if there are any records.                                                                                                                                                                                                  |
| Sum                 | T                 | Lambda                                                        | Computes the sum of a specified column.                                                                                                                                                                                                                |
| Min                 | T                 | Lambda                                                        | Computes the minimum value of a specified column.                                                                                                                                                                                                      |
| Max                 | T                 | Lambda                                                        | Computes the maximum                                                                                                                                                                                                                                   |
| Max                 | T                 | Lambda                                                        | Specifies the maximum value of a column                                                                                                                                                                                                                |
| Avg                 | T                 | Lambda                                                        | Specifies the average value of a column                                                                                                                                                                                                                |
| 【Pagination】      |
| Count               | long              |                                                               | The number of records in the query                                                                                                                                                                                                                     |
| Count               | \<this\>          | out long                                                      | The number of records in the query, returned as an out parameter                                                                                                                                                                                       |
| Skip                | \<this\>          | int offset                                                    | Offset the number of rows in the query                                                                                                                                                                                                                 |
| Offset              | \<this\>          | int offset                                                    | Offset the number of rows in the query                                                                                                                                                                                                                 |
| Limit               | \<this\>          | int limit                                                     | Specify the number of data records to query                                                                                                                                                                                                            |
| Take                | \<this\>          | int limit                                                     | Specify the number of data records to query                                                                                                                                                                                                            |
| Page                | \<this\>          | int pageIndex, int pageSize                                   | Pagination                                                                                                                                                                                                                                             |
| 【Condition】       |
| Where               | \<this\>          | Lambda                                                        | Supports multi-table query expressions; using multiple times is equivalent to AND                                                                                                                                                                      |
| WhereIf             | \<this\>          | bool, Lambda                                                  | Supports multi-table query expressions                                                                                                                                                                                                                 |
| Where               | \<this\>          | string, parms                                                 | Native SQL syntax condition, Where("id = @id", new { id = 1 } ,[Note the prefix @, according to the specific database](ado.md#parameter) not explained elsewhere. Same applies)                                                                        |
| WhereIf             | \<this\>          | bool, string, parms                                           | Native SQL syntax condition, WhereIf(true, "id = @id", new { id = 1 }                                                                                                                                                                                  |
| WhereCascade        | \<this\>          | Lambda                                                        | Add conditions to each table in multi-table queries                                                                                                                                                                                                    |
| WhereDynamicFilter  | \<this\>          | DynamicFilterInfo                                             | Dynamic filtering conditions (interaction with the frontend)                                                                                                                                                                                           |
| 【GroupBy】         |
| GroupBy             | \<this\>          | Lambda                                                        | Group by selected columns, GroupBy(a => a.Name)                                                                                                                                                                                                        | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy             | \<this\>          | string, parms                                                 | Group by native SQL syntax, GroupBy("concat(name, @cc)", new { cc = 1 })                                                                                                                                                                               |
| Having              | \<this\>          | string, parms                                                 | Filter aggregation conditions by native SQL syntax, Having("count(name) = @cc", new { cc = 1 })                                                                                                                                                        |
| Disdinct            | \<this\>          |                                                               | .Distinct().ToList(x => x.GroupName) is for a specific field                                                                                                                                                                                           |
| 【Sort】            |
| OrderBy             | \<this\>          | Lambda                                                        | Sort by column, OrderBy(a => a.Time), can be used multiple times                                                                                                                                                                                       |
| OrderByDescending   | \<this\>          | Lambda                                                        | Sort by column in descending order, OrderByDescending(a => a.Time)                                                                                                                                                                                     |
| OrderBy             | \<this\>          | string, parms                                                 | Sort by native SQL syntax, OrderBy("count(name) + @cc", new { cc = 1 })                                                                                                                                                                                |
| OrderByPropertyName | string, bool      | Sort by property name string (supports navigation properties) |
| 【Multi-tables】    |
| LeftJoin            | \<this\>          | Lambda                                                        | Left join query, supports navigation properties or specifying associated entity types                                                                                                                                                                  |
| InnerJoin           | \<this\>          | Lambda                                                        | Inner join query, supports navigation properties or specifying associated entity types                                                                                                                                                                 |
| RightJoin           | \<this\>          | Lambda                                                        | Right join query, supports navigation properties or specifying associated entity types                                                                                                                                                                 |
| LeftJoin            | \<this\>          | string, parms                                                 | Left join query using native SQL syntax, LeftJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })                                                                                                                                  |
| InnerJoin           | \<this\>          | string, parms                                                 | Inner join query using native SQL syntax, InnerJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })                                                                                                                                |
| RightJoin           | \<this\>          | string, parms                                                 | Right join query using native SQL syntax, RightJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })                                                                                                                                |
| From                | \<this\>          | Lambda                                                        | Multi-table queries, very convenient for more than 3 tables; currently supports up to 10 tables                                                                                                                                                        |
| FromQuery           | ISelect\<T1, T2\> | ISelect\<T2\>                                                 | Single table into double table query                                                                                                                                                                                                                   |
| WithTempQuery       | ISelect\<T1\>     | Lambda                                                        | Nest single or multiple table queries into a single table query                                                                                                                                                                                        |
| WithMemory          | ISelect\<T1\>     | List\<T1\>                                                    | Query using in-memory data                                                                                                                                                                                                                             |
| UnionAll            | ISelect\<T1\>     | ISelect\<T1\>[]                                               | Union query                                                                                                                                                                                                                                            |
| 【Other】           |
| As                  | \<this\>          | string alias = "a"                                            | Specify alias                                                                                                                                                                                                                                          |
| Master              | \<this\>          |                                                               | Specify querying from the master database (default is querying from the slave database)                                                                                                                                                                |
| CommandTimeout      | \<this\>          | int                                                           | Command timeout setting (seconds)                                                                                                                                                                                                                      |
| WithTransaction     | \<this\>          | DbTransaction                                                 | Set transaction object                                                                                                                                                                                                                                 |
| WithConnection      | \<this\>          | DbConnection                                                  | Set connection object                                                                                                                                                                                                                                  |
| WithLock            | \<this\>          | Enum                                                          | Special settings like SqlServer NoLock                                                                                                                                                                                                                 |
| ForUpdate           | \<this\>          | bool                                                          | Exclusive update lock, adapted for different databases, detailed explanation in comments                                                                                                                                                               |
| AsQueryable         | IQueryable        |                                                               | Convert ISelect to IQueryable, mainly used for extension, e.g., abp IRepository GetAll() interface method needs to return IQueryable object. Note: IQueryable methods are more likely to cause pollution, so avoid this conversion as much as possible |
| ToTreeList()        | List\<TEntity\>   | None                                                          | Return hierarchical data in the form of a TreeList                                                                                                                                                                                                     |
| AsTreeCte()         | ISelect           | (up, pathSelector, level)                                     | Recursive query of hierarchical tables                                                                                                                                                                                                                 |
