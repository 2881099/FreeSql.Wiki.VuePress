﻿# 前言

尝试过 ado.net、dapper、ef，以及 Repository 仓储，甚至自己还写过生成器工具，以便做常规 CRUD 操作。

它们日常操作不方便之处：

- 每次使用前需要声明，再操作；

- 很多人一个实体类，对应一个操作类（或 DAL、DbContext、Repository）；

本文介绍 BaseEntity 一种极简约的 CRUD 操作方法。

## 功能特点

- 自动迁移实体结构（CodeFirst），到数据库；

- 直接操作实体的方法，进行 CRUD 操作；

- 简化用户定义实体类型，省去主键、常用字段的配置（如 CreateTime、UpdateTime）；

- 实现单表、多表查询的软删除逻辑；

## 声明

参考 BaseEntity.cs 源码（约 100 行），copy 到项目中使用，然后添加 nuget 引用包：

> dotnet add package FreeSql.DbContext

> dotnet add package FreeSql.Provider.Sqlite

1、定义一个主键 int 并且自增的实体类型，BaseEntity TKey 指定为 int/long 时，会认为主键是自增；

```csharp
public class UserGroup : BaseEntity<UserGroup, int> {
    public string GroupName { get; set; }
}
```

如果不想主键是自增键，可以重写属性：

```csharp
public class UserGroup : BaseEntity<UserGroup, int> {
    [Column(IsIdentity = false)]
    public override int Id { get; set; }
    public string GroupName { get; set; }
}
```

> 有关更多实体的特性配置，可参阅 [实体属性](entity-attribute.md)

2、定义一个主键 Guid 的实体类型，保存数据时会自动产生有序不重复的 Guid 值（不用自己指定 Guid.NewGuid()）；

```csharp
public class User : BaseEntity<UserGroup, Guid> {
    public string UserName { get; set; }
}
```

3、定义多主键的实体类型，可以在 static 构造函数中重写字段名；

```csharp
public class User2 : BaseEntity<User2, Guid, int> {
    static User2()
    {
        User2.Orm.CodeFirst.ConfigEntity<User2>(t =>
        {
            t.Property(a => a.PkId1).Name("UserId");
            t.Property(a => a.PkId2).Name("Index");
        });
    }

    public string Username { get; set; }
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

> 有关更多查询方法，可参阅 [查询](select.md)

示范项目：[https://github.com/dotnetcore/FreeSql/tree/master/Examples/base_entity](https://github.com/dotnetcore/FreeSql/tree/master/Examples/base_entity)
