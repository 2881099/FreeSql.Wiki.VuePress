Here is the translated document:

---

# Cascade Delete

The following content heavily relies on the correct configuration of [Navigation Properties](navigate-attribute.md), so please ensure you understand that first before proceeding!

Cascade delete only applies to OneToOne, OneToMany, and ManyToMany navigation properties. The [Cascade Saving](cascade-saving.md) document has already explained this.

## Cascade Delete Based on [Objects]

> For example, objects retrieved using [Include/IncludeMany](select-include.md#_2-navigation-properties-manytoone-onetoone) queries can be cascade deleted using this method.

```csharp
var repo = fsql.GetRepository<UserGroup>();
repo.DbContextOptions.EnableCascadeSave = true; // Key setting
repo.Insert(new UserGroup
{
    GroupName = "group01",
    Users = new List<User>
    {
        new User { Username = "admin01", Password = "pwd01", UserExt = new UserExt { Remark = "User Remark 01" } },
        new User { Username = "admin02", Password = "pwd02", UserExt = new UserExt { Remark = "User Remark 02" } },
        new User { Username = "admin03", Password = "pwd03", UserExt = new UserExt { Remark = "User Remark 03" } },
    }
}); // Cascade add test data
//INSERT INTO "usergroup"("groupname") VALUES('group01') RETURNING "id"
//INSERT INTO "user"("username", "password", "groupid") VALUES('admin01', 'pwd01', 1), ('admin02', 'pwd02', 1), ('admin03', 'pwd03', 1) RETURNING "id" as "Id", "username" as "Username", "password" as "Password", "groupid" as "GroupId"
//INSERT INTO "userext"("userid", "remark") VALUES(3, 'User Remark 01'), (4, 'User Remark 02'), (5, 'User Remark 03')

var groups = repo.Select
    .IncludeMany(a => a.Users,
        then => then.Include(b => b.UserExt))
    .ToList();
repo.Delete(groups); // Cascade delete, recursively traverses group OneToOne/OneToMany/ManyToMany navigation properties
//DELETE FROM "userext" WHERE ("userid" IN (3,4,5))
//DELETE FROM "user" WHERE ("id" IN (3,4,5))
//DELETE FROM "usergroup" WHERE ("id" = 1)
```

## Cascade Delete Based on [Database]

> Based on the configured navigation properties, recursively delete the corresponding data for OneToOne/OneToMany/ManyToMany and return the deleted data. This feature does not rely on database foreign keys.

```csharp
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
//  [5] {User}     object {User}
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
