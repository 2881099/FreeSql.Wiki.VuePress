# Nested ✨

## WithTempQuery

Required version: v3.2.666+

Combining GroupBy + WithTempQuery (nested queries) + FromQuery + UnionAll can make queries more powerful and flexible.

Note: When using multiple anonymous types with WithTempQuery in FromQuery, ensure they are not of the same type (use any property to distinguish) [#1620](https://github.com/dotnetcore/FreeSql/issues/1620)

## Example 1: Query the First Record of Each Group

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

> Tip: Supports multi-table nested queries, e.g., `fsql.Select<User1, UserGroup1>()`

```sql
SELECT *
FROM (
    SELECT a.[Id], a.[Nickname], row_number() over( partition by a.[Nickname] order by a.[Id]) [rownum]
    FROM [User1] a
    WHERE a.[Id] < 1000
) a
WHERE (a.[rownum] = 1)
```

If the database does not support window functions, you can use grouped nested queries:

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

## Example 2: Nested Query + Join

WithTempQuery + From\<T2\> or FromQuery(ISelect\<T2\>) can achieve unlimited joins.

```cs
fsql.Select<User1>()
    .Where(a => a.Id < 1000)
    .WithTempQuery(a => new
    {
        item = a,
        rownum = SqlExt.RowNumber().Over().PartitionBy(a.Nickname).OrderBy(a.Id).ToValue()
    })
    //.From<UserExt>() // Regular join
    .FromQuery(fsql.Select<UserExt>().Where(b => b.Id > 0)) // Subquery join
    //.FromQuery(fsql.Select<UserExt, UserGroup, xxx>() // Sub multi-table join
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
    FROM [TwoTablePartitionBy_UserExt] a
    WHERE (a.[UserId] > 0) ) b ON a.[Id] = b.[UserId]
WHERE (a.[rownum] = 1)
```

## Example 3: Group Query Nested

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
    FROM [User] a ) a
INNER JOIN (
    SELECT a.[UserId], a.[Remark], sum(a.[UserId]) [sum1]
    FROM [UserExt] a
    WHERE (a.[UserId] > 0)
    GROUP BY a.[UserId], a.[Remark] ) b ON a.[Id] = b.[UserId]
WHERE (a.[rownum] = 1) AND ((a.[Nickname] = N'name03' OR a.[Nickname] = N'name02'))
```

## Example 4: In-Memory Data Nesting

Assuming cross-database servers or cached tables, `WithMemory` allows for querying between data tables and memory.

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

## Example 5: Automated Sharding with Pagination and Group Aggregation

After automated sharding, if pagination or grouping aggregation is needed, refer to the following code:

```csharp
var result = fsql.Select<Statistics>()
    .Where(a => a.createtime.BetweenEnd(startTime, endTime))  // Time field for table location
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

## Example 6: FromQuery with Multiple Queries and Final Mapping

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

## WithParameters Sharing

After enabling parameterized queries, using `WithParameters` to share parameters can avoid creating identical parameter names:

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
    .InnerJoin((a, b) => a.Id == b.Id)
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

## Subquery Exists

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

> Note: Since the entity class of the subquery is the same as the outer one, use `As("b")` to specify an alias for distinction.

## Subquery In

```csharp
fsql.Select<Topic>()
    .Where(a => fsql.Select<Topic>().As("b").ToList(b => b.Id).Contains(a.Id))
    .ToList();
//SELECT a.[Id], a.[Title], a.[Clicks], a.[CreateTime], a.[CategoryId]
//FROM [Topic] a
//WHERE (((a.[Id]) in (SELECT b.[Id]
//    FROM [Topic] b)))
```

## Subquery Join

v1.8.0+ `string.Join` + `ToList` to concatenate multiple rows of the subquery result into a single string, e.g., "1,2,3,4"

```csharp
fsql.Select<Topic>().ToList(a => new {
    id = a.Id,
    concat = string.Join(",", fsql.Select<StringJoin01>().ToList(b => b.Id))
});
//SELECT a.[Id], (SELECT group_concat(b.[Id] separator ',')
//    FROM [StringJoin01] b)
//FROM [Topic] a
```

## Subquery First/Count/Sum/Max/Min/Avg

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

## Subquery ToList

```csharp
// Executes up to 3 SQL queries
fsql.Select<Topic>().ToList(a => new
{
    all = a,
    list1 = fsql.Select<T2>().ToList(),
    list2 = fsql.Select<T2>().Where(b => b.TopicId == a.Id).ToList()
});

// After grouping, executes up to 3 SQL queries
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

This is an early method for nested queries.

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
