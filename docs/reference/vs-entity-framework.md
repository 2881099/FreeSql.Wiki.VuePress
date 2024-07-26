# 与 EntityFramework 比较

为什么要写这篇文章？

2020 年 写下这篇完整一点的 .NET ORM 比较，为准备使用 FreeSql 的朋友解惑。

## 基础信息比较

| 功能项        | FreeSql                                          | EFCore      |
| ------------- | ------------------------------------------------ | ----------- |
| 出生时间      | 2018 年 12 月                                    | 2015 年(约) |
| 开源协议      | MIT                                              | Apache-2.0  |
| 所属机构      | [dotnetcore(NCC)](https://github.com/dotnetcore) | dotnet      |
| 单元测试数量  | 5500+                                            | 很多        |
| github star   | 2.1k+                                            | 9.5k+       |
| github issues | 活跃                                             | 活跃        |
| 支持平台      | .NET4.0+、.NETCore                               | .NETCore    |
| 支持数据库    | 很多，并且行为一致                               | 很多        |
| 生命周期      | Singleton                                        | Scoped      |
| 使用方式      | IFreeSql、Repository                             | DbContext   |

FreeSql .NET ORM 支持 MySql/SqlServer/PostgreSQL/Oracle/Sqlite/Firebird/达梦/人大金仓/神舟通用/南大通用/虚谷/翰高/Access/ClickHouse/QuestDB，以及自定义适配。

.NET ORM 各有自已看家本领，本文主要按 FreeSql 提供的功能进行列举比较，如有冒犯请见谅，也欢迎向 FreeSql 提出功能建议。

每个功能实现的深度层次不一样（比如 EFCore 支持 SqlServer 2012，FreeSql 支持 SqlServer 2005），很难彻底比较，提示：

- 本文比较的功能 FreeSql 每种数据库基本都有提供，不像 EFCore 偏向 SqlServer
- 本文只比较官方提供的功能（不包含第三方扩展）

![](https://img2020.cnblogs.com/blog/31407/202009/31407-20200914063104631-2088330287.png)

![](https://img2020.cnblogs.com/blog/31407/202009/31407-20200914063148941-1489586974.png)

## .NET ORM 整体功能比较

| 功能项                                                          | FreeSql | EFCore |
| --------------------------------------------------------------- | ------- | ------ |
| .NET ORM CodeFirst 根据实体类型，创建表结构                     | ✔       | ✔      |
| .NET ORM CodeFirst 根据实体类型，对比表结构                     | ✔       | ✔      |
| .NET ORM CodeFirst 根据实体类型注释，迁移表结构备注             | ✔       | -      |
| .NET ORM CodeFirst FluentApi                                    | ✔       | ✔      |
| .NET ORM CodeFirst FluentApi 语法兼容 EFCore                    | ✔       | ✔      |
| .NET ORM CodeFirst 实体特性兼容 EFCore                          | ✔       | ✔      |
| .NET ORM CodeFirst 自定义实体特性(Aop)                          | ✔       | -      |
| .NET ORM CodeFirst 类型转换映射(MapType)                        | ✔       | ✔      |
| .NET ORM DbFirst 根据数据库，生成实体类                         | ✔       | ✔      |
| .NET ORM 导航属性(OneToOne)                                     | ✔       | ✔      |
| .NET ORM 导航属性(ManyToOne)                                    | ✔       | ✔      |
| .NET ORM 导航属性(OneToMany)                                    | ✔       | ✔      |
| .NET ORM 导航属性(ManyToMany)                                   | ✔       | -      |
| .NET ORM 导航属性(Parent) [父子关系的实体类](../guide/select-as-tree.md) | ✔       | -      |
| .NET ORM 导航属性延时加载、贪婪加载、级联保存                   | ✔       | ✔      |
| .NET ORM 自定义表达式树解析                                     | ✔       | -      |
| .NET ORM 全局过滤器                                             | ✔       | ✔      |
| .NET ORM 事务                                                   | ✔       | ✔      |
| .NET ORM 读写分离                                               | ✔       | -      |
| .NET ORM 分表分库                                               | ✔       | -      |
| .NET ORM 仓储 Repository                                        | ✔       | -      |
| .NET ORM 工作单元 UnitOfWork                                    | ✔       | -      |
| .NET ORM 工作单元管理器 UnitOfWorkManager                       | ✔       | -      |
| .NET ORM DbContext 状态管理                                     | ✔       | ✔      |

## .NET ORM CRUD 功能比较

| 功能项                                                                                     | FreeSql | EFCore |
| ------------------------------------------------------------------------------------------ | ------- | ------ |
| .NET ORM CRUD 时，映射动态表名                                                             | ✔       | -      |
| .NET ORM CRUD 时，使用参数化 SQL 执行                                                      | ✔       | ✔      |
| .NET ORM CRUD 时，不使用参数化 SQL 执行(NoneParameter)                                     | ✔       | -      |
| .NET ORM CRUD 时，获取对应的 SQL(ToSql)                                                    | ✔       | -      |
| .NET ORM CRUD 时，统一审计实体属性值(Aop.AuditValue)                                       | ✔       | -      |
|                                                                                            |         |        |
| .NET ORM 插入(单条)                                                                        | ✔       | ✔      |
| .NET ORM 插入时，忽略/指定列                                                               | ✔       | -      |
| .NET ORM 插入时，返回影响的行数                                                            | ✔       | -      |
| .NET ORM 插入时，返回插入后的自增值                                                        | ✔       | ✔      |
| .NET ORM 插入时，返回插入后的记录                                                          | ✔       | -      |
| .NET ORM 插入时，Insert Ignore Into                                                        | ✔       | -      |
| .NET ORM 插入时，On Duplicate Key Update                                                   | ✔       | -      |
| .NET ORM 插入时，On Conflict Do Update                                                     | ✔       | -      |
| .NET ORM 批量插入 [性能测试结果参考文档](https://www.cnblogs.com/kellynic/p/10557882.html) | ✔       | -      |
| .NET ORM 批量插入时，自动分批 [参考文档](../guide/insert.md)                                        | ✔       | -      |
| .NET ORM 批量插入时，使用 BulkCopy                                                         | ✔       | -      |
|                                                                                            |         |        |
| .NET ORM 更新(单条)                                                                        | ✔       | ✔      |
| .NET ORM 更新时，动态条件(WhereDynamic)                                                    | ✔       | -      |
| .NET ORM 更新时，根据实体对象更新                                                          | ✔       | -      |
| .NET ORM 更新时，根据状态管理只更新有变化的属性                                            | ✔       | ✔      |
| .NET ORM 更新时，忽略/指定列                                                               | ✔       | -      |
| .NET ORM 更新时，原子性 set num=num+1                                                      | ✔       | -      |
| .NET ORM 更新时，指定条件                                                                  | ✔       | -      |
| .NET ORM 更新时，自动附加全局过滤器条件                                                    | ✔       | -      |
| .NET ORM 更新时，不需要先查询                                                              | ✔       | -      |
| .NET ORM 更新时，使用乐观行锁                                                              | ✔       | ✔      |
| .NET ORM 更新时，使用悲观锁                                                                | ✔       | -      |
| .NET ORM 更新时，返回影响的行数                                                            | ✔       | -      |
| .NET ORM 更新时，返回更新后的记录                                                          | ✔       | -      |
| .NET ORM 批量更新                                                                          | ✔       | -      |
|                                                                                            |         |        |
| .NET ORM 删除(单条)                                                                        | ✔       | ✔      |
| .NET ORM 删除时，动态条件(WhereDynamic)                                                    | ✔       | -      |
| .NET ORM 删除时，指定条件                                                                  | ✔       | -      |
| .NET ORM 删除时，自动附加全局过滤器条件                                                    | ✔       | -      |
| .NET ORM 删除时，不需要先查询                                                              | ✔       | -      |
| .NET ORM 删除时，返回影响的行数                                                            | ✔       | -      |
| .NET ORM 删除时，返回插入后的记录                                                          | ✔       | -      |
| .NET ORM 级联保存                                                                          | ✔       | ✔      |
| .NET ORM 添加或更新                                                                        | ✔       | -      |
| .NET ORM 添加或更新，自动适配 merge into [参考文档](../guide/insert-or-update.md)                   | ✔       | -      |
| .NET ORM 批量编辑保存 [参考文档](../guide/insert-or-update.md)                                      | ✔       | ✔      |
|                                                                                            |         |        |
| .NET ORM 查询(单条)                                                                        | ✔       | ✔      |
| .NET ORM 查询时，分页                                                                      | ✔       | ✔      |
| .NET ORM 查询时，分页支持 SqlServer2008                                                    | ✔       | -      |
| .NET ORM 查询时，动态条件(WhereDynamic)                                                    | ✔       | -      |
| .NET ORM 查询时，动态过滤条件(WhereDynamicFilter) [参考文档](../guide/select.md)                    | ✔       | -      |
| .NET ORM 查询时，自动附加全局过滤器条件                                                    | ✔       | -      |
| .NET ORM 查询时，多表条件传播(WhereCascade)                                                | ✔       | -      |
| .NET ORM 查询时，在 lambda 中使用导航属性                                                  | ✔       | ✔      |
| .NET ORM 查询时，用 Dto 映射只需要查询的字段                                               | ✔       | -      |
| .NET ORM 查询时，传 Sql 作二次查询(WithSql)                                                | ✔       | -      |
| .NET ORM 查询时，子查询(Exists)                                                            | ✔       | -      |
| .NET ORM 查询时，子查询(In)                                                                | ✔       | -      |
| .NET ORM 查询时，子查询拼接结果(string.Join) [参考文档](../guide/select-multi-table.md)             | ✔       | -      |
| .NET ORM 查询时，使用分组聚合(GroupBy/Having)                                              | ✔       | ✔      |
| .NET ORM 查询时，使用 Linq To Sql 语法                                                     | ✔       | ✔      |
| .NET ORM 查询时，针对树形结构表 [父子关系的实体类](../guide/select-as-tree.md)                      | ✔       | -      |
