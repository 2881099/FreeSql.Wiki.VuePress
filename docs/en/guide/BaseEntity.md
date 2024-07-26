# Introduction

Having tried ado.net, dapper, ef, and the Repository pattern, and even writing my own generator tools for common CRUD operations, I've encountered some inconveniences:

- Each time before use, it needs to be declared and then operated on.
- Many people have one operation class (or DAL, DbContext, Repository) for each entity class.

This document introduces a minimalist CRUD operation approach using `BaseEntity`.

## Features

- Automatic migration of entity structure (CodeFirst) to the database.
- Direct CRUD operations using entity methods.
- Simplified entity type definition, eliminating the need to configure primary keys and common fields (such as `CreateTime`, `UpdateTime`).
- Implements soft delete logic for single-table and multi-table queries.

## Declaration

Refer to the `BaseEntity.cs` source code (about 100 lines), copy it into your project, and then add the NuGet packages:

> `dotnet add package FreeSql.DbContext`

> `dotnet add package FreeSql.Provider.Sqlite`

1. Define an entity type with an `int` primary key that is auto-incremented. When `BaseEntity<TKey>` is specified as `int/long`, it will assume the primary key is auto-incremented:

```csharp
public class UserGroup : BaseEntity<UserGroup, int> {
    public string GroupName { get; set; }
}
```

If you do not want the primary key to be auto-incremented, you can override the property:

```csharp
public class UserGroup : BaseEntity<UserGroup, int> {
    [Column(IsIdentity = false)]
    public override int Id { get; set; }
    public string GroupName { get; set; }
}
```

> For more entity attribute configurations, see [Entity Attributes](entity-attribute)

2. Define an entity type with a `Guid` primary key. The Guid value will be automatically generated and ordered, so you don't need to specify `Guid.NewGuid()` yourself:

```csharp
public class User : BaseEntity<UserGroup, Guid> {
    public string UserName { get; set; }
}
```

3. Define an entity type with multiple primary keys. You can override the field names in the static constructor:

```csharp
public class User2 : BaseEntity<User2, Guid, int> {
    static User2()
    {
        User2.Orm.CodeFirst.ConfigEntity<User2>(t =>
        {
            t.Property(a => a.PkId1).Name("UserId");
            t.Property(a => a.PkId2).Name("Index");
        });
    }

    public string Username { get; set; }
}
```

## CRUD Operations

```csharp
// Add
var item = new UserGroup { GroupName = "Group One" };
item.Insert();

// Update
item.GroupName = "Group Two";
item.Update();

// Add or Update
item.Save();

// Soft Delete
item.Delete();

// Restore Soft Deleted
item.Restore();

// Get object by primary key
var item = UserGroup.Find(1);

// Query Data
var items = UserGroup.Where(a => a.Id > 10).ToList();
```

`EntityType.Select` is a query object and operates similarly to `FreeSql.ISelect`.

When performing multi-table queries, the soft delete condition will be appended to each table.

> For more query methods, refer to [Queries](select)

Example project: [https://github.com/dotnetcore/FreeSql/tree/master/Examples/base_entity](https://github.com/dotnetcore/FreeSql/tree/master/Examples/base_entity)