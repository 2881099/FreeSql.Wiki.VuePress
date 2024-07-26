# Sharding

## Theoretical Knowledge

Sharding - From a surface-level perspective, sharding involves splitting a single table into N smaller tables, each of which is a complete table on its own. After sharding, data is stored in these individual shard tables, with the main table acting as a shell. Data access happens within each shard table. Sharding improves the concurrent access capability of individual tables and also enhances disk I/O performance. The reason for increased concurrency is that the time required for a single query is reduced. In the case of high concurrency, the main table can distribute the load across different shard tables based on the query.

Database Sharding - This involves splitting the data originally stored in a single database across multiple databases, and splitting data originally stored in a single table across multiple tables. The amount of data in a database can become uncontrollable. Without sharding, as time and business grow, the number of tables in the database increases, and the amount of data in each table grows, leading to increased overhead for data operations (CRUD). Additionally, server resources (CPU, disk, memory, I/O, etc.) are limited, and eventually, the data volume and processing capacity of the database will hit a bottleneck.

## Manual Sharding

FreeSql’s native usage and FreeSql.Repository repository methods provide the AsTable method for performing CRUD operations on sharded tables, for example:

```csharp
var repo = fsql.GetRepository<Log>();
repo.AsTable(oldname => $"{oldname}_201903"); // Perform CRUD on Log_201903 table
//repo.AsTable((type, oldname) => $"{oldname}_201903"); // Perform CRUD on Log_201903 table (cascading related tables also append this suffix)

repo.Insert(new Log { ... });
```

For cross-database operations on the same database server, you can also use AsTable(oldname => $"db2.dbo.{oldname}")

```csharp
// Cross-table query
var sql = fsql.Select<User>()
    .AsTable((type, oldname) => "table_1")
    .AsTable((type, oldname) => "table_2")
    .ToSql(a => a.Id);

//select * from (SELECT a."Id" as1 FROM "table_1" a) ftb
//UNION ALL
//select * from (SELECT a."Id" as1 FROM "table_2" a) ftb
```

Summary of Sharding:

- For sharding and cross-database operations on the same server, AsTable can be used for CRUD operations;
- AsTable with CodeFirst will automatically create non-existent shard tables;
- Delayed loading cannot be used with sharded or sharded database entity types;

For SQL Server cross-database transactions, you can use TransactionScope as follows:

```csharp
var repoLog = fsql.GetRepository<Log>();
var repoComment = fsql.GetRepository<Comment>();
repoLog.AsTable(oldname => $"{201903}.dbo.{oldname}");
repoComment.AsTable(oldname => $"{201903}.dbo.{oldname}");

using (TransactionScope ts = new TransactionScope())
{
    repoComment.Insert(new Comment { ... });
    repoLog.Insert(new Log { ... });
    ts.Complete();
}
```

For distributed database TCC/SAGA solutions, please visit: [https://github.com/2881099/FreeSql.Cloud](https://github.com/2881099/FreeSql.Cloud)

## Automatic Sharding (beta)

Automatic sharding differs from CURD.AsTable method. Currently, the first phase supports automatic sharding by [time] (sharding across databases is not supported).

We encourage active participation in testing and feedback. Please prioritize using source code for testing to facilitate problem identification. Thank you.

```csharp
[Table(Name = "as_table_log_{yyyyMM}", AsTable = "createtime=2022-1-1(1 month)")]
class AsTableLog
{
    public Guid id { get; set; }
    public string msg { get; set; }
    public DateTime createtime { get; set; }
}
```

> From 2022-1-1 to the current time, create a new shard table every month, based on the createtime field

> If the maximum date is greater than the current time, you can manually expand the shard table:

```csharp
var tableName = fsql.CodeFirst.GetTableByEntity(typeof(AsTableLog))
    .AsTableImpl
    .GetTableNameByColumnValue(DateTime.Parse("2023-7-1"), autoExpand: true);

// Create database table
if (fsql.DbFirst.ExistsTable(tableName) == false)
    fsql.CodeFirst.SyncStructure(typeof(AsTableLog), tableName);
```

| Example | Description |
| -- | -- |
| AsTable = "createtime=2022-1-1(1 year)" | Create a shard table every year |
| AsTable = "createtime=2022-1-1(2 year)" | Create a shard table every two years |
| AsTable = "createtime=2022-1-1(1 month)" | Create a shard table every month |
| AsTable = "createtime=2022-1-1(3 month)" | Create a shard table every three months |
| AsTable = "createtime=2022-1-1(1 day)" | Create a shard table every day |
| AsTable = "createtime=2022-1-1(7 day)" | Create a shard table every seven days |
| AsTable = "createtime=2022-1-1(12 hour)" | Create a shard table every 12 hours |

The first table is for 12 months, and the subsequent tables are for each month:

> AsTable = "createtime=2022-1-1(12,1 month)"

The first table has a non-time-based name:

> fsql.CodeFirst.GetTableByEntity(typeof(AsTableLog)).AsTableImpl.SetTableName(0, "CustomTableName")

Sharding every month on the 1st at 10 AM:

> \[Table(Name = "as_table_log_{yyyyMMddHH}", AsTable = "createtime=2022-1-1 10(1 month)")\]

When no time condition is set, only the latest 3 shard tables are used:

> fsql.CodeFirst.GetTableByEntity(typeof(AsTableLog)).AsTableImpl.SetDefaultAllTables(value => value.Take(3).ToArray());

For detailed information: [https://github.com/dotnetcore/FreeSql/discussions/1066](https://github.com/dotnetcore/FreeSql/discussions/1066)

Indexes for sharded tables can be set as follows: \[Index("{tablename}_idx_01", "phone")\]

## [DB Sharding] Common

1. Sqlite Cross-database

```csharp
.UseConnectionString(DataType.Sqlite, @"data source=document.db;attachs=db2.db,db3.db")

[Table(Name = "db2.Comment")]
class Comment { ... }

[Table(Name = "db3.Comment")]
class Topic { .. }
```

SQLite cross-database operations are a unique feature of FreeSql. Use the `attachs` parameter in the connection string, separated by commas.

2. SqlServer Cross-database

```csharp
// Cross-database access within the same database instance
[Table(Name = "db2.dbo.tablename")]
class Comment { ... }
```

For different database instances, SQL Server linkserver technology can be used. Please refer to relevant documentation.

3. Others

Almost all databases support the dbo.table access method:

- MySql -> dbname.tabname
- PostgreSQL/SqlServer -> dbname.schema.tbname

You can set this in the `[Table(Name = ...)]` attribute or use the `.AsTable` method for the current context.

## [DB Sharding] FreeSql.Cloud

FreeSql.Cloud provides cross-database access and distributed transaction solutions (TCC, SAGA), supporting .NET Core 2.1+, .NET Framework 4.0+.

Open source address: [https://github.com/2881099/FreeSql.Cloud](https://github.com/2881099/FreeSql.Cloud)

> dotnet add package FreeSql.Cloud

or

> Install-Package FreeSql.Cloud

```csharp
public enum DbEnum { db1, db2 }
public class FreeSqlCloud : FreeSqlCloud<DbEnum> // Change DbEnum to string for multi-tenant management
{
    public FreeSqlCloud() : base(null) { }
    public FreeSqlCloud(string distributeKey) : base(distributeKey) { }
}

var fsql = new FreeSqlCloud();
fsql.DistributeTrace = log => Console.WriteLine(log.Split('\n')[0].Trim());

fsql.Register(DbEnum.db1, () => new FreeSqlBuilder().UseConnectionString(DataType.Sqlite, @"Data Source=db1.db").Build());
fsql.Register(DbEnum.db2, () => new FreeSqlBuilder().UseConnectionString(DataType.Sqlite, @"Data Source=db2.db").Build());

services.AddSingleton<IFreeSql>(fsql);
services.AddSingleton(fsql);
```

> FreeSqlCloud must be defined as a singleton

> `new FreeSqlCloud()` manages multiple connections

> `new FreeSqlCloud("myapp")` activates TCC/SAGA transactions

The access methods for FreeSqlCloud are the same as for IFreeSql:

```csharp
fsql.Select<T>();
fsql.Insert<T>();
fsql.Update<T>();
fsql.Delete<T>();

//...
```

1. Switching Databases (Thread-safe):

```csharp
fsql.Change(DbEnum.db2).Select<T>();
// In the same thread, or after async await, subsequent fsql.Select/Insert/Update/Delete operations will be on db2

fsql.Use(DbEnum.db2).Select<T>();
// Effective for a single operation

using (fsql.Change(DbEnum.db2)) {
    //todo..
}
//FreeSql.Cloud v1.6.8 allows switching within a scope, and then switching back
```

2. Automatic Database Routing Configuration:

```csharp
fsql.EntitySteering = (_, e) =>
{
    if (e.EntityType == typeof(User)) e.DBKey = DbEnum.db2;
    // Automatically route queries for User to db2
};
```

3. Static Repository Objects

FreeSql.Repository/UnitOfWorkManager objects are created with a fixed IFreeSql instance, so they cannot follow FreeSqlCloud for database switching.

> Note: Once the same object instance is created, it cannot follow database switching. Creating a new object instance is not affected.

In multi-tenant sharding scenarios, switch the database using `fsql.Change` before creating Repository/UnitOfWorkManager.

[《How to Use UnitOfWorkManager with FreeSql.Cloud for AOP Transactions?》](unitofwork-manager#extension-multi-database)

4. Dynamic Object Creation (Not Recommended)

However, there is a special requirement where the Repository should be able to follow `fsql.Change` for database switching after creation.

```csharp
var repo = fsql.GetCloudRepository<User>();
fsql.Change(DbEnum.db2);
Console.WriteLine(repo.Orm.Ado.ConnectionString); //repo -> db2
fsql.Change(DbEnum.db1);
Console.WriteLine(repo.Orm.Ado.ConnectionString); //repo -> db1
```

This mechanism is too uncontrollable, so only simple extension methods are provided. It is not recommended for IoC injection.