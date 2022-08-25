# 分表分库

## 理论知识

分表 - 从表面意思上看呢，就是把一张表分成 N 多个小表，每一个小表都是完整的一张表。分表后数据都是存放在分表里，总表只是一个外壳，存取数据发生在一个一个的分表里面。分表后单表的并发能力提高了，磁盘 I/O 性能也提高了。并发能力为什么提高了呢，因为查寻一次所花的时间变短了，如果出现高并发的话，总表可以根据不同 的查询，将并发压力分到不同的小表里面。

分库 - 把原本存储于一个库的数据分块存储到多个库上，把原本存储于一个表的数据分块存储到多个表上。数据库中的数据量不一定是可控的，在未进行分表分库的情况下，随着时间和业务的发展，库中的表会越来越多，表中的数据量也会越来越大，相应地，数据操作，增删改查的开销也会越来越大；另外，一台服务器的资源（CPU、磁盘、内存、IO 等）是有限的，最终数据库所能承载的数据量、数据处理能力都将遭遇瓶颈。

## 手工分表 AsTable

FreeSql 原生用法、FreeSql.Repository 仓储用法 都提供了 AsTable 方法对分表进行 CRUD 操作，例如：

```csharp
var repo = fsql.GetRepository<Log>();
repo.AsTable(oldname => $"{oldname}_201903"); //对 Log_201903 表 CRUD

repo.Insert(new Log { ... });
```

跨库，但是在同一个数据库服务器下，也可以使用 AsTable(oldname => $"db2.dbo.{oldname}")

```csharp
//跨表查询
var sql = fsql.Select<User>()
    .AsTable((type, oldname) => "table_1")
    .AsTable((type, oldname) => "table_2")
    .ToSql(a => a.Id);

//select * from (SELECT a."Id" as1 FROM "table_1" a) ftb
//UNION ALL
//select * from (SELECT a."Id" as1 FROM "table_2" a) ftb
```

分表总结：

- 分表、相同服务器跨库 可以使用 AsTable 进行 CRUD；
- AsTable CodeFirst 会自动创建不存在的分表；
- 不可在分表分库的实体类型中使用《延时加载》；

SqlServer 跨库事务 可以使用 TransactionScope，如下：

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

分布式数据库 TCC/SAGA 方案请移步：https://github.com/2881099/FreeSql.Cloud

## 自动分表 AsTable (beta)

【自动分表】不同于 CURD.AsTable 方法，目前第一期完成按【时间】自动分表（不支持分库）。

欢迎积极参与测试、反馈，请优先使用源代码进行测试，方便反馈定位问题，谢谢。

```csharp
[Table(Name = "as_table_log_{yyyyMM}", AsTable = "createtime=2022-1-1(1 month)")]
class AsTableLog
{
    public Guid id { get; set; }
    public string msg { get; set; }
    public DateTime createtime { get; set; }
}
```

> 从 2022-1-1 开始至当前时间，每月创建一个分表，按 createtime 字段分表

> 若最大日期大于当前时间，可手工扩容分表：

```csharp
fsql.CodeFirst.GetTableByEntity(typeof(AsTableLog))
    .AsTableImpl
    .GetTableNameByColumnValue(DateTime.Parse("2023-7-1"), autoExpand: true);
```

| 示范 | 说明 |
| -- | -- | 
| AsTable = "createtime=2022-1-1(1 year)" | 一年一个分表 |
| AsTable = "createtime=2022-1-1(2 year)" | 两年一个分表 |
| AsTable = "createtime=2022-1-1(1 month)" | 一月一个分表 |
| AsTable = "createtime=2022-1-1(3 month)" | 三月一个分表 |
| AsTable = "createtime=2022-1-1(1 day)" | 一天一个分表 |
| AsTable = "createtime=2022-1-1(7 day)" | 七天一个分表 |
| AsTable = "createtime=2022-1-1(12 hour)" | 12小时一个分表 |

详细介绍：[https://github.com/dotnetcore/FreeSql/discussions/1066](https://github.com/dotnetcore/FreeSql/discussions/1066)

## 【分库】常规技巧

1、Sqlite 跨库

```csharp
.UseConnectionString(DataType.Sqlite, @"data source=document.db;attachs=db2.db,db3.db")

[Table(Name = "db2.Comment")]
class Comment { ... }

[Table(Name = "db3.Comment")]
class Topic { .. }
```

SQLite 跨库操作是 FreeSql 独有的功能，连接串 attachs 参数值逗号分割。

2、SqlServer 跨库

```csharp
//相同数据库实例，跨库访问
[Table(Name = "db2.dbo.tablename")]
class Comment { ... }
```

不同数据库实例，可使用 SQLServer linkserver 技术，具体请百度了解。

3、其他

几乎每种数据库都支持 dbo.table 的方式访问：

- MySql -> dbname.tabname
- PostgreSQL/SqlServer -> dbname.schema.tbname

可将其设置到 `[Table(Name = ...)]` 特性，或者使用 `.AsTable` 方法设置本次生效。

## 【分库】使用 FreeSql.Cloud

为 FreeSql 提供跨数据库访问，分布式事务TCC、SAGA解决方案，支持 .NET Core 2.1+, .NET Framework 4.0+.

开源地址：https://github.com/2881099/FreeSql.Cloud

> dotnet add package FreeSql.Cloud

or

> Install-Package FreeSql.Cloud

```csharp
public enum DbEnum { db1, db2 }
public class FreeSqlCloud : FreeSqlCloud<DbEnum> //DbEnum 换成 string 就是多租户管理
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

> FreeSqlCloud 必须定义成单例模式

> new FreeSqlCloud() 多连接管理

> new FreeSqlCloud("myapp") 开启 TCC/SAGA 事务生效

FreeSqlCloud 的访问方式和 IFreeSql 一样：

```csharp
fsql.Select<T>();
fsql.Insert<T>();
fsql.Update<T>();
fsql.Delete<T>();

//...
```

1、切换数据库（多线程安全）：

```csharp
fsql.Change(DbEnum.db2).Select<T>();
//同一线程，或异步await 后续 fsql.Select/Insert/Update/Delete 操作是 db2

fsql.Use(DbEnum.db2).Select<T>();
//单次有效
```

2、自动定向数据库配置：

```csharp
fsql.EntitySteering = (_, e) =>
{
    if (e.EntityType == typeof(User)) e.DBKey = DbEnum.db2;
    //查询 User 自动定向 db2
};
```

3、静态仓储对象

FreeSql.Repository/UnitOfWorkManager 对象创建时固定了 IFreeSql，因此无法跟随 FreeSqlCloud 切换数据库。

> 注意：是同一个对象实例创建之后，无法跟随切换，创建新对象实例不受影响。

租户分库场景 Repository/UnitOfWorkManager 创建之前，先调用 fsql.Change 切换好数据库。

[《FreeSql.Cloud 如何使用 UnitOfWorkManager 实现 AOP 事务？》](unitofwork-manager.md#freesql-cloud-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-unitofworkmanager)

4、动态创建对象（不推荐）

但是。。。仍然有一种特殊需求，Repository 在创建之后，仍然能跟随 fsql.Change 切换数据库。

```csharp
var repo = fsql.GetCloudRepository<User>();
fsql.Change(DbEnum.db2);
Console.WriteLine(repo.Orm.Ado.ConnectionString); //repo -> db2
fsql.Change(DbEnum.db1);
Console.WriteLine(repo.Orm.Ado.ConnectionString); //repo -> db1
```

这种机制太不可控，所以只做了简单的扩展方法创建，并不推荐 Ioc 注入。
