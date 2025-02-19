# 插入

```csharp
IFreeSql fsql; //如何创建请移步入门文档

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

## 1、单条插入

```csharp
var t1 = fsql.Insert(items[0]).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`)
//VALUES(?Clicks0, ?Title0, ?CreateTime0)
```

## 2、返回自增

如果表有自增列，插入数据后应该要返回 id。

方法 1：(原始)

```csharp
long id = fsql.Insert(items[0]).ExecuteIdentity();
items[0].Id = id;
```

方法 2：(依赖 FreeSql.Repository)

```csharp
IBaseRepository<Topic> repo = fsql.GetRepository<Topic>();  //可以从 IOC 容器中获取
repo.Insert(items[0]);
```

> 仓储内部会将插入后的自增值填充给 items[0].Id (支持批量插入回填)

> DbFirst 模式序列：[Column(IsIdentity = true, InsertValueSql = "seqname.nextval")]

## 3、批量插入

```csharp
var t2 = fsql.Insert(items).ExecuteAffrows();
//INSERT INTO `Topic`(`Clicks`, `Title`, `CreateTime`)
//VALUES(?Clicks0, ?Title0, ?CreateTime0), (?Clicks1, ?Title1, ?CreateTime1),
//(?Clicks2, ?Title2, ?CreateTime2), (?Clicks3, ?Title3, ?CreateTime3),
//(?Clicks4, ?Title4, ?CreateTime4), (?Clicks5, ?Title5, ?CreateTime5),
//(?Clicks6, ?Title6, ?CreateTime6), (?Clicks7, ?Title7, ?CreateTime7),
//(?Clicks8, ?Title8, ?CreateTime8), (?Clicks9, ?Title9, ?CreateTime9)
```

批量插入建议关闭参数化功能，使用 .NoneParameter() 提升执行效率。

当插入大批量数据时，内部分批执行，规则如下：

|            | 数量 | 参数量 |
| ---------- | ---- | ------ |
| MySql      | 5000 | 3000   |
| PostgreSQL | 5000 | 3000   |
| SqlServer  | 1000 | 2100   |
| Oracle     | 500  | 999    |
| Sqlite     | 5000 | 999    |

也可以通过 BatchOptions 设置合适的值。当外部未提供事务时，内部自开事务，实现插入完整性。

## 4、高性能 BulkCopy

| 程序包                          | 扩展方法              | 说明     |
| ------------------------------- | --------------------- | -------- |
| FreeSql.Provider.SqlServer      | ExecuteSqlBulkCopy    |          |
| FreeSql.Provider.MySqlConnector | ExecuteMySqlBulkCopy  |          |
| FreeSql.Provider.Oracle         | ExecuteOracleBulkCopy |          |
| FreeSql.Provider.PostgreSQL     | ExecutePgCopy         |          |
| FreeSql.Provider.Dameng         | ExecuteDmBulkCopy     | 达梦     |
| FreeSql.Provider.KingbaseES     | ExecuteKdbCopy        | 人大金仓 |

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

## 5、动态表名

```csharp
fsql.Insert(items).AsTable("Topic_201903").ExecuteAffrows(); //对 Topic_201903 表插入
```

## 6、插入指定列

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

## 7、忽略列

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

## 8、字典插入

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
//提示：List<Dictionary<string, object>> 为批量插入
```

## 9、导入表

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

## 10、MySql `Insert Ignore Into`

```csharp
fsql.Insert<Topic>().MySqlIgnoreInto().AppendData(items).ExecuteAffrows();
///INSERT IGNORE INTO `Topic`(`Clicks`)
//VALUES(?Clicks0), (?Clicks1), (?Clicks2), (?Clicks3), (?Clicks4),
//(?Clicks5), (?Clicks6), (?Clicks7), (?Clicks8), (?Clicks9)
```

## 11、MySql `On Duplicate Key Update`

FreeSql.Provider.MySql 和 FreeSql.Provider.MySqlConnector 支持 MySql 特有的功能 On Duplicate Key Update，实现插入或更新数据（支持批量）。

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

OnDuplicateKeyUpdate() 之后可以调用的方法：

| 方法名         | 描述                                            |
| -------------- | ----------------------------------------------- |
| IgnoreColumns  | 忽略更新的列，机制和 IUpdate.IgnoreColumns 一样 |
| UpdateColumns  | 指定更新的列，机制和 IUpdate.UpdateColumns 一样 |
| Set            | 手工指定更新的列，与 IUpdate.Set 功能一样       |
| SetRaw         | 作为 Set 方法的补充，可传入 SQL 字符串          |
| ToSql          | 返回即将执行的 SQL 语句                         |
| ExecuteAffrows | 执行，返回影响的行数                            |

IInsert 与 OnDuplicateKeyUpdate 都有 IgnoreColumns、UpdateColumns 方法。

当插入实体/集合实体的时候，忽略了 time 列，代码如下：

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

我们发现，UPDATE time 部分变成了常量，而不是 VALUES(\`time\`)，机制如下：

当 insert 部分中存在的列，在 update 中将以 VALUES(\`字段\`) 的形式设置；

当 insert 部分中不存在的列，在 update 中将为常量形式设置，当操作实体数组的时候，此常量为 case when ... end 执行（与 IUpdate 一样）；

## 12、PostgreSQL `On Conflict Do Update`

FreeSql.Provider.PostgreSQL 支持 PostgreSQL 9.5+ 特有的功能 On Conflict(id) Do Update，使用方法 MySql OnDuplicateKeyUpdate 大致相同。

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

| 方法                 | 返回值                     | 参数                    | 描述                                                  |
| -------------------- | -------------------------- | ----------------------- | ----------------------------------------------------- |
| AppendData           | \<this\>                   | T1 \| IEnumerable\<T1\> | 追加准备插入的实体                                    |
| InsertIdentity       | \<this\>                   | 无                      | 指明插入自增列                                        |
| InsertColumns        | \<this\>                   | Lambda                  | 只插入的列                                            |
| IgnoreColumns        | \<this\>                   | Lambda                  | 忽略的列                                              |
| IgnoreInsertValueSql | \<this\>                   | Lambda                  | 忽略的设置过 InsertValueSql 的列                      |
| CommandTimeout       | \<this\>                   | int                     | 命令超时设置(秒)                                      |
| WithTransaction      | \<this\>                   | DbTransaction           | 设置事务对象                                          |
| WithConnection       | \<this\>                   | DbConnection            | 设置连接对象                                          |
| ToSql                | string                     |                         | 返回即将执行的 SQL 语句                               |
| OnDuplicateKeyUpdate | OnDuplicateKeyUpdate\<T1\> | 无                      | MySql 特有的功能 On Duplicate Key Update              |
| OnConflictDoUpdate   | OnConflictDoUpdate\<T1\>   | 无                      | PostgreSQL 特有的功能 On Conflict Do Update           |
| ExecuteAffrows       | long                       |                         | 执行 SQL 语句，返回影响的行数                         |
| ExecuteIdentity      | long                       |                         | 执行 SQL 语句，返回自增值                             |
| ExecuteInserted      | List\<T1\>                 |                         | 执行 SQL 语句，返回插入后的记录                       |
| ExecuteSqlBulkCopy   | void                       |                         | SqlServer 特有的功能，执行 SqlBulkCopy 批量插入的封装 |
| ExecutePgCopy        | void                       |                         | PostgreSQL 特有的功能，执行 Copy 批量导入数据         |
