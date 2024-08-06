# Get started

FreeSql is a powerful Object-Relational Mapping (O/RM) component, supporting .NET Core 2.1+ and .NET Framework 4.0+.

QQ Groups: 561616019 (Online), 4336577 (Full), 8578575 (Full), 52508226 (Full)

For issue reporting, please visit https://github.com/dotnetcore/FreeSql/issues

## Installation Packages

To access a specific database, install the corresponding `FreeSql.Provider.XX`. Alternatively, you can install `FreeSql.All` to include all providers.

::: code-tabs

@tab:active .NET CLI

```bash
dotnet add package FreeSql
dotnet add package FreeSql.Provider.Sqlite
```

@tab Package Manager

```bash
Install-Package FreeSql
Install-Package FreeSql.Provider.Sqlite
```

:::

| Provider                                                                                                      | Description                                                                                             |
|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| FreeSql.Provider.MySql                                                                                       | Based on MySql.Data (official from Oracle)                                                              |
| FreeSql.Provider.MySqlConnector                                        | Based on MySqlConnector (open-source community, recommended++)<br>*Supports MySQL, MariaDB, Percona, Amazon Aurora, Azure Database for MySQL, Google Cloud SQL for MySQL, OceanBase, Doris, Tidb, etc.* |
| FreeSql.Provider.PostgreSQL                                                | Based on PostgreSQL 9.5+                                                                              |
| FreeSql.Provider.SqlServer                                                                                   | Based on SqlServer 2005+                                                                             |
| FreeSql.Provider.SqlServerForSystem                                                                         | Based on System.Data.SqlClient + SqlServer 2005+                                                       |
| FreeSql.Provider.Sqlite                                                                                      | Based on System.Data.SQLite.Core                                                                       |
| FreeSql.Provider.SqliteCore                                                | Based on Microsoft.Data.Sqlite.Core, requires installing bundle_xxx                                     |
| FreeSql.Provider.ClickHouse                                                                                | Based on ClickHouse.Client                                                                           |
| FreeSql.Provider.QuestDb                                                      | Based on Npgsql and RestApi                                                                          |
| FreeSql.Provider.Oracle                                                                                    |                                                                                                         |
| FreeSql.Provider.OracleOledb                                                   | Based on Oledb, addresses US7ASCII Chinese garbled text issue                                          |
| FreeSql.Provider.Firebird                                                                                      |                                                                                                         |
| FreeSql.Provider.MsAccess                                                                                   |                                                                                                         |
| FreeSql.Provider.Dameng                                                                                      | Based on Dameng Database                                                                              |
| FreeSql.Provider.ShenTong                                                                                     | Based on ShenZhou General Database                                                                     |
| FreeSql.Provider.KingbaseES                                                                                  | Based on RenDa JinCang Database                                                                        |
| FreeSql.Provider.GBase                                                                                       | Based on NanDa General GBase Database                                                                  |
| FreeSql.Provider.Xugu                                                                                        | Based on Xugu Database                                                                               |
| FreeSql.Provider.Odbc                                                            | Based on ODBC                                                                                        |
| FreeSql.Provider.Custom                                                        | Custom adaptation<br>*Supports SqlServer2000, PolarDB, KunDB, other databases, etc.*         |

## Create Entity

`FreeSql` uses models to perform data access, where models are represented by entity classes that correspond to database tables or views, and are used for querying and saving data.

You can generate entity models from an existing database using the `IDbFirst` interface provided by `FreeSql`, which implements [Entity Model Generation](db-first.md).

Alternatively, you can manually create models. By creating or modifying the database structure based on these models, `FreeSql` provides [CodeFirst](code-first.md) synchronization APIs (and even supports automatic synchronization during the development phase).

```csharp
using FreeSql.DataAnnotations;
using System;

public class Blog
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public int BlogId { get; set; }
    public string Url { get; set; }
    public int Rating { get; set; }
}
```

## How to Use

> Note: IFreeSql should be declared as a singleton in the project.

::: code-tabs

@tab:active ASP.NET Core 6+ (Dependency Injection)

```csharp
var builder = WebApplication.CreateBuilder(args);
Func<IServiceProvider, IFreeSql> fsqlFactory = r =>
{
    IFreeSql fsql = new FreeSql.FreeSqlBuilder()
        .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
        .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
        .UseAutoSyncStructure(true) //Entity structures are automatically synchronized to the database
        .Build();
    return fsql;
};
builder.Services.AddSingleton<IFreeSql>(fsqlFactory);
WebApplication app = builder.Build();
```

@tab .NET Framework (General)

```csharp
// Note: The generic class DB<T> cannot be used.
public class DB
{
   static Lazy<IFreeSql> sqliteLazy = new Lazy<IFreeSql>(() => 
   {
        var fsql = new FreeSql.FreeSqlBuilder()
            .UseMonitorCommand(cmd => Trace.WriteLine($"Sql：{cmd.CommandText}"))
            .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
            .UseAutoSyncStructure(true) //Entity structures are automatically synchronized to the database
            .Build();
        return fsql;
    });
    public static IFreeSql Sqlite => sqliteLazy.Value;
}
```

:::

`IFreeSql` is the top-level object in the ORM, and all operations are performed using its methods or properties:

- `UseAutoSyncStructure` automatically synchronizes entity structures to the database in the development environment.
- `UseNameConvert` uses underscore naming for database tables and columns while using C# PascalCase for code.

```csharp
fsql.Select<Blog>() // Query
fsql.Insert<Blog>() // Insert
fsql.Update<Blog>() // Update
fsql.Delete<Blog>() // Delete
fsql.InsertOrUpdate<Blog>() // Insert or Update
fsql.Transaction(..) // Transaction

fsql.CodeFirst // CodeFirst object
fsql.DbFirst // DbFirst object
fsql.Ado // Ado object
fsql.Aop // Aop object
fsql.GlobalFilter // Global filter object
```

**Note: Use `UseAutoSyncStructure` with caution in production environments.**

**Note: Use `UseAutoSyncStructure` with caution in production environments.**

**Note: Use `UseAutoSyncStructure` with caution in production environments.**

## FreeSqlBuilder

| Method                                 | Return Value  | Description                                                                                      |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| UseConnectionString                  | this        | Sets the connection string                                                                      |
| UseAdoConnectionPool                 | this        | Configures the connection pool scheme (default is false; recommended to set true for remote access) |
| UseSlave                             | this        | Configures a slave database; supports multiple slaves                                           |
| UseSlaveWeight                       | this        | Configures the weight of the slave database                                                       |
| UseConnectionFactory                 | this        | Sets a custom database connection object (bypasses the built-in connection pool technology)       |
| UseAutoSyncStructure                 | this        | [Essential for development] Automatically synchronizes entity structures to the database; checks for entity creation or modifications during program runtime |
| UseNoneCommandParameter              | this        | Disables command parameterization for execution, applicable for `Insert/Update`; can also use `IInsert/IUpdate.NoneParameter()` temporarily |
| UseGenerateCommandParameterWithLambda| this        | Generates command parameterization, applicable for lambda expression parsing                    |
| UseLazyLoading                       | this        | Enables lazy loading functionality                                                               |
| UseMonitorCommand                    | this        | Monitors global SQL execution before and after                                                    |
| UseMappingPriority                   | this        | Specifies the mapping priority (default is `Aop < FluentApi < Attribute`); the last one has the highest priority) |
| UseNameConvert                       | this        | Automatically converts names from Entity to Db                                                    |
| UseQuoteSqlName                      | this        | Determines if SQL names use brackets `[]`, backticks `` ` ``, or double quotes `""`              |
| UseExitAutoDisposePool               | this        | Listens to `AppDomain.CurrentDomain.ProcessExit` and `Console.CancelKeyPress` events to automatically release the connection pool (default is true) |
| `Build<T>`                             | `IFreeSql<T>` | Creates an `IFreeSql` object; note: designed as a singleton, avoid creating multiple instances   |

## ConnectionStrings

| DataType                           | ConnectionString                                                                                                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DataType.MySql                     | Data Source=127.0.0.1;Port=3306;User ID=root;Password=root; Initial Catalog=cccddd;Charset=utf8mb4; SslMode=none;Min pool size=1                                                                   |
| DataType.PostgreSQL                | Host=192.168.164.10;Port=5432;Username=postgres;Password=123456; Database=tedb;ArrayNullabilityMode=Always;Pooling=true;Minimum Pool Size=1                                                                                 |
| DataType.SqlServer                 | Data Source=.;User Id=sa;Password=123456;Initial Catalog=freesqlTest;Encrypt=True;TrustServerCertificate=True;Pooling=true;Min Pool Size=1                                                     |
| DataType.Oracle                    | user id=user1;password=123456; data source=//127.0.0.1:1521/XE;Pooling=true;Min Pool Size=1                                                                                                     |
| DataType.Sqlite                    | Data Source=\|DataDirectory\|\document.db; Attachs=xxxtb.db; Pooling=true;Min Pool Size=1                                                                                                       |
| DataType.ClickHouse               | DataCompress=False;BufferSize=32768;SocketTimeout=10000;CheckCompressedHash=False;Encrypt=False;Compressor=lz4;Host=192.168.0.121;Port=8125;Database=PersonnelLocation;Username=root;Password=123     |
| DataType.Firebird                  | database=localhost:D:\fbdata\EXAMPLES.fdb;user=sysdba;password=123456                                                                                                                           |
| DataType.QuestDb | host=localhost;port=8812;username=admin;password=quest;database=qdb;ServerCompatibilityMode=NoTypeLoading; |
| DataType.MsAccess                  | Provider=Microsoft.Jet.OleDb.4.0;Data Source=d:/accdb/2003.mdb                                                                                                                                 |
| DataType.MsAccess(accdb)                  | Provider=Microsoft.ACE.OLEDB.12.0;Data Source=d:/accdb/2003.accdb;                                                                                                                                 |
| DataType.MsAccess(加密)                  | Provider=Microsoft.ACE.OLEDB.12.0;Data Source=d:/accdb/2003.accdb;Jet OLEDB:Database Password=12341234                                                                                         |
| DataType.Dameng(达梦)              | server=127.0.0.1;port=5236;user=2user;password=123456789;database=2user;poolsize=5                                                                                                           |
| DataType.ShenTong(神通) | HOST=192.168.164.10;PORT=2003;DATABASE=OSRDB;USERNAME=SYSDBA;PASSWORD=szoscar55;MAXPOOLSIZE=2 |
| DataType.KingbaseES(人大金仓) V008R003 | Server=127.0.0.1;Port=54321;UID=USER2;PWD=123456789;database=TEST;MAXPOOLSIZE=2 |
| DataType.Gbase(南大通用) | Driver={GBase ODBC DRIVER (64-Bit)};Host=192.168.164.134;Service=9088;Server=gbase01;Database=testdb;Protocol=onsoctcp;Uid=gbasedbt;Pwd=GBase123;Db_locale=zh_CN.utf8;Client_locale=zh_CN.utf8 |
| DataType.Xugu(虚谷) | IP=127.0.0.1;DB=SYSTEM;User=SYSDBA;PWD=SYSDBA;Port=5138;AUTO_COMMIT=on;CHAR_SET=UTF8 |
| DataType.OdbcMySql                 | Driver={MySQL ODBC 8.0 Unicode Driver}; Server=127.0.0.1;Persist Security Info=False; Trusted_Connection=Yes;UID=root;PWD=root; DATABASE=cccddd_odbc;Charset=utf8; SslMode=none;Min Pool Size=1 |
| DataType.OdbcSqlServer             | Driver={SQL Server};Data Source=.;User Id=sa;Password=123456;Initial Catalog=freesqlTest;Encrypt=True;TrustServerCertificate=True;Pooling=true;Min Pool Size=1 |
| DataType.OdbcOracle | Driver={Oracle in XE};Server=//127.0.0.1:1521/XE; Persist Security Info=False; Trusted_Connection=Yes;UID=odbc1;PWD=123456; Min Pool Size=1 |
| DataType.OdbcPostgreSQL | Driver={PostgreSQL Unicode(x64)};Server=192.168.164.10; Port=5432;UID=postgres;PWD=123456; Database=tedb_odbc;Pooling=true;Min Pool Size=1 |
| DataType.OdbcDameng (达梦) | Driver={DM8 ODBC DRIVER};Server=127.0.0.1:5236; Persist Security Info=False; Trusted_Connection=Yes; UID=USER1;PWD=123456789 |
| DataType.OdbcKingbaseES (人大金仓) V008R003 | Driver={KingbaseES 8.2 ODBC Driver ANSI};Server=127.0.0.1;Port=54321;UID=USER2;PWD=123456789;database=TEST |
| DataType.Odbc | Driver={SQL Server};Server=.;Persist Security Info=False; Trusted_Connection=Yes;Integrated Security=True; DATABASE=freesqlTest_odbc; Pooling=true;Min pool size=1 |
| [DataType.Custom](https://github.com/dotnetcore/FreeSql/tree/master/Providers/FreeSql.Provider.Custom) | "Custom Connection String: Access Any Database" |
