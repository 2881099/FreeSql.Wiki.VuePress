# 实体特性✨

v1.4.0+ 已自动识别 EFCore 实体特性 Key/Required/NotMapped/MaxLength/StringLength/DatabaseGenerated/Table/Column

## 名称

```csharp
[Table(Name = "tb_topic")]
class Topic { }
```

架构：\[Table(Name = "dbo.tb_topic")\]

注意：带点的表名，使用 \[Table(Name = "\`sys.config\`")\] 解决

> 指定表名的几种方法，优先级从小到大：

- 1、实体类名
- 2、Aop fsql.Aop.ConfigEntity += (_, e) => e.ModifyResult.Name = "public.tabname"
- 3、FluentApi fsql.CodeFirst.ConfigEntity(a => a.Name("public.tabname"))
- 4、[Table(Name = "public.tabname")]
- 5、AsTable fsql.Select\<T\>().AsTable((_, old) => "public.tabname").ToList()

> v3.2.660 可通过 UseMappingPriority 调整优先级

改名：须指定旧的表名：\[Table(OldName = "Topic")\]

> 属性名称：\[Column(Name = "xxx")\]

## 主键(Primary Key)

```csharp
class Topic {
    [Column(IsPrimary = true)]
    public int Id { get; set; }
}
```

约定：

* 当没有指明主键时，命名为 id 的字段将成为主键；（不区分大小写）

* 当主键是 Guid 类型时，插入时会自动创建（有序、不重复）的值，所以不需要自己赋值；（支持分布式）

> 联合主键，在多个属性标记特性

## 自增(Identity)

```csharp
class Topic {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
}
```

约定：

* 当没有指明主键时，标记自增的成员将成为主键；
* DbFirst 模式序列：[Column(IsIdentity = true, InsertValueSql = "seqname.nextval")]

## 唯一键(Unique Key)、索引（Index）

```csharp
[Index("uk_phone", "phone", true)]
[Index("uk_group_index", "group,index", true)]
[Index("uk_group_index22", "group, index22 desc", true)]
class AddUniquesInfo {
    public Guid id { get; set; }
    public string phone { get; set; }

    public string group { get; set; }
    public int index { get; set; }
    public string index22 { get; set; }
}
```

> 第三个参数 true 的时候是唯一键，false 的时候是普通索引。

> 分表场景的索引可以这样：[Index("{tablename}_idx_01", "phone")]

## 数据库类型(DbType)

```csharp
class Topic {
    [Column(DbType = "varchar(128) NOT NULL")]
    public string Title { get; set; }
}
```

可以在类型上指定 NOT NULL，也可以通过 [Column(IsNullable = false)] 设置；

> decimal 指定长度 [Column(DbType = "decimal(10,2)")] 或者 [Column(Precision = 10, Scale = 2)]

> string 指定长度 [Column(DbType = "varchar(128)")] 或者 [MaxLength(128)] 或者 [Column(StringLength = 128)]，当长度 -1 时产生的映射如下：

## Text类型 [Column(StringLength =-1)]

当长度 -1 时产生的映射如下：

| MySql | PostgreSQL | SqlServer | Oracle | Sqlite | Firebird | MsAccess | 达梦 | 金仓 | 神通 | 南通 |
| - | - | - | - | - | - | - | - | - | - |- |
| text | text | nvarchar(max) | nclob | text | blob sub_type 1 | longtext | text | text | text | text | 

> 注意：Oracle nclob 需要 v1.3.2+ 版本才支持，否则将映射 nvarchar2(4000)

> 注意：MySql [MaxLength(-2)] 或者 [Column(StringLength = -2)] 映射类型 longtext，其他数据库的映射规则与 -1 相同

## 服务器时间(ServerTime)

```csharp
class Topic {

    [Column(ServerTime = DateTimeKind.Utc, CanUpdate = false)]
    public DateTime CreateTime { get; set; }
    
    [Column(ServerTime = DateTimeKind.Utc)]
    public DateTime UpdateTime { get; set; }
}
```

使用数据库时间执行插入数据，注意：

1、一但设置了这个特性，插入的时候设置属性值是无效的；

2、插入实体执行成功后，实体的值还是 c# 时间；

> v1.1.0 - ServerTime 特性，对 Update 方法时也能生效

## 可空(Nullable)

```csharp
class Topic {
    [Column(IsNullable = false)]
    public string Title { get; set; }
}
```

在不指定 DbType、IsNullable 时，FreeSql 提供默认设定，如：

* int -> not null（不可为空）
* int? -> null（可空）

一般在使用 string 类型时，才需要手工指明是否可空（string 默认可空）；

## 忽略(Ignore)

```csharp
class Topic {
    [Column(IsIgnore = true)]
    public string Title { get; set; }
}
```

当实体有属性不需要映射的时候使用，内部自动忽略了对象的映射；

当实体内的属性不是可接受的类型时，可以不用指定该特定，如下不必要的指定：

```csharp
class Topic {
    [Column(IsIgnore = true)]
    public Topic Parent { get; set; }
}
```

## 乐观锁(RowVersion)

```csharp
class Topic {
    public Guid id { get; set; }
    public string Title { get; set; }

    [Column(IsVersion = true)]
    public int Version { get; set; }
}
```

更新整个实体数据时，在并发情况下极容易造成旧数据将新的记录更新。

乐观锁的原理，是利用实体某字段，如：long version，更新前先查询数据，此时 version 为 1，更新时产生的 SQL 会附加 where version = 1，当修改失败时（即 Affrows == 0）抛出异常（DbUpdateVersionException）。

每个实体只支持一个乐观锁属性。

> 适用 SetSource 更新，无论使用什么方法更新 version 的值都会增加 1

## 自定义类型映射(MapType)

```csharp
class EnumTestMap {
    public Guid id { get; set; }

    [Column(MapType = typeof(string))]
    public ToStringMapEnum enum_to_string { get; set; }
    [Column(MapType = typeof(string))]
    public ToStringMapEnum? enumnullable_to_string { get; set; }

    [Column(MapType = typeof(int))]
    public ToStringMapEnum enum_to_int { get; set; }
    [Column(MapType = typeof(int?))]
    public ToStringMapEnum? enumnullable_to_int { get; set; }

    [Column(MapType = typeof(string))]
    public BigInteger biginteger_to_string { get; set; }
    [Column(MapType = typeof(string))]
    public BigInteger? bigintegernullable_to_string { get; set; }
}
public enum ToStringMapEnum { 中国人, abc, 香港 }
```

BigInteger 也可以映射使用，但请注意：仅仅是 CURD 方便， Equals == 判断可以使用，无法实现 + - * / 等操作；

v0.9.15 版本还可以将值对象映射成 typeof(string)，安装扩展包：

> dotnet add package FreeSql.Extensions.JsonMap

```csharp
fsql.UseJsonMap(); //开启功能

class TestConfig {
    public int clicks { get; set; }
    public string title { get; set; }
}
[Table(Name = "sysconfig")]
public class S_SysConfig {
    [Column(IsPrimary = true)]
    public string Name { get; set; }

    [JsonMap]
    public TestConfig Config { get; set; }
}
```

## 字段位置(Position)

适用场景：当实体类继承时，CodeFirst创建表的字段顺序可能不是想要的，通过该特性可以设置顺序。

创建表时指定字段位置，如：[Column(Position = 1]，可为负数即反方向位置；

## 可插入(CanInsert)、可更新(CanUpdate)

该字段是否可以插入或更新，默认值true，指定为false插入或更新时该字段会被忽略。

当指明了 InsertColumn/UpdateColumns 等方法时，该特性作用可能失效。例如 CanInsert = false 时，又指明了 InsertColumns 该属性，则仍然会插入。

## 自定义插入值(InsertValueSql)

执行 Insert 方法时使用此值，它的语法是 SQL。

注意：如果是 getdate() 这种请可考虑使用 ServerTime，因为它对数据库间作了适配。

```csharp
class Type {
    [Column(InsertValueSql = "'xxx'")]
    public string Name { get; set; }
}

fsql.Insert(new Type()).ExecuteAffrows();
//INSERT INTO `type`(`Name`) VALUES('xxx')
```

## 自定义重写(RewriteSql)、重读(RereadSql)

写入时重写 SQL、读取时重写 SQL，适合 geography 类型的读写场景。

```csharp
[Column(
    DbType = "geography", 
    RewriteSql = "geography::STGeomFromText({0}, 4236)", 
    RereadSql = "{0}.STAsText()"
)]
public string geo { get; set; }

//插入：INSERT INTO [ts_geocrud01]([id], [geo]) VALUES(@id_0, geography::STGeomFromText(@geo_0, 4236))

//查询：SELECT TOP 1 a.[id], a.[geo].STAsText() 
//FROM [ts_geocrud01] a 
//WHERE (a.[id] = 'c7227d5e-0bcf-4b71-8f0f-d69a552fe84e')
```

## 禁用迁移

IFreeSql.CodeFirst.IsAutoSyncStructure 可设置全局【自动迁移结构】功能，也可通过 FreeSqlBuilder.UseAutoSyncStructure(true) 创建 IFreeSql 的时候设置功能。

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

## 优先级

数据库特性 > 实体特性 > FluentApi（配置特性） > Aop（配置特性）
