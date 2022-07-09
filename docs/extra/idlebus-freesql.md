# 多个 IFreeSql实例，如何注入使用

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
    var fsql1 = new FreeSqlBuilder().UseConnectionString(DataType.MySql, "str1")
        .Build<MySqlFlag>();
    var fsql2 = new FreeSqlBuilder().UseConnectionString(DataType.MySql, "str1")
        .Build<SqlServerFlag>();

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

## 二、利用 IdleBus 重写 IFreeSql

在 [asp.net](http://asp.net) core 利用 IdleBus 重写 IFreeSql 支持多库操作，支持多库动态配置

```xml
<ItemGroup>
    <PackageReference Include="FreeSql" Version="3.2.664" />
    <PackageReference Include="IdleBus" Version="1.5.2" />
    <PackageReference Include="FreeSql.Provider.Sqlite" Version="3.2.664" />
</ItemGroup>
```

### 1、MultiFreeSql.cs 代码定义

```csharp
using System;
using System.Threading;
using FreeSql.Internal;
using FreeSql.Internal.CommonProvider;

namespace FreeSql
{
    public class MultiFreeSql : MultiFreeSql<string>
    {
        public MultiFreeSql(TimeSpan timeSpan) : base(timeSpan)
        {
        }

        public MultiFreeSql(IdleBus<string, IFreeSql> idleBus) : base(idleBus)
        {
        }
    }
    public class MultiFreeSql<TDBKey> : BaseDbProvider, IFreeSql
    {
        internal TDBKey _dbkeyMaster;
        internal AsyncLocal<TDBKey> _dbkeyCurrent = new AsyncLocal<TDBKey>();
        BaseDbProvider _ormMaster => _ib.Get(_dbkeyMaster) as BaseDbProvider;
        BaseDbProvider _ormCurrent => _ib.Get(Equals(_dbkeyCurrent.Value, default(TDBKey)) ? _dbkeyMaster : _dbkeyCurrent.Value) as BaseDbProvider;
        internal IdleBus<TDBKey, IFreeSql> _ib;

        public MultiFreeSql(TimeSpan timeSpan)
        {
            _ib = new IdleBus<TDBKey, IFreeSql>(timeSpan);
            _ib.Notice += (_, __) => { };
        }

        public MultiFreeSql(IdleBus<TDBKey, IFreeSql> idleBus)
        {
            _ib = idleBus;
        }

        public override IAdo Ado => _ormCurrent.Ado;
        public override IAop Aop => _ormCurrent.Aop;
        public override ICodeFirst CodeFirst => _ormCurrent.CodeFirst;
        public override IDbFirst DbFirst => _ormCurrent.DbFirst;
        public override GlobalFilter GlobalFilter => _ormCurrent.GlobalFilter;
        public override void Dispose() => _ib.Dispose();

        public override CommonExpression InternalCommonExpression => _ormCurrent.InternalCommonExpression;
        public override CommonUtils InternalCommonUtils => _ormCurrent.InternalCommonUtils;

        public override ISelect<T1> CreateSelectProvider<T1>(object dywhere) => _ormCurrent.CreateSelectProvider<T1>(dywhere);
        public override IDelete<T1> CreateDeleteProvider<T1>(object dywhere) => _ormCurrent.CreateDeleteProvider<T1>(dywhere);
        public override IUpdate<T1> CreateUpdateProvider<T1>(object dywhere) => _ormCurrent.CreateUpdateProvider<T1>(dywhere);
        public override IInsert<T1> CreateInsertProvider<T1>() => _ormCurrent.CreateInsertProvider<T1>();
        public override IInsertOrUpdate<T1> CreateInsertOrUpdateProvider<T1>() => _ormCurrent.CreateInsertOrUpdateProvider<T1>();
    }
}

```

所以 MultiFreeSql 支持外部定义IdleBus,用于配置 Idlebus的Notice事件

```csharp
 //可传递IdleBus
    IdleBus idlebus  = new IdleBus<string, IFreeSql>(TimeSpan.FromHours(2));
    idlebus.Notice += (_, __) => { };
    IFreeSql fsql = new MultiFreeSql(idlebus);
```

### 2、MultiFreeSqlExtensions

```csharp
using System;

namespace FreeSql
{
    public static class MultiFreeSqlExtensions
    {
        public static IFreeSql ChangeDatabaseByKey<TDBKey>(this IFreeSql fsql, TDBKey dbkey)
        {
            var multiFsql = fsql as MultiFreeSql<TDBKey>;
            if (multiFsql == null) throw new Exception("fsql 类型不是 MultiFreeSql<TDBKey>");
            multiFsql._dbkeyCurrent.Value = dbkey;
            return multiFsql;
        }

        public static IDisposable Change<TDBKey>(this IFreeSql fsql, TDBKey dbkey)
        {
            var multiFsql = fsql as MultiFreeSql<TDBKey>;
            if (multiFsql == null) throw new Exception("fsql 类型不是 MultiFreeSql<TDBKey>");
            var olddbkey = multiFsql._dbkeyCurrent.Value;
            multiFsql.ChangeDatabaseByKey(dbkey);
            return new DBChangeDisposable(() => multiFsql.ChangeDatabaseByKey(olddbkey));
        }

        public static IFreeSql Register<TDBKey>(this IFreeSql fsql, TDBKey dbkey, Func<IFreeSql> create)
        {
            var multiFsql = fsql as MultiFreeSql<TDBKey>;
            if (multiFsql == null) throw new Exception("fsql 类型不是 MultiFreeSql<TDBKey>");
            if (multiFsql._ib.TryRegister(dbkey, create))
                if (multiFsql._ib.GetKeys().Length == 1)
                    multiFsql._dbkeyMaster = dbkey;
            return multiFsql;
        }
    }

    class DBChangeDisposable : IDisposable
    {
        Action _cancel;
        public DBChangeDisposable(Action cancel) => _cancel = cancel;
        public void Dispose() => _cancel?.Invoke();
    }
}
```

### 3、定义和注入,其中MultiFreeSql.cs

```csharp
public static IServiceCollection AddMultiFreeSql(this IServiceCollection services)
{
    var fsql = new MultiFreeSql(TimeSpan.FromHours(2));

    fsql.Register("db1", () => 
    new FreeSqlBuilder()
        .UseAutoSyncStructure(true)
        .UseConnectionString(DataType.Sqlite, "Data Source=|DataDirectory|\\SampleApp1.db;")
        .Build()
    );
    fsql.Register("db2", () => 
    new FreeSqlBuilder()
        .UseAutoSyncStructure(true)
        .UseConnectionString(DataType.Sqlite, "Data Source=|DataDirectory|\\SampleApp2.db;")
        .Build()
    );

    services.AddSingleton<IFreeSql>(fsql);
}
```

### 4、如何使用

> 额外增加 Register/Change 两个扩展方法，其他跟 IFreeSql 用法几乎一样

```csharp
//查db1
var db1_list = fsql.Select<T>().ToList();

//切换 db2 数据库，一旦切换之后 fsql 操作都是针对 db2
fsql.Change("db2");
var db2_list = fsql.Select<T>().ToList();

using (fsql.Change("db1"))
{
    //查询 db1
    var b3 = _fsql.Select<T>().ToList();
    //插入到 db1
    fsql.Insert(new T{ UserName = "db1" }).ExecuteAffrows();
}
//还是查db2
var db2 = fsql.Select<T>().ToList();
```

示例

- 定义SysUser

```csharp
public class SysUser
{
    [Column(IsPrimary = true, IsIdentity = true)]
    public int Id { get; set; }
    public string UserName { get; set; }
}
```

- 创建HomeController

```csharp
private readonly IFreeSql _fsql;
public HomeController( IFreeSql fsql)
{
    _fsql = fsql;
}
```

获取db1,db2的数据库信息，插入db1,db2数据

```csharp
/// <summary>
/// 获取db1,db2，插入db1,db2
/// </summary>
/// <returns></returns>
[HttpGet("get1")]
public IEnumerable<SysUser> Get1()
{
    //查询 db1
    var b0 = _fsql.Select<SysUser>().ToList();

    var b1 = _fsql.Change("db2");
    //查询 db2
    var b2 = _fsql.Select<SysUser>().ToList();
    //插入到 db2
    var c0 = _fsql.Insert(new SysUser { UserName = "db2" }).ExecuteAffrows();
    using (_fsql.Change("db1"))
    {
        //查询 db1
        var b3 = _fsql.Select<SysUser>().ToList();
        //插入到 db1
        _fsql.Insert(new SysUser { UserName = "db1" }).ExecuteAffrows();
    }

    //查询 db2
    var db2 = _fsql.Select<SysUser>().ToList();
    _fsql.Change("db2");
    return db2;
}
```

- 默认从第一个数据库中获取

```csharp
[HttpGet("getdb1")]
public IEnumerable<SysUser> GetDB1()
{
    //查询 db1
    var b0 = _fsql.Select<SysUser>().ToList();
    return b0;
}
```

- 注册第3个数据库

```csharp
[HttpGet("register")]
public void Register()
{
    _fsql.Register("db3", () =>
    {
        return new FreeSqlBuilder().UseAutoSyncStructure(true)
        .UseMonitorCommand(
        cmd => Trace.WriteLine("\r\n线程" + Thread.CurrentThread.ManagedThreadId + ": " + cmd.CommandText)
        )
        .UseConnectionString(DataType.Sqlite, "Data Source=|DataDirectory|\\SampleApp3.db;")
        .Build();
    });
}
```

- 根据dbname change，但只对本次请求有效

```csharp
[HttpGet("change")]
public int Change(string dbname)
{
  //仅对本次请求有效
  _fsql.Change(dbname);
  return 1;
}
```

- 获取DB3，在未注册前，会报错

```csharp
[HttpGet("getdb3")]
public IEnumerable<SysUser> Get3()
{
    _fsql.Change("db3");
    //查询 db1
    var b0 = _fsql.Select<SysUser>().ToList();
    return b0;
}
```

> 如果需要分布多事务 TCC/Saga 请移步到：[https://github.com/dotnetcore/FreeSql.Cloud](https://github.com/dotnetcore/FreeSql.Cloud)

## 三、静态类管理多数据库？

基于第二种方法 MultiFreeSql 增加静态类如下：

```csharp
using System;

namespace FreeSql
{
  public class StaticDB : StaticDB<string> { }
  
  public abstract class StaticDB<DBKey>
  {
      protected static Lazy<IFreeSql> multiFreeSql = new Lazy<IFreeSql>(() => new MultiFreeSql(TimeSpan.FromHours(2))
      );
      public static IFreeSql Instance => multiFreeSql.Value;
  }
}
```

- 根据静态类

```csharp
#region 1.静态类的注册方式
IFreeSql db = StaticDB.Instance;

db.Register("db1", () =>
{
    return new FreeSqlBuilder()
        .UseAutoSyncStructure(true)
        .UseMonitorCommand(
        cmd => Trace.WriteLine("\r\n线程" + Thread.CurrentThread.ManagedThreadId + ": " + cmd.CommandText)
        )
        .UseConnectionString(DataType.Sqlite, "Data Source=|DataDirectory|\\SampleApp1.db;")
        .Build();
});
db.Register("db2", () =>
{
    return new FreeSqlBuilder()
        .UseAutoSyncStructure(true)
        .UseMonitorCommand(
        cmd => Trace.WriteLine("\r\n线程" + Thread.CurrentThread.ManagedThreadId + ": " + cmd.CommandText)
        )
        .UseConnectionString(DataType.Sqlite, "Data Source=|DataDirectory|\\SampleApp2.db;")
        .Build();
});
#endregion
```

- 创建StaticDBController，可以直接使用静态方法，不使用DI，但使用方式和注入方式相同

```csharp
   private readonly IFreeSql _fsql = StaticDB.Instance;

    /// <summary>
    /// 获取db1,db2，插入db1,db2
    /// </summary>
    /// <returns></returns>
    [HttpGet("get1")]
    public IEnumerable<SysUser> Get1()
    {
        //查询 db1
        var b0 = _fsql.Select<SysUser>().ToList();

        var b1 = _fsql.Change("db2");
        //查询 db2
        var b2 = _fsql.Select<SysUser>().ToList();
        //插入到 db2
        var c0 = _fsql.Insert(new SysUser { UserName = "db2" }).ExecuteAffrows();
        using (_fsql.Change("db1"))
        {
            //查询 db1
            var b3 = _fsql.Select<SysUser>().ToList();
            //插入到 db1
            _fsql.Insert(new SysUser { UserName = "db1" }).ExecuteAffrows();
        }

        //查询 db2
        var db2 = _fsql.Select<SysUser>().ToList();
        _fsql.Change("db2");
        return db2;
    }
```

## 参考

[SampleApp/HomeController.cs at master · luoyunchong/SampleApp (github.com)](https://github.com/luoyunchong/SampleApp/blob/master/SampleApi/Controllers/HomeController.cs)

[SampleApp/MultiFreeSql.cs at master · luoyunchong/SampleApp (github.com)](https://github.com/luoyunchong/SampleApp/blob/master/SampleCore/MultiFreeSql.cs)

[多个 IFreeSql 实例，如何注入使用？ · Issue #44 · dotnetcore/FreeSql (github.com)](https://github.com/dotnetcore/FreeSql/issues/44)

> 与此文章有点区别，增加了一些配置项和静态方法的理解，把`Change` 下放到`MultiFreeSqlExtensions`扩展中，从而保持简单，静态方法和DI保持一致的写法
