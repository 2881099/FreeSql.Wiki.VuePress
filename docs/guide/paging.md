# 分页查询

```csharp
IFreeSql fsql; //如何创建请移步入门文档

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

## 每页 20 条数据，查询第 1 页

```csharp
var list = fsql.Select<Topic>()
    .Where(a => a.Id > 10)
    .Count(out var total) //总记录数量
    .Page(1, 20)
    .ToList();
```

> Count(out var total) 是同步方法，原因是 out 不支持异步，如果介意可以单独执行如下：

提示：数据量大一般不建议查 Count/CountAsync，而应该采用流式分页（上一页、下一页、不返回总数量）

```csharp
var select = fsql.Select<Topic>().Where(a => a.Id > 10);
var total = await select.CountAsync();
var list = await select.Page(1, 20).ToListAsync();
```

`BasePagingInfo` 拥有 `PageNumber`,`PageSize`,`Count`，如下内容 `.Page(page)`，`page.Count` 就有统计值了

```csharp
public class TopicGetListInput: BasePagingInfo
{
    public string Name { get; set; }
}
var list = await fsql.Select<Topic>()
    .WhereIf(!string.IsNullOrEmpty(page.Name),r => r.Name.Contains(page.Name))
    .OrderByDescending(c => c.CreateTime)
    .Page(page)
    .ToListAsync();
```

## 优化

SqlServer 2012 以前的版本，使用 row_number 分页；

SqlServer 2012+ 版本，使用最新的 fetch next rows 分页；

## API

| 方法        | 返回值     | 参数                                                    | 描述                                                                                                                  |
| ----------- | ---------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ToSql       | string     |                                                         | 返回即将执行的 SQL 语句                                                                                               |
| ToList      | List\<T1\> |                                                         | 执行 SQL 查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表           |
| ToList\<T\> | List\<T\>  | Lambda                                                  | 执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表                                                 |
| ToList\<T\> | List\<T\>  | string field                                            | 执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表 |
| 【分页】    |
| Count       | long       |                                                         | 查询的记录数量                                                                                                        |
| Count       | \<this\>   | out long                                                | 查询的记录数量，以参数 out 形式返回                                                                                   |
| Skip        | \<this\>   | int offset                                              | 查询向后偏移行数                                                                                                      |
| Offset      | \<this\>   | int offset                                              | 查询向后偏移行数                                                                                                      |
| Limit       | \<this\>   | int limit                                               | 查询多少条数据                                                                                                        |
| Take        | \<this\>   | int limit                                               | 查询多少条数据                                                                                                        |
| Page        | \<this\>   | int pageIndex, int pageSize                             | 分页                                                                                                                  |
| Page        | \<this\>   | BasePagingInfo(int PageNumber,int PageSize,long Count ) | 分页,并且求Count和                                                                                                    |
