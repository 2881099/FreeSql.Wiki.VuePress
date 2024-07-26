# Update

`FreeSql` provides rich database update functionalities, supporting both single and bulk updates. It can also return the updated records when executed on certain databases.

```csharp
IFreeSql fsql; // For creation details, refer to the introductory documentation

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
fsql.Update<Topic>(object dywhere)
```

`dywhere` can be:

- Primary key value
- `new[] { primaryKeyValue1, primaryKeyValue2 }`
- Topic object
- `new[] { TopicObject1, TopicObject2 }`
- `new { id = 1 }`

## 2. Dynamic Table Name

```csharp
fsql.Update<Topic>(1).AsTable("Topic_201903").ExecuteAffrows(); // Updates the Topic_201903 table
```

## 3. Conditions

> In addition to the `dywhere` constructor parameters described above, `Where lambda/sql` methods are also supported.

> For security reasons, updates are not executed without conditions to avoid mistakenly updating the entire table. To update the entire table: `fsql.Update<T>().Where(a => true).Set(a => a.Xxx == xxx).ExecuteAffrows()`

```csharp
fsql.Update<Topic>()
    .Set(a => a.Title, "New Title")
    .Set(a => a.Time, DateTime.Now)
    .Where(a => a.Id == 1)
    .ExecuteAffrows();
// UPDATE `Topic` SET `Title` = @p_0, `Time` = @p_1
// WHERE (Id = 1)
```

## 4. Set Columns 

```csharp
fsql.Update<Topic>(1)
    .Set(a => a.CreateTime, DateTime.Now)
    .ExecuteAffrows();
// UPDATE `Topic` SET `CreateTime` = '2018-12-08 00:04:59'
// WHERE (`Id` = 1)
```

> `Set()` supports multiple calls, which is equivalent to concatenation

```csharp
fsql.Update<Topic>(1)
    .Set(a => a.Clicks + 1)
    .Set(a => a.Time == DateTime.Now)
    .ExecuteAffrows();
// UPDATE `Topic` SET `Clicks` = ifnull(`Clicks`,0) + 1, `Time` = now()
// WHERE (`Id` = 1)

fsql.Update<Topic>(1)
    .Set(a => new Topic
    {
        Clicks = a.Clicks + 1,
        Time = DateTime.Now
    })
    .ExecuteAffrows();
// UPDATE `Topic` SET `Clicks` = ifnull(`Clicks`,0) + 1, `Time` = now()
// WHERE (`Id` = 1)
```

## 5. SetSource Entity 

Method 1: (Recommended)

> Only updates changed properties, depends on `FreeSql.Repository`

```csharp
var repo = fsql.GetRepository<Topic>(); // Can be obtained from the IOC container
var item = repo.Where(a => a.Id == 1).First();  // Snapshot item at this point
item.Title = "newtitle";
repo.Update(item); // Changes compared to the snapshot
// UPDATE `Topic` SET `Title` = @p_0
// WHERE (`Id` = 1)
```

Method 2: (Original)

```csharp
// v1.5.0 ignores properties with null values
fsql.Update<Topic>()
    .SetSourceIgnore(item, col => col == null)
    .ExecuteAffrows();
```

```csharp
var item = new Topic { Id = 1, Title = "newtitle" };
fsql.Update<Topic>()
    .SetSource(item)
    .ExecuteAffrows();
// UPDATE `Topic` SET `Clicks` = @p_0, `Title` = @p_1, `CreateTime` = @p_2
// WHERE (`Id` = 1)

fsql.Update<Topic>()
    .SetSource(item)
    .UpdateColumns(a => new { a.Title, a.CreateTime })
    .ExecuteAffrows();
// UPDATE `Topic` SET `Title` = @p_0, `CreateTime` = @p_1
// WHERE (`Id` = 1)

fsql.Update<Topic>()
    .SetSource(item)
    .IgnoreColumns(a => new { a.Clicks, a.CreateTime })
    .ExecuteAffrows();
// UPDATE `Topic` SET `Title` = @p_0
// WHERE (`Id` = 1)

var items = new List<Topic>();
for (var a = 0; a < 10; a++) items.Add(new Topic { Id = a + 1, Title = $"newtitle{a}", Clicks = a * 100 });

fsql.Update<Topic>()
    .SetSource(items)
    .ExecuteAffrows();
// UPDATE `Topic` SET `Clicks` = CASE `Id` WHEN 1 THEN @p_0 WHEN 2 THEN @p_1 WHEN 3 THEN @p_2 WHEN 4 THEN @p_3 WHEN 5 THEN @p_4 WHEN 6 THEN @p_5 WHEN 7 THEN @p_6 WHEN 8 THEN @p_7 WHEN 9 THEN @p_8 WHEN 10 THEN @p_9 END,
// `Title` = CASE `Id` WHEN 1 THEN @p_10 WHEN 2 THEN @p_11 WHEN 3 THEN @p_12 WHEN 4 THEN @p_13 WHEN 5 THEN @p_14 WHEN 6 THEN @p_15 WHEN 7 THEN @p_16 WHEN 8 THEN @p_17 WHEN 9 THEN @p_18 WHEN 10 THEN @p_19 END,
// `CreateTime` = CASE `Id` WHEN 1 THEN @p_20 WHEN 2 THEN @p_21 WHEN 3 THEN @p_22 WHEN 4 THEN @p_23 WHEN 5 THEN @p_24 WHEN 6 THEN @p_25 WHEN 7 THEN @p_26 WHEN 8 THEN @p_27 WHEN 9 THEN @p_28 WHEN 10 THEN @p_29 END
// WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))

fsql.Update<Topic>()
    .SetSource(items)
    .IgnoreColumns(a => new { a.Clicks, a.CreateTime })
    .ExecuteAffrows();
// UPDATE `Topic` SET `Title` = CASE `Id` WHEN 1 THEN @p_0 WHEN 2 THEN @p_1 WHEN 3 THEN @p_2 WHEN 4 THEN @p_3 WHEN 5 THEN @p_4 WHEN 6 THEN @p_5 WHEN 7 THEN @p_6 WHEN 8 THEN @p_7 WHEN 9 THEN @p_8 WHEN 10 THEN @p_9 END
// WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))

fsql.Update<Topic>()
    .SetSource(items)
    .Set(a => a.CreateTime, DateTime.Now)
    .ExecuteAffrows();
// UPDATE `Topic` SET `CreateTime` = @p_0
// WHERE (`Id` IN (1,2,3,4,5,6,7,8,9,10))
```

> Specifying `Set` columns for updates will make `SetSource` invalid.

> `SetSource` relies on entity's `IsPrimary` attribute by default; for temporary primary keys, use `SetSource(items, a => a.Code)`.

> For Oracle, CASE when N'' character set mismatch:

- Reason: Mismatch between entity primary key `Column DbType` and table type.
- Solution: `[Column(DbType = "varchar2", StringLength = 255)]`

## 6. SetDto

```csharp
fsql.Update<T>()
    .SetDto(new { title = "xxx", clicks = 2 })
    .Where(a => a.Id == 1)
    .ExecuteAffrows();
// UPDATE `Topic` SET `Title` = @p_0, `Clicks` = @p_1 WHERE (Id = 1)

fsql.Update<T>()
    .SetDto(new Dictionary<string, object> { ["title"] = "xxx", ["clicks"] = 2 })
    .Where(a => a.Id == 1)
    .ExecuteAffrows();
```

## 7. Differences Set/SetSource/SetDto

These three are parallel functionalities, corresponding to:

- `Set/SetRaw`: Used when the entity is known, corresponding to `update t set x = x`.
- `SetSource`: Updates the entire entity and can be used with `UpdateColumns` or `IgnoreColumns` to specify or ignore fields.
- `SetDto`: Bulk operation for `Set`.

## 8. Dictionary Update

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.UpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
// Note: List<Dictionary<string, object>> is for bulk updates
```

## 9. Optimistic Locking

When updating entire entity data, it is easy for old data to overwrite new records in concurrent scenarios.

The principle of optimistic locking is to use a field of the entity, such as `long version`. Before updating, query the data, at which point the `version` is `1`. The generated SQL for updating will include `where version = 1`. If the modification fails (i.e., `Affrows == 0`), an exception (`DbUpdateVersionException`) is thrown.

Each entity supports only one optimistic lock property. Mark the property with the attribute: `[Column(IsVersion = true)]`.

> Applies to `SetSource` updates. Each update increments the `version` value by `1`.

## 10. Pessimistic Locking

```csharp
var user = fsql.Select<User>()
    .ForUpdate(true)
    .Where(a => a.Id == 1)
    .ToOne();
//SELECT ... FROM User a for update nowait
```

`ForUpdate` is a common syntax for Oracle/PostgreSQL/MySql. We have made special adaptations for SqlServer, and the executed SQL statement is roughly as follows:

```sql
SELECT ... FROM [User] a With(UpdLock, RowLock, NoWait)
```

## 11. ISelect.ToUpdate

`IUpdate` does not support navigation objects, multi-table associations, etc., by default. `ISelect.ToUpdate` can convert a query into `IUpdate` for updating data using navigation objects, as shown below:

```csharp
fsql.Select<T1>().Where(a => a.Options.xxx == 1)
    .ToUpdate()
    .Set(a => a.Title, "111")
    .ExecuteAffrows();
```

Note: This method does not query the data into memory before updating. The above code generates the following SQL:

```sql
UPDATE `T1` SET Title = '111' WHERE id in (select a.id from T1 a left join Options b on b.t1id = a.id where b.xxx = 1)
```

Advantages of using this method for complex updates:

- Allows previewing and testing data before updating, preventing erroneous updates.
- Supports complex update operations, such as updating the top 10 records matching the condition with `Limit(10)` on `ISelect`.

## 12. Join Table Update

v3.2.692+ (High-risk operation, high-risk operation, high-risk operation. Please use with caution and test to verify the content returned by ToSql.)

```csharp
fsql.Update<T1>()
    .Join<T2>((a, b) => a.id == b.groupid)
    .Set((a, b) => a.bname == b.name) // Fields from other tables
    .Set((a, b) => a.bcode == b.id + a.code)
    .Set(a => a.flag, 1) // Fixed value
    .Where((a, b) => a.id > 0 && b.id > 0)
    .ExecuteAffrows();
```

SQL generated by different databases may vary. For example, in MySql:

```sql
UPDATE `T1` a
INNER JOIN `T2` b ON (a.`id` = b.`groupid`)
SET a.`bname` = b.`name`, a.`bcode` = concat(b.`id`, a.`code`), a.`flag` = 1
WHERE a.`id` > 0 AND b.`id` > 0
```

More complex join table updates:

```csharp
var query = fsql.Select<T2, T3>()
    .InnerJoin(...)
    .Where(...)
    .WithTempQuery((a, b) => new { item1 = a, item2 = b });

fsql.Update<T1>()
    .Join(query, (a, b) => a.id == b.item1.groupid)
    .Set((a, b) => a.bcode == b.item2.xcode)
    .ExecuteAffrows();
```

```sql
UPDATE `T1` a
INNER JOIN (
  SELECT ...
  FROM `t2` a
  INNER JOIN ...
  Where ...
) b ON (a.`id` = b.`groupid`)
SET a.`bcode` = b.`xcode`
```

## 13. High-Performance BulkCopy

| Package | Extension Method | Description (v3.2.693) |
| -- | -- | -- |
| FreeSql.Provider.SqlServer | ExecuteSqlBulkCopy | |
| FreeSql.Provider.MySqlConnector | ExecuteMySqlBulkCopy | |
| FreeSql.Provider.Oracle | ExecuteOracleBulkCopy | |
| FreeSql.Provider.PostgreSQL | ExecutePgCopy | |
| FreeSql.Provider.Dameng | ExecuteDmBulkCopy | Dameng |
| FreeSql.Provider.KingbaseES | ExecuteKdbCopy | KingbaseES |

Principle: Use BulkCopy to insert data into a temporary table, and then use UPDATE FROM JOIN for table updates.

Tip: Significant benefits when the number of updated fields exceeds 3000.

```csharp
fsql.Update<T1>().SetSource(list).ExecuteSqlBulkCopy();
```

# API

| Method            | Return Value | Parameters               | Description                                                                      |
| ----------------- | ------------ | ------------------------ | -------------------------------------------------------------------------------- |
| SetSource         | \<this\>     | T1 \| IEnumerable\<T1\> | Updates data, sets the entities to update                                        |
| IgnoreColumns     | \<this\>     | Lambda                   | Columns to ignore                                                                 |
| Set               | \<this\>     | Lambda, value            | Sets the new value for a column, e.g., `Set(a => a.Name, "newvalue")`           |
| Set               | \<this\>     | Lambda                   | Sets the new value by incrementing, e.g., `Set(a => a.Clicks + 1)`, equivalent to clicks=clicks+1 |
| SetDto            | \<this\>     | object                   | Update method based on DTO                                                         |
| SetRaw            | \<this\>     | string, parms            | Sets value using custom SQL syntax, e.g., `SetRaw("title = @title", new { title = "newtitle" })` |
| Where             | \<this\>     | Lambda                   | Expression condition, supports only basic entity members (no navigation objects)  |
| Where             | \<this\>     | string, parms            | Native SQL condition, e.g., `Where("id = @id", new { id = 1 })`                  |
| Where             | \<this\>     | T1 \| IEnumerable\<T1\> | Pass entity or collection, using primary key as condition                          |
| CommandTimeout    | \<this\>     | int                      | Command timeout setting (seconds)                                                  |
| WithTransaction   | \<this\>     | DbTransaction            | Sets transaction object                                                             |
| WithConnection    | \<this\>     | DbConnection             | Sets connection object                                                             |
| ToSql             | string       |                          | Returns the SQL statement to be executed                                           |
| ExecuteAffrows    | long         |                          | Executes SQL statement, returns the number of affected rows                       |
| ExecuteUpdated    | List\<T1\>   |                          | Executes SQL statement, returns the updated records                               |
| Join              | IUpdateJoin   |                          | Join table update                                                                 |