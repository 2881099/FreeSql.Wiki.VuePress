# Insert Data

FreeSql provides methods for inserting data in single and batches, and it can also return the inserted records when executed in a specific database.

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

var items = new List<Topic>();
for (var a = 0; a < 10; a++) items.Add(new Topic { Id = a + 1, Title = $"newtitle{a}", Clicks = a * 100 });
```

## 1. Single Insert

```csharp
var t1 = fsql.Insert(items.First()).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`) 
//VALUES(@Clicks0, @Title0, @CreateTime0)
```

If the table has auto-increment columns, `id` will be returned after inserting data.

Method 1: (Original)
```csharp
long id = fsql.Insert(blog).ExecuteIdentity();
blog.Id = id;
```

Method 2: (depends on FreeSql.Repository)
```csharp
var repo = fsql.GetRepository<Blog>();
repo.Insert(blog);
```
> In the internal implementation, after inserting the data, the self-incremental value will be assigned to `blog.Id`

## 2. Batch Insert

```csharp
var t2 = fsql.Insert(items).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`) 
//VALUES(@Clicks0, @Title0, @CreateTime0), (@Clicks1, @Title1, @CreateTime1), 
//(@Clicks2, @Title2, @CreateTime2), (@Clicks3, @Title3, @CreateTime3), 
//(@Clicks4, @Title4, @CreateTime4), (@Clicks5, @Title5, @CreateTime5), 
//(@Clicks6, @Title6, @CreateTime6), (@Clicks7, @Title7, @CreateTime7), 
//(@Clicks8, @Title8, @CreateTime8), (@Clicks9, @Title9, @CreateTime9)
```

> The errors that are easily caused by adding SqlServer in batches have been resolved:
> ```
> The incoming request has too many parameters. The server supports a maximum of 2100 parameters. Reduce the number of parameters and resend the request.
> ```
> Principle: Split into multiple packages and execute them in transactions. 

When inserting large quantities of data, the internal logic is divided and executed in batches. The segmentation rules are as follows: 

|            | Quantity | Size of Parameters |
| ---------- | -------- | ------------------ |
| MySql      | 5000     | 3000               |
| PostgreSQL | 5000     | 3000               |
| SqlServer  | 1000     | 2100               |
| Oracle     | 500      | 999                |
| Sqlite     | 5000     | 999                |

> Quantity: It is the size of each batch of division. For example, a batch of 10,000 pieces of data will be inserted into two batches when mysql is executed.<br />
> Size of Parameters: the size of the parameter size divided into each batch. For example, when inserting 10,000 pieces of data in batches, each row needs to use 5 parameterizations, which will be divided into 3000/5 for each batch when mysql is executed.

After the execution of the split, when the external transaction is not provided, the internal transaction is opened to achieve insertion integrity. You can also set appropriate values through `BatchOptions`.

FreeSql adapts to the use of parameterization and non-parameterization of each data type. It is recommended to turn off the parameterization function for batch insertion and use `.NonoParameter()` to execute it.

## 3. ExecuteSqlBulkCopy, ExecutePgCopy, ExecuteMySqlBulkCopy and ExecuteOracleBulkCopy

Bulk Copy operation is implemented in the form of an extension method. For SqlServer/PostgreSQL/MySql/Oracle databases, the available packages are: FreeSql.Provider.SqlServer/FreeSql.Provider.PostgreSQL/FreeSql.Provider.MySqlConnector/FreeSql.Provider.Oracle.

### bulk insert test reference (52 fields)

|                                      | 18W     | 1W     | 5K     | 2K    | 1K    | 500 | 100 | 50  |
| ------------------------------------ | ------- | ------ | ------ | ----- | ----- | --- | --- | --- |
| MySql 5.5 ExecuteAffrows             | 38,481  | 2,234  | 1,136  | 284   | 239   | 167 | 66  | 30  |
| MySql 5.5 ExecuteMySqlBulkCopy       | 28,405  | 1,142  | 657    | 451   | 435   | 592 | 47  | 22  |
| SqlServer Express ExecuteAffrows     | 402,355 | 24,847 | 11,465 | 4,971 | 2,437 | 915 | 138 | 88  |
| SqlServer Express ExecuteSqlBulkCopy | 21,065  | 578    | 326    | 139   | 105   | 79  | 60  | 48  |
| PostgreSQL 10 ExecuteAffrows         | 46,756  | 3,294  | 2,269  | 1,019 | 374   | 209 | 51  | 37  |
| PostgreSQL 10 ExecutePgCopy          | 10,090  | 583    | 337    | 136   | 88    | 61  | 30  | 25  |

> Explanation of 8W: insert 180000 rows of records, and the number in the table is the execution time (unit: ms)

### bulk insert test reference (10 fields)

|                                      | 18W    | 1W    | 5K    | 2K  | 1K  | 500 | 100 | 50  |
| ------------------------------------ | ------ | ----- | ----- | --- | --- | --- | --- | --- |
| MySql 5.5 ExecuteAffrows             | 11,171 | 866   | 366   | 80  | 83  | 50  | 24  | 34  |
| MySql 5.5 ExecuteMySqlBulkCopy       | 6,504  | 399   | 257   | 116 | 87  | 100 | 16  | 16  |
| SqlServer Express ExecuteAffrows     | 47,204 | 2,275 | 1,108 | 488 | 279 | 123 | 35  | 16  |
| SqlServer Express ExecuteSqlBulkCopy | 4,248  | 127   | 71    | 30  | 48  | 14  | 11  | 10  |
| PostgreSQL 10 ExecuteAffrows         | 9,786  | 568   | 336   | 157 | 102 | 34  | 9   | 6   |
| PostgreSQL 10 ExecutePgCopy          | 4,081  | 167   | 93    | 39  | 21  | 12  | 4   | 2   |

> The test results are all based on the same operating system, and all are preheated.

## 4. Insert the specified columns

```csharp
var t3 = fsql.Insert(items).InsertColumns(a => a.Title).ExecuteAffrows();
//INSERT INTO `Topic`(`Title`) 
//VALUES(@Title0), (@Title1), (@Title2), (@Title3), (@Title4), 
//(@Title5), (@Title6), (@Title7), (@Title8), (@Title9)

var t4 = fsql.Insert(items).InsertColumns(a =>new { a.Title, a.Clicks }).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`) 
//VALUES(@Clicks0, @Title0), (@Clicks1, @Title1), (@Clicks2, @Title2), 
//(@Clicks3, @Title3), (@Clicks4, @Title4), (@Clicks5, @Title5), 
//(@Clicks6, @Title6), (@Clicks7, @Title7), (@Clicks8, @Title8), 
//(@Clicks9, @Title9)
```

## 5. Ignore the specified columns

```csharp
var t5 = fsql.Insert(items).IgnoreColumns(a => a.CreateTime).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`) 
//VALUES(@Clicks0, @Title0), (@Clicks1, @Title1), (@Clicks2, @Title2), 
//(@Clicks3, @Title3), (@Clicks4, @Title4), (@Clicks5, @Title5), 
//(@Clicks6, @Title6), (@Clicks7, @Title7), (@Clicks8, @Title8), 
//(@Clicks9, @Title9)

var t6 = fsql.Insert(items).IgnoreColumns(a => new { a.Title, a.CreateTime }).ExecuteAffrows();
///INSERT INTO `Topic`(`Clicks`) 
//VALUES(@Clicks0), (@Clicks1), (@Clicks2), (@Clicks3), (@Clicks4), 
//(@Clicks5), (@Clicks6), (@Clicks7), (@Clicks8), (@Clicks9)
```

## 6. Column Insertion Priority 

```csharp
All Columns < Specified columns (InsertColumns) < Ignored Columns (IgnoreColumns)
```

- Without using `InsertColumns/IgnoreColumns`, all columns of the entity will be inserted into the database;
- Otherwise, when using `InsertColumns` and not using `IgnoreColumns`, only the specified columns are inserted into the database;
- Otherwise, in the case of using `IgnoreColumns`, only unspecified columns are inserted into the database.

## 7. Import table data

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
limit 10
```

Note: Because `Clicks` and `CreateTime` are not selected, it'll use the value set by the target entity attribute `[Column(InsertValueSql = xx)]`, or the default value of `C#` of the target entity attribute.

## 8. `Insert Ignore Into` (MySql only)

```csharp
fsql.Insert<Topic>().MySqlIgnoreInto().AppendData(items).ExecuteAffrows();
///INSERT IGNORE INTO `Topic`(`Clicks`) 
//VALUES(@Clicks0), (@Clicks1), (@Clicks2), (@Clicks3), (@Clicks4), 
//(@Clicks5), (@Clicks6), (@Clicks7), (@Clicks8), (@Clicks9)
```

## 9. `On Duplicate Key Update` (MySql only)

[More information...](%e6%b7%bb%e5%8a%a0%e6%88%96%e4%bf%ae%e6%94%b9#mysql-%E7%89%B9%E6%9C%89%E5%8A%9F%E8%83%BD-on-duplicate-key-update)

## 10. `On Conflict Do Update` (PostgreSQL only)

[More information...](%e6%b7%bb%e5%8a%a0%e6%88%96%e4%bf%ae%e6%94%b9#postgresql-%E7%89%B9%E6%9C%89%E5%8A%9F%E8%83%BD-on-conflict-do-update)

## Reference

- [《Database Transaction》](Database-Transaction)
- [《FreeSql 101, Part 2: Delete Data》](Delete-Data)
- [《FreeSql 101, Part 3: Update Data》](Update-Data)
- [《FreeSql 101, Part 4: Query Data》](Query-Data)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《Sharding Tables and Database》](Sharding-Tables-and-Database)
- [《Tenant》](Tenant)

## API

| Methods                                                               | Return                     | Parameters              | Description                                                                                                          |
| --------------------------------------------------------------------- | -------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| AppendData                                                            | \<this\>                   | T1 \| IEnumerable\<T1\> | Append the entity to be inserted                                                                                     |
| InsertIdentity                                                        | \<this\>                   | None                    | Specify the insert auto-increment column                                                                             |
| InsertColumns                                                         | \<this\>                   | Lambda                  | Specify the inserted columns                                                                                         |
| IgnoreColumns                                                         | \<this\>                   | Lambda                  | Specify the ignored columns                                                                                          |
| CommandTimeout                                                        | \<this\>                   | int                     | Command timeout setting (seconds)                                                                                    |
| WithTransaction                                                       | \<this\>                   | DbTransaction           | Set transaction object                                                                                               |
| WithConnection                                                        | \<this\>                   | DbConnection            | Set the connection object                                                                                            |
| ToSql                                                                 | string                     |                         | Return the SQL statement to be executed.                                                                             |
| [OnDuplicateKeyUpdate](%e6%b7%bb%e5%8a%a0%e6%88%96%e4%bf%ae%e6%94%b9) | OnDuplicateKeyUpdate\<T1\> | None                    | MySql only. `On Duplicate Key Update`                                                                                |
| [OnConflictDoUpdate](%e6%b7%bb%e5%8a%a0%e6%88%96%e4%bf%ae%e6%94%b9)   | OnConflictDoUpdate\<T1\>   | None                    | PostgreSQL only. `On Conflict Do Update`                                                                             |
| ExecuteAffrows                                                        | long                       |                         | Execute SQL and return the number of rows affected.                                                                  |
| ExecuteIdentity                                                       | long                       |                         | Execute SQL and return the incremented value.                                                                        |
| ExecuteInserted                                                       | List\<T1\>                 |                         | Execute SQL and return the inserted records.                                                                         |
| ExecuteSqlBulkCopy                                                    | void                       |                         | SqlServer only. To execute BulkCopy to import data in batches, you need to reference `FreeSql.Provider.SqlServer`    |
| ExecutePgCopy                                                         | void                       |                         | PostgreSQL only. To execute BulkCopy to import data in batches, you need to reference `FreeSql.Provider.PostgreSQL`  |
| ExecuteMySqlBulkCopy                                                  | void                       |                         | MySql only. To execute BulkCopy to import data in batches, you need to reference `FreeSql.Provider.MysqlConnector`   |
| ExecuteOracleBulkCopy                                                 | void                       |                         | Oracle only. To execute BulkCopy to import data in batches, you need to reference `FreeSql.Provider.Oracle`          |
| ExecuteDmBulkCopy                                                     | void                       |                         | Dameng database only. To execute BulkCopy to import data in batches, you need to reference `FreeSql.Provider.Dameng` |
