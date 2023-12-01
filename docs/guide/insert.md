# 新增

`FreeSql` 提供单条和批量插入数据的方法，在特定的数据库执行还可以返回插入后的记录。

```csharp
var connectionString = "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;" +
    "Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10";

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

var items = new List<Topic>();
for (var a = 0; a < 10; a++) items.Add(new Topic { Title = $"newtitle{a}", Clicks = a * 100 });
```

## 1、单条插入

```csharp
var t1 = fsql.Insert(items[0]).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`)
//VALUES(?Clicks0, ?Title0, ?CreateTime0)
```

如果表有自增列，插入数据后应该要返回 id。

方法 1：(原始)

```csharp
long id = fsql.Insert(items[0]).ExecuteIdentity();
items[0].Id = id;
```

方法 2：(依赖 FreeSql.Repository)

```csharp
var repo = fsql.GetRepository<Topic>();
repo.Insert(items[0]);
```

> 内部会将插入后的自增值填充给 items[0].Id (支持批量插入回填)

> DbFirst 模式序列：[Column(IsIdentity = true, InsertValueSql = "seqname.nextval")]

## 2、批量插入

```csharp
var t2 = fsql.Insert(items).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`)
//VALUES(?Clicks0, ?Title0, ?CreateTime0), (?Clicks1, ?Title1, ?CreateTime1),
//(?Clicks2, ?Title2, ?CreateTime2), (?Clicks3, ?Title3, ?CreateTime3),
//(?Clicks4, ?Title4, ?CreateTime4), (?Clicks5, ?Title5, ?CreateTime5),
//(?Clicks6, ?Title6, ?CreateTime6), (?Clicks7, ?Title7, ?CreateTime7),
//(?Clicks8, ?Title8, ?CreateTime8), (?Clicks9, ?Title9, ?CreateTime9)
```

> 解决了 SqlServer 批量添加容易导致的错误：传入的请求具有过多的参数。该服务器支持最多 2100 个参数。请减少参数的数目，然后重新发送该请求。

> 原理为拆成多个包用事务执行；

当插入大批量数据时，内部采用分割分批执行的逻辑进行。分割规则如下：

|            | 数量 | 参数量 |
| ---------- | ---- | ------ |
| MySql      | 5000 | 3000   |
| PostgreSQL | 5000 | 3000   |
| SqlServer  | 1000 | 2100   |
| Oracle     | 500  | 999    |
| Sqlite     | 5000 | 999    |

> 数量：为每批分割的大小，如批量插入 10000 条数据，在 mysql 执行时会分割为两批。<br />
> 参数量：为每批分割的参数量大小，如批量插入 10000 条数据，每行需要使用 5 个参数化，在 mysql 执行时会分割为每批 3000 / 5。

分割执行后，当外部未提供事务时，内部自开事务，实现插入完整性。也可以通过 BatchOptions 设置合适的值。

FreeSql 适配了每一种数据类型参数化，和不参数化的使用。批量插入建议关闭参数化功能，使用 .NoneParameter() 进行执行。

## 3、BulkCopy

| 程序包 | 扩展方法 | 说明 |
| -- | -- | -- |
| FreeSql.Provider.SqlServer | ExecuteSqlBulkCopy | |
| FreeSql.Provider.MySqlConnector | ExecuteMySqlBulkCopy | |
| FreeSql.Provider.Oracle | ExecuteOracleBulkCopy | |
| FreeSql.Provider.Dameng | ExecuteDmBulkCopy | 达梦 |
| FreeSql.Provider.PostgreSQL | ExecutePgCopy | |
| FreeSql.Provider.KingbaseES | ExecuteKdbCopy | 人大金仓 |

批量插入测试参考(52 个字段)

|                                      | 18W     | 1W     | 5K     | 2K    | 1K    | 500 | 100 | 50  |
| ------------------------------------ | ------- | ------ | ------ | ----- | ----- | --- | --- | --- |
| MySql 5.5 ExecuteAffrows             | 38,481  | 2,234  | 1,136  | 284   | 239   | 167 | 66  | 30  |
| MySql 5.5 ExecuteMySqlBulkCopy       | 28,405  | 1,142  | 657    | 451   | 435   | 592 | 47  | 22  |
| SqlServer Express ExecuteAffrows     | 402,355 | 24,847 | 11,465 | 4,971 | 2,437 | 915 | 138 | 88  |
| SqlServer Express ExecuteSqlBulkCopy | 21,065  | 578    | 326    | 139   | 105   | 79  | 60  | 48  |
| PostgreSQL 10 ExecuteAffrows         | 46,756  | 3,294  | 2,269  | 1,019 | 374   | 209 | 51  | 37  |
| PostgreSQL 10 ExecutePgCopy          | 10,090  | 583    | 337    | 136   | 88    | 61  | 30  | 25  |

> 18W 解释：插入 18 万行记录，表格中的数字是执行时间（单位 ms）

批量插入测试参考(10 个字段)

|                                      | 18W    | 1W    | 5K    | 2K  | 1K  | 500 | 100 | 50  |
| ------------------------------------ | ------ | ----- | ----- | --- | --- | --- | --- | --- |
| MySql 5.5 ExecuteAffrows             | 11,171 | 866   | 366   | 80  | 83  | 50  | 24  | 34  |
| MySql 5.5 ExecuteMySqlBulkCopy       | 6,504  | 399   | 257   | 116 | 87  | 100 | 16  | 16  |
| SqlServer Express ExecuteAffrows     | 47,204 | 2,275 | 1,108 | 488 | 279 | 123 | 35  | 16  |
| SqlServer Express ExecuteSqlBulkCopy | 4,248  | 127   | 71    | 30  | 48  | 14  | 11  | 10  |
| PostgreSQL 10 ExecuteAffrows         | 9,786  | 568   | 336   | 157 | 102 | 34  | 9   | 6   |
| PostgreSQL 10 ExecutePgCopy          | 4,081  | 167   | 93    | 39  | 21  | 12  | 4   | 2   |

> 测试结果，是在相同操作系统下进行的，并且都有预热

## 4、插入指定的列

```csharp
var t3 = fsql.Insert(items).InsertColumns(a => a.Title).ExecuteAffrows();
//INSERT INTO `Topic`(`Title`)
//VALUES(?Title0), (?Title1), (?Title2), (?Title3), (?Title4),
//(?Title5), (?Title6), (?Title7), (?Title8), (?Title9)

var t4 = fsql.Insert(items).InsertColumns(a =>new { a.Title, a.Clicks }).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`)
//VALUES(?Clicks0, ?Title0), (?Clicks1, ?Title1), (?Clicks2, ?Title2),
//(?Clicks3, ?Title3), (?Clicks4, ?Title4), (?Clicks5, ?Title5),
//(?Clicks6, ?Title6), (?Clicks7, ?Title7), (?Clicks8, ?Title8),
//(?Clicks9, ?Title9)
```

## 5、忽略列

```csharp
var t5 = fsql.Insert(items).IgnoreColumns(a => a.CreateTime).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`)
//VALUES(?Clicks0, ?Title0), (?Clicks1, ?Title1), (?Clicks2, ?Title2),
//(?Clicks3, ?Title3), (?Clicks4, ?Title4), (?Clicks5, ?Title5),
//(?Clicks6, ?Title6), (?Clicks7, ?Title7), (?Clicks8, ?Title8),
//(?Clicks9, ?Title9)

var t6 = fsql.Insert(items).IgnoreColumns(a => new { a.Title, a.CreateTime }).ExecuteAffrows();
///INSERT INTO `Topic`(`Clicks`)
//VALUES(?Clicks0), (?Clicks1), (?Clicks2), (?Clicks3), (?Clicks4),
//(?Clicks5), (?Clicks6), (?Clicks7), (?Clicks8), (?Clicks9)
```

## 6、列插入优先级

```csharp
全部列 < 指定列(InsertColumns) < 忽略列(IgnoreColumns)
```

在没有使用 `InsertColumns/IgnoreColumns` 的情况下，实体所有列将被插入数据库；

在使用 `InsertColumns`，没有使用 `IgnoreColumns` 的情况下，只有指定的列插入数据库；

在使用 `IgnoreColumns` 的情况下，只有未被指定的列插入数据库；

## 7、字典插入

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
```

## 8、导入表数据

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

注意：因为 `Clicks`、`CreateTime` 没有被选择，所以使用目标实体属性`[Column(InsertValueSql = xx)]` 设置的值，或者使用目标实体属性的 `c#`默认值。

## 9、MySql 特有功能 `Insert Ignore Into`

```csharp
fsql.Insert<Topic>().MySqlIgnoreInto().AppendData(items).ExecuteAffrows();
///INSERT IGNORE INTO `Topic`(`Clicks`)
//VALUES(?Clicks0), (?Clicks1), (?Clicks2), (?Clicks3), (?Clicks4),
//(?Clicks5), (?Clicks6), (?Clicks7), (?Clicks8), (?Clicks9)
```

## 10、MySql 特有功能 `On Duplicate Key Update`

FreeSql.Provider.MySql 和 FreeSql.Provider.MySqlConnector 支持 MySql 特有的功能，On Duplicate Key Update。

这个功能也可以实现插入或更新数据，并且支持批量操作。

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

OnDuplicateKeyUpdate() 之后可以调用的方法：

| 方法名 | 描述 |
| -- | -- |
| IgnoreColumns | 忽略更新的列，机制和 IUpdate.IgnoreColumns 一样 |
| UpdateColumns | 指定更新的列，机制和 IUpdate.UpdateColumns 一样 |
| Set | 手工指定更新的列，与 IUpdate.Set 功能一样 |
| SetRaw | 作为 Set 方法的补充，可传入 SQL 字符串 |
| ToSql | 返回即将执行的 SQL 语句 |
| ExecuteAffrows | 执行，返回影响的行数 |

IInsert 与 OnDuplicateKeyUpdate 都有 IgnoreColumns、UpdateColumns 方法。

当插入实体/集合实体的时候，忽略了 time 列，代码如下：

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

我们发现，UPDATE time 部分变成了常量，而不是 VALUES(\`time\`)，机制如下：

当 insert 部分中存在的列，在 update 中将以 VALUES(\`字段\`) 的形式设置；

当 insert 部分中不存在的列，在 update 中将为常量形式设置，当操作实体数组的时候，此常量为 case when ... end 执行（与 IUpdate 一样）；

## API

| 方法                 | 返回值                     | 参数                    | 描述                                                  |
| -------------------- | -------------------------- | ----------------------- | ----------------------------------------------------- |
| AppendData           | \<this\>                   | T1 \| IEnumerable\<T1\> | 追加准备插入的实体                                    |
| InsertIdentity       | \<this\>                   | 无                      | 指明插入自增列                                        |
| InsertColumns        | \<this\>                   | Lambda                  | 只插入的列                                            |
| IgnoreColumns        | \<this\>                   | Lambda                  | 忽略的列                                              |
| IgnoreInsertValueSql | \<this\>                   | Lambda                  | 忽略的设置过 InsertValueSql 的列                        |
| CommandTimeout       | \<this\>                   | int                     | 命令超时设置(秒)                                      |
| WithTransaction      | \<this\>                   | DbTransaction           | 设置事务对象                                          |
| WithConnection       | \<this\>                   | DbConnection            | 设置连接对象                                          |
| ToSql                | string                     |                         | 返回即将执行的 SQL 语句                               |
| OnDuplicateKeyUpdate | OnDuplicateKeyUpdate\<T1\> | 无                      | MySql 特有的功能，On Duplicate Key Update             |
| OnConflictDoUpdate   | OnConflictDoUpdate\<T1\>   | 无                      | PostgreSQL 特有的功能，On Conflict Do Update          |
| ExecuteAffrows       | long                       |                         | 执行 SQL 语句，返回影响的行数                         |
| ExecuteIdentity      | long                       |                         | 执行 SQL 语句，返回自增值                             |
| ExecuteInserted      | List\<T1\>                 |                         | 执行 SQL 语句，返回插入后的记录                       |
| ExecuteSqlBulkCopy   | void                       |                         | SqlServer 特有的功能，执行 SqlBulkCopy 批量插入的封装 |
| ExecutePgCopy        | void                       |                         | PostgreSQL 特有的功能，执行 Copy 批量导入数据         |
