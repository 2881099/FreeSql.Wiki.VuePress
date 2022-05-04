# Repository Layer

As an extension, FreeSql.Repository realizes the functions of the common DAL. There is a certain standard definition for the repository layer. FreeSql.Repository refers to the interface design of Abp vNext, defines and implements the basic repository layer for CURD operations.

## Features

- `Select/Attach`: Snapshot object, the corresponding `Update` only updates the changed fields.
- `Insert`: Insert data, adapt to each database to optimize execution `ExecuteAffrows`, `ExecuteIdentity` or `ExecuteInserted`;
- `InsertOrUpdate`: Insert or update data.
- `SaveMany`: Quickly save navigation objects (one-to-many, many-to-many).

## Install

Situation 1: .NET Core or .NET 5.0+
```bash
dotnet add package FreeSql.Repository
```

Situation 2、.NET Framework
```bash
Install-Package FreeSql.DbContext
```

## Declaring

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.Sqlite, connectionString)
    //Automatically synchronize the entity structure to the database.
    .UseAutoSyncStructure(true) 
    //Be sure to define as singleton mode
    .Build(); 

public class Song {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
}
```

## Usage

Method 1. The extension method of IFreeSql

```csharp
var curd = fsql.GetRepository<Song>();
```

> Note: Repository objects are not safe under multiple threads, so you should not operate them on multiple threads at the same time.
- Does not support using the same repository instance in different threads at the same time

Method 2. Inheritance

```csharp
public class SongRepository : BaseRepository<Song, int> {
    public SongRepository(IFreeSql fsql) : base(fsql, null, null) {}

    //Do something except CURD. 
}
```

Method 3: Dependency Injection

```csharp
public void ConfigureServices(IServiceCollection services) {
    
    services.AddSingleton<IFreeSql>(Fsql);
    services.AddFreeRepository(filter => filter
        .Apply<ISoftDelete>("SoftDelete", a => a.IsDeleted == false)
        .Apply<ITenant>("Tenant", a => a.TenantId == 1)
        ,
        this.GetType().Assembly
    );
}

//Use in the controller
public SongsController(IBaseRepository<Song> repos1) {
}
```

> Dependency injection can realize the global setting of **filtering and verification**, which is convenient for the design of tenant functions.

For more information: [《Filters and Global Filters》](Filters-and-Global-Filters)

## State Management

Only update the changed properties:

```csharp
var repo = fsql.GetRepository<Topic>();
var item = repo.Where(a => a.Id == 1).First();  //Take a snapshot of item at this time
item.Title = "newtitle";
repo.Update(item); //Compare with snapshots to get changes

//UPDATE `tb_topic` SET `Title` = @p_0
//WHERE (`Id` = 1)
```

Or further streamline:

```csharp
var repo = fsql.GetRepository<Topic>();
var item = new Topic { Id = 1 };
repo.Attach(item); //Take a snapshot of item at this time
item.Title = "newtitle";
repo.Update(item); //Compare with snapshots to get changes

//UPDATE `tb_topic` SET `Title` = @p_0
//WHERE (`Id` = 1)
```

## Filtering and Verification

Suppose we have two entities: `User` and `Topic`, and two repositories are defined in the domain class:

```csharp
var userRepository = fsql.GetGuidRepository<User>();
var topicRepository = fsql.GetGuidRepository<Topic>();
```

In practice, we always worry about the data security of `topicRepository`, that is, it is possible to query or change the topic of other users. Therefore, we have made improvements in the v0.0.7 version, adding the filter lambda expression parameter.

```csharp
var userRepository = fsql.GetGuidRepository<User>(a => a.Id == 1);
var topicRepository = fsql.GetGuidRepository<Topic>(a => a.UserId == 1);
```

* Attach this condition when querying/modifying/deleting, so that the data of other users will not be modified.
* When adding, use expressions to verify the legality of the data, if not legal, an exception will be thrown.

## Sharding Tables and Database

FreeSql provides a basic method of sharding tables through `AsTable`. As a distributed repository, and `GuidRepository` as a distributed storage, realizes the encapsulation of sharding tables and database (cross-server sharding-database is not supported).

```csharp
var logRepository = fsql.GetGuidRepository<Log>(null, oldname => $"{oldname}_{DateTime.Now.ToString("YYYYMM")}");
```

Above we got a log repository, which corresponds to the shareding-table by year and month. Using CURD operation will finally take effect in the `Log_201903` table.

Notice:

* Versions after v0.11.12 can use CodeFirst to migrate sharding tables.
* Do not use lazy loading in the entity type of sharding tables and database.

## Compatibility Problems

The `output inserted` feature provided by SqlServer. When the table uses auto-increment or the database defines a default value, use this feature to quickly return the inserted data. PostgreSQL also has similar functions, but not every database supports it. 

When a database that does not support this feature (Sqlite/MySql/Oracle/Damen/MsAccess) is used, and the entity uses auto-increment attributes, the batch insertion of the repository will be executed one by one. The following improvements can be considered:

* Use uuid as the primary key (ie Guid).
* Avoid using the default value function of the database.

## Cascade Saving

Please view the documentation of [Cascade Saving](Cascade-Saving).

## APIs

| Property         | Return                 | Description                                                                                           |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| EntityType       | Type                   | The entity type that the repository is operating. Note that it is not necessarily `TEntity`           |
| UnitOfWork       | IUnitOfWork            | Unit of work currently in use                                                                         |
| Orm              | IFreeSql               | ORM currently in use                                                                                  |
| DbContextOptions | DbContextOptions       | DbContext settings currently in use，modifying the DbContextOptions will not affect other repository. |
| DataFilter       | IDataFilter\<TEntity\> | Repository Filter, valid in this object                                                               |
| Select           | ISelect\<TEntity\>     | Prepare to query data                                                                                 |

| Method                                                  | Return  | Parameter              | Description                                                                                                                |
| ------------------------------------------------------- | ------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| AsType                                                  | void    | Type                   | Change the type of entity that the repository is operating                                                                 |
| Get                                                     | TEntity | TKey                   | Query data by the primary key                                                                                              |
| Find                                                    | TEntity | TKey                   | Query data by the primary key                                                                                              |
| Delete                                                  | int     | TKey                   | Delete data by the primary key                                                                                             |
| Delete | int | Lambda | Delete data by lambda conditions |
| Delete | int | TEntity | Query entity |
| Delete | int | IEnumerable\<TEntity\> | Delete data in bulk |
| DeleteCascadeByDatabase | List\<object\> | Lambda | Recursively delete data from the database according to navigation attributes |
| Insert | - | TEntity | Insert data, if the entity has an auto-increment column, the auto-increment after insertion will be filled into the entity |
| Insert | - | IEnumerable\<TEntity\> | Insert data in bulk |
| Update | - | TEntity | Update entity |
| Update | - | IEnumerable\<TEntity\> | Update data in bulk |
| InsertOrUpdate                                          | -       | TEntity                | Insert ot update data in bulk                                                                                              |
| FlushState                                              | -       | -                      | Clear status information                                                                                                   |
| Attach                                                  | -       | TEntity                | Attach entities to state management, which can be used to update or delete without querying                                |
| Attach                                                  | -       | IEnumerable\<TEntity\> | Batch attach entities to state management                                                                                  |
| AttachOnlyPrimary                                       | -       | TEntity                | Only attach the primary key data of the entity to the state management                                                     |
| [SaveMany](Cascade-Saving#many-to-many-cascade-saving)  | -       | TEntity, string        | Save the specified many-to-many or one-to-many navigation properties of the entity (full comparison)                       |
| [BeginEdit](Insert-or-Update#3-batch-editing-beginedit) | -       | List\<TEntity\>        | Start editing the data of a set of entities                                                                                |
| EndEdit                                                 | int     | -                      | After a set of data is edited, save it                                                                                     |

> State management can realize that `Update` only updates the changed fields (not all fields), and it is very comfortable to use `Attach` and `Update` flexibly.

## Reference

- [《FreeSql 101, Part 1: Insert Data》](Insert-Data)
- [《FreeSql 101, Part 2: Delete Data》](Delete-Data)
- [《FreeSql 101, Part 3: Update Data》](Update-Data)
- [《FreeSql 101, Part 4: Query Data》](Query-Data)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Tenant》](Tenant)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《AOP》](Aspect-Oriented-Programming)
- [《UnitOfWork》](Unit-of-Work)
- [《DbContext》](Batabase-Context)