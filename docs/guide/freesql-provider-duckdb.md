---
title:  DuckDB（嵌入式 OLAP）
---

## 介绍

DuckDB 是一款进程内分析数据库，它可以在无需维护分布式多服务器系统的情况下处理出人意料的大型数据集。

DuckDB has two configurable options for concurrency:

- One process can both read and write to the database.
- Multiple processes can read from the database, but no processes can write (access_mode = 'READ_ONLY').

[DuckDB | 官网 ](https://duckdb.org/docs/)

## 安装包

FreeSql.Provider.DuckDB

.NET CLI

```bash
dotnet add package FreeSql.Provider.DuckDB
```

Package Manager

```bash
Install-Package FreeSql.Provider.DuckDB
```

## 声明

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.DuckDB, "DataSource = train_services.db")
    .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
    .UseAutoSyncStructure(true) //自动创建表
    .Build();
```

依赖的第三方 ado.net 驱动源代码：https://github.com/Giorgi/DuckDB.NET

| Connection String	| Description| 
| - | - |
| DataSource = :memory:	| Connect to a new in-memory database| 
| DataSource = :memory:?cache=shared | Connect to a shared, in-memory database| 
| DataSource = train_services.db	| Connect to train_services.db| 
| DataSource = train_services.db;ACCESS_MODE=READ_ONLY	| Connect to train_services.db, make connection read-only| 
| DataSource = :memory:;threads=8;ACCESS_MODE=READ_ONLY	| Connect to a new in-memory database, limit threads to 8, make connection read-only| 
| DataSource = train_services.db;ACCESS_MODE=READ_ONLY;memory_limit=10GB	| Connect to train_services.db, make connection read-only, limit RAM usage to 10GB| 