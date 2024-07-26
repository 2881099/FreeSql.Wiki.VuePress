# Transaction

::: code-tabs

@tab:active .NET CLI

```bash
dotnet add package FreeSql.DbContext
```

@tab Package Manager

```bash
Install-Package FreeSql.DbContext
```

:::

## 1. Regular Transactions

`UnitOfWork` is a wrapper around the `DbTransaction` object, making it convenient to carry private data.

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
    await uow.Orm.Insert(item).ExecuteAffrowsAsync(); // uow.Orm API is the same as IFreeSql
    await uow.Orm.Ado.ExecuteNoneQueryAsync(sql);

    await fsql.Insert(item)... // Error, not within the same transaction

    var repo = uow.GetRepository<Song>(); // Repository CRUD
    await repo.InsertAsync(item);

    uow.Commit();
}
```

> Tip: Within the `uow` scope, try not to use the `fsql` object to avoid not being in the same transaction.

Use `UnitOfWorkManager` to manage `UnitOfWork`, as follows:

```csharp
using (var uowManager = new UnitOfWorkManager(fsql))
{
    using (var uow = uowManager.Begin())
    {
        using (var uow2 = uowManager.Begin()) // Same transaction as uow
        {
            uow2.Commit(); // Transaction not yet committed
        }
        uow.Commit(); // Commit the transaction
    }
}
```

## 2. Repository Transactions (Dependency Injection)

```csharp
var builder = WebApplication.CreateBuilder(args);
Func<IServiceProvider, IFreeSql> fsqlFactory = r =>
{
    IFreeSql fsql = new FreeSql.FreeSqlBuilder()
        .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=freedb.db")
        .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
        .Build();
    return fsql;
};
builder.Services.AddSingleton<IFreeSql>(fsqlFactory);

builder.Services.AddFreeRepository();
builder.Services.AddScoped<UnitOfWorkManager>();
builder.Services.AddScoped<SongService>();
WebApplication app = builder.Build();


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

    [Transactional(Propagation = Propagation.Nested)]
    public void Test2() // Nested transaction
    {
    }
}
```

For more details, refer to the document: - [AOP Feature Tag Implementation for Cross-Method Transactions](unitofwork-manager.md)

## 3. Same-Thread Transactions

Same-thread transactions are built into FreeSql.dll, managed by `fsql.Transaction` for committing and rolling back transactions (Note: does not support asynchronous operations).

A user purchases a product worth 100 yuan: deduct balance, deduct inventory.

```csharp
fsql.Transaction(() => 
{
    // fsql.Ado.TransactionCurrentThread gets the current transaction object

    var affrows = fsql.Update<User>()
        .Set(a => a.Wealth - 100)
        .Where(a => a.Wealth >= 100).ExecuteAffrows();
        // Ensure user balance does not become negative

    // Throw exception to roll back the transaction and exit
    if (affrows < 1) throw new Exception("User balance insufficient");

    affrows = fsql.Update<Goods>()
        .Set(a => a.Stock - 1)
        .Where(a => a.Stock >= 1).ExecuteAffrows();
        
    if (affrows < 1) throw new Exception("Product stock insufficient");
});
```

Same-thread transactions are simple to use but have some limitations:

- The transaction object is bound to the thread, and only one transaction connection can be opened per thread; nested transactions use the same transaction.

- Code within the transaction body cannot switch threads, so no asynchronous methods can be used, including asynchronous database methods provided by FreeSql (but any synchronous CRUD methods can be used).

## 4. Pessimistic Lock

```csharp
var user = fsql.Select<User>().ForUpdate(true).Where(a => a.Id == 1).ToOne();
// SELECT ... FROM User a for update nowait
```

The `for update` syntax is common in Oracle/PostgreSQL/MySQL. We have provided special adaptation for SqlServer, and the executed SQL statement is roughly as follows:

```sql
SELECT ... FROM [User] a With(UpdLock, RowLock, NoWait)
```