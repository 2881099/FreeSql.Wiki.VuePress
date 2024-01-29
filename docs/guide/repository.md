---
title : 仓储
tag:
  - Repository
---

`FreeSql.Repository` 实现了通用仓储层功能。FreeSql.Repository 参考 abp vnext 接口规范，实现仓储层（CURD）。

## 特性

- Select/Attach 快照对象，Update 只更新变化的字段；
- Insert 插入数据，适配各数据库优化执行 ExecuteAffrows/ExecuteIdentity/ExecuteInserted；
- InsertOrUpdate 插入或更新；
- SaveMany 方法快速保存导航对象（一对多、多对多）；

## 安装

::: code-tabs

@tab:active .NET CLI

```bash
 dotnet add package FreeSql.Repository
```

@tab .NET Framework

```bash
Install-Package FreeSql.Repository
```

:::

## 定义

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.Sqlite, connectionString)
    .UseAutoSyncStructure(true) //自动迁移实体的结构到数据库
    .Build(); //请务必定义成 Singleton 单例模式

public class Song
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
}
```

## 使用方法

方法 1、IFreeSql 的扩展方法；

```csharp
var curd = fsql.GetRepository<Song>();
```

> 注意：Repository 对象多线程不安全,因此不应在多个线程上同时对其执行工作。

- 不支持从不同的线程同时使用同一仓储实例

方法 2、继承实现；

```csharp
public class SongRepository : BaseRepository<Song, int>
{
    public SongRepository(IFreeSql fsql) : base(fsql, null, null) {}

    //在这里增加 CURD 以外的方法
}
```

方法 3、依赖注入；

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IFreeSql>(fsql);
    services.AddFreeRepository(null, typeof(你继承后的任一仓储类型).Assembly); //如果没有继承的仓储，第二个参数不用传
}

//在控制器使用
public SongsController(IBaseRepository<Song> songRepository)
{
}
```

> 依赖注入的方式可实现全局【过滤与验证】的设定，方便租户功能的设计；

更多资料：[《过滤器、全局过滤器》](filters.md)

## 状态管理

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

## Ioc + 登陆信息

repo.DbContextOptions.AuditValue 适合与 Ioc AddScoped 信息结合。

如下示例：使用仓储插入/更新时自动使用登陆信息

```csharp
services.AddSingleton(fsql);
services.AddScoped(r => 
{
    var user = r.GetService<User>();
    var options = new RepositoryOptions();
    options.AuditValue += (_, e) =>
    {
        if (user == null) return;

        if (e.AuditValueType == AuditValueType.Insert &&
            e.Object is IEntityCreated obj1 && obj1 != null)
        {
            obj1.CreatedUserId = user.Id;
            obj1.CreatedUserName = user.Username;
        }
        if (e.AuditValueType == AuditValueType.Update &&
            e.Object is IEntityModified obj2 && obj2 != null)
        {
            obj2.ModifiedUserId = user.Id;
            obj2.ModifiedUserName = user.Username;
        }
    };
    return options;
});
services.AddScoped(typeof(IBaseRepository<>), typeof(MyRepository<>));
services.AddScoped(typeof(IBaseRepository<,>), typeof(MyRepository<,>));

//以下实现 MyRepository
class MyRepository<TEntity, TKey> : BaseRepository<TEntity, TKey> where TEntity : class
{
    public MyRepository(IFreeSql fsql, RepositoryOptions options) : base(fsql, null, null)
    {
        uowManager?.Binding(this);
        if (options != null)
        {
            DbContextOptions.NoneParameter = options.NoneParameter;
            DbContextOptions.EnableGlobalFilter = options.EnableGlobalFilter;
            DbContextOptions.AuditValue += options.AuditValueHandler;
        }
    }
}
class MyRepository<TEntity> : MyRepository<TEntity, long> where TEntity : class
{
    public MyRepository(IFreeSql fsql, RepositoryOptions options) : base(fsql, options) { }
}
```

## 过滤与验证

假设我们有 User(用户)、Topic(主题)两个实体，定义了两个仓储：

```csharp
var userRepository = fsql.GetRepository<User>();
var topicRepository = fsql.GetRepository<Topic>();
```

在开发过程中，总是担心 topicRepository 的数据安全问题，即有可能查询或操作到其他用户的主题。因此我们在 v0.0.7 版本增加了 filter lambda 表达式参数。

```csharp
var userRepository = fsql.GetRepository<User>(a => a.Id == 1);
var topicRepository = fsql.GetRepository<Topic>(a => a.UserId == 1);
```

- 在查询/修改/删除时附加此条件，从而达到不会修改其他用户的数据；
- 在添加时，使用表达式验证数据的合法性，若不合法则抛出异常；

## 分表与分库

FreeSql 提供 AsTable 分表的基础方法，GuidRepository 作为分存式仓储将实现了分表与分库（不支持跨服务器分库）的封装。

```csharp
var logRepository = fsql.GetGuidRepository<Log>(null, oldname => $"{oldname}_{DateTime.Now.ToString("YYYYMM")}");
```

上面我们得到一个日志仓储按年月分表，使用它 CURD 最终会操作 Log_201903 表。

注意事项：

- v0.11.12 以后的版本可以使用 CodeFirst 迁移分表；
- 不可在分表分库的实体类型中使用《延时加载》；

更多请移步[《分表分库》](sharding.md)

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
| DataFilter       | IDataFilter\<TEntity\> | 仓储过滤器，本对象内生效                       |
| UpdateDiy           | IUpdate\<TEntity\>     | 准备更新数据，与仓储同事务                    |
| Select           | ISelect\<TEntity\>     | 准备查询数据                                   |

| 方法                                                                                                       | 返回值         | 参数                   | 说明                                                     |
| ---------------------------------------------------------------------------------------------------------- | -------------- | ---------------------- | -------------------------------------------------------- |
| AsType                                                                                                     | void           | Type                   | 改变仓储正在操作的实体类型                               |
| Get                                                                                                        | TEntity        | TKey                   | 根据主键，查询数据                                       |
| Find                                                                                                       | TEntity        | TKey                   | 根据主键，查询数据                                       |
| Delete                                                                                                     | int            | TKey                   | 根据主键删除数据                                         |
| Delete                                                                                                     | int            | Lambda                 | 根据 lambda 条件删除数据                                 |
| Delete                                                                                                     | int            | TEntity                | 删除数据                                                 |
| Delete                                                                                                     | int            | IEnumerable\<TEntity\> | 批量删除数据                                             |
| [DeleteCascadeByDatabase](https://freesql.net/guide/cascade-delete.html)                                                                                    | List\<object\> | Lambda                 | 根据导航属性递归数据库删除数据                           |
| Insert                                                                                                     | -              | TEntity                | 插入数据，若实体有自增列，插入后的自增值会填充到实体中   |
| Insert                                                                                                     | -              | IEnumerable\<TEntity\> | 批量插入数据                                             |
| Update                                                                                                     | -              | TEntity                | 更新数据                                                 |
| Update                                                                                                     | -              | IEnumerable\<TEntity\> | 批量更新数据                                             |
| InsertOrUpdate                                                                                             | -              | TEntity                | 插入或更新数据                                           |
| FlushState                                                                                                 | -              | 无                     | 清除状态管理数据                                         |
| Attach                                                                                                     | -              | TEntity                | 附加实体到状态管理，可用于不查询就更新或删除             |
| Attach                                                                                                     | -              | IEnumerable\<TEntity\> | 批量附加实体到状态管理                                   |
| AttachOnlyPrimary                                                                                          | -              | TEntity                | 只附加实体的主键数据到状态管理                           |
| [SaveMany](cascade-saving.html)                                                  | -              | TEntity, string        | 保存实体的指定 ManyToMany/OneToMany 导航属性（完整对比） |
| [BeginEdit](insert-or-update.html#_4%E3%80%81beginedit-%E6%89%B9%E9%87%8F%E7%BC%96%E8%BE%91) | -              | List\<TEntity\>        | 准备编辑一个 List 实体                                   |
| EndEdit                                                                                                    | int            | 无                     | 完成编辑数据，进行保存动作                               |

> 状态管理，可实现 Update 只更新变化的字段（不更新所有字段），灵活使用 Attach 和 Update 用起来非常舒服。
