# 低代码

本篇是继[《动态操作》](dynamic)文档之后的大功能，专门为低代码设计。

FreeSql 默认依赖实体类型，虽然运行时可以动态创建 Type，但不断的动态编译导致会内存无法释放，对 Type 的版本也难以管理。

本功能是独立的，使用纯字典（无实体类型）进行 CRUD，支持导航属性，级联操作等功能。

注意：本功能是独立的，请勿与其他文档的级联机制搞混。

## 字典 CUD（单表）

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
fsql.UpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
fsql.InsertOrUpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
```

InsertDict/UpdateDict/DeleteDict/InsertOrUpdateDict 都支持批量操作，对应类型 List\<Dictionary\<string, object\>\>

## 无类型 CRUD（更高级）

不依赖实体类型，不需要动态编译，纯字典操作，支持导航属性，级联保存，AOT 编译福音。

nuget 安装：

> dotnet add package FreeSql.Extensions.ZeroEntity

```csharp
var ctx = new ZeroDbContext(fsql, JsonConvert.DeserializeObject<TableDescriptor[]>(json)); //在文档后面

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

查询，返回结果是字典 Dictionary\<string, object\>：

```csharp
//自动级联
ctx.Select.Where("id", 1).ToList();

//单独查询
ctx.SelectNoTracking("User")
  //.IncludeAll()
  .Include("Ext.Remarks", then => then.Where("remark", "like", "error"))
  .Include("Roles", then => then.Include("Users",
    then => then.Include("Ext.Remarks")))
  .ToList();

//普通多表查询
ctx.SelectNoTracking("User")
  .LeftJoin("UserExt", "UserId", "User.Id")
  .ToList();
//[{id:1, UserExt:{} },..]
```

上述 ctx 对象依赖 json 配置如下：

```json
[
  {
    "Name":"User",
    "Comment":"用户表",
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
    "Comment":"用户扩展信息表",
    "Columns":[
      {"Name":"UserId","IsPrimary":true,"MapType":"System.Int32"},
    ],
    "Navigates":[
      {"Name":"Remarks","Type":"OneToMany","RelTable":"UserExtRemarks","Bind":"UserId"},
    ],
  },
  {
    "Name":"UserExtRemarks",
    "Comment":"用户扩展信息表-子表",
    "Columns":[
      {"Name":"RemarkId","IsPrimary":true,"MapType":"System.Guid"},
      {"Name":"UserId","MapType":"System.Int32"},
      {"Name":"Remark","MapType":"System.String"},
    ],
  },
  {
    "Name":"UserClaim",
    "Comment":"一对多测试表",
    "Columns":[
      {"Name":"Id","IsPrimary":true,"IsIdentity":true,"MapType":"System.Int32"},
      {"Name":"UserId","MapType":"System.Int32"},
      {"Name":"ClaimName","MapType":"System.String"},
    ],
  },
  {
    "Name":"Role",
    "Comment":"权限表",
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
    "Comment":"多对多中间表",
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

## 级联机制

理解本机制之前，请先忘记 Repository/DbContext 等之前的级联机制，他们没有关联。

schemas[] 是一组表映射信息定义，包含表名、列名、导航属性、索引等信息

- 导航属性：OneToOne/OneToMany/ManyToOne/ManyToMany
- 聚合根：OneToOne/OneToMany/多对多中间表，作为一个整体看待
- 外部根：ManyToOne/ManyToMany外部表，作为外部看待，它有自己的聚合根整体

举例：

- User 为聚合根
- UserExt/UserClaim/UserRole 这三个表是子成员，一起存储/删除
- Role 为外部根（相对 User 而言，它自己是独立的聚合根）

CURD 都是基于 schemas[0] 聚合根进行操作

- 查询：贪婪加载所有子成员，以及外部根，以及外部根的外部根（递归）
- 状态管理：快照聚合根副本（由于外部根也是聚合根，即外部根与聚合根是并行存储关系）

对比保存：

将当前操作的聚合根与状态管理的副本进行对比，计算出发生变化的列

| 导航属性 | 副本 | 最新 | 动作 |
| -- | -- | -- | -- |
| OneToOne | NULL | Object | 添加新记录 |
| OneToOne | Object | NULL | 删除副本记录 |
| OneToOne | Object | Object | 发生变化则更新，否则忽略 |
| OneToMany | NULL/Empty | List | 添加最新List记录 |
| OneToMany | List | NULL | 忽略 |
| OneToMany | List | Empty | 删除副本List记录 |
| OneToMany | List | List | 对比保存，计算出添加/更新/删除三种行为 |
| 多对多中间表 | | | 与 OneToMany 一致 |

插入：

- OneToOne 级联插入
- OneToMany 级联插入
- ManyToOne 先对比保存外部根，关联外部根ID，再插入聚合根
- ManyToMany 先对比保存外部根，插入聚合根，再插入中间表

更新：

- OneToOne 级联对比保存
- OneToMany 级联对比保存
- ManyToOne 先对比保存外部根，再关联外部根ID，再更新聚合根
- ManyToMany 先对比保存外部根，再更新聚合根，再对比保存中间表

删除：
- OneToOne 级联删除
- OneToMany 级联删除
- ManyToOne 忽略
- ManyToMany 级联删除中间表（注意不删除外部根）
