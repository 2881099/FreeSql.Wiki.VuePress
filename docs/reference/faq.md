# 常见问题

### 1、如何监视 SQL？

方法一：UseMonitorCommand + UseNoneCommandParameter

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
  .UseConnectionString(FreeSql.DataType.MySql, "...")
  .UseMonitorCommand(cmd => Console.WriteLine($"线程：{cmd.CommandText}\r\n"))
  .UseNoneCommandParameter(true)
  .Build();
```

方法二：Aop.CurdBefore/CurdAfter

```csharp
fsql.Aop.CurdAfter += (s, e) =>
{
  if (e.ElapsedMilliseconds > 200)
    Console.WriteLine($"线程：{e.Sql}\r\n");
};
```

---

### 2、MySql Enum 映射

默认情况 c# 枚举会映射为 MySql Enum 类型，如果想映射为 int 在 FreeSqlBuilder Build 之后执行以下 Aop 统一处理：

```csharp
fsql.Aop.ConfigEntityProperty += (s, e) => {
  if (e.Property.PropertyType.IsEnum)
    e.ModifyResult.MapType = typeof(int);
};
```

---

### 3、多个 IFreeSql 实例，如何注入使用？

[https://github.com/dotnetcore/FreeSql/issues/44](https://github.com/dotnetcore/FreeSql/issues/44)

---

### 4、怎么执行 SQL 返回实体列表？

```csharp
//直接查询
fsql.Ado.Query<T>(sql);

//嵌套一层做二次查询
fsql.Select<T>().WithSql(sql).Page(1, 10).ToList();
```

---

### 5、错误：【主库】状态不可用，等待后台检查程序恢复方可使用。xxx

一般是数据库连接失败，才会出现，请检查程序与数据库之间的网络。具体按 xxx 给出的提示进行排查。

---

### 6、错误：【主库】对象池已释放，无法访问。

原因一：手工调用了 fsql.Dispose，之后仍然使用它

原因二：使用了 IdleBus 管理 IFreeSql，错误的方式如下：

- a) 不要构建了 IFreeSql 再丢去注册

```csharp
var fsql = new FreeSqlBulder()...Build();
ib.Register("key01", () => fsql); //错了，错了，错了

ib.Register("key01", () => new FreeSqlBulder()...Build()); //正确
```

- b) 尽量每次都使用 ib.Get 获得 IFreeSql 对象(避免存对象引用)，IdleBus 内部超时释机制一时触发，再使用引用对象，就会报这个报错

原因三：检查项目的系统事件，是否在异常之前触发

```csharp
AppDomain.CurrentDomain.ProcessExit += (s1, e1) =>
{
  //记录日志
};
Console.CancelKeyPress += (s1, e1) =>
{
  //记录日志
};
```

如果确定问题，可以在 FreeSqlBuilder 构建对象的时候 UseExitAutoDisposePool(false) 关闭这个机制

---

### 7、错误：ObjectPool.Get 获取超时（10 秒）。

原因一：UnitOfWork 使用未释放，请保证程序内使用 UnitOfWork 的地方会执行 Dispose

原因二：Max Pool Size 设置过小，程序访问量过高

监视 fsql.Ado.MasterPool.Statistics，它的值：Pool: 5/100, Get wait: 0, GetAsync await: 0

```
5 为可用连接数，值为0后开始排队
100 为当前最大连接数
Get await 为同步方法获取连接的排队数量（超过10秒就会报错）
GetAsync await 为异步方法获取连接的排队数量
```

监视 FreeSql.UnitOfWork.DebugBeingUsed 这个静态字典，存储正在使用事务的工作单元

注意：尽量不要使用 fsql.Ado.MasterPool.Get() 或 GetAsync() 方法，否则请检查姿势。

---

### 8、多平台代码参考,使用自定义 SqliteProvider,例如 Sqlite 用 Microsoft.Data.Sqlite 或者反射 Mono.Data.Sqlite.

[arm/树莓派](https://github.com/densen2014/FreeSqlDemos/tree/master/ARM_ConsoleApp)

**有条件的同学直接试试 FreeSql.Provider.SqliteCore 包,使用的就是 Microsoft.Data.Sqlite 驱动.**

1.添加包

```xml
<PackageReference Include="FreeSql.Provider.Sqlite" Version="3.0.100" />
<PackageReference Include = "Microsoft.Data.Sqlite" Version="6.0.3" />
```

2.代码

```csharp
Microsoft.Data.Sqlite.SqliteConnection _database = new Microsoft.Data.Sqlite.SqliteConnection($"Data Source=document.db");

var fsql = new FreeSql.FreeSqlBuilder()
        .UseConnectionFactory(FreeSql.DataType.Sqlite, () => _database, typeof(FreeSql.Sqlite.SqliteProvider<>))
        .UseAutoSyncStructure(true)
        .UseNoneCommandParameter(true) //必须开启,因为Microsoft.Data.Sqlite内插处理有bug
        .UseMonitorCommand(cmd => Console.Write(cmd.CommandText))
        .Build();
```

[UWP](https://github.com/densen2014/FreeSqlDemos/tree/master/UWP1)

```csharp
using System.Data.SQLite;

string dbpath = Path.Combine(ApplicationData.Current.LocalFolder.Path, "sqliteSample.db");
SQLiteConnection _database = new SQLiteConnection($"Data Source={dbpath}");
var fsql = new FreeSql.FreeSqlBuilder()
           .UseConnectionFactory(FreeSql.DataType.Sqlite, () => _database, typeof(FreeSql.Sqlite.SqliteProvider<>))
           .Build();
```

[Xamarin Forms,代码较多](https://github.com/densen2014/FreeSqlDemos/tree/master/xamarinFormApps)
主程序,接口获取 rovider,各个平台自己实现.

```csharp
if (Device.RuntimePlatform == Device.iOS || Device.RuntimePlatform == Device.Android)
{
   fsql = new FreeSql.FreeSqlBuilder()
          .UseConnectionFactory(FreeSql.DataType.Sqlite, () => DependencyService.Get<ISQLite>().GetConnectionSqlite("document"), typeof(FreeSql.Sqlite.SqliteProvider<>))
          .UseNoneCommandParameter(true)
          .Build();
}
```

[iOS 部分](https://github.com/densen2014/FreeSqlDemos/blob/master/xamarinFormApps/xamarinFormApp.iOS/SQLite_iOS.cs)

[安卓部分](https://github.com/densen2014/FreeSqlDemos/blob/master/xamarinFormApps/xamarinFormApp.Android/SQLite_droid.cs)

---

### 9、 2.6.100 升级到 3.0.100 后无法连接 sqlserver 提示证书无效, 提示证书链是由不受信任的颁发机构颁发的.

请尝试:

1.连接字符串里加入 "Encrypt=True; TrustServerCertificate=True;"

2.使用 FreeSql.Provider.SqlServerForSystem 替换 FreeSql.Provider.SqlServer

深入讨论请转到 https://github.com/dotnetcore/FreeSql/issues/992#issuecomment-1005305027


---

### 10、 怎么样设置数据库超时时间?

**全局设置**
在连接字符串里设置。每个数据库写法不一样, 可以在 https://www.connectionstrings.com/ 查找

freesql声明中的build里  
UseCommandMonitor(cmd => cmd.ConmandTimeout = 9999, null) 这样设置


**单个设置**
- FreeSqlHelper.Fsql.Insert(list).CommandTimeout(500).xxxxxx
- FreeSqlHelper.Fsql.Update<Entities.SysAdmin>().CommandTimeout(400).xxxxxx
- FreeSqlHelper.Fsql.Select<Entities.SysAdmin>().CommandTimeout(300).xxxxxx
- FreeSqlHelper.Fsql.Delete<Entities.SysAdmin>().CommandTimeout(400).xxxxxx


---
