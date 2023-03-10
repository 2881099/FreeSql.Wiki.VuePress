# 指南

[![Member project of .NET Core Community](https://img.shields.io/badge/member%20project%20of-NCC-9e20c9.svg)](https://github.com/dotnetcore)
[![nuget](https://img.shields.io/nuget/v/FreeSql.svg?style=flat-square)](https://www.nuget.org/packages/FreeSql)
[![nuget](https://img.shields.io/nuget/vpre/FreeSql.svg?style=flat-square)](https://www.nuget.org/packages/FreeSql)
[![stats](https://img.shields.io/nuget/dt/FreeSql.svg?style=flat-square)](https://www.nuget.org/stats/packages/FreeSql?groupby=Version)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dotnetcore/FreeSql/blob/master/LICENSE)

[![Stargazers over time](https://starchart.cc/dotnetcore/FreeSql.svg)](https://starchart.cc/dotnetcore/FreeSql)

## FreeSql

`FreeSql`是功能强大的 `.NET ORM`，支持 `.NetFramework 4.0+`、`.NetCore 2.1+`、`Xamarin`等支持 NetStandard 所有运行平台。

支持 `MySql/SqlServer/PostgreSQL/Oracle/Sqlite/Firebird/ClickHouse/QuestDB/达梦/南大通用GBase/神通/人大金仓/虚谷/翰高/华为GaussDB/MsAccess` 等数据库，以及自定义适配其它数据库。

- QQ 群：561616019(在线)、4336577(已满)、8578575(已满)、52508226(已满)

- 反馈问题请前往 [https://github.com/dotnetcore/FreeSql/issues](https://github.com/dotnetcore/FreeSql/issues)

- 欢迎微信关注 **dotNET 搬砖队**，分享 .NET Core + FreeSql 相关技术栈

![分享.NET Core+FreeSql相关技术](/wechat_qrcode.jpg)

## 特性

- [x] 支持 CodeFirst 迁移；
- [x] 支持 DbFirst 从数据库导入实体类，支持三种模板生成器；
- [x] 采用 ExpressionTree 高性能读取数据；
- [x] 支持深入的类型映射，比如 pgsql 的数组类型，堪称匠心制作；
- [x] 支持丰富的表达式函数；
- [x] 支持导航属性查询，和延时加载；
- [x] 支持同步/异步数据库操作方法，丰富多彩的链式查询方法；
- [x] 支持读写分离、分表分库，租户设计；
- [x] 支持多种数据库，MySql/SqlServer/PostgreSQL/Oracle/Sqlite/Firebird/ClickHouse/QuestDB/达梦/南大通用GBase/神通/人大金仓/虚谷/翰高/华为GaussDB/MsAccess；

## 学习指南

FreeSql 除了支持基本的增删查改功能外，还支持基于现有数据库创建模型（[DbFirst](db-first.md)），和支持基于模型创建数据库（[CodeFirst](code-first.md))。

#### 基础

- [《学习 FreeSql 之一：添加数据》](insert.md)
- [《学习 FreeSql 之二：删除数据》](delete.md)
- [《学习 FreeSql 之三：修改数据》](update.md)
- [《学习 FreeSql 之四：查询数据》](select.md)
- [《仓储层 Repository》](repository.md)

#### 进阶

- [《CodeFirst 模式开发介绍》](code-first.md)
  - [《CodeFirst 模式之一：实体特性》](entity-attribute.md)
  - [《CodeFirst 模式之二：FluentApi》](fluent-api.md)
  - [《CodeFirst 模式之三：自定义特性》](custom-attribute.md)
  - [《CodeFirst 模式之四：类型映射》](type-mapping.md)
  - [《CodeFirst 模式之五：迁移结构》](code-first.md#迁移结构)

* [《DbFirst 模式开发介绍》](db-first.md)

#### 高级

- [《数据库事务》](transaction.md)
- [《使用读写分离》](read-write-splitting.md)
- [《分表分库》](sharding.md)
- [《多租户》](multi-tenancy.md)
- [《返回数据》](select-return-data.md)
- [《优化之：延时加载》](select-lazy-loading.md)
- [《优化之：贪婪加载》](select-include.md)
- [《Expression 表达式函数》](expression-function.md)
- [《AOP》](aop.md)
