# 查询

FreeSql 在查询数据下足了功夫，链式查询语法、多表查询、表达式函数支持得非常到位。

- 分页查询
- 单表查询
- 多表查询
- 分组聚合查询
- 返回数据
- LinqToSql
- 仓储层 Repository
- 过滤器
- 延时加载
- 贪婪加载
- 表达式函数
- 读写分离
- 性能
- 分表分库
- 多租户

## 特别介绍 WhereDynamicFilter

[《高效理解 FreeSql WhereDynamicFilter，深入了解设计初衷》](https://www.cnblogs.com/FreeSql/p/16485310.html)

ISelect.WhereDynamicFilter 方法实现动态过滤条件（与前端交互），支持的操作符：

- Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith：包含/不包含，like '%xx%'，或者 like 'xx%'，或者 like '%xx'
- Equal/NotEqual：等于/不等于
- GreaterThan/GreaterThanOrEqual：大于/大于等于
- LessThan/LessThanOrEqual：小于/小于等于
- Range：范围查询
- DateRange：日期范围，有特殊处理 value\[1\] + 1
- Any/NotAny：是否符合 value 中任何一项（直白的说是 SQL IN）

```csharp
DynamicFilterInfo dyfilter = JsonConvert.DeserializeObject<DynamicFilterInfo>(@"
{
  ""Logic"" : ""Or"",
  ""Filters"" :
  [
    {
      ""Field"" : ""Code"",
      ""Operator"" : ""NotContains"",
      ""Value"" : ""val1"",
      ""Filters"" :
      [
        {
          ""Field"" : ""Name"",
          ""Operator"" : ""NotStartsWith"",
          ""Value"" : ""val2"",
        }
      ]
    },
    {
      ""Field"" : ""Parent.Code"",
      ""Operator"" : ""Equals"",
      ""Value"" : ""val11"",
      ""Filters"" :
      [
        {
          ""Field"" : ""Parent.Name"",
          ""Operator"" : ""Contains"",
          ""Value"" : ""val22"",
        }
      ]
    }
  ]
}
");
fsql.Select<VM_District_Parent>().WhereDynamicFilter(dyfilter).ToList();
//SELECT a.""Code"", a.""Name"", a.""ParentCode"", a__Parent.""Code"" as4, a__Parent.""Name"" as5, a__Parent.""ParentCode"" as6
//FROM ""D_District"" a
//LEFT JOIN ""D_District"" a__Parent ON a__Parent.""Code"" = a.""ParentCode""
//WHERE (not((a.""Code"") LIKE '%val1%') AND not((a.""Name"") LIKE 'val2%') OR a__Parent.""Code"" = 'val11' AND (a__Parent.""Name"") LIKE '%val22%')
```

> 动态排序：ISelect.OrderByPropertyName("Parent.Code")

## API

| 方法                | 返回值          | 参数                               | 描述                   |                                                                                                                                         |
| ------------------- | --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| ToSql               | string          |                                    | 返回即将执行的 SQL 语句                                                                                                                                                |
| ToList              | List\<T1\>      |                                    | 执行 SQL 查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表                                                            |
| ToList\<T\>         | List\<T\>       | Lambda                             | 执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表                                                                                                  |
| ToList\<T\>         | List\<T\>       | string field                       | 执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表                                                  |
| ToOne               | T1              |                                    | 执行 SQL 查询，返回 T1 实体所有字段的第一条记录，记录不存在时返回 null                                                                                                 |
| ToAggregate\<T\>    | List\<T\>       | Lambda                             | 执行 SQL 查询，返回指定字段的聚合结果（适合不需要 GroupBy 的场景）                                                                                                     |
| Any                 | bool            |                                    | 执行 SQL 查询，是否有记录                                                                                                                                              |
| Sum                 | T               | Lambda                             | 指定一个列求和                                                                                                                                                         |
| Min                 | T               | Lambda                             | 指定一个列求最小值                                                                                                                                                     |
| Max                 | T               | Lambda                             | 指定一个列求最大值                                                                                                                                                     |
| Avg                 | T               | Lambda                             | 指定一个列求平均值                                                                                                                                                     |
| 【分页】            |
| Count               | long            |                                    | 查询的记录数量                                                                                                                                                         |
| Count               | \<this\>        | out long                           | 查询的记录数量，以参数 out 形式返回                                                                                                                                    |
| Skip                | \<this\>        | int offset                         | 查询向后偏移行数                                                                                                                                                       |
| Offset              | \<this\>        | int offset                         | 查询向后偏移行数                                                                                                                                                       |
| Limit               | \<this\>        | int limit                          | 查询多少条数据                                                                                                                                                         |
| Take                | \<this\>        | int limit                          | 查询多少条数据                                                                                                                                                         |
| Page                | \<this\>        | int pageIndex, int pageSize        | 分页                                                                                                                                                                   |
| 【条件】            |
| Where               | \<this\>        | Lambda                             | 支持多表查询表达式，多次使用相当于 AND                                                                                                                                 |
| WhereIf             | \<this\>        | bool, Lambda                       | 支持多表查询表达式                                                                                                                                                     |
| Where               | \<this\>        | string, parms                      | 原生 sql 语法条件，Where("id = @id", new { id = 1 } ,[注意前缀@,根据具体数据库决定](ado.md#参数化) 其他地方不再说明。同理 )                                            |
| WhereIf             | \<this\>        | bool, string, parms                | 原生 sql 语法条件，WhereIf(true, "id = @id", new { id = 1 }                                                                                                            |
| WhereCascade        | \<this\>        | Lambda                             | 实现多表查询时，向每个表中附加条件                                                                                                                                     |
| WhereDynamicFilter  | \<this\>        | DynamicFilterInfo                  | 动态过滤条件(与前端交互)                                                                                                                                               |
| 【分组】            |
| GroupBy             | \<this\>        | Lambda                             | 按选择的列分组，GroupBy(a => a.Name)                                                                                                                                   | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy             | \<this\>        | string, parms                      | 按原生 sql 语法分组，GroupBy("concat(name, @cc)", new { cc = 1 })                                                                                                      |
| Having              | \<this\>        | string, parms                      | 按原生 sql 语法聚合条件过滤，Having("count(name) = @cc", new { cc = 1 })                                                                                               |
| Disdinct            | \<this\>        |                                    | .Distinct().ToList(x => x.GroupName) 是对指定字段                                                                                                                      |
| 【排序】            |
| OrderBy             | \<this\>        | Lambda                             | 按列排序，OrderBy(a => a.Time)，可多次使用                                                                                                                             |
| OrderByDescending   | \<this\>        | Lambda                             | 按列倒向排序，OrderByDescending(a => a.Time)                                                                                                                           |
| OrderBy             | \<this\>        | string, parms                      | 按原生 sql 语法排序，OrderBy("count(name) + @cc", new { cc = 1 })                                                                                                      |
| OrderByPropertyName | string, bool    | 按属性名字符串排序（支持导航属性） |
| 【联表】            |
| LeftJoin            | \<this\>        | Lambda                             | 左联查询，可使用导航属性，或指定关联的实体类型                                                                                                                         |
| InnerJoin           | \<this\>        | Lambda                             | 联接查询，可使用导航属性，或指定关联的实体类型                                                                                                                         |
| RightJoin           | \<this\>        | Lambda                             | 右联查询，可使用导航属性，或指定关联的实体类型                                                                                                                         |
| LeftJoin            | \<this\>        | string, parms                      | 左联查询，使用原生 sql 语法，LeftJoin("type b on b.id = a.id and b.clicks > ?clicks", new { clicks = 1 })                                                              |
| InnerJoin           | \<this\>        | string, parms                      | 联接查询，使用原生 sql 语法，InnerJoin("type b on b.id = a.id and b.clicks > ?clicks", new { clicks = 1 })                                                             |
| RightJoin           | \<this\>        | string, parms                      | 右联查询，使用原生 sql 语法，RightJoin("type b on b.id = a.id and b.clicks > ?clicks", new { clicks = 1 })                                                             |
| From                | \<this\>        | Lambda                             | 多表查询，3 个表以上使用非常方便，目前设计最大支持 10 个表                                                                                                             |
| 【其他】            |
| As                  | \<this\>        | string alias = "a"                 | 指定别名                                                                                                                                                               |
| Master              | \<this\>        |                                    | 指定从主库查询（默认查询从库）                                                                                                                                         |
| CommandTimeout      | \<this\>        | int                                | 命令超时设置(秒)                                                                                                                                                       |
| WithTransaction     | \<this\>        | DbTransaction                      | 设置事务对象                                                                                                                                                           |
| WithConnection      | \<this\>        | DbConnection                       | 设置连接对象                                                                                                                                                           |
| WithLock            | \<this\>        | Enum                               | SqlServer NoLock 等特有的设置                                                                                                                                          |
| ForUpdate           | \<this\>        | bool                               | 排他更新锁，对不同的数据库已作适配，详细说明见注释                                                                                                                     |
| AsQueryable         | IQueryable      |                                    | 将 ISelect 转换为 IQueryable，此方法主要用于扩展，比如：abp IRepository GetAll() 接口方法需要返回 IQueryable 对象。注意：IQueryable 方法污染较为严重，请尽量避免此转换 |
| ToTreeList()        | List\<TEntity\> | 无                                 | 将父子关系的数据以 TreeList 的形式返回                                                                                                                                 |
| AsTreeCte()         | ISelect         | (up, pathSelector, level)          | 递归查询父子关系表                                                                                                                                                     |
