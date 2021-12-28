# Getting Started

FreeSql is a powerful **.NET ORM** that supports all *.NET Standard* runtime platforms like *.NET Framework 4.0+*, *.NET Core 2.1+* and *Xamarin*, etc.

FreeSql supports MySql, SqlServer, PostgreSQL, Oracle, Sqlite, Firebird, Dameng, Shentong Database, Kingbase ES, Hangao Database, ClickHouse, GBase and MsAccess.

QQ Groups：4336577(full)、8578575(full)、**52508226(available)**

## Models

FreeSql uses a model to perform data access. The model is represented by an entity class to represent a database table or view for querying and saving data.

The entity model can be generated from an existing database, and FreeSql provides the `IDbFirst` interface to [generate the entity model](DbFirst-Mode).

Or you can create the model manually, and then create or modify the database based on the model. FreeSql provides an API for the `ICodeFirst` synchronization structure (it can even be synchronized automatically during the development phase). 

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

## Packages

FreeSql.Provider.XXX ([Optional Providers](Install))
```bash
dotnet add packages FreeSql
dotnet add packages FreeSql.Provider.Sqlite
```
or
```
Install-Package FreeSql
Install-Package FreeSql.Provider.Sqlite
```

## Declaring

```csharp
IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=db1.db")
     //Automatically synchronize the entity structure to the database.
     //FreeSql will not scan the assembly, and will generate a table if and only when the CRUD instruction is executed.
    .UseAutoSyncStructure(true) 
     //Be sure to define as singleton mode
    .Build(); 
    
//Note: IFreeSql should be declared as a singleton in the project, not created every time it is used.
```

- .NET Core Singleton
Startup.cs
```csharp
public void ConfigureServices(IServiceCollection services)
{
    IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=db1.db")
    //Automatically synchronize the entity structure to the database.
    //FreeSql will not scan the assembly, and will generate a table if and only when the CRUD instruction is executed.
    .UseAutoSyncStructure(true)
    .Build();
    services.AddSingleton<IFreeSql>(fsql);
}
```
- [.NET Core injects multiple FreeSql instances](https://github.com/dotnetcore/FreeSql/issues/44)
- .NET Framework Singleton
```csharp
public class DB
{
   static Lazy<IFreeSql>sqliteLazy = new Lazy<IFreeSql>(() => new FreeSql.FreeSqlBuilder()
        .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=db1.db")
        //Automatically synchronize the entity structure to the database.
        //FreeSql will not scan the assembly, and will generate a table if and only when the CRUD instruction is executed.
        .UseAutoSyncStructure(true)
        .Build());

    public static IFreeSql Sqlite => sqliteLazy.Value;
}
```

Then when using it, use `fsql` directly through ```IFreeSql fsql = DB.Sqlite;```.

IFreeSql is the top-level object of ORM, and all operations use its methods or properties:

```c#

fsql.Select<T>(); //Query
fsql.Insert<T>(); //Insert
fsql.Update<T>(); //Update
fsql.Delete<T>(); //Delete
fsql.InsertOrUpdate<T>()// Insert or Update
fsql.Transaction(..); //Transaction

fsql.CodeFirst; //CodeFirst Object
fsql.DbFirst; //DbFirst Object
fsql.Ado; //Ado Object
fsql.Aop; //Aop Object
fsql.GlobalFilter; //Gloabl Filter Object
```

## Migration

When the program is running, `FreeSql` will check the `AutoSyncStructure` parameter, and use this condition to determine whether to compare the changes between the entity and the database structure to achieve the purpose of automatic migration. For more information, please refer to the [CodeFirst Documentation](CodeFirst-Mode).

> Note: Use this feature in a production environment with **caution**.

> Note: Use this feature in a production environment with **caution**.

> Note: Use this feature in a production environment with **caution**.

## Query Data

```csharp
var blogs = fsql.Select<Blog>()
    .Where(b => b.Rating > 3)
    .OrderBy(b => b.Url)
    .Skip(100)
    .Limit(10) //Query the record from line 100 to line 110
    .ToList();
```

## Insert Data

```csharp
var blog = new Blog { Url = "http://sample.com" };
blog.BlogId = (int)fsql.Insert<Blog>()
    .AppendData(blog)
    .ExecuteIdentity();
```

## Update Data

```csharp
fsql.Update<Blog>()
    .Set(b => b.Url, "http://sample2222.com")
    .Where(b => b.Url == "http://sample.com")
    .ExecuteAffrows();
```

## Delete Data

```csharp
fsql.Delete<Blog>()
    .Where(b => b.Url == "http://sample.com")
    .ExecuteAffrows();
```

# FreeSqlBuilder

| Methods                               | Return        | Description                                                                                                                                                                                  |
| ------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UseConnectionString                   | this          | Connection string                                                                                                                                                                            |
| UseSlave                              | this          | Set up the slave database, support multipleslace databases.                                                                                                                                  |
| UseConnectionFactory                  | this          | Set up a custom database connection object (abandon the built-in object connection pool technology)                                                                                          |
| UseAutoSyncStructure                  | this          | **[Recommended development environment]** Automatically synchronize the entity structure to the database, and check entity creation or modification table structure during program operation |
| UseNoneCommandParameter               | this          | Do not use command parameterized execution. for `Insert/Update`, you can also temporarily use `IInsert/IUpdate.NoneParameter()`                                                              |
| UseGenerateCommandParameterWithLambda | this          | For lambda expression analysis, generate command parameterized execution                                                                                                                     |
| UseLazyLoading                        | this          | Turn on the lazy loading function,                                                                                                                                                           |
| UseMonitorCommand                     | this          | Monitor before and after global SQL execution.                                                                                                                                               |
| UseNameConvert                        | this          | Automatic name conversion Entity -\> Db                                                                                                                                                      |
| UseExitAutoDisposePool                | this          | Listen to the AppDomain.CurrentDomain.ProcessExit/Console.CancelKeyPress event to automatically release the connection pool (default true)                                                   |
| Build\<T\>                            | IFreeSql\<T\> | Create an IFreeSql object. Note: Singleton design, don’t repeat creation                                                                                                                     |

# ConnectionStrings

| DataType                                                                                            | ConnectionString                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DataType.MySql                                                                                      | Data Source=127.0.0.1;Port=3306;User ID=root;Password=root; Initial Catalog=cccddd;Charset=utf8; SslMode=none;Min pool size=1                                                                   |
| DataType.PostgreSQL                                                                                 | Host=192.168.164.10;Port=5432;Username=postgres;Password=123456; Database=tedb;Pooling=true;Minimum Pool Size=1                                                                                 |
| DataType.SqlServer                                                                                  | Data Source=.;User Id=sa;Password=123456;Initial Catalog=freesqlTest;TrustServerCertificate=true;Pooling=true;Min Pool Size=1                                                                   |
| DataType.Oracle                                                                                     | user id=user1;password=123456; data source=//127.0.0.1:1521/XE;Pooling=true;Min Pool Size=1                                                                                                     |
| DataType.Sqlite                                                                                     | Data Source=\|DataDirectory\|\document.db; Attachs=xxxtb.db; Pooling=true;Min Pool Size=1                                                                                                       |
| DataType.Firebird                                                                                   | database=localhost:D:\fbdata\EXAMPLES.fdb;user=sysdba;password=123456                                                                                                                           |
| DataType.MsAccess                                                                                   | Provider=Microsoft.Jet.OleDb.4.0;Data Source=d:/accdb/2003.mdb                                                                                                                                  |
| DataType.Dameng(达梦)                                                                               | server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=5                                                                                                           |
| DataType.ShenTong(神通)                                                                             | HOST=192.168.164.10;PORT=2003;DATABASE=OSRDB;USERNAME=SYSDBA;PASSWORD=szoscar55;MAXPOOLSIZE=2                                                                                                   |
| DataType.KingbaseES(人大金仓)                                                                       | Server=127.0.0.1;Port=54321;UID=USER2;PWD=123456789;database=TEST;MAXPOOLSIZE=2                                                                                                                 |
| DataType.OdbcMySql                                                                                  | Driver={MySQL ODBC 8.0 Unicode Driver}; Server=127.0.0.1;Persist Security Info=False; Trusted_Connection=Yes;UID=root;PWD=root; DATABASE=cccddd_odbc;Charset=utf8; SslMode=none;Min Pool Size=1 |
| DataType.OdbcSqlServer                                                                              | Driver={SQL Server};Server=.;Persist Security Info=False; Trusted_Connection=Yes;Integrated Security=True; DATABASE=freesqlTest_odbc; Pooling=true;Min Pool Size=1                              |
| DataType.OdbcOracle                                                                                 | Driver={Oracle in XE};Server=//127.0.0.1:1521/XE; Persist Security Info=False; Trusted_Connection=Yes;UID=odbc1;PWD=123456; Min Pool Size=1                                                     |
| DataType.OdbcPostgreSQL                                                                             | Driver={PostgreSQL Unicode(x64)};Server=192.168.164.10; Port=5432;UID=postgres;PWD=123456; Database=tedb_odbc;Pooling=true;Min Pool Size=1                                                      |
| DataType.OdbcDameng (达梦)                                                                          | Driver={DM8 ODBC DRIVER};Server=127.0.0.1:5236; Persist Security Info=False; Trusted_Connection=Yes; UID=USER1;PWD=123456789                                                                    |
| DataType.OdbcKingbaseES (人大金仓)                                                                  | Driver={KingbaseES 8.2 ODBC Driver ANSI};Server=127.0.0.1;Port=54321;UID=USER2;PWD=123456789;database=TEST                                                                                      |
| DataType.Odbc                                                                                       | Driver={SQL Server};Server=.;Persist Security Info=False; Trusted_Connection=Yes;Integrated Security=True; DATABASE=freesqlTest_odbc; Pooling=true;Min pool size=1                              |
| [DataType.Custom](https://github.com/2881099/FreeSql/tree/master/Providers/FreeSql.Provider.Custom) | Custom connection string, access any database                                                                                                                                                   |

## Reference

- [《Install FreeSql》](Install)
- [《FreeSql 101, Part 1: Insert Data》](Insert-Data)
- [《FreeSql 101, Part 2: Delete Data》](Delete-Data)
- [《FreeSql 101, Part 3: Update Data》](Update-Data)
- [《FreeSql 101, Part 4: Query Data》](Query-Data)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《UnitOfWork》](Unit-of-Work)