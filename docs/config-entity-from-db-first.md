---
layout: default
---

可以解决，数据库有主键 + 自增，实体层没有配置对应的特性；

从数据库导入主键、自增信息，适用 DbFirst 模式，无须在实体类型上设置 [Column(IsPrimary)] 或者 ConfigEntity；

```csharp
fsql.CodeFirst.IsConfigEntityFromDbFirst = true;
```

此功能目前可用于 mysql/sqlserver/postgresql/oracle。

> 开启该功能会增加首次执行时间（耗时情况和表数量有关）

## 优先级

数据库特性 > 实体特性 > FluentApi（配置特性） > Aop（配置特性）
