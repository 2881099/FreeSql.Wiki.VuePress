# Insert or Update

## 1. IFreeSql.InsertOrUpdate

IFreeSql defines the `InsertOrUpdate` method to handle insert or update operations, utilizing database-specific features:

| Database   | Features                |     | Database | Features              |
| ---------- | ----------------------- | --- | -------- | --------------------- |
| MySql      | on duplicate key update |     | DM       | merge into            |
| PostgreSQL | on conflict do update   |     | Kingbase | on conflict do update |
| SqlServer  | merge into              |     | ShengTong | merge into            |
| Oracle     | merge into              |     | Nanda General | merge into            |
| Sqlite     | replace into            |     | MsAccess | Not supported          |
| Firebird   | merge into              |     |          |                       |
| DuckDB     | on conflict do update   |     |          |                       |

```csharp
fsql.InsertOrUpdate<T>()
    .SetSource(items) // Data to be processed
    //.IfExistsDoNothing() // If data exists, do nothing (equivalent to insert only if data does not exist)
    //.UpdateSet((a, b) => a.Count == b.Count + 10) // Join table update
    .ExecuteAffrows();
// Defaults to relying on the IsPrimary attribute of the entity, for temporary primary keys use SetSource(items, a => a.Code)

// Or..
var sql = fsql.Select<T2, T3>()
    .ToSql((a, b) => new
    {
      id = a.id + 1,
      name = "xxx"
    }, FieldAliasOptions.AsProperty);

fsql.InsertOrUpdate<T>()
    .SetSource(sql)
    .ExecuteAffrows();
```

When the entity class has auto-increment properties, bulk `InsertOrUpdate` may be split into two executions, with the system internally computing records with unset and set auto-increment values, executing `insert into` and `merge into` commands (using transactions).

Note: The FreeSql.Repository generic repository also has an `InsertOrUpdate` method, but its mechanism is different.

---

## 2. Dictionary Insert or Update

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertOrUpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
// (Generates SQL as above)
// Note: List<Dictionary<string, object>> for batch updates
```

---

## 3. High-Performance BulkCopy

| Package | Extension Method        | Description (v3.2.693) |
| ------- | ----------------------- | ----------------------- |
| FreeSql.Provider.SqlServer | ExecuteSqlBulkCopy | |
| FreeSql.Provider.MySqlConnector | ExecuteMySqlBulkCopy | |
| FreeSql.Provider.Oracle | ExecuteOracleBulkCopy | |
| FreeSql.Provider.Dameng | ExecuteDmBulkCopy | DM |
| FreeSql.Provider.PostgreSQL | ExecutePgCopy | |
| FreeSql.Provider.KingbaseES | ExecuteKdbCopy | Kingbase |

Principle: Use BulkCopy to insert data into a temporary table, then use MERGE INTO for join operations.

Note: Significant benefits when the number of updated fields exceeds 3000.

```csharp
fsql.InsertOrUpdate<T1>().SetSource(list).ExecuteSqlBulkCopy();
```

```sql
SELECT ... INTO #temp_T1 FROM [T1] WHERE 1=2

MERGE INTO [T1] t1 USING (select * from #temp_user1) t2 ON (t1.[id] = t2.[id])
WHEN MATCHED THEN
  update set ...
WHEN NOT MATCHED THEN
  insert (...)
  values (...);

DROP TABLE #temp_user1
```

---

## 4. Table BeginEdit

```csharp
var list = fsql.Select<T>().Where(...).ToList();

var repo = fsql.GetRepository<T>();
repo.BeginEdit(list); // Start editing list

list.Add(new T { Name = "Category2_3" });
list[0].Name = "123123";
list.RemoveAt(1);

repo.EndEdit(); // Overloaded method for new and old comparisons repo.EndEdit(newlist)

class T
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
```

The `EndEdit` method above generates 3 SQL statements as follows:

```sql
INSERT INTO "T"("Id", "Name") VALUES('5f26bf07-6ac3-cbe8-00da-7dd74818c3a6', 'Category2_3')


UPDATE "T" SET "Name" = '123123'
WHERE ("Id" = '5f26bf00-6ac3-cbe8-00da-7dd01be76e26')


DELETE FROM "T" WHERE ("Id" = '5f26bf00-6ac3-cbe8-00da-7dd11bcf54dc')
```

Scenario: After loading table data in WinForms, perform a series of add, modify, and delete operations, then click [Save].

Reminder: This operation only affects the variable list and is not intended for full table comparison updates.

## 5. MySql `On Duplicate Key Update`

FreeSql.Provider.MySql and FreeSql.Provider.MySqlConnector support MySql's unique `On Duplicate Key Update` functionality to perform insert or update operations (batch supported).

```csharp
class TestInfo
{
    [Column(IsIdentity = true)]
    public int id { get; set; }
    public string title { get; set; }
    public DateTime time { get; set; }
}

var item = new TestInfo { id = 100, title = "title-100", time = DateTime.Parse("2000-01-01") };
fsql.Insert(item)
    .NoneParameter()
    .OnDuplicateKeyUpdate().ToSql();
//INSERT INTO `TestInfo`(`id`, `title`, `time`) VALUES(100, 'title-100', '2000-01-01 00:00:00.000')
//ON DUPLICATE KEY UPDATE
//`title` = VALUES(`title`), 
//`time` = VALUES(`time`)
```

Methods that can be called after `OnDuplicateKeyUpdate()`:

| Method Name | Description |
| ----------- | ----------- |
| IgnoreColumns | Ignore columns to update, similar to `IUpdate.IgnoreColumns` |
| UpdateColumns | Specify columns to update, similar to `IUpdate.UpdateColumns` |
| Set | Manually specify columns to update, similar to `IUpdate.Set` |
| SetRaw | Supplement to the `Set` method, can pass SQL strings |
| ToSql | Returns the SQL statement to be executed |
| ExecuteAffrows | Executes and returns the number of affected rows |

Both `IInsert` and `OnDuplicateKeyUpdate` have `IgnoreColumns` and `UpdateColumns` methods.

When inserting an entity/collection, if the `time` column is ignored, the code is as follows:

```csharp
fsql.Insert(item)
    .IgnoreColumns(a => a.time)
    .NoneParameter()
    .OnDuplicateKeyUpdate().ToSql();
//INSERT INTO `TestInfo`(`id`, `title`) VALUES(200, 'title-200')
//ON DUPLICATE KEY UPDATE
//`title` = VALUES(`title`), 
//`time` = '2000-01-01 00:00:00.000'
```

We observe that the UPDATE time part becomes a constant, rather than `VALUES(\`time\`)`, as follows:

When columns exist in the insert part, they are set as `VALUES(\`field\`)` in the update part;

When columns do not exist in the insert part, they are set as constants in the update part. When operating on entity arrays, this constant is executed with `case when ... end` (same as `IUpdate`).

---

## 6. PostgreSQL `On Conflict Do Update`

FreeSql.Provider.PostgreSQL supports PostgreSQL 9.5+ specific `On Conflict(id) Do Update` functionality, similar to MySql's `OnDuplicateKeyUpdate`.

```csharp
class TestInfo {
    [Column(IsIdentity = true)]
    public int id { get; set; }
    public string title { get; set; }
    public DateTime? time { get; set; }
}

var items = new [] {
    new TestInfo { id = 200, title = "title-200", time = DateTime.Parse("2000-01-01") },
    new TestInfo { id = 201, title = "title-201", time = DateTime.Parse("2000-01-01") },
    new TestInfo { id = 202, title = "title-202", time = DateTime.Parse("2000-01-01") }
};
fsql.Insert(items)
    .IgnoreColumns(a => a.time)
    .NoneParameter()
    .OnConflictDoUpdate().ToSql();
//INSERT INTO ""TestInfo""(""id"", ""title"") VALUES(200, 'title-200'), (201, 'title-201'), (202, 'title-202')
//ON CONFLICT(""id"") DO UPDATE SET
//""title"" = EXCLUDED.""title"",
//""time"" = CASE EXCLUDED.""id""
//WHEN 200 THEN '2000-01-01 00:00:00.000000'
//WHEN 201 THEN '2000-01-01 00:00:00.000000'
//WHEN 202 THEN '2000-01-01 00:00:00.000000' END::timestamp
```