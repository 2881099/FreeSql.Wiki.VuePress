# Unit of Work Manager

## Use FreeSql's repository transaction in ASP.NET Core

#### Step 1: Configure Startup.cs

Install NuGet packages:

```bash
dotnet add package FreeSql
dotnet add package FreeSql.DbContext
dotnet add package FreeSql.Provider.MySqlConnector
```

Configure `Startup.cs`:

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
    //Add your own service, here is only an implementation
    services.AddScoped<TransBlogService>();
}
```

Update your `appsettings.json`:

```json
{
  "Mysql": "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=ovov_freesql_repository;Charset=utf8;SslMode=none;Max pool size=10",
}
```

| UnitOfWorkManager Members                      | Description                                           |
| ---------------------------------------------- | ----------------------------------------------------- |
| IUnitOfWork Current                            | Return the current unit of work                       |
| void Binding(repository)                       | Hand over repository transaction to ir for management |
| IUnitOfWork Begin(propagation, isolationLevel) | Create unit of work                                   |


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
            //Actually, Rollback may not be used. 
            //Because the internal Dispose of IUnitOfWork will roll back the transaction without Commit. 
            //But here can be Rollback in advance.
        
            unitOfWork.Rollback();
            //Log, 
            //or use throw to continue throwing exceptions upwards
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
            //Log, 
            //or use throw to continue throwing exceptions upwards
            unitOfWork.Rollback();
        }
    }
}
```


| IUnitOfWork Members                             | Description                                                                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| IFreeSql Orm                                    | The object Select/Delete/Insert/Update/InsertOrUpdate is consistent with the unit of work transaction and can be omitted to pass WithTransaction |
| DbTransaction GetOrBeginTransaction()           | Open the transaction, or return to the opened transaction                                                                                        |
| void Commit()                                   | Commit transaction                                                                                                                               |
| void Rollback()                                 | Rollback transaction                                                                                                                             |
| DbContext.EntityChangeReport EntityChangeReport | Entity change tracking within the unit of work                                                                                                   |

#### Complete code
- [Blog.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.Core/Domain/Blog.cs)
- [Tag.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.Core/Domain/Tag.cs)
- [TransBlogService.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.FreeSql.AutoFac.DynamicProxy/Services/TransBlogService.cs)

The above uses generic repository.

If you want to rewrite a repository, how do you keep the same transaction as `UnitOfWorkManager`? You can inherit the existing `DefaultRepository<,>` and implement a custom repository `BlogRepository.cs`:

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

The interface is `IBlogRepository.cs`:

```csharp
    public interface IBlogRepository : IBaseRepository<Blog, int>
    {
        List<Blog> GetBlogs();
    }
```

Inject this service in `startup.cs`

```csharp
    services.AddScoped<IBlogRepository, BlogRepository>();
```
