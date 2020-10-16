---
layout: default
---

FreeSql是功能强大的 .NET ORM，支持 .NetFramework 4.0+、.NetCore 2.1+、Xamarin 等支持 NetStandard 所有运行平台。

QQ群：4336577(已满)、8578575(在线)、52508226(在线)

- 欢迎微信关注 **dotNET搬砖队**，分享 .NET Core + FreeSql 相关技术栈

![分享.NET Core+FreeSql相关技术](/wechat_qrcode.jpg)

## 特性

- [ ]....
- [x] 支持 CodeFirst 迁移；
- [x] 支持 DbFirst 从数据库导入实体类，支持三种模板生成器；
- [x] 采用 ExpressionTree 高性能读取数据；
- [x] 支持深入的类型映射，比如pgsql的数组类型，堪称匠心制作；
- [x] 支持丰富的表达式函数；
- [x] 支持导航属性查询，和延时加载；
- [x] 支持同步/异步数据库操作方法，丰富多彩的链式查询方法；
- [x] 支持读写分离、分表分库，租户设计；
- [x] 支持多种数据库，MySql/SqlServer/PostgreSQL/Oracle/Sqlite/Firebird/达梦/神通/人大金仓/MsAccess；

## 学习指南

FreeSql 除了支持基本的增删查改功能外，还支持基于现有数据库创建模型（[DbFirst](/db-first)），和支持基于模型创建数据库（[CodeFirst](/code-first))。

#### 基础

- [《学习FreeSql之一：添加数据》](/insert)
- [《学习FreeSql之二：删除数据》](/delete)
- [《学习FreeSql之三：修改数据》](/update)
- [《学习FreeSql之四：查询数据》](/select)
- [《仓储层Repository》](/repository)

#### 进阶

* [《CodeFirst模式开发介绍》](/code-first)
    * [《CodeFirst模式之一：实体特性》](/entity-attribute)
    * [《CodeFirst模式之二：FluentApi》](/fluent-api)
    * [《CodeFirst模式之三：自定义特性》](/custom-attribute)
    * [《CodeFirst模式之四：类型映射》](/type-mapping)
    * [《CodeFirst模式之五：迁移结构》](/code-first#迁移结构)
- [《DbFirst模式开发介绍》](/db-first)

#### 高级

- [《数据库事务》](/transaction)
- [《使用读写分离》](/read-write-splitting)
- [《分表分库》](/sharding)
- [《多租户》](/multi-tenancy)
- [《返回数据》](/select-return-data)
- [《优化之：延时加载》](/select-lazy-loading)
- [《优化之：贪婪加载》](/select-include)
- [《Expression 表达式函数》](/expression-function)
- [《AOP》](/aop)