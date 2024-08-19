# FreeSql+CAP事务

## 背景描述

在CAP中，事务对象需要交给CAP进行提交从而在事务实现提交后对缓存消息到 Broker 的 Flush 动作，而目前的Orm大部分都有自己的事务管理对象进行事务的提交。CAP官方直接原生支持使用 ADO.NET 和 EntityFrameworkCore 进行事务集成，而对于第三方ORM本文提供了一种扩展用以集成的示例。

接入有二种方式

- 安装`FreeSql`包

```bash
dotnet add package FreeSql
dotnet add package FreeSql.DbContext
dotnet add package FreeSql.Provider.MySqlConnector
```

- 安装`CAP`相关包

```bash
dotnet add package Savorboard.CAP.InMemoryMessageQueue
dotnet add package DotNetCore.CAP.MySql
dotnet add package DotNetCore.CAP.Dashboard
```

## 服务

- appsetttings.json

```json
{
  "ConnectionStrings": {
    "MySql": "Data Source=localhost;Port=3306;User ID=root;Password=root;Initial Catalog=lincms;Charset=utf8mb4;SslMode=none;Max pool size=1;Connection LifeTime=20"
    }
}
```

- 配置相关服务

```csharp
 IConfigurationSection mysqlSelection = configuration.GetSection($"ConnectionStrings:MySql");
    IFreeSql fsql = new FreeSqlBuilder()
                .UseConnectionString(DataType.MySql,mysqlSelection.Value)
                .UseNameConvert(NameConvertType.PascalCaseToUnderscoreWithLower)
                .UseAutoSyncStructure(true)
                .UseMonitorCommand(cmd => { Trace.WriteLine(cmd.CommandText + ";"); })
                .Build()
    services.AddSingleton(fsql);
    services.AddFreeRepository();
    services.AddScoped<UnitOfWorkManager>();
```

- CAP相关服务
[https://cap.dotnetcore.xyz/user-guide/zh/storage/mysql/](https://cap.dotnetcore.xyz/user-guide/zh/storage/mysql/)

至少你要配置一个消息队列和一个事件存储（UseMySql）

```csharp
  services.AddCap(x =>
    {   
        x.UseInMemoryMessageQueue();
        x.UseMySql(opt=>{
            //MySqlOptions
            opt.ConnectionString = mysqlSelection.Value
        });
        // x.UseXXX ...
         x.UseDashboard();
    });
```

默认情况下，你可以访问 <http://localhost:xxx/cap> 这个地址打开Dashboard。

## 方式一

```csharp
    public static class CapUnitOfWorkExtensions
    {
        public static void Flush(this ICapTransaction capTransaction)
        {
            capTransaction?.GetType().GetMethod("Flush", BindingFlags.Instance | BindingFlags.NonPublic)?.Invoke(capTransaction, null);
        }
        public static ICapTransaction BeginTransaction(this IUnitOfWork unitOfWork, ICapPublisher publisher, bool autoCommit = false)
        {
            var dbTransaction = unitOfWork.GetOrBeginTransaction();
            publisher.Transaction = ActivatorUtilities.CreateInstance<MySqlCapTransaction>(publisher.ServiceProvider);
            publisher.Transaction.DbTransaction = dbTransaction;
            publisher.Transaction.AutoCommit = autoCommit;
            return publisher.Transaction;
        }

        public static void Commit(this ICapTransaction capTransaction, IUnitOfWork unitOfWork)
        {
            unitOfWork.Commit();
            capTransaction.Flush();
        }
 }
```

- 使用方式

```csharp
public class BookController : Controller
{
    [HttpGet("~/freesql/unitofwork")]
    public DateTime FreeSqlUnitOfWorkManagerTransaction([FromServices] IBaseRepository<Book> repo,
    [FromServices] UnitOfWorkManager unitOfWorkManager,
    [FromServices] ICapPublisher capBus
    )
    {
        DateTime now = DateTime.Now;
        using (IUnitOfWork uow = unitOfWorkManager.Begin())
        {
            ICapTransaction trans = uow.BeginTransaction(capBus, false);

            repo.Insert(new Book()
            {
                Author = "叶老板",
                Title = "FreeSql源码解析与实战",
                Summary = "带你了解FreeSql源码细节，掌握FreeSql的实战操作，扩展FreeSql的功能，提升你的开发效率。"
            });

            capBus.Publish("freesql.time", now);
            trans.Commit(uow);
        }
        return now;
    }
    [NonAction]
    [CapSubscribe("freesql.time")]
    public void GetTime(DateTime time)
    {
        Console.WriteLine($"time:{time}");
    }
}

[Table(Name = "book")]
public class Book 
{
   [Column(IsIdentity = true, IsPrimary = true)]
    public long Id { get; set; } 
   
    [Column(StringLength = 30)]
    public string Author { get; set; } 

    [Column(StringLength = 1000)]
    public string Summary { get; set; } 

    [Column(StringLength = 50)]
    public string Title { get; set; } 

}
```

## 方式二

```csharp
public class FreeSqlRepositoryPatternTransaction : CapTransactionBase
{
    public FreeSqlRepositoryPatternTransaction(IDispatcher dispatcher, IUnitOfWork uow) : base(dispatcher)
    {
        Uow = uow;
    }

    public IUnitOfWork Uow { get; }

    public override object? DbTransaction => Uow.GetOrBeginTransaction();

    public override void Commit()
    {
        Uow.Commit();
        Flush();
    }

    public override Task CommitAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public override void Rollback()
    {
        Uow.Rollback();
    }

    public override Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public override void Dispose()
    {
        Uow.Dispose();
    }
}

public static class Extensions
{
      // 注意：你可以酌情修改此扩展以支持你的使用习惯，参考下方讨论内容
      public static ICapTransaction BeginTransaction(this IUnitOfWork unitOfWork, ICapPublisher publisher, bool autoCommit = false)
      {
            var dispatcher = publisher.ServiceProvider.GetRequiredService<IDispatcher>();
            var transaction = new FreeSqlRepositoryPatternTransaction(dispatcher, unitOfWork)
            {
                AutoCommit = autoCommit
            };
            return publisher.Transaction.Value = transaction;
      }
```

使用方式：

```csharp
[HttpGet("~/freesql/Withtransaction")]
public DateTime WithTransaction([FromServices] IBaseRepository<Book> repo,
[FromServices] UnitOfWorkManager unitOfWorkManager,
[FromServices] ICapPublisher capBus
)
{
    DateTime now = DateTime.Now;
    using (IUnitOfWork uow = unitOfWorkManager.Begin())
    {
        ICapTransaction trans = uow.BeginTransaction(capBus, false);

        repo.Insert(new Book()
        {
            Author = "叶老板",
            Title = "FreeSql源码解析与实战",
            Summary = "带你了解FreeSql源码细节，掌握FreeSql的实战操作，扩展FreeSql的功能，提升你的开发效率。"
        });

        capBus.Publish("freesql.time", now);
        trans.Commit();
    }
    return now;
}
```

二者区别在于后者，`trans.Commit()`不需要传递``IUnitOfWork`参数

## 原文参考

- [FreeSql 接入 CAP 的实践](https://www.cnblogs.com/igeekfan/p/cap_freesql_flush.html)
- [如何使 FreeSql 和 CAP 进行集成](https://github.com/dotnetcore/FreeSql/discussions/1202)
