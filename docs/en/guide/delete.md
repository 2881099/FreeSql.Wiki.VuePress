# Delete

Deleting records is a very dangerous operation. FreeSql by default only supports single-table deletions with conditions.

If the `Where` condition is empty, no actual SQL delete operation will be executed.

```csharp
IFreeSql fsql; // For creation details, please refer to the Getting Started documentation

class Topic
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## 1. Dynamic Conditions

```csharp
fsql.Delete<Topic>(object dywhere).ExecuteAffrows()
```

`dywhere` can be:

- Primary key value
- `new[] { primaryKeyValue1, primaryKeyValue2 }`
- Topic object
- `new[] { TopicObject1, TopicObject2 }`
- `new { id = 1 }`

```csharp
var t1 = fsql.Delete<Topic>(new[] { 1, 2 }).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (`Id` = 1 OR `Id` = 2)

var t2 = fsql.Delete<Topic>(new Topic { Id = 1, Title = "test" }).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (`Id` = 1)

var t3 = fsql.Delete<Topic>(new[] { new Topic { Id = 1, Title = "test" }, new Topic { Id = 2, Title = "test" } }).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (`Id` IN (1, 2))

var t4 = fsql.Delete<Topic>(new { id = 1 }).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (`Id` = 1)
```

## 2. Dynamic Table Names

```csharp
fsql.Delete<Topic>(1).AsTable("Topic_201903").ExecuteAffrows(); // Deletes from table Topic_201903
```

## 3. Deletion Conditions

> For safety reasons, deletion with no conditions does not execute the delete action to avoid accidentally deleting all data. To delete all data from a table: `fsql.Delete<T>().Where(a => true).ExecuteAffrows()`

```csharp
var t5 = fsql.Delete<Topic>().Where(a => a.Id == 1).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (`Id` = 1)

var t6 = fsql.Delete<Topic>().Where("id = @id", new { id = 1 }).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (id = @id)

var item = new Topic { Id = 1, Title = "newtitle" };
var t7 = fsql.Delete<Topic>().Where(item).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (`Id` = 1)

var items = new List<Topic>();
for (var a = 0; a < 10; a++) items.Add(new Topic { Id = a + 1, Title = $"newtitle{a}", Clicks = a * 100 });
var t8 = fsql.Delete<Topic>().Where(items).ExecuteAffrows();
// DELETE FROM `Topic` WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))
```

## 4. Dictionary Deletion

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
// Note: List<Dictionary<string, object>> can be used for batch deletions
```

## 5. ISelect.ToDelete

`IDelete` does not support navigation objects or multi-table joins by default. `ISelect.ToDelete` can convert a query to `IDelete` to support deletions involving navigation objects, as shown below:

```csharp
fsql.Select<T1>().Where(a => a.Options.xxx == 1).ToDelete().ExecuteAffrows();
```

Note: This method does not query data into memory for deletion. The above code generates SQL like:

```sql
DELETE FROM `T1` WHERE id IN (SELECT a.id FROM T1 a LEFT JOIN Options b ON b.t1id = a.id WHERE b.xxx = 1)
```

Benefits of using this method:

- Preview and test data before deletion to prevent errors.
- Supports complex deletion operations, such as deleting the top 10 records meeting the criteria using `ISelect` with `Limit(10)`.

## 6. Cascading Deletion

1. **Object-Based Cascading Deletion**

> Use `Include/IncludeMany` for eager loading of `OneToOne/OneToMany/ManyToMany` navigation properties to enable cascading deletions.

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
}); // Cascading add test data
// INSERT INTO "usergroup"("groupname") VALUES('group01') RETURNING "id"
// INSERT INTO "user"("username", "password", "groupid") VALUES('admin01', 'pwd01', 1), ('admin02', 'pwd02', 1), ('admin03', 'pwd03', 1) RETURNING "id" as "Id", "username" as "Username", "password" as "Password", "groupid" as "GroupId"
// INSERT INTO "userext"("userid", "remark") VALUES(3, 'User Remark 01'), (4, 'User Remark 02'), (5, 'User Remark 03')

var groups = repo.Select
    .IncludeMany(a => a.Users,
        then => then.Include(b => b.UserExt))
    .ToList();
repo.Delete(groups); // Cascading delete, recursively traverses group OneToOne/OneToMany/ManyToMany navigation properties
// DELETE FROM "userext" WHERE ("userid" IN (3,4,5))
// DELETE FROM "user" WHERE ("id" IN (3,4,5))
// DELETE FROM "usergroup" WHERE ("id" = 1)
```

2. **Database-Based Cascading Deletion**

> Based on navigation properties, recursively delete data corresponding to `OneToOne/OneToMany/ManyToMany` relationships without relying on database foreign keys.

```csharp
var repo = fsql.GetRepository<UserGroup>();
var ret = repo.DeleteCascadeByDatabase(a => a.Id == 1);
// SELECT a."id", a."username", a."password", a."groupid" FROM "user" a WHERE (a."groupid" = 1)
// SELECT a."userid", a."remark" FROM "userext" a WHERE (a."userid" IN (3,4,5))
// DELETE FROM "userext" WHERE ("userid" IN (3,4,5))
// DELETE FROM "user" WHERE ("id" IN (3,4,5))
// DELETE FROM "usergroup" WHERE ("id" = 1)

// ret   Count = 7 System.Collections.Generic.List<object>
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

## API

| Method            | Return Value | Parameters              | Description                                                                             |
| ----------------- | ------------ | ----------------------- | --------------------------------------------------------------------------------------- |
| `Where`           | `<this>`     | Lambda                  | Expression condition, only supports entity basic members (excluding navigation objects) |
| `Where`           | `<this>`     | string, parms           | Native SQL syntax condition, such as `Where("id = @id", new { id = 1 })`                |
| `Where`           | `<this>`     | T1 \| IEnumerable\<T1\> | Pass an entity or collection, using its primary key as the condition                    |
| `CommandTimeout`  | `<this>`     | int                     | Command timeout setting (in seconds)                                                    |
| `WithTransaction` | `<this>`     | `DbTransaction`         | Set the transaction object                                                              |
| `WithConnection`  | `<this>`     | `DbConnection`          | Set the connection object                                                               |
| `ToSql`           | string       |                         | Return the SQL statement that is about to be executed                                   |
| `ExecuteAffrows`  | long         |                         | Execute the SQL statement and return the number of affected rows                        |
| `ExecuteDeleted`  | `List<T1>`   |                         | Execute the SQL statement and return the deleted records                                |
