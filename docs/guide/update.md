# 修改

`FreeSql` 提供丰富的数据库更新功能，支持单条或批量更新，在特定的数据库执行还可以返回更新后的记录。

```csharp
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
```

## 动态条件

```csharp
fsql.Update<Topic>(object dywhere)
```

`dywhere` 支持：

- 主键值
- `new[] { 主键值1, 主键值2 }`
- Topic 对象
- `new[] { Topic对象1, Topic对象2 }`
- `new { id = 1 }`

## 1、更新指定列

```csharp
fsql.Update<Topic>(1)
  .Set(a => a.CreateTime, DateTime.Now)
  .ExecuteAffrows();
//UPDATE `Topic` SET `CreateTime` = '2018-12-08 00:04:59'
//WHERE (`Id` = 1)
```

> 支持 `Set()` 多次，相当于拼接

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

## 2、更新条件

> 除了上面介绍的 `dywhere` 构造参数外，还支持 `Where lambda/sql` 方法

> 出于安全考虑，没有条件不执行更新动作，避免误更新全表数据。更新全表数据：`fsql.Update<T>().Where("1=1").Set(a => a.Xxx == xxx).ExecuteAffrows()`

```csharp
fsql.Update<Topic>()
  .Set(a => a.Title, "新标题")
  .Set(a => a.Time, DateTime.Now)
  .Where(a => a.Id == 1)
  .ExecuteAffrows();
//UPDATE `Topic` SET `Title` = @p_0, `Time` = @p_1
//WHERE (Id = 1)
```

## 3、更新实体

方法 1：(推荐)

> 只更新变化的属性，依赖 `FreeSql.Repository`

```csharp
var repo = fsql.GetRepository<Topic>();
var item = repo.Where(a => a.Id == 1).First();  //此时快照 item
item.Title = "newtitle";
repo.Update(item); //对比快照时的变化
//UPDATE `Topic` SET `Title` = @p_0
//WHERE (`Id` = 1)
```

> 是不是觉得先查询再更新，啰嗦？

```csharp
var repo = fsql.GetRepository<Topic>();
var item = new Topic { Id = 1 };
repo.Attach(item); //此时快照 item
item.Title = "newtitle";
repo.Update(item); //对比快照时的变化
//UPDATE `Topic` SET `Title` = @p_0
//WHERE (`Id` = 1)
```

方法 2：(原始)

```csharp
//v1.5.0 忽略更新 null 值的属性
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

> 指定 `Set` 列更新后，`SetSource` 将失效

> SetSource 默认依赖实体 IsPrimary 特性，临时主键可使用 SetSource(items, a => a.Code)

## 4、自定义 SQL

```csharp
fsql.Update<Topic>()
  .SetRaw("Title = @title", new { title = "新标题" })
  .Where("Id = @id", 1)
  .ExecuteAffrows();
//UPDATE `Topic` SET Title = @title WHERE (Id = @id)
```

## 5、根据 Dto 更新

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

## 6、Set/SetSource/SetDto 区别

他们三个是平级功能，分别对应：

- `Set/SetRaw` 在知道实体的时候使用，对应 `update t set x = x`

- `SetSource` 更新整个实体，可以配合 `UpdateColumns` 或 `IgnoreColumns` 指定或忽略字段

- `SetDto` 是 `Set` 的批量操作

## 7、字典更新

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.UpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
```

## 8、乐观锁

更新整个实体数据时，在并发情况下极容易造成旧数据将新的记录更新。

乐观锁的原理，是利用实体某字段，如：`long version`，更新前先查询数据，此时 `version` 为 `1`，更新时产生的 SQL 会附加 `where version = 1`，当修改失败时（即 `Affrows == 0`）抛出异常（DbUpdateVersionException）。

每个实体只支持一个乐观锁属性，在属性前标记特性：`[Column(IsVersion = true)]` 即可。

> 适用 `SetSource` 更新，每次更新 `version` 的值都会增加 `1`

## 9、悲观锁

```csharp
var user = fsql.Select<User>()
  .ForUpdate(true)
  .Where(a => a.Id == 1)
  .ToOne();
//SELECT ... FROM User a for update nowait
```

`ForUpdate` 在 Oracle/PostgreSQL/MySql 是通用的写法，我们对 SqlServer 做了特别适配，执行的 SQL 语句大致如下：

```sql
SELECT ... FROM [User] a With(UpdLock, RowLock, NoWait)
```

## 10、ISelect.ToUpdate 高级更新

`IUpdate` 默认不支持导航对象，多表关联等。`ISelect.ToUpdate` 可将查询转为 `IUpdate`，以便使用导航对象更新数据，如下：

```csharp
fsql.Select<T1>().Where(a => a.Options.xxx == 1)
  .ToUpdate()
  .Set(a => a.Title, "111")
  .ExecuteAffrows();
```

注意：此方法不是将数据查询到内存再更新，上面的代码产生如下 SQL 执行：

```sql
UPDATE `T1` SET Title = '111' WHERE id in (select a.id from T1 a left join Options b on b.t1id = a.id where b.xxx = 1)
```

复杂更新使用该方案的好处：

- 更新前可预览测试数据，防止错误更新操作；
- 支持复杂的更新操作，例如：`ISelect` 上使用 `Limit(10)` 更新附合条件的前 10 条记录；

## 11、联表更新 UpdateJoin

v3.2.692+（高风险操作，高风险操作，高风险操作，请谨慎谨慎谨慎使用，测试并核对 ToSql 返回的内容）

```csharp
fsql.Update<T1>()
  .Join<T2>((a, b) => a.id == b.groupid)
  .Set((a, b) => a.bname == b.name) //其他表字段
  .Set((a, b) => a.bcode == b.id + a.code)
  .Set(a => a.flag, 1) //固定值
  .Where((a, b) => a.id > 0 && b.id > 0)
  .ExecuteAffrows();
```

不同数据库产生的 SQL 不一样，以 MySql 为例：
```sql
UPDATE `T1` a
INNER JOIN `T2` b ON (a.`id` = b.`groupid`)
SET a.`bname` = b.`name`, a.`bcode` = concat(b.`id`, a.`code`), a.`flag` = 1
WHERE a.`id` > 0 AND b.`id` > 0
```

更复杂的联表更新：

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

## 12、BulkCopy 批量更新

FreeSql.Provider.SqlServer、FreeSql.Provider.MySqlConnector、FreeSql.Provider.PostgreSQL 

分别实现了扩展方法 ExecuteSqlBulkCopy、ExecuteMySqlBulkCopy、ExecutePgCopy 实现批量更新（v3.2.685）

原理：使用 BulkCopy 将数据插入到临时表，再使用 UPDATE FROM JOIN 联表更新。

提示：当更新的字段数量超过 3000 时，收益较大。

```csharp
fsql.Update<T1>().SetSource(list).ExecuteSqlBulkCopy();
```

# API

| 方法            | 返回值     | 参数                    | 描述                                                                            |
| --------------- | ---------- | ----------------------- | ------------------------------------------------------------------------------- |
| SetSource       | \<this\>   | T1 \| IEnumerable\<T1\> | 更新数据，设置更新的实体                                                        |
| IgnoreColumns   | \<this\>   | Lambda                  | 忽略的列                                                                        |
| Set             | \<this\>   | Lambda, value           | 设置列的新值，`Set(a => a.Name, "newvalue")`                                    |
| Set             | \<this\>   | Lambda                  | 设置列的的新值为基础上增加，`Set(a => a.Clicks + 1)`，相当于 clicks=clicks+1    |
| SetDto          | \<this\>   | object                  | 根据 DTO 更新的方法                                                             |
| SetRaw          | \<this\>   | string, parms           | 设置值，自定义 SQL 语法，`SetRaw("title = @title", new { title = "newtitle" })` |
| Where           | \<this\>   | Lambda                  | 表达式条件，仅支持实体基础成员（不包含导航对象）                                |
| Where           | \<this\>   | string, parms           | 原生 sql 语法条件，`Where("id = @id", new { id = 1 })`                          |
| Where           | \<this\>   | T1 \| IEnumerable\<T1\> | 传入实体或集合，将其主键作为条件                                                |
| CommandTimeout  | \<this\>   | int                     | 命令超时设置(秒)                                                                |
| WithTransaction | \<this\>   | DbTransaction           | 设置事务对象                                                                    |
| WithConnection  | \<this\>   | DbConnection            | 设置连接对象                                                                    |
| ToSql           | string     |                         | 返回即将执行的 SQL 语句                                                         |
| ExecuteAffrows  | long       |                         | 执行 SQL 语句，返回影响的行数                                                   |
| ExecuteUpdated  | List\<T1\> |                         | 执行 SQL 语句，返回更新后的记录                                                 |
