# 联合查询

在之前都是推荐使用 ToSql + WithSql 完成联合查询操作，v3.2.666 新增功能直接使用 UnionAll 方法。

GroupBy + WithTempQuery(嵌套查询) + FromQuery + UnionAll 组合使用，会让查询功能更加强大、灵活。

## 单表 UNION ALL

```csharp
var sql = fsql.Select<User>().Where(a => a.Id == 1)
    .UnionAll(
        fsql.Select<User>().Where(a => a.Id == 2),
        fsql.Select<User>().Where(a => a.Id == 3)
    )
    .Where(a => a.Id == 1 || a.Id == 2)
    .ToSql();
```

```sql
SELECT a."Id", a."GroupId", a."Username" 
FROM ( SELECT a."Id", a."GroupId", a."Username" 
    FROM "User" a 
    WHERE (a."Id" = 1) 
    UNION ALL 
    SELECT a."Id", a."GroupId", a."Username" 
    FROM "User" a 
    WHERE (a."Id" = 2) 
    UNION ALL 
    SELECT a."Id", a."GroupId", a."Username" 
    FROM "User" a 
    WHERE (a."Id" = 3) ) a 
WHERE ((a."Id" = 1 OR a."Id" = 2))
```

## 多表 UNION ALL

```csharp
var sql = fsql.Select<User, Group>()
    .InnerJoin((a, b) => a.GroupId == b.Id)
    .Where((a, b) => a.Id == 1)
    .WithTempQuery((a, b) => new { user = a, group = b }) //匿名类型

    .UnionAll(
        fsql.Select<User, Group>()
            .InnerJoin((a, b) => a.GroupId == b.Id)
            .Where((a, b) => a.Id == 2)
            .WithTempQuery((a, b) => new { user = a, group = b }) //匿名类型
    )
    .Where(a => a.user.Id == 1 || a.user.Id == 2)
    .ToSql();
```

```sql
SELECT * 
FROM ( SELECT * 
    FROM ( 
        SELECT a."Id", a."GroupId", a."Username", b."Id", b."GroupName" 
        FROM "User" a 
        INNER JOIN "UserGroup" b ON a."GroupId" = b."Id" 
        WHERE (a."Id" = 1) ) a 
    UNION ALL 
    SELECT * 
    FROM ( 
        SELECT a."Id", a."GroupId", a."Username", b."Id", b."GroupName" 
        FROM "User" a 
        INNER JOIN "UserGroup" b ON a."GroupId" = b."Id" 
        WHERE (a."Id" = 2) ) a ) a 
WHERE ((a."Id" = 1 OR a."Id" = 2))
```

注意：如上 SQL 会执行报错，因为 User、UserGroup 都存在相同的 Id 字段名称，暂时的解决办法需要指定字段

```csharp
    .WithTempQuery((a, b) => new 
    { 
        user = a, 
        group = new
        {
            GroupId = b.Id,
            GroupName = b.GroupName
        } 
    })
```

## WithParameters 参数化共享

开启参数化查询功能后，使用 WithParameters 共享参数化，避免产生相同的参数名称：

```csharp
var dbpars = new List<DbParameter>();

var id1 = 1;
var id2 = 2;
var sql = fsql.Select<User>()
    .WithParameters(dbpars)
    .Where(a => a.Id == id1)

    .UnionAll(
        fsql.Select<User>()
            .WithParameters(dbpars)
            .Where(a => a.Id == id2)
    )
    .Where(a => a.Id == 1 || a.Id == 2)
    .ToSql();
```

```sql
SELECT a."Id", a."GroupId", a."Username" 
FROM ( SELECT a."Id", a."GroupId", a."Username" 
    FROM "User1" a 
    WHERE (a."Id" = @exp_0) 
    UNION ALL 
    SELECT a."Id", a."GroupId", a."Username" 
    FROM "User1" a 
    WHERE (a."Id" = @exp_1) ) a 
WHERE ((a."Id" = 1 OR a."Id" = 2))
```
