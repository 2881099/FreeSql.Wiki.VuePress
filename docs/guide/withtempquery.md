# 嵌套查询

## WithTempQuery

> 版本要求：v3.2.666+

场景1：查询分组第一条记录

```csharp
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

场景2：分组查询嵌套

待补充..

场景3：嵌套查询 + Join

待补充..

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
