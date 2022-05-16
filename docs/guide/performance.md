# 性能

FreeSql 实现了强大功能的同时，性能没有受到影响，项目中使用反射或耗时的操作都经过了缓存处理。读取数据部分采用了 ExpressionTree，使得 FreeSql 解析实体数据的速度与 Dapper 非常接近。

# 插入测试

### 测试结果(52 个字段)

|                                      | 18W     | 1W     | 5K     | 2K    | 1K     | 500    | 100 | 50  |
| ------------------------------------ | ------- | ------ | ------ | ----- | ------ | ------ | --- | --- |
| MySql 5.5 ExecuteAffrows             | 38,481  | 2,234  | 1,136  | 284   | 239    | 167    | 66  | 30  |
| MySql 5.5 ExecuteMySqlBulkCopy       | 28,405  | 1,142  | 657    | 451   | 435    | 592    | 47  | 22  |
| SqlServer Express ExecuteAffrows     | 402,355 | 24,847 | 11,465 | 4,971 | 2,437  | 915    | 138 | 88  |
| SqlServer Express ExecuteSqlBulkCopy | 21,065  | 578    | 326    | 139   | 105    | 79     | 60  | 48  |
| PostgreSQL 10 ExecuteAffrows         | 46,756  | 3,294  | 2,269  | 1,019 | 374    | 209    | 51  | 37  |
| PostgreSQL 10 ExecutePgCopy          | 10,090  | 583    | 337    | 136   | 88     | 61     | 30  | 25  |
| Oracle XE ExecuteAffrows             | -       | -      | -      | -     | 24,528 | 10,648 | 571 | 200 |
| Sqlite ExecuteAffrows                | 28,554  | 1,149  | 701    | 327   | 155    | 91     | 44  | 35  |

> 18W 解释：插入 18 万行记录，表格中的数字是执行时间（单位 ms）

> Oracle 插入性能不用怀疑，可能安装学生版限制较大

提醒：开源数据库测试结果比较有意义，商业数据库版本之间性能可能有较大差距

### 测试结果(10 个字段)

|                                      | 18W    | 1W    | 5K    | 2K  | 1K    | 500 | 100 | 50  |
| ------------------------------------ | ------ | ----- | ----- | --- | ----- | --- | --- | --- |
| MySql 5.5 ExecuteAffrows             | 11,171 | 866   | 366   | 80  | 83    | 50  | 24  | 34  |
| MySql 5.5 ExecuteMySqlBulkCopy       | 6,504  | 399   | 257   | 116 | 87    | 100 | 16  | 16  |
| SqlServer Express ExecuteAffrows     | 47,204 | 2,275 | 1,108 | 488 | 279   | 123 | 35  | 16  |
| SqlServer Express ExecuteSqlBulkCopy | 4,248  | 127   | 71    | 30  | 48    | 14  | 11  | 10  |
| PostgreSQL 10 ExecuteAffrows         | 9,786  | 568   | 336   | 157 | 102   | 34  | 9   | 6   |
| PostgreSQL 10 ExecutePgCopy          | 4,081  | 167   | 93    | 39  | 21    | 12  | 4   | 2   |
| Oracle XE ExecuteAffrows             | -      | -     | -     | -   | 2,394 | 731 | 67  | 33  |
| Sqlite ExecuteAffrows                | 4,524  | 246   | 137   | 94  | 35    | 19  | 14  | 11  |

> 测试结果，是在相同操作系统下进行的，并且都有预热

> ExecuteMySqlBulkCopy 方法在 FreeSql.Provider.MySqlConnector 中实现的

```csharp
//测试实体类
public class TestInsert10c {
    [Column(MapType = typeof(string))]
    public Guid Id { get; set; }

    public string UserName0 { get; set; }
    public string PassWord0 { get; set; }
    public DateTime CreateTime0 { get; set; }

    public string UserName1 { get; set; }
    public string PassWord1 { get; set; }
    public DateTime CreateTime1 { get; set; }

    public string UserName2 { get; set; }
    public string PassWord2 { get; set; }
    public DateTime CreateTime2 { get; set; }
}

//生成测试数据
IFreeSql orm = ...;
var testCount = 10000;
var t10cs = new List<TestInsert10c>();
for (var a = 0; a < testCount; a++) {
    var item = new TestInsert10c();
    for (var b = 0; b <= 2; b++)
    {
        orm.SetEntityValueWithPropertyName(typeof(TestInsert10c), item, "UserName" + b, Guid.NewGuid().ToString("N"));
        orm.SetEntityValueWithPropertyName(typeof(TestInsert10c), item, "PassWord" + b, Guid.NewGuid().ToString("N"));
        orm.SetEntityValueWithPropertyName(typeof(TestInsert10c), item, "CreateTime" + b, DateTime.Now);
    }
    t10cs.Add(item);
}
```

# 查询测试

```csharp
IFreeSql mysql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=100")
    //由于null会默认输出日志到控制台，影响测试结果。这里传入一个空的日志输出对象
    .UseAutoSyncStructure(false)
    //关闭自动迁移功能
    .Build(); //请务必定义成 Singleton 单例模式

class Song {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Url { get; set; }
    public DateTime Create_time { get; set; }
    public bool Is_deleted { get; set; }
}
```

测试方法：运行两次，以第二次性能报告，避免了首个运行慢不公平的情况。

### 测试结果

|                    | 数量   | Query\<Class\> | Query\<Tuple\> | Query\<dynamic\> |
| ------------------ | ------ | -------------- | -------------- | ---------------- |
| Dapper.Query(sql)  | 131072 | 623.4959ms     | 424.2411ms     | 644.8897ms       |
| FreeSql.Query(sql) | 131072 | 647.0552ms     | 577.3532ms     | 944.7454ms       |
| FreeSql.ToList     | 131072 | 622.8980ms     | 435.3532ms     | -                |

FreeSql 以微小的性能差距输了，原因是支持了更多的类型，某些类型解析需要 Parse、递归或循环处理。

> 由于 Dapper 没有批量插入/更新/删除的功能，并且都是执行一条 SQL 命令，测试结果没有意义。

> FreeSql 批量插入使用的命令：INSERT INTO Song (...) VALUES(...),VALUES(...),VALUES(...)...

### 执行 SQL 返回实体列表 Dapper.Query\<Class\> VS FreeSql.Query\<Class\>

```csharp
[Fact]
public void QueryEntity() {
    var sb = new StringBuilder();
    var time = new Stopwatch();

    time.Restart();
    List<Song> dplist1 = null;
    using (var conn = g.mysql.Ado.MasterPool.Get()) {
        dplist1 = Dapper.SqlMapper.Query<Song>(conn.Value, "select * from song").ToList();
    }
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; Query Entity Counts: {dplist1.Count}; ORM: Dapper");

    time.Restart();
    var t3 = g.mysql.Ado.Query<Song>("select * from song");
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; Query Entity Counts: {t3.Count}; ORM: FreeSql*");
}
```

### 执行 SQL 返回元组列表 Dapper.Query\<Tuple\> VS FreeSql.Query\<Tuple\>

```csharp
[Fact]
public void QueryTuple() {
    var sb = new StringBuilder();
    var time = new Stopwatch();

    time.Restart();
    List<(int, string, string)> dplist2 = null;
    using (var conn = g.mysql.Ado.MasterPool.Get()) {
        dplist2 = Dapper.SqlMapper.Query<(int, string, string)>(conn.Value, "select * from song").ToList();
    }
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; Query Tuple Counts: {dplist2.Count}; ORM: Dapper");

    time.Restart();
    var t4 = g.mysql.Ado.Query<(int, string, string)>("select * from song");
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; Query Tuple Counts: {t4.Count}; ORM: FreeSql*");
}
```

### 执行 SQL 返回 dynamic 列表 Dapper.Query\<dynamic\> VS FreeSql.Query\<dynamic\>

```csharp
[Fact]
public void QueryDynamic() {
    var sb = new StringBuilder();
    var time = new Stopwatch();

    time.Restart();
    List<dynamic> dplist3 = null;
    using (var conn = g.mysql.Ado.MasterPool.Get()) {
        dplist3 = Dapper.SqlMapper.Query<dynamic>(conn.Value, "select * from song").ToList();
    }
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; Query Dynamic Counts: {dplist3.Count}; ORM: Dapper");

    time.Restart();
    var t5 = g.mysql.Ado.Query<dynamic>("select * from song");
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; Query Dynamic Counts: {t3.Count}; ORM: FreeSql*");
}
```

### Dapper.Query VS FreeSql.ToList

```csharp
[Fact]
public void QueryList() {
    var sb = new StringBuilder();
    var time = new Stopwatch();

    time.Restart();
    var t3 = g.mysql.Select<Song>().ToList();
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; ToList Entity Counts: {t3.Count}; ORM: FreeSql*");

    time.Restart();
    List<Song> dplist1 = null;
    using (var conn = g.mysql.Ado.MasterPool.Get()) {
        dplist1 = Dapper.SqlMapper.Query<Song>(conn.Value, "select * from song").ToList();
    }
    time.Stop();
    sb.AppendLine($"Elapsed: {time.Elapsed}; Query Entity Counts: {dplist1.Count}; ORM: Dapper");
}
```

> 更多测试源码：FreeSql/FreeSql.Tests.PerformanceTests/MySqlAdoTest.cs
