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

FreeSql.Provider.Duckdb

.NET CLI

```bash
dotnet add package FreeSql.Provider.Duckdb
```

Package Manager

```bash
Install-Package FreeSql.Provider.Duckdb
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

## 类型映射

| CSharp	| DuckDB | 说明 |
| - | - | - |
| bool/bool?  | BOOLEAN | logical boolean (true/false) |
| sbyte/sbyte?   | TINYINT | signed one-byte integer |
| short/short?  | SMALLINT | signed two-byte integer |
| int/int?  | INTEGER | signed four-byte integer |
| long/long?  | BIGINT | signed eight-byte integer |
| byte/byte?  | UTINYINT | |
| ushort/ushort?  | USMALLINT | |
| uint/uint?  | UINTEGER | |
| ulong/ulong?  | UBIGINT | |
| double/double?  | DOUBLE | double precision floating-point number (8 bytes) |
| float/float?  | FLOAT | single precision floating-point number (4 bytes) |
| decimal/decimal?  | DECIMAL(10,2) | fixed-precision number with the given width (precision) and scale |
| TimeSpan/TimeSpan?  | TIME | time of day (no time zone) |
| DateTime/DateTime?  | TIMESTAMP | combination of time and date |
| TimeOnly/TimeOnly?  | TIME |  |
| DateOnly/DateOnly?  | DATE |	calendar date (year, month day) |
| byte[]  | BLOB | variable-length binary data |
| string  | VARCHAR(255) | variable-length character string |
| char  | CHAR(1) | |
| Guid/Guid?  | UUID | UUID data type |
| BitArray  | BIT | string of 1s and 0s |
| BigInteger/BigInteger?  | HUGEINT | signed sixteen-byte integer |
| T[] | ARRAY | 如 int[]、string[]，不能是可空 int?[] |
| List\<T\> | LIST | 如 List\<int\>、List\<string\>，不能是可空 List\<int?\> |
| class + [JsonMap](type-mapping.md#json) | STRUCT | {'i': 42, 'j': 'a'} |
| Dictionary\<TKey, TValue\> | MAP | map([1, 2], ['a', 'b']) |

> 自定义映射，请移步[【类型映射】](type-mapping.md)文档。
