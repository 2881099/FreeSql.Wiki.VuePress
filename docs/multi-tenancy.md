---
layout: default
---

### 什么是多租户

维基百科：“软件多租户是指一种软件架构，在这种软件架构中，软件的一个实例运行在服务器上并且为多个租户服务”。一个租户是一组共享该软件实例特定权限的用户。有了多租户架构，软件应用被设计成为每个租户提供一个 专用的实例包括该实例的数据的共享，还可以共享配置，用户管理，租户自己的功能和非功能属性。多租户和多实例架构相比，多租户分离了代表不同的租户操作的多个实例。

多租户用于创建Saas（Software as-a service）应用（云处理）。

### 方案一：按租户字段区分

FreeSql.Repository 实现了 filter（过滤与验证）功能，如：

```csharp
var topicRepos = fsql.GetGuidRepository<Topic>(t => t.TerantId == 1);
```

使用 topicRepos 对象进行 CURD 方法：

* 在查询/修改/删除时附加此条件，从而达到不会修改 TerantId != 1 的数据；
* 在添加时，使用表达式验证数据的合法性，若不合法则抛出异常；

利用这个功能，我们可以很方便的实现数据分区，达到租户的目的。

### WhereCascade

多表查询时，像isdeleted每个表都给条件，挺麻烦的。WhereCascade使用后生成sql时，所有表都附上这个条件。多表租户条件也可以这样解决。

如：

```csharp
fsql.Select<t1>()
.LeftJoin<t2>(...)
.WhereCascade(x => x.IsDeleted == false)
.ToList();
```

得到的 SQL：

```sql
SELECT ...
FROM t1
LEFT JOIN t2 on ... AND (t2.IsDeleted = 0) 
WHERE t1.IsDeleted = 0
```

实体可附加表达式时才生效，支持子表查询。单次查询使用的表数目越多收益越大。

可应用范围：

- 子查询，一对多、多对多、自定义的子查询；
- Join 查询，导航属性、自定义的Join查询；
- Include/IncludeMany 的子集合查询；

> 暂时不支持【延时属性】的广播；

> 此功能和【过滤器】不同，用于单次多表查询条件的传播；

### 方案二：按租户分表

FreeSql.Repository 实现了 分表功能，如：

```csharp
var tenantId = 1;
var reposTopic = orm.GetGuidRepository<Topic>(null, oldname => $"{oldname}{tenantId}");
```

上面我们得到一个仓储按租户分表，使用它 CURD 最终会操作 Topic_1 表。

> 更多说明参考：[《FreeSql.Repository 仓储》](repository.md)

### 方案三：按租户分库

与方案二相同，只是表存储的位置不同，请查看 [《FreeSql.Repository 仓储》](repository.md)、[《分表分库》](sharding.md)。

### 多表查询

分表下的租户也支持多表查询，得益于 FreeSql 提供的优良基础。这部份仍然在 FreeSql.Repository 扩展库中实现的。

```csharp
var tenantId = 1;
//联表查询也支持
fsql.Select<Topic>()
    .AsTable((type, oldname) => $"{oldname}{tenantId}")
    .LeftJoin<TopicType>((a, b) => a.TypeId == b.Id)
    .ToList();
```

上述代码的使用，将两个设置好的租户仓储合并起来查询，查询租户1下的 topic + topictype 数据，执行的 SQL语句：

```sql
SELECT ...
FROM "Topic_1" a 
LEFT JOIN "TopicType_1" b ON a."TypeId" = b."Id"
```

### 实现全局控制租户

FreeSql.Repository Autofac 注入方式实现了全局【过滤与验证】的设定，方便租户功能的设计；

具体可参考：[《过滤器》](filters.md)
