---
title:  MySql 系列数据库
---

<!-- # FreeSql.Provider.MySqlConnector -->

`FreeSql.Provider.MySqlConnector`是`FreeSql`基于社区提供的最新的[`MySqlConnector`](https://github.com/mysql-net/MySqlConnector)驱动的实现，兼容性、性能都比`FreeSql.Provider.MySql`好，且支持多种数据库，如：`MySQL, MariaDB, Percona, Amazon Aurora, Azure Database for MySQL, Google Cloud SQL for MySQL, OceanBase, Doris, Tidb`

并且支持BulkCopy，**推荐使用**

如果你使用 `FreeSql.Provider.MySql` 发生了以下错误，请**替换**到 FreeSql.Provider.MySqlConnector：

- The given key '0' was not present in the dictionary.
- The given key '25653' was not present in the dictionary.
- The given key '26995' was not present in the dictionary.
- The given key '28261 was not present in the dictionary.
- The given key '65535' was not present in the dictionary.
- The type initializer for 'MySql.Data.MySqlClient.Replication.ReplicationManager' threw an exception.
- Parameter '@xxx' must be defined.
- Object cannot be cast from DBNull to other types.

## MySql Enum 映射

默认情况 c# 枚举会映射为 MySql Enum 类型，如果想映射为 int 在 FreeSqlBuilder Build 之后执行以下 Aop 统一处理：

```cs
fsql.Aop.ConfigEntityProperty += (s, e) => {
    if (e.Property.PropertyType.IsEnum)
        e.ModifyResult.MapType = typeof(int);
};
```

## 增删改 BulkCopy

- 主键无值

```cs
public class Department
{
    [Column(IsPrimary = true, IsIdentity = true)]
    public long Id { get; set; }
    public string Name { get; set; }
}
List<Department> departments = new List<Department>()
{
    new Department() { Name ="部门1"},
    new Department() { Name ="部门2"},
    new Department() { Name ="部门3"}
};
fsql.Insert(departments)
    .InsertIdentity() //这行
    .ExecuteMySqlBulkCopy();
```

- Id主键有值时

```cs
List<Department> departments = new List<Department>()
{
    new Department() { Id=1, Name ="部门1"},
    new Department() { Id=2, Name ="部门2"},
    new Department() { Id=3, Name ="部门3"}
};
fsql.Insert(departments)
    .ExecuteMySqlBulkCopy();
```

```csharp
fsql.Update<T>.SetSource(items)
    .ExecuteSqlBulkCopy(); //临时表 + MERGE INTO

fsql.InsertOrUpdate<T>.SetSource(items)
    .ExecuteSqlBulkCopy(); //临时表 + MERGE INTO
```
