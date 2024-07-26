# UowManager 事务 ✨

本篇文章内容引导，如何在 asp.net core 项目中使用特性(注解) 的方式管理事务。

> UnitOfWorkManager 只可以管理 Repository 仓储对象的事务

支持六种传播方式(propagation)，跨方法的事务非常方便，支持同步异步：

- Requierd：如果当前没有事务，就新建一个事务，如果已存在一个事务中，加入到这个事务中，默认的选择。
- Supports：支持当前事务，如果没有当前事务，就以非事务方法执行。
- Mandatory：使用当前事务，如果没有当前事务，就抛出异常。
- NotSupported：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。
- Never：以非事务方式执行操作，如果当前事务存在则抛出异常。
- Nested：以嵌套事务方式执行。

最终呈现的事务代码如下：

```csharp
public class SongService
{
    readonly IBaseRepository<Song> _songRepository;
    readonly IBaseRepository<Detail> _detailRepository;

    public SongService(IBaseRepository<Song> songRepository, IBaseRepository<Detail> detailRepository)
    {
        _songRepository = songRepository;
        _detailRepository = detailRepository;
    }

    [Transactional]
    async public Task Test1()
    {
        //所有注入的仓储对象，都是一个事务
        await _songRepository.InsertAsync(xxx1);
        await _detailRepository.DeleteAsync(xxx2);
        this.Test2();
    }
}
```

## 第一步：依赖注入、中间件

```csharp
//依赖注入
services.AddFreeRepository(typeof(Startup).Assembly);
services.AddScoped<UnitOfWorkManager>();

//中间件
public void Configure(IApplicationBuilder app)
{
    app.Use(async (context, next) =>
    {
        TransactionalAttribute.SetServiceProvider(context.RequestServices);
        await next();
    });
}
```

## 第二步：引入动态代理库

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

## 扩展：重写仓储

以上使用的是泛型仓储，那我们如果是重写一个仓储，如何保持和 `UnitOfWorkManager` 同一个事务呢。

继承现有的 `DefaultRepository<,>`，实现自定义的仓储 `SongRepository.cs`：

```csharp
public class SongRepository : DefaultRepository<Song, int>, ISongRepository
{
    public SongRepository(UnitOfWorkManager uowm) : base(uowm?.Orm, uowm) { }
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

## 扩展：多库场景

FreeSql.Cloud 提供了[跨数据库访问](sharding.md#%E3%80%90%E5%88%86%E5%BA%93%E3%80%91%E4%BD%BF%E7%94%A8-freesql-cloud)，本段内容讲解 FreeSql.Cloud 多库场景 + UowManager 的接入方法。

> 注意：[多租户分库](multi-tenancy.md#%E6%96%B9%E6%A1%88%E4%B8%89-%E6%8C%89%E7%A7%9F%E6%88%B7%E5%88%86%E5%BA%93) 请跳过，多租户同一请求大部分都只操作一个数据库，只需在中间件 Change(tenant) 切换好。

---

以 DbEnum 为例定义 FreeSqlCloud 对象如下：

```csharp
public enum DbEnum { db1, db2 }
public class FreeSqlCloud : FreeSqlCloud<DbEnum> //DbEnum 换成 string 就是多租户管理
{
    public FreeSqlCloud() : base(null) { }
    public FreeSqlCloud(string distributeKey) : base(distributeKey) { }
}
```

最终呈现的事务代码如下：

```csharp
class UserRepository : RepositoryCloud<User>, IBaseRepository<User>
{
    public UserRepository(UnitOfWorkManagerCloud uowm) : base(DbEnum.db3, uowm) { } //db3
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
    }
}
```

约定好 IBaseRepository\<T\> 默认是 db1 的仓储实现，依赖注入如下：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<FreeSqlCloud>();
    services.AddSingleton(r => r.GetService<FreeSqlCloud>().Use(DbEnum.db1)); //注入 IFreeSql
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
    readonly Dictionary<string, UnitOfWorkManager> m_managers = new Dictionary<string, UnitOfWorkManager>();
    readonly FreeSqlCloud m_cloud;
    public UnitOfWorkManagerCloud(FreeSqlCloud cloud)
    {
        m_cloud = cloud;
    }
    
    public UnitOfWorkManager GetUnitOfWorkManager(string db)
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

    public IUnitOfWork Begin(string db, Propagation propagation = Propagation.Required, IsolationLevel? isolationLevel = null)
    {
        return GetUnitOfWorkManager(db).Begin(propagation, isolationLevel);
    }
}

class RepositoryCloud<T> : DefaultRepository<T, int> where T : class
{
    public RepositoryCloud(UnitOfWorkManagerCloud uomw) : this(DbEnum.db1, uomw) { } //DI
    public RepositoryCloud(DbEnum db, UnitOfWorkManagerCloud uomw) : this(uomw.GetUnitOfWorkManager(db.ToString())) { }
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
