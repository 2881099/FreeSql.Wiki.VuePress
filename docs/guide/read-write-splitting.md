# 读写分离

FreeSql 支持数据库读写分离，本功能是客户端的读写分离行为，数据库服务器该怎么配置仍然那样配置，不受本功能影响，为了方便描述后面讲到的【读写分离】都是指客户端的功能支持。

各种数据库的读写方案不一，数据库端开启读写分离功能后，读写分离的实现大致分为以下几种：

1、nginx 代理，配置繁琐且容易出错；

2、中间件，如 MyCat；

3、在 client 端支持；

FreeSql 实现了第 3 种方案，支持一个【主库】多个【从库】，【从库】的查询策略为随机方式。

若某【从库】发生故障，将切换到其他可用【从库】，若已全部不可用则使用【主库】查询。

出现故障【从库】被隔离起来间隔性的检查可用状态，以待恢复。

```csharp
var connstr = "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;" +
    "Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10";

static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connstr)
    .UseSlave("connectionString1", "connectionString2") //使用从数据库，支持多个
    .Build(); //请务必定义成 Singleton 单例模式

fsql.Select<T>().Where(a => a.Id == 1).ToOne(); //读【从库】（默认）

fsql.Select<T>().Master().WhereId(a => a.Id == 1).ToOne(); //强制读【主库】

fsql.Ado.Query<T>("/*master*/ select * from t where ..."); //强制读【主库】
```

## 使用 FreeSqlCloud 另一种读写分离

```csharp
public enum DbEnum { db1, db2, db3 }

var fsql = new FreeSqlCloud();

fsql.Register(DbEnum.db3, () => new FreeSqlBuilder()
    .UseConnectionString(DataType.Sqlite, @"Data Source=:memory:;max pool size=1")
    .UseAutoSyncStructure(true).Build());
fsql.Register(DbEnum.db2, () => new FreeSqlBuilder()
    .UseConnectionString(DataType.Sqlite, @"Data Source=:memory:;max pool size=2")
    .UseAutoSyncStructure(true).Build());
fsql.Register(DbEnum.db1, () => new FreeSqlBuilder()
    .UseConnectionString(DataType.Sqlite, @"Data Source=:memory:;max pool size=3")
    .UseAutoSyncStructure(true).Build());

fsql.EntitySteering = (_, e) =>
{
    switch (e.MethodName)
    {
        case "Select":
            if (e.DBKey == DbEnum.db1) //判断主库时
            {
                var dbkeyIndex = new Random().Next(0, e.AvailableDBKeys.Length);
                e.DBKey = e.AvailableDBKeys[dbkeyIndex]; //重新定向到其他 db
            }
            break;
        case "Insert":
        case "Update":
        case "Delete":
        case "InsertOrUpdate":
            break;
    }
};
```
