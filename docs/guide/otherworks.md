# 其他作品

FreeSql 作者是一个入行 18年的老批，他目前写的开源项目还有：

| 开源项目 | 描述 | 开源地址 | 开源协议 |
| --- | --- | --- | --- |
| [AdminBlazor](AdminBlazor) | Blazor 后台权限管理 | https://gitee.com/FreeSql/AdminBlazor | Apache2.0 |
| [FreeIM](freeim) | 聊天系统架构 | https://github.com/2881099/FreeIM | MIT |
| [FreeRedis](freeredis) | Redis SDK | https://github.com/2881099/FreeRedis | MIT |
| [FreeScheduler](freescheduler) | 定时任务 | https://github.com/2881099/FreeScheduler | MIT |
| csredis |  | https://github.com/2881099/csredis | MIT |
| FightLandlord | 斗DI主网络版 | https://github.com/2881099/FightLandlord | 学习用途 |
| IdleBus | 空闲容器 | https://github.com/2881099/IdleBus | MIT |
| FreeSql| ORM | https://github.com/dotnetcore/FreeSql | MIT |
| FreeSql.Cloud | 分布式tcc/saga | https://github.com/2881099/FreeSql.Cloud | MIT |
| FreeSql.AdminLTE | 低代码后台生成 | https://github.com/2881099/FreeSql.AdminLTE | MIT |
| FreeSql.DynamicProxy | 动态代理 | https://github.com/2881099/FreeSql.DynamicProxy | 学习用途 |

更早的作品可以直接访问 https://github.com/2881099 查看。

## csredis

.NET Core or .NET Framework 4.0+ client for Redis and Redis Sentinel (2.8) and Cluster. Includes both synchronous and asynchronous clients.

`CSRedisCore` 是 .NETFramework 4.0 及以上 访问 redis-server 的客户端组件，也是 FreeSql 作者早年发布的 nuget 版本。

后来重构了更简易的 `FreeRedis`，目前推荐大家使用 `FreeRedis`。

开源地址：[https://github.com/2881099/csredis](https://github.com/2881099/csredis)

## FreeRedis

基于 .NET 的 Redis 客户端，支持 .NET Core 2.1+、.NET Framework 4.0+ 以及 Xamarin。

开源地址：[https://github.com/2881099/FreeRedis](https://github.com/2881099/FreeRedis)

扩展资料：[《.NET Redis Client 又多了一个选择，还在被 StackExchange.Redis Timeout 问题困扰吗？》](https://www.cnblogs.com/FreeSql/p/16455983.html)

## FreeScheduler

FreeScheduler 是利用 IdleBus 实现的轻量化定时任务调度，支持临时的延时任务和重复循环任务(可持久化)，可按秒，每天/每周/每月固定时间，自定义间隔执行，支持 .NET Core 2.1+、.NET Framework 4.0+ 运行环境。

开源地址：[https://github.com/2881099/FreeScheduler](https://github.com/2881099/FreeScheduler)

扩展资料：[《.NET 定时任务 -- FreeScheduler 支持 cron、持久化、可变定时设置》](https://www.cnblogs.com/FreeSql/p/16623030.html)

## FreeIM

FreeIM 使用 websocket 协议实现简易、高性能（单机支持5万+连接）、集群即时通讯组件，支持点对点通讯、群聊通讯、上线下线事件消息等众多实用性功能。 

使用场景：好友聊天、群聊天、直播间、实时评论区、游戏。

开源地址：[https://github.com/2881099/FreeIM](https://github.com/2881099/FreeIM)

扩展资料：[《C#.NET im 聊天通讯架构设计 -- FreeIM 支持集群、职责分明、高性能》](https://www.cnblogs.com/FreeSql/p/16632727.html)

## AdminBlazor

AdminBlazor 是一款 Blazor SSR 后台管理项目，支持 RABC 权限菜单/按钮，支持一对一、一对多、多对多代码生成 .razor 界面。

集成功能：菜单管理、角色管理、用户管理、定时任务、字典管理

依赖组件：BootstrapBlazor、FreeSql、FreeScheduler、Rougamo

开源地址：[https://github.com/2881099/AdminBlazor](https://github.com/2881099/AdminBlazor)

## FightLandlord

.NETCore斗地主服务端 + HTML5前端，使用了 FreeIM 网络通讯

开源地址：[https://github.com/2881099/FightLandlord](https://github.com/2881099/FightLandlord)

## IdleBus

IdleBus 空闲对象管理容器，有效组织对象重复利用，自动创建、销毁，解决【实例】过多且长时间占用的问题。

开源地址：[https://github.com/2881099/IdleBus](https://github.com/2881099/IdleBus)

## FreeSql

FreeSql 是一款功能强大的对象关系映射（O/RM）组件，支持 .NET Core 2.1+、.NET Framework 4.0+ 以及 Xamarin。

开源地址：[https://github.com/2881099/FreeSql](https://github.com/2881099/FreeSql)

## FreeSql.Cloud

为 FreeSql 提供跨数据库访问，分布式事务TCC、SAGA解决方案，支持 .NET Core 2.1+, .NET Framework 4.0+.

开源地址：[https://github.com/2881099/FreeSql.Cloud](https://github.com/2881099/FreeSql.Cloud)

扩展资料：[《FreeSql 将 Saas 租户方案精简到极致[.NET ORM SAAS]》](https://www.cnblogs.com/FreeSql/p/16556303.html)、[FreeSql 分布式事务 TCC/Saga 编排重要性](https://www.cnblogs.com/FreeSql/p/16594837.html)

## FreeSql.AdminLTE

.NETCore MVC 中间件，基于 AdminLTE 前端框架动态产生指定 FreeSql 实体的增删查改的【预览管理功能】。

开源地址：[https://github.com/2881099/FreeSql.AdminLTE](https://github.com/2881099/FreeSql.AdminLTE)

扩展资料：[《【低码】asp.net core 实体类可生产 CRUD 后台管理界面》](https://www.cnblogs.com/FreeSql/p/16287701.html)

## FreeSql.DynamicProxy

轻量级 AOP 动态代理，支持 .NetCore 或 .NetFramework4.0+ 平台，使用动态编译技术一般用于学习用途。

开源地址：[https://github.com/2881099/FreeSql.DynamicProxy](https://github.com/2881099/FreeSql.DynamicProxy)
