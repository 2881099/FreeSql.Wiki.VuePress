---
title: SqlServer
---

FreeSql 最多支持 SqlServer2000，根据不同的需求选择驱动包，微软提供了两个 SqlClient 访问包，因此我们也发布了两个，分别是：

- FreeSql.Provider.SqlServer
- FreeSql.Provider.SqlServerForSystem （强制使用 System.Data.SqlClient.dll，对 .NET Framework 更友好）

## WithLock/WithIndex

```csharp
var list = fsql.Select<Region>()
    .WithLock()
    .Limit(1).ToList();
//SELECT TOP 1 ... FROM [Region] a With(NoLock)

var list = fsql.Select<Region>()
    .WithLock(SqlServerLock.NoLock | SqlServerLock.NoWait)
    .Limit(1).ToList();
//SELECT TOP 1 ... FROM [Region] a With(NoLock, NoWait)

var list = fsql.Select<Region>()
    .WithLock()
    .WithIndex("idx_01")
    .Limit(1).ToList();
//SELECT TOP 1 ... FROM [Region] a With(index=idx_01, NoLock)
```

多表：

```csharp
var list = Select<Region, T2>()
    .InnerJoin((a, b) => a.x == b.xx)
    .WithLock(SqlServerLock.NoLock, new Dictionary<Type, bool>
    {
        [typeof(T2)] = false
    })
    .WithIndex("idx_01", new Dictionary<Type, string>
    {
        [typeof(T2)] = "idx_02"
    })
    .Limit(1).ToList();
//SELECT TOP 1 ..
//FROM [Region] a With(index=idx_01, NoLock)
//INNER JOIN [T2] b With(index=idx_02) ON a.[x] = b.[xx]
```

全局设置 NoLock：

```csharp
//所有实体类生效
fsql.SetGlobalSelectWithLock(SqlServerLock.NoLock, null);

//【指定】实体类生效
fsql.SetGlobalSelectWithLock(SqlServerLock.NoLock, new Dictionary<Type, bool>
{
    [typeof(Region)] = true,
    [typeof(T2)] = true
});
```

## 增删改 SqlBulkCopy

```csharp
fsql.Insert(items)
    .ExecuteSqlBulkCopy();

fsql.Update<T>.SetSource(items)
    .ExecuteSqlBulkCopy(); //临时表 + MERGE INTO

fsql.InsertOrUpdate<T>.SetSource(items)
    .ExecuteSqlBulkCopy(); //临时表 + MERGE INTO
```

## 访问 SqlServer2000

使用自定义适配更多的数据库，比如 mssql2000、db2，自定义适配将牺牲一些功能：

- 不支持 CodeFirst 自动迁移
- 不支持 DbFirst 接口方法的实现
- 不支持 原来的分页方法，需要自行判断 id 进行分页
- 只支持较少的基础类型：bool,sbyte,short,int,long,byte,ushort,uint,ulong,double,float,decimal,DateTime,byte[],string,Guid

使用者只需求重写类 FreeSql.Custom.CustomAdapter 就可以自定义访问不同的数据库。

默认做了一套 sqlserver 的语法和映射适配，代码在 [CustomAdapter.cs](https://github.com/2881099/FreeSql/blob/master/Providers/FreeSql.Provider.Custom/CustomAdapter.cs)，请查看代码了解。

```csharp
class Mssql2000Adapter : FreeSql.Custom.CustomAdapter
{
    public override string InsertAfterGetIdentitySql => "SELECT SCOPE_IDENTITY()";
    //可以重写更多的设置
}

public class DB
{
   static Lazy<IFreeSql> sqliteLazy = new Lazy<IFreeSql>(() =>
   {
        var fsql = new FreeSql.FreeSqlBuilder()
            .UseConnectionString(DataType.Custom, () => new OdbcConnection(...))
            .UseMonitorCommand(cmd => Trace.WriteLine($"Sql：{cmd.CommandText}"))
            .Build();
        fsql.SetCustomAdapter(new Mssql2000Adapter());
        return fsql;
    });
    public static IFreeSql Sqlite => sqliteLazy.Value;
}
```

适配好新的 CustomAdapter 后，请在 FreeSqlBuilder.Build 之后调用 IFreeSql.SetCustomAdapter 方法生效。

使用 ODBC 访问古董数据库。
