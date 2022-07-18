# AOP+FreeSql 跨方法异步事务

使用Autofac基于特性标签，实现跨方法的异步事务处理

- Autofac.Extensions.DependencyInjection
- Autofac.Extras.DynamicProxy
- Castle.Core.AsyncInterceptor(异步方法AOP拦截)

## 源码

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

## Autofac

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

- 当然我们也能使用autofac批量注入以Service后缀的接口。该方法在lin-cms-dotnetcore项目中有使用[https://github.com/luoyunchong/lin-cms-dotnetcore/blob/master/src/LinCms.Web/Startup/Configuration/ServiceModule.cs](https://github.com/luoyunchong/lin-cms-dotnetcore/blob/master/src/LinCms.Web/Startup/Configuration/ServiceModule.cs)

```csharp
    List<Type> interceptorServiceTypes = new List<Type>()
    {
        typeof(UnitOfWorkInterceptor)
    };  
    //service所在dll
    Assembly servicesDllFile = Assembly.Load("LinCms.Application");
    
    builder.RegisterAssemblyTypes(servicesDllFile)
            .Where(a => a.Name.EndsWith("Service"))
            .AsImplementedInterfaces()
            .InstancePerLifetimeScope()
            .PropertiesAutowired()// 属性注入
            .InterceptedBy(interceptorServiceTypes.ToArray())
            .EnableInterfaceInterceptors();
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

## IUnitOfWorkManager 开启事务

当业务需要单独开启事务时，我们可以直接在Service层使用UnitOfWorkManager创建UnitOfWork，首先注入自定义Service，也可通过AutoFac注入。

- 默认的DI

```csharp
 services.AddScoped<TransBlogService>();
```

- TransBlogService.cs

```csharp
private readonly IBaseRepository<Blog, int> _blogRepository;
private readonly IBaseRepository<Tag, int> _tagRepository;
private readonly UnitOfWorkManager _unitOfWorkManager;

public TransBlogService(IBaseRepository<Blog, int> blogRepository, IBaseRepository<Tag, int> tagRepository,UnitOfWorkManager unitOfWorkManager)
{
    _blogRepository = blogRepository ;
    _tagRepository = tagRepository ;
    _unitOfWorkManager = unitOfWorkManager;
}

public async Task CreateBlogUnitOfWorkAsync(Blog blog,List<Tag>tagList)
{
    using (IUnitOfWork unitOfWork = _unitOfWorkManager.Begin())
    {
        try
        {
            await _blogRepository.InsertAsync(blog);
            tagList.ForEach(r =>
            {
                r.PostId = blog.Id;
            });
            await _tagRepository.InsertAsync(tagList);
            unitOfWork.Commit();
        }
        catch (Exception e)
        {     
            //实际 可以不Rollback。因为IUnitOfWork内部Dispose，会把没有Commit的事务Rollback回来，但能提前Rollback
        
            unitOfWork.Rollback();
            //记录日志、或继续throw;出来
        }
    }
}

public async Task UpdateBlogAsync(int id)
{
    using (IUnitOfWork unitOfWork = _unitOfWorkManager.Begin())
    {
        try
        {
            Blog blog = _blogRepository.Select.Where(r => r.Id == id).First();
            blog.IsDeleted = true;
            await _blogRepository.UpdateAsync(blog);
            unitOfWork.Commit();
        }
        catch (Exception e)
        {
           //记录日志、或继续throw;出来
            unitOfWork.Rollback();
        }
    }
}
```

| IUnitOfWork 成员 | 说明 |
| -- | -- |
| IFreeSql Orm |  该对象 Select/Delete/Insert/Update/InsertOrUpdate 与工作单元事务保持一致，可省略传递 WithTransaction |
| DbTransaction GetOrBeginTransaction() | 开启事务，或者返回已开启的事务 |
| void Commit() | 提交事务 |
| void Rollback()| 回滚事务 |
|  DbContext.EntityChangeReport EntityChangeReport |工作单元内的实体变化跟踪 |

## 完整的代码

- [Blog.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.Core/Domain/Blog.cs)
- [Tag.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.Core/Domain/Tag.cs)
- [TransBlogService.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.FreeSql.AutoFac.DynamicProxy/Services/TransBlogService.cs)

以上使用的是泛型仓储，那我们如果是重写一个仓储 如何保持和``UnitOfWorkManager``同一个事务呢。
继承现有的``DefaultRepository<,>``仓储，实现自定义的仓储``BlogRepository.cs``,

```csharp
    public class BlogRepository : DefaultRepository<Blog, int>, IBlogRepository
    {
        public BlogRepository(UnitOfWorkManager uowm) : base(uowm?.Orm, uowm)
        {
        }

        public List<Blog> GetBlogs()
        {
            return Select.Page(1, 10).ToList();
        }
    }
```

其中接口。``IBlogRepository.cs``

```csharp
    public interface IBlogRepository : IBaseRepository<Blog, int>
    {
        List<Blog> GetBlogs();
    }
```

在 startup.cs注入此服务

```csharp
    services.AddScoped<IBlogRepository, BlogRepository>();
```
