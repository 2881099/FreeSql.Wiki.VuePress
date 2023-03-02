# 导航属性 ✨

FreeSql 提供 OneToMany, ManyToOne, ManyToMany, OneToOne, Parent, [PgArrayToMany](https://www.cnblogs.com/FreeSql/p/16351417.html) 六种导航属性关系。

导航属性能干什么？

- [《多表查询》](%e5%a4%9a%e8%a1%a8%e6%9f%a5%e8%af%a2) Where(a => a.Parent.Parent.Name == "xx")
- [《贪婪加载》](%e8%b4%aa%e5%a9%aa%e5%8a%a0%e8%bd%bd) Include/IncludeMany
- [《延时加载》](%e5%bb%b6%e6%97%b6%e5%8a%a0%e8%bd%bd)
- [《树表查询》](%e6%9f%a5%e8%af%a2%e7%88%b6%e5%ad%90%e5%85%b3%e7%b3%bb)
- [《级联保存》](%e8%81%94%e7%ba%a7%e4%bf%9d%e5%ad%98)
- [《级联删除》](%E8%81%94%E7%BA%A7%E5%88%A0%E9%99%A4)

导航属性进行多表查询非常方便，lambda 表达式中直接使用导航对象点点点，舒服！！

# 自定义配置

OneToMany/ManyToMany 支持的类型：ICollection\<T\>、List\<T\>、ObservableCollection\<T\>

```csharp
//OneToMany
class Group
{
    [Navigate(nameof(User.GroupId))]
    public List<User> Users { get; set; }
    //在 User 查找 GroupId 属性，与 本实体.主键 关联
}

//ManyToOne
class User
{
    public int GroupId { get; set; }
    [Navigate(nameof(GroupId))]
    public Group Group { get; set; }
    //在 本实体 查找 GroupId 属性，与 Group.主键 关联
}

//ManyToMany
[Navigate(ManyToMany = typeof(TagSong))]
public List<Tag> Items { get; set; }
```

---

也可以使用 FluentApi 在外部设置导航关系：

```csharp
fsql.CodeFirst.ConfigEntity<T>(a => a
    .Navigate(b => b.roles, null, typeof(TMid))
    .Navigate(b => b.users, "uid")
);
```

> 注意：

1、属性设置 Column(IsIgnore = true) 后，导航属性会失效

2、Navigate 设置的字符串是 类属性名，不是表 字段名！！！

> 预热说明：导航属性配置的加载，因为要解决死循环引用，当相互引用关系很复杂的时候，可能导致首次使用导航属性失败，第二次就可以了。解决办法可以程序启动时就预热所有实体类，循环执行 fsql.Select\<object\>().AsType(实体类);

# 与非主键关联

```csharp
//OneToMany
[Navigate(nameof(User.GroupId), TempPrimary = nameof(Code))]
public List<User> Users { get; set; }

//ManyToOne
[Navigate(nameof(GroupId), TempPrimary = nameof(Group.Code))]
public Group Group { get; set; }
```

非主键关联权支持 OneToMany/ManyToOne 两种关系，并且只能在查询的时候有效。（不支持级联保存、级联删除）

# 检测导航属性

如何检测一个导航属性是否有效：

```csharp
var tbref = fsql.CodeFirst
    .GetTableByEntity(typeof(T))
    .GetTableRef("Children", true);
```

GetTableRef(string propertyName, bool isThrow);

# PgArrayToMany

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

更多资料：[#1145](https://github.com/dotnetcore/FreeSql/issues/1145)

# 约定命名（无须指明 Navigate）

提示：本节内容稍微了解即可，不是必须掌握的，可以跳过。

```csharp
class Group
{
    public int Id { get; set; } //Id、GroupId、Group_id

    public List<User> AUsers { get; set; }
    public List<User> BUsers { get; set; }

    public int ParentId { get; set; } //ParentId、Parent_id
    public Group Parent { get; set; }

    public List<Group> Childs { get; set; }
}
class User
{
    public int Id { get; set; } //Id、UserId、User_id
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
