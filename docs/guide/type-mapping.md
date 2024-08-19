# 类型映射

## 类型映射（默认）

> 提示：因排版问题，不显示所有支持的数据库

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

> string 指定长度 [Column(DbType = "varchar(max)")] 或者 [MaxLength(-1)] 或者 [Column(StringLength = -1)]，当长度 -1 时产生的映射如下：

| MySql | PostgreSQL | SqlServer    | Oracle | Sqlite | Firebird        | DuckDB   | MsAccess | 达梦 | 金仓 |
| ----- | ---------- | ------------ | ------ | ------ | --------------- | -------- | -------- | ---- | ---- |
| text  | text       | varchar(max) | nclob  | text   | blob sub_type 1 | text     | longtext | text | text |

> 注意：MySql [MaxLength(-2)] 或者 [Column(StringLength = -2)] 映射类型 longtext

> decimal 指定长度 [Column(Precision = 10, Scale = 2)]

## MapType

使用 MapType 枚举 -> string/int 等等如下：

```csharp
class Table
{
    public int id { get; set; }

    [Column(MapType = typeof(string))]
    public PeopleType t1 { get; set; }

    [Column(MapType = typeof(int))]
    public PeopleType t2 { get; set; }

    [Column(MapType = typeof(string))]
    public BigInteger t3 { get; set; }
}
public enum PeopleType { 中国人, abc, 香港 }
```

## Json

> dotnet add package FreeSql.Extensions.JsonMap

```csharp
fsql.UseJsonMap(); //开启功能

class Table
{
    public int Id { get; set; }

    [JsonMap, Column(DbType = "json")]
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

## TypeHandlers（自定义）

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

## 类型映射（特别）

FreeSql.Provider.MySql/MySqlConnector：

| csharp               | MySql           |
| -------------------- | --------------- |
| MygisPoint           | point           |
| MygisLineString      | linestring      |
| MygisPolygon         | polygon         |
| MygisMultiPoint      | multipoint      |
| MygisMultiLineString | multilinestring |
| MygisMultiPolygon    | multipolygon    |

> MySql 如果 ``int、byte``类型，指定了 ``DbType="tinyint(1)"``,请注意，``tinyint(1)``在ado.net中默认将此值映射为``bool``类型，可在链接串中指定``TreatTinyAsBoolean=false``,使映射 ``tinyint(1) ``为 ``SByte`` 而非 ``bool``。

FreeSql.Provider.PostgreSQL：

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

## 重写、重读

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
