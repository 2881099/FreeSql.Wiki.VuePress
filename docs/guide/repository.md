---
title: 仓储
tag:
  - Repository
---

`FreeSql.DbContext` 参考 abp vnext 接口规范，实现了通用的仓储层功能（CURD），理解成传统增强版（DAL）。

::: code-tabs

@tab:active .NET CLI

```bash
 dotnet add package FreeSql.DbContext
```

@tab .NET Framework

```bash
Install-Package FreeSql.DbContext
```

:::

- Select/Attach 快照对象，Update 只更新变化的字段；
- Insert 插入数据，适配各数据库优化执行 ExecuteAffrows/ExecuteIdentity/ExecuteInserted；
- 级联保存、级联删除（一对一、一对多、多对多）；
- 仓储 + 工作单元设计模式，风格简洁、统一；

```csharp
public class Song
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
}
```

> 注意：Repository 对象多线程不安全，因此不应在多个线程上同时对其执行工作。

## 临时用法

```csharp
var curd = fsql.GetRepository<Song>();
```

> 适合在局部代码中，临时的创建仓储，用完就扔掉。

## 泛型仓储（依赖注入）

方法 2、泛型仓储+依赖注入（.NET Core)；

```csharp
//先看入门文档注入 IFreeSql
services.AddFreeRepository();

//在控制器使用泛型仓储
public SongsController(IBaseRepository<Song> songRepository)
{
}
```

## 继承仓储（依赖注入）

```csharp
//先看入门文档注入 IFreeSql
services.AddFreeRepository(typeof(SongRepository).Assembly); //如果没有继承的仓储，第二个参数不用传

//使用继承的仓储
public SongsController(SongRepository repo1, TopicRepository repo2)
{
}

public class SongRepository : BaseRepository<Song>
{
    public SongRepository(IFreeSql fsql) : base(fsql) {}

    //在这里增加 CURD 以外的方法
}
```

## 对比更新

只更新变化的属性：

```csharp
var repo = fsql.GetRepository<Topic>();
var item = repo.Where(a => a.Id == 1).First();  //此时快照 item
item.Title = "newtitle";
repo.Update(item); //对比快照时的变化
//UPDATE `tb_topic` SET `Title` = ?p_0
//WHERE (`Id` = 1)
```

是不是觉得先查询再更新，啰嗦？

```csharp
var repo = fsql.GetRepository<Topic>();
var item = new Topic { Id = 1 };
repo.Attach(item); //此时快照 item
item.Title = "newtitle";
repo.Update(item); //对比快照时的变化
//UPDATE `tb_topic` SET `Title` = ?p_0
//WHERE (`Id` = 1)
```

repo.CompareState(item) 可获取 item 的状态变化信息

```csharp
/// <summary>
/// 比较实体，计算出值发生变化的属性，以及属性变化的前后值
/// </summary>
/// <param name="newdata">最新的实体对象，它将与附加实体的状态对比</param>
/// <returns>key: 属性名, value: [旧值, 新值]</returns>
Dictionary<string, object[]> CompareState(TEntity newdata);
```

## 登陆信息（依赖注入）

repo.DbContextOptions.AuditValue 适合与 AddScoped（依赖注入） 信息结合，统一设置登陆信息。

如下示例：使用仓储插入/更新时自动使用登陆信息

```csharp
services.AddSingleton(fsql);
services.AddScoped(typeof(IBaseRepository<>), typeof(MyRepository<>));
services.AddScoped(typeof(IBaseRepository<,>), typeof(MyRepository<,>));
services.AddScoped(r => new MyRepositoryOptions
{
    AuditValue = e => {
        var user = r.GetService<User>();
        if (user == null) return;
        if (e.AuditValueType == AuditValueType.Insert &&
            e.Object is IEntityCreated obj1 && obj1 != null) {
            obj1.CreatedUserId = user.Id;
            obj1.CreatedUserName = user.Username;
        }
        if (e.AuditValueType == AuditValueType.Update &&
            e.Object is IEntityModified obj2 && obj2 != null) {
            obj2.ModifiedUserId = user.Id;
            obj2.ModifiedUserName = user.Username;
        }
    }
});

class MyRepository<TEntity, TKey> : BaseRepository<TEntity, TKey> where TEntity : class
{
    public MyRepository(IFreeSql fsql, MyRepositoryOptions options) : base(fsql)
    {
        if (options?.AuditValue != null) DbContextOptions.AuditValue += (_, e) => options.AuditValue(e);
    }
}
class MyRepository<TEntity> : MyRepository<TEntity, long> where TEntity : class
{
    public MyRepository(IFreeSql fsql, MyRepositoryOptions options) : base(fsql, options) { }
}
class MyRepositoryOptions
{
    public Action<DbContextAuditValueEventArgs> AuditValue { get; set; }
}
```

## 兼容问题

SqlServer 提供的 output inserted 特性，在表使用了自增或数据库定义了默认值的时候，使用它可以快速将 insert 的数据返回。PostgreSQL 也有相应的功能，如此方便但不是每个数据库都支持。

当采用了不支持该特性的数据库（Sqlite/MySql/Oracle/达梦/南大通用/MsAccess），并且实体使用了自增属性，仓储批量插入将变为逐条执行，可以考虑以下改进：

- 使用 uuid 作为主键（即 Guid）；
- 避免使用数据库的默认值功能；

## 联级保存

请移步文档 [《联级保存》](cascade-saving.md)

## API

| 属性             | 返回值                 | 说明                                           |
| ---------------- | ---------------------- | ---------------------------------------------- |
| EntityType       | Type                   | 仓储正在操作的实体类型，注意它不一定是 TEntity |
| UnitOfWork       | IUnitOfWork            | 正在使用的工作单元                             |
| Orm              | IFreeSql               | 正在使用的 Orm                                 |
| DbContextOptions | DbContextOptions       | 正在使用的 DbContext 设置，修改设置不影响其他  |
| UpdateDiy        | IUpdate\<TEntity\>     | 准备更新数据，与仓储同事务                     |
| Select           | ISelect\<TEntity\>     | 准备查询数据                                   |

| 方法                                                                                         | 返回值         | 参数                   | 说明                                                     |
| -------------------------------------------------------------------------------------------- | -------------- | ---------------------- | -------------------------------------------------------- |
| AsType                                                                                       | void           | Type                   | 改变仓储正在操作的实体类型                               |
| Get                                                                                          | TEntity        | TKey                   | 根据主键，查询数据                                       |
| Find                                                                                         | TEntity        | TKey                   | 根据主键，查询数据                                       |
| Delete                                                                                       | int            | TKey                   | 根据主键删除数据                                         |
| Delete                                                                                       | int            | Lambda                 | 根据 lambda 条件删除数据                                 |
| Delete                                                                                       | int            | TEntity                | 删除数据                                                 |
| Delete                                                                                       | int            | IEnumerable\<TEntity\> | 批量删除数据                                             |
| [DeleteCascadeByDatabase](cascade-delete.md#%E5%9F%BA%E4%BA%8E%E3%80%90%E6%95%B0%E6%8D%AE%E5%BA%93%E3%80%91%E7%BA%A7%E8%81%94%E5%88%A0%E9%99%A4)                     | List\<object\> | Lambda                 | 根据导航属性递归数据库删除数据                           |
| Insert                                                                                       | -              | TEntity                | 插入数据，若实体有自增列，插入后的自增值会填充到实体中   |
| Insert                                                                                       | -              | IEnumerable\<TEntity\> | 批量插入数据                                             |
| Update                                                                                       | -              | TEntity                | 更新数据                                                 |
| Update                                                                                       | -              | IEnumerable\<TEntity\> | 批量更新数据                                             |
| InsertOrUpdate                                                                               | -              | TEntity                | 插入或更新数据                                           |
| FlushState                                                                                   | -              | 无                     | 清除状态管理数据                                         |
| Attach                                                                                       | -              | TEntity                | 附加实体到状态管理，可用于不查询就更新或删除             |
| Attach                                                                                       | -              | IEnumerable\<TEntity\> | 批量附加实体到状态管理                                   |
| AttachOnlyPrimary                                                                            | -              | TEntity                | 只附加实体的主键数据到状态管理                           |
| [BeginEdit](insert-or-update.md#_4%E3%80%81%E8%A1%A8%E6%A0%BC%E7%BC%96%E8%BE%91-beginedit) | -              | List\<TEntity\>        | 准备编辑一个 List 实体                                   |
| EndEdit                                                                                      | int            | 无                     | 完成编辑数据，进行保存动作                               |

> 状态管理，可实现 Update 只更新变化的字段（不更新所有字段），灵活使用 Attach 和 Update 用起来非常舒服。
