# UnitOfWork

UnitOfWork 是对 DbTransaction 事务对象的封装，方便夹带私有数据。

## 如何使用

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
    await uow.Orm.Insert(item).ExecuteAffrowsAsync(); //uow.Orm API 和 IFreeSql 一样
    await uow.Orm.Ado.ExecuteNoneQueryAsync(sql);

    await fsql.Insert(item)... //错误，不在一个事务

    var repo1 = uow.GetRepository<Song>();
    await repo1.InsertAsync(item);

    uow.Commit();
}
```

> 提示：uow 范围内，尽量别使用 fsql 对象，以免不处在一个事务

依赖注入（参考）：[在 asp.net core 中使用 TransactionalAttribute + UnitOfWorkManager 实现多种事务传播](unitofwork-manager.md)

## 外部事务

```csharp
// 场景：已经有一个开启的 Connection 和 Transaction
using (var conn = new Microsoft.Data.SqlClient.SqlConnection("..."))
{
    conn.Open();
    using (var tran = conn.BeginTransaction())
    {
        // 1. 原生/Dapper 操作
        // command.Transaction = tran;
        // command.ExecuteNonQuery();

        // 2. 桥接给 FreeSql
        // 使用扩展方法创建适配器，传入现有的 tran
        using (var uow = fsql.CreateUnitOfWork(tran)) 
        {
            // 在此 uow 下获取的仓储或 Orm，都会使用传入的 tran
            var repo = uow.GetRepository<MyEntity>();
            repo.Insert(new MyEntity { Name = "FreeSql Insert" });
            
            // 或者直接使用 Orm
            uow.Orm.Insert(new MyEntity { Name = "Direct Orm Insert" }).ExecuteAffrows();

            // 这里的 Commit 只会触发 FreeSql 的事件，不会提交物理事务
            uow.Commit(); 
        }

        // 3. 真正的提交由最外层控制
        tran.Commit();
    }
}
```

## 接口定义

uow.GetOrBeginTransaction() 方法可获取事务对象。

```csharp
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// 该对象 Select/Delete/Insert/Update/InsertOrUpdate 与工作单元事务保持一致，可省略传递 WithTransaction
    /// </summary>
    IFreeSql Orm { get; }

    DbTransaction GetOrBeginTransaction(bool isCreate = true);

    IsolationLevel? IsolationLevel { get; set; }

    void Commit();

    void Rollback();

    /// <summary>
    /// 工作单元内的实体变化跟踪
    /// </summary>
    DbContext.EntityChangeReport EntityChangeReport { get; }

    /// <summary>
    /// 用户自定义的状态数据，便于扩展
    /// </summary>
    Dictionary<string, object> States { get; }
}
```

## 实体变化事件

全局设置：

```csharp
fsql.SetDbContextOptions(opt =>
{
    opt.OnEntityChange = report =>
    {
        Console.WriteLine(report);
    };
});
```

单独设置：

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
    uow.OnEntityChange = report =>
    {
        Console.WriteLine(report);
    };
}
```

参数 report 是一个 List 集合，集合元素的类型定义如下：

```csharp
public class ChangeInfo
{
    public object Object { get; set; }
    public EntityChangeType Type { get; set; }
    /// <summary>
    /// Type = Update 的时候，获取更新之前的对象
    /// </summary>
    public object BeforeObject { get; set; }
}
public enum EntityChangeType { Insert, Update, Delete, SqlRaw }
```

| 变化类型 | 说明            |
| -------- | --------------- |
| Insert   | 实体对象被插入  |
| Update   | 实体对象被更新  |
| Delete   | 实体对象被删除  |
| SqlRaw   | 执行了 SQL 语句 |

SqlRaw 目前有两处地方比较特殊：

- 多对多联级更新导航属性的时候，对中间表的全部删除操作；
- 通用仓储类 BaseRepository 有一个 Delete 方法，参数为表达式，而并非实体；

```csharp
int Delete(Expression<Func<TEntity, bool>> predicate);
```

Repository 对实体的 Insert/Update/Delete，或者 UnitOfWork.Commit 操作都会最多触发一次该事件。
