# Awesome FreeSql

## FreeSql 官方博客

- [https://www.cnblogs.com/kellynic/](https://www.cnblogs.com/kellynic/)
- [https://www.cnblogs.com/freesql/](https://www.cnblogs.com/freesql/)

## 官方文档

- [https://freesql.net](https://freesql.net)
- [https://github.com/dotnetcore/FreeSql/wiki](https://github.com/dotnetcore/FreeSql/wiki)
- [API 参考(国内镜像)](http://124.70.130.97:8082/api/index.html)
- [API 参考](https://docs.dotnet-china.com/FreeSql/index.html)

## 源码

- GitHub [https://github.com/dotnetcore/FreeSql](https://github.com/dotnetcore/FreeSql)
- Gitee [https://gitee.com/FreeSql/FreeSql-ORM](https://gitee.com/FreeSql/FreeSql-ORM)

## 相关博客指南

- [FreeSql 接入 CAP 的实践](https://www.cnblogs.com/igeekfan/p/cap_freesql_flush.html)
- [FreeSql.Generator 命令行代码生成器是如何实现的](https://www.cnblogs.com/igeekfan/p/freesql-generator.html)

## 以下可从[GitHub Issues Docs](https://github.com/dotnetcore/FreeSql/issues?q=label%3Adocs)找到

- [CentOS8 ARM 下连接 SQL Server 2008 R2（Hypervisor）](https://github.com/dotnetcore/FreeSql/issues/601)
- [一对多关系，分表只取关联的第一条记录，如何获取](https://github.com/dotnetcore/FreeSql/issues/430)

## 基于 FreeSql 的开源项目

|项目|说明|
|:--:|:--|
|[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=zhontai&repo=Admin.Core)](https://github.com/zhontai/Admin.Core)|`Admin`后端，前后端分离的权限管理系统。支持多租户、动态Api、任务调度、滑块拼图验证、国内外主流数据库自由切换和动态高级查询。基于.Net跨平台开发的WebApi。集成统一认证授权、数据验证、缓存、Ip限流、全Api鉴权、集成测试、性能分析、接口文档等。|
|[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=luoyunchong&repo=lin-cms-dotnetcore)](https://github.com/luoyunchong/lin-cms-dotnetcore)|😃A simple and practical CMS implemented by .NET 6 + FreeSql；前后端分离、Docker部署、OAtuh2授权登录、自动化部署DevOps、自动同步至Gitee、代码生成器、仿掘金专栏|
|[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=alonsoalon&repo=TenantSite.Server)](https://github.com/alonsoalon/TenantSite.Server)|SaaS 企业应用管理系统，定位于企业应用的SaaS服务框架，企业云端应用的基础开发框架（当然也可以部署于本地），系统被设计用于多租户，采用前端后端完全分离技术方案。 抽离企业应用软件研发公共部分，让研发人员有条件聚焦在业务研发，实现了用于权限管理的基础数据维护，权限赋权，缓存，上传等常规功能。|
|[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=hejiyong&repo=fscms)](https://github.com/hejiyong/fscms)|fscms 文档类的cms，通过wiki动态生成文档，包括后端完整权限管理和前端文档页，采用freesql orm，layer。|
|[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=densen2014&repo=FreeSqlDemos)](https://github.com/densen2014/FreeSqlDemos)|FreeSql 的各种工程 demo, console,xamarin app,ios,android,wpf,blazor,nf461|
|[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=yc-l&repo=yc.boilerplate)](https://github.com/yc-l/yc.boilerplate)|YC.Boilerplate 是一套快速开发框架，采用当下流行的前后端分离开发模式，前端 采用VUE 2.0、后端采用Net 5.0；框架实现了多租户、动态webApi、多种ORM、IOC、数据库表和业务代码生成等等一系列模块，并开发了用户管理、角色权限、组织机构、数据字典、审计日志等常规功能。|

<style>
table th:first-of-type {
   min-width:400px;
}
</style>

<!-- 无法正常预览 -->
<!-- |[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=jasonyush&repo=EasyCMS)](https://github.com/jasonyush/EasyCMS)|EasyCms 企业建站，事业单位使用的 CMS 管理系统| -->

### [EasyCMS](https://github.com/aprilyush/EasyCMS)

EasyCms后台权限管理系统 基于`Asp.net Core`的后台快速开发框架，可用于快速开发 企业后台管理系统，WebApi接口，微信公众号和小程序后台，企业站。

### [基于.Net Core 3.1 或 .Net 5 框架简单 2 层架构，实现基于权限角色的页面级权限后台框架](https://gitee.com/sundayisblue/BoYuanCore/)

实现页面权限基于权限角色的后台框架，配套完善代码生成工具，可开箱即用，适用于中小型项目快速开发。 项目为`.Net Core 3.1`或`.Net 5`，使用简单的`service`分层架构，前端为`FineUICore` , 数据层使用 FreeSql ORM+
雪花算法实体模式，兼容各种不同的数据库迁移(支持的数据库：`SqlServer`, `Mysql`, `Postgresql`,`Oracle` 等)，并有完善的异常拦截写入日志功能。 优秀的编码体验，层次分明，简单易学，从而实现快速开发的目的，
或入门学习`.Net Core`。

### [基于.Net 5 平台的快速开发框架](https://gitee.com/rongguohao/HaoHaoPlay_Back)

基于`.Net 5`平台的快速开发框架。
目前系统包含功能有登录，用户管理，应用菜单管理，权限管理，字典管理，退出登录，也方便扩展多租户使用。
通过这些基础功能的实现，分享自己对系统框架设计的理解，对`ddd`设计的理解，希望对大家学习使用`.net core`有帮助，少踩一些坑，当然也会存在不足之处，还望指出。
