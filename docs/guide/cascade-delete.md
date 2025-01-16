# 级联删除

接下来的内容，严重依赖[【导航属性】](navigate-attribute.md)的正确配置，请先学会再继续向下！

级联只针对 OneToOne/OneToMany/ManyToMany 三种导航属性，[级联保存](cascade-saving.md)文档已经解释过。

## 基于【对象】级联删除

> 比如 [Include/IncludeMany](select-include.md#_2%E3%80%81%E5%AF%BC%E8%88%AA%E5%B1%9E%E6%80%A7-manytoone-onetoone) 查询的对象，可以使用此方法级联删除它们。

```cs
var repo = fsql.GetRepository<UserGroup>();
repo.DbContextOptions.EnableCascadeSave = true; //关键设置
repo.Insert(new UserGroup
{
    GroupName = "group01",
    Users = new List<User>
    {
        new User { Username = "admin01", Password = "pwd01", UserExt = new UserExt { Remark = "用户备注01" } },
        new User { Username = "admin02", Password = "pwd02", UserExt = new UserExt { Remark = "用户备注02" } },
        new User { Username = "admin03", Password = "pwd03", UserExt = new UserExt { Remark = "用户备注03" } },
    }
}); //级联添加测试数据
//INSERT INTO "usergroup"("groupname") VALUES('group01') RETURNING "id"
//INSERT INTO "user"("username", "password", "groupid") VALUES('admin01', 'pwd01', 1), ('admin02', 'pwd02', 1), ('admin03', 'pwd03', 1) RETURNING "id" as "Id", "username" as "Username", "password" as "Password", "groupid" as "GroupId"
//INSERT INTO "userext"("userid", "remark") VALUES(3, '用户备注01'), (4, '用户备注02'), (5, '用户备注03')

var groups = repo.Select
    .IncludeMany(a => a.Users,
        then => then.Include(b => b.UserExt))
    .ToList();
repo.Delete(groups); //级联删除，递归向下遍历 group OneToOne/OneToMany/ManyToMany 导航属性
//DELETE FROM "userext" WHERE ("userid" IN (3,4,5))
//DELETE FROM "user" WHERE ("id" IN (3,4,5))
//DELETE FROM "usergroup" WHERE ("id" = 1)
```

## 基于【数据库】级联删除

> 根据设置的导航属性，递归删除 OneToOne/OneToMany/ManyToMany 对应数据，并返回已删除的数据。此功能不依赖数据库外键

```cs
var repo = fsql.GetRepository<UserGroup>();
var ret = repo.DeleteCascadeByDatabase(a => a.Id == 1);
//SELECT a."id", a."username", a."password", a."groupid" FROM "user" a WHERE (a."groupid" = 1)
//SELECT a."userid", a."remark" FROM "userext" a WHERE (a."userid" IN (3,4,5))
//DELETE FROM "userext" WHERE ("userid" IN (3,4,5))
//DELETE FROM "user" WHERE ("id" IN (3,4,5))
//DELETE FROM "usergroup" WHERE ("id" = 1)

//ret   Count = 7 System.Collections.Generic.List<object>
//  [0] {UserExt} object {UserExt}
//  [1] {UserExt} object {UserExt}
//  [2] {UserExt} object {UserExt}
//  [3] {User}     object {User}
//  [4] {User}     object {User}
//  [5] {User}   object {User}
//  [6] {UserGroup} object {UserGroup}

public class UserGroup
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string GroupName { get; set; }

    [Navigate(nameof(User.GroupId))]
    public List<User> Users { get; set; }
}
public class User
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public int GroupId { get; set; }

    [Navigate(nameof(Id))]
    public UserExt UserExt { get; set; }
}
public class UserExt
{
    [Column(IsPrimary = true)]
    public int UserId { get; set; }
    public string Remark { get; set; }

    [Navigate(nameof(UserId))]
    public User User { get; set; }
}
```
