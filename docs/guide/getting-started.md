# 入门

## 模型

`FreeSql` 使用模型执行数据访问，模型由实体类表示数据库表或视图，用于查询和保存数据。

可从现有数据库生成实体模型，`FreeSql` 提供 `IDbFirst` 接口实现[生成实体模型](db-first.md)。

或者手动创建模型，基于模型创建或修改数据库，提供 `ICodeFirst` 同步结构的 `API`（甚至可以做到开发阶段自动同步）。

```csharp
using FreeSql.DataAnnotations;
using System;

public class Blog {
    [Column(IsIdentity = true, IsPrimary = true)]
    public int BlogId { get; set; }
    public string Url { get; set; }
    public int Rating { get; set; }
}
```

## 安装包

FreeSql.Provider.xxx([可选的驱动](install.md))
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

## 声明

> 注意： IFreeSql 在项目中应以单例声明，而不是在每次使用的时候创建。

- .NET Core 单例模式

::: code-tabs

@tab .NET Core 5的Startup.cs

```csharp
public void ConfigureServices(IServiceCollection services)
{
    Func<IServiceProvider, IFreeSql> fsql = r =>
    {
        IFreeSql fsql = new FreeSql.FreeSqlBuilder()
            .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
            .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))//监听SQL语句
            .UseAutoSyncStructure(true) //自动同步实体结构到数据库，FreeSql不会扫描程序集，只有CRUD时才会生成表。
            .Build();
        return fsql;
    };
    services.AddSingleton<IFreeSql>(fsql);
}
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    //在项目启动时，从容器中获取IFreeSql实例，并执行一些操作：同步表，种子数据,FluentAPI等
    using(IServiceScope serviceScope = app.ApplicationServices.CreateScope())
    {
        var fsql = serviceScope.ServiceProvider.GetRequiredService<IFreeSql>();
        fsql.CodeFirst.SyncStructure(typeof(Topic));//Topic 为要同步的实体类
    }
}
```

@tab:active .NET 6的Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);
Func<IServiceProvider, IFreeSql> fsqlFactory = r =>
{
    IFreeSql fsql = new FreeSql.FreeSqlBuilder()
        .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
        .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))//监听SQL语句
        .UseAutoSyncStructure(true) //自动同步实体结构到数据库，FreeSql不会扫描程序集，只有CRUD时才会生成表。
        .Build();
    return fsql;
};
builder.Services.AddSingleton<IFreeSql>(fsqlFactory);

WebApplication app = builder.Build();
//在项目启动时，从容器中获取IFreeSql实例，并执行一些操作：同步表，种子数据,FluentAPI等
using(IServiceScope serviceScope = app.Services.CreateScope())
{
    var fsql = serviceScope.ServiceProvider.GetRequiredService<IFreeSql>();
    fsql.CodeFirst.SyncStructure(typeof(Topic));//Topic 为要同步的实体类
}
```

:::
  
- [.NET Core 注入多个 FreeSql 实例](../extra/idlebus-freesql.md)
- .NET Framework 单例

```csharp
public class DB
{
   static Lazy<IFreeSql> sqliteLazy = new Lazy<IFreeSql>(() => new FreeSql.FreeSqlBuilder()
         .UseMonitorCommand(cmd => Trace.WriteLine($"Sql：{cmd.CommandText}"))//监听SQL语句,Trace在输出选项卡中查看
         .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
         .UseAutoSyncStructure(true) //自动同步实体结构到数据库，FreeSql不会扫描程序集，只有CRUD时才会生成表。
         .Build());
    public static IFreeSql Sqlite => sqliteLazy.Value;
}
```

> 注意：`class DB<T>` 泛型类不适合定义 static 单例

然后直接通过 `IFreeSql  fsql = DB.Sqlite;`  即可得到 fsql 实例。

`IFreeSql` 是 `ORM` 最顶级对象，所有操作都是使用它的方法或者属性：

```csharp

fsql.Select<T>(); //查询
fsql.Insert<T>(); //插入
fsql.Update<T>(); //更新
fsql.Delete<T>(); //删除
fsql.InsertOrUpdate<T>()// 插入或更新
fsql.Transaction(..); //事务

fsql.CodeFirst; //CodeFirst 对象
fsql.DbFirst; //DbFirst 对象
fsql.Ado; //Ado 对象
fsql.Aop; //Aop 对象
fsql.GlobalFilter; //全局过滤器对象
```

## 迁移

程序运行中`FreeSql`会检查`AutoSyncStructure`参数，以此条件判断是否对比实体与数据库结构之间的变化，达到自动迁移的目的,更多请查看[CodeFirst](code-first.md)文档，

> 注意：谨慎、谨慎、谨慎在生产环境中使用该功能。

> 注意：谨慎、谨慎、谨慎在生产环境中使用该功能。

> 注意：谨慎、谨慎、谨慎在生产环境中使用该功能。

## 查询

```csharp
var blogs = fsql.Select<Blog>()
    .Where(b => b.Rating > 3)
    .OrderBy(b => b.Url)
    .Skip(100)
    .Limit(10) //第100行-110行的记录
    .ToList();
```

## 插入

```csharp
var blog = new Blog { Url = "http://sample.com" };
blog.BlogId = (int)fsql.Insert<Blog>()
    .AppendData(blog)
    .ExecuteIdentity();
```

## 更新

```csharp
fsql.Update<Blog>()
    .Set(b => b.Url, "http://sample2222.com")
    .Where(b => b.Url == "http://sample.com")
    .ExecuteAffrows();
```

## 删除

```csharp
fsql.Delete<Blog>()
    .Where(b => b.Url == "http://sample.com")
    .ExecuteAffrows();
```

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
| DataType.MySql                     | Data Source=127.0.0.1;Port=3306;User ID=root;Password=root; Initial Catalog=cccddd;Charset=utf8; SslMode=none;Min pool size=1                                                                   |
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
