---
layout: default
---

## 版本

FreeSql 是一个 .NET Standard 2.0 库，仅支持 .NET Framework 4.0 或 .NET Core 或更高版本的应用程序。

## 安装

```bash
dotnet add package FreeSql
```

## Packages

| Package Name | Version | 说明 |
|--------------|  ------- | --- |
| [FreeSql.Repository](/repository) | NETStandard2.0、net45、net40 | 通用仓储 + UnitOfWork 实现 |
| [FreeSql.DbContext](/db-context) | NETStandard2.0、net45、net40 | EFCore 的使用风格实现 |
| FreeSql.Provider.MySql | NETStandard2.0、net45、net40 | 基于 MySql.Data（Oracle官方） |
| FreeSql.Provider.MySqlConnector | NETStandard2.0、net45 | 基于 MySqlConnector |
| FreeSql.Provider.PostgreSQL | NETStandard2.0、net45 | 基于 PostgreSQL 9.5+ |
| FreeSql.Provider.SqlServer | NETStandard2.0、net45、net40 | 基于 SqlServer 2005+ |
| FreeSql.Provider.SqlServerForSystem | NETStandard2.0、net45、net40 | 基于 System.Data.SqlClient + SqlServer 2005+ |
| FreeSql.Provider.Sqlite | NETStandard2.0、net45、net40 | |
| FreeSql.Provider.Oracle | NETStandard2.0、net45、net40 | |
| FreeSql.Provider.Firebird | NETStandard2.0、net452 | |
| FreeSql.Provider.MsAccess | NETStandard2.0、net45、net40 | |
| FreeSql.Provider.Dameng | NETStandard2.0、net45、net40 | 基于 达梦数据库 |
| FreeSql.Provider.ShenTong | NETStandard2.0、net45、net40 | 基于 神舟通用数据库 |
| FreeSql.Provider.KingbaseES | NETStandard2.0、net461 | 基于 人大金仓数据库 |
| FreeSql.Provider.Odbc | NETStandard2.0、net45、net40 | 基于 ODBC |
| FreeSql.Extensions.LazyLoading | NETStandard2.0、net45、net40 | 延时属性扩展包 |
| FreeSql.Extensions.JsonMap | NETStandard2.0、net45、net40 | Json 序列化扩展包 |
| FreeSql.Extensions.Linq | NETStandard2.0、net45、net40 | LinqToSql IQueryable 扩展包 |
| FreeSql.Extensions.BaseEntity | NETStandard2.0 | |
| FreeSql.Generator | NETCoreapp3.1 | 从数据库生成实体类，[生成器是如何实现的？](https://www.cnblogs.com/igeekfan/p/freesql-generator.html) |
