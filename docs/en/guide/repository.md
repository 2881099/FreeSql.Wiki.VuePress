---
title: Repository
tag:
  - Repository
---

`FreeSql.DbContext` references the abp vnext interface specification and implements a generic repository layer functionality (CURD), which can be understood as an enhanced version of traditional Data Access Layer (DAL).

::: code-tabs

@tab:active .NET CLI

```bash
 dotnet add package FreeSql.DbContext
```

@tab .NET Framework

```bash
Install-Package FreeSql.DbContext
```

:::

- Select/Attach snapshot objects, Update only changes modified fields;
- Insert data, optimized execution with ExecuteAffrows/ExecuteIdentity/ExecuteInserted across various databases;
- Cascade save and cascade delete (one-to-one, one-to-many, many-to-many);
- Repository + Unit of Work design pattern, simple and unified style;

```csharp
public class Song
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
}
```

> Note: Repository objects are not thread-safe, so they should not be used concurrently across multiple threads.

## Temporary Usage

```csharp
var curd = fsql.GetRepository<Song>();
```

> Suitable for creating repositories temporarily in local code and disposing of them when done.

## Generic Repository (Dependency Injection)

Method 2: Generic Repository + Dependency Injection (.NET Core);

```csharp
// First, refer to the entry documentation to inject IFreeSql
services.AddFreeRepository();

// Use generic repository in the controller
public SongsController(IBaseRepository<Song> songRepository)
{
}
```

## Inherited Repository (Dependency Injection)

```csharp
// First, refer to the entry documentation to inject IFreeSql
services.AddFreeRepository(typeof(SongRepository).Assembly); // No need to pass the second parameter if no inherited repositories

// Use inherited repositories
public SongsController(SongRepository repo1, TopicRepository repo2)
{
}

public class SongRepository : BaseRepository<Song>
{
    public SongRepository(IFreeSql fsql) : base(fsql) {}

    // Add additional methods beyond CURD here
}
```

## Update Comparison

Only update changed properties:

```csharp
var repo = fsql.GetRepository<Topic>();
var item = repo.Where(a => a.Id == 1).First();  // Snapshot item at this point
item.Title = "newtitle";
repo.Update(item); // Compare changes from snapshot
// UPDATE `tb_topic` SET `Title` = ?p_0
// WHERE (`Id` = 1)
```

Does it seem cumbersome to query first and then update?

```csharp
var repo = fsql.GetRepository<Topic>();
var item = new Topic { Id = 1 };
repo.Attach(item); // Snapshot item at this point
item.Title = "newtitle";
repo.Update(item); // Compare changes from snapshot
// UPDATE `tb_topic` SET `Title` = ?p_0
// WHERE (`Id` = 1)
```

`repo.CompareState(item)` can retrieve the status change information of `item`.

```csharp
/// <summary>
/// Compare entities and calculate properties that have changed values, as well as the old and new values of these properties.
/// </summary>
/// <param name="newdata">The latest entity object, which will be compared with the attached entity's state.</param>
/// <returns>key: property name, value: [old value, new value]</returns>
Dictionary<string, object[]> CompareState(TEntity newdata);
```

## Login Information (Dependency Injection)

`repo.DbContextOptions.AuditValue` is suitable for integration with AddScoped (Dependency Injection) to uniformly set login information.

Example: Automatically use login information when inserting/updating with repository

```csharp
services.AddSingleton(fsql);
services.AddScoped(typeof(IBaseRepository<>), typeof(MyRepository<>));
services.AddScoped(typeof(IBaseRepository<,>), typeof(MyRepository<,>));
services.AddScoped(r => new MyRepositoryOptions
{
    AuditValue = e => {
        var user = r.GetService<User>();
        if (user == null) return;
        if (e.AuditValueType == AuditValueType.Insert &&
            e.Object is IEntityCreated obj1 && obj1 != null) {
            obj1.CreatedUserId = user.Id;
            obj1.CreatedUserName = user.Username;
        }
        if (e.AuditValueType == AuditValueType.Update &&
            e.Object is IEntityModified obj2 && obj2 != null) {
            obj2.ModifiedUserId = user.Id;
            obj2.ModifiedUserName = user.Username;
        }
    }
});

class MyRepository<TEntity, TKey> : BaseRepository<TEntity, TKey> where TEntity : class
{
    public MyRepository(IFreeSql fsql, MyRepositoryOptions options) : base(fsql)
    {
        if (options?.AuditValue != null) DbContextOptions.AuditValue += (_, e) => options.AuditValue(e);
    }
}
class MyRepository<TEntity> : MyRepository<TEntity, long> where TEntity : class
{
    public MyRepository(IFreeSql fsql, MyRepositoryOptions options) : base(fsql, options) { }
}
class MyRepositoryOptions
{
    public Action<DbContextAuditValueEventArgs> AuditValue { get; set; }
}
```

## Compatibility Issues

The `output inserted` feature provided by SqlServer allows quick retrieval of inserted data when tables use auto-increment or default values defined in the database. PostgreSQL also has similar functionality, which is convenient but not supported by every database.

When using databases that do not support this feature (Sqlite/MySql/Oracle/Dameng/Nandasoft/MsAccess), and entities use auto-increment properties, batch inserts in the repository will be executed one by one. Consider the following improvements:

- Use UUID as the primary key (i.e., Guid);
- Avoid using default value functionality in the database;

## Cascade Save

Please refer to the document [《Cascade Save》](cascade-saving)

## API

| Property          | Return Value            | Description                                      |
| ----------------- | ------------------------ | ------------------------------------------------ |
| EntityType        | Type                     | The entity type the repository is currently operating on, note that it may not be TEntity |
| UnitOfWork        | IUnitOfWork              | The unit of work currently in use               |
| Orm               | IFreeSql                 | The ORM currently in use                        |
| DbContextOptions  | DbContextOptions         | The DbContext settings currently in use, changes to these settings do not affect others |
| UpdateDiy         | IUpdate\<TEntity\>       | Preparing to update data, in the same transaction as the repository |
| Select            | ISelect\<TEntity\>       | Preparing to query data                          |

| Method                                                                                     | Return Value   | Parameters             | Description                                            |
| ------------------------------------------------------------------------------------------ | -------------- | ---------------------- | ------------------------------------------------------ |
| AsType                                                                                     | void           | Type                   | Change the entity type the repository is currently operating on |
| Get                                                                                        | TEntity        | TKey                   | Query data by primary key                             |
| Find                                                                                       | TEntity        | TKey                   | Query data by primary key                             |
| Delete                                                                                     | int            | TKey                   | Delete data by primary key                            |
| Delete                                                                                     | int            | Lambda                 | Delete data based on lambda conditions                |
| Delete                                                                                     | int            | TEntity                | Delete data                                           |
| Delete                                                                                     | int            | IEnumerable\<TEntity\> | Batch delete data                                     |
| [DeleteCascadeByDatabase](cascade-delete)                   | List\<object\> | Lambda                 | Recursively delete data by navigation properties      |
| Insert                                                                                     | -              | TEntity                | Insert data, if the entity has auto-increment columns, the auto-increment value will be filled into the entity after insertion |
| Insert                                                                                     | -              | IEnumerable\<TEntity\> | Batch insert data                                     |
| Update                                                                                     | -              | TEntity                | Update data                                           |
| Update                                                                                     | -              | IEnumerable\<TEntity\> | Batch update data                                     |
| InsertOrUpdate                                                                             | -              | TEntity                | Insert or update data                                |
| FlushState                                                                               | -              | None                   | Clear state management data                          |
| Attach                                                                                     | -              | TEntity                | Attach entity to state management, used for updating or deleting without querying |
| Attach                                                                                     | -              | IEnumerable\<TEntity\> | Batch attach entities to state management            |
| AttachOnlyPrimary                                                                          | -              | TEntity                | Attach only primary key data of entity to state management |
| [BeginEdit](insert-or-update#_4-table-beginedit) | -              | List\<TEntity\>        | Prepare to edit a list of entities                    |
| EndEdit                                                                                    | int            | None                   | Complete editing data and perform save actions       |

> State management allows Update to only update changed fields (not all fields), and using Attach and Update is very comfortable.