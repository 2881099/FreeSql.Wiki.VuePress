# Install

FreeSql is a `.NET Standard 2.0` library, which only supports applications of `.NET Framework 4.0`, `.NET Core` or higher.

```
dotnet add package FreeSql
dotnet add package FreeSql.DbContext
dotnet add package FreeSql.Provider.MySqlConnector
```

## Packages

| Package Name                                                                                                | Version                      | Description                                                                                                               | NuGet                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FreeSql.Repository](Repository)                                                                            | NETStandard2.0、net45、net40 | Common Repository + UoW                                                                                                   | **[![NuGet](https://buildstats.info/nuget/FreeSql.Repository)](https://www.nuget.org/packages/FreeSql.Repository)**                                   |
| [FreeSql.DbContext](DbContext)                                                                              | NETStandard2.0、net45、net40 | EfCore Style Implementation                                                                                               | **[![NuGet](https://buildstats.info/nuget/FreeSql.DbContext)](https://www.nuget.org/packages/FreeSql.DbContext)**                                     |
| FreeSql.Provider.MySql                                                                                      | NETStandard2.0、net45、net40 | Based on MySql.Data (Oracle official)                                                                                     | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.MySql)](https://www.nuget.org/packages/FreeSql.Provider.MySql)**                           |
| FreeSql.Provider.MySqlConnector                                                                             | NETStandard2.0、net45        | Based on MySqlConnector                                                                                                   | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.MySqlConnector)](https://www.nuget.org/packages/FreeSql.Provider.MySqlConnector)**         |
| FreeSql.Provider.PostgreSQL                                                                                 | NETStandard2.0、net45        | Based on PostgreSQL 9.5+                                                                                                  | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.PostgreSQL)](https://www.nuget.org/packages/FreeSql.Provider.PostgreSQL)**                 |
| FreeSql.Provider.SqlServer                                                                                  | NETStandard2.0、net45、net40 | Support SqlServer 2005+, based on Microsoft.Data.SqlClient                                                                | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.SqlServer)](https://www.nuget.org/packages/FreeSql.Provider.SqlServer)**                   |
| FreeSql.Provider.SqlServerForSystem                                                                         | NETStandard2.0、net45、net40 | Support SqlServer 2005+, based on Microsoft.Data.SqlClient                                                                | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.SqlServerForSystem)](https://www.nuget.org/packages/FreeSql.Provider.SqlServerForSystem)** |
| FreeSql.Provider.Sqlite                                                                                     | NETStandard2.0、net45、net40 |                                                                                                                           | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.Sqlite)](https://www.nuget.org/packages/FreeSql.Provider.Sqlite)**                         |
| FreeSql.Provider.Oracle                                                                                     | NETStandard2.0、net45、net40 | Oracle.ManagedDataAccess.Core                                                                                             | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.Oracle)](https://www.nuget.org/packages/FreeSql.Provider.Oracle)**                         |
| FreeSql.Provider.Firebird                                                                                   | NETStandard2.0、net452       | FirebirdSql.Data.FirebirdClient                                                                                           | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.Firebird)](https://www.nuget.org/packages/FreeSql.Provider.Firebird)**                     |
| FreeSql.Provider.MsAccess                                                                                   | NETStandard2.0、net45、net40 |                                                                                                                           | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.MsAccess)](https://www.nuget.org/packages/FreeSql.Provider.MsAccess)**                     |
| FreeSql.Provider.Dameng                                                                                     | NETStandard2.0、net45、net40 | Based on Dameng Database                                                                                                  | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.Dameng)](https://www.nuget.org/packages/FreeSql.Provider.Dameng)**                         |
| FreeSql.Provider.ShenTong                                                                                   | NETStandard2.0、net45、net40 | Based on ShenTong Database                                                                                                | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.ShenTong)](https://www.nuget.org/packages/FreeSql.Provider.ShenTong)**                     |
| FreeSql.Provider.KingbaseES                                                                                 | NETStandard2.0、net461       | Based on KingbaseEs                                                                                                       | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.KingbaseES)](https://www.nuget.org/packages/FreeSql.Provider.KingbaseES)**                 |
| [FreeSql.Provider.Odbc](https://github.com/2881099/FreeSql/tree/master/Providers/FreeSql.Provider.Odbc)     | NETStandard2.0、net45、net40 | Based on ODBC                                                                                                             | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.Odbc)](https://www.nuget.org/packages/FreeSql.Provider.Odbc)**                             |
| [FreeSql.Provider.Custom](https://github.com/2881099/FreeSql/tree/master/Providers/FreeSql.Provider.Custom) | NETStandard2.0、net45、net40 | Custom database provider                                                                                                  | **[![NuGet](https://buildstats.info/nuget/FreeSql.Provider.Custom)](https://www.nuget.org/packages/FreeSql.Provider.Custom)**                         |
| FreeSql.Extensions.LazyLoading                                                                              | NETStandard2.0、net45、net40 | Lazy loading extensions                                                                                                   | **[![NuGet](https://buildstats.info/nuget/FreeSql.Extensions.LazyLoading )](https://www.nuget.org/packages/FreeSql.Extensions.LazyLoading )**         |
| FreeSql.Extensions.JsonMap                                                                                  | NETStandard2.0、net45、net40 | Json serialization extensions                                                                                             | **[![NuGet](https://buildstats.info/nuget/FreeSql.Extensions.JsonMap)](https://www.nuget.org/packages/FreeSql.Extensions.JsonMap)**                   |
| FreeSql.Extensions.Linq                                                                                     | NETStandard2.0、net45、net40 | LinqToSql IQueryable extensions                                                                                           | **[![NuGet](https://buildstats.info/nuget/FreeSql.Extensions.Linq )](https://www.nuget.org/packages/FreeSql.Extensions.Linq)**                        |
| FreeSql.Extensions.BaseEntity                                                                               | NETStandard2.0               |                                                                                                                           | **[![NuGet](https://buildstats.info/nuget/FreeSql.Extensions.BaseEntity)](https://www.nuget.org/packages/FreeSql.Extensions.BaseEntity)**             |
| FreeSql.Generator                                                                                           | NETCoreapp3.1                | Generate entity classes from the database. [How does it work?](https://www.cnblogs.com/igeekfan/p/freesql-generator.html) | **[![NuGet](https://buildstats.info/nuget/FreeSql.Generator )](https://www.nuget.org/packages/FreeSql.Generator )**                                   |

## Guide

FreeSql supports basic CURD. In addition, it also supports creating models based on existing databases ([DbFirst](DbFirst-Mode)), and supports creating databases based on models ([CodeFirst](CodeFirst-Mode)).

#### Getting Started

- [《FreeSql 101, Part 1: Insert Data》](Insert-Data)
- [《FreeSql 101, Part 2: Delete Data》](Delete-Data)
- [《FreeSql 101, Part 3: Update Data》](Update-Data)
- [《FreeSql 101, Part 4: Query Data》](Query-Data)
- [《Repository Layer》](Repository-Layer)

#### Deep Learning

- [《Introduction to Codefirst Mode》](CodeFirst-Mode)
    - [《CodeFirst Mode, Part 1: Entity Attributes》](Entity-Attributes)
    - [《CodeFirst Mode, Part 2: FluentApi》](FluentApi-Mode)
    - [《CodeFirst Mode, Part 3: Custom Attributes》](Custom-Attributes)
    - [《CodeFirst Mode, Part 4: Type Mapping》](Type-Mapping)
    - [《CodeFirst Mode, Part 5: Migration Structure》](Migration-Structure)
- [《Introduction to DbFirst Mode》](DbFirst-Mode)

#### Advanced

- [《Database Transaction》](Database-Transaction)
- [《Using Read/Write Separation》](Using-Read-Write-Separation)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Tenant》](Tenant)
- [《Return Data》](Return-Data)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
- [《AOP》](Aspect-Oriented-Programming)