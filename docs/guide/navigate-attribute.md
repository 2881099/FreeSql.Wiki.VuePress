# 导航属性 ✨

导航属性是 FreeSql 的特色功能之一，可通过约定配置、或自定义配置对象间的关系。

导航属性有 OneToMany, ManyToOne, ManyToMany, OneToOne, Parent, [PgArrayToMany](https://www.cnblogs.com/FreeSql/p/16351417.html) 六种配置关系。

有了导航属性，多表查询会非常方便，lambda 表达式中直接使用导航对象点点点，舒服！！

- 可约定（命名约定），可不约定（需指定 Navigate 特性关联）；
- 无关联的，查询时可以指明 On 条件，LeftJoin(a => a.Parent.Id == a.ParentId)；
- 已关联的，直接使用导航对象就行，On 条件会自动附上；

[《导航属性【到底】可以解决什么问题？》](https://www.cnblogs.com/kellynic/p/13575053.html)

> 预热说明：导航属性加载，因为要解决死循环引用问题，当引用关系很复杂的时候，有可能导致首次使用导航属性失败，第二次就可以了。解决办法可以程序启动时就预热所有实体类，循环执行 fsql.Select\<object\>().AsType(实体类);

# 自定义导航关系

```csharp
//导航属性，OneToMany
[Navigate(nameof(song_tag.song_id))]
public virtual List<song_tag> Obj_song_tag { get; set; }
//在 song_tag 查找 song_id 属性，与 本实体.主键 关联

//导航属性，ManyToOne/OneToOne
[Navigate(nameof(song_id))]
public virtual Song Obj_song { get; set; }
//在 本实体 查找 song_id 属性，与 Song.主键 关联

//导航属性，ManyToMany
[Navigate(ManyToMany = typeof(tag_song))]
public virtual List<tag> tags { get; set; }
```

---

也可以使用 FluentApi 在外部设置导航关系：

```csharp
fsql.CodeFirst.ConfigEntity<实体类>(a => a
    .Navigate(b => b.roles, null, typeof(多对多中间实体类))
    .Navigate(b => b.users, "uid")
);
```

优先级，特性 > FluentApi

> 注意：

1、属性设置 Column(IsIgnore = true) 后，导航属性会失效

2、Navigate 设置的字符串是 类属性名，不是表 字段名！！！

# 检测导航属性

如何检测一个导航属性是否配置生效：

```csharp
var tbref = fsql.CodeFirst
    .GetTableByEntity(typeof(T))
    .GetTableRef("Children", true);
```

GetTableRef(string propertyName, bool isThrow);

# 约定命名（无须指明 Navigate）

### OneToOne 一对一

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

[《OneToOne 一对一，怎么添加数据？》](https://github.com/2881099/FreeSql/issues/45)

### ManyToOne 多对一

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

### OneToMany 一对多

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

[《OneToMany 一对多，怎么添加数据？》](https://github.com/2881099/FreeSql/issues/46)

### Parent 父子

```csharp
class Group {
    public int Id { get; set; } //Id、GroupId、Group_id

    public int ParentId { get; set; } //ParentId、Parent_id
    public Group Parent { get; set; }

    public ICollection<Group> Childs { get; set; }
}
```

父子关系，与一对多其实差不多，添加数据参数上面的连接；

### ManyToMany 多对多

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

Song、Tag、Song_tag，这三个实体使用了 OneToMany、ManyToOne、Parent、ManyToMany 4 种关系。
