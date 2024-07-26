# UnitOfWork Manager ✨

This article guides how to manage transactions using attributes (annotations) in an ASP.NET Core project.

> UnitOfWorkManager can only manage transactions for Repository objects.

It supports six propagation modes, making cross-method transactions very convenient, supporting both synchronous and asynchronous operations:

- **Required**: Creates a new transaction if none exists; if a transaction exists, it joins that transaction. This is the default choice.
- **Supports**: Supports the current transaction; if no transaction exists, it executes as a non-transactional method.
- **Mandatory**: Uses the current transaction; throws an exception if no current transaction exists.
- **NotSupported**: Executes as a non-transactional operation; if a transaction exists, it suspends the current transaction.
- **Never**: Executes as a non-transactional operation; throws an exception if a transaction exists.
- **Nested**: Executes in a nested transaction mode.

The final transaction code looks like this:

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
        // All injected repository objects are within the same transaction
        await _songRepository.InsertAsync(xxx1);
        await _detailRepository.DeleteAsync(xxx2);
        this.Test2();
    }
}
```

## Step 1: Dependency Injection and Middleware

```csharp
// Dependency Injection
services.AddFreeRepository(typeof(Startup).Assembly);
services.AddScoped<UnitOfWorkManager>();

// Middleware
public void Configure(IApplicationBuilder app)
{
    app.Use(async (context, next) =>
    {
        TransactionalAttribute.SetServiceProvider(context.RequestServices);
        await next();
    });
}
```

## Step 2: Introduce Dynamic Proxy Library

> Rougamo: https://github.com/inversionhourglass/Rougamo

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

| UnitOfWorkManager Members | Description |
| -- | -- |
| IUnitOfWork Current | Returns the current unit of work |
| void Binding(repository) | Manages the transaction of the repository |
| IUnitOfWork Begin(propagation, isolationLevel) | Creates a unit of work |

## Extension: Custom Repository

The above example uses generic repositories. If you need to override a repository, how to ensure it shares the same transaction with `UnitOfWorkManager`?

Inherit from the existing `DefaultRepository<,>` to implement a custom repository `SongRepository.cs`:

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

Interface: `ISongRepository.cs`

```csharp
public interface ISongRepository : IBaseRepository<Song, int>
{
    List<Song> GetSongs();
}
```

Register this service in `startup.cs`

```csharp
services.AddScoped<ISongRepository, SongRepository>();
```

---

## Extension: Multi-Database

FreeSql.Cloud provides [cross-database access](sharding#db-sharding-freesql-cloud). This section explains how to integrate FreeSql.Cloud with UowManager for multi-database scenarios.

> Note: [Multi-tenant Database](multi-tenancy#approach-3-tenant-specific-databases) should be skipped as multi-tenant requests usually only operate on one database. Just switch tenants in the middleware.

---

Define FreeSqlCloud object using `DbEnum` as follows:

```csharp
public enum DbEnum { db1, db2 }
public class FreeSqlCloud : FreeSqlCloud<DbEnum> // Change DbEnum to string for multi-tenant management
{
    public FreeSqlCloud() : base(null) { }
    public FreeSqlCloud(string distributeKey) : base(distributeKey) { }
}
```

The final transaction code looks like this:

```csharp
class UserRepository : RepositoryCloud<User>, IBaseRepository<User>
{
    public UserRepository(UnitOfWorkManagerCloud uowm) : base(DbEnum.db3, uowm) { } // db3
}

class UserService : IUserService
{
    readonly IBaseRepository<User> m_repo1;
    readonly BaseRepository<User> m_repo2;
    readonly UserRepository m_repo3;
    public UserService(IBaseRepository<User> repo1, BaseRepository<User> repo2, UserRepository repo3)
    {
        m_repo1 = repo1; // db1
        m_repo2 = repo2; // db1
        m_repo3 = repo3; // db3
    }

    [Transactional(DbEnum.db1)]
    [Transactional(DbEnum.db3)]
    public void Test01()
    {
    }
}
```

Assume that `IBaseRepository<T>` defaults to `db1` for repository implementation, dependency injection is as follows:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<FreeSqlCloud>();
    services.AddSingleton(r => r.GetService<FreeSqlCloud>().Use(DbEnum.db1)); // Inject IFreeSql
    services.AddScoped<UnitOfWorkManagerCloud>();

    services.AddScoped(typeof(IBaseRepository<>), typeof(RepositoryCloud<>)); // default: db1
    foreach (var repositoryType in typeof(User).Assembly.GetTypes().Where(a => a.IsAbstract == false && typeof(IBaseRepository).IsAssignableFrom(a)))
        services.AddScoped(repositoryType);
}
```

`UnitOfWorkManagerCloud`, `RepositoryCloud`, and `TransactionalAttribute` are the components we need to implement:

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
