# DB First

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql,
     "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10"
     )
    .Build(); //请务必定义成 Singleton 单例模式
```

## 获取所有数据库

```csharp
var t1 = fsql.DbFirst.GetDatabases();
//返回字符串数组, ["cccddd", "test"]
```

## 获取指定数据库的表信息

```csharp
var t2 = fsql.DbFirst.GetTablesByDatabase(fsql.DbFirst.GetDatabases()[0]);
//返回包括表、列详情、主键、唯一键、索引、外键、备注等等

var t3 = fsql.DbFirst.GetTableByName("table1");
//返回表的列详情、主键、唯一键、索引、备注等等
```

## .NET Core CLI(推荐使用)

代码生成器`FreeSql.Generator`,是 FreeSql 的代码生成器，可生成实体类，支持将数据库实体动态生成实体，默认有二个模板，基于 Razor，可指定自定义模板

- `dotnet-tool`安装 `FreeSql.Generator`

```bash
dotnet tool install -g FreeSql.Generator
```

- 更新`FreeSql.Generator`

```bash
dotnet tool update -g FreeSql.Generator
```

新建目录，在地址栏输入 cmd 快速打开命令窗口，输入命令：

```bash
FreeSql.Generator --help
```

命令行工具生成实体类极大好处，后续再次生成覆盖操作等于一键完成，并且支持 Mac/Linux 平台。

[详细解读：生成器是如何实现的？](https://www.cnblogs.com/igeekfan/p/freesql-generator.html)

```
C:\WINDOWS\system32>FreeSql.Generator --help
        ____                   ____         __
       / __/  ____ ___  ___   / __/ ___ _  / /
      / _/   / __// -_)/ -_) _\ \  / _ `/ / /
     /_/    /_/   \__/ \__/ /___/  \_, / /_/
                                    /_/


  # Github # https://github.com/2881099/FreeSql v2.0.105

    FreeSql 快速生成数据库的实体类

    更新工具：dotnet tool update -g FreeSql.Generator


  # 快速开始 #

  > FreeSql.Generator -Razor 1 -NameOptions 0,0,0,0 -NameSpace MyProject -DB "MySql,Data Source=127.0.0.1;..."

     -Razor 1                  * 选择模板：实体类+特性
     -Razor 2                  * 选择模板：实体类+特性+导航属性
     -Razor "d:\diy.cshtml"    * 自定义模板文件

     -NameOptions              * 4个布尔值对应：
                                 首字母大写
                                 首字母大写,其他小写
                                 全部小写
                                 下划线转驼峰

     -NameSpace                * 命名空间

     -DB "MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=数据库;charset=utf8;sslmode=none;max pool size=2"
     -DB "SqlServer,data source=.;integrated security=True;initial catalog=数据库;pooling=true;max pool size=2"
     -DB "PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=数据库;pooling=true;maximum pool size=2"
     -DB "Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2"
     -DB "Sqlite,data source=document.db"
     -DB "Firebird,database=localhost:D:\fbdata\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2"
     -DB "Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2"
     -DB "KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=数据库"
     -DB "ShenTong,host=192.168.164.10;port=2003;database=数据库;username=SYSDBA;password=szoscar55;maxpoolsize=2"
                               * Dameng(达梦数据库)、KingbaseES(人大金仓数据库)、ShenTong(神舟通用数据库)

     -Filter                   Table+View+StoreProcedure
                               默认生成：表+视图+存储过程
                               如果不想生成视图和存储过程 -Filter View+StoreProcedure

     -Match                    表名或正则表达式，只生成匹配的表，如：dbo\.TB_.+

     -FileName                 文件名，默认：{name}.cs
     -Output                   保存路径，默认为当前 shell 所在目录
                               推荐在实体类目录创建 gen.bat，双击它重新所有实体类
```

### 常用选项

| 选项         | 说明                                                                                                                                                  |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| -Razor       | 选择模板：`实体类+特性` `-Razor 1` /`实体类+特性+导航属性` `-Razor 1`/`自定义模板文件` `-Razor "d:\diy.cshtml"`                                       |
| -NameOptions | 生成的实体命名规范，应只设置某一个为参数为 1，其中 4 个布尔值对应：`首字母大写`/`首字母大写,其他小写`/`全部小写`/`下划线转驼`（-NameOptions 0,0,0,1） |
| -NameSpace   | 命名空间                                                                                                                                              |
| -DB          | 看下文中的-DB 参数                                                                                                                                    |
| -Filter      | Table+View+StoreProcedure（ 默认生成：表+视图+存储过程）， 如果不想生成视图和存储过程 -Filter View+StoreProcedure                                     |
| -Match       | 表名或正则表达式，只生成匹配的表，如：dbo\.TB\_.+                                                                                                     |
| -FileName    | 文件名，默认：{name}.cs                                                                                                                               |
| -Output      | 推荐在实体类目录创建 gen.bat，双击它重新所有实体类                                                                                                    |

### -DB 参数

```
-DB "MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=数据库;charset=utf8;sslmode=none;max pool size=2"
-DB "SqlServer,data source=.;integrated security=True;initial catalog=数据库;pooling=true;max pool size=2"
-DB "PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=数据库;pooling=true;maximum pool size=2"
-DB "Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2"
-DB "Sqlite,data source=document.db"
-DB "Firebird,database=localhost:D:\fbdata\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2"
-DB "Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2"
-DB "KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=数据库"
-DB "ShenTong,host=192.168.164.10;port=2003;database=数据库;username=SYSDBA;password=szoscar55;maxpoolsize=2"
```

### 示例

> FreeSql.Generator -Razor 1 -NameOptions 0,0,0,1 -NameSpace LinCms.Core.Entities -DB "MySql,Data Source=127.0.0.1;Port=3306;User ID=root;Password=123456;Initial Catalog=lincms;Charset=utf8;SslMode=none;Max pool size=2"

- 数据库表名是下划线，字段也是下划线方式。
- -Razor 指定 第一个模板
- -NameOptions 0,0,0,1 最后一个 1，代表 下划线转驼峰，满足 C#命名规则
- -NameSpace 指定了命名空间 LinCms.Core.Entities
- -DB 就是数据库的相关配置
- mysql 本地地址 127.0.0.1 3306 端口 用户名 root 密码 123456 数据库 lin-cms
- -Match book 这样就能只生成 book，支持正则表达式，如 -Math lin*user 就会生成以 lin_user 开头的表。如 dbo\.TB*.+，会生成以 TB 开头的表。即只生成匹配的表

## 安装 Winform 生成器（已停止更新）

源码地址：[FreeSql.Tools](https://github.com/2881099/FreeSql.Tools)

> 作者：[mypeng1985](https://github.com/mypeng1985) 开发了两个版本

![image](https://user-images.githubusercontent.com/16286519/76141354-4790e980-609e-11ea-869b-bb2c6980d98f.png)

![image](https://user-images.githubusercontent.com/16286519/58793525-e0cf3300-8628-11e9-8959-d2efed685843.png)
