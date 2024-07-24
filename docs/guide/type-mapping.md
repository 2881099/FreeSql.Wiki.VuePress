# 类型映射

## 自定义类型映射(MapType)

### v3.2.701 自定义类型转换

```csharp
FreeSql.Internal.Utils.TypeHandlers.TryAdd(typeof(JsonClass), new String_JsonClass());


class Product
{
    public Guid id { get; set; }
    [Column(MapType = typeof(string), StringLength = -1)]
    public JsonClass json { get; set; }
}

class JsonClass
{
    public int a { get; set; }
    public int b { get; set; }
}
class String_JsonClass : TypeHandler<JsonClass>
{
    public override object Serialize(JsonClass value)
    {
        return JsonConvert.SerializeObject(value);
    }
    public override JsonClass Deserialize(object value)
    {
        return JsonConvert.DeserializeObject<JsonClass>((string)value);
    }
}

class Class1
{
    //自定义 DateTimeOffset
    [Column(MapType = typeof(string), DbType = "datetime")]
    public DateTimeOffset Join { get; set; }
}
class DateTimeOffsetTypeHandler : TypeHandler<DateTimeOffset>
{
    public override object Serialize(DateTimeOffset value)
    {
        return value.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
    }
    public override DateTimeOffset Deserialize(object value)
    {
        return DateTimeOffset.TryParse((string)value, out var dts) ? dts : DateTimeOffset.MinValue;
    }
}
```

### 使用 MapType 枚举 -> string/int 等等如下：

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

应该不需要解释了吧？

BigInteger 都可以映射使用了，但请注意：仅仅是 CURD 方便， Equals == 判断可以使用，无法实现 + - \* / 等操作；

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

## 默认类型映射

| csharp                            | MySql                | SqlServer        | PostgreSQL    | Oracle                            | Sqlite        | 达梦           |
| --------------------------------- | -------------------- | ---------------- | ------------- | --------------------------------- | ------------- | -------------- |
| bool \| bool?                     | bit(1)               | bit              | bool          | number(1)                         | boolean       | number(1)      |
| sbyte \| sbyte?                   | tinyint(3)           | smallint         | int2          | number(4)                         | smallint      | number(4)      |
| short \| short?                   | smallint(6)          | smallint         | int2          | number(6)                         | smallint      | number(6)      |
| int \| int?                       | int(11)              | int              | int4          | number(11)                        | integer       | number(11)     |
| long \| long?                     | bigint(20)           | bigint           | int8          | number(21)                        | integer       | number(21)     |
| byte \| byte?                     | tinyint(3) unsigned  | tinyint          | int2          | number(3)                         | int2          | number(3)      |
| ushort \| ushort?                 | smallint(5) unsigned | int              | int4          | number(5)                         | unsigned      | number(5)      |
| uint \| uint?                     | int(10) unsigned     | bigint           | int8          | number(10)                        | decimal(10,0) | number(10)     |
| ulong \| ulong?                   | bigint(20) unsigned  | decimal(20,0)    | numeric(20,0) | number(20)                        | decimal(21,0) | number(20)     |
| double \| double?                 | double               | float            | float8        | float(126)                        | double        | double         |
| float \| float?                   | float                | real             | float4        | float(63)                         | float         | real           |
| decimal \| decimal?               | decimal(10,2)        | decimal(10,2)    | numeric(10,2) | number(10,2)                      | decimal(10,2) | number(10,2)   |
| Guid \| Guid?                     | char(36)             | uniqueidentifier | uuid          | char(36 CHAR)                     | character(36) | char(36)       |
| TimeSpan \| TimeSpan?             | time                 | time             | time          | interval day(2) to second(6)      | bigint        | -              |
| DateTime \| DateTime?             | datetime             | datetime         | timestamp     | timestamp(6)                      | datetime      | timestamp(6)   |
| DateTimeOffset \| DateTimeOffset? | -                    | datetimeoffset   | -             | timestamp(6) with local time zone | -             | timestamp(6)   |
| Enum \| Enum?                     | enum                 | int              | int4          | number(16)                        | mediumint     | number(16)     |
| FlagsEnum \| FlagsEnum?           | set                  | bigint           | int8          | number(32)                        | bigint        | number(32)     |
| byte[]                            | varbinary(255)       | varbinary(255)   | bytea         | blob                              | blob          | blob           |
| string                            | varchar(255)         | nvarchar(255)    | varchar(255)  | nvarchar2(255)                    | nvarchar(255) | nvarchar2(255) |

> 以上类型和长度是默认值，可手工设置 Column 特性 DbType 值

> string 指定长度 [Column(DbType = "varchar(max)")] 或者 [MaxLength(-1)] 或者 [Column(StringLength = -1)]，当长度 -1 时产生的映射如下：

| MySql | PostgreSQL | SqlServer    | Oracle | Sqlite | Firebird        | MsAccess | 达梦 | 金仓 | 神通 |
| ----- | ---------- | ------------ | ------ | ------ | --------------- | -------- | ---- | ---- | ---- |
| text  | text       | varchar(max) | nclob  | text   | blob sub_type 1 | longtext | text | text | text |

> 注意：Oracle nclob 需要 v1.3.2+ 版本才支持，否则将映射 nvarchar2(4000)

> 注意：MySql [MaxLength(-2)] 或者 [Column(StringLength = -2)] 映射类型 longtext，其他数据库的映射规则与 -1 相同

> decimal 指定长度 [Column(Precision = 10, Scale = 2)]

## MySql 特别类型映射

| csharp               | MySql           |
| -------------------- | --------------- |
| MygisPoint           | point           |
| MygisLineString      | linestring      |
| MygisPolygon         | polygon         |
| MygisMultiPoint      | multipoint      |
| MygisMultiLineString | multilinestring |
| MygisMultiPolygon    | multipolygon    |

## Mysql注意事项
如果``int、byte``类型，指定了 ``DbType="tinyint(1)"``,请注意，``tinyint(1)``在ado.net中默认将此值映射为``bool``类型，可在链接串中指定``TreatTinyAsBoolean=false``,使映射 ``tinyint(1) ``为 ``SByte`` 而非 ``bool``。

## PostgreSQL 特别类型映射

| csharp                                                              | PostgreSQL                       |
| ------------------------------------------------------------------- | -------------------------------- |
| BitArray                                                            | varbit(64)                       |
| NpgsqlPoint \| NpgsqlPoint?                                         | point                            |
| NpgsqlLine \| NpgsqlLine?                                           | line                             |
| NpgsqlLSeg \| NpgsqlLSeg?                                           | lseg                             |
| NpgsqlBox \| NpgsqlBox?                                             | box                              |
| NpgsqlPath \| NpgsqlPath?                                           | path                             |
| NpgsqlPolygon \| NpgsqlPolygon?                                     | polygon                          |
| NpgsqlCircle \| NpgsqlCircle?                                       | circle                           |
| (IPAddress Address, int Subnet) \| (IPAddress Address, int Subnet)? | cidr                             |
| IPAddress                                                           | inet                             |
| PhysicalAddress                                                     | macaddr                          |
| NpgsqlRange\<int\> \| NpgsqlRange\<int\>?                           | int4range                        |
| NpgsqlRange\<long\> \| NpgsqlRange\<long\>?                         | int8range                        |
| NpgsqlRange\<decimal\> \| NpgsqlRange\<decimal\>?                   | numrange                         |
| NpgsqlRange\<DateTime\> \| NpgsqlRange\<DateTime\>?                 | tsrange                          |
| PostgisPoint                                                        | geometry                         |
| PostgisLineString                                                   | geometry                         |
| PostgisPolygon                                                      | geometry                         |
| PostgisMultiPoint                                                   | geometry                         |
| PostgisMultiLineString                                              | geometry                         |
| PostgisMultiPolygon                                                 | geometry                         |
| PostgisGeometry                                                     | geometry                         |
| PostgisGeometryCollection                                           | geometry                         |
| Dictionary\<string, string\>                                        | hstore                           |
| JToken                                                              | jsonb                            |
| JObject                                                             | jsonb                            |
| JArray                                                              | jsonb                            |
| 数组                                                                | 以上所有类型都支持，包括默认类型 |

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

## 优先级

从数据库导入特性 > 实体特性 > FluentApi > Aop
