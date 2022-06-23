# 与 Dapper 比较

众所周知 Dapper 是 .NET 下最轻最快的 ORM，它是喜欢写 SQL 码农的福音，相对于 SqlHelper 它更加方便，据统计 10 个 .NETer 有 9 个 用过 Dapper。

这篇文章为准备使用 FreeSql 的朋友解惑，对比 Dapper 有何优势，为什么要使用 FreeSql？希望本文内容对大家有所帮助。

## 关于性能（输了）

Dapper + SQL 是大家一般所用的方式，性能对比主要体现在两个阶段：

1、执行前，表达式树解析，拼接 SQL 的消耗：

- Dapper 几乎没有消耗；
- FreeSql 会存在递归解析、对象拆箱等操作；

从项目工程可维护性角度看，这一点性能损失是能被容忍的，请看下面的测试结果。

2、执行后，返回数据转换为 List：

- Dapper 采用 Emit 构造委托并缓存，性能接近原生代码；
- FreeSql 采用 ExpressionTree 构造委托并缓存，为了映射类型更加易用使用了一点装箱操作，性能比 Dapper 略低；

BenchmarkDotNet=v0.12.1, OS=Windows 10.0.19044
Intel Core i7-8700K CPU 3.70GHz (Coffee Lake), 1 CPU, 12 logical and 6 physical cores
.NET Core SDK=6.0.100
  [Host]     : .NET Core 5.0.11 (CoreCLR 5.0.1121.47308, CoreFX 5.0.1121.47308), X64 RyuJIT DEBUG
  Job-LEQVAV : .NET Core 5.0.11 (CoreCLR 5.0.1121.47308, CoreFX 5.0.1121.47308), X64 RyuJIT DEBUG

BuildConfiguration=Debug  InvocationCount=1  UnrollFactor=1

|         Method | size |       Mean |    Error |    StdDev |     Median | Rank |
|--------------- |----- |-----------:|---------:|----------:|-----------:|-----:|
|  FreeSqlSelect |    1 |   271.6 us | 14.03 us |  41.16 us |   272.6 us |    2 |
| SqlSugarSelect |    1 |   323.5 us | 15.75 us |  45.18 us |   314.9 us |    3 |
|   EfCoreSelect |    1 |   392.8 us | 17.61 us |  49.39 us |   376.2 us |    4 |
|   DapperSelete |    1 |   215.9 us | 11.88 us |  33.52 us |   213.8 us |    1 |
|  FreeSqlSelect |  500 |   811.8 us | 18.86 us |  55.02 us |   798.5 us |    5 |
| SqlSugarSelect |  500 | 1,148.6 us | 53.94 us | 157.34 us | 1,116.3 us |    7 |
|   EfCoreSelect |  500 | 1,310.2 us | 89.90 us | 262.25 us | 1,219.3 us |    8 |
|   DapperSelete |  500 |   942.1 us | 18.46 us |  42.05 us |   931.1 us |    6 |

> 如上测试 Top1、Top500 单表查询水平结果

> 测试注意 IFreeSql 是单例模式设计，请勿重复创建，测试前请预热

测试结果是 us 级别的慢，能接受，因为数据库的上限并发瓶颈比较低（几万的水平），应用程序中的这一点消耗远不是问题。

最怕方法或设计错了导致的慢，那慢就是秒级以上的慢了，无力回天。

## 关于功能（赢了）

Dapper 几乎只有执行 SQL 的功能，市面上有一些基于 Dapper 做的轻量级 ORM，可以对实体对象进行 CRUD 操作，支持的数据库有限。

Dapper 在功能方面几乎完败于 FreeSql，例如：

- CodeFirst：Dapper 不支持；
- 类型映射：Dapper 在不同数据库之间的类型映射容易报错。比如实体类属性是 string，但是数据库类型是 int，非常容易报错，这不是杠，真实项目中有很多非等映射类型存在；
- 表达式树：Dapper 不支持导航属性、自定义解析、以及特别的解析；
- 导航属性：Dapper 不支持；
- 批量插入：Dapper 需要自己写 SQL 或者引入第三方包，FreeSql 自带集成；
- 批量更新：Dapper 需要自己写 SQL，FreeSql 自带集成；
- 工作单元：Dapper 需要引入第三方包，FreeSql 自带集成；
- 读写分离：？？
- 全局过滤：？？

等等。。。

FreeSql 赢在功能丰富，给使用者提供最大便利，你准备好入坑了吗？

## 如何接入（老项目）

如果你的项目正在使用 Dapper，请看以下成本最低的接入方法。

FreeSql 支持调用 SQL/存储过程，同时也为 IDbConnection/IDbTransaction 提供扩展方法 Select/Delete/Insert/Update/InsertOrUpdate。

第一步：以数据库 SqlServer 访问为例，只需要安装已经划分好的小包：

```bash
dotnet add packages FreeSql.Provider.SqlServer
```

or

```bash
Install-Package FreeSql.Provider.SqlServer
```

第二步：建立实体类

```csharp
class TestConnectionExt {
    public Guid id { get; set; }
    public string title { get; set; }
    public DateTime createTime { get; set; } = DateTime.Now;
}
```

第三步：开始 CRUD

```csharp
using (var conn = new SqlConnection(connectString)) {
    var list = conn.Select<TestConnectionExt>().Where(a => a.id == item.id).ToList();
}

using (var conn = new SqlConnection(connectString)) {
    var item = new TestConnectionExt { title = "testinsert" };
    var affrows = conn.Insert(item).ExecuteAffrows();
}

using (var conn = new SqlConnection(connectString)) {
    var affrows = conn.Update<TestConnectionExt>()
        .Where(a => a.Id == xxx)
        .Set(a => a.title, "testupdated")
        .ExecuteAffrows();
}

using (var conn = new SqlConnection(connectString)) {
    var affrows = conn.Delete<TestConnectionExt>()
        .Where(a => a.Id == xxx)
        .ExecuteAffrows();
}
```

添加或更新：

```csharp
using (var conn = new SqlConnection(connectString)) {
    var affrows = conn.InsertOrUpdate<TestConnectionExt>()
        .SetSource(item)
        .ExecuteAffrows();
}
```

如上添加、删除、修改、查询，已经支持实体类操作，并且支持批量插入、批量更新、批量删除、多表查询、导航属性查询。

可以享用 FreeSql 几乎所有功能。

思考：使用这种 API 貌似可以很轻松的接入到 abp vnext 中？

## 学习指南

FreeSql 是一款功能强大的对象关系映射（O/RM）组件，支持 .NET Core 2.1+、.NET Framework 4.0+ 以及 Xamarin。

- 🛠 支持 CodeFirst 模式，即便使用 Access 数据库也支持数据迁移；
- 💻 支持 DbFirst 模式，支持从数据库导入实体类，或使用实体类生成工具生成实体类；
- ⛳ 支持 深入的类型映射，比如 PgSql 的数组类型等；
- ✒ 支持 丰富的表达式函数，以及灵活的自定义解析；
- 🏁 支持 导航属性一对多、多对多贪婪加载，以及延时加载；
- 📃 支持 读写分离、分表分库、过滤器、乐观锁、悲观锁；
- 🌳 支持 MySql/SqlServer/PostgreSQL/Oracle/Sqlite/Firebird/达梦/人大金仓/神舟通用/南大通用/翰高/Access 等数据库；

#### 基础

- [《学习 FreeSql 之一：添加数据》](../guide/insert.md)
- [《学习 FreeSql 之二：删除数据》](../guide/delete.md)
- [《学习 FreeSql 之三：修改数据》](../guide/update.md)
- [《学习 FreeSql 之四：查询数据》](../guide/select.md)
- [《仓储层 Repository》](../guide/repository.md)

#### 进阶

- [《CodeFirst 模式开发介绍》](../guide/code-first.md)
  - [《CodeFirst 模式之一：实体特性》](../guide/entity-attribute.md)
  - [《CodeFirst 模式之二：FluentApi》](../guide/fluent-api.md)
  - [《CodeFirst 模式之三：自定义特性》](../guide/custom-attribute.md)
  - [《CodeFirst 模式之四：类型映射》](../guide/type-mapping.md)
  - [《CodeFirst 模式之五：迁移结构》](../guide/code-first.md#迁移结构)

* [《DbFirst 模式开发介绍》](../guide/db-first.md)

#### 高级

- [《数据库事务》](../guide/transaction.md)
- [《使用读写分离》](../guide/read-write-splitting.md)
- [《分表分库》](../guide/sharding.md)
- [《多租户》](../guide/multi-tenancy.md)
- [《返回数据》](../guide/select-return-data.md)
- [《优化之：延时加载》](../guide/select-lazy-loading.md)
- [《优化之：贪婪加载》](../guide/select-include.md)
- [《Expression 表达式函数》](../guide/expression-function.md)
- [《AOP》](../guide/aop.md)
