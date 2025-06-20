# 实体特性✨

v1.4.0+ 已自动识别 EF 特性 Key/Required/NotMapped/MaxLength/StringLength/DatabaseGenerated/Table/Column

## 表名

```csharp
[Table(Name = "tb_topic")]
class Topic { }
```

架构：\[Table(Name = "dbo.tb_topic")\]

注意：带点的表名，使用 \[Table(Name = "\`sys.config\`")\] 解决

表名映射的几种方法，优先级从小到大：

- 1、实体类名
- 2、Aop fsql.Aop.ConfigEntity += (\_, e) => e.ModifyResult.Name = "public.tabname"
- 3、[FluentApi](fluent-api.md) fsql.CodeFirst.ConfigEntity(a => a.Name("public.tabname"))
- 4、[Table(Name = "public.tabname")]
- 5、AsTable fsql.Select\<T\>().AsTable((\_, old) => "public.tabname").ToList()

> v3.2.833 可通过 UseMappingPriority 调整优先级，使用 Aop 实现动态表名

属性：[Column(Name = "xxx")]

## 主键(Primary Key)

```csharp
class Topic
{
    [Column(IsPrimary = true)]
    public int Id { get; set; }
}
```

- 当没有指明主键时，命名为 id 的字段将成为主键；（不区分大小写）
- 当主键是 Guid 类型时，插入时会自动创建（有序、不重复）的值，所以不需要自己赋值；（支持分布式）

> 联合主键，在多个属性标记特性

> Oracle 主键名长度大于30 \[OraclePrimaryKeyName(name)\]
> class table {...}

## 自增(Identity)

```csharp
class Topic
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
}
```

- 当没有指明主键时，标记自增的成员将成为主键；
- DbFirst 模式序列：[Column(IsIdentity = true, InsertValueSql = "seqname.nextval")]

## 唯一键(Unique Key)、索引（Index）

```csharp
[Index("uk_phone", "Phone", true)]
[Index("uk_group_index", "Group,Index11", true)]
[Index("uk_group_index22", "Group,Index22 desc", true)]
class Topic
{
    public int Id { get; set; }
    public string Phone { get; set; }

    public string Group { get; set; }
    public int Index11 { get; set; }
    public string Index22 { get; set; }
}
```

- 第三个参数 true 的时候是唯一键，false 的时候是普通索引。
- 分表场景的索引：[Index("{tablename}_idx_01", "phone")]

## 数据库类型(DbType)

提示：一般只需使用 .NET 常用类型映射即可（如 int/string/DateTime 等），不需要单独设置 DbType 内容。

```csharp
class Topic
{
    [Column(DbType = "varchar(128) NOT NULL default....")]
    public string Title { get; set; }
}
```

可以在类型上指定 NOT NULL，也可以通过 [Column(IsNullable = false)] 设置。

### decimal 精度

```csharp
class Topic
{
    [Column(Precision = 10, Scale = 2)]
    public decimal Amount { get; set; }
}
```

### string 长度

```csharp
class Topic
{
    [Column(StringLength = 128)]
    //或者 [MaxLength(128)]
    public string Title { get; set; }
}
```

当长度 -1 时产生的映射如下：

| MySql | PostgreSQL | SqlServer     | Oracle | Sqlite | Firebird        | DuckDB | MsAccess | 达梦 | 金仓 | 神通 | 南通 |
| ----- | ---------- | ------------- | ------ | ------ | --------------- | ------ | -------- | ---- | ---- | ---- | ---- |
| text  | text       | nvarchar(max) | nclob  | text   | blob sub_type 1 | text   | longtext | text | text | text | text |

> 注意：MySql [MaxLength(-2)] 或者 [Column(StringLength = -2)] 映射类型 longtext，其他数据库的映射规则与 -1 相同

### Nullable 可空

```csharp
class Topic
{
    [Column(IsNullable = false)]
    public string Title { get; set; }
}
```

在不指定 DbType、IsNullable 时，FreeSql 提供默认设定，如：

- int -> not null（不可为空）
- int? -> null（可空）

一般在使用 string 类型时，才需要手工指明是否可空（string 默认可空）；

## 服务器时间(ServerTime)

```csharp
class Topic
{
    [Column(ServerTime = DateTimeKind.Utc, CanUpdate = false)]
    public DateTime CreateTime { get; set; }

    [Column(ServerTime = DateTimeKind.Utc)]
    public DateTime UpdateTime { get; set; }
}
```

使用数据库时间执行插入数据，注意：

- 插入时设置实体的值是无效的，解决方法：fsql.Insert\<T\>().IgnoreInsertValueSql("CreateTime")；
- 插入实体执行成功后，实体的值还是 c# 时间；

## 忽略(Ignore)

```csharp
class Topic
{
    [Column(IsIgnore = true)]
    public string Title { get; set; }
}
```

属性不是可映射的类型时，可以不用指定 IsIgnore，如下不必要的指定：

```csharp
class Topic
{
    [Column(IsIgnore = true)]
    public Topic Parent { get; set; }
}
```

## 乐观锁(RowVersion)

```csharp
class Topic
{
    public Guid id { get; set; }
    public string Title { get; set; }

    [Column(IsVersion = true)]
    public int Version { get; set; }
}
```

乐观锁的原理，是利用实体某字段，如：long version，更新前先查询数据，此时 version 为 1，更新时产生的 SQL 会附加 where version = 1，当修改失败时（即 Affrows == 0）抛出异常（DbUpdateVersionException）。

每个实体只支持一个乐观锁属性，支持 int/long/string/Guid

> 适用 [`SetSource`](update.md#_5%E3%80%81%E6%9B%B4%E6%96%B0%E5%AE%9E%E4%BD%93-setsource) 更新数据，无论使用什么方法更新 version 的值都会增加 1

## 自定义类型映射(MapType)

使用 MapType 枚举 -> string/int 等等如下：

```csharp
class Table
{
    [Column(MapType = typeof(string))]
    public PeopleType t1 { get; set; }

    [Column(MapType = typeof(int))]
    public PeopleType t2 { get; set; }

    [Column(MapType = typeof(string))]
    public BigInteger t3 { get; set; }
}
public enum PeopleType { 中国人, abc, 香港 }
```

TypeHandlers（自定义）：

```csharp
FreeSql.Internal.Utils.TypeHandlers.TryAdd(typeof(JsonPoco), new JsonPocoTypeHandler());
FreeSql.Internal.Utils.TypeHandlers.TryAdd(typeof(DateOnly), new DateOnlyTypeHandler());
FreeSql.Internal.Utils.TypeHandlers.TryAdd(typeof(DateTimeOffset), new DateTimeOffsetTypeHandler());

class Product
{
    public JsonPoco json { get; set; }
    public DateOnly date { get; set; }
    public DateTimeOffset dateTimeOffset { get; set; }
}
class JsonPoco
{
    public int a { get; set; }
    public int b { get; set; }
}
class JsonPocoTypeHandler : TypeHandler<JsonPoco>
{
    public override object Serialize(JsonPoco value) => JsonConvert.SerializeObject(value);
    public override JsonPoco Deserialize(object value) => JsonConvert.DeserializeObject<JsonPoco>((string)value);
    public override void FluentApi(ColumnFluent col) => col.MapType(typeof(string)).StringLength(-1);
}
class DateOnlyTypeHandler : TypeHandler<DateOnly>
{
    public override object Serialize(DateOnly value) => value.ToString("yyyy-MM-dd");
    public override DateOnly Deserialize(object value) => DateOnly.TryParse(string.Concat(value), out var trydo) ? trydo : DateOnly.MinValue;
    public override void FluentApi(ColumnFluent col) => col.MapType(typeof(string)).StringLength(12);
}
class DateTimeOffsetTypeHandler : TypeHandler<DateTimeOffset>
{
    public override object Serialize(DateTimeOffset value) => value.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
    public override DateTimeOffset Deserialize(object value) => DateTimeOffset.TryParse((string)value, out var dts) ? dts : DateTimeOffset.MinValue;
    public override void FluentApi(ColumnFluent col) => col.MapType(typeof(string)).DbType("datetime");
}
```

JsonMap：

> dotnet add package FreeSql.Extensions.JsonMap

```csharp
fsql.UseJsonMap(); //开启功能

class Table
{
    public int Id { get; set; }

    [JsonMap]
    public TableOptions Options { get; set; }
}
class TableOptions
{
    public int Value1 { get; set; }
    public string Value2 { get; set; }
}

fsql.Select<Table>().Where(a => a.Options.Value1 == 100 && a.Options.Value2 == "xx").ToList();
//WHERE json_extract(a."Options",'$.Value1') = 100 AND json_extract(a."Options",'$.Value2') = 'xx'
```

## 字段位置(Position)

适用场景：当实体类继承时，CodeFirst 创建表的字段顺序可能不是想要的，通过该特性可以设置顺序。

创建表时指定字段位置，如：[Column(Position = 1)]，可为负数即反方向位置；

## 可插入(CanInsert)、可更新(CanUpdate)

该字段是否可以插入或更新，默认 true，指定为 false 插入或更新时该字段会被忽略。

当指明了 InsertColumn/UpdateColumns 等方法时，该特性作用可能失效。

## 自定义插入值(InsertValueSql)

执行 Insert 方法时使用此值，它的语法是 SQL。

注意：如果是 getdate() 这种请可考虑使用 ServerTime，因为适配了所有数据库。

```csharp
class Topic
{
    [Column(InsertValueSql = "'xxx'")]
    public string Name { get; set; }
}

fsql.Insert(new Type()).ExecuteAffrows();
//INSERT INTO `type`(`Name`) VALUES('xxx')

//v3.2.700 忽略 InsertValueSql
fsql.Insert(new Type()).IgnoreInsertValueSql(a => a.Name).ExecuteAffrows();
//INSERT INTO `type`(`Name`) VALUES('')
```

## 自定义重写(RewriteSql)、重读(RereadSql)

写入时重写 SQL、读取时重写 SQL，例如 geography 类型的读写场景：

```csharp
class Topic
{
    [Column(DbType = "geography",
        RewriteSql = "geography::STGeomFromText({0}, 4236)",
        RereadSql = "{0}.STAsText()")]
    public string geo { get; set; }
}
//插入：INSERT INTO [ts_geocrud01]([id], [geo])
//VALUES(@id_0, geography::STGeomFromText(@geo_0, 4236))

//查询：SELECT TOP 1 a.[id], a.[geo].STAsText()
//FROM [ts_geocrud01] a
//WHERE (a.[id] = 'c7227d5e-0bcf-4b71-8f0f-d69a552fe84e')
```

## 禁用迁移

fsql.CodeFirst.IsAutoSyncStructure 设置全局【自动迁移结构】，或者 FreeSqlBuilder.UseAutoSyncStructure(true) 创建 IFreeSql 的时候设置。

当【实体类】对应的是数据库【视图】或者其他时，可设置禁用指定的实体迁移。

```csharp
[Table(DisableSyncStructure = true)]
class Topic2
{
    [Column(IsPrimary = false)]
    public int Id { get; set; }
}
```

## 数据库备注

FreeSql CodeFirst 支持将 c# 代码内的注释，迁移至数据库的备注。先决条件：

1、实体类所在程序集，需要开启 xml 文档功能；

2、xml 文件必须与程序集同目录，且文件名：xxx.dll -> xxx.xml；

> v1.5.0+ 版本增加了对 [Description("xxx")] 特性的解析，优先级低于 c# 代码注释；
