
# Insert Or Update

## 1. IFreeSql.InsertOrUpdate

`IFreeSql` defines the `InsertOrUpdate` method, which uses the characteristics and functions of the database to implement the added or modified functions. (since 1.5.0)

| Database   | Features                |     | Database          | Features              |
| ---------- | ----------------------- | --- | ----------------- | --------------------- |
| MySql      | on duplicate key update |     | Dameng            | merge into            |
| PostgreSQL | on conflict do update   |     | Kingbase ES       | on conflict do update |
| SqlServer  | merge into              |     | Shentong Database | merge into            |
| Oracle     | merge into              |     | MsAccess          | not support           |
| Sqlite     | replace into            |     |                   |                       |
| Firebird   | merge into              |     |                   |                       |

```csharp
fsql.InsertOrUpdate<T>()
  .SetSource(items) //Data to be processed
  //.IfExistsDoNothing() //If the data exists, do nothing (that means, insert the data if and only if the data does not exist)
  .ExecuteAffrows();
```

When the entity class has auto-increment properties, batch `InsertOrUpdate` can be split into two executions at most. Internally, FreeSql will calculate the data without self-increment and with self-increment, and execute the two commands of `insert into` and `merge into` mentioned above (using transaction execution). 

Note: the common repository in `FreeSql.Repository` also has `InsertOrUpdate` method, but their mechanism is different. 

---

## 2. InsertOrUpdate in `FreeSql.Repository` 

To use this method, you need to reference the `FreeSql.Repository` or `FreeSql.DbContext` extensions package.

```csharp
var repo = fsql.GetRepository<T>();
repo.InsertOrUpdate(YOUR_ENTITY);
```

If there is data in the internal state management, then update it.

If there is no data in the internal state management, query the database to determine whether it exists.

> Update if it exists, insert if it doesn't exist

Disadvantages: does not support batch operations

---

## 3. Batch Editing: `BeginEdit`

```csharp
[Fact]
public void BeginEdit()
{
    fsql.Delete<BeginEdit01>().Where("1=1").ExecuteAffrows();
    var repo = fsql.GetRepository<BeginEdit01>();
    var cts = new[] {
        new BeginEdit01 { Name = "Category1" },
        new BeginEdit01 { Name = "Category1_1" },
        new BeginEdit01 { Name = "Category1_2" },
        new BeginEdit01 { Name = "Category1_3" },
        new BeginEdit01 { Name = "Category2" },
        new BeginEdit01 { Name = "Category2_1" },
        new BeginEdit01 { Name = "Category2_2" }
    }.ToList();
    repo.Insert(cts);

    repo.BeginEdit(cts); //Start editing `cts`

    cts.Add(new BeginEdit01 { Name = "Category2_3" });
    cts[0].Name = "123123";
    cts.RemoveAt(1);

    Assert.Equal(3, repo.EndEdit());
}
class BeginEdit01
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
```

When the above code `EndEdit` method is executed, 3 SQL statements are generated, as follows:

```sql
INSERT INTO "BeginEdit01"("Id", "Name") VALUES('5f26bf07-6ac3-cbe8-00da-7dd74818c3a6', 'Category2_3')


UPDATE "BeginEdit01" SET "Name" = '123123' 
WHERE ("Id" = '5f26bf00-6ac3-cbe8-00da-7dd01be76e26')


DELETE FROM "BeginEdit01" WHERE ("Id" = '5f26bf00-6ac3-cbe8-00da-7dd11bcf54dc')
```

Use case: In winform, after loading the table data, perform some operations such as adding, modifying, and deleting, and then click [Save]

Note: This operation is only valid for the variable `cts`, not for comparison and update of the entire table.

## 4. `On Duplicate Key Update` (MySql only)

`FreeSql.Provider.MySql` and `FreeSql.Provider.MySqlConnector` support MySql's unique function `On Duplicate Key Update`.

This function can also insert or update data, and supports batch operations.

```csharp
class TestOnDuplicateKeyUpdateInfo {
    [Column(IsIdentity = true)]
    public int id { get; set; }
    public string title { get; set; }
    public DateTime time { get; set; }
}

var item = new TestOnDuplicateKeyUpdateInfo { id = 100, title = "title-100", time = DateTime.Parse("2000-01-01") };
fsql.Insert(item)
    .NoneParameter()
    .OnDuplicateKeyUpdate().ToSql();
//INSERT INTO `TestOnDuplicateKeyUpdateInfo`(`id`, `title`, `time`) VALUES(100, 'title-100', '2000-01-01 00:00:00.000')
//ON DUPLICATE KEY UPDATE
//`title` = VALUES(`title`), 
//`time` = VALUES(`time`)
```

Methods that can be called after `OnDuplicateKeyUpdate()`:

| Method         | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| IgnoreColumns  | Ignore updated columns, the mechanism is the same as `IUpdate.IgnoreColumns`  |
| UpdateColumns  | Specify updated columns, the mechanism is the same as `IUpdate.UpdateColumns` |
| Set            | Manually specify the updated column, the same function as `IUpdate.Set`       |
| SetRaw         | As a supplement to the `Set` method, SQL strings can be passed in.            |
| ToSql          | Return the SQL statement to be executed                                       |
| ExecuteAffrows | Execute and return the number of rows affected                                |

Both `IInsert` and `OnDuplicateKeyUpdate` have `IgnoreColumns` and `UpdateColumns` methods.

When inserting an entity or a set of entities, the `time` column is ignored, the code is as follows:

```csharp
fsql.Insert(item)
    .IgnoreColumns(a => a.time)
    .NoneParameter()
    .OnDuplicateKeyUpdate().ToSql();
//INSERT INTO `TestOnDuplicateKeyUpdateInfo`(`id`, `title`) VALUES(200, 'title-200')
//ON DUPLICATE KEY UPDATE
//`title` = VALUES(`title`), 
//`time` = '2000-01-01 00:00:00.000'
```

We found that the `UPDATE time` part became a constant instead of **VALUES(\`time\`)**. The mechanism is as follows:

When there are columns in the `insert` part, they will be set in the form of VALUES(\`field\`) in the `update`;

When a column that does not exist in the `insert` part, it will be set as a constant in the `update`. When manipulating the entity array, this constant is executed for `case when ... end` (same as `IUpdate`);

---

## 5. `On Conflict Do Update` (PostgreSQL only)

`FreeSql.Provider.PostgreSQL` supports PostgreSQL 9.5+ unique function `On Conflict(id) Do Update`.

The usage method is roughly the same as that of MySql's `OnDuplicateKeyUpdate`.

```csharp
class TestOnConflictDoUpdateInfo {
    [Column(IsIdentity = true)]
    public int id { get; set; }
    public string title { get; set; }
    public DateTime? time { get; set; }
}

var items = new [] {
    new TestOnConflictDoUpdateInfo { id = 200, title = "title-200", time = DateTime.Parse("2000-01-01") },
    new TestOnConflictDoUpdateInfo { id = 201, title = "title-201", time = DateTime.Parse("2000-01-01") },
    new TestOnConflictDoUpdateInfo { id = 202, title = "title-202", time = DateTime.Parse("2000-01-01") }
};
fsql.Insert(items)
    .IgnoreColumns(a => a.time)
    .NoneParameter()
    .OnConflictDoUpdate().ToSql();
//INSERT INTO ""testonconflictdoupdateinfo""(""id"", ""title"") VALUES(200, 'title-200'), (201, 'title-201'), (202, 'title-202')
//ON CONFLICT(""id"") DO UPDATE SET
//""title"" = EXCLUDED.""title"", 
//""time"" = CASE EXCLUDED.""id"" 
//WHEN 200 THEN '2000-01-01 00:00:00.000000' 
//WHEN 201 THEN '2000-01-01 00:00:00.000000' 
//WHEN 202 THEN '2000-01-01 00:00:00.000000' END::timestamp
```
