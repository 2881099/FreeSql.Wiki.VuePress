# Navigation Properties

FreeSql offers six types of navigation properties: OneToMany, ManyToOne, ManyToMany, OneToOne, Parent, and [PgArrayToMany](https://www.cnblogs.com/FreeSql/p/16351417.html).

What can navigation properties do?

- [Multi-table Queries](select-multi-table.md) `Where(a => a.Parent.Parent.Name == "xx")` `Where(a => a.Childs.Any(b => b.title == "xxx"))`
- [Eager Loading](select-include.md) `Include/IncludeMany`
- [Lazy Loading](select-lazy-loading.md)
- [Tree Table Queries](select-as-tree.md)
- [Cascade Saving](cascade-saving.md)
- [Cascade Deletion](cascade-delete.md)
- [Aggregate Root Repository](aggregateroot.md)

Navigation properties make multi-table queries very convenient, allowing direct use of navigation objects with lambda expressions—so comfortable!

## Custom Configuration

Types supported by OneToMany/ManyToMany: `ICollection<T>`, `List<T>`, `ObservableCollection<T>`

```csharp
//OneToMany
class Group
{
    [Navigate(nameof(User.GroupId))]
    public List<User> Users { get; set; }
    //Links GroupId in User to the primary key of this entity
}

//ManyToOne
class User
{
    public int GroupId { get; set; }
    [Navigate(nameof(GroupId))]
    public Group Group { get; set; }
    //Links GroupId in this entity to the primary key of Group
}

//ManyToMany
[Navigate(ManyToMany = typeof(TagSong))]
public List<Tag> Items { get; set; }
```

---

You can also use Fluent API to set navigation relationships externally:

```csharp
fsql.CodeFirst.ConfigEntity<T>(a => a
    .Navigate(b => b.roles, null, typeof(TMid))
    .Navigate(b => b.users, "uid")
);
```

> Note:

1. Navigation properties will be invalid if the property is set with `Column(IsIgnore = true)`.
2. The strings set in `Navigate` are class property names, not table column names!

> Pre-warming Note: Due to the need to resolve circular references, navigation property configuration may fail on first use when relationships are complex. It should succeed on the second attempt. A solution is to pre-warm all entity classes at application startup by executing `fsql.Select<object>().AsType(EntityClass);` in a loop.

## Non-Primary Key Associations

```csharp
//OneToMany
[Navigate(nameof(User.GroupId), TempPrimary = nameof(Code))]
public List<User> Users { get; set; }

//ManyToOne
[Navigate(nameof(GroupId), TempPrimary = nameof(Group.Code))]
public Group Group { get; set; }
```

Non-primary key associations are supported for OneToMany/ManyToOne relationships and are only effective during queries (not supported for cascade saving or cascade deletion).

## Checking Navigation Properties

To check if a navigation property is valid:

```csharp
var tbref = fsql.CodeFirst
    .GetTableByEntity(typeof(T))
    .GetTableRef("Children", true);
```

`GetTableRef(string propertyName, bool isThrow);`

## OneToOne

```csharp
class User
{
    [Key]
    public int Id { get; set; }
    [Navigate(nameof(Id))]
    public UserExt Ext { get; set; }
    //...
}
class UserExt
{
    [Key]
    public int UserId { get; set; }
    [Navigate(nameof(UserId))]
    public User User { get; set; }
    //...
}
```

In a one-to-one relationship, both sides must use the `Navigate` attribute with the entity's **primary key** (supports cascade saving and cascade deletion).

## PgArrayToMany

```csharp
class User
{
    public int[] RoleIds { get; set; }
    [Navigate(nameof(RoleIds))]
    public List<Role> Roles { get; set; }
}
class Role
{
    public int Id { get; set; }
    [Navigate(nameof(User.RoleIds))]
    public List<User> Users { get; set; }
}
```

More information: [#1145](https://github.com/dotnetcore/FreeSql/issues/1145)

## Convention Naming (No Need to Specify Navigate)

Tip: This section is for general understanding; not mandatory knowledge. You can skip it if needed.

```csharp
class Group
{
    public int Id { get; set; } // Id, GroupId, Group_id

    public List<User> AUsers { get; set; }
    public List<User> BUsers { get; set; }

    public int ParentId { get; set; } // ParentId, Parent_id
    public Group Parent { get; set; }

    public List<Group> Childs { get; set; }
}
class User
{
    public int Id { get; set; } // Id, UserId, User_id
    public UserExt Ext { get; set; }

    public int AGroupId { get; set; }
    public Group AGroup { get; set; }

    public int BGroupId { get; set; }
    public Group BGroup { get; set; }

    public List<Role> Roles { get; set; }
}
class UserExt
{
    public int UserId { get; set; }
    public User User { get; set; }
}
class Role
{
    public int Id { get; set; }
    public string Name { get; set; }

    public List<User> Users { get; set; }
}
class UserRole
{
    public int UserId { get; set; }
    public User User { get; set; }

    public int RoleId { get; set; }
    public Role Role { get; set; }
}
```
