---
title:  BaseEntity
---

## 前言

尝试过 ado.net、dapper、ef，以及Repository仓储，甚至自己还写过生成器工具，以便做常规CRUD操作。

它们日常操作不方便之处：

- 每次使用前需要声明，再操作；

- 很多人一个实体类，对应一个操作类（或DAL、DbContext、Repository）；

BaseEntity 是一种极简单的 CodeFirst 开发方式，特别对单表或多表CRUD，利用继承节省了每个实体类的重复属性（创建时间、ID等字段），软删除等功能，进行 crud 操作时不必时常考虑仓储的使用；

本文介绍 BaseEntity 一种极简约的 CRUD 操作方法。

## 功能特点

- 自动迁移实体结构（CodeFirst），到数据库；

- 直接操作实体的方法，进行 CRUD 操作；

- 简化用户定义实体类型，省去主键、常用字段的配置（如CreateTime、UpdateTime）；

- 实现单表、多表查询的软删除逻辑；

## 声明

```bash
dotnet add package FreeSql.Extensions.BaseEntity
dotnet add package FreeSql.Provider.Sqlite
```

```csharp
BaseEntity.Initialization(fsql, null);
```

1、定义一个主键 int 并且自增的实体类型，BaseEntity TKey 指定为 int/long 时，会认为主键是自增；

```csharp
public class UserGroup : BaseEntity<UserGroup, int>
{
    public string GroupName { get; set; }
}
```

如果不想主键是自增键，可以重写属性：

```csharp
public class UserGroup : BaseEntity<UserGroup, int>
{
    [Column(IsIdentity = false)]
    public override int Id { get; set; }
    public string GroupName { get; set; }
}
```

> 有关更多实体的特性配置，请参考资料：[实体特性](entity-attribute.md)

2、定义一个主键 Guid 的实体类型，保存数据时会自动产生有序不重复的 Guid 值（不用自己指定 Guid.NewGuid()）；

```csharp
public class User : BaseEntity<UserGroup, Guid>
{
    public string UserName { get; set; }
}
```

## CRUD 使用

```csharp
//添加
var item = new UserGroup { GroupName = "组一" };
item.Insert();

//更新
item.GroupName = "组二";
item.Update();

//添加或更新
item.Save();

//软删除
item.Delete();

//恢复软删除
item.Restore();

//根据主键获取对象
var item = UserGroup.Find(1);

//查询数据
var items = UserGroup.Where(a => a.Id > 10).ToList();
```

实体类型.Select 是一个查询对象，使用方法和 FreeSql.ISelect 一样；

支持多表查询时，软删除条件会附加在每个表中；

> 有关更多查询方法，请参考资料：[查询](select.md)

## 事务建议

1、同线程事务，不支持异步：

```csharp
fsql.Transaction(() =>
{
    //todo ...
})
```

2、如果你是异步控

由于 AsyncLocal 平台兼容不好，所以交给外部管理事务。

```csharp
static AsyncLocal<IUnitOfWork> _asyncUow = new AsyncLocal<IUnitOfWork>();

BaseEntity.Initialization(fsql, () => _asyncUow.Value);
```

在 Scoped 开始时：_asyncUow.Value = fsql.CreateUnitOfWork(); (也可以使用 UnitOfWorkManager 对象获取 uow)

在 Scoped 结束时：_asyncUow.Value = null;

如下：

```csharp
using (var uow = fsql.CreateUnitOfWork())
{
    _asyncUow.Value = uow;

    try
    {
        //todo ... BaseEntity 内部 curd 方法保持使用 uow 事务
    }
    finally
    {
        _asyncUow.Value = null;
    }
    
    uow.Commit();
}
```
