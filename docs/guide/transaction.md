# 事务Transaction

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

## 1、常规事务

UnitOfWork 是对 DbTransaction 事务对象的封装，方便夹带私有数据。

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
  await uow.Orm.Insert(item).ExecuteAffrowsAsync(); //uow.Orm API 和 IFreeSql 一样
  await uow.Orm.Ado.ExecuteNoneQueryAsync(sql);

  await fsql.Insert(item)... //错误，不在一个事务

  var repo = uow.GetRepository<Song>(); //仓储 CRUD
  await repo.InsertAsync(item);

  uow.Commit();
}
```

> 提示：uow 范围内，尽量别使用 fsql 对象，以免不处在一个事务

或者

```csharp
//使用 UnitOfWorkManager 管理类事务
using (var uowManager = new UnitOfWorkManager(fsql))
{
    using (var uow = uowManager.Begin())
    {
        uow.Orm.Insert(item).ExecuteAffrows(); //正常
        fsql.Insert(item).ExecuteAffrows(); //错误，没有传事务
        fsql.Insert(item).WithTransaction(uow.GetOrBeginTransaction()).ExecuteAffrows(); //正常

        using (var uow2 = uowManager.Begin()) //与 uow 同一个事务
        {
            uow2.Commit(); //事务还未提交
        }
        uow.Commit(); //事务提交
    }
}
```

## 2、仓储事务（依赖注入）

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
        //所有注入的仓储对象，都是一个事务
        await _songRepository.InsertAsync(xxx1);
        await _detailRepository.DeleteAsync(xxx2);
        this.Test2();
    }

    [Transactional(Propagation = Propagation.Nested)]
    public void Test2() //嵌套事务
    {
    }
}
```

具体请移步文档：- [AOP 特性标签实现跨方法事务](unitofwork-manager.md)

## 3、同线程事务

同线程事务内置在 FreeSql.dll，由 fsql.Transaction 管理事务提交回滚（缺点：不支持异步）。

用户购买了价值 100 元的商品：扣余额、扣库存。

```csharp
fsql.Transaction(() =>  {
  //fsql.Ado.TransactionCurrentThread 获得当前事务对象

  var affrows = fsql.Update<User>()
    .Set(a => a.Wealth - 100)
    .Where(a => a.Wealth >= 100).ExecuteAffrows();
    //判断别让用户余额扣成负数

  if (affrows < 1)
    throw new Exception("用户余额不足");
    //抛出异常，回滚事务，事务退出

  affrows = fsql.Update<Goods>()
    .Set(a => a.Stock - 1)
    .Where(a => a.Stock >= 1).ExecuteAffrows();
    //判断别让用库存扣成负数

  if (affrows < 1)
    throw new Exception("商品库存不足");
    //抛出异常，回滚事务，事务退出
});
```

同线程事务使用简单，需要注意的限制：

- 事务对象在线程挂载，每个线程只可开启一个事务连接，嵌套使用的是同一个事务；

- 事务体内代码不可以切换线程，因此不可使用任何异步方法，包括 FreeSql 提供的数据库异步方法（可以使用任何 Curd 同步方法）；

## 4、悲观锁

```csharp
var user = fsql.Select<User>().ForUpdate(true).Where(a => a.Id == 1).ToOne();
//SELECT ... FROM User a for update nowait
```

for update 在 Oracle/PostgreSQL/MySql 是通用的写法，我们对 SqlServer 做了特别适配，执行的 SQL 语句大致如下：

```sql
SELECT ... FROM [User] a With(UpdLock, RowLock, NoWait)
```

