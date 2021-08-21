# Entity Relationship

Navigation properties are one of FreeSql's characteristic functions, which can be configured by agreement or customized configuration of the relationship between objects.

Navigation properties have five configuration relationships: OneToMany, ManyToOne, ManyToMany, OneToOne, and Parent.

With navigation properties, multi-table query is very convenient. Directly using navigation objects in lambda expressions can get the IDE's BUFF blessing.

- Naming convention,or not (need to specify Navigate attribute association);
- If there is no association relationship, you can specify the `On` condition when querying, `LeftJoin(a => a.Parent.Id == a.ParentId)`;
- If there is an association relationship, just use the navigation object directly, and the `On` condition will be automatically attached;

[《What problems can navigation properties solve?》](https://www.cnblogs.com/kellynic/p/13575053.html)

## Custom Navigation Relationship

```csharp
//Navigation properties, OneToMany
[Navigate(nameof(song_tag.song_id))]
public virtual List<song_tag> Obj_song_tag { get; set; }
//Find the song_id property in song_tag and associate it with this ENTITY.PrimaryKey

//Navigation properties, ManyToOne/OneToOne
[Navigate(nameof(song_id))]
public virtual Song Obj_song { get; set; }
//Find the song_id property in THIS ENTITY and associate it with the Song.PrimaryKey

//Navigation properties, ManyToMany
[Navigate(ManyToMany = typeof(tag_song))]
public virtual List<tag> tags { get; set; }
```

---

You can also use FluentApi to set the navigation relationship externally:

```csharp
fsql.CodeFirst.ConfigEntity<YOUR_ENTITY>(a => a
    .Navigate(b => b.roles, null, typeof(MANY_TO_MANY_MID_ENTITY))
    .Navigate(b => b.users, "uid")
);
```

Priority: Attribute> FluentApi

> Note:

1. Set `Column(IsIgnore = true)` on Property, then the navigation property will be invalid

2. The string set by Navigate is the property name of the type, NOT THE TABLE IR FIELD NAME.

## Detect Navigation Properties

How to detect whether a navigation property is configured to take effect:

```csharp
var tbref = fsql.CodeFirst
    .GetTableByEntity(typeof(T))
    .GetTableRef("Children", true);
```

Method signature:

```
GetTableRef(string propertyName, bool isThrow);
```


## Naming convention (no need to specify Navigate)

### One-to-One

```csharp
class User {
    public int Id { get; set; } //Id、UserId、User_id

    public UserExt UserExt { get; set; }
}

class UserExt {
    public int id { get; set; } //Id、UserId、User_id、UserExtId、UserExt_id

    public User User { get; set; }
}
```

[《How to add data in one-to-one mode?》](https://github.com/2881099/FreeSql/issues/45)

### Many-to-One

```csharp
class Group {
    public int Id { get; set; } //Id、GroupId、Group_id
}

class User {
    public int Id { get; set; } //Id、UserId、User_id


    public int AGroupId { get; set; }
    public Group AGroup { get; set; }

    public int BGroupId { get; set; }
    public Group BGroup { get; set; }
}
```

### One-to-Many

```csharp
class Group {
    public int Id { get; set; } //Id、GroupId、Group_id

    public ICollection<User> AUsers { get; set; }
    public ICollection<User> BUsers { get; set; }
}

class User {
    public int Id { get; set; } //Id、UserId、User_id


    public int AGroupId { get; set; }
    public Group AGroup { get; set; }

    public int BGroupId { get; set; }
    public Group BGroup { get; set; }
}
```

[《How to add data in one-to-many mode?》](https://github.com/2881099/FreeSql/issues/46)

### Parent and Children
```csharp
class Group {
    public int Id { get; set; } //Id、GroupId、Group_id

    public int ParentId { get; set; } //ParentId、Parent_id
    public Group Parent { get; set; }

    public ICollection<Group> Childs { get; set; }
}
```

The parent-children relationship is similar to One-to-Many mode. You can also refer to this link:

[《How to add data in one-to-many mode?》](https://github.com/2881099/FreeSql/issues/46)

### Many-to-Many

```csharp
class Song {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }

    public virtual ICollection<Tag> Tags { get; set; }
}
class Song_tag {
    public int Song_id { get; set; }
    public virtual Song Song { get; set; }

    public int Tag_id { get; set; }
    public virtual Tag Tag { get; set; }
}
class Tag {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Name { get; set; }

    public int? Parent_id { get; set; }
    public virtual Tag Parent { get; set; }

    public virtual ICollection<Song> Songs { get; set; }
    public virtual ICollection<Tag> Tags { get; set; }
}
```

Song, Tag, Song_tag, these three entities use the four relationships: OneToMany, ManyToOne, Parent, and ManyToMany.

## Reference

- [《CodeFirst Mode, Part 1: Entity Attributes》](Entity-Attributes)
- [《CodeFirst Mode, Part 2: FluentApi》](FluentApi-Mode)
- [《CodeFirst Mode, Part 3: Custom Attributes》](Custom-Attributes)
- [《CodeFirst Mode, Part 4: Type Mapping》](Type-Mapping)
- [《Import Entity Configuration from Database》](Import-Entity-Configuration-from-Database)

