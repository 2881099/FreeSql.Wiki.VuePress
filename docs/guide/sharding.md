# 分表分库

## 理论知识

分表 - 从表面意思上看呢，就是把一张表分成 N 多个小表，每一个小表都是完整的一张表。分表后数据都是存放在分表里，总表只是一个外壳，存取数据发生在一个一个的分表里面。分表后单表的并发能力提高了，磁盘 I/O 性能也提高了。并发能力为什么提高了呢，因为查寻一次所花的时间变短了，如果出现高并发的话，总表可以根据不同 的查询，将并发压力分到不同的小表里面。

分库 - 把原本存储于一个库的数据分块存储到多个库上，把原本存储于一个表的数据分块存储到多个表上。数据库中的数据量不一定是可控的，在未进行分表分库的情况下，随着时间和业务的发展，库中的表会越来越多，表中的数据量也会越来越大，相应地，数据操作，增删改查的开销也会越来越大；另外，一台服务器的资源（CPU、磁盘、内存、IO 等）是有限的，最终数据库所能承载的数据量、数据处理能力都将遭遇瓶颈。

## 分表 AsTable

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

## 分库 IdleBus

IFreeSql 对应一个数据库，分库是不是要定义 N 个 IFreeSql？分库的租户场景，那不要定义 10000 个？

IdleBus 空闲对象管理容器，有效组织对象重复利用，自动创建、销毁，解决【实例】过多且长时间占用的问题。有时候想做一个单例对象重复使用提升性能，但是定义多了，有的又可能一直空闲着占用资源。专门解决：又想重复利用，又想少占资源的场景。https://github.com/2881099/IdleBus

> dotnet add package IdleBus

```csharp
static IdleBus<IFreeSql> ib = new IdleBus<IFreeSql>(TimeSpan.FromMinutes(10));

ib.Register("db1", () => new FreeSqlBuilder().UseConnectionString(DataType.MySql, "str1").Build());
ib.Register("db2", () => new FreeSqlBuilder().UseConnectionString(DataType.MySql, "str2").Build());
ib.Register("db3", () => new FreeSqlBuilder().UseConnectionString(DataType.SqlServer, "str3").Build());
//...注册很多个

ib.Get("db1").Select<T>().Limit(10).ToList();
```

IdleBus 也是【单例】设计！主要的两个方法，注册，获取。使用 IdleBus 需要弱化 IFreeSql 的存在，每次使用 ib.Get 获取。

```csharp
public static class IdleBusExtesions
{
    static AsyncLocal<string> asyncLocalTenantId = new AsyncLocal<string>();
    public static IdleBus<IFreeSql> ChangeTenant(this IdleBus<IFreeSql> ib, string tenantId)
    {
        asyncLocalTenantId.Value = tenantId;
        return ib;
    }
    public static IFreeSql Get(this IdleBus<IFreeSql> ib) => ib.Get(asyncLocalTenantId.Value ?? "db1");
    public static IBaseRepository<T> GetRepository<T>(this IdleBus<IFreeSql> ib) where T : class => ib.Get().GetRepository<T>();

    //-------------------------------------------------------

    static void test()
    {
        IdleBus<IFreeSql> ib = null; //单例注入

        var fsql = ib.Get(); //获取当前租户对应的 IFreeSql

        var fsql00102 = ib.ChangeTenant("00102").Get(); //切换租户，后面的操作都是针对 00102

        var songRepository = ib.GetRepository<Song>();
        var detailRepository = ib.GetRepository<Detail>();
    }

    //-------------------------------------------------------

    public static IServiceCollection AddIdleBusRepository(this IServiceCollection services, IdleBus<IFreeSql> ib, params Assembly[] assemblies)
    {
        services.AddSingleton(ib);
        services.AddScoped(typeof(IBaseRepository<>), typeof(YourDefaultRepository<>));
        services.AddScoped(typeof(BaseRepository<>), typeof(YourDefaultRepository<>));
        services.AddScoped(typeof(IBaseRepository<,>), typeof(YourDefaultRepository<,>));
        services.AddScoped(typeof(BaseRepository<,>), typeof(YourDefaultRepository<,>));

        if (assemblies?.Any() == true)
            foreach (var asse in assemblies) //批量注册
                foreach (var repo in asse.GetTypes().Where(a => a.IsAbstract == false && typeof(IBaseRepository).IsAssignableFrom(a)))
                    services.AddScoped(repo);
        return services;
    }
}

class YourDefaultRepository<T> : BaseRepository<T> where T : class
{
    public YourDefaultRepository(IdleBus<IFreeSql> ib) : base(ib.Get(), null, null) { }
}
class YourDefaultRepository<T, TKey> : BaseRepository<T, TKey> where T : class
{
    public YourDefaultRepository(IdleBus<IFreeSql> ib) : base(ib.Get(), null, null) { }
}
```

分库总结：

- 跨库 可以使用 ib.Get() 获取 IFreeSql 进行 CRUD；
- 跨库 事务不好处理，注意了；
- 跨库 查询不好处理，注意了；
