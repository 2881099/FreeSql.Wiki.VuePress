---
layout: default
---

FreeSql 支持 CodeFirst 迁移结构至数据库，这应该是(O/RM)必须标配的一个功能。

与其他(O/RM)不同FreeSql支持更多的数据库特性，而不只是支持基础的数据类型，这既是优点也是缺点，优点是充分利用数据库特性辅助开发，缺点是切换数据库变得困难。不同程序员的理念可能不太一致，FreeSql尽量把功能支持到极致，至于是否使用是项目组技术衡量的另一个问题。

尽管多种数据库适配逻辑非常复杂，FreeSql始终秉承优化程序开发习惯的原则尽量去实现，中间碰到了一些非技术无法攻克的难题，比如数据库的自定义类型，和实体类本身就是一种冲突，为了减少使用成本，诸如此类的数据库功能没有得到支持。

```csharp
IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql,"Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10")
    .UseAutoSyncStructure(true) //自动同步实体结构【开发环境必备】
    .UseMonitorCommand(cmd => Console.Write(cmd.CommandText))
    .Build(); //请务必定义成 Singleton 单例模式
```

## 迁移结构

| 实体＆表对比 | 添加 | 改名 | 删除 |
| - | - | - | - |
|  | √ | √ | X |

| 实体属性＆字段对比 | 添加 | 修改可空 | 修改自增 | 修改类型 | 改名 | 删除 | 备注 |
| - | - | - | - | - | - | - | - |
|  | √ | √ | √ | √ | √ | X | √ |

> 为了保证安全，不提供删除字段。

警告：如果实体类属性，与数据库表字段不完整映射的时候，未映射的字段有可能发生丢失。

> 原因：某些迁移对比操作是：创建临时表、导入旧表数据、删除旧表。

FreeSql提供两种CodeFirst移迁方法，自动和手动。

> **注意**：谨慎、谨慎、谨慎在生产环境中使用该功能。

> **注意**：谨慎、谨慎、谨慎在生产环境中使用该功能。

> **注意**：谨慎、谨慎、谨慎在生产环境中使用该功能。

### 自动同步实体结构【开发环境必备】

自动同步实体结构到数据库，程序运行中检查实体表是否存在，然后迁移执行创建或修改。

```csharp
fsql.CodeFirst.IsAutoSyncDataStructure = true;
```

> 此功能默认为开启状态，发布正式环境后，请修改此设置。

> 虽然【自动同步实体结构】功能开发非常好用，但是有个坏处，就是数据库后面会很乱，没用的字段可能一大堆，应尽量控制实体或属性命名的修改。


- 注意：只有当CURD到此表时，才会自动生成表结构。如需系统运行时迁移表结构，请使用**SyncStructure**方法
- FreeSql不会帮你生成数据库，需要你手动创建数据库。**如果你使用Mysql、Sql Server，需要自动创建数据库.请参考此代码，自行copy，[FreeSqlExtensions.cs](https://github.com/luoyunchong/dotnetcore-examples/blob/master/ORM/FreeSql/OvOv.FreeSql/FreeSqlExtensions.cs)**

### 禁用迁移

当【实体类】对应的是数据库【视图】或者其他时，可通过 [Table(DisableSyncStructure = true)] 禁用指定的实体迁移操作。

```csharp
[Table(DisableSyncStructure = true)]
class ModelDisableSyncStructure {
    [Column(IsPrimary = false)]
    public int pkid { get; set; }
}
```

## 备注

FreeSql CodeFirst 支持将 c# 代码内的注释，迁移至数据库的备注。先决条件：

1、实体类所在程序集，需要开启 xml 文档功能；

2、xml 文件必须与程序集同目录，且文件名：xxx.dll -> xxx.xml；

> v1.5.0+ 版本增加了对 Description 特性的解析，优先级低于 c# 代码注释；

### 手工同步实体结构

提供接口方法实现对比实体，与数据库中的变化部分，返回SQL语句。

```csharp
var t1 = mysql.CodeFirst.GetComparisonDDLStatements<Topic>();

class Topic {
	[Column(IsIdentity = true, IsPrimary = true)]
	public int Id { get; set; }
	public int Clicks { get; set; }
	public string Title { get; set; }
	public DateTime CreateTime { get; set; }
	public ushort fusho { get; set; }
}
```
```sql
CREATE TABLE IF NOT EXISTS `cccddd`.`Topic` ( 
  `Id` INT(11) NOT NULL AUTO_INCREMENT, 
  `Clicks` INT(11) NOT NULL, 
  `Title` VARCHAR(255), 
  `CreateTime` DATETIME NOT NULL, 
  `fusho` SMALLINT(5) UNSIGNED NOT NULL, 
  PRIMARY KEY (`Id`)
) Engine=InnoDB CHARACTER SET utf8;
```

提供接口方法实现同步结构

```csharp
var t2 = fsql.CodeFirst.SyncStructure<Topic>();
//同步实体类型到数据库
```

#### 批量生成表结构
- void  SyncStructure(params Type[]) 重载方法支持数组,同步实体类型集合到数据库
- IEntity类，是实体类所在程序集的一个类即可。
下面是二种方法。
1.扫描 IEntity类所在程序集，反射得到类上有特性标签为TableAttribute 的所有类，该方法需在实体类上指定了 [Table(Name = "xxx")]特性标签
```csharp
public class ReflexHelper
{
        public static Type[] GetTypesByTableAttribute()
        {
            List<Type> tableAssembies = new List<Type>();
            foreach (Type type in Assembly.GetAssembly(typeof(IEntity)).GetExportedTypes())
            {
                foreach (Attribute attribute in type.GetCustomAttributes())
                {
                    if (attribute is TableAttribute tableAttribute)
                    {
                        if (tableAttribute.DisableSyncStructure == false)
                        {
                            tableAssembies.Add(type);
                        }
                    }
                }
            };
            return tableAssembies.ToArray();
        }
}
```
调用
```csharp
fsql.CodeFirst.SyncStructure(ReflexHelper.GetTypesByTableAttribute());
```

2.ReflexHelper.cs类增加GetTypesByNameSpace方法，通过命名空间得到所有要创建的实体类.根据需要调整entitiesFullName下的命名空间值。比如我们创建一个Entities文件夹，用于存放实体类。该方法通过筛选 IEntity类所在程序集所有的实体类。他们的命名空间都是LinCms.Entities开头，内部通过StartsWith判断。
```
  public static Type[] GetTypesByNameSpace()
        {
            List<Type> tableAssembies = new List<Type>();
            List<string> entitiesFullName = new List<string>()
            {
                "LinCms.Entities.Settings",
                "LinCms.Entities.Base",
            };

            foreach (Type type in Assembly.GetAssembly(typeof(IEntity)).GetExportedTypes())
            {
                foreach (var fullname in entitiesFullName)
                {
                    if (type.FullName.StartsWith(fullname) && type.IsClass)
                    {
                        tableAssembies.Add(type);
                    }
                }

            }
            return tableAssembies.ToArray();
        }
```
或通过调用同步所有表结构

```csharp
fsql.CodeFirst.SyncStructure(ReflexHelper.GetTypesByNameSpace());
```

## 实体特性

指定实体的表名，指定 Name 后，实体类名变化不影响数据库对应的表。FreeSql尽量支持了对多数据库或schema支持，不防试试指定表名为：其他数据库.表名，不同数据库的指定方式有差异，这一点以后深入解答。
```csharp
[Table(Name = "db2.tb_topic111")]
class Topic {
  //...
}
```

无指定实体的表名，修改为实体类名。指定数据库旧的表名，修改实体命名时，同时设置此参数为修改之前的值，CodeFirst才可以正确修改数据库表；否则将视为【创建新表】。
```csharp
[Table(OldName = "Topic")]
class Topic2 {
  //...
}
```
```sql
ALTER TABLE `cccddd`.`Topic` RENAME TO `cccddd`.`Topic2`;
```

修改字段类型，把 Title 类型改为 varchar(128)。
```csharp
[Column(DbType = "varchar(128)")]
public string Title { get; set; }
```
```sql
ALTER TABLE `cccddd`.`Topic2` MODIFY `Title` VARCHAR(128);
```

指定属性的字段名，这样指定后，修改实体的属性名不影响数据库对应的列。
```csharp
[Column(Name = "titl2")]
public string Title { get; set; }
```

无指定属性的字段名，修改为属性名，指定数据库旧的列名，修改实体属性命名时，同时设置此参数为修改之前的值，CodeFirst才可以正确修改数据库字段；否则将视为【新增字段】。
```csharp
[Column(OldName = "Title2")]
public string Title { get; set; }
```
```sql
ALTER TABLE `cccddd`.`Topic2` CHANGE COLUMN `Title2` `Title` VARCHAR(255);
```
