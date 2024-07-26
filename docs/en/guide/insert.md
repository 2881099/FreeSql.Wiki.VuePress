# Insert

```csharp
IFreeSql fsql; // For creation details, please refer to the getting started document

class Topic
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}

var items = new List<Topic>();
for (var a = 0; a < 10; a++) items.Add(new Topic { Title = $"newtitle{a}", Clicks = a * 100 });
```

## 1. Single Insert

```csharp
var t1 = fsql.Insert(items[0]).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`)
//VALUES(?Clicks0, ?Title0, ?CreateTime0)
```

## 2. Return Auto-Incremented Value

If the table has an auto-increment column, the ID should be returned after inserting data.

Method 1: (Raw)

```csharp
long id = fsql.Insert(items[0]).ExecuteIdentity();
items[0].Id = id;
```

Method 2: (Using FreeSql.Repository)

```csharp
IBaseRepository<Topic> repo = fsql.GetRepository<Topic>();  // Can be obtained from the IOC container
repo.Insert(items[0]);
```

> The repository will fill the auto-incremented value into items[0].Id (supports batch insert backfill)

> DbFirst mode sequence: [Column(IsIdentity = true, InsertValueSql = "seqname.nextval")]

## 3. Batch Insert

```csharp
var t2 = fsql.Insert(items).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`)
//VALUES(?Clicks0, ?Title0, ?CreateTime0), (?Clicks1, ?Title1, ?CreateTime1),
//(?Clicks2, ?Title2, ?CreateTime2), (?Clicks3, ?Title3, ?CreateTime3),
//(?Clicks4, ?Title4, ?CreateTime4), (?Clicks5, ?Title5, ?CreateTime5),
//(?Clicks6, ?Title6, ?CreateTime6), (?Clicks7, ?Title7, ?CreateTime7),
//(?Clicks8, ?Title8, ?CreateTime8), (?Clicks9, ?Title9, ?CreateTime9)
```

It is recommended to turn off parameterization when batch inserting by using `.NoneParameter()` to improve execution efficiency.

When inserting a large amount of data, the internal operations are split into batches according to the following rules:

|            | Quantity | Parameter Count |
| ---------- | -------- | --------------- |
| MySql      | 5000     | 3000            |
| PostgreSQL | 5000     | 3000            |
| SqlServer  | 1000     | 2100            |
| Oracle     | 500      | 999             |
| Sqlite     | 5000     | 999             |

You can also set appropriate values through `BatchOptions`. When no external transaction is provided, an internal transaction is opened to ensure insert integrity.

## 4. High-Performance BulkCopy

| Package                   | Extension Method        | Description |
| ------------------------- | ------------------------ | ----------- |
| FreeSql.Provider.SqlServer | ExecuteSqlBulkCopy      |             |
| FreeSql.Provider.MySqlConnector | ExecuteMySqlBulkCopy  |             |
| FreeSql.Provider.Oracle   | ExecuteOracleBulkCopy   |             |
| FreeSql.Provider.PostgreSQL | ExecutePgCopy          |             |
| FreeSql.Provider.Dameng   | ExecuteDmBulkCopy       | Dameng      |
| FreeSql.Provider.KingbaseES | ExecuteKdbCopy          | KingbaseES  |

Batch Insert Performance Test Reference (52 Fields)

|                                | 180K   | 10K    | 5K    | 2K    | 1K    | 500  | 100  | 50   |
| ------------------------------ | ------ | ------ | ----- | ----- | ----- | ---- | ---- | ---- |
| MySql 5.5 ExecuteAffrows       | 38,481 | 2,234  | 1,136 | 284   | 239   | 167  | 66   | 30   |
| MySql 5.5 ExecuteMySqlBulkCopy | 28,405 | 1,142  | 657   | 451   | 435   | 592  | 47   | 22   |
| SqlServer Express ExecuteAffrows | 402,355 | 24,847 | 11,465 | 4,971 | 2,437 | 915  | 138  | 88   |
| SqlServer Express ExecuteSqlBulkCopy | 21,065 | 578   | 326   | 139   | 105   | 79   | 60   | 48   |
| PostgreSQL 10 ExecuteAffrows   | 46,756 | 3,294  | 2,269 | 1,019 | 374   | 209  | 51   | 37   |
| PostgreSQL 10 ExecutePgCopy    | 10,090 | 583    | 337   | 136   | 88    | 61   | 30   | 25   |

> 180K Explanation: Inserting 180,000 rows, the numbers in the table represent execution time (ms).

Batch Insert Performance Test Reference (10 Fields)

|                                | 180K   | 10K   | 5K    | 2K   | 1K   | 500  | 100  | 50   |
| ------------------------------ | ------ | ----- | ----- | ---- | ---- | ---- | ---- | ---- |
| MySql 5.5 ExecuteAffrows       | 11,171 | 866   | 366   | 80   | 83   | 50   | 24   | 34   |
| MySql 5.5 ExecuteMySqlBulkCopy | 6,504  | 399   | 257   | 116  | 87   | 100  | 16   | 16   |
| SqlServer Express ExecuteAffrows | 47,204 | 2,275 | 1,108 | 488  | 279  | 123  | 35   | 16   |
| SqlServer Express ExecuteSqlBulkCopy | 4,248 | 127   | 71    | 30   | 48   | 14   | 11   | 10   |
| PostgreSQL 10 ExecuteAffrows   | 9,786  | 568   | 336   | 157  | 102  | 34   | 9    | 6    |
| PostgreSQL 10 ExecutePgCopy    | 4,081  | 167   | 93    | 39   | 21   | 12   | 4    | 2    |

> Test results are performed under the same operating system and all have been warmed up.

## 5. Dynamic Table Names

```csharp
fsql.Insert(items).AsTable("Topic_201903").ExecuteAffrows(); // Insert into Topic_201903 table
```

## 6. Insert Specified Columns

```csharp
var t3 = fsql.Insert(items).InsertColumns(a => a.Title).ExecuteAffrows();
//INSERT INTO `Topic`(`Title`)
//VALUES(?Title0), (?Title1), (?Title2), (?Title3), (?Title4),
//(?Title5), (?Title6), (?Title7), (?Title8), (?Title9)

var t4 = fsql.Insert(items).InsertColumns(a => new { a.Title, a.Clicks }).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`)
//VALUES(?Clicks0, ?Title0), (?Clicks1, ?Title1), (?Clicks2, ?Title2),
//(?Clicks3, ?Title3), (?Clicks4, ?Title4), (?Clicks5, ?Title5),
//(?Clicks6, ?Title6), (?Clicks7, ?Title7), (?Clicks8, ?Title8),
//(?Clicks9, ?Title9)
```

## 7. Ignore Columns

```csharp
var t5 = fsql.Insert(items).IgnoreColumns(a => a.CreateTime).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`)
//VALUES(?Clicks0, ?Title0), (?Clicks1, ?Title1), (?Clicks2, ?Title2),
//(?Clicks3, ?Title3), (?Clicks4, ?Title4), (?Clicks5, ?Title5),
//(?Clicks6, ?Title6), (?Clicks7, ?Title7), (?Clicks8, ?Title8),
//(?Clicks9, ?Title9)

var t6 = fsql.Insert(items).IgnoreColumns(a => new { a.Title, a.CreateTime }).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`)
//VALUES(?Clicks0), (?Clicks1), (?Clicks2), (?Clicks3), (?Clicks4),
//(?Clicks5), (?Clicks6), (?Clicks7), (?Clicks8), (?Clicks9)
```

## 8. Dictionary Insertion

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
// Note: List<Dictionary<string, object>> is for batch insertion
```

## 9. Import Table

```csharp
int affrows = fsql.Select<Topic>()
    .Limit(10)
    .InsertInto(null, a => new Topic2
    {
        Title = a.Title
    });
```

```sql
INSERT INTO `Topic2`(`Title`, `Clicks`, `CreateTime`)
SELECT a.`Title`, 0, '0001-01-01 00:00:00'
FROM `Topic` a
LIMIT 10
```

Note: Since `Clicks` and `CreateTime` are not selected, values set using the target entity property `[Column(InsertValueSql = xx)]`, or default values of the target entity properties in C# will be used.

## 10. MySql `Insert Ignore Into`

```csharp
fsql.Insert<Topic>().MySqlIgnoreInto().AppendData(items).ExecuteAffrows();
///INSERT IGNORE INTO `Topic`(`Clicks`)
//VALUES(?Clicks0), (?Clicks1), (?Clicks2), (?Clicks3), (?Clicks4),
//(?Clicks5), (?Clicks6), (?Clicks7), (?Clicks8), (?Clicks9)
```

## 11. MySql `On Duplicate Key Update`

FreeSql.Provider.MySql and FreeSql.Provider.MySqlConnector support the MySQL-specific feature `On Duplicate Key Update`, which implements inserting or updating data (supports batch operations).

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

| Method Name           | Description |
| --------------------- | ----------- |
| IgnoreColumns         | Ignore the columns to be updated, similar to `IUpdate.IgnoreColumns` |
| UpdateColumns         | Specify the columns to be updated, similar to `IUpdate.UpdateColumns` |
| Set                   | Manually specify the columns to be updated, similar to `IUpdate.Set` |
| SetRaw                | Supplement to `Set` method, can pass SQL strings |
| ToSql                 | Return the SQL statement to be executed |
| ExecuteAffrows        | Execute and return the number of affected rows |

Both `IInsert` and `OnDuplicateKeyUpdate` have `IgnoreColumns` and `UpdateColumns` methods.

When inserting entities or entity collections, and the `time` column is ignored, the code is as follows:

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

We find that the `UPDATE time` part becomes a constant, rather than `VALUES(\`time\`)`. The mechanism is as follows:

When columns exist in the `insert` part, they will be set in the `update` part as `VALUES(\`field\`)`;

When columns do not exist in the `insert` part, they will be set as constants in the `update` part. When operating on entity arrays, this constant will be executed as `case when ... end` (similar to `IUpdate`).

## 12. PostgreSQL `On Conflict Do Update`

FreeSql.Provider.PostgreSQL supports PostgreSQL 9.5+ specific feature `On Conflict(id) Do Update`, which is used similarly to MySQL's `OnDuplicateKeyUpdate`.

```csharp
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

## API

| Method                | Return Value                | Parameters                | Description                                           |
| --------------------- | --------------------------- | ------------------------- | ----------------------------------------------------- |
| AppendData            | \<this\>                    | T1 \| IEnumerable\<T1\>  | Append entities to be inserted                      |
| InsertIdentity        | \<this\>                    | None                      | Specify auto-increment column                        |
| InsertColumns         | \<this\>                    | Lambda                    | Columns to be inserted                               |
| IgnoreColumns         | \<this\>                    | Lambda                    | Columns to be ignored                                |
| IgnoreInsertValueSql  | \<this\>                    | Lambda                    | Columns with `InsertValueSql` to be ignored          |
| CommandTimeout        | \<this\>                    | int                       | Command timeout setting (seconds)                    |
| WithTransaction       | \<this\>                    | DbTransaction             | Set transaction object                               |
| WithConnection        | \<this\>                    | DbConnection              | Set connection object                                |
| ToSql                 | string                      |                           | Return the SQL statement to be executed              |
| OnDuplicateKeyUpdate  | OnDuplicateKeyUpdate\<T1\>  | None                      | MySQL-specific feature `On Duplicate Key Update`     |
| OnConflictDoUpdate    | OnConflictDoUpdate\<T1\>    | None                      | PostgreSQL-specific feature `On Conflict Do Update`  |
| ExecuteAffrows        | long                        |                           | Execute SQL statement and return the number of affected rows |
| ExecuteIdentity       | long                        |                           | Execute SQL statement and return auto-increment value |
| ExecuteInserted       | List\<T1\>                  |                           | Execute SQL statement and return the inserted records |
| ExecuteSqlBulkCopy    | void                        |                           | SQL Server-specific feature, execute `SqlBulkCopy` batch insert |
| ExecutePgCopy         | void                        |                           | PostgreSQL-specific feature, execute `Copy` batch import data |