---
title: Firebird（嵌入式）
---

## 介绍

`Firebird` 是一个开源的关系型数据库管理系统，它支持嵌入式部署。`Firebird` 嵌入式数据库适用于需要在本地应用程序中直接集成数据库的场景，无需单独的数据库服务器。它提供了强大的事务处理、数据完整性和并发控制功能，同时保持轻量级和高效。适合小型到中型应用程序，特别是那些需要在不依赖外部数据库服务器的情况下进行本地数据存储和操作的情况。

`Firebird` 和 `Sqlite` 都是本地数据库，`Firebird` 支持并发读写，`Sqlite` 不支持并发写。

[Firebird | 官网 ](https://firebirdsql.org/en/documentation/)

## 安装包

FreeSql.Provider.Firebird

.NET CLI

```bash
dotnet add package FreeSql.Provider.Firebird
```

Package Manager

```bash
Install-Package FreeSql.Provider.Firebird
```

## 声明

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.Firebird, "database=localhost:D:\fbdata\EXAMPLES.fdb;user=sysdba;password=123456")
    .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
    .UseAutoSyncStructure(true) //自动创建表
    .Build();
```

## 嵌入式例子

[freesql_firebird_embed.zip](https://github.com/user-attachments/files/18747494/freesql_firebird_embed.zip)
