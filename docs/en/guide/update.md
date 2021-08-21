# Update

FreeSql provides a variety of database update functions. It supports single or batch updates, and can also return updated records when executed in a specific database.

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    .UseAutoSyncStructure(true) //Automatically synchronize the entity structure to the database.
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
fsql.Update<Topic>(object dywhere)
```
`dywhere` supports:

* Primary key
* `new[] { PrimaryKey1, PrimaryKey2 }`
* Topic Object
* `new[] { TopicObject1, TopicObject2 }`
* `new { id = 1 }`

## 1. Update the specified column
```csharp
fsql.Update<Topic>(1)
  .Set(a => a.CreateTime, DateTime.Now)
  .ExecuteAffrows();
//UPDATE `Topic` SET `CreateTime` = '2018-12-08 00:04:59' 
//WHERE (`Id` = 1)
```

> Support multiple calls to `Set()`, which is equivalent to splicing Sql statements.

```csharp
fsql.Update<Topic>(1)
  .Set(a => a.Clicks + 1)
  .Set(a => a.Time == DateTime.Now)
  .ExecuteAffrows();
//UPDATE `Topic` SET `Clicks` = ifnull(`Clicks`,0) + 1, `Time` = now() 
//WHERE (`Id` = 1)

fsql.Update<Topic>(1)
  .Set(a => new Topic
  {
    Clicks = a.Clicks + 1,
    Time = DateTime.Now
  })
  .ExecuteAffrows();
//UPDATE `Topic` SET `Clicks` = ifnull(`Clicks`,0) + 1, `Time` = now() 
//WHERE (`Id` = 1)
```

## 2. Update Conditions

> In addition to the `dywhere` parameter described above, it also supports the `Where lambda/sql` method

> For safety reasons, when there are no conditions, the update action will not be executed to avoid updating the entire table data by mistake. Update the entire table data: `fsql.Update<T>().Where("1=1").Set(a => a.Xxx == xxx).ExecuteAffrows()`

```csharp
fsql.Update<Topic>()
  .Set(a => a.Title, "New Title")
  .Set(a => a.Time, DateTime.Now)
  .Where(a => a.Id == 1)
  .ExecuteAffrows();
//UPDATE `Topic` SET `Title` = @p_0, `Time` = @p_1 
//WHERE (Id = 1)
```

## 3. Update the Entity

Method 1: (recommended)

> Only update the changed properties (depend on `FreeSql.Repository` package)
```csharp
var repo = fsql.GetRepository<Topic>();
var item = repo.Where(a => a.Id == 1).First();  //Snapshot item at this time
item.Title = "newtitle";
repo.Update(item); //Compare the changes before and after the snapshot.
//UPDATE `Topic` SET `Title` = @p_0
//WHERE (`Id` = 1)
```

> Do you think it’s verbose to query first and then update?
```csharp
var repo = fsql.GetRepository<Topic>();
var item = new Topic { Id = 1 };
repo.Attach(item); //Snapshot item at this time
item.Title = "newtitle";
repo.Update(item); //Compare the changes before and after the snapshot.
//UPDATE `Topic` SET `Title` = @p_0
//WHERE (`Id` = 1)
```
Method 2: (Original)

```csharp
//v1.5.0 Ignore properties that update null values
fsql.Update<Topic>()
  .SetSourceIgnore(item, col => col == null)
  .ExecuteAffrows();
```

```csharp
var item = new Topic { Id = 1, Title = "newtitle" };
fsql.Update<Topic>()
  .SetSource(item)
  .ExecuteAffrows();
//UPDATE `Topic` SET `Clicks` = @p_0, `Title` = @p_1, `CreateTime` = @p_2 
//WHERE (`Id` = 1)

fsql.Update<Topic>()
  .SetSource(item)
  .UpdateColumns(a => new { a.Title, a.CreateTime })
  .ExecuteAffrows();
//UPDATE `Topic` SET `Title` = @p_0, `CreateTime` = @p_1 
//WHERE (`Id` = 1)

fsql.Update<Topic>()
  .SetSource(item)
  .IgnoreColumns(a => new { a.Clicks, a.CreateTime })
  .ExecuteAffrows();
//UPDATE `Topic` SET `Title` = @p_0 
//WHERE (`Id` = 1)

var items = new List<Topic>();
for (var a = 0; a < 10; a++) items.Add(new Topic { Id = a + 1, Title = $"newtitle{a}", Clicks = a * 100 });

fsql.Update<Topic>()
  .SetSource(items)
  .ExecuteAffrows();
//UPDATE `Topic` SET `Clicks` = CASE `Id` WHEN 1 THEN @p_0 WHEN 2 THEN @p_1 WHEN 3 THEN @p_2 WHEN 4 THEN @p_3 WHEN 5 THEN @p_4 WHEN 6 THEN @p_5 WHEN 7 THEN @p_6 WHEN 8 THEN @p_7 WHEN 9 THEN @p_8 WHEN 10 THEN @p_9 END, 
//`Title` = CASE `Id` WHEN 1 THEN @p_10 WHEN 2 THEN @p_11 WHEN 3 THEN @p_12 WHEN 4 THEN @p_13 WHEN 5 THEN @p_14 WHEN 6 THEN @p_15 WHEN 7 THEN @p_16 WHEN 8 THEN @p_17 WHEN 9 THEN @p_18 WHEN 10 THEN @p_19 END, 
//`CreateTime` = CASE `Id` WHEN 1 THEN @p_20 WHEN 2 THEN @p_21 WHEN 3 THEN @p_22 WHEN 4 THEN @p_23 WHEN 5 THEN @p_24 WHEN 6 THEN @p_25 WHEN 7 THEN @p_26 WHEN 8 THEN @p_27 WHEN 9 THEN @p_28 WHEN 10 THEN @p_29 END 
//WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))

fsql.Update<Topic>()
  .SetSource(items)
  .IgnoreColumns(a => new { a.Clicks, a.CreateTime })
  .ExecuteAffrows();
//UPDATE `Topic` SET `Title` = CASE `Id` WHEN 1 THEN @p_0 WHEN 2 THEN @p_1 WHEN 3 THEN @p_2 WHEN 4 THEN @p_3 WHEN 5 THEN @p_4 WHEN 6 THEN @p_5 WHEN 7 THEN @p_6 WHEN 8 THEN @p_7 WHEN 9 THEN @p_8 WHEN 10 THEN @p_9 END 
//WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))

fsql.Update<Topic>()
  .SetSource(items)
  .Set(a => a.CreateTime, DateTime.Now)
  .ExecuteAffrows();
//UPDATE `Topic` SET `CreateTime` = @p_0 
//WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))
```

> After the specified `Set` column is updated, `SetSource` will become invalid

## 4. Custom SQL

```csharp
fsql.Update<Topic>()
  .SetRaw("Title = @title", new { title = "New Title" })
  .Where("Id = @id", 1)
  .ExecuteAffrows();
//UPDATE `Topic` SET Title = @title WHERE (Id = @id)
```

## 5. Update According to the DTO

```csharp
fsql.Update<T>()
  .SetDto(new { title = "xxx", clicks = 2 })
  .Where(a => a.Id == 1)
  .ExecuteAffrows();
//UPDATE `Topic` SET `Title` = @p_0, `Clicks` = @p_1 WHERE (Id = 1)

fsql.Update<T>()
  .SetDto(new Dictionary<string, object> { ["title"] = "xxx", ["clicks"] = 2 })
  .Where(a => a.Id == 1)
  .ExecuteAffrows();
```

## 6. The difference between Set, SetSource and SetDto

The three of them are functions of the same level, corresponding to:

- `Set/SetRaw` is used when the entity is known, corresponding to `update t set x = x`

- `SetSource` updates the entire entity, you can use `UpdateColumns` and/or `IgnoreColumns` to specify or ignore fields

- `SetDto` is a batch operation of `Set`

## 7. Optimistic Lock

When updating the entire entity data, it is very easy to cause the old data to update the new record in the case of concurrency.

The principle of optimistic locking: use a certain field of the entity, such as `long version`. Query the data before updating, and then `version` is `1`. The SQL generated during the update will append `where version = 1`, and an exception (DbUpdateVersionException) will be thrown when the modification fails (ie, `Affrows == 0`).

Each entity only supports one optimistic lock attribute, mark the attribute before the property: `[Column(IsVersion = true)]`.

> Applicable to SetSource update, the value of `version` will increase by `1` each time it is updated.

## 8. Pessimistic Lock

```csharp
var user = fsql.Select<User>()
  .ForUpdate(true)
  .Where(a => a.Id == 1)
  .ToOne();
//SELECT ... FROM User a for update nowait
```

`ForUpdate` is a common way of writing in Oracle/PostgreSQL/MySql. We have made a special adaptation to SqlServer. The SQL statements executed are roughly as follows:

```sql
SELECT ... FROM [User] a With(UpdLock, RowLock, NoWait)
```

## 9. Advanced Update: `ISelect.ToUpdate`

`IUpdate` does not support navigation objects, multi-table association, etc. by default. `ISelect.ToUpdate` can convert the query to `IUpdate` to update the data using the navigation object, as follows:

```csharp
fsql.Select<T1>().Where(a => a.Options.xxx == 1)
  .ToUpdate()
  .Set(a => a.Title, "111")
  .ExecuteAffrows();
```
Note: This method is not to query the data to the memory and then update, the above code produces the following SQL execution:

```sql
UPDATE `T1` SET Title = '111' WHERE id in (select a.id from T1 a left join Options b on b.t1id = a.id where b.xxx = 1)
```

The benefits of using this program for dang complex update:

- Data can be previewed before updating to prevent wrong update operations;
- Support complex update operations, for example: Use `Limit(10)` on `ISelect` to update the first 10 records that meet the conditions;

## Reference

- [《Database Transaction》](Database-Transaction)
- [《FreeSql 101, Part 1: Insert Data》](Insert-Data)
- [《FreeSql 101, Part 2: Delete Data》](Delete-Data)
- [《FreeSql 101, Part 4: Query Data》](Query-Data)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《UnitOfWork》](Unit-of-Work)

# API

| Methods         | Return     | Parameters              | Description                                                                                                                     |
| --------------- | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| SetSource       | \<this\>   | T1 \| IEnumerable\<T1\> | Update data, set updated entity                                                                                                 |
| IgnoreColumns   | \<this\>   | Lambda                  | Ignored columns                                                                                                                 |
| Set             | \<this\>   | Lambda, value           | Set the new value of the column `Set(a => a.Name, "newvalue")`                                                                  |
| Set             | \<this\>   | Lambda                  | Set the new value of the column based on the original value  `Set(a => a.Clicks + 1)`, which is equivalent to `clicks=clicks+1` |
| SetDto          | \<this\>   | object                  | Update according to DTO                                                                                                         |
| SetRaw          | \<this\>   | string, parms           | Set value, custom SQL syntax `SetRaw("title = @title", new {title = "newtitle" })`                                              |
| Where           | \<this\>   | Lambda                  | Expression conditions, only support entity members (not including navigation objects)                                           |
| Where           | \<this\>   | string, parms           | Raw SQL syntax conditions `Where("id = @id", new {id = 1 })`                                                                    |
| Where           | \<this\>   | T1 \| IEnumerable\<T1\> | Pass in the entity or collection, and use its primary key as the condition                                                      |
| CommandTimeout  | \<this\>   | int                     | Command timeout setting (seconds)                                                                                               |
| WithTransaction | \<this\>   | DbTransaction           | Set transaction object                                                                                                          |
| WithConnection  | \<this\>   | DbConnection            | Set the connection object                                                                                                       |
| ToSql           | string     |                         | Return the SQL statement to be executed                                                                                         |
| ExecuteAffrows  | long       |                         | Execute SQL statement and return the number of rows affected                                                                    |
| ExecuteUpdated  | List\<T1\> |                         | Execute SQL statement and return the updated record                                                                             |
