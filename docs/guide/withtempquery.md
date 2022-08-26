# 嵌套查询 ✨

## WithTempQuery

意见往集：<https://github.com/dotnetcore/FreeSql/discussions/1192>

需求版本：v3.2.666-preview (最新)

GroupBy + WithTempQuery(嵌套查询) + FromQuery + UnionAll 组合使用，会让查询功能更加强大、灵活。

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
    .Where(a => a.rownum == 1)
    //.From<UserExt>() //普通联表
    .FromQuery(fsql.Select<UserExt>().Where(b => b.Id > 0)) //子查询联表
    //.FromQuery(fsql.Select<UserExt, UserGroup, xxx>() //子多表查询联表
    //    .WithTempQuery((a,b,c) => new { ... }))
    .InnerJoin((a, b) => a.item.Id == b.UserId)
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
    FROM [User1] a ) a 
INNER JOIN ( 
    SELECT a.[UserId], a.[Remark] 
    FROM [TwoTablePartitionBy_UserExt] a 
    WHERE (a.[UserId] > 0) ) b ON a.[Id] = b.[UserId] 
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
    FROM [User] a ) a 
INNER JOIN ( 
    SELECT a.[UserId], a.[Remark], sum(a.[UserId]) [rownum] 
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

---

## 子表Exists

```cs
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

```cs
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

```cs
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
fsql.Select<Category>().ToList(a => new  {
  all = a,
  first = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).First(b => b.Id),
  count = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Count(),
  sum = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Sum(b => b.Clicks),
  max = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Max(b => b.Clicks),
  min = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Min(b => b.Clicks),
  avg = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Avg(b => b.Clicks)
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
