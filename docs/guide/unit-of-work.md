# UnitOfWork

UnitOfWork 可将多个仓储放在一个单元管理执行，最终通用 Commit 执行所有操作，内部采用了数据库事务；

```csharp
var connstr = "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;" + 
  "Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10";

static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
  .UseConnectionString(FreeSql.DataType.MySql, connstr)
  .UseAutoSyncStructure(true) //自动同步实体结构到数据库
  .Build(); //请务必定义成 Singleton 单例模式
```

## 如何使用

```csharp
using (var uow = fsql.CreateUnitOfWork()) {
  var songRepo = fsql.GetRepository<Song>();
  songRepo.UnitOfWork = uow;
  var userRepo = fsql.GetRepository<User>();
  userRepo.UnitOfWork = uow;

  songRepo.Insert(new Song());
  userRepo.Update(...);

  uow.Commit();
}
```

参考：[在 asp.net core 中使用 TransactionalAttribute + UnitOfWorkManager 实现多种事务传播](https://github.com/dotnetcore/FreeSql/issues/289)

## 接口定义

uow.GetOrBeginTransaction() 方法可获取事务对象。

```csharp
public interface IUnitOfWork : IDisposable {

  DbTransaction GetOrBeginTransaction(bool isCreate = true);

  IsolationLevel? IsolationLevel { get; set; }

  /// <summary>
  /// 是否启用工作单元
  /// </summary>
  bool Enable { get; }

  void Commit();

  void Rollback();

  /// <summary>
  /// 禁用工作单元
  /// <exception cref="Exception"></exception>
  /// <para></para>
  /// 若已开启事务（已有Insert/Update/Delete操作），调用此方法将发生异常，建议在执行逻辑前调用
  /// </summary>
  void Close();

  /// <summary>
  /// 开启工作单元
  /// </summary>
  void Open();

  /// <summary>
  /// 此工作单元内的实体变化跟踪
  /// </summary>
  DbContext.EntityChangeReport EntityChangeReport { get; }
}
```

## 实体变化事件

全局设置：

```csharp
fsql.SetDbContextOptions(opt => {
  opt.OnEntityChange = report => {
    Console.WriteLine(report);
  };
});
```

单独设置：

```csharp
var uow = fsql.CreateUnitOfWork();
uow.OnEntityChange = report => {
  Console.WriteLine(report);
};
```

参数 report 是一个 List 集合，集合元素的类型定义如下：

```csharp
public class ChangeInfo {
  public object Object { get; set; }
  public EntityChangeType Type { get; set; }
  /// <summary>
  /// Type = Update 的时候，获取更新之前的对象
  /// </summary>
  public object BeforeObject { get; set; }
}
public enum EntityChangeType { Insert, Update, Delete, SqlRaw }
```

| 变化类型 | 说明           |
| -------- | -------------- |
| Insert   | 实体对象被插入 |
| Update   | 实体对象被更新 |
| Delete   | 实体对象被删除 |
| SqlRaw   | 执行了SQL语句  |

SqlRaw 目前有两处地方比较特殊：
- 多对多联级更新导航属性的时候，对中间表的全部删除操作；
- 通用仓储类 BaseRepository 有一个 Delete 方法，参数为表达式，而并非实体；
```csharp
int Delete(Expression<Func<TEntity, bool>> predicate);
```

DbContext.SaveChanges，或者 Repository 对实体的 Insert/Update/Delete，或者 UnitOfWork.Commit 操作都会最多触发一次该事件。
