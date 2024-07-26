# 入门

FreeSql 是一款功能强大的对象关系映射（O/RM）组件，支持 .NET Core 2.1+、.NET Framework 4.0+

QQ 群：561616019(在线)、4336577(已满)、8578575(已满)、52508226(已满)

反馈问题请前往 https://github.com/dotnetcore/FreeSql/issues

## 安装包

需要访问什么数据库，就安装对应的 `FreeSql.Provider.XX`，也可直接安装 `FreeSql.All`

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

| Package Name                                                                                                | 说明                                                                                                  |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| FreeSql.Provider.MySql                                                                                      | 基于 MySql.Data（Oracle 官方） |
| [FreeSql.Provider.MySqlConnector](freesql-provider-mysqlconnector.md)                                       | 基于 MySqlConnector（开源社区，推荐++）<br>*MySQL, MariaDB, Percona, Amazon Aurora, Azure Database for MySQL, Google Cloud SQL for MySQL, OceanBase, Doris, Tidb 等等* |
| [FreeSql.Provider.PostgreSQL](freesql-provider-postgresql.md)                                               | 基于 PostgreSQL 9.5+ |
| FreeSql.Provider.SqlServer                                                                                  | 基于 SqlServer 2005+ |
| FreeSql.Provider.SqlServerForSystem                                                                         | 基于 System.Data.SqlClient + SqlServer 2005+ |
| FreeSql.Provider.Sqlite                                                                                     | 基于 System.Data.SQLite.Core |
| [FreeSql.Provider.SqliteCore](freesql-provider-sqlitecore.md)                                               | 基于 Microsoft.Data.Sqlite.Core，需安装 bundle_xxx |
| FreeSql.Provider.ClickHouse                                                                                 | 基于 ClickHouse.Client |
| [FreeSql.Provider.QuestDb](freesql-provider-questdb.md)                                                     | 基于 Npgsql 和 RestApi |
| FreeSql.Provider.Oracle                                                                                     | |
| [FreeSql.Provider.OracleOledb](freesql-provider-oracle.md)                                                  | 基于 Oledb 解决 US7ASCII 中文乱码问题 |
| FreeSql.Provider.Firebird                                                                                   | |
| FreeSql.Provider.MsAccess                                                                                   | |
| FreeSql.Provider.Dameng                                                                                     | 基于 达梦数据库 |
| FreeSql.Provider.ShenTong                                                                                   | 基于 神舟通用数据库 |
| FreeSql.Provider.KingbaseES                                                                                 | 基于 人大金仓数据库 |
| FreeSql.Provider.GBase                                                                                      | 基于 南大通用GBase数据库 |
| FreeSql.Provider.Xugu                                                                                       | 基于 虚谷数据库 |
| [FreeSql.Provider.Odbc](freesql-provider-odbc.md)                                                           | 基于 ODBC |
| [FreeSql.Provider.Custom](freesql-provider-custom.md)                                                       | 自定义适配<br>*SqlServer2000, PolarDB, KunDB, 其它国产数据库 等等* |

## 创建实体

`FreeSql` 使用模型执行数据访问，模型由实体类表示数据库表或视图，用于查询和保存数据。

可从现有数据库生成实体模型，`FreeSql` 提供 `IDbFirst` 接口实现[生成实体模型](db-first.md)。

或者手动创建模型，基于模型创建或修改数据库结构，提供[CodeFirst](code-first.md) 同步结构的 `API`（甚至可以做到开发阶段自动同步）。

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

## 如何接入

> 注意：IFreeSql 在项目中应以单例声明，而不是在每次使用的时候创建。

::: code-tabs

@tab:active ASP.NET Core 6+ （依赖注入）

```csharp
var builder = WebApplication.CreateBuilder(args);
Func<IServiceProvider, IFreeSql> fsqlFactory = r =>
{
    IFreeSql fsql = new FreeSql.FreeSqlBuilder()
        .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
        .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
        .UseAutoSyncStructure(true) //自动同步实体结构到数据库，只有CRUD时才会生成表
        .Build();
    return fsql;
};
builder.Services.AddSingleton<IFreeSql>(fsqlFactory);
WebApplication app = builder.Build();
```

@tab .NET Framework（万能前辈）

```csharp
//注意：class DB<T> 泛型类不适合定义 static 单例
public class DB
{
   static Lazy<IFreeSql> sqliteLazy = new Lazy<IFreeSql>(() => 
   {
        var fsql = new FreeSql.FreeSqlBuilder()
            .UseMonitorCommand(cmd => Trace.WriteLine($"Sql：{cmd.CommandText}"))
            .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
            .UseAutoSyncStructure(true) //自动同步实体结构到数据库，只有CRUD时才会生成表
            .Build();
        return fsql;
    });
    public static IFreeSql Sqlite => sqliteLazy.Value;
}
```

:::

`IFreeSql` 是 `ORM` 最顶级对象，所有操作都是使用它的方法或者属性：

- `UseAutoSyncStructure` 开发环境，自动同步实体结构到数据库
- `UseNameConvert` 数据库表、字段使用下划线命名，代码使用C#大驼峰

```csharp
fsql.Select<Blog>() //查询
fsql.Insert<Blog>() //插入
fsql.Update<Blog>() //更新
fsql.Delete<Blog>() //删除
fsql.InsertOrUpdate<Blog>() //插入或更新
fsql.Transaction(..) //事务

fsql.CodeFirst //CodeFirst 对象
fsql.DbFirst //DbFirst 对象
fsql.Ado //Ado 对象
fsql.Aop //Aop 对象
fsql.GlobalFilter //全局过滤器对象
```

> 注意：谨慎、谨慎、谨慎在生产环境中使用 UseAutoSyncStructure

> 注意：谨慎、谨慎、谨慎在生产环境中使用 UseAutoSyncStructure

> 注意：谨慎、谨慎、谨慎在生产环境中使用 UseAutoSyncStructure

## FreeSqlBuilder

| 方法                                  | 返回值        | 说明                                                                                           |
| ------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| UseConnectionString                   | this          | 设置连接串                                                                                     |
| UseAdoConnectionPool                  | this          | 设置连接池方案（默认 false，远程访问建议设置 true）                                               |
| UseSlave                              | this          | 设置从数据库，支持多个                                                                         |
| UseSlaveWeight | this | 设置从数据库权重 |
| UseConnectionFactory                  | this          | 设置自定义数据库连接对象（放弃内置对象连接池技术）                                             |
| UseAutoSyncStructure                  | this          | 【开发环境必备】自动同步实体结构到数据库，程序运行中检查实体创建或修改表结构                   |
| UseNoneCommandParameter               | this          | 不使用命令参数化执行，针对 Insert/Update，也可临时使用 IInsert/IUpdate.NoneParameter()         |
| UseGenerateCommandParameterWithLambda | this          | 生成命令参数化执行，针对 lambda 表达式解析                                                     |
| UseLazyLoading                        | this          | 开启延时加载功能                                                                               |
| UseMonitorCommand                     | this          | 监视全局 SQL 执行前后 |
| UseMappingPriority                    | this          | 指定映射优先级（默认 Aop < FluentApi < Attribute）按顺序覆盖的逻辑，所以最后的那个优先级最高|
| UseNameConvert                        | this          | 自动转换名称 Entity -\> Db                                                                     |
| UseQuoteSqlName                       | this          | SQL名称是否使用 \[\] `` "" |
| UseExitAutoDisposePool                | this          | 监听 AppDomain.CurrentDomain.ProcessExit/Console.CancelKeyPress 事件自动释放连接池 (默认 true) |
| Build\<T\>                            | IFreeSql\<T\> | 创建一个 IFreeSql 对象，注意：单例设计，不要重复创建                                           |

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
| [DataType.Custom](https://github.com/dotnetcore/FreeSql/tree/master/Providers/FreeSql.Provider.Custom) | 自定义连接串，访问任何数据库 |
