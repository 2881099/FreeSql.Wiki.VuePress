# FreeSql 如何实现审计日志

有两种情况，如果都是针对实体操作，确实很好做这个功能。

IFreeSql 更新/删除，都可以不传实体进行操作，所以这个 old_values, new_values 实现起来比较麻烦（可能需要查询一次？性能？）。另外还有批量操作。

## 1、fsql.Aop.CrudAfter 事件是 CRUD 之后触发，提供以下参数

```csharp
/// <summary>
/// 标识符，可将 CurdBefore 与 CurdAfter 进行匹配
/// </summary>
public Guid Identifier { get; protected set; }
protected Stopwatch Stopwatch { get; }
/// <summary>
/// 操作类型
/// </summary>
public CurdType CurdType { get; } //Select, Delete, Update, Insert, InsertOrUpdate
/// <summary>
/// 实体类型
/// </summary>
public Type EntityType { get; }
/// <summary>
/// 实体类型的元数据
/// </summary>
public TableInfo Table { get; }
/// <summary>
/// 执行的 SQL
/// </summary>
public string Sql { get; }
/// <summary>
/// 参数化命令
/// </summary>
public DbParameter[] DbParms { get; }

/// <summary>
/// 发生的错误
/// </summary>
public Exception Exception { get; }
/// <summary>
/// 执行SQL命令，返回的结果
/// </summary>
public object ExecuteResult { get; }
/// <summary>
/// 耗时（单位：Ticks）
/// </summary>
public long ElapsedTicks => this.Stopwatch.ElapsedTicks;
/// <summary>
/// 耗时（单位：毫秒）
/// </summary>
public long ElapsedMilliseconds => this.Stopwatch.ElapsedMilliseconds;
```

## 2、FreeSql.DbContext 或者 FreeSql.UnitOfWork 提供对象变化跟踪

全局设置：

```csharp
fsql.SetDbContextOptions(opt => {
  opt.OnEntityChange = report => {
    Console.WriteLine(report);
  };
});
```

单独设置 DbContext 或者 UnitOfWork：

```csharp
var ctx = fsql.CreateDbContext();
ctx.Options.OnEntityChange = report => {
  Console.WriteLine(report);
};

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

| 变化类型 | 说明 |
| -- | -- |
| Insert | 实体对象被插入 |
| Update | 实体对象被更新 |
| Delete | 实体对象被删除 |
| SqlRaw | 执行了SQL语句 |

SqlRaw 目前有两处地方比较特殊：

- 多对多联级更新导航属性的时候，对中间表的全部删除操作；
- 通用仓储类 BaseRepository 有一个 Delete 方法，参数为表达式，而并非实体；

```csharp
int Delete(Expression<Func<TEntity, bool>> predicate);
```

DbContext.SaveChanges，或者 Repository 对实体的 Insert/Update/Delete，或者 UnitOfWork.Commit 操作都会最多触发一次该事件。
