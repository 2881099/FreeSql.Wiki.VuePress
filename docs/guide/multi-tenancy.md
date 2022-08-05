# 多租户

### 什么是多租户

维基百科：“软件多租户是指一种软件架构，在这种软件架构中，软件的一个实例运行在服务器上并且为多个租户服务”。一个租户是一组共享该软件实例特定权限的用户。有了多租户架构，软件应用被设计成为每个租户提供一个 专用的实例包括该实例的数据的共享，还可以共享配置，用户管理，租户自己的功能和非功能属性。多租户和多实例架构相比，多租户分离了代表不同的租户操作的多个实例。

多租户用于创建 Saas（Software as-a service）应用（云处理）。

### 方案一：按租户字段区分

1、AsyncLocal\<int\>

ThreadLocal 可以理解为字典 Dictionary\<int, string\> Key=线程ID Value=值，跨方法时只需要知道线程ID，就能取得对应的 Value。

我们知道跨异步方法可能造成线程ID变化，ThreadLocal 将不能满足我们使用。

AsyncLocal 是 ThreadLocal 的升级版，异步也能获取到对应的 Value。

```csharp
public class TerantManager
{
    // 注意一定是 static 静态化
    static AsyncLocal<int> _asyncLocal = new AsyncLocal<int>();

    public static int Current
    {
        get => _asyncLocal.Value;
        set => _asyncLocal.Value = value;    
    }
}
```

2、FreeSql 全局过滤器，让任何查询，都附带租户条件；

```csharp
fsql.GlobalFilter.ApplyIf<ITerant>("TerantFilter", () => TerantManager.Current > 0, a => a.TerantId == TerantManager.Current);
```

3、FreeSql Aop.AuditValue 对象审计事件，实现统一拦截插入、更新实体对象；

```csharp
fsql.Aop.AuditValue += (_, e) =>
{
    if (e.Property.PropertyType == typeof(int) && e.Property.Name == "TerantId")
    {
        e.Value = TerantManager.Current
    }
};
```

4、AspnetCore Startup.cs Configure 中间件处理租户逻辑；

```csharp
public void Configure(IApplicationBuilder app)
{
    app.Use(async (context, next) =>
    {
        try
        {
            TerantManager.Current = YourGetTerantIdFunction();
            await next();
        }
        finally
        {
            // 清除租户状态
            TerantManager.Current = 0;
        }
    });
    app.UseRouting();
    app.UseEndpoints(a => a.MapControllers());
}
```

### WhereCascade

多表查询时，像 isdeleted 每个表都给条件，挺麻烦的。WhereCascade 使用后生成 sql 时，所有表都附上这个条件。多表租户条件也可以这样解决。

如：

```csharp
fsql.Select<t1>()
.LeftJoin<t2>(...)
.WhereCascade(x => x.IsDeleted == false)
.ToList();
```

得到的 SQL：

```sql
SELECT ...
FROM t1
LEFT JOIN t2 on ... AND (t2.IsDeleted = 0)
WHERE t1.IsDeleted = 0
```

实体可附加表达式时才生效，支持子表查询。单次查询使用的表数目越多收益越大。

可应用范围：

- 子查询，一对多、多对多、自定义的子查询；
- Join 查询，导航属性、自定义的 Join 查询；
- Include/IncludeMany 的子集合查询；

> 暂时不支持【延时属性】的广播；

> 此功能和【过滤器】不同，用于单次多表查询条件的传播；

### 方案二：按租户分表

FreeSql.Repository 实现了 分表功能，如：

```csharp
var tenantId = 1;
var reposTopic = orm.GetGuidRepository<Topic>(null, oldname => $"{oldname}{tenantId}");
```

上面我们得到一个仓储按租户分表，使用它 CURD 最终会操作 Topic_1 表。

> 更多说明参考：[《FreeSql.Repository 仓储》](repository.md)、[《分表分库》](sharding.md)。

### 方案三：按租户分库

场景1：同数据库实例（未跨服务器），租户间使用不同的数据库名或Schema区分，使用方法与方案二相同。

场景2：跨服务器分库

1、FreeSql.Cloud 为 FreeSql 提供跨数据库访问，分布式事务TCC、SAGA解决方案，支持 .NET Core 2.1+, .NET Framework 4.0+.

> dotnet add package FreeSql.Cloud

or

> Install-Package FreeSql.Cloud

```c#
FreeSqlCloud<string> fsql = new FreeSqlCloud<string>();

public void ConfigureServices(IServiceCollection services)
{
    fsql.DistributeTrace = log => Console.WriteLine(log.Split('\n')[0].Trim());
    fsql.Register("main", () =>
    {
        var db = new FreeSqlBuilder().UseConnectionString(DataType.SqlServer, "data source=...").Build();
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
            // 假设 YourGetTerantFunction 返回租户信息和连接串
            (string terant, string connectionString) = YourGetTerantFunction();

            // 只会首次注册，如果已经注册过则不生效
            fsql.Register(terant, () =>
            {
                var db = new FreeSqlBuilder().UseConnectionString(DataType.SqlServer, connectionString).Build();
                //db.Aop.CommandAfter += ...
                return db;
            });

            // 切换租户
            fsql.Change(terant);
            await next();
        }
        finally
        {
            // 切换回 main 库
            fsql.Change("main");
        }
    });
    app.UseRouting();
    app.UseEndpoints(a => a.MapControllers());
}
```

2、直接使用 IFreeSql 访问租户数据库

```c#
public class HomeController : ControllerBase
{

    [HttpGet]
    public object Get([FromServices] IFreeSql fsql)
    {
        // 使用 fsql 操作当前租户对应的数据库
        return "";
    }
}
```
