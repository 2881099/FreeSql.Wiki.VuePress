# 删除

删除是一个非常危险的操作，FreeSql 对删除支持并不强大，默认仅支持单表、且有条件的删除方法。

若 `Where` 条件为空的时候执行，仅返回 `0` 或默认值，不执行真正的 SQL 删除操作。

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    .UseAutoSyncStructure(true) //自动同步实体结构到数据库
    .Build(); //请务必定义成 Singleton 单例模式

class Topic {
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## 动态条件

```csharp
fsql.Delete<Topic>(object dywhere)
```

`dywhere` 支持：

- 主键值
- `new[] { 主键值1, 主键值2 }`
- Topic 对象
- `new[] { Topic对象1, Topic对象2 }`
- `new { id = 1 }`

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

## 删除条件

> 出于安全考虑，没有条件不执行删除动作，避免误删除全表数据。删除全表数据：`fsql.Delete<T>().Where("1=1").ExecuteAffrows()`

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

## 字典删除

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
```

## ISelect.ToDelete 高级删除

`IDelete` 默认不支持导航对象，多表关联等。`ISelect.ToDelete` 可将查询转为 `IDelete`，以便使用导航对象删除数据，如下：

```csharp
fsql.Select<T1>().Where(a => a.Options.xxx == 1).ToDelete().ExecuteAffrows();
```

注意：此方法不是将数据查询到内存循环删除，上面的代码产生如下 SQL 执行：

```sql
DELETE FROM `T1` WHERE id in (select a.id from T1 a left join Options b on b.t1id = a.id where b.xxx = 1)
```

复杂删除使用此方法的好处：

- 删除前可预览测试数据，防止错误删除操作；
- 支持复杂的删除操作，例如：`ISelect` 上使用 `Limit(10)` 删除附合条件的前 10 条记录；

## IBaseRepository 级联删除

1、第一种：基于【对象】级联删除

> 比如 Include/IncludeMany 查询的对象，可以使用此方法级联删除它们。

```csharp
var repo = fsql.GetRepository<Group>();
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

2、第二种：基于【数据库】级联删除

> 根据设置的导航属性，递归删除 OneToOne/OneToMany/ManyToMany 对应数据，并返回已删除的数据。此功能不依赖数据库外键

```csharp
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

## API

| 方法            | 返回值     | 参数                    | 描述                                                 |
| --------------- | ---------- | ----------------------- | ---------------------------------------------------- |
| Where           | \<this\>   | Lambda                  | 表达式条件，仅支持实体基础成员（不包含导航对象）     |
| Where           | \<this\>   | string, parms           | 原生 sql 语法条件，Where("id = @id", new { id = 1 }) |
| Where           | \<this\>   | T1 \| IEnumerable\<T1\> | 传入实体或集合，将其主键作为条件                     |
| CommandTimeout  | \<this\>   | int                     | 命令超时设置(秒)                                     |
| WithTransaction | \<this\>   | DbTransaction           | 设置事务对象                                         |
| WithConnection  | \<this\>   | DbConnection            | 设置连接对象                                         |
| ToSql           | string     |                         | 返回即将执行的 SQL 语句                              |
| ExecuteAffrows  | long       |                         | 执行 SQL 语句，返回影响的行数                        |
| ExecuteDeleted  | List\<T1\> |                         | 执行 SQL 语句，返回被删除的记录                      |
