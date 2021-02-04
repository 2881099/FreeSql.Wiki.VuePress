# DB First

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10")
    .Build(); //请务必定义成 Singleton 单例模式
```

### 获取所有数据库

```csharp
var t1 = fsql.DbFirst.GetDatabases();
//返回字符串数组, ["cccddd", "test"]
```

### 获取指定数据库的表信息

```csharp
var t2 = fsql.DbFirst.GetTablesByDatabase(fsql.DbFirst.GetDatabases()[0]);
//返回包括表、列详情、主键、唯一键、索引、外键、备注等等

var t3 = fsql.DbFirst.GetTableByName("table1");
//返回表的列详情、主键、唯一键、索引、备注等等
```

## 安装 dotnet-tool 生成实体类（推荐使用）

> dotnet tool install -g FreeSql.Generator

新建目录，在地址栏输入 cmd 快速打开命令窗口，输入命令：

> FreeSql.Generator --help

命令行工具生成实体类极大好处，后续再次生成覆盖操作等于一键完成，并且支持 Mac/Linux 平台。

[详细解读：生成器是如何实现的？](https://www.cnblogs.com/igeekfan/p/freesql-generator.html)

## 安装 Winform 生成器（已停止更新）

源码地址：[FreeSql.Tools](https://github.com/2881099/FreeSql.Tools)
> 作者：[mypeng1985](https://github.com/mypeng1985) 开发了两个版本

![image](https://user-images.githubusercontent.com/16286519/76141354-4790e980-609e-11ea-869b-bb2c6980d98f.png)

![image](https://user-images.githubusercontent.com/16286519/58793525-e0cf3300-8628-11e9-8959-d2efed685843.png)
