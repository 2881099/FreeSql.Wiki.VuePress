# Multi-tenancy

### What is Multi-tenancy?

According to Wikipedia: "Software multi-tenancy is a software architecture in which a single instance of software runs on a server and serves multiple tenants." A tenant is a group of users who share specific permissions on that software instance. With a multi-tenancy architecture, software applications are designed to provide each tenant with a dedicated instance, including data specific to that instance, while also sharing configuration, user management, tenant-specific features, and non-functional attributes. Compared to a multi-instance architecture, multi-tenancy separates multiple instances representing different tenants.

Multi-tenancy is used to create SaaS (Software as a Service) applications (cloud processing).

### Approach 1: Tenant Field Differentiation

**Step 1:** Understand `AsyncLocal<int>`

`ThreadLocal` can be thought of as a dictionary `Dictionary<int, string>` where Key is the thread ID and Value is the value. When crossing methods, you only need to know the thread ID to obtain the corresponding value.

However, we know that the thread ID might change across asynchronous methods, making `ThreadLocal` unsuitable.

`AsyncLocal` is an upgraded version of `ThreadLocal`, which solves the problem of retrieving the corresponding value across asynchronous methods.

```csharp
public class TenantManager
{
    // Must be static
    static AsyncLocal<int> _asyncLocal = new AsyncLocal<int>();

    public static int Current
    {
        get => _asyncLocal.Value;
        set => _asyncLocal.Value = value;    
    }
}
```

**Step 2:** FreeSql global filters allow any query/update/delete to include tenant conditions.

The following code does not activate the filter if the tenant value is not set. What does this mean?

```csharp
// Global filters should be applied once during IFreeSql initialization
// ITenant can be a custom interface or any entity type with a TenantId property. FreeSql does not need to set filters for every entity type (once is sufficient)
fsql.GlobalFilter.ApplyIf<ITenant>(
    "TenantFilter", // Filter name
    () => TenantManager.Current > 0, // Filter activation condition
    a => a.TenantId == TenantManager.Current // Filter condition
);

TenantManager.Current = 0;
fsql.Select<T>().ToList(); // SELECT .. FROM T

TenantManager.Current = 1;
fsql.Select<T>().ToList(); // SELECT .. FROM T WHERE TenantId = 1
```

**Step 3:** FreeSql `Aop.AuditValue` object audits events to implement unified interception of insert and update entity objects.

```csharp
fsql.Aop.AuditValue += (_, e) =>
{
    if (TenantManager.Current > 0 && e.Property.PropertyType == typeof(int) && e.Property.Name == "TenantId")
    {
        e.Value = TenantManager.Current;
    }
};
```

**Step 4:** Handle tenant logic in the `AspnetCore` `Startup.cs` middleware.

```csharp
public void Configure(IApplicationBuilder app)
{
    app.Use(async (context, next) =>
    {
        try
        {
            // Users parse the token through the aspnetcore middleware to obtain the tenant ID
            TenantManager.Current = YourGetTenantIdFunction();
            await next();
        }
        finally
        {
            // Clear tenant status
            TenantManager.Current = 0;
        }
    });
    app.UseRouting();
    app.UseEndpoints(a => a.MapControllers());
}
```

### WhereCascade

When querying multiple tables, it's cumbersome to apply conditions like `isdeleted` to each table. `WhereCascade` attaches this condition to all tables when generating SQL. This can also solve multi-table tenant conditions.

For example:

```csharp
fsql.Select<t1>()
  .LeftJoin<t2>(...)
  .WhereCascade(x => x.IsDeleted == false)
  .ToList();
```

The resulting SQL:

```sql
SELECT ...
FROM t1
LEFT JOIN t2 on ... AND (t2.IsDeleted = 0)
WHERE t1.IsDeleted = 0
```

This is effective only when expressions can be appended to entities, and it supports sub-table queries. The more tables used in a single query, the greater the benefit.

Applicable scopes:

- Subqueries, one-to-many, many-to-many, custom subqueries;
- Join queries, navigation properties, custom join queries;
- Include/IncludeMany sub-collection queries;

> Broadcasting of [deferred properties] is not currently supported;

> This feature is different from [filters], as it propagates conditions for single multi-table queries.

### Approach 2: Tenant-specific Tables

This approach requires each tenant to correspond to different tables, such as `Goods_1`, `Goods_2`, `Goods_3` corresponding to tenant 1, tenant 2, and tenant 3’s product tables respectively.

This is essentially a standard sharding approach. FreeSql provides several APIs for sharding scenarios:

- Create table `fsql.CodeFirst.SyncStructure(typeof(Goods), "Goods_1")`
- Perform CURD operations on the table

```csharp
var goodsRepository = fsql.GetRepository<Goods>(null, old => $"{Goods}_{TenantManager.Current}");
```

The above code creates a repository with tenant-specific tables, so operations will eventually affect the `Goods_1` table.

> For more details, see: [《FreeSql.Repository Repository》](repository.md), [《Sharding》](sharding.md).

> v3.2.833 Dynamic Table Name Setting

```csharp
var fsql = new FreeSql.FreeSqlBuilder()
    .UseMappingPriority(MappingPriorityType.Attribute, MappingPriorityType.FluentApi, MappingPriorityType.Aop)
    ....;
fsql.Aop.ConfigEntity += (s, e) => { e.ModifyResult.Name = $"{TenantAccessor.Current}.{e.ModifyResult.Name}"; // Table name };

app.Use(async (context, next) =>
{
    // Users parse the token through the aspnetcore middleware to obtain tenant information
    string tenant = YourGetTenantFunction();
    using (new TenantAccessor(tenant))
    {
        await next();
    }
});

public class TenantAccessor : IDisposable
{
    static AsyncLocal<string> current = new AsyncLocal<string>();
    public static string Current => current.Value ?? "public";

    public TenantAccessor(string tenant)
    {
        current.Value = tenant;
    }

    public void Dispose()
    {
        current.Value = null;
    }
}
```

### Approach 3: Tenant-specific Databases

- **Scenario 1:** Within the same database instance (not cross-server), differentiate between tenants using different database names or schemas. The method is the same as Approach 2.
- **Scenario 2:** Cross-server sharding, this section explains this scenario.

**Step 1:** `FreeSql.Cloud` provides cross-database access for FreeSql, distributed transactions TCC, and SAGA solutions, supporting .NET Core 2.1+, .NET Framework 4.0+.

Instead of creating `IFreeSql` using `FreeSqlBuilder`, you should use `FreeSqlCloud` since it also implements the `IFreeSql` interface.

> dotnet add package FreeSql.Cloud

or

> Install-Package FreeSql.Cloud

```csharp
FreeSqlCloud<string> fsql = new FreeSqlCloud<string>();

public void ConfigureServices(IServiceCollection services)
{
    fsql.DistributeTrace = log => Console.WriteLine(log.Split('\n')[0].Trim());
    fsql.Register("main", () =>
    {
        var db = new FreeSqlBuilder().UseConnectionString(DataType.SqlServer, "data source=main.db").Build();
        //db.Aop.CommandAfter += ...
        return db;
    });

    services.AddSingleton<IFreeSql>(fsql);
    services.AddControllers();
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.Use(async (context, next) =>
    {
        try
        {
            // Users parse the token through the aspnetcore middleware to obtain tenant information from the main database.
            (string tenant, string connectionString) = YourGetTenantFunction();

            // Only registers once. If already registered, it will not be effective.
            fsql.Register(tenant, () =>
            {
                var db = new FreeSqlBuilder().UseConnectionString(DataType.SqlServer, connectionString).Build();
                //db.Aop.CommandAfter += ...
                return db;
            });

            // Switch tenant
            fsql.Change(tenant);
            await next();
        }
        finally
        {
            // Switch back to the main database
            fsql.Change("main");
        }
    });
    app.UseRouting();
    app.UseEndpoints(a => a.MapControllers());
}
```

**Step 2:** Directly use `IFreeSql` to access tenant databases.

```csharp
public class HomeController : ControllerBase
{

    [HttpGet]
    public object Get([FromServices] IFreeSql fsql)
    {
        // Use fsql to operate on the current tenant's database
        return "";
    }
}
```

- To temporarily access other database tables, use `FreeSqlCloud` object `Use("db3").Select<T>().ToList()`
- For base tables in the main database, use `FreeSqlCloud` object `EntitySteering` to permanently direct to `main` without manually switching using `.Use`

```csharp
fsql.EntitySteering = (_, e) =>
{
    if (e.EntityType == typeof(T))
    {
        // Query T automatically directs to db3
        e.DBKey = "db3";
    }
};
```