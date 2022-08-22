# UnitOfWorkManager 事务

本篇文章内容引导，如何在 asp.net core 项目中使用特性(注解) 的方式管理事务。

> UnitOfWorkManager 只可以管理 Repository 仓储对象的事务，直接 fsql.Insert\<T>() 是不行的！！但是可以用 repository.Orm.Insert\<T\>！！repository.Orm 是特殊实现的 IFreeSql，与 当前事务保持一致。

支持六种传播方式(propagation)，意味着跨方法的事务非常方便，并且支持同步异步：

- Requierd：如果当前没有事务，就新建一个事务，如果已存在一个事务中，加入到这个事务中，默认的选择。
- Supports：支持当前事务，如果没有当前事务，就以非事务方法执行。
- Mandatory：使用当前事务，如果没有当前事务，就抛出异常。
- NotSupported：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。
- Never：以非事务方式执行操作，如果当前事务存在则抛出异常。
- Nested：以嵌套事务方式执行。

## 第一步：引入动态代理库

> 肉夹馍：https://github.com/inversionhourglass/Rougamo

> dotnet add package Rougamo.Fody

```csharp
[AttributeUsage(AttributeTargets.Method)]
public class TransactionalAttribute : Rougamo.MoAttribute
{
    public Propagation Propagation { get; set; } = Propagation.Required;
    public IsolationLevel IsolationLevel { get => m_IsolationLevel.Value; set => m_IsolationLevel = value; }
    IsolationLevel? m_IsolationLevel;

    static AsyncLocal<IServiceProvider> m_ServiceProvider = new AsyncLocal<IServiceProvider>();
    public static void SetServiceProvider(IServiceProvider serviceProvider) => m_ServiceProvider.Value = serviceProvider;

    IUnitOfWork _uow;
    public override void OnEntry(MethodContext context)
    {
        var uowManager = m_ServiceProvider.Value.GetService<UnitOfWorkManager>();
        _uow = uowManager.Begin(this.Propagation, this.m_IsolationLevel);
    }
    public override void OnExit(MethodContext context)
    {
        if (typeof(Task).IsAssignableFrom(context.RealReturnType))
            ((Task)context.ReturnValue).ContinueWith(t => _OnExit());
        else _OnExit();

        void _OnExit()
        {
            try
            {
                if (context.Exception == null) _uow.Commit();
                else _uow.Rollback();
            }
            finally
            {
                _uow.Dispose();
            }
        }
    }
}
```

| UnitOfWorkManager 成员 | 说明 |
| -- | -- |
| IUnitOfWork Current | 返回当前的工作单元 |
| void Binding(repository) | 将仓储的事务交给它管理 |
| IUnitOfWork Begin(propagation, isolationLevel) | 创建工作单元 |

## 第二步：配置 Startup.cs 注入、中间件

```csharp
//Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IFreeSql>(fsql);
    services.AddScoped<UnitOfWorkManager>();
    services.AddFreeRepository(null, typeof(Startup).Assembly);
   //批量注入 Service
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.Use(async (context, next) =>
    {
        TransactionalAttribute.SetServiceProvider(context.RequestServices);
        await next();
    });
}
```

## 第三步：在 Controller 或者 Service 或者 Repository 中使用事务特性

```csharp
public class SongService
{
    readonly IBaseRepository<Song> _repoSong;
    readonly IBaseRepository<Detail> _repoDetail;
    readonly ISongRepository _repoSong2;

    public SongService(IBaseRepository<Song> repoSong, IBaseRepository<Detail> repoDetail, ISongRepository repoSong2)
    {
        _repoSong = repoSong;
        _repoDetail = repoDetail;
        _repoSong2 = repoSong2;
    }

    [Transactional]
    public virtual void Test1()
    {
        //这里 _repoSong、_repoDetail、_repoSong2 所有操作都是一个工作单元
        this.Test2();
    }

    [Transactional(Propagation = Propagation.Nested)]
    public virtual void Test2() //嵌套事务，新的（不使用 Test1 的事务）
    {
        //这里 _repoSong、_repoDetail、_repoSong2 所有操作都是一个工作单元
    }
}
```

是不是进方法就开事务呢？

不一定是真实事务，有可能是虚的，就是一个假的 unitofwork（不带事务）

也有可能是延用上一次的事务

也有可能是新开事务，具体要看传播模式

## 重写仓储实现

以上使用的是泛型仓储，那我们如果是重写一个仓储 如何保持和`UnitOfWorkManager`同一个事务呢。
继承现有的`DefaultRepository<,>`仓储，实现自定义的仓储`SongRepository.cs`,

```csharp
public class SongRepository : DefaultRepository<Song, int>, ISongRepository
{
    public SongRepository(UnitOfWorkManager uowm) : base(uowm?.Orm, uowm)
    {
    }
    public List<Song> GetSongs()
    {
        return Select.Page(1, 10).ToList();
    }
}
```

其中接口。`ISongRepository.cs`

```csharp
public interface ISongRepository : IBaseRepository<Song, int>
{
    List<Song> GetSongs();
}
```

在 startup.cs 注入此服务

```csharp
services.AddScoped<ISongRepository, SongRepository>();
```

---

## FreeSql.Cloud 如何使用 UnitOfWorkManager？

以 DbEnum 为例定义 FreeSqlCloud 对象如下：

```csharp
public enum DbEnum { db1, db2, db3 }
public static FreeSqlCloud<DbEnum> Cloud = new ...
```

最终呈现的 AOP 事务代码如下：

```csharp
class UserRepository : RepositoryCloud<User>, IBaseRepository<User>
{
    public UserRepository(UnitOfWorkManagerCloud uowm) : base(DbEnum.db3, uowm) { }
}

class UserService : IUserService
{
    readonly IBaseRepository<User> m_repo1;
    readonly BaseRepository<User> m_repo2;
    readonly UserRepository m_repo3;
    public UserService(IBaseRepository<User> repo1, BaseRepository<User> repo2, UserRepository repo3)
    {
        m_repo1 = repo1; //db1
        m_repo2 = repo2; //db1
        m_repo3 = repo3; //db3
    }

    [Transactional(DbEnum.db1)]
    [Transactional(DbEnum.db3)]
    public void Test01()
    {
        Console.WriteLine("xxx"); //debugger
    }
}
```

约定好 IBaseRepository\<T\> 默认是 db1 的仓储实现，注入如下：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton(Cloud); //注入 FreeSqlCloud<DbEnum>
    services.AddSingleton(provider => Cloud.Use(DbEnum.db1)); //注入 IFreeSql
    services.AddScoped<UnitOfWorkManagerCloud>();

    services.AddScoped(typeof(IBaseRepository<>), typeof(RepositoryCloud<>)); //default: db1
    foreach (var repositoryType in typeof(User).Assembly.GetTypes().Where(a => a.IsAbstract == false && typeof(IBaseRepository).IsAssignableFrom(a)))
        services.AddScoped(repositoryType);
}
```

UnitOfWorkManagerCloud、RepositoryCloud、TransactionalAttribute 是我们需要实现的部分：

```csharp
class UnitOfWorkManagerCloud
{
    readonly Dictionary<DbEnum, UnitOfWorkManager> m_managers = new Dictionary<DbEnum, UnitOfWorkManager>();
    readonly FreeSqlCloud<DbEnum> m_cloud;
    public UnitOfWorkManagerCloud(FreeSqlCloud<DbEnum> cloud)
    {
        m_cloud = cloud;
    }
    
    public UnitOfWorkManager GetUnitOfWorkManager(DbEnum db)
    {
        if (m_managers.TryGetValue(db, out var uowm) == false)
            m_managers.Add(db, uowm = new UnitOfWorkManager(m_cloud.Use(db)));
        return uowm;
    }

    public void Dispose()
    {
        foreach(var uowm in m_managers.Values) uowm.Dispose();
        m_managers.Clear();
    }

    public IUnitOfWork Begin(DbEnum db, Propagation propagation = Propagation.Required, IsolationLevel? isolationLevel = null)
    {
        return GetUnitOfWorkManager(db).Begin(propagation, isolationLevel);
    }
}

class RepositoryCloud<T> : DefaultRepository<T, int> where T : class
{
    public RepositoryCloud(UnitOfWorkManagerCloud uomw) : this(DbEnum.db1, uomw) { } //DI
    public RepositoryCloud(DbEnum db, UnitOfWorkManagerCloud uomw) : this(uomw.GetUnitOfWorkManager(db)) { }
    RepositoryCloud(UnitOfWorkManager uomw) : base(uomw.Orm, uomw)
    {
        uomw.Binding(this);
    }
}

[AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
public class TransactionalAttribute : Rougamo.MoAttribute
{
    public Propagation Propagation { get; set; } = Propagation.Required;
    public IsolationLevel IsolationLevel { get => m_IsolationLevel.Value; set => m_IsolationLevel = value; }
    IsolationLevel? m_IsolationLevel;
    readonly DbEnum m_db;

    public TransactionalAttribute(DbEnum db)
    {
        m_db = db;
    }

    static AsyncLocal<IServiceProvider> m_ServiceProvider = new AsyncLocal<IServiceProvider>();
    public static void SetServiceProvider(IServiceProvider serviceProvider) => m_ServiceProvider.Value = serviceProvider;

    IUnitOfWork _uow;
    public override void OnEntry(MethodContext context)
    {
        var uowManager = m_ServiceProvider.Value.GetService<UnitOfWorkManagerCloud>();
        _uow = uowManager.Begin(m_db, this.Propagation, this.m_IsolationLevel);
    }
    public override void OnExit(MethodContext context)
    {
        if (typeof(Task).IsAssignableFrom(context.RealReturnType))
            ((Task)context.ReturnValue).ContinueWith(t => _OnExit());
        else _OnExit();

        void _OnExit()
        {
            try
            {
                if (context.Exception == null) _uow.Commit();
                else _uow.Rollback();
            }
            finally
            {
                _uow.Dispose();
            }
        }
    }
}
```
