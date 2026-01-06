# 嵌套查询 ✨

## WithTempQuery

需求版本：v3.2.666+

GroupBy + WithTempQuery(嵌套查询) + FromQuery + UnionAll 组合使用，会让查询功能更加强大、灵活。

注意：FromQuery 多个 WithTempQuery 匿名类型时，确保不是同一个类型（可使用任意属性区分） [#1620](https://github.com/dotnetcore/FreeSql/issues/1620)

## 场景1：查询分组第一条记录

```cs
fsql.Select<User1>()
    .Where(a => a.Id < 1000)
    .WithTempQuery(a => new
    {
        item = a,
        rownum = SqlExt.RowNumber().Over().PartitionBy(a.Nickname).OrderBy(a.Id).ToValue()
    })
    .Where(a => a.rownum == 1)
    .ToList();
```

> 提示：支持多表嵌套查询，fsql.Select\<User1, UserGroup1\>()

```sql
SELECT *
FROM (
    SELECT a.[Id], a.[Nickname], row_number() over( partition by a.[Nickname] order by a.[Id]) [rownum]
    FROM [User1] a
    WHERE a.[Id] < 1000
) a
WHERE (a.[rownum] = 1)
```

如果数据库不支持开窗函数，可以使用分组嵌套查询解决：

```csharp
fsql.Select<User1>()
    .Where(a => a.Id < 1000)
    .GroupBy(a => a.Nickname)
    .WithTempQuery(g => new { min = g.Min(g.Value.Id) })
    .From<User1>()
    .InnerJoin((a, b) => a.min == b.Id)
    .ToList((a, b) => b);
```

```sql
SELECT b.[Id], b.[Nickname]
FROM (
    SELECT min(a.[Id]) [min]
    FROM [User1] a
    WHERE a.[Id] < 1000
    GROUP BY a.[Nickname] ) a
INNER JOIN [User1] b ON a.[min] = b.[Id]
```

## 场景2：嵌套查询 + Join

WithTempQuery + From\<T2\> 或 FromQuery(ISelect\<T2\>) 可实现无限联表

```cs
fsql.Select<User1>()
    .Where(a => a.Id < 1000)
    .WithTempQuery(a => new
    {
        item = a,
        rownum = SqlExt.RowNumber().Over().PartitionBy(a.Nickname).OrderBy(a.Id).ToValue()
    })
    //.From<UserExt>() //普通联表
    .FromQuery(fsql.Select<UserExt>().Where(b => b.Id > 0)) //子查询联表
    //.FromQuery(fsql.Select<UserExt, UserGroup, xxx>() //子多表查询联表
    //    .WithTempQuery((a,b,c) => new { ... }))
    .InnerJoin((a, b) => a.item.Id == b.UserId)
    .Where((a, b) => a.rownum == 1)
    .ToList((a, b) => new
    {
        user = a.item,
        rownum = a.rownum,
        userext = b
    });
```

```sql
SELECT ...
FROM (
    SELECT a.[Id], a.[Nickname], row_number() over( partition by a.[Nickname] order by a.[Id]) [rownum]
    FROM [User1] a
    WHERE a.[Id] < 1000 ) a
INNER JOIN (
    SELECT a.[UserId], a.[Remark]
    FROM [UserExt] a
    WHERE (a.[Id] > 0) ) b ON a.[Id] = b.[UserId]
WHERE (a.[rownum] = 1)
```

## 场景3：分组查询嵌套

```cs
fsql.Select<User1>()
    .WithTempQuery(a => new
    {
        user = a,
        rownum = SqlExt.RowNumber().Over().PartitionBy(a.Nickname).OrderBy(a.Id).ToValue()
    })
    .Where(a => a.rownum == 1)
    .FromQuery(fsql.Select<UserExt>().Where(b => b.UserId > 0)
        .GroupBy(b => new { b.UserId, b.Remark })
        .WithTempQuery(b => new { b.Key, sum1 = b.Sum(b.Value.UserId) }))
    .InnerJoin((a, b) => a.user.Id == b.Key.UserId)
    .Where((a, b) => a.user.Nickname == "name03" || a.user.Nickname == "name02")
    .ToList((a, b) => new
    {
        user = a.user,
        rownum = a.rownum,
        groupby = b
    });
```

```sql
SELECT ...
FROM (
    SELECT a.[Id], a.[Nickname], row_number() over( partition by a.[Nickname] order by a.[Id]) [rownum]
    FROM [User1] a ) a
INNER JOIN (
    SELECT a.[UserId], a.[Remark], sum(a.[UserId]) [sum1]
    FROM [UserExt] a
    WHERE (a.[UserId] > 0)
    GROUP BY a.[UserId], a.[Remark] ) b ON a.[Id] = b.[UserId]
WHERE (a.[rownum] = 1) AND ((a.[Nickname] = N'name03' OR a.[Nickname] = N'name02'))
```

## 场景4：内存数据嵌套

假设跨数据库服务器，或者数据表被缓存过，WithMemory 便可以实现数据表与内存关联查询。

```csharp
var list = new List<User1>();
list.Add(new User1 { Id = Guid.NewGuid() });
list.Add(new User1 { Id = Guid.NewGuid() });
list.Add(new User1 { Id = Guid.NewGuid() });

var listSql2 = fsql.Select<UserGroup>()
    .FromQuery(fsql.Select<User1>().WithMemory(list))
    .InnerJoin((a, b) => a.Id == b.GroupId)
    .ToSql();
```

```sql
SELECT ...
FROM [UserGroup] a
INNER JOIN (
    SELECT ...
    UNION ALL
    SELECT ...
    UNION ALL
    SELECT ...
) b ON a.[Id] = b.[GroupId]
```

## 场景5：自动分表后分页 分组聚合

自动分表后，如果有分页的需求 或者分组聚合的需求可以参考以下代码

```csharp
var result = fsql.Select<Statistics>()
    .Where(a => a.createtime.BetweenEnd(startTime, endTime))  //时间字段定位表
    .WithTempQuery(a => new { item = a })
    .GroupBy(a => a.item.shareId)
    .Count(out var total)
    .Page(dto.page, dto.limit)
    .ToSql(g => new {
        Sid = a.Key,
        Sum1 = g.Sum(g.Value.item.field1),
        Sum2 = g.Sum(g.Value.item.field2),
    });
```

```sql
SELECT a.`shareId` as1, sum( a.`field1` ) as3, sum( a.`field2` ) as5
FROM (
    SELECT ...
    FROM (
        SELECT ...
        FROM `Statistics_2023` a
        WHERE (a.`createtime` >= '2022-01-01 00:00:00' AND a.`createtime` < '2023-01-14 00:00:00')
    ) ftb
    UNION ALL
    SELECT ...
    FROM (
        SELECT ...
        FROM `Statistics_2022` a
        WHERE (a.`createtime` >= '2022-01-01 00:00:00' AND a.`createtime` < '2023-01-14 00:00:00')
    ) ftb
) a
GROUP BY a.`shareId`
LIMIT 0,30
```

## 场景6：FromQuery 多个查询，最后映射查询

```csharp
var query2 = fsql.Select<UnitLog, LoadPlan, Instruction>()
    .InnerJoin((a, b, c) => a.LoadNo == b.LoadNo && a.UnitTransactionType == "TO")
    .InnerJoin((a, b, c) => b.InstructionNo == c.InstructionNo)
    .WithTempQuery((a, b, c) => new
    {
        a.LoadNo,
        a.SeqNoLog,
        c.DeliveryInstractionStatus,
        c.UpTime,
        RN = SqlExt.RowNumber().Over().PartitionBy(a.UnitId).OrderByDescending(a.SeqNoLog).ToValue()
    });
var query3 = fsql.Select<Unit>();

fsql.Select<UnitLog>()
    .FromQuery(query2, query3)
    .InnerJoin((a,b,c) => a.SeqNoLog == b.SeqNoLog)
    .InnerJoin((a,b,c) => a.UnitId == c.UnitId)
    .Where((a,b,c) => b.RN < 2)
    .ToSql((a,b,c) => new MB51_View
    {
        //CkassIfCation = a.CkassIfCation,
        PGI = b.DeliveryInstractionStatus,
        PGITime = b.UpTime,
        IsDelayPGI = true,
        RunNo = c.RunNo
    });
```

```sql
SELECT a.[CkassIfCation] as1, b.[DeliveryInstractionStatus] as2, b.[UpTime] as3, 1 as4, c.[RunNo] as5
FROM [UnitLog] a
INNER JOIN (SELECT a.[LoadNo], a.[SeqNoLog], c.[DeliveryInstractionStatus], c.[UpTime], row_number() over( partition by a.[UnitId] order by a.[SeqNoLog] desc) [RN]
    FROM [UnitLog] a
    INNER JOIN [LoadPlan] b ON a.[LoadNo] = b.[LoadNo] AND a.[UnitTransactionType] = N'TO'
    INNER JOIN [Instruction] c ON b.[InstructionNo] = c.[InstructionNo] ) b ON a.[SeqNoLog] = b.[SeqNoLog]
INNER JOIN [Unit] c ON a.[UnitId] = c.[UnitId]
WHERE (b.[RN] < 2)
```

## 场景7：报表（每日）

1. 从内存创建连续的日期 List
2. 使用 FromQuery 与多个 ISelect 横向 LeftJoin

```csharp
var startDate = DateTime.Parse("2024-11-1");
var endDate = DateTime.Parse("2024-12-1");
fsql.Select<object>()
    .WithMemory(
        Enumerable.Range(0, (int)endDate.Subtract(startDate).TotalDays)
            .Select(a => new { Date = startDate.AddDays(a).ToString("yyyy-MM-dd") })
            .ToList()
    )
    .FromQuery(
        fsql.Select<T1, T2>().InnerJoin((a,b) => ...)
            .Where((a,b) => a.CreateDate.BetweenEnd(startDate, endDate)
            .GroupBy((a,b) => a.CreateDate.Date.ToString("yyyy-MM-dd"))
            .WithTempQuery(g => new { Date = g.Key, Type1Total = g.Sum(g.Value.Item2.Qty1) }),
        fsql.Select<T3>()
            .Where(a => a.CreateDate.BetweenEnd(startDate, endDate)
            .GroupBy(a => a.CreateDate.Date.ToString("yyyy-MM-dd"))
            .WithTempQuery(g => new { Date = g.Key, Type2Total = g.Sum(g.Value.Qty2) }),
        //... 最多支持 16 个 ISelect 合并
    )
    .LeftJoin(t => t.t2.Date = t.t1.Date)
    .LeftJoin(t => t.t3.Date = t.t1.Date)
    .OrderByDescending(t => t.t1.Date)
    .ToList(t => new
    {
        t.t1.Date,
        Sum1 = t.t2.Type1Total,
        Sum2 t.t3.Type2Total
    });
```

## WithParameters 参数化共享

开启参数化查询功能后，使用 WithParameters 共享参数化，可避免产生相同的参数名称：

```csharp
var dbpars = new List<DbParameter>();

var id1 = 1;
var id2 = 2;
var sql = fsql.Select<User1>()
    .WithParameters(dbpars)
    .Where(a => a.Id == id1)

    .FromQuery(
        fsql.Select<User1>()
            .WithParameters(dbpars)
            .Where(a => a.Id == id2)
    )
    .InnerJoin((a,b) => a.Id == b.Id)
    .ToSql();
```

```sql
SELECT a."Id", a."GroupId", a."Username"
FROM (
    SELECT a."Id", a."GroupId", a."Username"
    FROM "User1" a
    WHERE (a."Id" = @exp_0)
) a
INNER JOIN (
    SELECT a."Id", a."GroupId", a."Username"
    FROM "User1" a
    WHERE (a."Id" = @exp_1) ) b ON b."Id" = a."Id"
```

---

## 子表Exists

```csharp
fsql.Select<Topic>()
    .Where(a => fsql.Select<Topic>().As("b").Where(b => b.Id == a.Id).Any())
    .ToList();
//SELECT a.[Id], a.[Title], a.[Clicks], a.[CreateTime], a.[CategoryId]
//FROM [Topic] a
//WHERE (exists(SELECT 1
//    FROM [Topic] b
//    WHERE (b.[Id] = a.[Id])
//    limit 0,1))
```

> 提示：由于子查询的实体类与上层相同，使用 As("b") 指明别名，以便区分

## 子表In

```csharp
fsql.Select<Topic>()
    .Where(a => fsql.Select<Topic>().As("b").ToList(b => b.Id).Contains(a.Id))
    .ToList();
//SELECT a.[Id], a.[Title], a.[Clicks], a.[CreateTime], a.[CategoryId]
//FROM [Topic] a
//WHERE (((a.[Id]) in (SELECT b.[Id]
//    FROM [Topic] b)))
```

## 子表Join

v1.8.0+ string.Join + ToList 实现将子查询的多行结果，拼接为一个字符串，如："1,2,3,4"

```csharp
fsql.Select<Topic>().ToList(a => new {
    id = a.Id,
    concat = string.Join(",", fsql.Select<StringJoin01>().ToList(b => b.Id))
});
//SELECT a.[Id], (SELECT group_concat(b.[Id] separator ',')
//    FROM [StringJoin01] b)
//FROM [Topic] a
```

## 子表First/Count/Sum/Max/Min/Avg

```csharp
fsql.Select<Category>().ToList(a => new
{
    all = a,
    first = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).First(b => b.Id),
    count = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Count(),
    sum = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Sum(b => b.Clicks),
    max = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Max(b => b.Clicks),
    min = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Min(b => b.Clicks),
    avg = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Avg(b => b.Clicks)
});
```

## 子表ToList

```csharp
//最多执行3次 SQL
fsql.Select<Topic>().ToList(a => new
{
    all = a,
    list1 = fsql.Select<T2>().ToList(),
    list2 = fsql.Select<T2>().Where(b => b.TopicId == a.Id).ToList()
});

//分组之后，最多执行3次 SQL
fsql.Select<Topic>()
    .GroupBy(a => new { a.Author })
    .WithTempQuery(a => new { Author = a.Key.Author, Count = a.Count() })
    .ToList(a => new
    {
        a.Author, a.Count,
        list1 = fsql.Select<T2>().ToList(),
        list2 = fsql.Select<T2>().Where(b => b.Author == a.Author).ToList()
    });
```

## ToSql + WithSql

这是早期提供的嵌套查询方法

```csharp
var sql = fsql.Select<User1>()
    .Where(a => a.Id < 1000)
    .ToSql(a => new
    {
        item = a,
        rownum = SqlExt.RowNumber().Over().PartitionBy(a.Nickname).OrderBy(a.Id).ToValue()
    }, FieldAliasOptions.AsProperty);

fsql.Select<User1>()
    .WithSql(sql)
    .Where("a.rownum = 1")
    .ToList();
```

```sql
SELECT a.[Id], a.[Nickname]
FROM (
    SELECT a.[Id], a.[Nickname], row_number() over( partition by a.[Nickname] order by a.[Id]) [rownum]
    FROM [User1] a
    WHERE a.[Id] < 1000
) a
WHERE (a.rownum = 1)
```
