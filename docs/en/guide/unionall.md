# Union

Previously, it was recommended to use `ToSql` + `WithSql` for performing union queries. Starting from v3.2.666, the `UnionAll` method is available for direct use.

Combining `GroupBy` + `WithTempQuery` (nested queries) + `FromQuery` + `UnionAll` makes querying more powerful and flexible.

## Single Table UNION ALL

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

## Multiple Tables UNION ALL

```csharp
var sql = fsql.Select<User, Group>()
    .InnerJoin((a, b) => a.GroupId == b.Id)
    .Where((a, b) => a.Id == 1)
    .WithTempQuery((a, b) => new { user = a, group = b }) // Anonymous type

    .UnionAll(
        fsql.Select<User, Group>()
            .InnerJoin((a, b) => a.GroupId == b.Id)
            .Where((a, b) => a.Id == 2)
            .WithTempQuery((a, b) => new { user = a, group = b }) // Anonymous type
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

Note: The above SQL may result in an error because both `User` and `UserGroup` have the same `Id` field name. The temporary solution is to specify the fields.

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

## WithParameters Sharing

After enabling parameterized query functionality, use `WithParameters` to share parameters, avoiding duplicate parameter names:

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