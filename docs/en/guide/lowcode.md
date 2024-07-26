# Untyped Mapping

This document follows the [“Dynamic Operations”](dynamic.md) and is designed specifically for low-code solutions.

FreeSql defaults to using entity types. Although types can be dynamically created at runtime, frequent dynamic compilation can lead to memory leaks and difficulties in managing type versions.

This feature operates independently and performs CRUD operations using pure dictionaries (without entity types), supporting features such as navigation properties and cascading operations.

Note: This feature operates independently; do not confuse it with the cascading mechanism in other documents.

## Dictionary CUD (Single Table)

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
fsql.UpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
fsql.InsertOrUpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
```

`InsertDict/UpdateDict/DeleteDict/InsertOrUpdateDict` all support batch operations, corresponding to the type `List<Dictionary<string, object>>`.

## Untyped CRUD (Advanced)

No dependence on entity types, no dynamic compilation needed, pure dictionary operations, supports navigation properties, cascading saves, and AOT compilation.

NuGet installation:

> dotnet add package FreeSql.Extensions.ZeroEntity

```csharp
var ctx = new ZeroDbContext(fsql, JsonConvert.DeserializeObject<TableDescriptor[]>(json)); // see the end of the document

var item = JsonConvert.DeserializeObject<Dictionary<string, object>>(@"
{
  ""Name"":""user1"",
  ""Ext"":
  {
    ""Remarks"":[{""Remark"":""remark1""},{""Remark"":""remark2""}]
  },
  ""Claims"":[{""ClaimName"":""claim1""},{""ClaimName"":""claim2""},{""ClaimName"":""claim3""}],
  ""Roles"":[{""Name"":""role1""},{""Name"":""role2""}]
}");
ctx.Insert(item);

var item2 = JsonConvert.DeserializeObject<Dictionary<string, object>>(@"
{
  ""Id"":1,
  ""Name"":""user1111"",
  ""Ext"":{},
  ""Claims"":[{""Id"":1,""ClaimName"":""claim1111""},{""Id"":""3"",""ClaimName"":""claim3222222""},{""ClaimName"":""claim0000""}],
  ""Roles"":[{""Name"":""role111100001""},{""Id"":2,""Name"":""role2""}]
}");
ctx.Update(item2);
ctx.Delete(item2);
```

```sql
INSERT INTO [Role]([Name]) OUTPUT INSERTED.[Id] as [Id], INSERTED.[Name] as [Name] VALUES(N'role1'), (N'role2')
INSERT INTO [User]([Name]) OUTPUT INSERTED.[Id] as [Id], INSERTED.[Name] as [Name] VALUES(N'user1')
INSERT INTO [UserExt]([UserId]) VALUES(1)
INSERT INTO [UserExtRemarks]([RemarkId], [UserId], [Remark]) VALUES('6570e3f8-a226-c3ac-00d1-a3dd18b30339', 1, N'remark1'), ('6570e3f8-a226-c3ac-00d1-a3de16d9aa68', 1, N'remark2')
INSERT INTO [UserClaim]([UserId], [ClaimName]) OUTPUT INSERTED.[Id] as [Id], INSERTED.[UserId] as [UserId], INSERTED.[ClaimName] as [ClaimName] VALUES(1, N'claim1'), (1, N'claim2'), (1, N'claim3')
INSERT INTO [UserRole]([UserId], [RoleId]) VALUES(1, 5), (1, 6)

INSERT INTO [Role]([Name]) OUTPUT INSERTED.[Id] as [Id], INSERTED.[Name] as [Name] VALUES(N'role111100001'), (N'role2')
INSERT INTO [UserClaim]([UserId], [ClaimName]) OUTPUT INSERTED.[Id] as [Id], INSERTED.[UserId] as [UserId], INSERTED.[ClaimName] as [ClaimName] VALUES(1, N'claim0000')
INSERT INTO [UserRole]([UserId], [RoleId]) VALUES(1, 7), (1, 8)
DELETE FROM [UserRole] WHERE ([UserId] = 1 AND [RoleId] = 6)
DELETE FROM [UserRole] WHERE ([UserId] = 1 AND [RoleId] = 5)
DELETE FROM [UserClaim] WHERE ([Id] = 2)
UPDATE [User] SET [Name] = N'user1111'
WHERE ([Id] = 1)
UPDATE [UserClaim] SET [ClaimName] = CASE [Id]
WHEN 1 THEN N'claim1111'
WHEN 3 THEN N'claim3222222' END
WHERE ([Id] IN (1,3))

DELETE FROM [UserRole] WHERE (([UserId] = 1 AND [RoleId] = 7) OR ([UserId] = 1 AND [RoleId] = 8))
DELETE FROM [UserClaim] WHERE ([Id] IN (1,3,4))
DELETE FROM [UserExt] WHERE ([UserId] = 1)
DELETE FROM [User] WHERE ([Id] = 1)
```

Queries return results as dictionaries `Dictionary<string, object>`:

```csharp
// Automatic cascading
ctx.Select.Where("id", 1).ToList();

// Separate query
ctx.SelectNoTracking("User")
  //.IncludeAll()
  .Include("Ext.Remarks", then => then.Where("remark", "like", "error"))
  .Include("Roles", then => then.Include("Users",
    then => then.Include("Ext.Remarks")))
  .ToList();

// Regular multi-table query
ctx.SelectNoTracking("User")
  .LeftJoin("UserExt", "UserId", "User.Id")
  .ToList();
//[{id:1, UserExt:{} },..]
```

The `ctx` object depends on the JSON configuration as follows:

```json
[
  {
    "Name":"User",
    "Comment":"User Table",
    "Columns": [
      {"Name":"Id","IsPrimary":true,"IsIdentity":true,"MapType":"System.Int32"},
      {"Name":"Name","MapType":"System.String"}
    ],
    "Navigates":[
      {"Name":"Ext","Type":"OneToOne","RelTable":"UserExt"},
      {"Name":"Claims","Type":"OneToMany","RelTable":"UserClaim","Bind":"UserId"},
      {"Name":"Roles","Type":"ManyToMany","RelTable":"Role","ManyToMany":"UserRole"}
    ],
    "Indexes":[]
  },
  {
    "Name":"UserExt",
    "Comment":"User Extension Information Table",
    "Columns":[
      {"Name":"UserId","IsPrimary":true,"MapType":"System.Int32"},
    ],
    "Navigates":[
      {"Name":"Remarks","Type":"OneToMany","RelTable":"UserExtRemarks","Bind":"UserId"},
    ],
  },
  {
    "Name":"UserExtRemarks",
    "Comment":"User Extension Information Table - Sub Table",
    "Columns":[
      {"Name":"RemarkId","IsPrimary":true,"MapType":"System.Guid"},
      {"Name":"UserId","MapType":"System.Int32"},
      {"Name":"Remark","MapType":"System.String"},
    ],
  },
  {
    "Name":"UserClaim",
    "Comment":"One-to-Many Test Table",
    "Columns":[
      {"Name":"Id","IsPrimary":true,"IsIdentity":true,"MapType":"System.Int32"},
      {"Name":"UserId","MapType":"System.Int32"},
      {"Name":"ClaimName","MapType":"System.String"},
    ],
  },
  {
    "Name":"Role",
    "Comment":"Permission Table",
    "Columns":[
      {"Name":"Id","IsPrimary":true,"IsIdentity":true,"MapType":"System.Int32"},
      {"Name":"Name","MapType":"System.String"}
    ],
    "Navigates":[
      {"Name":"Users","Type":"ManyToMany","RelTable":"User","ManyToMany":"UserRole"}
    ],
    "Indexes":[]
  },
  {
    "Name":"UserRole",
    "Comment":"Many-to-Many Intermediate Table",
    "Columns":[
      {"Name":"UserId","IsPrimary":true,"MapType":"System.Int32"},
      {"Name":"RoleId","IsPrimary":true,"MapType":"System.Int32"}
    ],
    "Navigates":[
      {"Name":"User","Type":"ManyToOne","RelTable":"User","Bind":"UserId"},
      {"Name":"Role","Type":"ManyToOne","RelTable":"Role","Bind":"RoleId"}
    ]
  }
]
```

## Cascading Mechanism

Before understanding this mechanism, please forget about the cascading mechanisms of Repository/DbContext and other prior methods; they are unrelated.

`schemas[]` is a set of table mapping information definitions, including table names, column names, navigation properties, indexes, etc.

- Navigation Properties: OneToOne/OneToMany/ManyToOne/ManyToMany
- Aggregate Root: OneToOne/OneToMany/Many-to-Many Intermediate Tables, treated as a whole
- External Root: ManyToOne/ManyToMany External

For example:

- `User` is the aggregate root.
- `UserExt/UserClaim/UserRole` are child members of the `User` table, stored/deleted together.
- `Role` is an external root (relative to `User`, it is an independent aggregate root).

CRUD operations are based on the aggregate root of `schemas[0]`.

- Query: Eagerly load all child members, the external root, and the external root's external roots (recursively).
- State Management: Snapshot of the aggregate root (since external roots are also aggregate roots, they are stored in parallel to the aggregate root).

Comparing and Saving:

Compare the current operation's aggregate root with the snapshot copy to calculate the changes in columns.

| Navigation Property | Snapshot | Latest | Action |
| -- | -- | -- | -- |
| OneToOne | NULL | Object | Add new record |
| OneToOne | Object | NULL | Delete snapshot record |
| OneToOne | Object | Object | Update if changed, otherwise ignore |
| OneToMany | NULL/Empty | List | Add latest List records |
| OneToMany | List | NULL | Ignore |
| OneToMany | List | Empty | Delete snapshot List records |
| OneToMany | List | List | Compare and save, calculate add/update/delete actions |
| Many-to-Many Intermediate Table | | | Same as OneToMany |

Insert:

- OneToOne: Cascading insert
- OneToMany: Cascading insert
- ManyToOne: Compare and save external root first, associate external root ID, then insert the aggregate root
- ManyToMany: Compare and save external root first, insert aggregate root, then insert into the intermediate table

Update:

- OneToOne: Cascading compare and save
- OneToMany: Cascading compare and save
- ManyToOne: Compare and save external root first, associate external root ID, then update the aggregate root
- ManyToMany: Compare and save external root first, update the aggregate root, then compare and save the intermediate table

Delete:

- OneToOne: Cascading delete
- OneToMany: Cascading delete
- ManyToOne: Ignore
- ManyToMany: Cascading delete from the intermediate table (note: do not delete the external root)