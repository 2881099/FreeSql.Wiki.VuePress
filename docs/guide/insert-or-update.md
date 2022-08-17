# 新增和修改

## 1、IFreeSql.InsertOrUpdate

IFreeSql 定义了 InsertOrUpdate 方法实现添加或修改的功能，利用数据库特性：(v1.5.0+)

| Database   | Features                |     | Database | Features              |
| ---------- | ----------------------- | --- | -------- | --------------------- |
| MySql      | on duplicate key update |     | 达梦     | merge into            |
| PostgreSQL | on conflict do update   |     | 人大金仓 | on conflict do update |
| SqlServer  | merge into              |     | 神通     | merge into            |
| Oracle     | merge into              |     | 南大通用 | merge into            |
| Sqlite     | replace into            |     | MsAccess | 不支持                |
| Firebird   | merge into              |     |          |                       |

```csharp
fsql.InsertOrUpdate<T>()
  .SetSource(items) //需要操作的数据
  //.IfExistsDoNothing() //如果数据存在，啥事也不干（相当于只有不存在数据时才插入）
  .ExecuteAffrows();

//或者..
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

当实体类有自增属性时，批量 InsertOrUpdate 最多可被拆成两次执行，内部计算出未设置自增值、和有设置自增值的数据，分别执行 insert into 和 上面讲到的 merge into 两种命令（采用事务执行）。

注意：FreeSql.Repository 通用仓储也有 InsertOrUpdate 方法，它们的机制不一样。

---

## 2、字典插入或更新

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertOrUpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
//（产生 SQL 同上）
```

---

## 3、FreeSql.Repository 之 InsertOrUpdate

使用此方法需要引用 FreeSql.Repository 或 FreeSql.DbContext 功能包。

```csharp
var repo = fsql.GetRepository<T>();
repo.InsertOrUpdate(实体);
```

如果内部的状态管理存在数据，则更新。

如果内部的状态管理不存在数据，则查询数据库，判断是否存在。

> 存在则更新，不存在则插入

缺点：不支持批量操作

---

## 4、BeginEdit 批量编辑

```csharp
[Fact]
public void BeginEdit()
{
    fsql.Delete<BeginEdit01>().Where("1=1").ExecuteAffrows();
    var repo = fsql.GetRepository<BeginEdit01>();
    var cts = new[] {
        new BeginEdit01 { Name = "分类1" },
        new BeginEdit01 { Name = "分类1_1" },
        new BeginEdit01 { Name = "分类1_2" },
        new BeginEdit01 { Name = "分类1_3" },
        new BeginEdit01 { Name = "分类2" },
        new BeginEdit01 { Name = "分类2_1" },
        new BeginEdit01 { Name = "分类2_2" }
    }.ToList();
    repo.Insert(cts);

    repo.BeginEdit(cts); //开始对 cts 进行编辑

    cts.Add(new BeginEdit01 { Name = "分类2_3" });
    cts[0].Name = "123123";
    cts.RemoveAt(1);

    Assert.Equal(3, repo.EndEdit()); //重载方法新旧对比 repo.EndEdit(newlist)
}
class BeginEdit01
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
```

上面的代码 EndEdit 方法执行的时候产生 3 条 SQL 如下：

```sql
INSERT INTO "BeginEdit01"("Id", "Name") VALUES('5f26bf07-6ac3-cbe8-00da-7dd74818c3a6', '分类2_3')


UPDATE "BeginEdit01" SET "Name" = '123123'
WHERE ("Id" = '5f26bf00-6ac3-cbe8-00da-7dd01be76e26')


DELETE FROM "BeginEdit01" WHERE ("Id" = '5f26bf00-6ac3-cbe8-00da-7dd11bcf54dc')
```

场景：winform 加载表数据后，一顿添加、修改、删除操作之后，点击【保存】

提醒：该操作只对变量 cts 有效，不是针对全表对比更新。

## 5、MySql 特有功能 On Duplicate Key Update

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
//INSERT INTO `TestOnDuplicateKeyUpdateInfo`(`id`, `title`) VALUES(200, 'title-200')
//ON DUPLICATE KEY UPDATE
//`title` = VALUES(`title`),
//`time` = '2000-01-01 00:00:00.000'
```

我们发现，UPDATE time 部分变成了常量，而不是 VALUES(\`time\`)，机制如下：

当 insert 部分中存在的列，在 update 中将以 VALUES(\`字段\`) 的形式设置；

当 insert 部分中不存在的列，在 update 中将为常量形式设置，当操作实体数组的时候，此常量为 case when ... end 执行（与 IUpdate 一样）；

---

## 6、PostgreSQL 特有功能 On Conflict Do Update

FreeSql.Provider.PostgreSQL 支持 PostgreSQL 9.5+ 特有的功能，On Conflict(id) Do Update。

使用方法 MySql OnDuplicateKeyUpdate 大致相同。

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
