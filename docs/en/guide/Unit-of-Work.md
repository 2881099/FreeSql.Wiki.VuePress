# Unit of Work

Unit of work can put multiple repositories into one unit for internal management and execution, and finally execute all operations through `Commit`. Unit of work internally uses database transactions.

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    //Automatically synchronize the entity structure to the database.
    .UseAutoSyncStructure(true) 
    //Be sure to define as singleton mode
    .Build(); 
```

## Usage

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
  var songRepo = fsql.GetRepository<Song>();
  var userRepo = fsql.GetRepository<User>();
  songRepo.UnitOfWork = uow; //Manually bind unit of work
  userRepo.UnitOfWork = uow;

  songRepo.Insert(new Song());
  userRepo.Update(...);

  uow.Orm.Insert(new Song()).ExecuteAffrows();
  //Note: uow.Orm and fsql are both IFreeSql
  //uow.Orm CRUD and uow are the same transaction (understood as temporary IFreeSql)
  //fsql CRUD and uow are not in the same transaction

  uow.Commit();
}
```

Reference: [Use TransactionalAttribute + UnitOfWorkManager in ASP.NET Core to achieve multiple transaction propagation](https://github.com/dotnetcore/FreeSql/issues/289)

## Interface Definition

The `uow.GetOrBeginTransaction()` method can get the transaction object.

```csharp
public interface IUnitOfWork : IDisposable
{
  /// <summary>
  /// The object Select/Delete/Insert/Update/InsertOrUpdate is consistent with the unit of work transaction and can be omitted to pass WithTransaction
  /// </summary>
  IFreeSql Orm { get; }

  /// <summary>
  /// Open the transaction, or return to the opened transaction
  /// </summary>
  /// <param name="isCreate">If the transaction is not opened, then open</param>
  /// <returns></returns>
  DbTransaction GetOrBeginTransaction(bool isCreate = true);

  IsolationLevel? IsolationLevel { get; set; }

  void Commit();

  void Rollback();

  /// <summary>
  /// Entity change tracking within the unit of work
  /// </summary>
  DbContext.EntityChangeReport EntityChangeReport { get; }
}
```

## Entity Changing Event

Global Settings:

```csharp
fsql.SetDbContextOptions(opt => {
  opt.OnEntityChange = report => {
    Console.WriteLine(report);
  };
});
```

Individual Settings:

```csharp
var uow = fsql.CreateUnitOfWork();
uow.OnEntityChange = report => {
  Console.WriteLine(report);
};
```

The parameter `report` is a list collection, and the type of the collection elements is defined as follows:

```csharp
public class ChangeInfo {
  public object Object { get; set; }
  public EntityChangeType Type { get; set; }
  /// <summary>
  /// When Type = Update, get the object before the update
  /// </summary>
  public object BeforeObject { get; set; }
}
public enum EntityChangeType { Insert, Update, Delete, SqlRaw }
```

| Type of Change | Description                   |
| -------------- | ----------------------------- |
| Insert         | The entity object is inserted |
| Update         | The entity object is updated  |
| Delete         | The entity object is deleted  |
| SqlRaw         | SQL statement executed        |

SqlRaw currently has two special features:
- When the navigation properties are updated in the many-to-many cascade, delete the relevant data in the intermediate table.
- The common repository `BaseRepository` has a Delete method, and the parameter is an expression, not an entity.

```csharp
int Delete(Expression<Func<TEntity, bool>> predicate);
```

`DbContext.SaveChanges` or Repository's Insert/Update/Delete method of the entity, or `UnitOfWork.Commit` operation will trigger this event at most once.

## Reference

- [《Tenant》](Tenant)
- [《Using Read/Write Separation》](Using-Read-Write-Separation)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《AOP》](Aspect-Oriented-Programming)
- [《DbContext》](Batabase-Context)