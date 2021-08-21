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

