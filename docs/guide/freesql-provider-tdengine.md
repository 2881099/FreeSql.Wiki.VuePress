---
title: TDengine
---

## 介绍

TDengine 是一款开源、高性能、云原生的时序数据库, 它专为物联网、车联网、工业互联网、金融、IT 运维等场景优化设计

[TDengine 文档 | TDengine 文档 | 涛思数据](https://docs.taosdata.com/)

## 安装包

FreeSql.Provider.TDengine

.NET CLI

```bash
dotnet add package FreeSql.Provider.TDengine
```

Package Manager

```bash
Install-Package FreeSql.Provider.TDengine
```

## 安装客户端驱动

如果选择原生连接，而且应用程序不在 TDengine 同一台服务器上运行，你需要先安装客户端驱动，否则可以跳过此一步。为避免客户端驱动和服务端不兼容，请使用一致的版本。

[安装客户端驱动 taosc](https://docs.taosdata.com/connector/#安装客户端驱动)

## 声明

> 建议尽量使用无参数化

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.TDengine,
        "host=localhost;port=6030;username=root;password=taosdata;protocol=Native;db=test;")
    .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}\r\n"))
    .UseNoneCommandParameter(true) //无参数化
    .Build();
```

## 特有功能

### 超级表

采用“一个数据采集点一张表”的设计虽然有助于针对性地管理每个采集点，但随着设备数量不断增加表的数量也会急剧增加，这给数据库管理和数据分析带来了挑战。在进行跨数据采集点的聚合操作时，用户需要面对大量的表，工作变得异常繁重。

为了解决这个问题，TDengine 引入超级表（Super Table，简称为 STable）的概念。超级表是一种数据结构，它能够将某一特定类型的数据采集点聚集在一起，形成一张逻辑上的统一表。这些数据采集点具有相同的表结构，但各自的静态属性（如标签）可能不同。创建超级表时，除了定义采集量以外，还需定义超级表的标签。一张超级表至少包含一个时间戳列、一个或多个采集量列以及一个或多个标签列。此外，超级表的标签可以灵活地进行增加、修改或删除操作。

在 TDengine 中，表代表具体的数据采集点，而超级表则代表一组具有相同属性的数据采集点集合。以智能电表为例，我们可以为该类型的电表创建一张超级表，其中包含了所有智能电表的共有属性和采集量。这种设计不仅简化了表的管理，还便于进行跨数据采集点的聚合操作，从而提高数据处理的效率。

### 子表

子表是数据采集点在逻辑上的一种抽象表示，它是隶属于某张超级表的具体表。用户可以将超级表的定义作为模板，并通过指定子表的标签值来创建子表。这样，通过超级表生成的表便被称为子表。超级表与子表之间的关系主要体现在以下几个方面。

- 一张超级表包含多张子表，这些子表具有相同的表结构，但标签值各异。
- 子表的表结构不能直接修改，但可以修改超级表的列和标签，且修改对所有子表立即生效。
- 超级表定义了一个模板，自身并不存储任何数据或标签信息。

在 TDengine 中，查询操作既可以在子表上进行，也可以在超级表上进行。针对超级表的查询，TDengine 将所有子表中的数据视为一个整体，首先通过标签筛选出满足查询条件的表，然后在这些子表上分别查询时序数据，最终将各张子表的查询结果合并。本质上，TDengine 通过对超级表查询的支持，实现了多个同类数据采集点的高效聚合。为了更好地理解采集量、标签、超级表与子表之间的关系，这里以智能电表的数据模型为例进行说明。可以参考图 3-1 的数据模型，以便更直观地了解这些概念。

为了更好地理解采集量、标签、超级与子表的关系，以智能电表为例，可以参考下图

![数据模型示意图](https://docs.taosdata.com/assets/images/data-model-b937dfef72001fd8842294bf8fb10cd0.png)

### 例子

```csharp
   [TDengineSuperTable(Name = "meters")]
   class Meters
   {
       [Column(Name = "ts")]
       public DateTime Ts { get; set; }

       [Column(Name = "current")]
       public float Current { get; set; }

       [Column(Name = "voltage")]
       public int Voltage { get; set; }

       [Column(Name = "describe", StringLength = 50)]
       public string? Describe { get; set; }

       [TDengineTag(Name = "location")]
       public virtual string? Location { get; set; }

       [TDengineTag(Name = "group_id")]
       public virtual int GroupId { get; set; }
   }

   [TDengineSubTable(SuperTableName = "meters", Name = "d1001")]
   class D1001 : Meters
   {
       [TDengineTag(Name = "location")]
       public override string Location { get; set; } = "BeiJIng.ChaoYang";

       [TDengineTag(Name = "group_id")]
       public override int GroupId { get; set; } = 1;
   }


   [TDengineSubTable(SuperTableName = "meters", Name = "d1002")]
   class D1002 : Meters
   {
       [TDengineTag(Name = "location")]
       public new string Location { get; set; } = "California.SanFrancisco";

       [TDengineTag(Name = "group_id")]
       public new int GroupId { get; set; } = 2;
   }
```

> CodeFirst创建表

```csharp
//尽量确定表结构
//同步子表会自动创建超表
fsql.CodeFirst.SyncStructure<D1001>();
fsql.CodeFirst.SyncStructure<D1002>();
```

> 插入数据

```csharp
//向子表插入数据
var affrows = fsql.Insert(new D1002()
{
    Ts = DateTime.Now,
    Current = 1,
    Voltage = 1,
    Describe = "D10021"
}).ExecuteAffrows();

//批量向子表插入数据，注意 一定要关闭参数化
var batchRes = fsql.Insert(new List<D1002>()
{
    new D1002()
    {
        Ts = DateTime.Now,
        Current = 6,
        Voltage = 6,
        Describe = "D10026"
    },
    new D1002()
    {
        Ts = DateTime.Now,
        Current = 3,
        Voltage = 3,
        Describe = "D10023"
    },
    new D1002()
    {
        Ts = DateTime.Now,
        Current = 4,
        Voltage = 4,
        Describe = "D10024"
    }
}).ExecuteAffrows();
```

> 查询

```csharp
//查询子表
var list = fsql.Select<D1001>().ToList();
//查询超表
var metersList = fsql.Select<Meters>().Where(d => d.GroupId == 2).ToList();
```

> 删除

```csharp
var startTime = DateTime.Parse("2024-11-30T02:33:52.308+00:00");
var endTime = DateTime.Parse("2024-11-30T02:40:58.961+00:00");
//必须包含时间戳
var executeAffrows = fsql.Delete<Meters>().Where(meters => meters.Ts >= startTime && meters.Ts <= endTime && meters.GroupId == 1).ExecuteAffrows();
```
