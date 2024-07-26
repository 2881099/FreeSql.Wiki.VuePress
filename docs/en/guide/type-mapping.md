# Type Mapping

## Custom Type Mapping (MapType)

### v3.2.701 Custom Type Conversion

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
    // Custom DateTimeOffset
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

### Using MapType Enum -> string/int etc.:

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
public enum ToStringMapEnum { Chinese, abc, HongKong }
```

There should be no need for further explanation.

`BigInteger` can also be mapped, but please note: it is only for CURD convenience; operations like +, -, *, / are not supported.

In version v0.9.15, you can map value objects as `typeof(string)` by installing the extension package:

> dotnet add package FreeSql.Extensions.JsonMap

```csharp
fsql.UseJsonMap(); // Enable the feature

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

## Default Type Mapping

| CSharp                            | MySql                | SqlServer        | PostgreSQL    | Oracle                            | Sqlite        | Dameng          |
| --------------------------------- | -------------------- | ---------------- | ------------- | --------------------------------- | ------------- | --------------- |
| bool \| bool?                     | bit(1)               | bit              | bool          | number(1)                         | boolean       | number(1)       |
| sbyte \| sbyte?                   | tinyint(3)           | smallint         | int2          | number(4)                         | smallint      | number(4)       |
| short \| short?                   | smallint(6)          | smallint         | int2          | number(6)                         | smallint      | number(6)       |
| int \| int?                       | int(11)              | int              | int4          | number(11)                        | integer       | number(11)      |
| long \| long?                     | bigint(20)           | bigint           | int8          | number(21)                        | integer       | number(21)      |
| byte \| byte?                     | tinyint(3) unsigned  | tinyint          | int2          | number(3)                         | int2          | number(3)       |
| ushort \| ushort?                 | smallint(5) unsigned | int              | int4          | number(5)                         | unsigned      | number(5)       |
| uint \| uint?                     | int(10) unsigned     | bigint           | int8          | number(10)                        | decimal(10,0) | number(10)      |
| ulong \| ulong?                   | bigint(20) unsigned  | decimal(20,0)    | numeric(20,0) | number(20)                        | decimal(21,0) | number(20)      |
| double \| double?                 | double               | float            | float8        | float(126)                        | double        | double          |
| float \| float?                   | float                | real             | float4        | float(63)                         | float         | real            |
| decimal \| decimal?               | decimal(10,2)        | decimal(10,2)    | numeric(10,2) | number(10,2)                      | decimal(10,2) | number(10,2)    |
| Guid \| Guid?                     | char(36)             | uniqueidentifier | uuid          | char(36 CHAR)                     | character(36) | char(36)        |
| TimeSpan \| TimeSpan?             | time                 | time             | time          | interval day(2) to second(6)      | bigint        | -               |
| DateTime \| DateTime?             | datetime             | datetime         | timestamp     | timestamp(6)                      | datetime      | timestamp(6)    |
| DateTimeOffset \| DateTimeOffset? | -                    | datetimeoffset   | -             | timestamp(6) with local time zone | -             | timestamp(6)    |
| Enum \| Enum?                     | enum                 | int              | int4          | number(16)                        | mediumint     | number(16)      |
| FlagsEnum \| FlagsEnum?           | set                  | bigint           | int8          | number(32)                        | bigint        | number(32)      |
| byte[]                            | varbinary(255)       | varbinary(255)   | bytea         | blob                              | blob          | blob            |
| string                            | varchar(255)         | nvarchar(255)    | varchar(255)  | nvarchar2(255)                    | nvarchar(255) | nvarchar2(255)  |

> The above types and lengths are defaults. Column attributes DbType value can be set manually.

> For string specifying length [Column(DbType = "varchar(max)")] or [MaxLength(-1)] or [Column(StringLength = -1)], when length is -1, the mapping is as follows:

| MySql | PostgreSQL | SqlServer    | Oracle | Sqlite | Firebird        | MsAccess | Dameng | Kingbase | Shentong |
| ----- | ---------- | ------------ | ------ | ------ | --------------- | -------- | ------ | -------- | -------- |
| text  | text       | varchar(max) | nclob  | text   | blob sub_type 1 | longtext | text   | text     | text     |

> Note: Oracle nclob requires v1.3.2+ version for support; otherwise, it maps to nvarchar2(4000).

> Note: MySql [MaxLength(-2)] or [Column(StringLength = -2)] maps to longtext; other databases have the same mapping rules as -1.

> For decimal specifying length [Column(Precision = 10, Scale = 2)]

## MySql Special Type Mapping

| CSharp               | MySql           |
| -------------------- | --------------- |
| MygisPoint           | point           |
| MygisLineString      | linestring      |
| MygisPolygon         | polygon         |
| MygisMultiPoint      | multipoint      |
| MygisMultiLineString | multilinestring |
| MygisMultiPolygon    | multipolygon    |

## MySql Considerations

If `int`, `byte` types specify `DbType="tinyint(1)"`, please note that `tinyint(1)` is by default mapped to `bool` in ado.net. You can specify `TreatTinyAsBoolean=false` in the connection string to map `tinyint(1)` to `SByte` instead of `bool`.

## PostgreSQL Special Type Mapping

| CSharp                                                              | PostgreSQL                       |
| ------------------------------------------------------------------- | -------------------------------- |
| BitArray                                                            | varbit(64)                       |
| NpgsqlPoint \| NpgsqlPoint?                                         | point                            |
| NpgsqlLine \| NpgsqlLine?                                           | line                             |
| NpgsqlLSeg \| NpgsqlLSeg?                                           | lseg                             |
| NpgsqlBox \| NpgsqlBox?                                             | box                              |
| NpgsqlPath \| NpgsqlPath?                                           | path                             |
| NpgsqlPolygon \| NpgsqlPolygon?                                     | polygon                          |
| NpgsqlCircle \| NpgsqlCircle?                                       | circle                           |
| (IPAddress Address, int Subnet) \| (IPAddress Address, int Subnet)?

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
| Array                                                               | All the above types are supported, including default types |

## RewriteSql, RereadSql

Rewrite SQL on write and rewrite SQL on read, suitable for read/write scenarios with geography types.

```csharp
[Column(DbType = "geography", 
    RewriteSql = "geography::STGeomFromText({0}, 4236)", 
    RereadSql = "{0}.STAsText()")]
public string geo { get; set; }

// Insert: INSERT INTO [ts_geocrud01]([id], [geo]) VALUES(@id_0, geography::STGeomFromText(@geo_0, 4236))

// Query: SELECT TOP 1 a.[id], a.[geo].STAsText() 
// FROM [ts_geocrud01] a 
// WHERE (a.[id] = 'c7227d5e-0bcf-4b71-8f0f-d69a552fe84e')
```

## Priority

Database import attributes > Entity attributes > FluentApi > Aop