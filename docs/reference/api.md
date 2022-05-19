# API 文档

- [http://124.70.130.97:8082/api/FreeSql.html](http://124.70.130.97:8082/api/FreeSql.html)

## FreeSqlBuilder

| 方法                                  | 返回值        | 说明                                                                                   |
| ------------------------------------- | ------------- | -------------------------------------------------------------------------------------- |
| UseConnectionString                   | this          | 设置连接串                                                                             |
| UseSlave                              | this          | 设置从数据库，支持多个                                                                 |
| UseConnectionFactory                  | this          | 设置自定义数据库连接对象（放弃内置对象连接池技术）                                     |
| UseAutoSyncStructure                  | this          | 【开发环境必备】自动同步实体结构到数据库，程序运行中检查实体创建或修改表结构           |
| UseNoneCommandParameter               | this          | 不使用命令参数化执行，针对 Insert/Update，也可临时使用 IInsert/IUpdate.NoneParameter() |
| UseGenerateCommandParameterWithLambda | this          | 生成命令参数化执行，针对 lambda 表达式解析                                             |
| UseLazyLoading                        | this          | 开启延时加载功能                                                                       |
| UseMonitorCommand                     | this          | 监视全局 SQL 执行前后                                                                  |
| **UseNameConvert**                    | this          | 转换实体、属性名称 Entity Property -\> Db Filed                                        |
| Build\<T\>                            | IFreeSql\<T\> | 创建一个 IFreeSql 对象，注意：单例设计，不要重复创建                                   |

## IFreeSql

| 属性                                | 返回值       | 说明                                                                                           |
| ----------------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| [Ado](../guide/ado.md)              | IAdo         | 数据库访问对象，封装了类似 SqlHelper 操作：ExecuteNonQuery/ExecuteScalar/ExecuteConnectTest 等 |
| [Aop](../guide/aop.md)              | IAop         | 所有 AOP 拦截方法都在这里                                                                      |
| [CodeFirst](../guide/code-first.md) | ICodeFirst   | 封装 CodeFirst 模式开发相关方法                                                                |
| [DbFirst](../guide/db-first.md)     | IDbFirst     | 封装 DbFirst 模式开发相关方法                                                                  |
| [GlobalFilter](../guide/filters.md) | GlobalFilter | 全局过滤设置，可默认附加为 Select/Update/Delete 条件                                           |

| 方法                      | 返回值                     | 参数                 | 说明                                                        |
| ------------------------- | -------------------------- | -------------------- | ----------------------------------------------------------- |
| Select\<TEntity\>         | ISelect\<TEntity\>         | 无                   | 准备查询数据                                                |
| Insert\<TEntity\>         | IInsert\<TEntity\>         | 无/TEntity/TEntity[] | 准备插入                                                    |
| Update\<TEntity\>         | IUpdate\<TEntity\>         | 无                   | 准备更新数据                                                |
| Delete\<TEntity\>         | IDelete\<TEntity\>         | 无                   | 准备删除                                                    |
| InsertOrUpdate\<TEntity\> | IInsertOrUpdate\<TEntity\> | 无                   | 插入或更新数据                                              |
| Transaction               | void                       | Action               | 开启事务（不支持异步），[其他事务](../guide/transaction.md) |

| 扩展方法                                                 | 返回值         | 参数   | 说明                                                |
| -------------------------------------------------------- | -------------- | ------ | --------------------------------------------------- |
| Select\<T1, T2, ... T10\>                                | ISelect        | 无     | 准备多表查询                                        |
| [CreateDbContext](../guide/db-context.md)                | DbContext      | 无     | 创建普通数据上下文档对象，该对象功能类似于 EFCore   |
| SetDbContextOptions                                      | -              | Action | 设置此 IFreeSql 下 DbContext 选项设置               |
| [GetRepository](../guide/repository.md)\<TEntity, TKey\> | BaseRepository | 无     | 返回默认仓库功能实现                                |
| [CreateUnitOfWork](../guide/unit-of-work.md)             | IUnitOfWork    | 无     | 创建基于仓储功能的工作单元，务必使用 using 包含使用 |

---

## BaseRepository\<TEntity, TKey\>

| 属性             | 返回值                 | 说明                                           |
| ---------------- | ---------------------- | ---------------------------------------------- |
| EntityType       | Type                   | 仓储正在操作的实体类型，注意它不一定是 TEntity |
| UnitOfWork       | IUnitOfWork            | 正在使用的工作单元                             |
| Orm              | IFreeSql               | 正在使用的 Orm                                 |
| DbContextOptions | DbContextOptions       | 正在使用的 DbContext 设置，修改设置不影响其他  |
| DataFilter       | IDataFilter\<TEntity\> | 仓储过滤器，本对象内生效                       |
| Select           | ISelect\<TEntity\>     | 准备查询数据                                   |

| 方法              | 返回值  | 参数                   | 说明                                                     |
| ----------------- | ------- | ---------------------- | -------------------------------------------------------- |
| AsType            | void    | Type                   | 改变仓储正在操作的实体类型                               |
| Get               | TEntity | TKey                   | 根据主键，查询数据                                       |
| Find              | TEntity | TKey                   | 根据主键，查询数据                                       |
| Delete            | int     | TKey                   | 根据主键删除数据                                         |
| Delete            | int     | Lambda                 | 根据 lambda 条件删除数据                                 |
| Delete            | int     | TEntity                | 删除数据                                                 |
| Delete            | int     | IEnumerable\<TEntity\> | 批量删除数据                                             |
| Insert            | -       | TEntity                | 插入数据，若实体有自增列，插入后的自增值会填充到实体中   |
| Insert            | -       | IEnumerable\<TEntity\> | 批量插入数据                                             |
| Update            | -       | TEntity                | 更新数据                                                 |
| Update            | -       | IEnumerable\<TEntity\> | 批量更新数据                                             |
| InsertOrUpdate    | -       | TEntity                | 插入或更新数据                                           |
| FlushState        | -       | 无                     | 清除状态管理数据                                         |
| Attach            | -       | TEntity                | 附加实体到状态管理，可用于不查询就更新或删除             |
| Attach            | -       | IEnumerable\<TEntity\> | 批量附加实体到状态管理                                   |
| AttachOnlyPrimary | -       | TEntity                | 只附加实体的主键数据到状态管理                           |
| SaveMany          | -       | TEntity, string        | 保存实体的指定 ManyToMany/OneToMany 导航属性（完整对比） |
| BeginEdit         | -       | List\<TEntity\>        | 准备编辑一个 List 实体                                   |
| EndEdit           | int     | 无                     | 完成编辑数据，进行保存动作                               |

> 状态管理，可实现 Update 只更新变化的字段（不更新所有字段），灵活使用 Attach 和 Update 用起来非常舒服。

DbContext 与 BaseRepository 功能大致类似。

DbContext 自身 = 完整事务，BaseRepository 不一定有事务（可通过设置其 UnitOfWork 属性）。

---

## ICodeFirst

| 属性                                 | 返回值 | 说明                                                                                                                                                                                                                                                                                                          |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IsAutoSyncStructure                  | bool   | 【开发环境必备】自动同步实体结构到数据库，程序运行中检查实体表是否存在，然后创建或修改                                                                                                                                                                                                                        |
| IsSyncStructureToLower               | bool   | 是否转小写映射，适合 pgsql                                                                                                                                                                                                                                                                                    |
| IsSyncStructureToUpper               | bool   | 是否转大写映射，适合 oracle、dameng                                                                                                                                                                                                                                                                           |
| IsNoneCommandParameter               | bool   | 是否不使用命令参数化执行，针对 Insert/Update                                                                                                                                                                                                                                                                  |
| IsGenerateCommandParameterWithLambda | bool   | 是否生成命令参数化执行，针对 where lambda 表达式解析                                                                                                                                                                                                                                                          |
| IsLazyLoading                        | bool   | 是否开启延时加载导航属性对象，导航属性需要声明 virtual                                                                                                                                                                                                                                                        |
| IsConfigEntityFromDbFirst            | bool   | 将数据库的主键、自增、索引设置导入，适合 DbFirst 模式，无须在实体类型上设置 [Column(IsPrimary)]。此功能目前可用于 mysql/sqlserver/postgresql/oracle，此功能会影响 IFreeSql 首次访问的速度。若使用 CodeFirst 创建索引后，又直接在数据库上建了索引，若无本功能下一次 CodeFirst 迁移时数据库上创建的索引将被删除 |

| 方法                                  | 返回值     | 参数                       | 说明                                            |
| ------------------------------------- | ---------- | -------------------------- | ----------------------------------------------- |
| GetComparisonDDLStatements\<TEntity\> | string     | 无                         | 将实体类型与数据库对比，返回 DDL 语句           |
| GetComparisonDDLStatements            | string     | Type[]                     | 将多个实体类型与数据库对比，返回 DDL 语句       |
| GetComparisonDDLStatements            | string     | Type, string               | 将实体类型与数据库对比，返回 DDL 语句(指定表名) |
| SyncStructure\<TEntity\>              | bool       | 无                         | 同步实体类型到数据库                            |
| SyncStructure                         | bool       | Type[]                     | 同步实体类型集合到数据库                        |
| SyncStructure                         | bool       | Type, string               | 同步实体类型到数据库（指定表名）                |
| ConfigEntity                          | ICodeFirst | Action\<TableFluent\<T\>\> | FluentAPI 配置实体的特性                        |
| GetTableByEntity                      | TableInfo  | Type                       | 获取类型在 ORM 内部的元数据                     |

---

## IDbFirst

| 方法                | 返回值              | 参数     | 说明                                                                   |
| ------------------- | ------------------- | -------- | ---------------------------------------------------------------------- |
| GetDatabases        | List\<string\>      | 无       | 获取所有数据库                                                         |
| GetTablesByDatabase | List\<DbTableInfo\> | string[] | 获取指定数据库的表信息，包括表、列详情、主键、唯一键、索引、外键、备注 |
| GetTableByName      | DbTableInfo         | string   | 获取指定单表信息，包括列详情、主键、唯一键、索引、备注                 |
| ExistsTable         | bool                | string   | 判断表名是否存在                                                       |

---

## ISelect

| 方法                | 返回值          | 参数                               | 描述|                                                                                                                                                                   |
| ------------------- | --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| ToSql               | string          |                                    | 返回即将执行的 SQL 语句                                                                                                                                                |
| ToList              | List\<T1\>      |                                    | 执行 SQL 查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表                                                            |
| ToList\<T\>         | List\<T\>       | Lambda                             | 执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表                                                                                                  |
| ToList\<T\>         | List\<T\>       | string field                       | 执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表                                                  |
| ToOne               | T1              |                                    | 执行 SQL 查询，返回 T1 实体所有字段的第一条记录，记录不存在时返回 null                                                                                                 |
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
| Where               | \<this\>        | string, parms                      | 原生 sql 语法条件，Where("id = ?id", new { id = 1 })                                                                                                                   |
| WhereIf             | \<this\>        | bool, string, parms                | 原生 sql 语法条件，WhereIf(true, "id = ?id", new { id = 1 })                                                                                                           |
| WhereCascade        | \<this\>        | Lambda                             | 实现多表查询时，向每个表中附加条件                                                                                                                                     |
| 【分组】            |
| GroupBy             | \<this\>        | Lambda                             | 按选择的列分组，GroupBy(a => a.Name)                                                                                                                                   | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy             | \<this\>        | string, parms                      | 按原生 sql 语法分组，GroupBy("concat(name, ?cc)", new { cc = 1 })                                                                                                      |
| Having              | \<this\>        | string, parms                      | 按原生 sql 语法聚合条件过滤，Having("count(name) = ?cc", new { cc = 1 })                                                                                               |
| Distinct            | \<this\>        |                                    | .Distinct().ToList(x => x.GroupName) 是对指定字段                                                                                                                      |
| 【排序】            |
| OrderBy             | \<this\>        | Lambda                             | 按列排序，OrderBy(a => a.Time)，可多次使用                                                                                                                             |
| OrderByDescending   | \<this\>        | Lambda                             | 按列倒向排序，OrderByDescending(a => a.Time)                                                                                                                           |
| OrderBy             | \<this\>        | string, parms                      | 按原生 sql 语法排序，OrderBy("count(name) + ?cc", new { cc = 1 })                                                                                                      |
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

---

## IInsert

| 方法                 | 返回值                     | 参数                    | 描述                                                  |
| -------------------- | -------------------------- | ----------------------- | ----------------------------------------------------- |
| AppendData           | \<this\>                   | T1 \| IEnumerable\<T1\> | 追加准备插入的实体                                    |
| InsertIdentity       | \<this\>                   | 无                      | 指明插入自增列                                        |
| InsertColumns        | \<this\>                   | Lambda                  | 只插入的列                                            |
| IgnoreColumns        | \<this\>                   | Lambda                  | 忽略的列                                              |
| CommandTimeout       | \<this\>                   | int                     | 命令超时设置(秒)                                      |
| WithTransaction      | \<this\>                   | DbTransaction           | 设置事务对象                                          |
| WithConnection       | \<this\>                   | DbConnection            | 设置连接对象                                          |
| ToSql                | string                     |                         | 返回即将执行的 SQL 语句                               |
| OnDuplicateKeyUpdate | OnDuplicateKeyUpdate\<T1\> | 无                      | MySql 特有的功能，On Duplicate Key Update             |
| OnConflictDoUpdate   | OnConflictDoUpdate\<T1\>   | 无                      | PostgreSQL 特有的功能，On Conflict Do Update          |
| ExecuteAffrows       | long                       |                         | 执行 SQL 语句，返回影响的行数                         |
| ExecuteIdentity      | long                       |                         | 执行 SQL 语句，返回自增值                             |
| ExecuteInserted      | List\<T1\>                 |                         | 执行 SQL 语句，返回插入后的记录                       |
| ExecuteSqlBulkCopy   | void                       |                         | SqlServer 特有的功能，执行 SqlBulkCopy 批量插入的封装 |
| ExecutePgCopy        | void                       |                         | PostgreSQL 特有的功能，执行 Copy 批量导入数据         |

---

## IUpdate

| 方法            | 返回值     | 参数                    | 描述                                                                          |
| --------------- | ---------- | ----------------------- | ----------------------------------------------------------------------------- |
| SetSource       | \<this\>   | T1 \| IEnumerable\<T1\> | 更新数据，设置更新的实体                                                      |
| IgnoreColumns   | \<this\>   | Lambda                  | 忽略的列                                                                      |
| Set             | \<this\>   | Lambda, value           | 设置列的新值，Set(a => a.Name, "newvalue")                                    |
| Set             | \<this\>   | Lambda                  | 设置列的的新值为基础上增加，Set(a => a.Clicks + 1)，相当于 clicks=clicks+1    |
| SetDto          | \<this\>   | object                  | 根据 dto 更新的方法                                                           |
| SetRaw          | \<this\>   | string, parms           | 设置值，自定义 SQL 语法，SetRaw("title = ?title", new { title = "newtitle" }) |
| Where           | \<this\>   | Lambda                  | 表达式条件，仅支持实体基础成员（不包含导航对象）                              |
| Where           | \<this\>   | string, parms           | 原生 sql 语法条件，Where("id = ?id", new { id = 1 })                          |
| Where           | \<this\>   | T1 \| IEnumerable\<T1\> | 传入实体或集合，将其主键作为条件                                              |
| WhereExists     | \<this\>   | ISelect                 | 子查询是否存在                                                                |
| CommandTimeout  | \<this\>   | int                     | 命令超时设置(秒)                                                              |
| WithTransaction | \<this\>   | DbTransaction           | 设置事务对象                                                                  |
| WithConnection  | \<this\>   | DbConnection            | 设置连接对象                                                                  |
| ToSql           | string     |                         | 返回即将执行的 SQL 语句                                                       |
| ExecuteAffrows  | long       |                         | 执行 SQL 语句，返回影响的行数                                                 |
| ExecuteUpdated  | List\<T1\> |                         | 执行 SQL 语句，返回更新后的记录                                               |

---

## IDelete

| 方法            | 返回值     | 参数                    | 描述                                                 |
| --------------- | ---------- | ----------------------- | ---------------------------------------------------- |
| Where           | \<this\>   | Lambda                  | 表达式条件，仅支持实体基础成员（不包含导航对象）     |
| Where           | \<this\>   | string, parms           | 原生 sql 语法条件，Where("id = ?id", new { id = 1 }) |
| Where           | \<this\>   | T1 \| IEnumerable\<T1\> | 传入实体或集合，将其主键作为条件                     |
| WhereExists     | \<this\>   | ISelect                 | 子查询是否存在                                       |
| CommandTimeout  | \<this\>   | int                     | 命令超时设置(秒)                                     |
| WithTransaction | \<this\>   | DbTransaction           | 设置事务对象                                         |
| WithConnection  | \<this\>   | DbConnection            | 设置连接对象                                         |
| ToSql           | string     |                         | 返回即将执行的 SQL 语句                              |
| ExecuteAffrows  | long       |                         | 执行 SQL 语句，返回影响的行数                        |
| ExecuteDeleted  | List\<T1\> |                         | 执行 SQL 语句，返回被删除的记录                      |
