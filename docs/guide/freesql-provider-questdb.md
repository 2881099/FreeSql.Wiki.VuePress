# FreeSql.Provider.QuestDb

## 介绍

`QuestDB `是一款针对时序数据实时处理优化的关系型列存数据库， 支持 Rest API 方式访问，同时兼容 PostgreSQL 访问协议，以及 InfluxDB 写入的访问协议。自带 Web Console，方便数据库的基本访问

[QuestDB | 官网 ](https://questdb.io/)

## 安装包

FreeSql.Provider.QuestDb

.NET CLI

```bash
dotnet add package FreeSql.Provider.QuestDb
```

Package Manager

```bash
Install-Package FreeSql.Provider.QuestDb
```

## 声明

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.QuestDb,
       @"host=localhost;port=8812;username=admin;password=quest;database=qdb;ServerCompatibilityMode=NoTypeLoading;")  //连接字符串
    .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}")) 
    .UseQuestDbRestAPI("localhost:9000", "username", "password")  //RestAPI，建议开启
    .Build();
```

## 特有功能

#### QuestFunc

- QuestFunc 实现了 QuestDB 官方文档的函数
- SelectLongSequence 对应 long_sequence

```csharp
fsql.SelectLongSequence(10, () => new
    {
        rndstr = QuestFunc.rnd_str(10, 5, 10, 0),
        rnddate = QuestFunc.rnd_date(QuestFunc.to_date("2020", "yyyy"), QuestFunc.to_date("2023", "yyyy"))
    })
    .From<User1>()
    .InnerJoin((a, b) => a.rndstr == b.Username)
    .ToList();
//SELECT *
//FROM (
//    SELECT rnd_str(10,5,10,0) "rndstr", rnd_date(to_date('2020','yyyy'),to_date('2023','yyyy'),0) "rnddate"
//    FROM long_sequence(10)
//) a
//INNER JOIN "user1" b ON a."rndstr" = b."username"
```

#### Sample By

> SAMPLE BY用于时间序列数据，将大型数据集汇总为同质时间块的聚合，作为SELECT语句的一部分

[SAMPLE BY keyword | QuestDB](https://questdb.io/docs/reference/sql/sample-by/)

```csharp
fsql.Select<Table>()
    .SampleBy(1, SampleUnit.day)
    .WithTempQuery(q => new { q.Id, q.Activos, count = SqlExt.Count(q.Id).ToValue() })
    .Where(q => q.Id != "xxx")
    .ToSql();
```

> 生成SQL

```sql
SELECT *
FROM (
    SELECT a."Id", a."Activos", count(a."Id") "count"
    FROM "Table" a SAMPLE BY 1d
) a
WHERE (a."Id" <> '1')
```

#### GroupBy

> 需要注意的是 QuestDB 的 GroupBy 与其他关系型 数据库不同

[官网说明：SQL extensions | QuestDB](https://questdb.io/docs/concept/sql-extensions/#group-by-is-optional)

```csharp
//这里通过WithTempQuery实现
fsql.Select<Table>()
    .WithTempQuery(q => new { q.Id, q.xxx, count = SqlExt.Count(q.Id).ToValue() })
    .Where(q => q.Id != "1" && q.count > 1)
    .ToSql();
```

> 生成SQL

```sql
SELECT *
FROM (
    SELECT a."Id", a."xxx", count(a."Id") "count"
    FROM "Table" a
) a
WHERE (a."Id" <> '1' AND a."count" > 1)
```

#### Latest On

> 对于多个时间序列存储在同一个表中的场景，根据时间戳检索给定键或键组合的最新项

[LATEST ON keyword | QuestDB](https://questdb.io/docs/reference/sql/latest-on/)

```csharp
fsql.Select<Table>()
    .LatestOn(q => q.CreateTime, q => new { q.xxx, q.xxx })
    .ToSql();
```

> 生成SQL

```sql
SELECT  a."xxx", a."xxx", a."xxx", a."xxx", a."xxx", a."xxx", a."xxx", a."xxx", a."xxx"
FROM "Table" a
LATEST ON a.xxxx  PARTITION BY a.xxxx 
```

#### BulkCopy

> 实测七列10W数据预热后只需1.5秒，100W数据14秒左右

```csharp
//需要启用RestAPI
fsql.Insert(list).ExecuteBulkCopyAsync();
```

#### 自动分表、索引

> QuestDB 支持自动分表

```csharp
[Index("Id_Index", nameof(Id), false)]
class Table
{
    //索引类型必须是symbol
    [Column(DbType = "symbol")] 
    public string Id { get; set; }
    public string Name { get; set; }
    public double? Activos { get; set; }
    //按天分表 
    [AutoSubtable(SubtableType.Day)] 
    //特性标记类型必须是DateTime
    public DateTime? CreateTime { get; set; }
    public bool? IsCompra { get; set; }
}
```

## 常见问题

####  table busy

**多线程并发查询时会出现 table busy [reason=insert] 异常**

[官网说明 | table busy  ](https://questdb.io/docs/troubleshooting/faq/#why-do-i-get-table-busy-error-messages-when-inserting-data-over-postgresql-wire-protocol)

> 解决方案，启用RestAPI后 Insert/Update就会默认使用HTTP方式

```csharp
//在FreeSqlBuilder增加UseQuestDbRestAPI()
new FreeSql.FreeSqlBuilder()
    .UseQuestDbRestAPI("localhost:9000", "username", "password") 
```

#### RestAPI设置账号密码

QuestDb WebConsole并不支持设置账号密码，但是官网给出解决方案 使用Nginx代理

[Setting up Basic Authentication for QuestDB open source using Nginx | QuestDB](https://questdb.io/blog/2022/08/05/setting-basic-auth-nginx/#introduction)

#### QuestDb不支持删除？

[FAQ | How do I delete a row?](https://questdb.io/docs/troubleshooting/faq/#how-do-i-delete-a-row)

## 在线测试

[QuestDB | 在线测试 ](https://demo.questdb.io/) 提供了最新的QuestDB发行版和示例数据集:

- Trips: 10 years of NYC taxi trips with 1.6 billion rows
- Trades: live crytocurrency market data with 30M+ rows per month
- Pos: geolocations of 250k unique ships over time

| Query                                                        | Execution time                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| SELECT sum(double) FROM trips                                | [0.15 secs](https://demo.questdb.io/?query=SELECT sum(trip_distance) FROM trips;&executeQuery=true) |
| SELECT sum(double), avg(double) FROM trips                   | [0.5 secs](https://demo.questdb.io/?query=SELECT sum(fare_amount), avg(fare_amount) FROM trips;&executeQuery=true) |
| SELECT avg(double) FROM trips WHERE time in '2019'           | [0.02 secs](https://demo.questdb.io/?query=SELECT avg(trip_distance) FROM trips WHERE pickup_datetime IN '2019';&executeQuery=true) |
| SELECT time, avg(double) FROM trips WHERE time in '2019-01-01' SAMPLE BY 1h | [0.01 secs](https://demo.questdb.io/?query=SELECT pickup_datetime, avg(trip_distance) FROM trips WHERE pickup_datetime IN '2019-01-01' SAMPLE BY 1h;&executeQuery=true) |
| SELECT * FROM trades LATEST ON time PARTITION BY symbol      | [0.00025 secs](https://demo.questdb.io/?query=SELECT * FROM trades LATEST ON timestamp PARTITION BY symbol;&executeQuery=true) |

Our demo is running on `c5.metal` instance and using 24 cores out of 
