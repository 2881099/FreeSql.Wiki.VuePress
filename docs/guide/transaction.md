# 事务Transaction



## ASP.NET Core AOP 事务

- [AOP + FreeSql 基于特性标签实现跨方法异步事务](unitofwork-manager.md)

## 1、UnitOfWork 事务

提示：工作单元依赖 FreeSql.DbContext.dll，后面 fsql.Transaction 同线程事务内置无依赖。

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
  var songRepo = fsql.GetRepository<Song>();
  var userRepo = fsql.GetRepository<User>();
  songRepo.UnitOfWork = uow; //手工绑定工作单元
  userRepo.UnitOfWork = uow;

  songRepo.Insert(new Song());
  userRepo.Update(...);

  uow.Orm.Insert(new Song()).ExecuteAffrows();
  //注意：uow.Orm 和 fsql 都是 IFreeSql
  //uow.Orm CRUD 与 uow 是一个事务（理解为临时 IFreeSql）
  //fsql CRUD 与 uow 不在一个事务

  uow.Commit();
}
```

## 2、同线程事务

同线程事务，由 fsql.Transaction 管理事务提交回滚（缺点：不支持异步），比较适合 WinForm/WPF UI 主线程使用事务的场景。

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

## 5、更新排他锁

```csharp
var user = fsql.Select<User>().ForUpdate(true).Where(a => a.Id == 1).ToOne();
//SELECT ... FROM User a for update nowait
```

for update 在 Oracle/PostgreSQL/MySql 是通用的写法，我们对 SqlServer 做了特别适配，执行的 SQL 语句大致如下：

```sql
SELECT ... FROM [User] a With(UpdLock, RowLock, NoWait)
```

## 6、示范代码

```csharp
//使用 全局线程事务
fsql.Transaction(() =>
{
    fsql.Insert(new Products()).ExecuteAffrows();
    fsql.Insert(new Products()).ExecuteAffrows();
});


//使用 UnitOfWork 事务
using (var uow = fsql.CreateUnitOfWork())
{
    var repo = uow.GetRepository<Products>();
    repo.Insert(new Products());

    uow.Orm.Insert(new Products()).ExecuteAffrows(); //正常
    fsql.Insert(new Products()).ExecuteAffrows(); //错误，没有传事务
    fsql.Insert(new Products()).WithTransaction(uow.GetOrBeginTransaction()).ExecuteAffrows(); //正常

    uow.Commit();
}


//使用 DbContext 事务
using (var ctx = fsql.CreateDbContext())
{
    ctx.Add(new Products());

    ctx.Orm.Insert(new Products()).ExecuteAffrows(); //正常
    fsql.Insert(new Products()).ExecuteAffrows(); //错误，没有传事务
    fsql.Insert(new Products()).WithTransaction(ctx.UnitOfWork.GetOrBeginTransaction()).ExecuteAffrows(); //正常

    ctx.SaveChanges();
}


//使用 UnitOfWorkManager 管理类事务
using (var uowManager = new UnitOfWorkManager(fsql))
{
    using (var uow = uowManager.Begin())
    {
        uow.Orm.Insert(new Products()).ExecuteAffrows(); //正常
        fsql.Insert(new Products()).ExecuteAffrows(); //错误，没有传事务
        fsql.Insert(new Products()).WithTransaction(uow.GetOrBeginTransaction()).ExecuteAffrows(); //正常

        using (var uow2 = uowManager.Begin()) //与 uow 同一个事务
        {
            var repo1 = fsql.GetRepository<Products>();
            repo1.UnitOfWork = uow2;
            repo1.Insert(new Products());

            uow2.Commit(); //事务还未提交
        }

        uow.Commit(); //事务提交
    }
}
```

- IFreeSql Curd 方法若不是使用同线程事务，需要指定 WithTransaction 传入事务；
- IUnitOfWork Orm 与工作单元事务一致；
- FreeSql.IBaseRepository curd 方法需要指定 UnitOfWork 传递工作单元事务；
- FreeSql.DbContext 自带事务；
- UnitOfWorkManager 适合做跨方法事务；

[扩展阅读 1：IFreeSql 事务另类玩法，理解上面各种事务场景之后再看会更佳](https://github.com/dotnetcore/FreeSql/issues/322)

[扩展阅读 2：对以上各种事务的理解及演变](https://www.cnblogs.com/kellynic/p/13551855.html)
