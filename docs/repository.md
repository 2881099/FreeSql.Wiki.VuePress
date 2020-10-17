---
layout: default
---

FreeSql.Repository 作为扩展，实现了通用仓储层功能。与其他规范标准一样，仓储层也有相应的规范定义。FreeSql.Repository 参考 abp vnext 接口，定义和实现基础的仓储层（CURD），应该算比较通用的方法吧。

## 特性

- Select/Attach 快照对象，Update 只更新变化的字段；
- Insert 插入数据，适配各数据库优化执行 ExecuteAffrows/ExecuteIdentity/ExecuteInserted；
- InsertOrUpdate 插入或更新；
- SaveMany 方法快速保存导航对象（一对多、多对多）；

## 安装

```bash
 dotnet add package FreeSql.Repository
```
## 定义

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.Sqlite, @"Data Source=|DataDirectory|\document.db;Pooling=true;Max Pool Size=10")
    .UseAutoSyncStructure(true) //自动迁移实体的结构到数据库
    .Build(); //请务必定义成 Singleton 单例模式

public class Song {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
}
```

## 使用方法

1、IFreeSql 的扩展方法；

```csharp
var curd = fsql.GetRepository<Song>();
```

> 注意：Repository对象多线程不安全

2、继承实现；

```csharp
public class SongRepository : BaseRepository<Song, int> {
    public SongRepository(IFreeSql fsql) : base(fsql, null, null) {}

    //在这里增加 CURD 以外的方法
}
```

3、依赖注入；

```csharp
public void ConfigureServices(IServiceCollection services) {
    
    services.AddSingleton<IFreeSql>(Fsql);
    services.AddFreeRepository(filter => filter
        .Apply<ISoftDelete>("SoftDelete", a => a.IsDeleted == false)
        .Apply<ITenant>("Tenant", a => a.TenantId == 1)
        ,
        this.GetType().Assembly
    );
}

//在控制器使用
public SongsController(IBaseRepository<Song> repos1) {
}
```

> 依赖注入的方式可实现全局【过滤与验证】的设定，方便租户功能的设计；

更多内容可参阅：[《过滤器》](filters.md)

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

## 过滤与验证

假设我们有User(用户)、Topic(主题)两个实体，在领域类中定义了两个仓储：

```csharp
var userRepository = fsql.GetGuidRepository<User>();
var topicRepository = fsql.GetGuidRepository<Topic>();
```

在开发过程中，总是担心 topicRepository 的数据安全问题，即有可能查询或操作到其他用户的主题。因此我们在v0.0.7版本进行了改进，增加了 filter lambda 表达式参数。

```csharp
var userRepository = fsql.GetGuidRepository<User>(a => a.Id == 1);
var topicRepository = fsql.GetGuidRepository<Topic>(a => a.UserId == 1);
```

* 在查询/修改/删除时附加此条件，从而达到不会修改其他用户的数据；
* 在添加时，使用表达式验证数据的合法性，若不合法则抛出异常；

## 分表与分库

FreeSql 提供 AsTable 分表的基础方法，GuidRepository 作为分存式仓储将实现了分表与分库（不支持跨服务器分库）的封装。

```csharp
var logRepository = fsql.GetGuidRepository<Log>(null, oldname => $"{oldname}_{DateTime.Now.ToString("YYYYMM")}");
```

上面我们得到一个日志仓储按年月分表，使用它 CURD 最终会操作 Log_201903 表。

注意事项：

* v0.11.12以后的版本可以使用 CodeFirst 迁移分表；
* 不可在分表分库的实体类型中使用《延时加载》；

## 兼容问题

SqlServer 提供的 output inserted 特性，在表使用了自增或数据库定义了默认值的时候，使用它可以快速将 insert 的数据返回。PostgreSQL 也有相应的功能，如此方便但不是每个数据库都支持。

当采用了不支持该特性的数据库（Sqlite/MySql/Oracle/达梦/MsAccess），并且实体使用了自增属性，仓储批量插入将变为逐条执行，可以考虑以下改进：

* 使用 uuid 作为主键（即 Guid）；
* 避免使用数据库的默认值功能；

## 联级保存

请移步文档 [《联级保存》](cascade-saving.md)

## API

| 属性 | 返回值 | 说明 |
| -- | -- | -- |
| EntityType | Type | 仓储正在操作的实体类型，注意它不一定是 TEntity |
| UnitOfWork | IUnitOfWork | 正在使用的工作单元 |
| Orm | IFreeSql | 正在使用的 Orm |
| DbContextOptions | DbContextOptions | 正在使用的 DbContext 设置，修改设置不影响其他 |
| DataFilter | IDataFilter\<TEntity\> | 仓储过滤器，本对象内生效 |
| Select | ISelect\<TEntity\> | 准备查询数据 |

| 方法 | 返回值 | 参数 | 说明 |
| -- | -- | -- | -- |
| AsType | void | Type | 改变仓储正在操作的实体类型 |
| Get | TEntity | TKey | 根据主键，查询数据 |
| Find | TEntity | TKey | 根据主键，查询数据 |
| Delete | int | TKey | 根据主键删除数据 |
| Delete | int | Lambda | 根据 lambda 条件删除数据 |
| Delete | int | TEntity | 删除数据 |
| Delete | int | IEnumerable\<TEntity\> | 批量删除数据 |
| Insert | - | TEntity | 插入数据，若实体有自增列，插入后的自增值会填充到实体中 |
| Insert | - | IEnumerable\<TEntity\> | 批量插入数据 |
| Update | - | TEntity | 更新数据 |
| Update | - | IEnumerable\<TEntity\> | 批量更新数据 |
| InsertOrUpdate | - | TEntity | 插入或更新数据 |
| FlushState | - | 无 | 清除状态管理数据 |
| Attach | - | TEntity | 附加实体到状态管理，可用于不查询就更新或删除 |
| Attach | - | IEnumerable\<TEntity\> | 批量附加实体到状态管理 |
| AttachOnlyPrimary | - | TEntity | 只附加实体的主键数据到状态管理 |
| SaveMany | - | TEntity, string | 保存实体的指定 ManyToMany/OneToMany 导航属性（完整对比） |
| BeginEdit | - | List\<TEntity\> | 准备编辑一个 List 实体 |
| EndEdit | int | 无 | 完成编辑数据，进行保存动作 |

> 状态管理，可实现 Update 只更新变化的字段（不更新所有字段），灵活使用 Attach 和 Update 用起来非常舒服。
