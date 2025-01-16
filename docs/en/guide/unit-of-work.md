# UnitOfWork

UnitOfWork is a wrapper around the `DbTransaction` transaction object, facilitating the management of private data.

## How to Use

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
    await uow.Orm.Insert(item).ExecuteAffrowsAsync(); //uow.Orm API is the same as IFreeSql
    await uow.Orm.Ado.ExecuteNoneQueryAsync(sql);

    await fsql.Insert(item)... //Error, not within the same transaction

    var repo1 = uow.GetRepository<Song>();
    await repo1.InsertAsync(item);

    uow.Commit();
}
```

> Tip: Within the `uow` scope, try not to use the `fsql` object to avoid being in different transactions.

Dependency Injection (Reference): [Implementing Various Transaction Propagation with TransactionalAttribute + UnitOfWorkManager in ASP.NET Core](unitofwork-manager.md)

## Interface Definition

The `uow.GetOrBeginTransaction()` method can retrieve the transaction object.

```csharp
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// This object’s Select/Delete/Insert/Update/InsertOrUpdate will be consistent with the unit of work transaction; WithTransaction can be omitted.
    /// </summary>
    IFreeSql Orm { get; }

    DbTransaction GetOrBeginTransaction(bool isCreate = true);

    IsolationLevel? IsolationLevel { get; set; }

    void Commit();

    void Rollback();

    /// <summary>
    /// Entity change tracking within the unit of work
    /// </summary>
    DbContext.EntityChangeReport EntityChangeReport { get; }

    /// <summary>
    /// User-defined state data for extension
    /// </summary>
    Dictionary<string, object> States { get; }
}
```

## Entity Change Events

Global Settings:

```csharp
fsql.SetDbContextOptions(opt =>
{
    opt.OnEntityChange = report =>
    {
        Console.WriteLine(report);
    };
});
```

Individual Settings:

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
    uow.OnEntityChange = report =>
    {
        Console.WriteLine(report);
    };
}
```

The `report` parameter is a List collection, with the element types defined as follows:

```csharp
public class ChangeInfo
{
    public object Object { get; set; }
    public EntityChangeType Type { get; set; }
    /// <summary>
    /// When Type = Update, get the object before the update
    /// </summary>
    public object BeforeObject { get; set; }
}
public enum EntityChangeType { Insert, Update, Delete, SqlRaw }
```

| Change Type | Description            |
| ----------- | ---------------------- |
| Insert      | Entity object inserted |
| Update      | Entity object updated  |
| Delete      | Entity object deleted  |
| SqlRaw      | SQL statement executed |

`SqlRaw` currently has two special cases:

- When updating navigation properties in a many-to-many relationship, all delete operations on the junction table.
- The generic repository class `BaseRepository` has a `Delete` method, with a parameter as an expression rather than an entity:

```csharp
int Delete(Expression<Func<TEntity, bool>> predicate);
```

`Repository` operations for entity `Insert/Update/Delete`, or `UnitOfWork.Commit` operations will trigger this event at most once.
