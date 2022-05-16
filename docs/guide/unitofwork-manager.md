# UnitOfWorkManager 事务

## ASP.NET Core 下 FreeSql 的仓储事务

### 引入包

```bash
dotnet add package FreeSql
dotnet add package FreeSql.DbContext
dotnet add package FreeSql.Provider.MySqlConnector
```

### 配置 Startup.cs 注入

```csharp
public void ConfigureServices(IServiceCollection services)
{
  IConfigurationSection Mysql = Configuration.GetSection("Mysql");
        Fsql = new FreeSqlBuilder()
            .UseConnectionString(DataType.MySql, Mysql.Value)
            .UseAutoSyncStructure(true)
            .UseNameConvert(NameConvertType.PascalCaseToUnderscoreWithLower)
            .UseMonitorCommand(cmd => Trace.WriteLine(cmd.CommandText))
            .Build();
    services.AddSingleton<IFreeSql>(fsql);
    services.AddScoped<UnitOfWorkManager>();
    services.AddFreeRepository(null, typeof(Startup).Assembly);
    //新增自己的服务，这里只有实现
    services.AddScoped<TransBlogService>();
}
```

- appsettings.json

```json
{
  "Mysql": "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=ovov_freesql_repository;Charset=utf8;SslMode=none;Max pool size=10"
}
```

| UnitOfWorkManager 成员                         | 说明                   |
| ---------------------------------------------- | ---------------------- |
| IUnitOfWork Current                            | 返回当前的工作单元     |
| void Binding(repository)                       | 将仓储的事务交给它管理 |
| IUnitOfWork Begin(propagation, isolationLevel) | 创建工作单元           |

### TransBlogService.cs

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

| IUnitOfWork 成员                                | 说明                                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| IFreeSql Orm                                    | 该对象 Select/Delete/Insert/Update/InsertOrUpdate 与工作单元事务保持一致，可省略传递 WithTransaction |
| DbTransaction GetOrBeginTransaction()           | 开启事务，或者返回已开启的事务                                                                       |
| void Commit()                                   | 提交事务                                                                                             |
| void Rollback()                                 | 回滚事务                                                                                             |
| DbContext.EntityChangeReport EntityChangeReport | 工作单元内的实体变化跟踪                                                                             |
| Dictionary\<string, object\> States             | 用户自定义的状态数据，便于扩展                                                                       |

### 完整代码

- [Blog.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.Core/Domain/Blog.cs)
- [Tag.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.Core/Domain/Tag.cs)
- [TransBlogService.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.FreeSql.AutoFac.DynamicProxy/Services/TransBlogService.cs)

### 重写仓储实现

以上使用的是泛型仓储，那我们如果是重写一个仓储 如何保持和`UnitOfWorkManager`同一个事务呢。
继承现有的`DefaultRepository<,>`仓储，实现自定义的仓储`BlogRepository.cs`,

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

其中接口。`IBlogRepository.cs`

```csharp
    public interface IBlogRepository : IBaseRepository<Blog, int>
    {
        List<Blog> GetBlogs();
    }
```

在 startup.cs 注入此服务

```csharp
    services.AddScoped<IBlogRepository, BlogRepository>();
```
