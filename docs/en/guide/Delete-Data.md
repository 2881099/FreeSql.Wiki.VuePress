# Delete

Deleting data is a very dangerous operation. FreeSql does not support deletion very powerfully. By default, it only supports single-table and conditional deletion methods.

If it is executed when the `Where` condition is empty, only `0` or the `default` value is returned, and no real SQL delete operation is performed.

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    .UseAutoSyncStructure(true) //Automatically synchronize the entity structure to the database
    .Build(); //Be sure to define as singleton mode

class Topic {
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## Dynamic Conditions
```csharp
fsql.Delete<Topic>(object dywhere)
```
`dywhere` supports:

* Primary key value
* `new[] { PrimaryKey1, PrimaryKey2 }`
* Topic Object
* `new[] { TopicObject1, TopicObject2 }`
* `new { id = 1 }`

```csharp
var t1 = fsql.Delete<Topic>(new[] { 1, 2 }).ToSql();
//DELETE FROM `Topic` WHERE (`Id` = 1 OR `Id` = 2)

var t2 = fsql.Delete<Topic>(new Topic { Id = 1, Title = "test" }).ToSql();
//DELETE FROM `Topic` WHERE (`Id` = 1)

var t3 = fsql.Delete<Topic>(new[] { new Topic { Id = 1, Title = "test" }, new Topic { Id = 2, Title = "test" } }).ToSql();
//DELETE FROM `Topic` WHERE (`Id` = 1 OR `Id` = 2)

var t4 = fsql.Delete<Topic>(new { id = 1 }).ToSql();
//DELETE FROM `Topic` WHERE (`Id` = 1)
```

## Delete Conditions

> For safety reasons, when there are no conditions, the delete action will not be executed to avoid deleting the entire table data by mistake. Delete the entire table data: `fsql.Delete<T>().Where("1=1").ExecuteAffrows()`

```csharp
var t5 = fsql.Delete<Topic>().Where(a => a.Id == 1).ToSql();
//DELETE FROM `Topic` WHERE (`Id` = 1)

var t6 = fsql.Delete<Topic>().Where("id = @id", new { id = 1 }).ToSql();
//DELETE FROM `Topic` WHERE (id = @id)

var item = new Topic { Id = 1, Title = "newtitle" };
var t7 = fsql.Delete<Topic>().Where(item).ToSql();
//DELETE FROM `Topic` WHERE (`Id` = 1)

var items = new List<Topic>();
for (var a = 0; a < 10; a++) items.Add(new Topic { Id = a + 1, Title = $"newtitle{a}", Clicks = a * 100 });
var t8 = fsql.Delete<Topic>().Where(items).ToSql();
//DELETE FROM `Topic` WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))
```

## Dictionary Delete

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
```

## `ISelect.ToDelete` Advanced Delete

`IDelete` does not support navigation objects, multi-table association, etc. By default, `ISelect.ToDelete` can convert the query to `IDelete` so that the navigation object can be used to delete data:

```csharp
fsql.Select<T1>().Where(a => a.Options.xxx == 1).ToDelete().ExecuteAffrows();
```
Note: This method is not to query the data to the memory and delete it cyclically. The above code generates and executes the following SQL:

```sql
DELETE FROM `T1` WHERE id in (select a.id from T1 a left join Options b on b.t1id = a.id where b.xxx = 1)
```

The benefits of using this method for complex deletion:

- Preview data before deleting to prevent mistaken deletion operations;
- Support complex deletion operations, for example: Use `Limit(10)` on `ISelect` to delete the first 10 records that meet the conditions;

## Cascade deletion of IBaseRepository

1、Cascade deletion based on \[object\]

```c#
var repo = fsql.GetRepository<Group>();
repo.DbContextOptions.EnableCascadeSave = true; //Key settings
repo.Insert(new UserGroup
{
    GroupName = "group01",
    Users = new List<User>
    {
        new User { Username = "admin01", Password = "pwd01", UserExt = new UserExt { Remark = "user remark01" } },
        new User { Username = "admin02", Password = "pwd02", UserExt = new UserExt { Remark = "user remark02" } },
        new User { Username = "admin03", Password = "pwd03", UserExt = new UserExt { Remark = "user remark03" } },
    }
}); //Cascade addition test data
//INSERT INTO "usergroup"("groupname") VALUES('group01') RETURNING "id"
//INSERT INTO "user"("username", "password", "groupid") VALUES('admin01', 'pwd01', 1), ('admin02', 'pwd02', 1), ('admin03', 'pwd03', 1) RETURNING "id" as "Id", "username" as "Username", "password" as "Password", "groupid" as "GroupId"
//INSERT INTO "userext"("userid", "remark") VALUES(3, 'user remark01'), (4, 'user remark02'), (5, 'user remark03')

var groups = repo.Select
    .IncludeMany(a => a.Users, 
        then => then.Include(b => b.UserExt))
    .ToList();
repo.Delete(groups); //Cascade deletion, recursively traversing the navigation properties of group OneToOne/OneToMany/ManyToMany
//DELETE FROM "userext" WHERE ("userid" IN (3,4,5))
//DELETE FROM "user" WHERE ("id" IN (3,4,5))
//DELETE FROM "usergroup" WHERE ("id" = 1)
```

2. Cascade deletion based on \[database\]

> According to the set navigation properties, recursively delete the corresponding data of OneToOne/OneToMany/ManyToMany, and return the deleted data. This feature does not rely on database foreign keys

```c#
var repo = fsql.GetRepository<Group>();
var ret = repo.DeleteCascadeByDatabase(a => a.Id == 1);
//SELECT a."id", a."username", a."password", a."groupid" FROM "user" a WHERE (a."groupid" = 1)
//SELECT a."userid", a."remark" FROM "userext" a WHERE (a."userid" IN (3,4,5))
//DELETE FROM "userext" WHERE ("userid" IN (3,4,5))
//DELETE FROM "user" WHERE ("id" IN (3,4,5))
//DELETE FROM "usergroup" WHERE ("id" = 1)

//ret   Count = 7	System.Collections.Generic.List<object>
//  [0]	{UserExt}	object {UserExt}
//  [1]	{UserExt}	object {UserExt}
//  [2]	{UserExt}	object {UserExt}
//  [3]	{User}	    object {User}
//  [4]	{User}	    object {User}
//  [5]	{User}  	object {User}
//  [6]	{UserGroup}	object {UserGroup}

public class Group
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

## Reference

- [《Database Transaction》](Database-Transaction)
- [《FreeSql 101, Part 1: Insert Data》](Insert-Data)
- [《FreeSql 101, Part 3: Update Data》](Update-Data)
- [《FreeSql 101, Part 4: Query Data》](Query-Data)
- [《Repository Layer》](Repository-Layer)
- [《Tenant》](Tenant)

## API

| Methods         | Return     | Parameters              | Description                                                                                 |
| --------------- | ---------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Where           | \<this\>   | Lambda                  | Expression conditions, only support entity basic members (not including navigation objects) |
| Where           | \<this\>   | string, parms           | Raw SQL syntax conditions, `Where("id = @id", new { id = 1 })`                              |
| Where           | \<this\>   | T1 \| IEnumerable\<T1\> | Pass in the entity or collection, and use its primary key as the condition                  |
| CommandTimeout  | \<this\>   | int                     | Command timeout setting (seconds)                                                           |
| WithTransaction | \<this\>   | DbTransaction           | Set transaction object                                                                      |
| WithConnection  | \<this\>   | DbConnection            | Set the connection object                                                                   |
| ToSql           | string     |                         | Returns the SQL statement to be executed.                                                   |
| ExecuteAffrows  | long       |                         | Execute SQL and return the number of rows affected.                                         |
| ExecuteDeleted  | List\<T1\> |                         | Execute SQL and return the deleted records.                                                 |

