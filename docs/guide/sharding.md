# 分表分库
## 理论知识

分表 - 从表面意思上看呢，就是把一张表分成N多个小表，每一个小表都是完正的一张表。分表后数据都是存放在分表里，总表只是一个外壳，存取数据发生在一个一个的分表里面。分表后单表的并发能力提高了，磁盘I/O性能也提高了。并发能力为什么提高了呢，因为查寻一次所花的时间变短了，如果出现高并发的话，总表可以根据不同 的查询，将并发压力分到不同的小表里面。

分库 - 把原本存储于一个库的数据分块存储到多个库上，把原本存储于一个表的数据分块存储到多个表上。数据库中的数据量不一定是可控的，在未进行分表分库的情况下，随着时间和业务的发展，库中的表会越来越多，表中的数据量也会越来越大，相应地，数据操作，增删改查的开销也会越来越大；另外，一台服务器的资源（CPU、磁盘、内存、IO等）是有限的，最终数据库所能承载的数据量、数据处理能力都将遭遇瓶颈。

## 分表 AsTable

FreeSql 原生用法、FreeSql.Repository 仓储用法 都提供了 AsTable 方法对分表进行 CRUD 操作，例如：

```c#
var repo = fsql.GetRepository<Log>();
repo.AsTable(oldname => $"{oldname}_201903"); //对 Log_201903 表 CRUD

repo.Insert(new Log { ... });
```

跨库，但是在同一个数据库服务器下，也可以使用 AsTable(oldname => $"db2.dbo.{oldname}")

```csharp
//跨表查询
var sql = fsql.Select<User>()
    .AsTable((type, oldname) => "table_1")
    .AsTable((type, oldname) => "table_2")
    .ToSql(a => a.Id);

//select * from (SELECT a."Id" as1 FROM "table_1" a) ftb 
//UNION ALL
//select * from (SELECT a."Id" as1 FROM "table_2" a) ftb 
```

分表总结：

- 分表、相同服务器跨库 可以使用 AsTable 进行 CRUD；
- AsTable CodeFirst 会自动创建不存在的分表；
- 不可在分表分库的实体类型中使用《延时加载》；

SqlServer 跨库事务 可以使用 TransactionScope，如下：

```csharp
var repoLog = fsql.GetRepository<Log>();
var repoComment = fsql.GetRepository<Comment>();
repoLog.AsTable(oldname => $"{201903}.dbo.{oldname}");
repoComment.AsTable(oldname => $"{201903}.dbo.{oldname}");

using (TransactionScope ts = new TransactionScope())
{
    repoComment.Insert(new Comment { ... });
    repoLog.Insert(new Log { ... });
    ts.Complete();
}
```

分布式数据库 TCC/SAGA 方案请移步：https://github.com/2881099/FreeSql.Cloud

> v3.2.500 自动分表方案：https://github.com/dotnetcore/FreeSql/discussions/1066

---

## 【分库】利用 IdleBus 重写 IFreeSql

在 asp.net core 利用 IdleBus 重写 IFreeSql 支持多库操作

```xml
<ItemGroup>
  <PackageReference Include="FreeSql" Version="3.2.500" />
  <PackageReference Include="IdleBus" Version="1.5.2" />
</ItemGroup>
```

1、定义和注入

```c#
var fsql = new MultiFreeSql();
fsql.Register("db1", () => new FreeSqlBuilder().UseConnectionString(DataType.MySql, "str1").Build());
fsql.Register("db2", () => new FreeSqlBuilder().UseConnectionString(DataType.MySql, "str2").Build());
fsql.Register("db3", () => new FreeSqlBuilder().UseConnectionString(DataType.SqlServer, "str3").Build());

services.AddSingleton<IFreeSql>(fsql);
```

2、如何使用

> 额外增加 Register/Change 两个方法，其他跟 IFreeSql 用法几乎一样

```c#
var db1_list = fsql.Select<T>().ToList();

//切换 db2 数据库，一旦切换之后 fsql 操作都是针对 db2
fsql.Change("db2");
var db2_list = fsql.Select<T>().ToList();

//这样也行
var db2_list = fsql.Change("db2").Select<T>().ToList();
```

> 如果需要分布多事务 TCC/Saga 请移步到：https://github.com/2881099/FreeSql.Cloud

3、MultiFreeSql.cs 代码定义

```c#
using FreeSql;
using FreeSql.Internal;
using FreeSql.Internal.CommonProvider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace net50_webapi_idlebus
{
    public class MultiFreeSql : MultiFreeSql<string> { }

    public partial class MultiFreeSql<TDBKey> : BaseDbProvider, IFreeSql
    {
        internal TDBKey _dbkeyMaster;
        internal AsyncLocal<TDBKey> _dbkeyCurrent = new AsyncLocal<TDBKey>();
        BaseDbProvider _ormMaster => _ib.Get(_dbkeyMaster) as BaseDbProvider;
        BaseDbProvider _ormCurrent => _ib.Get(object.Equals(_dbkeyCurrent.Value, default(TDBKey)) ? _dbkeyMaster : _dbkeyCurrent.Value) as BaseDbProvider;
        internal IdleBus<TDBKey, IFreeSql> _ib;

        public MultiFreeSql()
        {
            _ib = new IdleBus<TDBKey, IFreeSql>();
            _ib.Notice += (_, __) => { };
        }

        public override IAdo Ado => _ormCurrent.Ado;
        public override IAop Aop => _ormCurrent.Aop;
        public override ICodeFirst CodeFirst => _ormCurrent.CodeFirst;
        public override IDbFirst DbFirst => _ormCurrent.DbFirst;
        public override GlobalFilter GlobalFilter => _ormCurrent.GlobalFilter;
        public override void Dispose() => _ib.Dispose();

        public override CommonExpression InternalCommonExpression => _ormCurrent.InternalCommonExpression;
        public override CommonUtils InternalCommonUtils => _ormCurrent.InternalCommonUtils;

        public override ISelect<T1> CreateSelectProvider<T1>(object dywhere) => _ormCurrent.CreateSelectProvider<T1>(dywhere);
        public override IDelete<T1> CreateDeleteProvider<T1>(object dywhere) => _ormCurrent.CreateDeleteProvider<T1>(dywhere);
        public override IUpdate<T1> CreateUpdateProvider<T1>(object dywhere) => _ormCurrent.CreateUpdateProvider<T1>(dywhere);
        public override IInsert<T1> CreateInsertProvider<T1>() => _ormCurrent.CreateInsertProvider<T1>();
        public override IInsertOrUpdate<T1> CreateInsertOrUpdateProvider<T1>() => _ormCurrent.CreateInsertOrUpdateProvider<T1>();
    }

    public static class MultiFreeSqlExtensions
    {
        public static IFreeSql Change<TDBKey>(this IFreeSql fsql, TDBKey dbkey)
        {
            var multiFsql = fsql as MultiFreeSql<TDBKey>;
            if (multiFsql == null) throw new Exception("fsql 类型不是 MultiFreeSql<TDBKey>");
            multiFsql._dbkeyCurrent.Value = dbkey;
            return multiFsql;
        }

        public static IFreeSql Register<TDBKey>(this IFreeSql fsql, TDBKey dbkey, Func<IFreeSql> create)
        {
            var multiFsql = fsql as MultiFreeSql<TDBKey>;
            if (multiFsql == null) throw new Exception("fsql 类型不是 MultiFreeSql<TDBKey>");
            if (multiFsql._ib.TryRegister(dbkey, create))
                if (multiFsql._ib.GetKeys().Length == 1)
                    multiFsql._dbkeyMaster = dbkey;
            return multiFsql;
        }
    }
}
```

分库总结：

- 跨库 事务不好处理，注意了；
- 跨库 查询不好处理，注意了；