# 查询

FreeSql 在查询数据下足了功夫，链式风格、多表查询、表达式函数、导航属性支持得非常到位。

|                                        |                                          |                                         |
| -------------------------------------- | ---------------------------------------- | --------------------------------------- |
| [《分页查询》](paging.md)              | [《仓储层 Repository》](repository.md)   | [《读写分离》](read-write-splitting.md) |
| [《单表查询》](select-single-table.md) | [《过滤器》](filters.md)                 | [《LinqToSql》](linq-to-sql.md)         |
| [《多表查询》](select-multi-table.md)  | [《延时加载》](select-lazy-loading.md)   | [《性能》](performance.md)              |
| [《嵌套查询》](withtempquery.md)       | [《贪婪加载》](select-include.md)        | [《分表分库》](sharding.md)             |
| [《分组聚合查询》](select-group-by.md) | [《表达式函数》](expression-function.md) | [《多租户》](multi-tenancy.md)          |
| [《返回数据》](select-return-data.md)  |                                          |                                         |

## 表达式函数

| 说明         | Lambda 表达式                                                  | SQL                                          |
| ------------ | -------------------------------------------------------------- | -------------------------------------------- |
| in           | Where(a => new [] { 1,2,3 }.Contains(a.Id))                    | [Id] in (1,2,3)                              |
| not in       | Where(a => !new [] { 1,2,3 }.Contains(a.Id))                   | [Id] not in (1,2,3)                          |
| 多列in       | Where(a => list.Any(b => b.Item1 == a.Id && b.Item2 == a.ct1)) | ([Id]=1 and [ct1]=1) or ([Id]=2 and [ct1]=2) |
| like '%xxx%' | Where(a => a.Title.Contains("xxx"))                            | [Title] like '%xxx%'                         |
| like 'xxx%'  | Where(a => a.Title.StartsWith("xxx"))                          | [Title] like 'xxx%'                          |
| like '%xxx'  | Where(a => a.Title.EndsWith("xxx"))                            | [Title] like '%xxx'                          |
| 日期范围     | Where(a => a.Time.Between(time1, time2))                       | [Time] between @time1 and @time2             |
| 是否存在     | .Any()                                                         | select 1 from ...                            |
| 总数         | .Count()                                                       | select count(\*) from ...                    |
| 求和         | .Sum(a => a.Score)                                             | select sum([Score]) from ...                 |
| 平均         | .Avg(a => a.Score)                                             | select avg([Score]) from ...                 |
| 最大值       | .Max(a => a.Score)                                             | select max([Score]) from ...                 |
| 最小值       | .Min(a => a.Score)                                             | select min([Score]) from ...                 |

更详细请前往[《表达式函数》](expression-function.md)

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

多表：

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

全局设置 NoLock：

```csharp
//所有实体类生效
fsql.SetGlobalSelectWithLock(SqlServerLock.NoLock, null);

//【指定】实体类生效
fsql.SetGlobalSelectWithLock(SqlServerLock.NoLock, new Dictionary<Type, bool>
{
    [typeof(Region)] = true,
    [typeof(T2)] = true
});
```

## 动态过滤 WhereDynamicFilter

[《高效理解 FreeSql WhereDynamicFilter，深入了解设计初衷》](https://www.cnblogs.com/FreeSql/p/16485310.html)

ISelect.WhereDynamicFilter 方法实现动态过滤条件（与前端交互），支持的操作符：

- Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith：包含/不包含，like '%xx%'，或者 like 'xx%'，或者 like '%xx'
- Equal/NotEqual：等于/不等于
- GreaterThan/GreaterThanOrEqual：大于/大于等于
- LessThan/LessThanOrEqual：小于/小于等于
- Range：范围查询
- DateRange：日期范围，有特殊处理 value\[1\] + 1
- Any/NotAny：是否符合 value 中任何一项（直白的说是 SQL IN）
- Custom：[自定义解析](https://github.com/dotnetcore/FreeSql/discussions/1550)

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

> 动态表名：ISelect.AsTable((t, old) => $"{old}\_201903")

> 动态排序：ISelect.OrderByPropertyName("Parent.Code")

> 动态返回：ISelect.ToDataTableByPropertyName(new string[] { "Parent.Code", "Id" })

> 动态贪婪加载：ISelect.IncludeByPropertyName("Parent.Parent").IncludeByPropertyName("Parent.Childs")

## 克隆查询 ISelect

> 新版本使用 fsql.Select\<T\>().Where(...).Clone();

科普：csharp 7.0 支持本地函数，方法内再定义临时方法，这个特性向大家推荐，在很多时候都非常有效。

方法内还可以定义方法，那就称它：本地函数/嵌套方法。

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
    //此时 select2 不会附加 a.Status == 0 条件
}
```

## API

| 方法                | 返回值            | 参数                               | 描述                                                                                                                                                                   |                                  |
| ------------------- | ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| ToSql               | string            |                                    | 返回即将执行的 SQL 语句                                                                                                                                                |
| ToList              | List\<T1\>        |                                    | 执行 SQL 查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表                                                            |
| ToList\<T\>         | List\<T\>         | Lambda                             | 执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表                                                                                                  |
| ToList\<T\>         | List\<T\>         | string field                       | 执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表                                                  |
| ToOne               | T1                |                                    | 执行 SQL 查询，返回 T1 实体所有字段的第一条记录，记录不存在时返回 null                                                                                                 |
| ToAggregate\<T\>    | List\<T\>         | Lambda                             | 执行 SQL 查询，返回指定字段的聚合结果（适合不需要 GroupBy 的场景）                                                                                                     |
| Any                 | bool              |                                    | 执行 SQL 查询，是否有记录                                                                                                                                              |
| Sum                 | T                 | Lambda                             | 指定一个列求和                                                                                                                                                         |
| Min                 | T                 | Lambda                             | 指定一个列求最小值                                                                                                                                                     |
| Max                 | T                 | Lambda                             | 指定一个列求最大值                                                                                                                                                     |
| Avg                 | T                 | Lambda                             | 指定一个列求平均值                                                                                                                                                     |
| 【分页】            |
| Count               | long              |                                    | 查询的记录数量                                                                                                                                                         |
| Count               | \<this\>          | out long                           | 查询的记录数量，以参数 out 形式返回                                                                                                                                    |
| Skip                | \<this\>          | int offset                         | 查询向后偏移行数                                                                                                                                                       |
| Offset              | \<this\>          | int offset                         | 查询向后偏移行数                                                                                                                                                       |
| Limit               | \<this\>          | int limit                          | 查询多少条数据                                                                                                                                                         |
| Take                | \<this\>          | int limit                          | 查询多少条数据                                                                                                                                                         |
| Page                | \<this\>          | int pageIndex, int pageSize        | 分页                                                                                                                                                                   |
| 【条件】            |
| Where               | \<this\>          | Lambda                             | 支持多表查询表达式，多次使用相当于 AND                                                                                                                                 |
| WhereIf             | \<this\>          | bool, Lambda                       | 支持多表查询表达式                                                                                                                                                     |
| Where               | \<this\>          | string, parms                      | 原生 sql 语法条件，Where("id = @id", new { id = 1 } ,[注意前缀@,根据具体数据库决定](ado.md#参数化) 其他地方不再说明。同理 )                                            |
| WhereIf             | \<this\>          | bool, string, parms                | 原生 sql 语法条件，WhereIf(true, "id = @id", new { id = 1 }                                                                                                            |
| WhereCascade        | \<this\>          | Lambda                             | 实现多表查询时，向每个表中附加条件                                                                                                                                     |
| WhereDynamicFilter  | \<this\>          | DynamicFilterInfo                  | 动态过滤条件(与前端交互)                                                                                                                                               |
| 【分组】            |
| GroupBy             | \<this\>          | Lambda                             | 按选择的列分组，GroupBy(a => a.Name)                                                                                                                                   | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy             | \<this\>          | string, parms                      | 按原生 sql 语法分组，GroupBy("concat(name, @cc)", new { cc = 1 })                                                                                                      |
| Having              | \<this\>          | string, parms                      | 按原生 sql 语法聚合条件过滤，Having("count(name) = @cc", new { cc = 1 })                                                                                               |
| Disdinct            | \<this\>          |                                    | .Distinct().ToList(x => x.GroupName) 是对指定字段                                                                                                                      |
| 【排序】            |
| OrderBy             | \<this\>          | Lambda                             | 按列排序，OrderBy(a => a.Time)，可多次使用                                                                                                                             |
| OrderByDescending   | \<this\>          | Lambda                             | 按列倒向排序，OrderByDescending(a => a.Time)                                                                                                                           |
| OrderBy             | \<this\>          | string, parms                      | 按原生 sql 语法排序，OrderBy("count(name) + @cc", new { cc = 1 })                                                                                                      |
| OrderByPropertyName | string, bool      | 按属性名字符串排序（支持导航属性） |
| 【联表】            |
| LeftJoin            | \<this\>          | Lambda                             | 左联查询，可使用导航属性，或指定关联的实体类型                                                                                                                         |
| InnerJoin           | \<this\>          | Lambda                             | 联接查询，可使用导航属性，或指定关联的实体类型                                                                                                                         |
| RightJoin           | \<this\>          | Lambda                             | 右联查询，可使用导航属性，或指定关联的实体类型                                                                                                                         |
| LeftJoin            | \<this\>          | string, parms                      | 左联查询，使用原生 sql 语法，LeftJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })                                                              |
| InnerJoin           | \<this\>          | string, parms                      | 联接查询，使用原生 sql 语法，InnerJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })                                                             |
| RightJoin           | \<this\>          | string, parms                      | 右联查询，使用原生 sql 语法，RightJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })                                                             |
| From                | \<this\>          | Lambda                             | 多表查询，3 个表以上使用非常方便，目前设计最大支持 10 个表                                                                                                             |
| FromQuery           | ISelect\<T1, T2\> | ISelect\<T2\>                      | 单表连成双表查询                                                                                                                                                       |
| WithTempQuery       | ISelect\<T1\>     | Lambda                             | 将单表或多表查询嵌套成单表查询                                                                                                                                         |
| WithMemory          | ISelect\<T1\>     | List\<T1\>                         | 使用内存数据查询                                                                                                                                                       |
| UnionAll            | ISelect\<T1\>     | ISelect\<T1\>[]                    | 联合查询                                                                                                                                                               |
| 【其他】            |
| As                  | \<this\>          | string alias = "a"                 | 指定别名                                                                                                                                                               |
| Master              | \<this\>          |                                    | 指定从主库查询（默认查询从库）                                                                                                                                         |
| CommandTimeout      | \<this\>          | int                                | 命令超时设置(秒)                                                                                                                                                       |
| WithTransaction     | \<this\>          | DbTransaction                      | 设置事务对象                                                                                                                                                           |
| WithConnection      | \<this\>          | DbConnection                       | 设置连接对象                                                                                                                                                           |
| WithLock            | \<this\>          | Enum                               | SqlServer NoLock 等特有的设置                                                                                                                                          |
| ForUpdate           | \<this\>          | bool                               | 排他更新锁，对不同的数据库已作适配，详细说明见注释                                                                                                                     |
| AsQueryable         | IQueryable        |                                    | 将 ISelect 转换为 IQueryable，此方法主要用于扩展，比如：abp IRepository GetAll() 接口方法需要返回 IQueryable 对象。注意：IQueryable 方法污染较为严重，请尽量避免此转换 |
| ToTreeList()        | List\<TEntity\>   | 无                                 | 将父子关系的数据以 TreeList 的形式返回                                                                                                                                 |
| AsTreeCte()         | ISelect           | (up, pathSelector, level)          | 递归查询父子关系表                                                                                                                                                     |
