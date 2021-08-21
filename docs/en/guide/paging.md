# Pagination

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
}
```

## 20 data per page, query page 1

```csharp
var list = fsql.Select<Topic>()
    .Where(a => a.Id > 10)
    .Count(out var total) //Total number of records
    .Page(1, 20)
    .Tolist();
```

## Optimization

For the previous versions of `SqlServer 2012`, use `row_number` for pagination;

For `SqlServer 2012+` version, using the latest `fetch next rows` pagination;

## API

| Methods        | Return     | Parameters                  | Description                                                                                                                                                                                                                                |
| -------------- | ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ToSql          | string     |                             | Return the SQL statement to be executed                                                                                                                                                                                                    |
| ToList         | List\<T1\> |                             | Execute SQL query, and return the records of all the fields of the `T1` entity. If there are navigation properties, they will be queried and returned together. If the record does not exist, a list with `Count` of `0` will be returned. |
| ToList\<T\>    | List\<T\>  | Lambda                      | Execute SQL query, and return the record of the specified fields. If the record does not exist, a list with `Count` of `0` will be returned.                                                                                               |
| ToList\<T\>    | List\<T\>  | string field                | Execute SQL query, and return the record of the specified fields of the parameters, and receive it as a tuple or basic type (`int`, `string`, `long`). If the record does not exist, a list with `Count` of `0` will be returned.          |
| 【Pagination】 |
| Count          | long       |                             | Number of records queried                                                                                                                                                                                                                  |
| Count          | \<this\>   | out long                    | The number of records to be queried, returned in the form of parameter with `out`                                                                                                                                                          |
| Skip           | \<this\>   | int offset                  | Query the number of rows shifted backward                                                                                                                                                                                                  |
| Offset         | \<this\>   | int offset                  | Query the number of rows shifted backward                                                                                                                                                                                                  |
| Limit          | \<this\>   | int limit                   | Number of query data                                                                                                                                                                                                                       |
| Take           | \<this\>   | int limit                   | Number of query data                                                                                                                                                                                                                       |
| Page           | \<this\>   | int pageIndex, int pageSize | Pagination                                                                                                                                                                                                                                 |

## 参考资料

- [《Query from Multi Tables》](Query-from-Multi-Tables)
- [《Return Data》](Return-Data)
- [《LinqToSql》](Linq-to-Sql)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
- [《Performance》](Performance)
- [《Tenant》](Tenant)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
