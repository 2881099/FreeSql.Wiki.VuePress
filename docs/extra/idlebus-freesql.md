# 多个 IFreeSql 注入使用

多库切换，动态切库，动态注册数据库

## 一、定义多个 IFreeSql

该方法适用于固定数据库，固定配置项

1、定义两个标识类：

```csharp
class MySqlFlag {}
class SqlServerFlag {}
```

2、在 Startup.cs 中单例注入

```csharp
public void ConfigureServices(IServiceCollection services)
{
    Func<IServiceProvider, IFreeSql<MySqlFlag>> fsql1 = r =>
    {
        var fsql1 = new FreeSqlBuilder().UseConnectionString(DataType.MySql, "str1")
            .Build<MySqlFlag>();
        return fsql1;
    };
    Func<IServiceProvider, IFreeSql<SqlServerFlag>> fsql2 = r =>
    {
        var fsql2 = new FreeSqlBuilder().UseConnectionString(DataType.SqlServer, "str1")
            .Build<SqlServerFlag>();
        return fsql2;
    };

    services.AddSingleton<IFreeSql<MySqlFlag>>(fsql1);
    services.AddSingleton<IFreeSql<SqlServerFlag>>(fsql2);
}
```

3、在 Controller 中使用

```csharp
[Route("api/[controller]")]
[ApiController]
public class ValuesController : ControllerBase
{
    public ValuesController(IFreeSql<MySqlFlag> mysql, IFreeSql<SqlServerFlag> sqlserver)
    {
    }
}
```

## 二、使用 FreeSql.Clound

为 FreeSql 提供跨数据库访问，分布式事务TCC、SAGA解决方案，支持 .NET Core 2.1+, .NET Framework 4.0+.

开源地址：https://github.com/2881099/FreeSql.Cloud

> dotnet add package FreeSql.Cloud

or

> Install-Package FreeSql.Cloud

```csharp
public enum DbEnum { db1, db2, db3 }

var fsql = new FreeSqlCloud<DbEnum>("myapp"); //提示：泛型可以传入 string
fsql.DistributeTrace = log => Console.WriteLine(log.Split('\n')[0].Trim());

fsql.Register(DbEnum.db1, () => new FreeSqlBuilder()
    .UseConnectionString(DataType.Sqlite, @"Data Source=db1.db")
    .Build());

fsql.Register(DbEnum.db2, () => new FreeSqlBuilder()
    .UseConnectionString(DataType.Sqlite, @"Data Source=db2.db")
    .Build());

fsql.Register(DbEnum.db3, () => new FreeSqlBuilder()
    .UseConnectionString(DataType.Sqlite, @"Data Source=db3.db")
    .Build());
```

> FreeSqlCloud 必须定义成单例模式

> new FreeSqlCloud\<DbEnum\>() 多连接管理

> new FreeSqlCloud\<DbEnum\>("myapp") 开启 TCC/SAGA 事务生效

FreeSqlCloud 的访问方式和 IFreeSql 一样：

```csharp
fsql.Select<T>();
fsql.Insert<T>();
fsql.Update<T>();
fsql.Delete<T>();

//...
```

切换数据库：

```csharp
fsql.Change(DbEnum.db3).Select<T>();
//以后所有 fsql.Select/Insert/Update/Delete 操作是 db3
```

自动定向数据库配置：

```csharp
//对 fsql.CRUD 方法名 + 实体类型 进行拦截，自动定向到对应的数据库，达到自动 Change 切换数据库目的
fsql.EntitySteering = (_, e) =>
{
    switch (e.MethodName)
    {
        case "Select":
            if (e.EntityType == typeof(T))
            {
                //查询 T 自动定向 db3
                e.DBKey = DbEnum.db3;
            }
            else if (e.DBKey == DbEnum.db1)
            {
                //此处像不像读写分离？
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

## 参考

[多个 IFreeSql 实例，如何注入使用？ · Issue #44 · dotnetcore/FreeSql (github.com)](https://github.com/dotnetcore/FreeSql/issues/44)
