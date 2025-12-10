# 更新日志

大约每月一次版本号，暂时以修复 bug 为主

## v3.5.304

- **修复 Contains 解决可能在 net10 出现的问题；**#2144
- 增加 Clickhouse DateOnly 支持；
- 增加 GBase ExecuteInserted/ExecuteUpdated/ExecuteDeleted 方法；
- 增加 GBase CodeFirst 可新增列；
- 修复 南大通用使用 DateTime.Date 操作无法比较的问题；
- 修复 南大通用对 text 写入报错的问题；
- 修复 pgsql 驱动使用 UseMergeInto 语法在 InsertOrUpdate PgCopy 生成了错误的 SQL；
- 修复 opengauss 使用 pg 驱动时 merge 语法错误和增加二进制字段值显式类型转换；
- 修复 DataType 在 Custom 项目下的设置问题；#2153

## v3.5.302

- 升级到 .NET 10.0；
- 添加 IUpdate.SetByPropertyName 动态指定属性更新；
- 修复 MySql Enum MapType(int) 表达式值解析 bug；
- 修复 Firebird 批量插入异常问题（BLOB SUB_TYPE BINARY 需要参数化命令）；#2139
- 修复 KingbaseES bool 类型解析为 true/false；
- 优化 KingbaseES V9 支持和读取链接字符串中的 SearchPath 来确定架构模式；
- 优化 强制索引(WithIndex)同时支持 MySql/Oracle/SqlServer/Sqlite；#2130
- 优化 PG临时主键插入或更新时自增主键不插入；#2133
- 修复 ClickHouseBulkCopy 没传 ColumnNames 与未调用 InitAsync 可能导致 Column names not initialized. Call InitAsync once to load column data；
- 补充 IUnitOfWorkManager；#2127
- 升级 DuckDB to v1.4.1；#2128
- 升级 kdbndp.dll to V9.3.7.1030

## v3.5.215

- 修复 Clickhouse 批量新增因未指定 Columns 导致报错；
- 修复 ClickHouse .LimitBy；#2114
- 修复 AOP 优先级最高 Aop.ConfigEntity 无法获取 ModifyIndexResult；
- 修复 ZeroDbContext WhereDyanmicFilter DataRange bug；
- 修复 ZeroDbContext 多表 Schema 问题；
- 修复 OracleDBFirst 生成实体 Schema 清空导致的 -match 无法匹配表；
- 修复 子查询In ToList.Contains 开启参数化后可能丢失参数的 bug；UseGenerateCommandParameterWithLambda
- 优化 WithLock(NoLock) 同时兼容 SqlServer、达梦；#2058
- 优化 SqliteDbFirst 输入参数处理；
- 优化 QuestDb IHttpClientFactory、IServiceCollection 相关逻辑；
- 优化 QuestDb Insert Update 相关逻辑；
- 调整 ClickHouse 驱动 ClickHouse.Client 改成 ClickHouse.Driver；

## v3.5.213

- 调整 ManyToMany 不一定非要双边设置；
- 修复 pgsql WithTempQuery + ToList 对于 bool 类型处理导致的性能问题；#2093
- 修复 非公开无参的实体无法获取默认值问题；#2085
- 修复 ZeroDbEntity WhereDynamic 多表匹配问题；
- 修复 Aop.AuditValue 值变化状态的判断问题；#2101
- 修复 SqlServer DbFirst 大小写判断问题；
- 修复 MySql 生成 DDL 会报错问题；
- 补充 MySql DbFirst Index Name 值；
- 补充 pgsql FreeSql.Generator 默认值 uuid_generate_v4() 生成；#2088

## v3.5.212

- 修复 Oracle InsertOrUpdate Bug；#2047

## v3.5.211

- 修复 ToChunkAsyncEnumerable 少读一条数据的 bug；#1982 #2056 #2016 #2015
- 修复 System.MemoryExtensions.Contains 解析问题；#1993
- 修复 Group 查询不支持 aot 问题；#2077
- 修复 WithTempQuery + AsTreeCte 生成SQL错误；#2080
- 修复 Oracle DbFirst.GetTableByName() 没有返回字段信息；#2074
- 修复 GBase DbFirst 字典配置问题；#2078
- 修复 GBase 时间类型精度问题；#2079
- 修复 Sqlite CodeFirst 特殊表名问题；
- 完善 ClickHouse/QuestDB/TDengine 支持 enum 映射；
- 增加 SqlExt.Ntile ntile(5) over (order by ...)；

## v3.5.210

- 增强 全局过滤器支持查询、更新、删除指定生效；#2061
- 修复 SqliteCore AOT Expression 隐式将 decimal 转成 int 问题；#2065
- 修复 WithMemory 首行为 NULL 值的情况；#2047
- 修复 ExecuteSqlBulkCopy() 对于表名有空格的情况处理异常；#2055
- 修复 pgsql + JsonMap 无法解析 poco 表达式树的问题；#2060
- 优化 pgsql + JsonMap 自动映射为 jsonb；#2060

## v3.5.209

- 修复 AsTreeCte + InsertInto 语法错误问题；#2045

## v3.5.208

- 修复 MySql Enum MapType(int) .Contains 解析问题；
- 修复 MySql JsonMap Enum 统一解析为 int；#2040

## v3.5.207

- 修复 Lambda .Contains 通配符解析为非 Like 问题；

## v3.5.206

- 增加 ISelect.ToChunkAsyncEnumerable 异步流功能；
- 增加 FreeSql.Extensions.EFModel 从 efcore modelBuilder FluentApi 同步到 IFreeSql；
- 增加 Firebird ForUpdate skiplocked 查询参数；
- 修复 Firebird Inserted/Deleted 与 Repository 级联冲突 bug；#2023
- 修复 Duckdb CodeFirst Create Index异常；#2027
- 修复 ToList 子查询 bug；
- 修复 InsertOrUpdate 更新时触发两次 AuditValue；#2020
- 调整 Repository 状态管理支持 Ignore 属性（非副本）；
- 完善 低代码扩展 FreeSql.Extensions.ZeroEntity；

## v3.5.203

- 增加 ISelect.Clone() 克隆查询对象；
- 增加 ZeroDbContext.LoadSchemaFromDatabase 方法从数据库中加载描述对象；
- 修复 MySqlCodeFirst Primary 迁移逻辑；#2005
- 修复 .In() 非表达式解析场景的 null 处理；
- 忧化 Oracle DbFirst 表特别多的时候生成速度；
- 忧化 GroupBySelf + ToList\<Dto\> 不自动映射；
- 调整 SqlExt 聚合函数 Count 统一返回 int；

## v3.5.202

- 补充 Utils.IsStrict = false 可配置支持中间表有 Id 主键；（解决v3.5.107版本调整影响）

## v3.5.201

- 修复 .Contains in 表达式函数解析在ar-AE区域问题；#2002
- 忧化 IDbFirst Columns 序列与数据库相同；
- 补充 UnitOfWorkManager 支持 DbContext 托管工作单元；

## v3.5.109

- 忧化 GroupBySelf.Where 自动转 having；
- 忧化 FreeSql.Provider.PostgreSQL IPostgreSQLProviderOptions 多态参数接口，设置 InsertOrUpdate 采用 MERGE INTO；

在 FreeSqlBuilder().Build() 之后设置如下：

```csharp
(fsql as IPostgreSQLProviderOptions).UseMergeInto = true;
```

## v3.5.108

- 修复 DbSet/Repository CompareState 报错的问题；#1994
- 增加 ISelect.GroupBySelf 返回 ISelect；

## v3.5.107

- 修复 ISelectGroupingAggregate 自定义解析方法报错的问题；
- 修复 Custom/Odbc char CodeFirst 映射问题；
- 修复 AggregateRoot CompareEntityValue 错误；
- 优化 AggregateRoot MapEntityValue 支持将实体映射到字典；
- 优化 AggregateRoot 不对比 CanUpdate = false 的字段 ；
- 优化 多对多中间表主键配置错误的友好提醒；

## v3.5.106

- 增加 sqlite 批量插入方式 ExecuteSqliteBulkInsert；#1975
- 修复 Oracle CodeFirst nclob cast 转换问题；
- 修复 JsonMap Deserialize surpport JsonSerializerSettings；
- 修复 Kingbase 判断 v8r3 版本号问题；#1976
- 修复 TDengine DateTime 默认值读取异常；#1980 #1977
  
## v3.5.102-3.5.105

- 增加 ISelect.Join 与 InnerJoin 方式行为一致；
- 增加 ToChunkAsync 异步 Api；#1952
- 增加 SqlExt.AggregateCount/AggregateSum 等方法，区分 SqlExt.Count/SqlExt.Sum 开窗方法；
- 修复 ExpressionTree 无法将 double -> 转成 int 的问题；
- 修复 PgCopy DateTime 映射 date 失败的情况；
- 修复 Npgsql postgis 条件编译问题；#1940
- 修复 MySql.Data MySqlDateTime 读取为 null 的情况；#1960 #1948
- 修复 Oracle CodeFirst clob/blob cast 转换问题；
- 修复 KingBase .net8.0 等目标框架 dll 引用问题；
- 修复 Firebird 表注释迁移问题（列注释正常）；#1913
- 修复 Firebird 批量插入类型转换问题；#1923
- 修复 GBase IsNull 日期解析问题；#1953
- 修复 DmPrivider 连接达梦主从集群会出错问题；#1955
- 修复 达梦数据库上时间相减永远输出为0的问题；#1973
- 修复 CodeFirst 修改表名时重建索引的问题；
- 修复 GroupBy + WithTempQuery + 子查询参数化问题；#1965
- 修复 DateOnly/TimeOnly AOT 裁剪默认报错的问题；
- 修复 DateTime 相减时，出现 IIF 无法转换表达式的错误
- 修复 AdoConnectionPool 默认不生效的问题；
- 修复 CreateInstance 发生歧义的问题；#1962
- 修复 In + MapType 无效的问题；
- 修复 In + 子查询 别名问题；#1967
- 优化 ToList 针对 bool 自动转成 CASE When；
- 优化 SqlServer WithIndex 使用习惯；
- 忧化 DbFirst Oracle 自动批量插入问题；(2020年方法忘记生效）
- 忧化 DateTime.Subtract(date).TotalDays 表达式解析对应 datediff(day, date1, date2)；
- 优化 表达式解析 dArray.Select(p => p.Key).Contains(a.Id)；
- 优化 非 join 的多表查询的 SQL 格式；

## v3.5.101

- 更新 到 .NET9.0；
- **增加 DuckDB 数据库支持；** https://freesql.net/guide/freesql-provider-duckdb.html
- **增加 TDengine 数据库支持（感谢Daily贡献）；** https://freesql.net/guide/freesql-provider-tdengine.html
- 增加 KingBaseES 支持数组等类型（参考 PostgreSQL）；
- 增加 Pgsql/MySql DateOnly/TimeOnly 映射；#1868 #1763 #939 #991
- 增加 OracleUs7ascii 写入处理特性；
- 增加 JsonMap Poco Lambda 表达式成员解析；
- 增加 FromQuery 参数由5个加到16个；
- 优化 FromQuery/UnionAll 在子查中继续嵌套；
- 优化 ISelect\<object\>.WithMemory 对匿名类型的支持；
- 优化 Lambda Dto 指定 .Any() 自动转成 Case when；
- 优化 ExpressionCall + DynamicInvoke 的解析；
- 优化 LIKE 表达式解析 #1870；
- 优化 Lambda Min/Max/First 针对 DateTime 类型不自动处理 IsNull 逻辑，因为各数据库没有统一默认值；
- 优化 DateTime.Subtract(date).TotalSecods 等 lambda 表达式解析，对应 datediff；
- 优化 DbSet/Repository 删除多主键分批300，防止 SQL AND OR 过长问题；
- 优化 DM/KDB/ST 默认使用 ado.net 连接池；
- 扩展 TypeHandler override FluentApi 设置；
- 扩展 SqlExt.DateDiff 时间差值计算；
- 扩展 a.Id.In(..) 自定义函数解析，或 new[]{ 1,2,3 }.Contains(a.Id) 相同；
- 修复 Repository + AuditValue + Attach 问题；#1931 #1746
- 修复 GBase serial8/bigserial 自增回填的问题；#1919
- 修复 Xugu DataType 对应问题；#1934 #1933
- 修复 Firebird 批量插入 varchar 追加空格的问题；#1923
- 修复 Guid.NewGuid().ToString().Replace("-", "") 3.2.810 之后版本的解析问题；
- 修复 UnionAll + OrderBy 未处理嵌套的问题；
- 移除 TimeSpan 过度 Lambda 解析；
- 移除 OdbcDameng/OdbcKingbaseES；
- 移除 Resources 转换成 static class 静态类；#1917
- 移除 fsql.GetGuidRepository 改用 fsql.GetRepository\<T, Guid\>()；
- 修复 DateOnly/TimeOnly 映射问题；#1868 #1855 #1763 #939 #991

## v3.2.833

- 添加 Aop.ConfigEntity 动态设置表名功能；#364 #1835 #1729 #1542 #1248 #1247 #407 #387
- 增加 UpdateDict/DeleteDict 方法 Where(sql)；#1840
- 优化 GroupBy 聚合函数 Count(bool) 解析成 sum(case when)；#1841

## v3.2.832

- 修复 \*/表达式解析问题；#1836
- 修复 Extesions.Linq COUNT Distinct 生成sql错误；#1838
- 优化 Ado读写分离存储过程默认使用从库；#1833
- 增加 ZeroEntity 自定义异常及相关；

## v3.2.830

- 增加 ClickHouse 表分区支持；（感谢d4ilys贡献）
- 修复 .Contains('b%') 部分数据库函数参数位置错误；#1826
- 修复 ClickHouse 批量更新 DateTime 问题；
- 修复 Cilckhouse CodeFirst主键问题；
- 调整 命名空间 FreeSql.Provider.ClickHouse.Attributes -> FreeSql.DataAnnotations；#1815

## v3.2.825

- 修复 开发环境分层编译，可能导致XML注释文件被锁报错的问题；
- 修复 聚合根仓储级联插入 OnToMany 雪花主键只插入一条记录；

## v3.2.822

- 增加 vb.net Lambda 解析 AddChecked/SubtractChecked/MultiplyChecked；
- 修复 时枚举转 int 再转字符串报错；#1781

## v3.2.821

- 修复 clickhouse.client 7.2.2 批量插入失败问题；#1776
- 修复 IInsertOrUpdate.ExecuteMySqlBulkCopyAsync 异步方法会出现空引用的异常；#1762
- 修复 DynamicCompileBuilder Extend 方法设置基类后失效问题；#1774

## v3.2.820

- 增加 DynamicEntity TypeBuilder 只读属性；
- 修复 .NET9 TimeSpan.FromSeconds Reflect bug；#1748
- 修复 IBaseRepository.IncludePropertyName 可能报错的问题；#1740
- 修复 弱类型 IBaseRepository\<object\> 级联操作问题；#1740
- 修复 Where(HzyTuple) 参数为 null 时的错误；#1744
- 修复 IUpdate.SetSource SqlServer 批量更新 Cast 问题；#1755
- 修复 SqlServer 导航属性 .Any 布尔子条件解析问题；
- 优化 DbSet/Repository Attach 与 CanUpdate AuditValue 状态不同步问题；#1746
- 优化 QuestDb BulkCopy 重命名为：ExecuteQuestDbBulkCopy；#1758
- 优化 Clickhouse BulkCopy 重命名为：ExecuteClickHouseBulkCopy；#1758

## v3.2.815

- 修复 MySqlEnum CHAR/BYTE 替换后前面多个空格的问题；#1737
- 修复 Clickhouse ToInt32/ToInt64 解析错误；
- 修复 WithMemory 对 InsertValueSql 属性无效的问题；
- 修复 ZeroDbContext GroupBy BUG；
- 修复 聚合根仓储 InsertOrUpdate OneToMany 只插入一条记录的 bug；
- 优化 TypeHandlers 支持 Enum 枚举映射规则；#1634

## v3.2.812

- 增加 DbContextOptions.AuditValue 基于 Ioc Scoped 审计值；
- 优化 ManyToMany 导航属性约定命名匹配嵌套类；
- 修复 MySql AsTreeCte pathSelector 别名问题；
- 修复 ClickHouse UpdateDict 报错问题；#1712
- 修复 MsAccess 日期问题；#1724 #1725

## v3.2.810

- 修复 GroupBy + WithTempQuery 别名问题；
- 修复 DbContext/Repository InsertOrUpdate 无变化时触发 Insert 逻辑报错；#1700
- 修复 ClickHouse 数组类型 hasAny 与 In 解析冲突问题；#1699
- 补充 WithMemory null/Empty 参数判断；
- 优化 表达式树解析；

## v3.2.808

- **增加 低代码扩展包 [FreeSql.Extensions.ZeroEntity](../guide/lowcode.md)；**
- **增加 Clickhouse Bool/Array 类型适配；（感谢 d4ilys）#1568**
- 增加 Clickhouse BulkCopy；
- 增加 IBaseRepository.AsTable 重载方法支持多表表名设置；
- **增加 IAsTable 自动分表支持不规则时间间隔；**
- **增加 IAsTable.SetTableName 自动分表设置分表名；**
- **增加 IAsTable.SetDefaultAllTables 自动分表拦截未使用 where 条件的场景；**
- 增加 IUpdate.ExecuteUpdated 指定字段返回；#1681
- 增加 IUpdate.SetDtoIgnore 忽略Dto更新方法；#1688
- 增加 ICodeFirst.SyncStructure(TableInfo) 重载方法迁移表结构；
- 增加 IUpdate/IDelete WhereDynamicFilter API；#1521
- 增加 WithSql(..).WhereDynamicFilter 的支持；
- 增加 pgsql 扩展方法 ISelect.DistinctOn；#1680
- 修复 Column DbType 与 StringLength 多次替换问题；
- 修复 Where(a => a.bool) 当使用了 MapType(int) 时出现 bug；
- 修复 SqlServer 批量更新 bool? null 值生成多余的 case when SQL；
- 修复 Xugu 批量插入/更新 SQL 报错；
- 修复 OledbOracle 参数化处理 bug；
- 修复 多表子查询参数化共享问题；
- 修复 嵌套查询 DTO 映射可能触发循环引用 bug；
- 补充 达梦 IDbFirst datetime 处理；
- 补充 FluentApi AsTable 方法；
- **优化 自动分表 join 分表（自动贴合）；**
- 优化 UnionAll + WithTempQuery 嵌套的 SQL；
- 优化 Update 无字段时不做任何处理；
- 优化 IUpdate 未使用 .Set 时忽略执行；#1694
- 优化 表达式解析变量或常量 ToString；

## v3.2.805

- 更新 支持到 .net8.0，FreeSql.DbContext 放弃 .netcoreapp2.1 依赖注入；
- 调整 DataType.SqlServer/MySql/PostgreSQL 默认使用 Ado 连接池；
- 增加 InsertDict ExecuteIdentity 重载指定自增列；
- 修复 Expression 导致 AOT 运行失败的问题；
- 修复 MySql 8.0 索引 DESC 的判断；#1664
- 修复 Xugu Insert + AsTable + ExecuteIdentity bug；
- 修复 虚谷日期格式化函数映射；
- 优化 RereadSql 支持表的其他字段使用；#1655

## v3.2.802

- 增加 Aop.AuditDataReader 参数属性 PropertyInfo，实现自定义拦截；
- 修复 v3.2.801 AsTreeCte cte_path 别名问题；
- 修复 UpdateJoin SetIf 逻辑判断问题；
- 修复 UpdateJoin IsVersion 字段的别名问题；
- 修复 RawJoin 可能生成错误的 SQL；
- 修复 Repository.InsertOrUpdate 更新未变化时的 SQL 错误；#1630
- 修复 IncludeMany 变异 Where + ToList dto 无法级联；
- 修复 Ado.net 扩展方法 SqliteCore 支持；#1638
- 修复 Xugu 有关 bug；
- 优化 TypeHandlers 支持 DateTime 映射规则；#1634
- 优化 IUpdateJoin AsTable 同时对多表名设置；
- 优化 多实例情况下 TableInfo 集合缓存；

## v3.2.801

- 增加 FreeSql.Internal.Utils.TypeHandlers 自定义类型映射；
- 增加 IInsertOrUpdate BatchOptions 选项；
- **修复 v3.2.700 oracle/达梦子查询 BUG；**
- 修复 FreeSql.Geneartor 无法生成人大金仓数据库问题；
- 修复 ClickHouse CodeFirst 多主键问题；
- 修复 QuestDB BulkCopy 自定义表名无效的问题；
- 修复 QuestDb And Or 优先级解析问题；
- 修复 DynamicEntity 特性构造函数实例化问题；
- 修复 IInsertOrUpdate BulkCopy 临时表名的问题；#1603
- 修复 IUpdateJoin + 全局过滤器 + 从表不生效问题；#1612
- 修复 JsonMap 进行 null 或非 null 查询；#1613
- 修复 GroupBy + WithTempQuery + .Key.xx + 特性名与实体不同 + 三元表达式解析问题；
- 修复 MySql AsTreeCte cte_path 可能长度过短问题；
- 修复 MySql + InsertOrUpdateDict + IfExistsDoNothing 错误；#1601
- 优化 MySql/Sqlite InsertOrUpdate + IfExistsDoNothing 简化 SQL insert ignore into；#1601
- 优化 WithLock/WithIndex 非 SqlServer 时忽略；
- 优化 MySql ServerTime = DateTimeKind.Utc 不支持 utc_timestamp 默认值问题；#1604
- 优化 ObjectPool 恢复可用的时机；

## v3.2.700 (oracle/达梦子查询有 BUG)

- 增加 GlobalFilter.Apply before 参数将过滤条件插入 where 之前；#1566 #1492
- 增加 多表 As 设置别名的方法 fsql.Select<T1, T2>().As("t1", "t2")；
- 优化 WithTempQuery + SqlServer 未指定 OrderBy 的分页；
- 优化 GetPropertiesDictIgnoreCase 不返回没有 get 的属性；
- 修复 QuestDB Guid 类型的问题；
- 修复 BaseEntity 子查询 .Where 问题；#1586

## v3.2.698

- 增加 FreeSqlBuilder UseAdoConnectionPool 更换连接池方案；#1524 #1343 #1283 #755
- 增加 InsertOrUpdateDict WhereIdentityPrimary 方法；
- 增加 pgsql 索引 B_Tree, Hash, GiST, GIN, SP_GiST, BRIN；
- 修复 pgsql jsonb poco 方案联表查询问题；#1549 #1071
- 修复 pgsql Geo 函数自定义解析深度问题；#1422
- 修复 PgCopy 处理 jsonb 类型的问题；#1532
- 修复 Enum.ToString() 即使 MapType=int 也应解析成 string；#1252 #806
- 修复 repository/dbset AddRange AuditValue IEnumable 失败的 bug；#1545
- 修复 达梦某情况连接串解析 user id 问题；
- 修复 QuestDB 表达式解析 DateTime.UtcNow bug；
- 修复 QuestDb BulkCopy在特定情况下无法解析表名问题；
- 优化 QuestDB Guid 映射；
- 优化 QuestDB 类型映射，表达式函数解析，新增 QuestFunc 函数解析；
- 优化 uow + ISelect.ToUpdate 事务传播；#1562
- 调整 QuestDB SampleUnits 命名，去掉 s；

## v3.2.697

- 增加 IInsertOrUpdate.UpdateSet 指定更新；
- 修复 3.2.696 自动分表 bug；#1527 e79860164d5d12e4f7df747f0e29503dff301cb7

## v3.2.696

- 修复 \<object\> + AsType + (a as BaseEntity) 解析问题；#1427
- 修复 IUpdateJoin 联表更新表达式赋值解析报错；
- 修复 MySqlProvider .NetFramework 下可能报初始化类型错误；
- 修复 自动分表 IUpdate/IDelete AsTable 不生效的问题；
- 修复 FromQuery + WithTempQuery 嵌套查询多层后别名问题；#1510
- 修复 WithTempQuery + Oracle 分页问题；#1519
- 修复 Oracle 插入 LONG RAW 类型的问题；
- 修复 BulkCopyUpdate 临时表名大小写问题；
- 优化 IUpdate 批量 case when 同值的 SQL 生成；#1393

## v3.2.695

- 增加 虚谷数据库 FreeSql.Provider.Xugu；
- 增加 IInsert IgnoreInsertValueSql 方法临时忽略 InsertValueSql 设置；
- 增加 部分 LocalExecuteScalar Aop.CommandAfter 事件；#1481
- 增加 QuestDB SampleBy 对准日历参数；
- 增加 动态操作创建实体API，fsql.CodeFirst.DynamicEntity；（感谢 Daily 贡献）
- 修复 OracleOledb 引起的读取类型问题；

## v3.2.693

- 添加 IInsertOrUpdate 高性能插入或更新 SqlServer/MySql/Oracle/Pgsql/达梦/人大金仓；
- 增加 IUpdate 高性能批量更新 Oracle/达梦/人大金仓；
- 增加 TableInfo.SetAsTable 自动分表的设置；
- **修复 SqlServer 自增 BulkUpdate bug；#1476**
- 修复 表达式树解析 string.Concat 多于3个时的 bug；
- 修复 UpdateJoin null 错误；
- 优化 UpdateJoin Set 固定值解析；
- 优化 .Select\<object\>().WithSql(sql).ToList() 体验；

## v3.2.692

- 增加 IUpdate.Join 联表更新功能；(高风险操作，请谨慎使用)
- 修复 InsertOrUpdateDict Oracle byte[] 长度判断问题；#1462
- 修复 InsertDict 等字典操作在 SqlServer 下的问题；
- 修复 ISelect\<T\> FromQuery 多表重载可能出现 null 报错；

## v3.2.691

- 增加 ISelect\<T\> FromQuery 重载多表嵌套；
- 增加 实体备注从 Description/Display/DisplayName 等特性兼容读取；
- 增加 ISelectGrouping First 方法；
- 增加 IInsertOrUpdate SetSource 重载方法；
- 优化 WithTempQuery + ToList 使用子查询；
- 优化 IInsertOrUpdate SetSource tempPrimary 自增的忽略插入；
- 修复 Clickhouse 自动分表 where 条件分析问题；
- 修复 DBFirst 延迟加载 ManyToOne 返回总是NULL；#1451
- 修复 QuestDB CodeFirst AutoSubtableAttribute/ColumnAttribute判断bug

## v3.2.690

- 增加 [Navigate(xx, TempPrimary = xx)] 与非主键关联；（仅支持查询）
- **修复 3.2.689/3.2.688 WithTempQuery DTO 映射查询遗留问题；**
- 优化 AsTable 自动分表，提供超始小时的设置；

## v3.2.688

- **增加 QuestDB 时序数据库支持；（感谢 Daily 贡献）**
- 修复 Array.Any OR 表达式树解析 bug；
- 修复 GroupBy 之后 WithTempQuery 参数化时未传递的问题；
- 修复 BulkUpdate 触发 Aop.AuditValue Insert 类型的问题；
- 修复 Ado.ExecuteNonQuery 超时参数未生效的问题；#1441
- 修复 Firebird CodeFirst 索引 DESC 问题；#1413
- 优化 Firebird CodeFirst 迁移代码；
- 优化 Firebird 表达式树位运算的适配解析；#1413
- 优化 SqlServer timestamp 行版本的支持；#1412
- 优化 pgsql15.0 部分类型兼容；#1436
- 完善 Sqlite DbFirst 获取索引信息；#1425
- 优化 适配达梦最新驱动；
- 优化 IUpdate 组合更新方式；
- 优化 IUpdate.Set(xx, null) 的情况；
- 优化 ISelect\<object\> AsType 的父子类转换时的情况；#1427
- 优化 支持动态操作 IncludeByPropertyName then.WhereDynamicFilter 操作；
- 优化 WithTempQuery 场景的 DTO 映射查询；

## v3.2.687

- **修复 3.2.686 JsonMap bug；**
- 优化 参数化增加 ExpandoObject 支持；#1403
- 优化 pgsql15.0 Version 版本号处理；
- 优化 pgsql CodeFirst Syncsture CREATE INDEX code；

## v3.2.686

- 增加 FreeSqlBuilder UseQuoteSqlName 设置不使用 [] `` "" 限定符号；
- 增加 Aop.CommandBefore 设置 .CommandText = null 可拦截某次执行；
- 增加 IAdo.ExecuteNonQuery 重载方法（虚谷数据库）；
- **修复 UseSlaveWeight 异步下可能无效的问题；#1382**
- 修复 HzyTuple 嵌套解析问题；#1390
- 修复 AsType 表达式解析问题；#1389
- 修复 pgsql OnConflictDoUpdate 临时主键问题；#1393
- 修复 ClickHouse 联表查询 GLOBAL left join、Ado.Query \* 问题；#1383
- 优化 ClickHouse like 为 positionCaseInsensitive #1386
- 优化 JsonMap 对基础类型的无效判断；#1385
- 优化 IUpdate 批量 case when 同值的 SQL 生成；#1393
- 优化 IAdo.ConnectionString 使用 UseConnectionFactory 时值为 NULL 的问题；

## v3.2.685

- **增加 IUpdate\<T\> BulkCopy 批量更新扩展方法；（暂时支持 SqlServer/MySql/PostgreSQL）**
- 修复 ClickHouse CodeFirst 表结构同步问题；
- 修复 ISelectGrouping ToSql AsProperty 别名无效问题；
- 优化 UnitOfWork 与 ForUpdate 事务开启逻辑；
- 优化 MySqlConnector MySqlDataTime 读取；
- 优化 linq.dynamic Expression Invoke 解析；#1378

## v3.2.684

- **修复 Firebird CodeFirst.SyncStructure 自增主键错误；(受影响版本 3.2.666-3.2.683)**
- 修复 Firebird \[Index("{tablename}\_Name" 分表索引名未处理的 bug；#1346
- 修复 InsertDict DBNull.Value 值无法插入的问题；#1336
- 修复 fsql.InsertOrUpdate SetSource(sql) 无效的 bug；
- 优化 string[].Any(..) 表达式树解析；ReplaceParameterVisitor
- 优化 ISelect\<T1, T2\> 对象 .LeftJoin\<T2\> 表别名；#1348

## v3.2.683

- **修复 Repository/DbContext 同一实例执行报错后续无法再 CRUD；**
- **修复 UnitOfWorkManager + Repository.SaveMany 事务切换问题；**
- 修复 导航属性 PgArrayToMany 数组字段为空时的 bug；
- 修复 导航属性 PgArrayToMany DTO 异步查询报错的 bug（同步方法正常）；
- 修复 SqlExt count/avg 开窗函数参数；#1321
- 修复 Sqlite TimeSpan 类型映射错误；
- 修复 Sqlite Attachs 多库索引 {tablename} 问题；
- 修复 EndEdit 未触发 OnEntityChange；
- 修复 fsql.InsertOrUpdate CanInsert=false,CanUpdate=true (mysql/pgsql）不生效的 bug；
- 修复 聚合根仓储（实验） InsertOrUpdate 重复插入的 bug；
- 修复 聚合根仓储（实验） Update 未更新自增状态管理的 bug；
- 修复 SqlServer WithSql + WithLock bug；
- 修复 ClickHouse Ado 参数化无效的问题；#1340
- 修复 Odbc 自定义 N'' 无效；#1332
- 修复 DbContext DbSet 属性初始并发时未触发 OnModelCreating；#1333
- 修复 Utils.ReplaceSqlConstString bug；
- 扩展 UseMessagePackMap 示例；
- 优化 UpdateDict 支持 .IsVersion 乐观锁设置；
- 优化 InsertDict DBNull.Value 值处理；#1336
- 优化 表达式树解析 w => (w as TBase).Id；
- 优化 导航属性集合 .Exists 效果与 .Any 相同；
- 优化 MySql CodeFirst 判断表是否存在的查询语句性能；
- 优化 SqlServer2005 TOP 1 查询；
- 完善 SqlServer WithLock + WithIndex 扩展方法；

## v3.2.682

- 优化 人大金仓 KingbaseES 兼容 V8R3/V8R6；#931 #325

## v3.2.681

- **修复 3.2.666-3.2.680 子查询的特殊 bug；**
- 增加 fsql.Ado.QuerySingle(() => new {}) 扩展方法实现无表查询 SELECT now(), utc_timestamp()
- 优化 min pool size 与 max pool size 连接串设置；
- 优化 导航属性未配置关系先 Where 后 InnerJoin 的问题；

## v3.2.680

- **优化 WithTempQuery 多对象选择同别名问题；** #1192
- 修复 WithTempQuery + Column + GroupBy + Key 指定列名的问题；
- 修复 GlobalFilter.ApplyIf + Repository.DataFilter.DisableAll 可能不生效的问题；
- 修复 UpdateDict 不支持 SET NULL 的更新；#1257
- 修复 ClickHuse DBFrist ExistsTable；
- 增加 ClickHouse LimitBy/Sample 查询方法；
- **增加 所有[国产数据库](https://freesql.net/guide/freesql-provider-custom.html)支持 CustomMySql、CustomPostgreSQL、CustomOracle、CustomSqlServer 自定义适配；**
- 优化 DbSet/Repository 防止 Aop.AuditValue 触发两次；
- 优化 表达式树解析为 NULL 的提示；
- 优化 UseMappingPriority 与实体元数据逻辑；#1247
- 优化 ServerTime 与 IUpdate.Set 指定更新的重复问题；#1251

## v3.2.669

- 修复 WithTempQuery + RereadSql 无别名的问题；
- 修复 WithTempQuery + FromQuery + 子查询的 bug；
- 修复 WithTempQuery + Column(Name 别名问题；
- 优化 CheckAvailable retry 重试一次；

## v3.2.666

- **增加 WithTempQuery + FromQuery 嵌套查询功能；** #1192
- **增加 FreeSql.Provider.OracleOledb 解决 US7ASCII 中文乱码问题；**
- **增加 UnionALL 联合查询；** #1106 #1104 #668 #478 #432 #213 #138
- 增加 WithMemory 基于内存查询，对标 WithSql；
- 增加 AuditValue ObjectAuditBreak 实现对象只触发一次审计事件；
- 增加 IncludeByPropertyName 重载 then 参数；#1214
- 增加 IInsertOrUpdate.SetSource(sql) 重载方法；
- 增加 DynamicFilterCustom 增加支持 Expression 返回值；
- 修复 UseGenerateCommandParameterWithLambda(true) 与 GroupBy 查询不生效 bug；
- 修复 ToList 子查询开启参数化重复参数的 bug；#1205
- **修复 string[] JsonMap bug；** #653
- 修复 ManyToMany 不会触发 AsTable 的 bug；
- 修复 Clickhouse Insert AsTable 表名处理 bug；
- 修复 ClickHouse 单条记录插入\t \n /失败的 bug；
- 修复 子查询使用基类 + AsType 可能产生的 bug；#1215
- 修复 SqlServer2005/2008 Skip 问题（未设置 Take 时）；
- 修复 MySql/SqlServer DbFirst 获取字段位置的问题；
- 修复 DbContext/Repository Primary decimal 状态管理 key 精度处理 bug；
- 修复 DbContext/Repository 无构造函数的实体对象不跟踪问题；
- 修复 ToSql AsProperty 大小别名问题；
- 优化 IncludeByPropertyName + AsType；
- 优化 字典crud TableInfo 合并规则；#1180
- 优化 IUpdate.Set 字符串累加本身为 NULL 的情况；#1209
- 优化 WhereDynamicFilter DateRange 情况；
- 优化 Oracle IN :ids 值传入 IList 时报错；
- 优化 Dameng 单独适配 netcore3.1；#1094
- **优化 PrevReheatConnectionPool 预热；**
- 优化 全局过滤器禁用时子查询传播问题；#1208
- **优化 子查询别名为 a 的情况；#1201**

## v3.2.665

- 增加 IsVersion string 字符串乐观锁；[#1178](https://github.com/dotnetcore/FreeSql/issues/1178)
- 增加 IUpdate.SetSource ignoreVersion 参数可实现忽略乐观锁；[#1161](https://github.com/dotnetcore/FreeSql/issues/1161)
- 增加 IInsertOrUpdate.SetSource(items, tempPrimarys) 指定临时主键参数；[#1160](https://github.com/dotnetcore/FreeSql/issues/1160)
- 增加 DbContext/Repository 审计日志 ChangeInfo 增加属性 EntityType；
- 修复 SqlServer WithLock 子查询不生效的 bug；[#1159](https://github.com/dotnetcore/FreeSql/issues/1159)
- 修复 AsTreeCte + AsTable 无效的 bug；[#1176](https://github.com/dotnetcore/FreeSql/issues/1176)
- 修复 UseGenerateCommandParameterWithLambda(true) 问题；[#1173](https://github.com/dotnetcore/FreeSql/issues/1173) [#900](https://github.com/dotnetcore/FreeSql/issues/900)
- 修复 SetSource 临时主键重载方法 + Column 设置 Name 后无效的 bug；
- 修复 Dto 映射查询 Negate 表达式解析 bug；
- 修复 pgsql OldName + XML 注释迁移代码顺序问题；
- 优化 string Contains 模糊查找 % 的情况；

## v3.2.664

- **修复 UseGenerateCommandParameterWithLambda 子查询并发 bug；[#1155](https://github.com/dotnetcore/FreeSql/issues/1155) （重要）**
- 修复 pgsql Dto 映射使用常量 false 转换失败；
- 修复 IIF 三元表达式树解析 bool HasValue 问题；
- 修复 MySqlConnector BulkCopy 映射顺序问题；
- 优化 XML 注释读取支持 interface；
- support provider、Extensions Exceptions 多语言

## v3.2.662

- **调整 pgsql10 自增映射使用 GENERATED BY DEFAULT AS IDENTITY，低版本仍然使用 serial；**
- **增加 PgArrayToMany 专属导航属性；[#1145](https://github.com/dotnetcore/FreeSql/issues/1145)**
- 增加 ObservableCollection 级联加载和保存；
- 优化 FluentApi 继承关系可直接 ConfigEntity\<BaseEntity\> 生效；#1144
- 修复 达梦 min pool size 预热数量匹配 bug；
- 修复 v3.2.620 - v3.2.661 子查询 sum/min/max/avg 默认加 isnull 防止为 NULL 情况，日期类型处理错误 #1140 1b84a0069679c92ccaff9aa8c33023e4d34262cd
- 修复 AsTable 子查询未传播的问题；#1103
- 修复 IncludeByPropertyName fromFirstTable 判断错误；#278
- 修复 GroupBy 特殊情况下 AsProperty 无效的 bug；#1141
- 修复 MySql CodeFirst OldName + Comment 迁移问题；#1147
- 修复 pgsql DbFirst 未正确获取 Position 值；#1154

## v3.2.661

- 增加 UseMappingPriority 指定映射优先级；[#387](https://github.com/dotnetcore/FreeSql/issues/387) [#69](https://github.com/dotnetcore/FreeSql/issues/69) [#99](https://github.com/dotnetcore/FreeSql/issues/99)
- 增加 AuditValueEventArgs Object 参数；[#1128](https://github.com/dotnetcore/FreeSql/issues/1128)
- 修复 pgsql varchar(120) CodeFirst 迁移不修改长度；
- 修复 ISelect.InsertInto 未执行自动迁移；
- 修复 UseCommandParameterWithLambda IN 参数化判断 的逻辑 bug；[#1137](https://github.com/dotnetcore/FreeSql/issues/1137)
- 优化 连接池不可用、定时检查；
- 优化 Limit + Sum/Avg/Max/Min 为嵌套查询；
- 优化 GroupBy Page 未排序的查询；[#1126](https://github.com/dotnetcore/FreeSql/issues/1126)

## v3.2.651

- **增加 DTO 映射非导航属性的子表查询 ToList，可直接返回集合；**
- 增加 Array.Any(x => x.id == a.Id && ..) 表达式树解析；[#243](https://github.com/dotnetcore/FreeSql/issues/243)
- 增加 pgsql numeric -> BigInteger 映射；[#1100](https://github.com/dotnetcore/FreeSql/issues/1100)
- 增加 [#1108](https://github.com/dotnetcore/FreeSql/issues/1108) Exception 国际化；
- 增加 DynamicFilterCustom 参数 object sender；[#1113](https://github.com/dotnetcore/FreeSql/issues/1113)
- 增加 Fluent API 以继承接口的形式配置实体；[#937](https://github.com/dotnetcore/FreeSql/issues/937)
- 修复 Oracle AsTable 分表嵌套 SQL 拼错错误；[#1098](https://github.com/dotnetcore/FreeSql/issues/1098)
- 修复 AsTable ManyToMany IncludeMany 无效的问题；[#1103](https://github.com/dotnetcore/FreeSql/issues/1103)
- 修复 AsTable 分表 ToAggregate 无法得到汇总；[#1115](https://github.com/dotnetcore/FreeSql/issues/1115)
- 修复 Repository.DataFilter 对 GlobalFilter 控制无效的 bug；[#1028](https://github.com/dotnetcore/FreeSql/issues/1028) [#846](https://github.com/dotnetcore/FreeSql/issues/846)
- 修复 IN 查询区分 varchar/nvarchar；
- 修复 Oracle clob 参数化类型设置问题；[#1116](https://github.com/dotnetcore/FreeSql/issues/1116)
- 修复 MySql 子查询 Enum MapType(int) 表达式判断解析 bug；[#1118](https://github.com/dotnetcore/FreeSql/issues/1118)
- 优化 AsTable 自动分表 Where Equal 判断；[#1104](https://github.com/dotnetcore/FreeSql/issues/1104)
- 优化 子查询 sum/min/max/avg 默认加 isnull 防止为 NULL 情况；
- 优化 EnableCascadeSave 级联保存执行逻辑，提升性能；
- 优化 RawJoin 支持 FULL JOIN 等自定义联表映射；
- 优化 IncludeMany 三级导航对象自动 \_included；[#1113](https://github.com/dotnetcore/FreeSql/issues/1113)

## v3.2.100 - v3.2.640

- **增加 InsertDict/UpdateDict/DeleteDict/InsertOrUpdateDict 针对字典的 CUD 方法；#481**
- 增加 UseSlaveWeight 读权重设置；#1046
- **增加 [Table(AsTable = xx)] 自动分表特性，待完善；#1066**
- 增加 [FreeSql.Provider.SqliteCore](https://freesql.net/guide/freesql-provider-sqlitecore.html) 支持 Sqlite 加密；
- 增加 IList\<T\> IncludeByPropertyName 扩展方法，支持字符串参数；
- **增加 DbSet/Repository DeleteCascadeByDatabase 级联删除(基于数据库)**；
- 调整 DbSet/Repository EnableAddOrUpdateNavigateList 支持 OneToOne 级联保存、级联删除(基于对象)；
- 修复 Delete.Where in 查询为空时，异步操作仍然执行删除；#1068 **【受影响版本 v3.2.302】**
- 修复 InsertOrUpdateDict 异常；#1067 **【受影响版本 v3.2.301、v3.2.300、v3.2.200】**
- 修复 InsertDict 部分新功能遗留问题(特别是 Oracle)；**【受影响版本 v3.2.301、v3.2.300、v3.2.200】**
- 修复 InsertDict/UpdateDict 等字典操作在 DbContext.Orm 下无法使用的 bug；#1064 **【受影响版本 v3.2.300、v3.2.200】**
- 修复 MapType 复杂表达式树解析 bug；#1062
- 修复 UseGenerateCommandParameterWithLambda 对不可参数化的数据类型冲突的 bug；#1061 #900
- 修复 MySql Set 类型空格处理问题；#1059
- 修复 SaveManyAsync 多对多历史漏改的问题（同步无问题）；
- 修复 OR 表达式处理情况；#1047
- 修复 ClickHouse 设置 NoneParameter 会报错问题；
- 修复 Clickhouse 连接池使用问题；#646 #968 #969 #943
- 修复 pgsql IList -> JArray 映射；#1092
- 修复 pgsql DbFirst IsPrimary bug；
- 修复 JsonMap 与导航属性的联表查询报错的 bug；#996
- 修复 子查询 WhereIf 可能失败的 bug；
- 修复 StringLength 设置后 IsNullable = false 无生效的问题；
- 修复 UseConnectionFactory 参数化问题；
- 修复 参数值为原始 DbParameter 时转换类型报错；
- 修复 UseGenerateCommandParameterWithLambda 子查询 IN bug；#900
- 修复 InsertValueSql 在仓储插入后不返回最新值；
- 完善 SqlServer BulkCopy 插入 DateTime 最小值问题；
- **优化 导航集合属性访问，可省略 AsSelect；**
- 优化 DbContext/Repository Update 实体有 ServerTime 既使无状态变化也必然更新的逻辑；
- 优化 DbContext/Repository 插入非主键自增回填；
- 优化 ToList\<Dto\> jsonb 映射；
- 优化 dywhere IN 查询按 500 元素分割；#1091
- 优化 IIF 表达式解析；

## v3.0.100（2021/12/17）

- **增加 南大通用 Gbase 国产数据库支持；**
- **增加 ClickHouse 数据库语法支持；**
- 增加 DbContext/Repository 比较变化方法 CompareState；
- **增加 DynamicFilter Custom 自定义解析；**
- 增加 ToDataTableByPropertyName 动态查询功能；
- 优化 兼容排序 OrderBy(a => new {}) 语法；
- 优化 pgsql jsonb 映射，支持 List，mysql limit in 子查询；
- 优化 InsertOrUpdate<> 使用 InsertOrUpdate<list<>>时，提示友好异常。
- 修复 BulkCopy 与线程事务未传播的 bug；#962
- 修复 AsTreeCte + RereadSql 不能同时使用的 bug；#964
- 修复 FreeSql.Generator 工具生成 model 失败 [#882](https://github.com/dotnetcore/FreeSql/issues/882)

> 更多历史更新日志，请访问：https://github.com/dotnetcore/FreeSql/wiki/%e6%9b%b4%e6%96%b0%e6%97%a5%e5%bf%97
