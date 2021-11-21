# Query Data

FreeSql has made great efforts in querying data, especially the functions such as chain query syntax, multi-table query, expression function, etc.

- [《Paging Query》](Pagination)
- [《Query from Single Table》](Query-from-Single-Table)
- [《Query from Multi Tables》](Query-from-Multi-Table)
- [《Grouped Aggregate Query》](Grouped-Aggregate-Query)
- [《Return Data》](Return-Data)
- [《LinqToSql》](Linq-to-Sql)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
- [《Using Read/Write Separation》](Using-Read-Write-Separation)
- [《Performance》](Performance)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Tenant》](Tenant)

## Special introduction to WhereDynamicFilter

The `ISelect.WhereDynamicFilter` method implements dynamic filter conditions (interacting with the front-end), supported operators:

- Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith: include/not include, `like'%xx%'`, or `like'xx%'`, or `like'%xx'`
- Equal/NotEqual
- GreaterThan/GreaterThanOrEqual
- LessThan/LessThanOrEqual
- Range: Range query
- DateRange: date range, with special processing value\[1\] + 1
- Any/NotAny: Does it match any item in `value` (to put it bluntly, `SQL IN`)

```csharp
DynamicFilterInfo dyfilter = JsonConvert.DeserializeObject<DynamicFilterInfo>(@"
{
  ""Logic"" : ""Or"",
  ""Filters"" :
  [
    {
      ""Field"" : ""Code"", ""Operator"" : ""NotContains"", ""Value"" : ""val1"", 
      ""Filters"" : [{ ""Field"" : ""Name"", ""Operator"" : ""NotStartsWith"", ""Value"" : ""val2"" }]
    },
    {
      ""Field"" : ""Parent.Code"", ""Operator"" : ""Equals"", ""Value"" : ""val11"",
      ""Filters"" : [{ ""Field"" : ""Parent.Name"", ""Operator"" : ""Contains"", ""Value"" : ""val22"" }]
    }
  ]
}");
fsql.Select<VM_District_Parent>().WhereDynamicFilter(dyfilter).ToList();

//SELECT a.""Code"", a.""Name"", a.""ParentCode"", a__Parent.""Code"" as4, a__Parent.""Name"" as5, a__Parent.""ParentCode"" as6 
//FROM ""D_District"" a 
//LEFT JOIN ""D_District"" a__Parent ON a__Parent.""Code"" = a.""ParentCode"" 
//WHERE (not((a.""Code"") LIKE '%val1%') AND not((a.""Name"") LIKE 'val2%') OR a__Parent.""Code"" = 'val11' AND (a__Parent.""Name"") LIKE '%val22%')
```

> Dynamic sorting: `ISelect.OrderByPropertyName("Parent.Code")`

## API

| Methods| Return | Parameters | Description |
| ------------- | - | - | - |
| ToSql | string | | Return the SQL statement to be executed |
| ToList | List\<T1\> | | Execute SQL query and return the records of all fields of the `T1` entity. If there are navigation properties, they will be queried and returned together. If the record does not exist, it will return a list with `Count` being `0` |
| ToList\<T\> | List\<T\> | Lambda | Execute SQL query, return the record of the specified field, if the record does not exist, return the list with `Count` as `0` |
| ToList\<T\> | List\<T\> | string field | Execute SQL query, return the record of the field specified by field, and receive it as a tuple or basic type (int, string, long). If the record does not exist, return a list with `Count` as `0` |
| ToOne | T1 | | Execute SQL query and return the first record of all fields of the `T1` entity, or `null` if the record does not exist |
| ToAggregate\<T\> | List\<T\> | Lambda | Execute SQL query and return the aggregated result of the specified field (suitable for scenarios where `GroupBy` is not needed) |
| Any | bool | | Execute SQL query, if there are records, return true, otherwise return false. |
| Sum | T | Lambda | Specify a column and calculate the sum. |
| Min | T | Lambda | Specify a column and calculate the minimum value. |
| Max | T | Lambda | Specify a column and calculate the maximum value. |
| Avg | T | Lambda | Specify a column, calculate the average value. |
| 【Pagination】 |
| Count | long | | The number of queried records |
| Count | \<this\> | out long | The number of queried records, returned in the form of parameter `out` |
| Skip | \<this\> | int offset | Query the number of rows shifted backward |
| Offset | \<this\> | int offset | Query the number of rows shifted backward |
| Limit | \<this\> | int limit | Query a specified amount of data |
| Take | \<this\> | int limit | Query a specified amount of data |
| Page | \<this\> | int pageIndex, int pageSize | Pagination |
| 【Where】 |
| Where | \<this\> | Lambda | Supports multi-table query expressions, multiple use is equivalent to `AND`. |
| WhereIf | \<this\> | bool, Lambda | Support multi-table query expression |
| Where | \<this\> | string, parms | Native Sql syntax conditions, `Where("id = @id", new {id = 1 })` Note that the prefix `@` will be [determined according to the specific database](ActiveX-Data-Objects#parameterization) |
| WhereIf | \<this\> | bool, string, parms | Native Sql syntax conditions, `WhereIf(true, "id = @id", new {id = 1 })` Note that the prefix `@` will be [determined according to the specific database](ActiveX-Data-Objects#parameterization)|
| WhereCascade | \<this\> | Lambda | When querying multiple tables, add conditions to each table. |
| WhereDynamicFilter | \<this\> | DynamicFilterInfo | Dynamic filter conditions (interact with the front end) |
| 【Group】 |
| GroupBy | \<this\> | Lambda | Group by selected column, `GroupBy(a => a.Name)` | `GroupBy(a => new{a.Name,a.Time})` |
| GroupBy | \<this\> | string, parms | Group by native sql syntax `GroupBy("concat(name, @cc)", new { cc = 1 })`. Note that the prefix `@` will be [determined according to the specific database](ActiveX-Data-Objects#parameterization)|
| Having | \<this\> | string, parms | Filter by aggregation conditions of native sql syntax `Having("count(name) = @cc", new { cc = 1 })`. Note that the prefix `@` will be [determined according to the specific database](ActiveX-Data-Objects#parameterization) |
| Distinct | \<this\> |  | `.Distinct().ToList(x => x.GroupName)` is to perform `DISTINCT` for the specified field. |
| 【Order】 |
| OrderBy | \<this\> | Lambda | Sort by column, `OrderBy(a => a.Time)`, can be used multiple times |
| OrderByDescending | \<this\> | Lambda | 按列倒向排序，OrderByDescending(a => a.Time) |
| OrderBy | \<this\> | string, parms | 按原生sql语法排序，OrderBy("count(name) + @cc", new { cc = 1 }) |
| OrderByPropertyName | string, bool | | Sort by attribute name string (support navigation attributes) |
| 【Join】 |
| LeftJoin | \<this\> | Lambda | Left-join query, you can use navigation properties, or specify the associated entity type |
| InnerJoin | \<this\> | Lambda | Inner-join query, you can use navigation properties, or specify the associated entity type |
| RightJoin | \<this\> | Lambda | Right-join query, you can use navigation properties, or specify the associated entity type |
| LeftJoin | \<this\> | string, parms | Left-join query, using native sql syntax, `LeftJoin("type b on b.id = a.id and b.clicks> @clicks", new {clicks = 1 })` |
| InnerJoin | \<this\> | string, parms | Inner-join query, using native sql syntax, `InnerJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })` |
| RightJoin | \<this\> | string, parms | Right-join query, using native sql syntax, `RightJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })` |
| From | \<this\> | Lambda | Multi-table query, more than 3 tables will be very convenient to use (currently supports up to 10 tables by design) |
| 【Other】 |
| As | \<this\> | string alias = "a" | Specify alias |
| Master | \<this\> | | Specify query from the main database (default query from the slave database) |
| CommandTimeout | \<this\> | int | Command timeout setting (seconds) |
| WithTransaction | \<this\> | DbTransaction | Set the transaction object |
| WithConnection | \<this\> | DbConnection | Set the connection object |
| WithLock | \<this\> | Enum | Specific settings such as SqlServer `NoLock` |
| ForUpdate | \<this\> | bool | Exclusive update lock, adapted to different databases, see notes for details |
| AsQueryable | IQueryable |  | Convert `ISelect` to `IQueryable`. This method is mainly used for extensions, for example: Abp's `IRepository GetAll()` interface method needs to return an `IQueryable` object. Note: `IQueryable` method is more polluted, please try to avoid this conversion. |
| InsertInto | int | string, Lambda | Convert the query to `INSERT INTO tableName SELECT ... FROM t` and perform the insert. |
| ToUpdate | IUpdate\<TEntity\> | - | Convert the query to `IUpdate<TEntity>` |
| ToDelete | IDelete\<TEntity\> | - | Convert the query to `IDelete<TEntity>` |
| ToTreeList | List\<TEntity\> | - | Return the data of the parent-child relationship in the form of a TreeList |
| AsTreeCte | ISelect | (up, pathSelector, level) | Recursively query the parent-child relationship table |