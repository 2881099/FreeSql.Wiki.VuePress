---
title: ClickHouse
---

## 介绍

`ClickHouse` 是一个高性能的开源列式数据库，专为实时大数据分析设计。它以列存储数据，支持快速查询和聚合操作，适合处理大规模数据集。`ClickHouse` 具备分布式架构、数据压缩和高可用性特性，使其在处理复杂查询和实时数据分析时表现出色。

[ClickHouse | 官网 ](https://clickhouse.com/docs/en/)

## 安装包

FreeSql.Provider.ClickHouse

.NET CLI

```bash
dotnet add package FreeSql.Provider.ClickHouse
```

Package Manager

```bash
Install-Package FreeSql.Provider.ClickHouse
```

## 声明

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.ClickHouse,
        "DataCompress=False;BufferSize=32768;SocketTimeout=10000;CheckCompressedHash=False;Encrypt=False;Compressor=lz4;" +
        "Host=192.168.0.121;Port=8125;Database=PersonnelLocation;Username=root;Password=123")
    .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
    .Build();
```
