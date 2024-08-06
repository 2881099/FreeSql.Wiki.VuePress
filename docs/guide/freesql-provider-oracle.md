---
title:  Oracle
---

FreeSql 对 Oracle 支持非常友好，是 c#.net ORM 不二之选，提供了 Ado.net/Odbc/Oledb 三种实现包，他们都支持 .NETCore2.1+、.NET4.0+ 等最新或较低的 .NETFramework 版本。

若想以 Ado.net 驱动访问数据库，请安装：

> dotnet add package FreeSql.Provider.Oracle

若想以 ODBC 驱动访问数据库，请安装：

> dotnet add package FreeSql.Provider.Odbc

若想以 Oledb 驱动访问数据库，请安装：

> dotnet add package FreeSql.Provider.OracleOledb

---

关于 Oracle US7ASCII 中文乱码的问题，Ado.Net 和 Odbc 无法解决。包括最新的.Net Core、.NET6、.NET7 都无法解决这个问题。

安装 FreeSql.Provider.OracleOledb 使用 Oledb 驱动解决读取使用 US7ASCII 的 Oracle 数据库中文显示乱码问题。

```csharp
public class DB
{
    static Lazy<IFreeSql> oracleLazy = new Lazy<IFreeSql>(() => new FreeSql.FreeSqlBuilder()
        .UseConnectionString(FreeSql.DataType.Oracle, "Provider=OraOLEDB.Oracle;user id=9user;password=123456;data source=//127.0.0.1:1521/XE;Pooling=true;Max Pool Size=2")
        .UseNameConvert(NameConvertType.ToUpper)
        .UseNoneCommandParameter(true)
        .UseMonitorCommand(cmd => Trace.WriteLine(cmd.CommandText))
        .Build());
    public static IFreeSql oracle => oracleLazy.Value;
}

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
class Topic
{
    public int Id { get; set; }
    [OracleUS7Ascii("gb2312")]
    public string Content { get; set; }
}
```

定义 DB.cs 类之后就可以快乐的 CRUD 了。FreeSql 提供多种 CRUD 使用习惯，请根据实际情况选择团队合适的一种：

- 要么 FreeSql，原始用法；
- 要么 FreeSql.DbContext，仓储+工作单元习惯；
- 要么 FreeSql.BaseEntity，充血模式；
- 要么 直接像 dapper 那样使用 OracleConnection 扩展方法；

## 主键名长度大于30

```csharp
[OraclePrimaryKeyName("TB_xxx_pk")] 
class Topic
{
    
}
```

## 增删改 BulkCopy

```csharp
fsql.Insert(items)
    .ExecuteOracleBulkCopy();

fsql.Update<T>.SetSource(items)
    .ExecuteOracleBulkCopy(); //临时表 + MERGE INTO

fsql.InsertOrUpdate<T>.SetSource(items)
    .ExecuteOracleBulkCopy(); //临时表 + MERGE INTO
```
