# Paging

```csharp
IFreeSql fsql; // For how to create, please refer to the introductory documentation

class Topic
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
    public int Clicks { get; set; }
    public DateTime CreateTime { get; set; }

    public int CategoryId { get; set; }
}
```

## 20 items per page

```csharp
var list = fsql.Select<Topic>()
    .Where(a => a.Id > 10)
    .Count(out var total) // Total record count
    .Page(1, 20)
    .ToList();
```

> Count(out var total) is a synchronous method because `out` does not support asynchronous operations. If this is a concern, you can perform the following separately:

Tip: For large datasets, it's generally not recommended to use `Count`/`CountAsync`; instead, use stream paging (previous page, next page, without returning total count).

```csharp
var select = fsql.Select<Topic>().Where(a => a.Id > 10);
var total = await select.CountAsync();
var list = await select.Page(1, 20).ToListAsync();
```

`BasePagingInfo` contains `PageNumber`, `PageSize`, `Count`. With `.Page(page)`, `page.Count` will have the count value.

```csharp
public class TopicGetListInput : BasePagingInfo
{
    public string Name { get; set; }
}
var list = await fsql.Select<Topic>()
    .WhereIf(!string.IsNullOrEmpty(page.Name), r => r.Name.Contains(page.Name))
    .OrderByDescending(c => c.CreateTime)
    .Page(page)
    .ToListAsync();
```

## Optimization

For versions of SqlServer before 2012, row_number paging is used;

For SqlServer 2012+ versions, the latest fetch next rows paging is used;

## API

| Method      | Return Type | Parameters                                               | Description                                                                                                                                                                   |
| ----------- | ----------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ToSql       | string      |                                                          | Returns the SQL statement that will be executed                                                                                                                               |
| ToList      | List\<T1\>  |                                                          | Executes SQL query and returns all fields of T1 entity records. If there are navigation properties, they are also returned. If no records exist, returns a list with Count 0. |
| ToList\<T\> | List\<T\>   | Lambda                                                   | Executes SQL query and returns specified fields of records. If no records exist, returns a list with Count 0.                                                                 |
| ToList\<T\> | List\<T\>   | string field                                             | Executes SQL query and returns records for the specified field, and receives as tuples or basic types (int, string, long). If no records exist, returns a list with Count 0.  |
| 【Paging】  |
| Count       | long        |                                                          | Number of records in the query                                                                                                                                                |
| Count       | \<this\>    | out long                                                 | Number of records in the query, returned as an out parameter                                                                                                                  |
| Skip        | \<this\>    | int offset                                               | Query with an offset of rows                                                                                                                                                  |
| Offset      | \<this\>    | int offset                                               | Query with an offset of rows                                                                                                                                                  |
| Limit       | \<this\>    | int limit                                                | Query how many records                                                                                                                                                        |
| Take        | \<this\>    | int limit                                                | Query how many records                                                                                                                                                        |
| Page        | \<this\>    | int pageIndex, int pageSize                              | Paging                                                                                                                                                                        |
| Page        | \<this\>    | BasePagingInfo(int PageNumber, int PageSize, long Count) | Paging and calculate Count                                                                                                                                                    |
