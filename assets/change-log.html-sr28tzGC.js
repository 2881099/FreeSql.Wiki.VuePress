import{_ as a}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as n,o as s,c as u,a as e,b as l,d as i,w as d,e as r}from"./app-DdQEFkYK.js";const h={},c=r('<h1 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h1><p>大约每月一次版本号，暂时以修复 bug 为主</p><h2 id="v3-2-825" tabindex="-1"><a class="header-anchor" href="#v3-2-825" aria-hidden="true">#</a> v3.2.825</h2><ul><li>修复 开发环境分层编译，可能导致XML注释文件被锁报错的问题；</li><li>修复 聚合根仓储级联插入 OnToMany 雪花主键只插入一条记录；</li></ul><h2 id="v3-2-822" tabindex="-1"><a class="header-anchor" href="#v3-2-822" aria-hidden="true">#</a> v3.2.822</h2><ul><li>增加 vb.net Lambda 解析 AddChecked/SubtractChecked/MultiplyChecked；</li><li>修复 时枚举转 int 再转字符串报错；#1781</li></ul><h2 id="v3-2-821" tabindex="-1"><a class="header-anchor" href="#v3-2-821" aria-hidden="true">#</a> v3.2.821</h2><ul><li>修复 clickhouse.client 7.2.2 批量插入失败问题；#1776</li><li>修复 IInsertOrUpdate.ExecuteMySqlBulkCopyAsync 异步方法会出现空引用的异常；#1762</li><li>修复 DynamicCompileBuilder Extend 方法设置基类后失效问题；#1774</li></ul><h2 id="v3-2-820" tabindex="-1"><a class="header-anchor" href="#v3-2-820" aria-hidden="true">#</a> v3.2.820</h2><ul><li>增加 DynamicEntity TypeBuilder 只读属性；</li><li>修复 .NET9 TimeSpan.FromSeconds Reflect bug；#1748</li><li>修复 IBaseRepository.IncludePropertyName 可能报错的问题；#1740</li><li>修复 弱类型 IBaseRepository&lt;object&gt; 级联操作问题；#1740</li><li>修复 Where(HzyTuple) 参数为 null 时的错误；#1744</li><li>修复 IUpdate.SetSource SqlServer 批量更新 Cast 问题；#1755</li><li>修复 SqlServer 导航属性 .Any 布尔子条件解析问题；</li><li>优化 DbSet/Repository Attach 与 CanUpdate AuditValue 状态不同步问题；#1746</li><li>优化 QuestDb BulkCopy 重命名为：ExecuteQuestDbBulkCopy；#1758</li><li>优化 Clickhouse BulkCopy 重命名为：ExecuteClickHouseBulkCopy；#1758</li></ul><h2 id="v3-2-815" tabindex="-1"><a class="header-anchor" href="#v3-2-815" aria-hidden="true">#</a> v3.2.815</h2><ul><li>修复 MySqlEnum CHAR/BYTE 替换后前面多个空格的问题；#1737</li><li>修复 Clickhouse ToInt32/ToInt64 解析错误；</li><li>修复 WithMemory 对 InsertValueSql 属性无效的问题；</li><li>修复 ZeroDbContext GroupBy BUG；</li><li>修复 聚合根仓储 InsertOrUpdate OneToMany 只插入一条记录的 bug；</li><li>优化 TypeHandlers 支持 Enum 枚举映射规则；#1634</li></ul><h2 id="v3-2-812" tabindex="-1"><a class="header-anchor" href="#v3-2-812" aria-hidden="true">#</a> v3.2.812</h2><ul><li>增加 DbContextOptions.AuditValue 基于 Ioc Scoped 审计值；</li><li>优化 ManyToMany 导航属性约定命名匹配嵌套类；</li><li>修复 MySql AsTreeCte pathSelector 别名问题；</li><li>修复 ClickHouse UpdateDict 报错问题；#1712</li><li>修复 MsAccess 日期问题；#1724 #1725</li></ul><h2 id="v3-2-810" tabindex="-1"><a class="header-anchor" href="#v3-2-810" aria-hidden="true">#</a> v3.2.810</h2><ul><li>修复 GroupBy + WithTempQuery 别名问题；</li><li>修复 DbContext/Repository InsertOrUpdate 无变化时触发 Insert 逻辑报错；#1700</li><li>修复 ClickHouse 数组类型 hasAny 与 In 解析冲突问题；#1699</li><li>补充 WithMemory null/Empty 参数判断；</li><li>优化 表达式树解析；</li></ul><h2 id="v3-2-808" tabindex="-1"><a class="header-anchor" href="#v3-2-808" aria-hidden="true">#</a> v3.2.808</h2>',17),p=r("<li><strong>增加 Clickhouse Bool/Array 类型适配；（感谢 d4ilys）#1568</strong></li><li>增加 Clickhouse BulkCopy；</li><li>增加 IBaseRepository.AsTable 重载方法支持多表表名设置；</li><li><strong>增加 IAsTable 自动分表支持不规则时间间隔；</strong></li><li><strong>增加 IAsTable.SetTableName 自动分表设置分表名；</strong></li><li><strong>增加 IAsTable.SetDefaultAllTables 自动分表拦截未使用 where 条件的场景；</strong></li><li>增加 IUpdate.ExecuteUpdated 指定字段返回；#1681</li><li>增加 IUpdate.SetDtoIgnore 忽略Dto更新方法；#1688</li><li>增加 ICodeFirst.SyncStructure(TableInfo) 重载方法迁移表结构；</li><li>增加 IUpdate/IDelete WhereDynamicFilter API；#1521</li><li>增加 WithSql(..).WhereDynamicFilter 的支持；</li><li>增加 pgsql 扩展方法 ISelect.DistinctOn；#1680</li><li>修复 Column DbType 与 StringLength 多次替换问题；</li><li>修复 Where(a =&gt; a.bool) 当使用了 MapType(int) 时出现 bug；</li><li>修复 SqlServer 批量更新 bool? null 值生成多余的 case when SQL；</li><li>修复 Xugu 批量插入/更新 SQL 报错；</li><li>修复 OledbOracle 参数化处理 bug；</li><li>修复 多表子查询参数化共享问题；</li><li>修复 嵌套查询 DTO 映射可能触发循环引用 bug；</li><li>补充 达梦 IDbFirst datetime 处理；</li><li>补充 FluentApi AsTable 方法；</li><li><strong>优化 自动分表 join 分表（自动贴合）；</strong></li><li>优化 UnionAll + WithTempQuery 嵌套的 SQL；</li><li>优化 Update 无字段时不做任何处理；</li><li>优化 IUpdate 未使用 .Set 时忽略执行；#1694</li><li>优化 表达式解析变量或常量 ToString；</li>",26),g=r('<h2 id="v3-2-805" tabindex="-1"><a class="header-anchor" href="#v3-2-805" aria-hidden="true">#</a> v3.2.805</h2><ul><li>更新 支持到 .net8.0，FreeSql.DbContext 放弃 .netcoreapp2.1 依赖注入；</li><li>调整 DataType.SqlServer/MySql/PostgreSQL 默认使用 Ado 连接池；</li><li>增加 InsertDict ExecuteIdentity 重载指定自增列；</li><li>修复 Expression 导致 AOT 运行失败的问题；</li><li>修复 MySql 8.0 索引 DESC 的判断；#1664</li><li>修复 Xugu Insert + AsTable + ExecuteIdentity bug；</li><li>修复 虚谷日期格式化函数映射；</li><li>优化 RereadSql 支持表的其他字段使用；#1655</li></ul><h2 id="v3-2-802" tabindex="-1"><a class="header-anchor" href="#v3-2-802" aria-hidden="true">#</a> v3.2.802</h2><ul><li>增加 Aop.AuditDataReader 参数属性 PropertyInfo，实现自定义拦截；</li><li>修复 v3.2.801 AsTreeCte cte_path 别名问题；</li><li>修复 UpdateJoin SetIf 逻辑判断问题；</li><li>修复 UpdateJoin IsVersion 字段的别名问题；</li><li>修复 RawJoin 可能生成错误的 SQL；</li><li>修复 Repository.InsertOrUpdate 更新未变化时的 SQL 错误；#1630</li><li>修复 IncludeMany 变异 Where + ToList dto 无法级联；</li><li>修复 Ado.net 扩展方法 SqliteCore 支持；#1638</li><li>修复 Xugu 有关 bug；</li><li>优化 TypeHandlers 支持 DateTime 映射规则；#1634</li><li>优化 IUpdateJoin AsTable 同时对多表名设置；</li><li>优化 多实例情况下 TableInfo 集合缓存；</li></ul><h2 id="v3-2-801" tabindex="-1"><a class="header-anchor" href="#v3-2-801" aria-hidden="true">#</a> v3.2.801</h2><ul><li>增加 FreeSql.Internal.Utils.TypeHandlers 自定义类型映射；</li><li>增加 IInsertOrUpdate BatchOptions 选项；</li><li><strong>修复 v3.2.700 oracle/达梦子查询 BUG；</strong></li><li>修复 FreeSql.Geneartor 无法生成人大金仓数据库问题；</li><li>修复 ClickHouse CodeFirst 多主键问题；</li><li>修复 QuestDB BulkCopy 自定义表名无效的问题；</li><li>修复 QuestDb And Or 优先级解析问题；</li><li>修复 DynamicEntity 特性构造函数实例化问题；</li><li>修复 IInsertOrUpdate BulkCopy 临时表名的问题；#1603</li><li>修复 IUpdateJoin + 全局过滤器 + 从表不生效问题；#1612</li><li>修复 JsonMap 进行 null 或非 null 查询；#1613</li><li>修复 GroupBy + WithTempQuery + .Key.xx + 特性名与实体不同 + 三元表达式解析问题；</li><li>修复 MySql AsTreeCte cte_path 可能长度过短问题；</li><li>修复 MySql + InsertOrUpdateDict + IfExistsDoNothing 错误；#1601</li><li>优化 MySql/Sqlite InsertOrUpdate + IfExistsDoNothing 简化 SQL insert ignore into；#1601</li><li>优化 WithLock/WithIndex 非 SqlServer 时忽略；</li><li>优化 MySql ServerTime = DateTimeKind.Utc 不支持 utc_timestamp 默认值问题；#1604</li><li>优化 ObjectPool 恢复可用的时机；</li></ul><h2 id="v3-2-700-oracle-达梦子查询有-bug" tabindex="-1"><a class="header-anchor" href="#v3-2-700-oracle-达梦子查询有-bug" aria-hidden="true">#</a> v3.2.700 (oracle/达梦子查询有 BUG)</h2><ul><li>增加 GlobalFilter.Apply before 参数将过滤条件插入 where 之前；#1566 #1492</li><li>增加 多表 As 设置别名的方法 fsql.Select&lt;T1, T2&gt;().As(&quot;t1&quot;, &quot;t2&quot;)；</li><li>优化 WithTempQuery + SqlServer 未指定 OrderBy 的分页；</li><li>优化 GetPropertiesDictIgnoreCase 不返回没有 get 的属性；</li><li>修复 QuestDB Guid 类型的问题；</li><li>修复 BaseEntity 子查询 .Where 问题；#1586</li></ul><h2 id="v3-2-698" tabindex="-1"><a class="header-anchor" href="#v3-2-698" aria-hidden="true">#</a> v3.2.698</h2><ul><li>增加 FreeSqlBuilder UseAdoConnectionPool 更换连接池方案；#1524 #1343 #1283 #755</li><li>增加 InsertOrUpdateDict WhereIdentityPrimary 方法；</li><li>增加 pgsql 索引 B_Tree, Hash, GiST, GIN, SP_GiST, BRIN；</li><li>修复 pgsql jsonb poco 方案联表查询问题；#1549 #1071</li><li>修复 pgsql Geo 函数自定义解析深度问题；#1422</li><li>修复 PgCopy 处理 jsonb 类型的问题；#1532</li><li>修复 Enum.ToString() 即使 MapType=int 也应解析成 string；#1252 #806</li><li>修复 repository/dbset AddRange AuditValue IEnumable 失败的 bug；#1545</li><li>修复 达梦某情况连接串解析 user id 问题；</li><li>修复 QuestDB 表达式解析 DateTime.UtcNow bug；</li><li>修复 QuestDb BulkCopy在特定情况下无法解析表名问题；</li><li>优化 QuestDB Guid 映射；</li><li>优化 QuestDB 类型映射，表达式函数解析，新增 QuestFunc 函数解析；</li><li>优化 uow + ISelect.ToUpdate 事务传播；#1562</li><li>调整 QuestDB SampleUnits 命名，去掉 s；</li></ul><h2 id="v3-2-697" tabindex="-1"><a class="header-anchor" href="#v3-2-697" aria-hidden="true">#</a> v3.2.697</h2><ul><li>增加 IInsertOrUpdate.UpdateSet 指定更新；</li><li>修复 3.2.696 自动分表 bug；#1527 e79860164d5d12e4f7df747f0e29503dff301cb7</li></ul><h2 id="v3-2-696" tabindex="-1"><a class="header-anchor" href="#v3-2-696" aria-hidden="true">#</a> v3.2.696</h2><ul><li>修复 &lt;object&gt; + AsType + (a as BaseEntity) 解析问题；#1427</li><li>修复 IUpdateJoin 联表更新表达式赋值解析报错；</li><li>修复 MySqlProvider .NetFramework 下可能报初始化类型错误；</li><li>修复 自动分表 IUpdate/IDelete AsTable 不生效的问题；</li><li>修复 FromQuery + WithTempQuery 嵌套查询多层后别名问题；#1510</li><li>修复 WithTempQuery + Oracle 分页问题；#1519</li><li>修复 Oracle 插入 LONG RAW 类型的问题；</li><li>修复 BulkCopyUpdate 临时表名大小写问题；</li><li>优化 IUpdate 批量 case when 同值的 SQL 生成；#1393</li></ul><h2 id="v3-2-695" tabindex="-1"><a class="header-anchor" href="#v3-2-695" aria-hidden="true">#</a> v3.2.695</h2><ul><li>增加 虚谷数据库 FreeSql.Provider.Xugu；</li><li>增加 IInsert IgnoreInsertValueSql 方法临时忽略 InsertValueSql 设置；</li><li>增加 部分 LocalExecuteScalar Aop.CommandAfter 事件；#1481</li><li>增加 QuestDB SampleBy 对准日历参数；</li><li>增加 动态操作创建实体API，fsql.CodeFirst.DynamicEntity；（感谢 Daily 贡献）</li><li>修复 OracleOledb 引起的读取类型问题；</li></ul><h2 id="v3-2-693" tabindex="-1"><a class="header-anchor" href="#v3-2-693" aria-hidden="true">#</a> v3.2.693</h2><ul><li>添加 IInsertOrUpdate 高性能插入或更新 SqlServer/MySql/Oracle/Pgsql/达梦/人大金仓；</li><li>增加 IUpdate 高性能批量更新 Oracle/达梦/人大金仓；</li><li>增加 TableInfo.SetAsTable 自动分表的设置；</li><li><strong>修复 SqlServer 自增 BulkUpdate bug；#1476</strong></li><li>修复 表达式树解析 string.Concat 多于3个时的 bug；</li><li>修复 UpdateJoin null 错误；</li><li>优化 UpdateJoin Set 固定值解析；</li><li>优化 .Select&lt;object&gt;().WithSql(sql).ToList() 体验；</li></ul><h2 id="v3-2-692" tabindex="-1"><a class="header-anchor" href="#v3-2-692" aria-hidden="true">#</a> v3.2.692</h2><ul><li>增加 IUpdate.Join 联表更新功能；(高风险操作，请谨慎使用)</li><li>修复 InsertOrUpdateDict Oracle byte[] 长度判断问题；#1462</li><li>修复 InsertDict 等字典操作在 SqlServer 下的问题；</li><li>修复 ISelect&lt;T&gt; FromQuery 多表重载可能出现 null 报错；</li></ul><h2 id="v3-2-691" tabindex="-1"><a class="header-anchor" href="#v3-2-691" aria-hidden="true">#</a> v3.2.691</h2><ul><li>增加 ISelect&lt;T&gt; FromQuery 重载多表嵌套；</li><li>增加 实体备注从 Description/Display/DisplayName 等特性兼容读取；</li><li>增加 ISelectGrouping First 方法；</li><li>增加 IInsertOrUpdate SetSource 重载方法；</li><li>优化 WithTempQuery + ToList 使用子查询；</li><li>优化 IInsertOrUpdate SetSource tempPrimary 自增的忽略插入；</li><li>修复 Clickhouse 自动分表 where 条件分析问题；</li><li>修复 DBFirst 延迟加载 ManyToOne 返回总是NULL；#1451</li><li>修复 QuestDB CodeFirst AutoSubtableAttribute/ColumnAttribute判断bug</li></ul><h2 id="v3-2-690" tabindex="-1"><a class="header-anchor" href="#v3-2-690" aria-hidden="true">#</a> v3.2.690</h2><ul><li>增加 [Navigate(xx, TempPrimary = xx)] 与非主键关联；（仅支持查询）</li><li><strong>修复 3.2.689/3.2.688 WithTempQuery DTO 映射查询遗留问题；</strong></li><li>优化 AsTable 自动分表，提供超始小时的设置；</li></ul><h2 id="v3-2-688" tabindex="-1"><a class="header-anchor" href="#v3-2-688" aria-hidden="true">#</a> v3.2.688</h2><ul><li><strong>增加 QuestDB 时序数据库支持；（感谢 Daily 贡献）</strong></li><li>修复 Array.Any OR 表达式树解析 bug；</li><li>修复 GroupBy 之后 WithTempQuery 参数化时未传递的问题；</li><li>修复 BulkUpdate 触发 Aop.AuditValue Insert 类型的问题；</li><li>修复 Ado.ExecuteNonQuery 超时参数未生效的问题；#1441</li><li>修复 Firebird CodeFirst 索引 DESC 问题；#1413</li><li>优化 Firebird CodeFirst 迁移代码；</li><li>优化 Firebird 表达式树位运算的适配解析；#1413</li><li>优化 SqlServer timestamp 行版本的支持；#1412</li><li>优化 pgsql15.0 部分类型兼容；#1436</li><li>完善 Sqlite DbFirst 获取索引信息；#1425</li><li>优化 适配达梦最新驱动；</li><li>优化 IUpdate 组合更新方式；</li><li>优化 IUpdate.Set(xx, null) 的情况；</li><li>优化 ISelect&lt;object&gt; AsType 的父子类转换时的情况；#1427</li><li>优化 支持动态操作 IncludeByPropertyName then.WhereDynamicFilter 操作；</li><li>优化 WithTempQuery 场景的 DTO 映射查询；</li></ul><h2 id="v3-2-687" tabindex="-1"><a class="header-anchor" href="#v3-2-687" aria-hidden="true">#</a> v3.2.687</h2><ul><li><strong>修复 3.2.686 JsonMap bug；</strong></li><li>优化 参数化增加 ExpandoObject 支持；#1403</li><li>优化 pgsql15.0 Version 版本号处理；</li><li>优化 pgsql CodeFirst Syncsture CREATE INDEX code；</li></ul><h2 id="v3-2-686" tabindex="-1"><a class="header-anchor" href="#v3-2-686" aria-hidden="true">#</a> v3.2.686</h2><ul><li>增加 FreeSqlBuilder UseQuoteSqlName 设置不使用 [] `` &quot;&quot; 限定符号；</li><li>增加 Aop.CommandBefore 设置 .CommandText = null 可拦截某次执行；</li><li>增加 IAdo.ExecuteNonQuery 重载方法（虚谷数据库）；</li><li><strong>修复 UseSlaveWeight 异步下可能无效的问题；#1382</strong></li><li>修复 HzyTuple 嵌套解析问题；#1390</li><li>修复 AsType 表达式解析问题；#1389</li><li>修复 pgsql OnConflictDoUpdate 临时主键问题；#1393</li><li>修复 ClickHouse 联表查询 GLOBAL left join、Ado.Query * 问题；#1383</li><li>优化 ClickHouse like 为 positionCaseInsensitive #1386</li><li>优化 JsonMap 对基础类型的无效判断；#1385</li><li>优化 IUpdate 批量 case when 同值的 SQL 生成；#1393</li><li>优化 IAdo.ConnectionString 使用 UseConnectionFactory 时值为 NULL 的问题；</li></ul><h2 id="v3-2-685" tabindex="-1"><a class="header-anchor" href="#v3-2-685" aria-hidden="true">#</a> v3.2.685</h2><ul><li><strong>增加 IUpdate&lt;T&gt; BulkCopy 批量更新扩展方法；（暂时支持 SqlServer/MySql/PostgreSQL）</strong></li><li>修复 ClickHouse CodeFirst 表结构同步问题；</li><li>修复 ISelectGrouping ToSql AsProperty 别名无效问题；</li><li>优化 UnitOfWork 与 ForUpdate 事务开启逻辑；</li><li>优化 MySqlConnector MySqlDataTime 读取；</li><li>优化 linq.dynamic Expression Invoke 解析；#1378</li></ul><h2 id="v3-2-684" tabindex="-1"><a class="header-anchor" href="#v3-2-684" aria-hidden="true">#</a> v3.2.684</h2><ul><li><strong>修复 Firebird CodeFirst.SyncStructure 自增主键错误；(受影响版本 3.2.666-3.2.683)</strong></li><li>修复 Firebird [Index(&quot;{tablename}_Name&quot; 分表索引名未处理的 bug；#1346</li><li>修复 InsertDict DBNull.Value 值无法插入的问题；#1336</li><li>修复 fsql.InsertOrUpdate SetSource(sql) 无效的 bug；</li><li>优化 string[].Any(..) 表达式树解析；ReplaceParameterVisitor</li><li>优化 ISelect&lt;T1, T2&gt; 对象 .LeftJoin&lt;T2&gt; 表别名；#1348</li></ul><h2 id="v3-2-683" tabindex="-1"><a class="header-anchor" href="#v3-2-683" aria-hidden="true">#</a> v3.2.683</h2><ul><li><strong>修复 Repository/DbContext 同一实例执行报错后续无法再 CRUD；</strong></li><li><strong>修复 UnitOfWorkManager + Repository.SaveMany 事务切换问题；</strong></li><li>修复 导航属性 PgArrayToMany 数组字段为空时的 bug；</li><li>修复 导航属性 PgArrayToMany DTO 异步查询报错的 bug（同步方法正常）；</li><li>修复 SqlExt count/avg 开窗函数参数；#1321</li><li>修复 Sqlite TimeSpan 类型映射错误；</li><li>修复 Sqlite Attachs 多库索引 {tablename} 问题；</li><li>修复 EndEdit 未触发 OnEntityChange；</li><li>修复 fsql.InsertOrUpdate CanInsert=false,CanUpdate=true (mysql/pgsql）不生效的 bug；</li><li>修复 聚合根仓储（实验） InsertOrUpdate 重复插入的 bug；</li><li>修复 聚合根仓储（实验） Update 未更新自增状态管理的 bug；</li><li>修复 SqlServer WithSql + WithLock bug；</li><li>修复 ClickHouse Ado 参数化无效的问题；#1340</li><li>修复 Odbc 自定义 N&#39;&#39; 无效；#1332</li><li>修复 DbContext DbSet 属性初始并发时未触发 OnModelCreating；#1333</li><li>修复 Utils.ReplaceSqlConstString bug；</li><li>扩展 UseMessagePackMap 示例；</li><li>优化 UpdateDict 支持 .IsVersion 乐观锁设置；</li><li>优化 InsertDict DBNull.Value 值处理；#1336</li><li>优化 表达式树解析 w =&gt; (w as TBase).Id；</li><li>优化 导航属性集合 .Exists 效果与 .Any 相同；</li><li>优化 MySql CodeFirst 判断表是否存在的查询语句性能；</li><li>优化 SqlServer2005 TOP 1 查询；</li><li>完善 SqlServer WithLock + WithIndex 扩展方法；</li></ul><h2 id="v3-2-682" tabindex="-1"><a class="header-anchor" href="#v3-2-682" aria-hidden="true">#</a> v3.2.682</h2><ul><li>优化 人大金仓 KingbaseES 兼容 V8R3/V8R6；#931 #325</li></ul><h2 id="v3-2-681" tabindex="-1"><a class="header-anchor" href="#v3-2-681" aria-hidden="true">#</a> v3.2.681</h2><ul><li><strong>修复 3.2.666-3.2.680 子查询的特殊 bug；</strong></li><li>增加 fsql.Ado.QuerySingle(() =&gt; new {}) 扩展方法实现无表查询 SELECT now(), utc_timestamp()</li><li>优化 min pool size 与 max pool size 连接串设置；</li><li>优化 导航属性未配置关系先 Where 后 InnerJoin 的问题；</li></ul><h2 id="v3-2-680" tabindex="-1"><a class="header-anchor" href="#v3-2-680" aria-hidden="true">#</a> v3.2.680</h2>',41),b=e("li",null,[e("strong",null,"优化 WithTempQuery 多对象选择同别名问题；"),l(" #1192")],-1),_=e("li",null,"修复 WithTempQuery + Column + GroupBy + Key 指定列名的问题；",-1),S=e("li",null,"修复 GlobalFilter.ApplyIf + Repository.DataFilter.DisableAll 可能不生效的问题；",-1),y=e("li",null,"修复 UpdateDict 不支持 SET NULL 的更新；#1257",-1),m=e("li",null,"修复 ClickHuse DBFrist ExistsTable；",-1),v=e("li",null,"增加 ClickHouse LimitBy/Sample 查询方法；",-1),I={href:"https://freesql.net/guide/freesql-provider-custom.html",target:"_blank",rel:"noopener noreferrer"},f=e("li",null,"优化 DbSet/Repository 防止 Aop.AuditValue 触发两次；",-1),q=e("li",null,"优化 表达式树解析为 NULL 的提示；",-1),T=e("li",null,"优化 UseMappingPriority 与实体元数据逻辑；#1247",-1),C=e("li",null,"优化 ServerTime 与 IUpdate.Set 指定更新的重复问题；#1251",-1),D=r('<h2 id="v3-2-669" tabindex="-1"><a class="header-anchor" href="#v3-2-669" aria-hidden="true">#</a> v3.2.669</h2><ul><li>修复 WithTempQuery + RereadSql 无别名的问题；</li><li>修复 WithTempQuery + FromQuery + 子查询的 bug；</li><li>修复 WithTempQuery + Column(Name 别名问题；</li><li>优化 CheckAvailable retry 重试一次；</li></ul><h2 id="v3-2-666" tabindex="-1"><a class="header-anchor" href="#v3-2-666" aria-hidden="true">#</a> v3.2.666</h2><ul><li><strong>增加 WithTempQuery + FromQuery 嵌套查询功能；</strong> #1192</li><li><strong>增加 FreeSql.Provider.OracleOledb 解决 US7ASCII 中文乱码问题；</strong></li><li><strong>增加 UnionALL 联合查询；</strong> #1106 #1104 #668 #478 #432 #213 #138</li><li>增加 WithMemory 基于内存查询，对标 WithSql；</li><li>增加 AuditValue ObjectAuditBreak 实现对象只触发一次审计事件；</li><li>增加 IncludeByPropertyName 重载 then 参数；#1214</li><li>增加 IInsertOrUpdate.SetSource(sql) 重载方法；</li><li>增加 DynamicFilterCustom 增加支持 Expression 返回值；</li><li>修复 UseGenerateCommandParameterWithLambda(true) 与 GroupBy 查询不生效 bug；</li><li>修复 ToList 子查询开启参数化重复参数的 bug；#1205</li><li><strong>修复 string[] JsonMap bug；</strong> #653</li><li>修复 ManyToMany 不会触发 AsTable 的 bug；</li><li>修复 Clickhouse Insert AsTable 表名处理 bug；</li><li>修复 ClickHouse 单条记录插入\\t \\n /失败的 bug；</li><li>修复 子查询使用基类 + AsType 可能产生的 bug；#1215</li><li>修复 SqlServer2005/2008 Skip 问题（未设置 Take 时）；</li><li>修复 MySql/SqlServer DbFirst 获取字段位置的问题；</li><li>修复 DbContext/Repository Primary decimal 状态管理 key 精度处理 bug；</li><li>修复 DbContext/Repository 无构造函数的实体对象不跟踪问题；</li><li>修复 ToSql AsProperty 大小别名问题；</li><li>优化 IncludeByPropertyName + AsType；</li><li>优化 字典crud TableInfo 合并规则；#1180</li><li>优化 IUpdate.Set 字符串累加本身为 NULL 的情况；#1209</li><li>优化 WhereDynamicFilter DateRange 情况；</li><li>优化 Oracle IN :ids 值传入 IList 时报错；</li><li>优化 Dameng 单独适配 netcore3.1；#1094</li><li><strong>优化 PrevReheatConnectionPool 预热；</strong></li><li>优化 全局过滤器禁用时子查询传播问题；#1208</li><li><strong>优化 子查询别名为 a 的情况；#1201</strong></li></ul><h2 id="v3-2-665" tabindex="-1"><a class="header-anchor" href="#v3-2-665" aria-hidden="true">#</a> v3.2.665</h2>',5),A={href:"https://github.com/dotnetcore/FreeSql/issues/1178",target:"_blank",rel:"noopener noreferrer"},U={href:"https://github.com/dotnetcore/FreeSql/issues/1161",target:"_blank",rel:"noopener noreferrer"},x={href:"https://github.com/dotnetcore/FreeSql/issues/1160",target:"_blank",rel:"noopener noreferrer"},F=e("li",null,"增加 DbContext/Repository 审计日志 ChangeInfo 增加属性 EntityType；",-1),k={href:"https://github.com/dotnetcore/FreeSql/issues/1159",target:"_blank",rel:"noopener noreferrer"},O={href:"https://github.com/dotnetcore/FreeSql/issues/1176",target:"_blank",rel:"noopener noreferrer"},B={href:"https://github.com/dotnetcore/FreeSql/issues/1173",target:"_blank",rel:"noopener noreferrer"},L={href:"https://github.com/dotnetcore/FreeSql/issues/900",target:"_blank",rel:"noopener noreferrer"},E=e("li",null,"修复 SetSource 临时主键重载方法 + Column 设置 Name 后无效的 bug；",-1),M=e("li",null,"修复 Dto 映射查询 Negate 表达式解析 bug；",-1),N=e("li",null,"修复 pgsql OldName + XML 注释迁移代码顺序问题；",-1),P=e("li",null,"优化 string Contains 模糊查找 % 的情况；",-1),W=e("h2",{id:"v3-2-664",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#v3-2-664","aria-hidden":"true"},"#"),l(" v3.2.664")],-1),Q={href:"https://github.com/dotnetcore/FreeSql/issues/1155",target:"_blank",rel:"noopener noreferrer"},R=e("li",null,"修复 pgsql Dto 映射使用常量 false 转换失败；",-1),G=e("li",null,"修复 IIF 三元表达式树解析 bool HasValue 问题；",-1),V=e("li",null,"修复 MySqlConnector BulkCopy 映射顺序问题；",-1),w=e("li",null,"优化 XML 注释读取支持 interface；",-1),H=e("li",null,"support provider、Extensions Exceptions 多语言",-1),J=e("h2",{id:"v3-2-662",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#v3-2-662","aria-hidden":"true"},"#"),l(" v3.2.662")],-1),j=e("li",null,[e("strong",null,"调整 pgsql10 自增映射使用 GENERATED BY DEFAULT AS IDENTITY，低版本仍然使用 serial；")],-1),X={href:"https://github.com/dotnetcore/FreeSql/issues/1145",target:"_blank",rel:"noopener noreferrer"},z=e("li",null,"增加 ObservableCollection 级联加载和保存；",-1),K=e("li",null,"优化 FluentApi 继承关系可直接 ConfigEntity<BaseEntity> 生效；#1144",-1),Y=e("li",null,"修复 达梦 min pool size 预热数量匹配 bug；",-1),Z=e("li",null,"修复 v3.2.620 - v3.2.661 子查询 sum/min/max/avg 默认加 isnull 防止为 NULL 情况，日期类型处理错误 #1140 1b84a0069679c92ccaff9aa8c33023e4d34262cd",-1),$=e("li",null,"修复 AsTable 子查询未传播的问题；#1103",-1),ee=e("li",null,"修复 IncludeByPropertyName fromFirstTable 判断错误；#278",-1),le=e("li",null,"修复 GroupBy 特殊情况下 AsProperty 无效的 bug；#1141",-1),ie=e("li",null,"修复 MySql CodeFirst OldName + Comment 迁移问题；#1147",-1),te=e("li",null,"修复 pgsql DbFirst 未正确获取 Position 值；#1154",-1),re=e("h2",{id:"v3-2-661",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#v3-2-661","aria-hidden":"true"},"#"),l(" v3.2.661")],-1),ne={href:"https://github.com/dotnetcore/FreeSql/issues/387",target:"_blank",rel:"noopener noreferrer"},oe={href:"https://github.com/dotnetcore/FreeSql/issues/69",target:"_blank",rel:"noopener noreferrer"},ae={href:"https://github.com/dotnetcore/FreeSql/issues/99",target:"_blank",rel:"noopener noreferrer"},se={href:"https://github.com/dotnetcore/FreeSql/issues/1128",target:"_blank",rel:"noopener noreferrer"},ue=e("li",null,"修复 pgsql varchar(120) CodeFirst 迁移不修改长度；",-1),de=e("li",null,"修复 ISelect.InsertInto 未执行自动迁移；",-1),he={href:"https://github.com/dotnetcore/FreeSql/issues/1137",target:"_blank",rel:"noopener noreferrer"},ce=e("li",null,"优化 连接池不可用、定时检查；",-1),pe=e("li",null,"优化 Limit + Sum/Avg/Max/Min 为嵌套查询；",-1),ge={href:"https://github.com/dotnetcore/FreeSql/issues/1126",target:"_blank",rel:"noopener noreferrer"},be=e("h2",{id:"v3-2-651",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#v3-2-651","aria-hidden":"true"},"#"),l(" v3.2.651")],-1),_e=e("li",null,[e("strong",null,"增加 DTO 映射非导航属性的子表查询 ToList，可直接返回集合；")],-1),Se={href:"https://github.com/dotnetcore/FreeSql/issues/243",target:"_blank",rel:"noopener noreferrer"},ye={href:"https://github.com/dotnetcore/FreeSql/issues/1100",target:"_blank",rel:"noopener noreferrer"},me={href:"https://github.com/dotnetcore/FreeSql/issues/1108",target:"_blank",rel:"noopener noreferrer"},ve={href:"https://github.com/dotnetcore/FreeSql/issues/1113",target:"_blank",rel:"noopener noreferrer"},Ie={href:"https://github.com/dotnetcore/FreeSql/issues/937",target:"_blank",rel:"noopener noreferrer"},fe={href:"https://github.com/dotnetcore/FreeSql/issues/1098",target:"_blank",rel:"noopener noreferrer"},qe={href:"https://github.com/dotnetcore/FreeSql/issues/1103",target:"_blank",rel:"noopener noreferrer"},Te={href:"https://github.com/dotnetcore/FreeSql/issues/1115",target:"_blank",rel:"noopener noreferrer"},Ce={href:"https://github.com/dotnetcore/FreeSql/issues/1028",target:"_blank",rel:"noopener noreferrer"},De={href:"https://github.com/dotnetcore/FreeSql/issues/846",target:"_blank",rel:"noopener noreferrer"},Ae=e("li",null,"修复 IN 查询区分 varchar/nvarchar；",-1),Ue={href:"https://github.com/dotnetcore/FreeSql/issues/1116",target:"_blank",rel:"noopener noreferrer"},xe={href:"https://github.com/dotnetcore/FreeSql/issues/1118",target:"_blank",rel:"noopener noreferrer"},Fe={href:"https://github.com/dotnetcore/FreeSql/issues/1104",target:"_blank",rel:"noopener noreferrer"},ke=e("li",null,"优化 子查询 sum/min/max/avg 默认加 isnull 防止为 NULL 情况；",-1),Oe=e("li",null,"优化 EnableCascadeSave 级联保存执行逻辑，提升性能；",-1),Be=e("li",null,"优化 RawJoin 支持 FULL JOIN 等自定义联表映射；",-1),Le={href:"https://github.com/dotnetcore/FreeSql/issues/1113",target:"_blank",rel:"noopener noreferrer"},Ee=e("h2",{id:"v3-2-100-v3-2-640",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#v3-2-100-v3-2-640","aria-hidden":"true"},"#"),l(" v3.2.100 - v3.2.640")],-1),Me=e("li",null,[e("strong",null,"增加 InsertDict/UpdateDict/DeleteDict/InsertOrUpdateDict 针对字典的 CUD 方法；#481")],-1),Ne=e("li",null,"增加 UseSlaveWeight 读权重设置；#1046",-1),Pe=e("li",null,[e("strong",null,"增加 [Table(AsTable = xx)] 自动分表特性，待完善；#1066")],-1),We={href:"https://freesql.net/guide/freesql-provider-sqlitecore.html",target:"_blank",rel:"noopener noreferrer"},Qe=r("<li>增加 IList&lt;T&gt; IncludeByPropertyName 扩展方法，支持字符串参数；</li><li><strong>增加 DbSet/Repository DeleteCascadeByDatabase 级联删除(基于数据库)</strong>；</li><li>调整 DbSet/Repository EnableAddOrUpdateNavigateList 支持 OneToOne 级联保存、级联删除(基于对象)；</li><li>修复 Delete.Where in 查询为空时，异步操作仍然执行删除；#1068 <strong>【受影响版本 v3.2.302】</strong></li><li>修复 InsertOrUpdateDict 异常；#1067 <strong>【受影响版本 v3.2.301、v3.2.300、v3.2.200】</strong></li><li>修复 InsertDict 部分新功能遗留问题(特别是 Oracle)；<strong>【受影响版本 v3.2.301、v3.2.300、v3.2.200】</strong></li><li>修复 InsertDict/UpdateDict 等字典操作在 DbContext.Orm 下无法使用的 bug；#1064 <strong>【受影响版本 v3.2.300、v3.2.200】</strong></li><li>修复 MapType 复杂表达式树解析 bug；#1062</li><li>修复 UseGenerateCommandParameterWithLambda 对不可参数化的数据类型冲突的 bug；#1061 #900</li><li>修复 MySql Set 类型空格处理问题；#1059</li><li>修复 SaveManyAsync 多对多历史漏改的问题（同步无问题）；</li><li>修复 OR 表达式处理情况；#1047</li><li>修复 ClickHouse 设置 NoneParameter 会报错问题；</li><li>修复 Clickhouse 连接池使用问题；#646 #968 #969 #943</li><li>修复 pgsql IList -&gt; JArray 映射；#1092</li><li>修复 pgsql DbFirst IsPrimary bug；</li><li>修复 JsonMap 与导航属性的联表查询报错的 bug；#996</li><li>修复 子查询 WhereIf 可能失败的 bug；</li><li>修复 StringLength 设置后 IsNullable = false 无生效的问题；</li><li>修复 UseConnectionFactory 参数化问题；</li><li>修复 参数值为原始 DbParameter 时转换类型报错；</li><li>修复 UseGenerateCommandParameterWithLambda 子查询 IN bug；#900</li><li>修复 InsertValueSql 在仓储插入后不返回最新值；</li><li>完善 SqlServer BulkCopy 插入 DateTime 最小值问题；</li><li><strong>优化 导航集合属性访问，可省略 AsSelect；</strong></li><li>优化 DbContext/Repository Update 实体有 ServerTime 既使无状态变化也必然更新的逻辑；</li><li>优化 DbContext/Repository 插入非主键自增回填；</li><li>优化 ToList&lt;Dto&gt; jsonb 映射；</li><li>优化 dywhere IN 查询按 500 元素分割；#1091</li><li>优化 IIF 表达式解析；</li>",30),Re=e("h2",{id:"v3-0-100-2021-12-17",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#v3-0-100-2021-12-17","aria-hidden":"true"},"#"),l(" v3.0.100（2021/12/17）")],-1),Ge=r("<li><strong>增加 南大通用 Gbase 国产数据库支持；</strong></li><li><strong>增加 ClickHouse 数据库语法支持；</strong></li><li>增加 DbContext/Repository 比较变化方法 CompareState；</li><li><strong>增加 DynamicFilter Custom 自定义解析；</strong></li><li>增加 ToDataTableByPropertyName 动态查询功能；</li><li>优化 兼容排序 OrderBy(a =&gt; new {}) 语法；</li><li>优化 pgsql jsonb 映射，支持 List，mysql limit in 子查询；</li><li>优化 InsertOrUpdate&lt;&gt; 使用 InsertOrUpdate&lt;list&lt;&gt;&gt;时，提示友好异常。</li><li>修复 BulkCopy 与线程事务未传播的 bug；#962</li><li>修复 AsTreeCte + RereadSql 不能同时使用的 bug；#964</li>",10),Ve={href:"https://github.com/dotnetcore/FreeSql/issues/882",target:"_blank",rel:"noopener noreferrer"},we=e("blockquote",null,[e("p",null,"更多历史更新日志，请访问：https://github.com/dotnetcore/FreeSql/wiki/%e6%9b%b4%e6%96%b0%e6%97%a5%e5%bf%97")],-1);function He(Je,je){const o=n("RouterLink"),t=n("ExternalLinkIcon");return s(),u("div",null,[c,e("ul",null,[e("li",null,[e("strong",null,[l("增加 低代码扩展包 "),i(o,{to:"/guide/lowcode.html"},{default:d(()=>[l("FreeSql.Extensions.ZeroEntity")]),_:1}),l("；")])]),p]),g,e("ul",null,[b,_,S,y,m,v,e("li",null,[e("strong",null,[l("增加 所有"),e("a",I,[l("国产数据库"),i(t)]),l("支持 CustomMySql、CustomPostgreSQL、CustomOracle、CustomSqlServer 自定义适配；")])]),f,q,T,C]),D,e("ul",null,[e("li",null,[l("增加 IsVersion string 字符串乐观锁；"),e("a",A,[l("#1178"),i(t)])]),e("li",null,[l("增加 IUpdate.SetSource ignoreVersion 参数可实现忽略乐观锁；"),e("a",U,[l("#1161"),i(t)])]),e("li",null,[l("增加 IInsertOrUpdate.SetSource(items, tempPrimarys) 指定临时主键参数；"),e("a",x,[l("#1160"),i(t)])]),F,e("li",null,[l("修复 SqlServer WithLock 子查询不生效的 bug；"),e("a",k,[l("#1159"),i(t)])]),e("li",null,[l("修复 AsTreeCte + AsTable 无效的 bug；"),e("a",O,[l("#1176"),i(t)])]),e("li",null,[l("修复 UseGenerateCommandParameterWithLambda(true) 问题；"),e("a",B,[l("#1173"),i(t)]),l(),e("a",L,[l("#900"),i(t)])]),E,M,N,P]),W,e("ul",null,[e("li",null,[e("strong",null,[l("修复 UseGenerateCommandParameterWithLambda 子查询并发 bug；"),e("a",Q,[l("#1155"),i(t)]),l(" （重要）")])]),R,G,V,w,H]),J,e("ul",null,[j,e("li",null,[e("strong",null,[l("增加 PgArrayToMany 专属导航属性；"),e("a",X,[l("#1145"),i(t)])])]),z,K,Y,Z,$,ee,le,ie,te]),re,e("ul",null,[e("li",null,[l("增加 UseMappingPriority 指定映射优先级；"),e("a",ne,[l("#387"),i(t)]),l(),e("a",oe,[l("#69"),i(t)]),l(),e("a",ae,[l("#99"),i(t)])]),e("li",null,[l("增加 AuditValueEventArgs Object 参数；"),e("a",se,[l("#1128"),i(t)])]),ue,de,e("li",null,[l("修复 UseCommandParameterWithLambda IN 参数化判断 的逻辑 bug；"),e("a",he,[l("#1137"),i(t)])]),ce,pe,e("li",null,[l("优化 GroupBy Page 未排序的查询；"),e("a",ge,[l("#1126"),i(t)])])]),be,e("ul",null,[_e,e("li",null,[l("增加 Array.Any(x => x.id == a.Id && ..) 表达式树解析；"),e("a",Se,[l("#243"),i(t)])]),e("li",null,[l("增加 pgsql numeric -> BigInteger 映射；"),e("a",ye,[l("#1100"),i(t)])]),e("li",null,[l("增加 "),e("a",me,[l("#1108"),i(t)]),l(" Exception 国际化；")]),e("li",null,[l("增加 DynamicFilterCustom 参数 object sender；"),e("a",ve,[l("#1113"),i(t)])]),e("li",null,[l("增加 Fluent API 以继承接口的形式配置实体；"),e("a",Ie,[l("#937"),i(t)])]),e("li",null,[l("修复 Oracle AsTable 分表嵌套 SQL 拼错错误；"),e("a",fe,[l("#1098"),i(t)])]),e("li",null,[l("修复 AsTable ManyToMany IncludeMany 无效的问题；"),e("a",qe,[l("#1103"),i(t)])]),e("li",null,[l("修复 AsTable 分表 ToAggregate 无法得到汇总；"),e("a",Te,[l("#1115"),i(t)])]),e("li",null,[l("修复 Repository.DataFilter 对 GlobalFilter 控制无效的 bug；"),e("a",Ce,[l("#1028"),i(t)]),l(),e("a",De,[l("#846"),i(t)])]),Ae,e("li",null,[l("修复 Oracle clob 参数化类型设置问题；"),e("a",Ue,[l("#1116"),i(t)])]),e("li",null,[l("修复 MySql 子查询 Enum MapType(int) 表达式判断解析 bug；"),e("a",xe,[l("#1118"),i(t)])]),e("li",null,[l("优化 AsTable 自动分表 Where Equal 判断；"),e("a",Fe,[l("#1104"),i(t)])]),ke,Oe,Be,e("li",null,[l("优化 IncludeMany 三级导航对象自动 _included；"),e("a",Le,[l("#1113"),i(t)])])]),Ee,e("ul",null,[Me,Ne,Pe,e("li",null,[l("增加 "),e("a",We,[l("FreeSql.Provider.SqliteCore"),i(t)]),l(" 支持 Sqlite 加密；")]),Qe]),Re,e("ul",null,[Ge,e("li",null,[l("修复 FreeSql.Generator 工具生成 model 失败 "),e("a",Ve,[l("#882"),i(t)])])]),we])}const Ke=a(h,[["render",He],["__file","change-log.html.vue"]]);export{Ke as default};
