# 更新日志

大约每月一次版本号，暂时以修复 bug 为主

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
- 修复 ClickHouse 联表查询 GLOBAL left join、Ado.Query * 问题；#1383
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
- 修复 Firebird \[Index("{tablename}_Name" 分表索引名未处理的 bug；#1346
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

## v3.0.100

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

## v2.6.100

- 修复 fix sqlite AddMinutes seconds->minutes [#774](https://github.com/dotnetcore/FreeSql/issues/774)
- 修复 Update 操作的时候 CanUpdate=false 未生效 [#803](https://github.com/dotnetcore/FreeSql/issues/803)
- 优化 将 Freesql 的 dynamicfilterinfo 标记为[serialable] [#802](https://github.com/dotnetcore/FreeSql/issues/802)
- 修复 Sqlite where.And(x => x.PublishTime.Year == 2021); 查询问题 [#804](https://github.com/dotnetcore/FreeSql/issues/802)
- 增加 支持符号调试 [#679](https://github.com/dotnetcore/FreeSql/issues/679)
- 增加 IUnitOfWork.States 自定义状态管理，便于扩展；

## v2.5.300

- 修复 ISelect.AsTable 后 .ToUpdate/ToDelete 无效的 bug；#815
- 修复 MERGE INTO 别名与 SQL 关键字冲突的 bug；#816
- 修复 Oracle IncludeMany IN 元素超过 500 数目的问题；#843
- fix IgnoreColumns CanUpdate false not work #803
- fix sqlite where datetime year,month 查不出来数据,Ticks 精度到毫秒，处理 Millisecond 无值的情况 #804
- Add Serializable #802
- Add string.Concat 返回 string.Empty

## v2.5.200

- 修复 Repository/DbContext 批量修改可能无效的 bug；#709
- fix sqlite AddMinutes seconds -> minutes #774
- fix ExecuteMySqlBulkCopyAsync .net core 3.1 Method not found #783

## v2.5.100

- 增加 ISelect.Page(BasePagingInfo pagingInfo) 方法重载；
- 修复 IncludeMany + AsTreeCte 不能组合使用的问题；#760
- 修复 Ado.CommandFluent 存储过程参数化问题；#739
- 修复 IUpdate.SetDto bug；#754
- 修复 pgsql 中 hstore 中 value 错误赋值为 key 的问题，并允许 value 值为 NULL；
- 修复 byte[]类型的乐观锁初始化问题；

## v2.3.200

- 修复 Repository/DbContext 批量修改可能无效的 bug；#709
- 修复 Oracle/Dameng 分组查询后分页的 bug；#710
- 优化 fsql.Transaction 线程事务；

## v2.3.106

- 修复 v2.3.100 GlobalFilter 在 Repository 失效的 bug；
- 优化 BaseDbProvider、AdoNetExtensions 内部定义；
- 增加 IUpdate.SetSource 批量更新时指定主键；#337

## v2.3.100

- **增加 FreeSql.Provider.Custom 自定义适配访问任何数据库；**
- 增加 Column 特性 RewriteSql/RereadSql；
- 增加 ISelect.OrderByRandom() 随机排序适配；
- 增加 SqlExt.DistinctCount 扩展方法；#674 #533
- 增加 Aop Before/After States 共享状态；
- 优化 ManyToMany 导航属性子查询支持 ToList；
- 优化 HzyTuple 子查询解析；
- 优化 指定 Dto 查询对 c# 字段的支持；
- 优化 GlobalFilter 子查询传播重复的问题；#642
- 优化 Console.Write 平台兼容问题；#643
- 优化 DbSet/Repository 级联保存时，忽略未配置的导航属性；
- 优化 FreeSql.Extensions.Linq Select 选定字段查询方法；#674 #533
- 优化 Repository.DataFilter 可禁用 GlobalFilter；
- 优化 WhereDynamicFilter；
- 修复 延时属性时级联保存失败的 bug；
- 修复 分组查询后，无法使用子查询的问题；
- 修复 UseGenerateCommandParameterWithLambda + Enum + MapType(string) bug；
- 修复 ToChunk + IncludeMany 二级集合属性的 bug；
- 修复 JsonMap 序列化判断 bug；
- 修复 Sqlite DbFirst 获取自增的 bug；
- 修复 Oracle DbFirst date 类型 bug；#627
- 修复 ISelect2`16 OrderByIf bug；
- 修复 神通 Linux not supported 问题；#656
- 修复 WhereDynamicFilter 普通多表查询时别名判断的 bug；
- 修复 AsTreeCte 事务传播 bug；
- 修复 表达式树解析 MapType 把小数位转换丢失的 bug；
- 修复 SqlServer 支持 Chinese_PRC_CS_AS 区分小大写；#684

## v2.0.105

- 修复 Ado.Net 扩展方法的多表查询 bug；#592
- 优化 ToSql 别名大小写问题；#467
- **优化 IUnitOfWork/DbContext/Repository .Orm.Ado 和 CRUD 都与自身事务保持一致；**
- 完善 IDelete WhereIf(bool, sql) 方法；

## v2.0.102

- 优化 DbFirst 模式长内容未设置 StringLength = -1 写入问题；
- 优化 子查询(多表)别名；
- 优化 IUpdate.Set 支持位运算表达式树解析；
- 优化 单表查询 ExpressionTree 性能；
- 修复 ISelect.InsertInto 设置别名时无法使用的错误；#576

## v2.0

- 增加 IncludeByPropertyName 按属性名进行 Include/IncludeMany 操作；#278
- 增加 ISelect\<...> 多表查询 HzyTuple 新姿势；（感谢 HZY 贡献）
- 增加 ISelect Cancel 用于取消本次查询；
- 增加 IncludeIf/IncludeByPropertyNameIf 方法；
- 增加 表达式树函数解析 byte[] Length；#505
- 增加 FreeSql Async CancellationToken 参数；#537
- 增加 FreeSql.DbContext/Repository Async CancellationToken 参数；#537
- 增加 Oracle/达梦 BulkCopy 支持；
- 增加 IsVersion 对 byte[] 的支持；#548
- 增加 IN 参数扩展 where id in @ids；#560
- 增加 IAdo.QuerySingle 查询单条记录；#560
- 增加 pgsql 表达式树解析 hstore[""]；
- 优化 varchar/nvarchar 的 NoneParameter 处理；#519
- 优化 表达式树 SqlExt.IsNull 对布尔类型的解析；#500
- 优化 MapRead 对 NULL 字段的处理；
- 优化 表达式树三元表达式解析，当 Test 为变量时不解析成 case when end；
- 优化 AsTreeCte 对 MySql 5.6 的兼容；#536
- 优化 分页 Page(..).Count() 顺序问题；
- 优化 自动 IsIgnore 处理；
- 移除 ISelect\<T\>/IUpdate\<T\>/IDelete\<T\> class 约束限制；
- 修复 线程事务嵌套事务的 bug；#502
- 修复 #454 优化遗留的 bug，影响 Aop.AuditValue 事件；#521
- 修复 实体类拥有构造参数时，ToList\<DTO\> 映射查询无效的 bug；
- 修复 FreeSql.Generator 处理 SqlServer 默认值的问题；
- 修复 SqlServer RowNumber 分页有可能产生顺序不对的 bug；
- 修复 .net5 单文本部署读取注释报错；

## v1.10.1

- 增加 ISelect.InsertInto 将查询转换为 INSERT INTO t1 SELECT ... FROM t2 执行插入；#469
- 增加 GlobalFilter.ApplyOnly 继承的实体才生效；#495
- 增加 FreeSql.Generator 参数 -readkey 0 的设置；
- 优化 WhereDynamicFilter 支持 string 比较大小 > < >= <=；#479
- 优化 IncludeMany 筛选字段中未指定主键，并且 then.IncludeMany 继续向下，则自动附加查询主键；
- 优化 WhereDynamic 传入 DynamicFilterInfo 也能执行；
- 优化 WhereDynamic 支持按字段名、属性名匹配；
- 优化 实体类注释，基类在其他 Assembly 时也能读取；
- 优化 支持实体类使用 new 重写属性；
- 优化 ToAggregate 执行时忽略已设置的 OrderBy；
- 优化 dto 映射查询时忽略已指定的映射，避免重复查询字段；#494
- 优化 MySql CodeFirst 索引的建立 ；#498
- 补充 异步方法 ToListAsync(a => {}) 对 IncludeMany 的支持；
- 修复 AsTreeCte 开启自动迁移时，错误的创建了 as_tree_cte 表；#476
- 修复 内部 decimal 默认值在 core 3.1+ 报错的问题；
- 修复 decimal? 可空数字设置 Column Scale 无效的问题(decimal 正常)；
- 修复 DbContext/UnitOfWork EntityChangeReport 参数 BeforeObject 值无效的 bug；
- 修复 lambda 表达式解析变量转换时的 bug；#490
- 修复 Firebird Embedded 版本系统表 isidentity_type 兼容问题；
- 修复 Firebird Embedded 2.5 不支持 boolean 的 bug；

## v1.9.0

- **增加 FreeSql.Provider.Firebird 数据库实现 #443；**
- **增加 IncludeMany(a => a.Childs).ToList(a => new { a.Childs }) 指定集合属性返回；**
- 增加 ISelect<11..16> 16 个联表查询；
- 增加 ISelect Aggregate(lambda, out var result) 方法；
- 增加 ISelect OrderByIf 方法 #446；
- 增加 ISelect OrderByPropertyName 方法 #446 #278 #361 #197；
- 增加 IUpdate/IDelete WhereIf 方法 #446；
- **增加 ISelect/IInsert/IUpdate/IDelete CommandTimeout 方法设置命令超时；**
- **增加 GlobalFilter.ApplyIf 创建动态过滤器；**
- 增加 SqlExt.IsNull 方法；
- 增加 Oracle DbFirst 视图的支持；
- 增加 IAdo.CommandFluent(sql) 方法执行 SQL 命令；
- 优化 string IsNullable = false 时插入 null 自动转为 "" #445；
- 优化 GetDbParamtersByObject 参数为字典时修剪 @?: 前辍 #456；
- 优化 SqlExt.Sum/Max/Min/Avg 同时支持开窗或普通聚合函数；
- 优化 ToSql FieldAliasOptions.AsProperty 别名问题；#467
- 优化 FreeSql.Generator -Match 支持生成一个表；
- 调整 FreeSql.Generator 移除 CanInsert = false 特性生成；
- 调整 AdoNet CRUD 扩展方法到 namespace FreeSql；
- 修正 SqlServer UseConnectionFactory 类型标识；
- **修复 FreeSql.DbContext 对同一实体重复 Update，第二次无效的 Bug**；
- 修复 ISelect Any(lambda) 条件被附加的问题，不便于再次使用 ISelect 对象；
- 修复 ISelect ToDelete/ToUpdate 事务对象未传播的 bug；
- 修复 ISelect Include 多表字段名相同（不区分大小时）时的 bug；
- **修复 IAdo.Query 返回实体中带有延时导航属性，读取顺序不对的 bug**；
- 修复 Ado.Net Crud 扩展方法事务的友好异常提示；
- 修复 使用查询参数化功能时 ToList 子查询未传播参数列表的 bug；#462
- **修复 子查询 Count/Max/Min/Avg/Sum 使用了 Limit(1) 的 bug；#462**
- 修复 IAdo.Query\<匿名类\>(sql) 错误；
- 修复 SqlServer SqlBulkCopy IgnoreColumns 无效的 bug；
- 修复 达梦 DbFirst 获取字段 IsNullable 无效的问题；#454
- 补充 达梦 DbFirst int 类型识别；

## v1.8.1

- **增加 人大金仓 Ado.Net 实现 FreeSql.Provider.KingbaseES #325；**
- **增加 DbContext/Repository BeginEdit/EndEdit 批量编辑数据的方法 #397；**
- 增加 FreeSql.Provider.SqlServerForSystem 使用 System.Data.SqlClient.dll 兼容更多运行平台 #401 #398 #395 #392 #391；
- **增加 lambda 表达式树解析子查询 ToList + string.Join() 产生 类似 group_concat 的效果（适配了 sqlserver/pgsql/oracle/mysql/sqlite/达梦/金仓) #405；**
- 增加 IDbFirst.ExistsTable 方法判断表是否存在；
- 增加 IDbFirst.GetTableByName 方法获取单表信息，包括列详情、主键、唯一键、索引、备注；
- 增加 ICodeFirst.SyncStructure 强制同步参数 isForceSync #412；
- 增加 ISelect<2..10> 多表 WithSql 方法；
- **增加 IDbConnection/IDbTransaction 对象的扩展方法 Select/Insert/Update/Delete 实现 CRUD** #267；
- 增加 IAdo.GetDbParamtersByObject 方法获取 DbParameter[]；
- 增加 IAdo.ExecuteConnectTest 快速判断连接是否可用 #113；
- 增加 Aop.AuditDataReader 事件拦截 DataReader 读取值 #436；
- 修复 fsql.InsertOrUpdate 在同线程事务模式内使用的 bug #402；
- 修复 fsql.Ado.ExecuteDataTable 当记录不存在时，未返回 Columns 设置 #403；
- 修复 IInsert/IUpdate BatchProgress 异步执行不生效的 bug；
- 修复 1.7.1 IsNullable 遗留问题；
- 修复 Oracle nvarchar2 主键批量更新的问题；#411
- 修复 达梦 DbFirst 无法识别字段是否为主键的问题；
- 修复 SqlExt PartitionBy 无法传入多列的问题；
- 修复 WhereDynamicFilter System.Text.Json 反序化后的类型转换问题 #371；
- 修复 ISelect ToList\<T\>("id,title") 属性和字段顺序不同时的问题；
- 修复 Dto 映射查询属性名不区分大小写 bug #427；
- 修复 参数化 Column DbType 设置特殊值时的类型判断；
- 修正 UnitOfWorkManager Requierd 命名为 Required；
- 优化 pgsql DbFirst 序列的识别，以及 pgsql10 的自增识别；
- 优化 IsNullable = false 插入的数据值为 null 则以默认值插入（防止 DB 报错） #384；
- **优化 GroupBy ToList lambda 中可以直接使用 a.Key；**
- 优化 NoneParameter Oracle 文本超长的问题；
- 优化 lambda 使用 a == null ? 1 : 0 支持类似这样直接判断实体的情况；
- 优化 IUpdate.SetSource 机制不更新主键字段；
- 优化 IUpdate.SetSource 无主键的错误提示；
- 优化 WhereDynamic 传入集合对象时，逻辑 OR 换为 IN；
- 优化 指定导航属性查询时，如果下级导航属性被 Include 过，则将他们也查询出来；
- **完善 AsTreeCte + ToUpdate/ToDelete 实现树所有子节点删除或更新；**
- 完善 DbUpdateVersionException IsVersion 行版本异常；
- 完善 DbContext/UnitOfWork EntityChange 更新对象之前的值；
- 完善 ToChunk 分块加载查询，应用到 ISelect`1..10 中；
- 完善 ISelect\<T\>.WithSql 方法，支持传入参数化 #413；

## v1.7.1 (Microsoft.Data.SqliClient 兼容问题)

- 增加 ColumnAttribute Precision/Scale 设置；
- 增加 "x1".First/FirstOrDefault 表达式函数解析；
- 调整 ColumnAttribute IsNullable 对 int/long 等值类型也可生效；#384
- 修复 $"{a.Code}\_{a.Id}" lambda 解析当 {} 多于 3 个时的 bug（.net 内部机制很坑）；
  > - 3 个 {} 时，Arguments[1..3] 解析出来是分开的
  > - 4 个 {} 时，Arguments[1] 只能解析这个出来，然后 [1] 里面是 NewArray []
- 补充 fsql.InsertOrUpdate UpdateColumns 数据存在时只更新指定的字段 #394 #330 #115 #17；

## v1.7.0

- **增加 实体属性 char 类型的映射 #381 #235**；
- 增加 $"{a.Code}\_{a.Id}" lambda 解析；
- 增加 IInsert/IUpdate BatchProgress 方法处理批量插入/更新时的进度；
- 增加 ISelect ToChunk 停止读取的逻辑控制 #360；
- 增加 FreeSql.Provider.PostgreSQL NetTopologySuite 类型映射，保留 LegacyPostgis 映射 #369；
- **修复 DbSet/Repository 批量级联保存(ExecuteInserted)失败的问题 #362**；
- 修复 多对多导航属性 AsSelect() 无法使用 .Count() 的问题 #362；
- 修复 WhereDynamicFilter 多级 Logic 未生效的 bug；
- 修复 WhereDynamicFilter 在 System.Text.Json 下的问题 #371；
- 修复 pgsql dbfirst 未处理数组类型生成的问题；
- 修复 dm7 dbfirst SQL 中存在特殊字符的问题；
- 修复 批量插入的时候报错 System.DivideByZeroException #365；
- 修复 CodeFirst + AsTable + 自动迁移，导致索引名重复的问题 #366；
- 修复 GroupBy(..).Count() 开启参数化无效的 bug #390； UseGenerateCommandParameterWithLambda
- **补充 fsql.InsertOrUpdate IfExistsDoNothing 数据存在时不做任何事(不更新)**；
- 补充 Ado.ExecuteDataTable Columns 包含 DataType 信息；
- 补充 EFCore StringLengthAttribute/DatabaseGeneratedAttribute 特性的支持；
- 补充 FreeSql.Extensions.Linq ThenBy/ThenByDescending 扩展方法 #380；
- 优化 FreeSql.Generator 生成实体类的时候处理数据库默认值；
- **调整 FreeSql.Provider.SqlServer 引用 Microsoft.Data.SqlClient #391**；

## v1.6.0

- **增加 人大金仓 OdbcKingbaseES 实现；#325**
- **增加 神舟通用 ShenTong 实现；**
- **增加 WhereDynamicFilter 操作符 Range/DateRange/Any/NotAny，实现范围/日期范围/In 查询；**
- **增加 ISelect.AsTreeCte() 递归查询树表（向下或向上）；**
- 增加 IUnitOfWork Orm 属性直接访问 IFreeSql CRUD 事务与工作单元一致；
- **增加 SqlExt 常用开窗函数的自定义表达式解析；**
- 增加 SqlExt.Case().When(..).End() 自定义表达式解析；
- 增加 SqlExt.GroupConcat MySql 函数解析；
- 增加 StringLength/MaxLength 对 byte\[\] 的支持；
- 修复 IFreeSql.InsertOrUpdate Merge into 未处理 CanUpdate 的问题；#330
- 修复 IUpdate Set(表达式) MapType 未生效的问题；
- 修复 表达式 Not 位运算符解析错误；#340
- 修复 Expression Or/And 扩展方法在多表中可能存在的错误；
- 修复 IncludeMany 只填充子属性中双向关系的 ManyToOne 对象值；
- 修复 Select`2-10 ToOne/First 没有处理 Limit(1) 的 bug；
- 修复 \[JsonMap\] 属性在 lambda 表达式中解析的 bug；
- 修复 sqlserver 解析 cast(.. as nvarchar) 截断长度 30 的问题；#335
- 优化 mysql StringLength/MaxLength -2 产生 LongText 映射；
- 优化 兼容 pgsql 9.4 CodeFirst/DbFirst；
- 优化 sqlserver 表中带点 codefirst；
- 测试 支持 mysql json 类型；

## v1.5.0 (好久不见)

- 修复 non public ctor #291；
- 修复 浮点类型 NoneParameter 不使用科学字符串表示；
- 修复 IgnoreColumns 相关方法解析表达式 a => new [] { "Id" .. } 无效的 bug；
- 修复 Column(ServerTime=xxx) MySql 下无法保留精度的问题；
- 修复 ISelect.ToDataTable(lambda) 未使用 AsProperty 返回数据；
- 修复 IUpdate.Set(a => a.xx = null) 表达式解析 bug；#311
- 修复 Enum 类型无元素时的错误；
- **增加 IFreeSql.InsertOrUpdate 方法；**
- **增加 ISelect.WhereDynamicFilter 方法实现动态过滤条件（与前端交互）；**
- **增加 表达式解析 yyyyMMdd 常用 c# 日期格式化；**
- 增加 WhereCascade/GlobalFilter 表达式子查询的支持；
- 增加 \[Description\] 元数据注释，优先级低于 c# 代码注释；
- 增加 IUpdate.SetIf 方法；
- **增加 IUpdate.SetSourceIgnore 方法，可实现忽略 null 属性的更新；**
- 增加 FreeSqlBuilder.UseExitAutoDisposePool 方法；
- 优化 Guid GetDefaultValue 可能导致的错误；
- **优化 移除 fsql.Transaction 线程事务超时提交机制；#323**
- 调整 BaseEntity，移除 BaseTreeEntity、Tenant 租户，改变事务习惯；

## v1.4.0

- **增加 FreeSql.Provider.Dameng 基于 DmProvider Ado.net 访问达梦数据库；**
- **增加 FreeSql.DbContext OnModelCreating 虚方法，实现在 DbContext 使用 FluentApi；**
- 增加 FreeSql.DbContext 与 EFCore 相似的 FluentApi 对动态类型的处理；#281
- 移除 FreeSql.Extensions.EfCoreFluentApi，功能移至 FreeSql.DbContext；
- **增加 FreeSqlBuilder 自动识别 EFCore 实体特性 Key/Required/NotMapped/Table/Column；**
- 增加 IInsert InsertColumns/IgnoreColumns 方法重载输入 string[]；#275
- 增加 DbFirst 获取字段的默认值信息；
- 增加 FreeSql.Generator -Match 参数只生成匹配的表；
- 增加 FreeSql.Extensions.JsonMap FluentApi 扩展方法；#279
- 增加 DbFirst DbColumnInfo Position 属性，字段默认位置；
- **增加 UnitOfWorkManager 工作单元管理器，实现多种传播事务，移除 UnitOfWork.Current 静态属性；**[#289](https://github.com/dotnetcore/FreeSql/issues/289)
- 增加 DbContextOptions.EnableGlobalFilter 设置是否在 DbContext/Repository 中启用全局过滤器（默认 true）；
- 优化 主键 Guid 自动赋值的优先级，低于 Aop.AuditValue 事件（实现自定义 Guid 值）；
- 优化 WhereDynamic 传入 string 的时候自动转为主键的类型值；
- 修复 ISelect.From 内部 WhereIf 二次表达式解析 bug；
  po
- **增加 GroupBy ToDictionary 返回字段的查询方法，TKey 为 GroupBy 选择的对象；**
- 调整 GroupBy 所有方法不使用 DTO 映射规则；
- 调整 IUpdate.SetDto 也支持 IgnoreColumns 的逻辑；
- 调整 ISelect linq to sql 和 queryable 实现依赖移至 FreeSql.Extensions.Linq；

## v1.3.5

- 修复 IncludeMany 第 3 层无法加载的问题，IncludeMany(a => a.Parent.Parent.Childs)；
- 修复 PostgreSQL CodeFirst/DbFirst 系统表的版本兼容问题；
- 增加 EfCoreFluentApi HasData 设定 CodeFirst 种子数据；
- 增加 DbContextOptions.NoneParameter 设置是否使用参数化执行 Insert/Update；

## v1.3.4

- **调整 Repository 接口定义，合并为一个 IBaseRepository；**
- 调整 移除对 System.ValueType 的依赖，减少版本冲突问题；（目前 FreeSql.dll 无任何依赖）
- **调整 Oracle StringLength/MaxLength -1 时候映射为 nclob；**
- 调整 IInsert/IUpdate NoneParameter 方法，增加参数 isNotCommandParameter 可设置是否使用参数化；
- 调整 FreeSqlBuilder，准备移除 UseEntityPropertyNameConvert/UseSyncStructureToLower/UseSyncStructureToUpper 方法；[#260](https://github.com/dotnetcore/FreeSql/issues/260)；
- 移除 In 多列表达式函数解析 [#243](https://github.com/dotnetcore/FreeSql/issues/243)；
- 优化 IncludeMany 扩展方法对 T1 不自动迁移；
- 优化 BulkCopy 对可空类型的属性处理； [#227](https://github.com/dotnetcore/FreeSql/issues/227)
- 优化 IAdo.Query 方法，当传入带主键特性的实体时，防止主键列为 null 时导致整行记录也为 null；
- 优化 TableInfo 元数据对 interface 实现类 IsVirtual 重写的判断（增加 IsFinal == false）；
- 优化 Navigate 属性未设置 set 时的友好错误提示；
- 优化 延时属性重写类对 protected set 的支持；
- **优化 ConnectionPool 提升被动连接断开的体验（会卡的可以升级）；**
- 优化 集合导航属性表达式中忘记使用 AsSelect() 的友好错误提示；
- **增加 FreeSqlBuilder UseNameConvert 方法，类名、属性名都生效；**
- **增加 CodeFirst 实体类注释 -> 表备注，之前只能属性注释 -> 字段备注；**
- 增加 FreeSql.Generator Sqlite 数据库生成实体类；
- **增加 Sqlite DbFirst 实现；**
- 增加 Oracle clob/nclob 大文本类型读写支持；[#259](https://github.com/dotnetcore/FreeSql/issues/259)；
- **增加 ISelect.ToTreeList 扩展方法查询数据，加工为树型 List；(注意：实体需要配置父子导航属性)**
- 增加 ISelect`1 ToDictionary 方法查询返回字典；
- 增加 Pgsql JToken/JObject/JArray 索引访问的表达式解析；
- 增加 object.Equals 表达式解析；
- 增加 ISelect`1 AsQueryable 方法，实现将 ISelect 转换为 IQueryable 类型；
- 增加 ISelect.RawJoin 方法以便实现 Outer Apply 查询；[#200](https://github.com/dotnetcore/FreeSql/issues/200)；
- 增加 IAdo.ConnectionString 属性返回 UseConnectionString 传入的值；
- 完善 表达式拼接方法，从 T1-T5；[#256](https://github.com/dotnetcore/FreeSql/issues/256)；
- 修复 因兼容 [#184](https://github.com/dotnetcore/FreeSql/issues/184) 导致 MySql Enum 表达式解析为 int 的 bug；
- 修复 FreeSql.Provider.MySqlConnector Enum 自定义元素值，导致值计算错误的 bug；
- 修复 SqlServer charindex 表达式函数参数位置的错误；
- 修复 MySql locate 表达式函数参数位置的错误；
- 修复 UseGenerateCommandParameterWithLambda(true) 时子语句的参数没整合到主语句；[#231](https://github.com/dotnetcore/FreeSql/issues/231)；
- 修复 本地区域化后 ToSql 产生的错误，比如数字可能生成 SQL 为：100,000；
- 修复 StringLength/MaxLength 对 Oracle varchar2 类型无效的 bug；
- 修复 CodeFirst IsNullable 迁移脚本重复 NOT NULL 语法错误；
- **修复 DbFirst Oracle/Dameng 序列值使用复杂的问题，结合 [Column(InsertValueSql = "xxx.nextval")]；**

## v1.2.1

- 调整 Aop 改为 event 事件；
- 调整 Ado.AopCommandExecuting/AopCommandExecuted 到 Aop.CommandBefore/After；
- 增加 Aop.TraceBefore/After 事件；
- 修复 ToList 父子导航可能匹配不正确的 bug；
- 修复 读写分离创建 IFreeSql 时如果从库不可用导致 iis 退出的 bug；
- 调整 DbContext/Repository EnableAddOrUpdateNavigateList 默认关闭；
- 修复 DbContext/Repository SaveMany 一对多保存时删除条件 bug；
- 增加 BaseEntity SaveMany 方法；
- 修复 LazyLoading 依赖项目 CSScript.Core 升级的 bug；

## v1.2.0

- 修复 ToList(a => new Dto {}) 这种情况按字段名匹配问题，应该按属性名；[#208](https://github.com/dotnetcore/FreeSql/issues/208)
- 增加 nuget 包强签名发布；[#201](https://github.com/dotnetcore/FreeSql/issues/201)
- 完善 IUpdate.SetSource 组合主键的数据更新单元测试；
- 修复 Oracle 导航属性 表别名过长的问题；
- 修复 DbSet.Where 表达式解析报错的问题；[#216](https://github.com/dotnetcore/FreeSql/issues/216)
- 修复 DbContext/Repository Update 不更新 DbUpdateValue 的问题；[#219](https://github.com/dotnetcore/FreeSql/issues/219)
- 增加 IUpdate.SetDto 根据 dto 更新的方法；[#218](https://github.com/dotnetcore/FreeSql/issues/218)
- 修复 EfFluentApi 一个参数类型问题；

## v1.1.0

- 修复 BaseRepository.UnitOfWork 延迟设置（即事务开启之后再设置）无效的 bug；
- 优化 参考 Chloe 表达式针对变量的解析，提升了一倍性能；
- 修复 FreeSql.Generator 外键导航属性大写小 bug；#177
- 优化 IsVersion 字段更新 version=ifnull(version,0)+1，防止字段为 null 一直报错；
- 完善 [Column(ServerTime = Utc)] 特性，对 Update 时也能生效；
- 完善 [Column(MapType = typeof(byte[]))] 对 Guid/string 的映射支持；#178
- 完善 MapType byte[] 对 Contains/Parse 表达式解析的处理；
- 修复 DbConnectionPool.Return 在 Sqlite 下的 bug；#179
- **增加 FreeSql.Provider.MySqlConnector 扩展方法 ExecuteMySqlBulkCopy；**
- 修复 DbFirst mysql/pgsql/sqlserver 获取主键失败的 bug； 0.10.7 发布后的 bug #182
- **解决 表名名称包含点，无法进行 CRUD 的问题，由于测试的复杂性，此类情况仅支持 MySql/Sqlite CodeFirst 自动迁移；**
  > 注意：尽量不要使用带点的表名，只有 MySql/Sqlite 对此类表名支持 CodeFirst。但是它不影响 CRUD 功能，使用 [Table(Name = "\`sys.config\`")] 解决
- 增加 FreeSql.All 全家桶包，懒人专用；
- 修复 GroupBy 类型转换错误；#186
- 修复 .ToList(a => new DTO(a.id)) 报 未将对象引用设置到对象的实例 问题； #187
- 修复 update 语句，二元运算解析出错； #184
- 修复 xamarin ios 真机无法使用 Sqlite 的问题； #183
- **支持 Sqlite :memory: 模式； #191**
- 优化 IdleTimeout 默认值为 20 秒； #194
- 修复 父子关系导航属性 Dto 中直接使用 a.Parent 映射错误的 bug；

## v1.0.1

- 修复 NoneParameter 无参对 byte[] 二进制拼接的 bug；#170
- 调整 最大连接池为 +5（属于内部设置）；
- 增加 EfCoreFluentApi 扩展包，接近 efcore fluentApi 的使用习惯；
- 增加 ColumnAttribute 属性 InsertValueSql，插入数据的时候指定用 sql 值；
- **增加 ISelect`1.WithSql("select \* from user ...") 功能；**
- 完善 PgSql OnConflictDoUpdate 功能增加 DO NOTHING 操作；#174
- 修复 IAdo.Query\<object\> 字段名重复的 bug；#162

## v1.0.0

- 增加 ISelect.ToSql 字段别名设置，默认为 AsIndex，可改为 AsProperty；#158
- 优化 AsTable 分表查询 Any/Min/Max/Avg/Sum/Count 的处理；#158
- 优化 BaseEntity Select 查询数据时自动 Attach；
- 优化 没有主键的实体，约定 id 命名的属性上若设置了 IsPrimary = false，则其不属于约定主键；
- 优化 ISelect.Count() 之前使用了 OrderBy 会产生的 SQL 语法问题；
- 调整 Avg 方法返回值为 double，Sum 方法返回值为 decimal；
- 完善 Select`2-10 多表查询对象，增加 First(select)/ToOne(select)/First\<Dto\> 方法；
- 修复 LazyLoading 在 Net4 环境下的问题；
- 增加 FreeSql.Generator -Filter 设置选项，可阻止存储过程+视图的生成；
- 增加 FreeSql.Generator 在目标目录产生 \_\_razor.cshtml.txt 文件，以便自定义修改模板生成；
- **增加 IInsert/IUpdate BatchOptions 方法指定批量插入的设置；**
- 增加 IInsert.ToDataTable 方法，为 BulkCopy 操作提供数据，该方法处理了(表名、字段名、类型）映射和忽略列；
- **增加 IInsert.ExecuteSqlBulkCopy 扩展方法执行 SqlBulkCopy 批量插入，在 FreeSql.Provider.SqlServer 可用；**
- **增加 IInsert.ExecutePgCopy 扩展方法执行 PostgreSQL Copy 批量导入，在 FreeSql.Provider.PostgreSQL 可用；**
- 增加 ISelectGrouping 分组查询总量的方法 .Count()；
- 兼容 Vb.Net 无法使用 IncludeMany 的问题；
- 兼容 Vb.Net 无法使用 int? 类型 = 等号表达式解析；
- 优化 实体基类的属性位置，优先排在最前面；
- 整理 实体类 Ctor 有构造函数的映射处理；
- 优化 实体属性，支持 protected set 属性；
- 修复 Ado.Query 查询字段重复时报错；#162
- **增加 FreeSql.Provider.MsAccess 支持 Access 数据库操作，已通过 2003/2007 版本测试；**

## v0.12.21

- 增加 Where In 表达式解析；
- **增加 FreeSqlBuilder.UseConnectionFactory 自定义数据库连接对象的创建方法；**
- 兼容 Vb.Net 表达式解析字符串 = 判断；
- 优化 GlobalFilter 过滤器表达式 bool 解析；
- 修复 ISelect.AsTable union all 查询对 count/max/min/avg/sum 的别名 bug；

## v0.12.20

- **增加 ISelect.ForUpdate 排他更新锁（根据数据库类型的规则，见代码注释）；**
- **完善 SqlServer WithLock 功能，组合多种使用 | 枚举相联；**
- 补充 同线程时间 fsql.Transaction 事务等级参数的传入；
- 调整 fsql.Transaction(Action, Timeout) 参数顺序；
- 修复 FreeSql.Generator NameOptions 参数未设置时的错误；

## v0.12.18

- 修复 Oracle Dbfirst 字段可空、和主键判断的 bug；

## v0.12.16(达梦数据库)

- **增加 达梦数据库 ODBC 适配，和单元测试，支持 CodeFirst 模式开发；**
- 增加 BaseEntity 物理删除方法 Delete(true)；
- 修复 ToList((a,b) => new { a, b }) 当 b 为 null 的时候，应该整个 b 为 null；(导航属性没这个问题)
- 修复 Sqlite attachs 附加数据库别名 bug；
- 修复 Select\<T1, T2> AsTable 析构函数处理可能产生 bug；
- 整理 读写分离的查询代码；

## v0.12.12

- 修复 DbContext TrackList 对匿名对象处理的 bug；[#150](https://github.com/dotnetcore/FreeSql/issues/150)

## v0.12.11

- 增加 RawValueAttribute 实现自定义表达式时，使用原始值传入参数；
- 增加 IEnumerable<(T1, T2)>.Contains(col1, col2) 扩展方法，实现自定义表达式解析多列无法 IN 的问题；
- 修复 多表查询 WhereCascade，如果 Join 没有 On 条件，可能导致生成的 SQL 多了一个 AND 出错；
- 修复 SaveMany 缓存保存列名找不到的错误提示；

## v0.12.9

- 增加 DateTime 扩展方法 Between 和 BetweenEnd 自定义表达式；
- 修复 Dto 映射，在二级即 Dto 属性上又 new Dto 的时候，错误的又重复映射了全部字段；

## v0.12.8

- 优化 IncludeMany 级联查询支持异步适配（之前是同步方式）；
- 优化 MaxLength 功能，并且增加 [Column(StringLength = 100)] 同等的特性功能；
- 优化 GlobalFilter Apply 自动重命名表达式参数名，避免内容重复问题；
- 修复 表达式解析 Guid.NewGuid() 的错误；
- 补充 GetTableByEntity 当属性名或特性名重复时的友好错误提示；

## v0.12.7

- 移除 Lazy 延时加载动态代码中的 Newtonsoft.Json 依赖；

## v0.12.6

- 优化 ReadAnonymous 映射类型不一致的容错；
- 修复 Oracle/Sqlite IInsert.ExecuteInserted 方法，返回了被 clear 过后的 \_source，其实本来也没意义；
- 修复 DbContext SaveMany 对比删除的 bug；

## v0.12.5

- **增加 实体特性 [Column(ServerTime = DateTimeKind.Utc)] 使用数据库时间执行插入数据；**
- 修复 ToList(a => new Dto { .. }) 在使用 GroupBy 之后报错的 bug；
- 修复 注释迁移到数据库，在 asp.net 4.7 无效的问题；
- 修复 批量插入 Values 数量限制超出的判断；

## v0.12.3

- 增加 ICodeFirst.IsGenerateCommandParameterWithLambda 选项，开启表达式解析的命令参数化；
  > FreeSqlBuilder 上使用 UseGenerateCommandParameterWithLambda(true) 开启
- 优化 ExpressionCallContext 可设置、附加参数化对象；
- 修复 IncludeMany(a => a.x1.x2.Childs) 当 x1, x2 为 null 的报 null 错误；

## v0.11.24

- **增加 Repository/DbContext SaveMany 方法实现一对多，子数据的完整保存；**
- 调整 SaveManyToMany 方法名为 SaveMany；
- 增加 UnitOfWork 静态属性 DebugBeingUsed，用于生产环境监视正在使用中的事务；

## v0.11.23

- **增加 ExpressionCallAttribute 特性，实现表达式函数自定义解析；**
- 优化 Contains 表达式解析为 where in 自动拆分，防止大于 1000 的 SQL 错误，如下：

```csharp
var arr = Enumerable.Range(1, 1333).ToArray();
var sql = fsql.Select<T>().Where(a => arr.Contains(a.Int)).ToList();
//原来：where id in (1..1333)
//现在：where id in (1..500) or id in (501..1000) or id in (1001..1333)
```

- 修复 IsNulable 特性不生效的 bug；

## v0.11.22

- **兼容 SqlServer nvarchar/varchar 表达式解析，分别解析为：N'' 和 ''，优化索引执行计划；**
- **增加 MySql 特有功能 Insert Ignore Into；**

## v0.11.21

- 修复 SqlServer DbFirst、CodeFirst 查询实体表的列信息错误，当设置了表/列多个扩展属性时发生；
- 修复 SqlServer2005 CodeFirst 迁移时，不支持 SET (LOCK_ESCALATION TABLE) 的错误（已做适配）；
- 修复 SqlServer2005 批量插入 SQL 语法错误，不支持 Values(),()（已做适配）；
- 完善 SqlServer2005 环境跑通了所有单元测试；
- 修复 ReadAnonymous 读取数据设置只读属性的错误；#132

## v0.11.20

- 增加 IncludeMany 贪婪加载的时候可指定子表的字段，避免查询子表所有字段；
- 调整 ToList(a => new 实体类 { id = 1, title = a.xx.Title})，如果 dto 类型为实体类，则规则为只查询 id, title 字段；
  > 这个规则与 v0.11.6 有差异，它是先映射 Dto 所有属性，再映射 id、title，区别：一个是 dto 类型，一个是查询的实体类型
- 修复 Where(a => bool && id > 0) bool 未解析正确的 bug；
  > （之前大多数类似的表达都能解析，这次是一个特殊情况）

## v0.11.19

- 修复 MapType 属性的表达式解析 数组.Contains 得到是映射之前的值 bug；
- 修复 MapType 属性 与 IncludeMany 变异功能未映射处理的 bug；

## v0.11.18

- 增加 DbContext、Repository SaveManyToMany 方法，实现手工保存 ManyToMany 关联数据；
- 修复 BaseRepository 析构时与工作单元的回滚逻辑 bug；#131
- 优化 ManyToMany 中间表不需要指明 [Column(IsPrimary = true)] 特性；

## v0.11.12

- 增加 AsTable 和 Repository 分表时的自动迁移分表功能；
- 增加 ICodeFirst.SyncStructure(Type entityType, string tableName) 指定表名来迁移实体；

```csharp
fsql.CodeFirst.SyncStructure(typeof(Log), "Log_1"); //迁移到 Log_1 表
fsql.CodeFirst.SyncStructure(typeof(Log), "Log_2"); //迁移到 Log_2 表
```

- 增加 PostgreSQL 特有功能 On Conflict Do Update 功能；
- 完善 所有参数化 object parms 可使用 IDictionary 类型传入；

## v0.11.11

- 增加 MySql 特有功能 On Duplicate Key Update 功能；
- 优化 实体类重写属性 new 如果类型与基类不一致，无法使用的问题；
- 修复 ISelect .From 方法之前使用 .Include 方法，导致生成的多表 JOIN 位置错误的 bug；

## v0.11.9

- 增加 FreeSql.Provider.Sqlite 对 Xamarin 环境下的适配；
- 增加 SqlServer ISelect.WithLock 扩展方法，实现 with(nolock) 查询；
- 增加 SqlServer IFreeSql.SetGlobalSelectWithLock 扩展方法，实现全局设置 with(nolock) 查询；
- 修复 MySql CodeFirst DateTime 同步结构条件判断的 bug，导致每次都执行 alter；
  > 高版本支持 datetime(3) 精度的、或者不指定 DbType="datetime" 就没事
- 移除 Aop.ToList；
- 移除 Aop.Where；

## v0.11.6

- 调整 ToList(a => new Dto { id = 1, title = a.xx.Title})，之前只映射 id、title，现在是先映射 Dto 所有属性，再映射 id、title；
  > 提醒：如果之前使用此方法映射 Dto 的指定属性，请改为匿名类映射，避免查询了不需要的字段影响性能。

## v0.11.5

- 修复 FreeSql.DbContext 析构方法的 bug，错误的回滚了外部 UnitOfWork；

## v0.11.4

- 增加 ISelect ToDelete/ToUpdate 方法，实现更复杂的删除/更新操作；
- 移除 IUpdate/IDelete WhereExists 方法；

## v0.11.3

- 增加 FreeSql.DbContext DbSet Remove 可根据 lambda 条件删除数据的方法；
- 优化 Aop.AuditValue 审计过的值，IUpdate.UpdateColumns 即使不指定该列也会更新；

## v0.11.2

- 增加 IFreeSql.GlobalFilter 全局过滤器；
- 移除 TableAttribute.SelectFilter 功能；
- 修复 MySql/SqlServer CodeFirst 同步结构 bug；
  > 当表已存在后增加自增列时，产生的脚本不应该包含默认认设置

## v0.11.1

- 优化 FreeSql.DbContext 构造方法，方便注入使用；

## v0.10.15 (.Net Framework 4.0)

- 增加 .Net Framework 4.0 的支持，出于环境考虑 .Net Framework 4.0 不支持异步方法；
- 增加 IFreeSql.Insert\<T\>(IEnumerable\<T1\> source) 方法；

## v0.10.14

- 调整 DbContext.EntityChangeInfo 类名为 DbContext.EntityChangeReport.ChangeInfo；
- 调整 IUnitOfWork 接口，移除 OnEntityChange 属性，增加 EntityChangeReport 属性；
- 优化 FreeSqlBuilder 处理 MaxLength 特性的容器处理；

## v0.10.13

- 修复 postgresql 12 移除 pg_attrdef.adsrc 列，导致 CodeFirst 方法失败的 bug；
- 增加 Aop.ConfigEntity 属性 ModifyIndexResult 实现 IndexAttribute 的设置；

## v0.10.12

- 增加 FreeSql.DbContext 实体对象的变化事件；
  > 可参阅 [DbConetxt](/db-context)
- 补充 Aop.CurdBefore 事件参数 Table 实体类型的元数据；

## v0.10.11

- 优化 枚举属性的默认值容错，枚举下标不存在 0 的时候，mysql 迁移结构默认值报错；
- 优化 ORACLE Command 绑定变量 BindByName = true；[#107](https://github.com/dotnetcore/FreeSql/issues/107)

## v0.10.10

- 修复 PostgreSQL DbFirst 获取字段类型的时候，没有拼得字符串的长度(如 varchar(255))；

## v0.10.9

- 修复 DbFirst 当表数量过大时(如 oracle 表数量大于 1000)，可能报错的 bug；

## v0.10.8

- 增加 List\<T1\> 扩展方法 IncludeMany，实现从已知的内存 List 数据，进行和 ISelect.IncludeMany 相同功能的贪婪加载；

  > 示例：new List\<Song\>(new[] { song1, song2, song3 }).IncludeMany(fsql, a => a.Tags);

- 修复 FreeSql.DbContext/FreeSql.Repository 当主键为 Guid? 可空类型时，发生参数错误；
  > System.ArgumentException:“Expression of type 'System.Guid' cannot be used for assignment to type 'System.Nullable`1[System.Guid]'”

## v0.10.7

- 增加 IndexAttribute 特性，自动迁移索引，以及对应的 FluentApi 方法；
- 移除 ColumnAttribute.Unique 属性设置，改为 IndexAttribute 特性设置唯一键；
- 调整 IInsert\<T1\> Insert\<T1\>(IEnumerable\<T1\> source) 参数类型改成了 List；

## v0.10.6

- 优化 DbContext/Repository ManyToMany 联级保存功能，当是新增数据时不查询中间表记录对比差异（直接插入）；

## v0.10.5

- 增加 DbContext/Repository ManyToMany 联级保存功能（之前已支持 OneToMany）；

## v0.10.4

- 增加 ColumnAttribute 可插入(CanInsert)、可更新(CanUpdate)；#99

## v0.10.3

- 增加 NavigateAttribute 特性对应的 Fluent 功能；#96

## v0.10.2

- 修复 Pgsql string[] 属性表达式 Contains 缺少类型转换的 SQL 语法错误；

## v0.10.1

- 优化 IUpdate.IgnoreColumns/UpdateColumns 可对属性名，或字段名做设置；#95
- 优化 忽略 List\<T\> 作为 Curd 类型操作；

## v0.9.18

- 增加 PostgreSQL 的 Odbc 访问提供，相比 FreeSql.Provider.PostgreSQL 支持的类型更少；
- 增加 通用的 Odbc 访问提供，不能迁移实体到数据库，不能 Skip 这样来分页，理论上能 crud 所有 odbc 数据库；

## v0.9.17(ODBC)

- 增加 FreeSql.Provider.Odbc，实现 Oracle/SqlServer/MySql 的 Odbc 访问提供；
- 增加 FreeSqlBuilder.UseConnectionString 参数 providerType，可解决因包版本冲突时，可能无法反射获得 FreeSql.Provider 对应的类型，通常这个参数不需要设置；
- 优化 MaxLength 特性，当指定为 -1 时 DbType 会分别映射类型 text/nvarchar(max)/nvarchar2(4000)；

## v0.9.16

- 增加 BaseRepository.AttachOnlyPrimary 方法，只附加实体的主键值；
  > 在更新前使用可实现不查询数据库再更新、也可以实现更新时不更新值为 null 的字段

```csharp
class T {
    public int id { get; set; }
    public string name { get; set; }
    public string other { get; set; }
}
var item = new T { id = 1, name = "xx" };
fsql.GetRepository<T>().AttachOnlyPrimary(item).Update(item); //只更新 name
```

- 修复 Lambda 表达式中 DateTime.Now.ToString("yyyyMMdd") 不能直接执行的 bug；

## v0.9.15

- 增加 FreeSql.Extensions.JsonMap 扩展包，实现快速将对象映射为 json 字符串的方法；

```csharp
fsql.UseJsonMap(); //开启功能

class TestConfig {
    public int clicks { get; set; }
    public string title { get; set; }
}
[Table(Name = "sysconfig")]
public class S_SysConfig<T> {
    [Column(IsPrimary = true)]
    public string Name { get; set; }

    [JsonMap]
    public T Config { get; set; }
}
```

- 优化 表达式解析未实现的错误提醒，如 $""；

## v0.9.12

- 增加 MaxLength 特性的解析，实体字符串长度设置；

```csharp
class Topic {
    [MaxLength(128)]
    public string Title { get; set; }
}
```

## v0.9.11

- 增加 ISelect.ToChunk 实现分块查询数据，减少数据过大时内存占用；

## v0.9.10

- 移除 FreeSql.Repository 扩展方法 FromRepository；
- 调整 ISelect.AsTable 规则，每一次使用将增加 UNION ALL 查询；
- 优化 AsTable UseSyncStructureToLower/ToUpper 设置，兼容 AsTable((t,o) => "(select \* from tb)")；

## v0.9.9

- 修复 AsTable 不受 UseSyncStructureToLower/ToUpper 设置的 bug；

## v0.9.8

- 增加 AsTable 多次，可查询分表后的多个子表记录，以 UNION ALL 形式执行；
- 完善 ExpressionTree DateTime/DateTimeOffset 数据转换测试；
- 优化 ISelect`1.Include 之后 ToList 参数 includeNestedMembers 默认为 true；
- 修复 属性无 set 自动忽略的 bug；

## v0.9.7

- 修复 批量更新 bug，当某行某字段值为 null，其他行的该字段也更新成了 null；【重大 bug】

## v0.9.6

- 优化 表达式对整数除法的处理，解析为整除；
- 优化 MapType DateTime/DateTimeOffset 类型转换互通；

## v0.9.5

- 增加 创建表时指定字段位置，如：[Column(Position = 1]，可为负数即反方向位置；

## v0.9.4

- 修复 导航属性配置，循环关系的情况下可能导致的 bug；

## v0.9.3

- 修复 导航属性配置和 Aop 冲突的 bug；

## v0.9.2

- 修复 Aop.AuditValue 与 FreeSql.Repository 主键状态管理的冲突；

## v0.9.1

- 增加 `ISelect.First<Dto>()` 方法；
- 修复 MapType 表达式解析时的层级 bug，可能出现 ExpressionTree 类型错误；

## v0.8.11

- 增加 Aop.AuditValue 事件，在插入/更新数据时审计属性值；

## v0.8.10

- 修复 Pgsql 批量更新使用 NoneParameter 后日期类型的语法 bug；
- 修复 Oracle DbFirst 大小写问题没正确获取列对应 CsType 值的 bug；

## v0.8.8

- 优化 导航属性的关系，友好支持 int/int? 映射；
- 修复 IncludeMany 变异 Where 指定的属性类型不一致的 bug；(如 int 和 int?)

## v0.8.7

- 修复 导航关系多属性时的错序 bug；
- 修复 延时属性的类，没有设置 Namespace 时的 bug；

## v0.8.6

- 补充 使用 IsIgnore 忽略后，表达式再使用时的友好错误提示；
- 优化 DbContext/Repository 局部调整；
- 修复 DbContext.Save 只查询不更新的 bug；

## v0.8.5

- 修复 ISelect.WhereCascade 当内部使用 (a as BaseEntity).TenantId 时报错的 bug；
- 修复 ISelect Sum/First 子查询时，若子查询实体类与主查询一样时，导致的 bug；

## v0.8.4

- 修复 IUpdate.Set 表达式传入匿名类更新多个字段，后表达式未加[]或""的 bug；
- 修复 Aop.ConfigEntityProperty 操作导航属性后，执行 insert 语句认为它也是字段的 bug；

## v0.8.3

- 增加 FreeSql.Provider.Oracle 下的 OraclePrimaryKeyName 特性，手工设置主键名防止默认名过长问题；
- 修复 查询重复数据时使用 IncludeMany 出现字典重复添加的 bug；(如一对多使用 LeftJoin 查询，主实体查询出了重复的数据)
- 补充 ISelect`T1...T10 LeftJoin/InnerJoin/RightJoin 多参数方法；

## v0.8.2

- 修复 Oracle 表达式 DateTime.Subtract(DateTime) 解析 bug；
- 增加 IFreeSql.Select`T1...T10 的多表查询扩展方法；
- 增加 表达式函数 string.IsNullOrWhiteSpace 解析；
- 优化 内部实体管理的默认值，防止导航属性使用抽象类/接口时出现错误；

## v0.8.1

- 优化 表达式中不能使用 c# 函数的问题，
  > 如：where(a => HttpContext.Session.GetString("UserID") == a.UserId)
- 优化 IUpdate.Set 表达式传入匿名类更新多个字段；
- 优化 IInsert.InsertIdentity 可插入自增属性；
- 修复 Oracle CodeFirst 使用 OldName 迁移自增字段时，未删除旧的触发器和序列的 bug；

## v0.7.16

- 增加 UnitOfWork.Current 静态属性，AsyncLocal 实现 [NETStandard 2.0]；
- 修复 CodeFirst 迁移代码注释到数据库，继承的基类未生效的 bug；

## v0.7.15

- 优化 ExpressionTree 类型转换的友好错误提示；
- 修复 SqlServer IUpdate.ExecuteUpdated 拼接 SQL bug；

## v0.7.13

- 增加 ISelect.WhereCascade 实现多表查询时，向每个表中附加条件；
- 增加 表达式对基类转换的解析，如：Where(a => (a as BaseEntity).IsDeleted == true)；
- 增加 Examples 项目 base_entity，利用 BaseEntity 实现简洁的数据库操作；

## v0.7.12

- 修复 .From 多表查询别名的匹配 bug；
- 修复 SqlServer 未处理字符串前面加 N 的 bug；
- 增加 子查询判断，如果使用了相同 ISelect 会死循环；
- 增加 连接字符串错误时的友好提示；

## v0.7.9

- 补充 Navigate(ManyToMany = typeof(中间表)) 多对多自定义配置；
- 修复 LambadaExpressionExtensions 扩展方法 And/Or 当存在二级 lambada 时替换错误的 bug；
  > 如：where.Add(a => a.Tags.Any(b => ...))，b 替换错误

## v0.7.8

- 增加 子查询函数 First、Count、Min、Max、Sum、Avg 的支持；
- 补充 Oracle DbFirst raw 等类型映射处理，其他未处理的类型将映射为 string；

## v0.7.6

- 优化 表达式 true && ... 解析的处理；
- 优化 Navigate 指定联合键关系时，对属性顺序的要求，当类型不一样、名称一样时无须指明属性的顺序，如：[Navigate("MemberId, ShopId")]；

## v0.7.5

- 修复 Insert/Update 大批量操作分批执行时，如果外部使用了 Ado.Transaction，没有使用线程事务对象，而是创建了新事务的 bug；

## v0.7.4

- 修复 Insert ClearData 重复利用的 bug（使用 IgnoreColumns 进行大批量插入时会发生）；

## v0.7.3

- 修复 ISelect.From<T2, T2> 当传入相同的两个实体类型，可能导致内部 Join 无法匹配的 bug；
- 增加 IGroupSelect ToSql(string) 重载方法；
- 修复 根据代码注释，迁移到数据库备注，当实体类属于 .exe 程序集时的 bug：System.Xml.XmlException:“根级别上的数据无效。 第 1 行，位置 1。”

## v0.7.1

- 修复 `.From<T2>.GroupBy` Item2 以上元组参数未查找到的 bug #63；
- 合并 FreeSql.DbContext 项目至 FreeSql；

## v0.6.13

- 增加 表达式 .HasValue 和 !.HasValue 的解析支持；
- 增加 表达式 DateTime - DateTime 和 DateTime - TimeSpan 的解析支持；
- 修复 0.6.12 IUpdate.Set 表达式解析的 bug；

## v0.6.12

- 增加 LambdaExpression 扩展方法 And/Or/Not 快速拼接表达式；
- 优化 IUpdate.Set 支持 Set(a => new { Clicks = a.Clicks + 1, Time = DateTime.Now }) 指定多个字段更新的用法；

## v0.6.11

- 增加 CodeFirst 根据代码注释，迁移到数据库备注（需要实体类所在项目开启 xml 生成功能）；

## v0.6.10

- 增加 TableAttribute 特性属性 DisableSyncStructure，当实体对应的是视图时，可使用本功能禁用迁移；
- 增加 FreeSqlBuilder UseEntityPropertyNameConvert() 全局转换实体属性名方法 [#60](https://github.com/dotnetcore/FreeSql/pull/60)；

## v0.6.9

- 修复 批量插入/更新大量数据时，未使用 NoneParameter，会导致部分未执行的 bug；

## v0.6.8

- 处理 非正常 Provider GC 可能为 null 的错误；
- 修复 Aop.ParseExpression 使用 FreeParse 方法死循环的 bug；
- 增加 ISelect.OrderBy 重载，与 WhereIf 相同行为；

## v0.6.6

- 适配 FreeSql.Provider.MySqlConnector，和它对应的 266 个单元测试；

## v0.6.5

- 增加 NavigateAttribute 配置导航关系；
- 修复 LinqToSql 方法，开启自动迁移时，迁移了无关类的 bug；
- 修复 Oracle DbFirst date(7) 类型未处理的 bug；
- 修复 AsSelect().Any() 未给其他条件时，产生 null bug；
- 修复 子查询使用非表达式方法时，参数无效的 bug；
- 增加 FreeSql.Extensions.LazyLoading 对 .net 4.5 的支持；
- 优化 MySql CodeFirst 增加 DateTime 迁移后，默认值为 0000-00-00 导致读取失败的 bug；
- 优化 LazyLoading 友好错误提示；

## v0.6.3

- 补充 当初始化 ConnectionString 参数为空时，给出友好错误提示；
- 修复 IUpdate.IngoreColumns/UpdateColumns 若实体指定别名后，可能无效的 bug；

## v0.6.2

- 增加 FreeSql.Provider.MySqlConnector 实现包；
- 修复 mysql CodeFirst enum/set 小写时，对 MySqlConnector 不友好的 bug；

## v0.6.1（拆解 FreeSql）

- 各数据库单独包、延时加载包；
- FreeSql.Extensions.LazyLoading
- FreeSql.Provider.MySql
- FreeSql.Provider.PostgreSQL
- FreeSql.Provider.SqlServer
- FreeSql.Provider.Sqlite
- FreeSql.Provider.Oracle
- 移除 IFreeSql.Cache，以及 ISelect.Caching 方法；
- 移除 IFreeSql.Log，包括内部原有的日志输出，改为 Trace.WriteLine；
- IAdo.Query\<dynamic\> 读取返回变为 List\<Dictionary\<string, object\>\>；
- 定义 IFreeSql 和以前一样，移除了 UseCache、UseLogger 方法；

## v0.5.23

- 补充 IUpdate.Set(a => a.Click == 10)，简化 Set 更新单个字段表达式；
- 优化 延时导航属性的错误提醒，当无法匹配错误，转到重写类 get 时抛出（实现延时导航属性，与普通导航一起使用）；
- 优化 ICodeFirst.SyncStructure 错误提示，当使用不可迁移实体时；
- 优化 实体数据属性 DbDefaultValue 处理；
- 修复 Expression 表达式解析 Convert 的判断 bug；

## v0.5.21

- 修复 IncludeMany ManyToMany，若中间表未使用 延时加载 属性功能时，出现的 bug；
- 增加 IncludeMany Take(5) 功能，实现每个子集合只取 5 条记录；

## v0.5.19

- 增加 ISelect.Include 贪婪加载第一版，已通过集合的导航数据加载，包括 OneToMany/ManyToMany；
- 修改 IncludeMany ManyToMany ET 缓存的 bug；
- 完善 IncludeMany 联合键处理；
- 完善 Include/IncludeMany 单元测试；
- 修复 Include 延时加载 ManyToOne/OneToOne，当值为 null 时，仍然会查询一次数据；
- 修改 Query/ToList 混合使用时，可能导致的 ET 缓存 bug；
- 修改 Query 查询的实体设置了 IsIgnore 时，可能出现 ET 读取位置偏移 bug；
- 增加 变异的 IncludeMany，即使不是导航属性，也可以贪婪加载；

## v0.5.12

- 优化 连接预热策略：min pool size 不设置或 <= 0，则默认预热 5 个；也可以设置 1；
- 取消 MySql CodeFirst 对表字符集的设置；
- 增加`ToList<Dto>()` 方法，作用与 ToList(a => new Dto()) 相同；

## v0.5.11

- 修复 复杂的表达式解析 OR 的括号 bug；
- 增加 linq to sql 的查询语法，以及单元测试，[wiki](LinqToSql)；
- 补充 IFreeSql 增加与实现 IDisposable 接口（依然要保持单例的使用习惯）；
- 增加 CurdBefore、CurdAfter AOP 事件，可监控执行增删查改；
- 增加 SyncStructureBefore、SyncStructureAfter AOP 事件，可监控 CodeFirst 迁移；

## v0.5.7

- 补充 nuget 包增加 xmlDoc 编译，原来使用者之前一直没有注释；
- 调整 Column.Unique 定义规则，解决同一属性不可配置多次的问题；
- 优化 兼容不同数据库 bool 的表达式解析，如：Where(a => a.Bool)、Where(a => !a.Bool)；

## v0.5.5

- 增加 Column.MapType 类型映射，可将 enum 映射为 int/string 等；
- 增加 Column.Unique 唯一键，多个属性指定相同的标识，代表联合键，[#42](https://github.com/dotnetcore/FreeSql/issues/42)；
- 增加 Expression string.Concat，[#39](https://github.com/dotnetcore/FreeSql/issues/39)；
- 补充 Expression IEnumerable`<T>`.Contains 的支持，之前只能数组或 IList`<T>`；
- 补充 IDbFirst GetTablesByDatabase 返回 uk/fk/index 名称，以便迁移；
- 补充 MapType/Unique 单元测试；
- 优化 PostgreSQL jsonb 类型使用习惯；

## v0.5.4(青年版)

- 修复 Expression OrElse 两侧括号丢失的 bug；
- 修复 Expression DateTime 类型 CompareTo 在 MySql/SqlServer 下的 bug；
- 修复 ISelect.ToList(true) 无效的 bug；
- 增加 IAop.ConfigEntity 配置实体特性，可实现使用其他 ORM 的实体特性，[#36](https://github.com/dotnetcore/FreeSql/issues/36)；
- 优化 ISelect.GroupBy 查询，增加 .Value 实现聚合源字段查询，ToList(a => a.Sum(a.Value.Score))，[#38](https://github.com/dotnetcore/FreeSql/issues/38)；

## v0.5.3

- 增加 ISelect.ToList(true) 贪婪加载 LeftJoin/InnerJoin/RightJoin 导航数据；
- 增加 IAdo.Query\<T1, T2 ...\> 多结果集查询；
- 增加 IAdo.ExecuteDataSet 多结果集查询；
- 优化 未设置实体属性 set 的将被自动过滤 IsIgnore；

## v0.5.2

- 修复 SqlServer 工作单元 bug，需要同时设置 SqlCommand.Connection + Transaction；
- 补充 测试与支持联合主键的自增；

## v0.5.1(五一版)

- 增加 ISelect/IInsert/IUpdate/IDelete.AsType 实现弱类型 curd，如：Select\<object\>().AsType(实体类型)；
- 补充 ISelect.From\<T2\>；
- 补充 ExpressionTree 单元测试；
- 优化 ToList(a => new Dto())，会按优先级查询 Join 实体属性；
- 补充 IDelete/ISelect/IUpdate WhereDynamic 方法，实现 dywhere 条件；
- 修复 WhereObject 内部方法，当开启 Lazy 延时属性时，并且传递实体查询时条件无效；

- 补充 实现表达式转换类型的解析，如：Select\<object\>().Where(a => (a as 实体类型).Id == 0)；
- 完善 ExpressionTree 基础数据类型 TryParse 使用与单元测试；
- 优化 ManyToMany 中间实体未配置主键时，自动配置联合主键；
- 修复 Expression.And 的使用问题；

- 修复 IsIgnore 过滤字段后，查询的错误；
- 修复 ISelect2 以上 WhereIf 条件作用反了 bug；

## v0.4.15

- 优化内部 QuoteSqlName 方法；当参数值是 (xxx)，则直接返回原形。如：xxx => [xxx]，(max(1)) => (max(1))；
  > 可实现功能，如：orm.Select\<xxx\>().AsTable((a,b) => "select \* from xxx").Page(1, 20).ToSql()
- 增加 Oracle IDbFirst 接口实现；
- 补充 开放 IUpdate UpdateColumns 方法功能，实现更新实体时，只更新指定的列（与 IgnoreColumns 对应）；

## v0.4.13

- 优化 MySql 日期类型精确至毫秒；
- 增加 Distinct 查询前去重数据；

## v0.4.12

- 增加 First/FirstAsync 指定字段查询的重载方法；
- 调整 FreeSql.Repository 直接引用 FreeSql.DbContext 内的仓储实现；
- 移动 FreeSql.Repository 至 FreeSql.DbContext；
- 补充 单独针对 MySql 枚举类型的单元测试；

## v0.4.11

- 修复 .ToList(a => a.id) 当 id 是 guid 类型时，会出现类型转换失败 bug；

## v0.4.10

- 优化 连接池对象预热效率，开启每 10 个线程进行预热，预热时间超过 3 秒则放弃；
- 修复 MySql 枚举表达式 == 解析成数字的 bug；
- 补充 IAdo 相关方法，实现 FreeSql.Connection.Extensions 扩展包，像 Dapper 的使用习惯；

## v0.4.9

- 修复 pgsql Enum 类型 formatSql bug；
- 补充 表达式解析 Equals 为 = [#28](https://github.com/dotnetcore/FreeSql/issues/28) [#29](https://github.com/dotnetcore/FreeSql/issues/29)；

## v0.4.5(清明版本)

- 优化 IFreeSql.Transaction 可嵌套连续使用，之前会死锁；
- 修复 导航属性的关系，误将 ManyToOne 设置成了 OneToMany；
- 补充 DbFirst GetTablesByDatabase 获取表备注；
- 补充 ISelect.ToList(a => new XxxDto { XxxId = a.Id, ... }) 支持，之前只能支持匿名类；
- 补充 扩展 IUpdate.Set(a => a.Title + "111") 指定字段在原基础上增加值的范围，之前只支持数字类型的累加；

## v0.4.1

- 抽离 FreeSql.DbContext 项目独立至 <https://github.com/dotnetcore/FreeSql.DbContext，实现面向对象ORM>；
- 补充 CodeFirst Fluent 之 IsVersion 乐观锁配置；

## v0.3.27

- 增加 乐观锁功能，适用修改实体；
- 增加 FreeSql.Repository 默认依赖注入的方式，同时保留原有 Autofac；
- 优化 FreeSql.Repository Insert 逻辑，参考了 FreeSql.DbContext；
- 优化 FreeSql.IUpdate 参照 IInsert 对大批量更新，拆分执行；
- 修复 FreeSql.IInsert ClearData 重复利用的 bug（使用 IgnoreColumns 进行大批量插入时会发生）；

## v0.3.26

- 修复 SqlServer CodeFirst 迁移联合主键的 bug [#23](https://github.com/dotnetcore/FreeSql/issues/23)；

## v0.3.25

- 修复 全局过滤器一个赋值低级错误；
- 增加 IFreeSql\<TMark\> 空接口，实现多个 IFreeSql 注入使用，使用泛型标识区分；

## v0.3.24

- 增加 GroupBy 分页方法；
- 修复 Insert 参数化命名 bug，当存在 Id Id2 时发生；
- 优化 Insert/Delete/Update 对象执行完后清理数据，以备多次使用；

## v0.3.23

- 修复 因功能增加，导致联表查询出现的表达式函数解析 bug；
- 修复 因功能增加，导致查询数据时，ExpressionTree bug；

## v0.3.22

- 优化 导航属性 ManyToOne 名称查找规则；
- 增加 IFreeSql.Aop 属性，未来所有拦截方法都在这里，第一期支持如下：
  - 监控 ToList 返回的的数据，用于拦截重新装饰；
  - 监视 Where，包括 select/update/delete，返回值 true 时可使上层不被执行；
  - 可自定义解析表达式；
- 增加 ISelect.TractToList，用于单次跟踪或审核实体；
- 优化 FreeSql.DbContext SaveChanges；

## v0.3.21

- 增加 IUpdate IgnoreColumns 重载方法，支持传入字符串数组忽略修改；
- 完善 FreeSql.DbContext，支持对象操作 + SaveChanges 最后保存操作；

## v0.3.20

- 修复 ToList 选择指定对象时，应附加所有字段查询返回；
- 修复 Lazy 延时类与实体关系冲突 bug；
- 修复 附加对象读取时，记录为空应该返回 null，而不是返回非 null（字段默认值）对象；

## v0.3.19

- 兼容 GetTableByEntity 有可能因为传入数组类型的错误；
- 修复 UnitOfWork 事务创建逻辑 bug；
- 增加 FreeSql.DbContext 扩展包；
- 调整 UnitOfWork、DbContext 不提交时默认会回滚；

## v0.3.18

- 增加 IInsert 对数组传入的支持，之前是 `IEnumerable<T>`；
- 增加 ORM 性能测试项目 Examples/orm_vs；

## v0.3.17

- 修复 SqlServer DbFirst 数据库名传入带小数点的 bug [#18](https://github.com/dotnetcore/FreeSql/issues/18)；
- 修复 ILIst.Contains Expression [#16](https://github.com/dotnetcore/FreeSql/issues/16)；
- 整理 延时加载/导航属性查询的对象关系，仍然不依赖外键；
- 完成 OneToOne/ManyToOne、ManyToMany/OneToMany 导航属性的查询 [#15](https://github.com/dotnetcore/FreeSql/issues/15)；
- 增加 IEnumerable`<TEntity>` 扩展方法 AsSelect，转成 `ISelect<T>`，以便使用 FreeSql 的查询功能；
- 增加 int.Parse Guid.Parse 系列转换、Guid.NewGuid、new Random.NextDouble 等表达式函数解析；

## v0.3.16

- 修复 IInsert/IUpdate.NoneParameter() 设成了反作用的 bug；
- 修复 IDbFirst.GetTablesByDatabase 默认数据库 bool 判断 bug；
- 增加 FreeSql.Repository 之 IUnitOfWork 实现；
- 增加 FreeSql.Repository 继承实现的仓储注入；

```csharp
builder.RegisterFreeRepository(
    filter => filter.Apply<Song>("test", a => a.Title == DateTime.Now.ToString() +
        Thread.CurrentThread.ManagedThreadId),
    this.GetType().Assembly
);
```

## v0.3.15

- 增加 ISelect.ToDataTable 系列方法；
- 增加 无参数化命令执行，可配置全局 ICodeFirst.IsNoneCommandParameter、或临时 IInsert/IUpdate.NoneParameter() 便于调试；
- 关闭 自动同步结构功能，避免线上环境误操作；
- 优化 IInsert 批量插入容易导致 values 过多、或参数化过多的问题，5 个数据库均已优化；

## v0.3.14

- 解决 SqlServer 批量添加容易导致的错误：传入的请求具有过多的参数。该服务器支持最多 2100 个参数。请减少参数的数目，然后重新发送该请求。原理为拆成多个包用事务执行；

## v0.3.13

- 修改 FreeSql.Repository Autofac 注入方式，真正的实现全局过滤功能；
- 增加 FreeSql.Repository DataFilter 属性；

```csharp
repos.DataFilter.Disable("test") 临时禁用，不影响全部；
repos.DataFilter.DisableAll()
repos.DataFilter.Enable("test")
repos.DataFilter.EnableAll()
repos.DataFilter.Apply("name", a => a.Id > 1) 附加新的过滤器
```

- 增加 using DataFilter.Disable、Enable 使用完成后恢复可用状态；

## v0.3.12

- 增加 ICodeFirst.IsConfigEntityFromDbFirst，若无配置实体类主键、自增，可从数据库导入；

## v0.3.11

- 增加 ISelect、IInsert、IUpdate、IDelete WithTransaction 方法，将事务对象暴露给外部；
- 增加 IAdo ExecuteXxx 系列方法重载，支持事务对象的传入；

## v0.1.14

- 增加 延时属性编译的错误提示；
- 优化 FreeSql.Repository Autofac 泛型注入；

## v0.1.13

- 修改 连接池内部 Ping Timeout 值暂定 5 秒；
- 优化 初始化时若数据库超时，则放弃预热；
- FreeSql.Repository 下增加 ISelect.FromRepository 扩展方法，实现快速合并多个仓储查询；
- 增加 FreeSql.Repository Autofac 泛型注入，支持实现全局过滤；
- 补充 GuidRepository 插入数据时，根据 filter 参数设定进行数据验证；

## v0.1.12

- 升级 nuget 依赖包；
- 增加 .netframework 4.6.1 示范项目；
- PostgreSQL 连接池大小默认值改为 50；
- ISelect 增加 Any/AnyAsync(Expression)，为的少写一个 Where；
- 关闭 CSScriptLib Debug 编译，防止权限错误；

## v0.1.11

- FreeSql ISelect/IUpdate/IInsert/IDelete 增加 AsTable 方法，实现分表；
- FreeSql.Repository 之 GuidRepository 实现分表扩展，原因系 Guid 适合作分布式存储；

## v0.1.10

- 修复 FreeSql.Repository GuidRepository/GetGuidRepository 缓存 bug；
- 修复 Lazy 延时加载在 linux 发布后产生 Bad IL Format bug；

## v0.1.9

- 优化插入判断主键，且为 Guid/Guid? 类型，并且值为 null/Guid.Empty 时，将插入的值变为 FreeUtil.NewMongodbId();

## v0.1.8

- 升级 nuget 依赖包；

## v0.1.7

- FreeSql.Repository 增加 filter 参数，实现数据过滤 + 验证；
  如：var postRepos = fsql.GetGuidRepository`<Post>`(a => a.TopicId == 1); postRepos CURD 方法都会以 lambda 条件作为查询或验证，Update/Insert 验证错误时会抛出异常。
- ISelect 增加 First/FirstAsync；

## v0.1.6

- 修复 FluentApiConfigEntity 与 延时加载 冲突产生的 bug；

## v0.1.5

- 删除 IsQuoteSqlName 参数配置；
- 增加 IsSyncStructureToUpper 参数配置，以便适应 Oracle 大小写使用习惯；
- FreeSql.Repository 增加 GuidRepository 类，适用 Insert 方法无须返回插入的数据；
- FreeSql.Repository 增加 IFreeSql 扩展方法 GetRepository、GetGuidRepository；

## v0.1.4

- 修复 SqlServer CodeFirst 迁移结构时，因日期默认值的语法错误；
- 判断 SqlServer 服务器版本，选择分页模式 row_number 或 offset fetch next；

## v0.1.3

- FreeSql.Repository Insert 方法判断数据库类型，由于 MySql/Oracle/Sqlite 不支持 returning 或 output 类型的特性，因此不作实现定义为 virtual 交给外部（不包括 PostgreSQL/SqlServer）；

## v0.1.2

- 增加 sqlserver2012 offset fetch next 的分页方式；
- 增加 ICodeFirst.GetConfigEntity 方法；

## v0.1.1

- 增加选项 IsQuoteSqlName 控制是否使用 [] 或 "" 或 `` 包含数据库名称 [#6](https://github.com/dotnetcore/FreeSql/issues/6)；

## v0.1.0

- 增加 FreeSql.Repository 扩展库，实现实体类的默认仓储；
- 增加主键命名约定：在没有设置主键的情况下，Id 或 \<type name\>Id 或 \<type name\>\_Id 或 自增列 会成为主键；
- 实体特性 Column 增加 IsIgnore 忽略达到不映射的目的；
- 增加 repository_01 示例项目，演示 FreeSql.Repository；
- 增加 website FreeSql 官方项目源码；

## v0.0.14

- ICodeFirst.ConfigEntity 可更新实体配置已缓存的数据；
- 防止同连接字符串被 IFreeSql 使用多次，发生连接池溢出 bug（ado.net 连接池原理，减少解释成本）；
- 增加 efcore_to_freesql 示例项目，实现与 EFCore 实体共存；

## v0.0.13

- 修复和丰富 ICodeFirst.ConfigEntity 方法；
- 增加 FreeSql.Extensions.EFCoreModelBuilder 扩展库，实现与 EFCore 实体共存 [#4](https://github.com/dotnetcore/FreeSql/issues/4)；
- 增加 restful 示例项目；

## v0.0.12

- lazy 延时属性父子关系的 1v 多类型判断修正，解决 int? != int 的 bug；
- ThreadLocal 修改使用方式；
- 使用 virtual 后实体序列化问题 [#5](https://github.com/dotnetcore/FreeSql/issues/5)，私有化属性；
- 由于 FreeSql 采用二次封装连接池，尽量避免使用问题，真实的 max pool size 值等于传入值+1；

## v0.0.11

- 修复 IAdo.Query 直接查询 sql 的 bug；
- 重新检查通过所有单元测试；
