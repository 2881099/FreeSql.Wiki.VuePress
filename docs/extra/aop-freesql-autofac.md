# AOP+FreeSql 跨方法异步事务

使用Autofac基于特性标签，实现跨方法的异步事务处理

- Autofac.Extensions.DependencyInjection
- Autofac.Extras.DynamicProxy
- Castle.Core.AsyncInterceptor(异步方法AOP拦截)

## FreeSql基础服务

### 安装FreeSql包

```bash
dotnet add package FreeSql
dotnet add package FreeSql.DbContext
dotnet add package FreeSql.Provider.MySqlConnector
```

手动创建一个MySql/MariaDB数据库,名为`ovov_freesql_repository`

### appsettings.json

```json
{
  "Default": "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=ovov_freesql_repository;Charset=utf8;SslMode=none;Max pool size=10"
}
```

### 配置FreeSql服务

```csharp
public void ConfigureServices(IServiceCollection services)
{
  IConfigurationSection Default  = Configuration.GetSection("Default");
  var fsql = new FreeSqlBuilder()
            .UseConnectionString(DataType.MySql, Default.Value)
            .UseAutoSyncStructure(true)
            .UseNameConvert(NameConvertType.PascalCaseToUnderscoreWithLower)
            .UseMonitorCommand(cmd => Trace.WriteLine(cmd.CommandText))
            .Build();
    services.AddSingleton<IFreeSql>(fsql);
    services.AddScoped<UnitOfWorkManager>();
    services.AddFreeRepository(null, typeof(Startup).Assembly);
}
```

## Autofac+AOP实现异步事务

- [OvOv.FreeSql.AutoFac.DynamicProxy](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.FreeSql.AutoFac.DynamicProxy)

csproj

```csproj
<PackageReference Include="Autofac.Extensions.DependencyInjection" Version="6.0.0" />
<PackageReference Include="Autofac.Extras.DynamicProxy" Version="5.0.0" />
<PackageReference Include="Castle.Core.AsyncInterceptor" Version="1.7.0" />
```

或

```bash
dotnet add package Autofac.Extensions.DependencyInjection
dotnet add package Autofac.Extras.DynamicProxy
dotnet add package Castle.Core.AsyncInterceptor
```

创建一个标识事务的特性标签

```csharp
[AttributeUsage(AttributeTargets.Method, Inherited = true)]
public class TransactionalAttribute : Attribute
{
    /// <summary>
    /// 事务传播方式
    /// </summary>
    public Propagation Propagation { get; set; } = Propagation.Required;

    /// <summary>
    /// 事务隔离级别
    /// </summary>
    public IsolationLevel? IsolationLevel { get; set; }
}
```

## Autofac集成

Program.CS  替换默认的DI CreateHostBuilder方法

```csharp
 Host.CreateDefaultBuilder(args).UseServiceProviderFactory(new AutofacServiceProviderFactory())
```

Startup.cs配置服务

```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    builder.RegisterModule(new AutofacModule());
}
```

> .NET6 这样注册

```csharp
// Add services to the container.
builder.Host
    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
    .ConfigureContainer<ContainerBuilder>((webBuilder, containerBuilder) =>
    {
          containerBuilder.RegisterModule(new AutofacModule());
    });
```

这里给BlogService方法注入UnitOfWorkInterceptor拦截处理。直接注入类。

```csharp
public class AutofacModule : Autofac.Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<UnitOfWorkInterceptor>();
        builder.RegisterType<UnitOfWorkAsyncInterceptor>();
        
        builder.RegisterType<BlogService>()
            .InterceptedBy(typeof(UnitOfWorkInterceptor))
            .EnableClassInterceptors();
            
}
```

## AOP

```csharp
    public class UnitOfWorkInterceptor : IInterceptor
    {
        private readonly UnitOfWorkAsyncInterceptor asyncInterceptor;

        public UnitOfWorkInterceptor(UnitOfWorkAsyncInterceptor interceptor)
        {
            asyncInterceptor = interceptor;
        }

        public void Intercept(IInvocation invocation)
        {
            asyncInterceptor.ToInterceptor().Intercept(invocation);
        }
    }

    public class UnitOfWorkAsyncInterceptor : IAsyncInterceptor
    {
        private readonly UnitOfWorkManager _unitOfWorkManager;
        private readonly ILogger<UnitOfWorkAsyncInterceptor> _logger;
        IUnitOfWork _unitOfWork;

        public UnitOfWorkAsyncInterceptor(UnitOfWorkManager unitOfWorkManager, ILogger<UnitOfWorkAsyncInterceptor> logger)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _logger = logger;
        }

        private bool TryBegin(IInvocation invocation)
        {
            //_unitOfWork = _unitOfWorkManager.Begin(Propagation.Requierd);
            //return true;
            var method = invocation.MethodInvocationTarget ?? invocation.Method;
            var attribute = method.GetCustomAttributes(typeof(TransactionalAttribute), false).FirstOrDefault();
            if (attribute is TransactionalAttribute transaction)
            {
                _unitOfWork = _unitOfWorkManager.Begin(transaction.Propagation, transaction.IsolationLevel);
                return true;
            }

            return false;
        }

        /// <summary>
        /// 拦截同步执行的方法
        /// </summary>
        /// <param name="invocation"></param>
        public void InterceptSynchronous(IInvocation invocation)
        {
            if (TryBegin(invocation))
            {
                int? hashCode = _unitOfWork.GetHashCode();
                try
                {
                    invocation.Proceed();
                    _logger.LogInformation($"----- 拦截同步执行的方法-事务 {hashCode} 提交前----- ");
                    _unitOfWork.Commit();
                    _logger.LogInformation($"----- 拦截同步执行的方法-事务 {hashCode} 提交成功----- ");
                }
                catch
                {
                    _logger.LogError($"----- 拦截同步执行的方法-事务 {hashCode} 提交失败----- ");
                    _unitOfWork.Rollback();
                    throw;
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
            {
                invocation.Proceed();
            }
        }

        /// <summary>
        /// 拦截返回结果为Task的方法
        /// </summary>
        /// <param name="invocation"></param>
        public void InterceptAsynchronous(IInvocation invocation)
        {
            if (TryBegin(invocation))
            {
                invocation.ReturnValue = InternalInterceptAsynchronous(invocation);
            }
            else
            {
                invocation.Proceed();
            }
        }

        private async Task InternalInterceptAsynchronous(IInvocation invocation)
        {
            string methodName =
                $"{invocation.MethodInvocationTarget.DeclaringType?.FullName}.{invocation.Method.Name}()";
            int? hashCode = _unitOfWork.GetHashCode();

            using (_logger.BeginScope("_unitOfWork:{hashCode}", hashCode))
            {
                _logger.LogInformation($"----- async Task 开始事务{hashCode} {methodName}----- ");

                try
                {
                    invocation.Proceed();
                   //处理Task返回一个null值的情况会导致空指针
                    if (invocation.ReturnValue != null)
                    {
                        await (Task)invocation.ReturnValue;
                    }
                    _unitOfWork.Commit();
                    _logger.LogInformation($"----- async Task 事务 {hashCode} Commit----- ");
                }
                catch (System.Exception)
                {
                    _unitOfWork.Rollback();
                    _logger.LogError($"----- async Task 事务 {hashCode} Rollback----- ");
                    throw;
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
        }


        /// <summary>
        /// 拦截返回结果为Task<TResult>的方法
        /// </summary>
        /// <param name="invocation"></param>
        /// <typeparam name="TResult"></typeparam>
        public void InterceptAsynchronous<TResult>(IInvocation invocation)
        {
            invocation.ReturnValue = InternalInterceptAsynchronous<TResult>(invocation);
        }

        private async Task<TResult> InternalInterceptAsynchronous<TResult>(IInvocation invocation)
        {
            TResult result;
            if (TryBegin(invocation))
            {
                string methodName = $"{invocation.MethodInvocationTarget.DeclaringType?.FullName}.{invocation.Method.Name}()";
                int hashCode = _unitOfWork.GetHashCode();
                _logger.LogInformation($"----- async Task<TResult> 开始事务{hashCode} {methodName}----- ");

                try
                {
                    invocation.Proceed();
                    result = await (Task<TResult>)invocation.ReturnValue;
                    _unitOfWork.Commit();
                    _logger.LogInformation($"----- async Task<TResult> Commit事务{hashCode}----- ");
                }
                catch (System.Exception)
                {
                    _unitOfWork.Rollback();
                    _logger.LogError($"----- async Task<TResult> Rollback事务{hashCode}----- ");
                    throw;
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
            {
                invocation.Proceed();
                result = await (Task<TResult>)invocation.ReturnValue;
            }
            return result;
        }
    }
```

当Service层没有接口，则必须使用virtual虚方法。

```csharp
    public class BlogService
    {
        /// <summary>
        /// 当出现异常时，不会插入数据
        /// </summary>
        /// <param name="createBlogDto"></param>
        [Transactional]
        public virtual void CreateBlogTransactional(CreateBlogDto createBlogDto)
        {
            Blog blog = _mapper.Map<Blog>(createBlogDto);
            blog.CreateTime = DateTime.Now;
            _blogRepository.Insert(blog);

            List<Tag> tags = new List<Tag>();
            createBlogDto.Tags.ForEach(r =>
            {
                tags.Add(new Tag { TagName = r });
            });
            if (createBlogDto.Title == "abc")
            {
                throw new Exception("test exception");
            }
            _tagRepository.Insert(tags);
        }
    }
```

- [BlogService.cs#L65](https://github.com/luoyunchong/dotnetcore-examples/blob/4f4c908dc40e4c0b96ad92ad5437d071a43162cb/ORM/FreeSql/OvOv.FreeSql.AutoFac.DynamicProxy/Services/BlogService.cs#L65)

当传入的参数，title为abc时，会出现异常，`throw new Exception("test exception");`,前面插入的数据并没有成功，会自动回滚。

## IUnitOfWorkManager 开启事务

当业务需要单独开启事务时，我们可以直接在Service层使用UnitOfWorkManager创建UnitOfWork，首先注入自定义Service，也可通过AutoFac注入。

- [IUnitOfWorkManager](../guide/unitofwork-manager.md)主动在方法开启事务，请参考此文档

## Autofac批量注册

- Autofac支持批量注入以Service后缀的接口。该方法在lin-cms-dotnetcore项目中有使用[LinCms.Web/Startup/Configuration/ServiceModule.cs](https://github.com/luoyunchong/lin-cms-dotnetcore/blob/master/src/LinCms.Web/Startup/Configuration/ServiceModule.cs)

```csharp
public class ServiceModule : Autofac.Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<UnitOfWorkInterceptor>();
        builder.RegisterType<UnitOfWorkAsyncInterceptor>();

        List<Type> interceptorServiceTypes = new List<Type>()
        {
            typeof(UnitOfWorkInterceptor)
        };  
        //service所在dll，LinCms.Application为程序集名称，也可以通过typeof(程序集中的某个类即可).Assembly获取
        Assembly servicesDllFile = Assembly.Load("LinCms.Application");
        
        builder.RegisterAssemblyTypes(servicesDllFile)
                .Where(a => a.Name.EndsWith("Service") && !a.IsAbstract && !a.IsInterface && a.IsPublic)
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope()
                .PropertiesAutowired()// 属性注入
                .InterceptedBy(interceptorServiceTypes.ToArray())
                .EnableInterfaceInterceptors(); 
     }
}
```

当我们使用Autofac批量注册服务后，可以直接使用Service层的接口，不需要再使用注入。

```csharp
public interface IBlogService
{
  Task CreateBlogTransactionalAsync(CreateBlogDto createBlogDto);
}

public class BlogService:IBlogService
{
    private readonly IBlogRepository _blogRepository;
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;

    public BlogService(IBlogRepository blogRepository, ITagRepository tagRepository, IMapper mapper)
    {
        _blogRepository = blogRepository ?? throw new ArgumentNullException(nameof(blogRepository));
        _tagRepository = tagRepository ?? throw new ArgumentNullException(nameof(tagRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }
    [Transactional]
    public virtual async Task CreateBlogTransactionalAsync(CreateBlogDto createBlogDto)
    {
        Blog blog = _mapper.Map<Blog>(createBlogDto);
        blog.CreateTime = DateTime.Now;
        await _blogRepository.InsertAsync(blog);

        List<Tag> tags = new List<Tag>();
        createBlogDto.Tags.ForEach(r =>
        {
            tags.Add(new Tag { TagName = r });
        });
        if (createBlogDto.Title == "abc")
        {
            throw new Exception("test exception CreateBlogTransactionalAsync");
        }
        await _tagRepository.InsertAsync(tags);
    }
}
```

- 使用

```csharp
[Route("api/[controller]")]
[ApiController]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;
    public BlogController(IBlogService blogService)
    {
        _blogService=blogService;
    }

    [HttpPost("CreateBlogTransactionalAsync")]
    public async Task CreateBlogTransactionalAsync([FromBody] CreateBlogDto createBlogDto)
    {
        await _blogService.CreateBlogTransactionalAsync(createBlogDto);
    }
}
```
