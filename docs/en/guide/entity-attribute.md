# Mapping Attributes✨

v1.4.0+ automatically recognizes EF attributes such as

Key/Required/NotMapped/MaxLength/StringLength/DatabaseGenerated/Table/Column.

## Table Name

```csharp
[Table(Name = "tb_topic")]
class Topic { }
```

Architecture: `[Table(Name = "dbo.tb_topic")]`

Note: For table names with dots, use `[Table(Name = "`sys.config`")]` to resolve.

Methods for table name mapping, from lowest to highest priority:

- 1. Entity class name
- 2. Aop `fsql.Aop.ConfigEntity += (_, e) => e.ModifyResult.Name = "public.tabname"`
- 3. Fluent API `fsql.CodeFirst.ConfigEntity(a => a.Name("public.tabname"))`
- 4. `[Table(Name = "public.tabname")]`
- 5. `AsTable` `fsql.Select<T>().AsTable((_, old) => "public.tabname").ToList()`

> v3.2.660 allows adjusting priority with `UseMappingPriority`.

Property: `[Column(Name = "xxx")]`

## Primary Key

```csharp
class Topic
{
    [Column(IsPrimary = true)]
    public int Id { get; set; }
}
```

- If no primary key is specified, a field named `id` will be treated as the primary key (case insensitive).
- When the primary key is of type Guid, a value will be automatically created (ordered, unique) upon insertion, so you don't need to assign it yourself (supports distributed systems).

> Composite primary keys use attributes on multiple properties.

> For Oracle, if the primary key name length exceeds 30, use `[OraclePrimaryKeyName(name)]`.

## Auto-Increment (Identity)

```csharp
class Topic
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
}
```

- If no primary key is specified, the auto-incremented member will be used as the primary key.
- For DbFirst mode sequences: `[Column(IsIdentity = true, InsertValueSql = "seqname.nextval")]`

## Unique Key, Index

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

- The third parameter `true` indicates a unique key, while `false` indicates a regular index.
- For sharding scenarios: `[Index("{tablename}_idx_01", "phone")]`

## Database Type (DbType)

Note: Generally, use .NET common types (e.g., int/string/DateTime) for mapping. There is no need to set `DbType` explicitly.

```csharp
class Topic
{
    [Column(DbType = "varchar(128) NOT NULL default....")]
    public string Title { get; set; }
}
```

You can specify `NOT NULL` directly on the type or use `[Column(IsNullable = false)]`.

### Decimal Precision

```csharp
class Topic
{
    [Column(Precision = 10, Scale = 2)]
    public decimal Amount { get; set; }
}
```

### String Length

```csharp
class Topic
{
    [Column(StringLength = 128)]
    // Or [MaxLength(128)]
    public string Title { get; set; }
}
```

When the length is -1, the mapping is as follows:

| MySql | PostgreSQL | SqlServer     | Oracle | Sqlite | Firebird        | DuckDB | MsAccess | DM   | Kingbase | Shentong | Gbase |
| ----- | ---------- | ------------- | ------ | ------ | --------------- | ------ | -------- | ---- | -------- | -------- | ----- |
| text  | text       | nvarchar(max) | nclob  | text   | blob sub_type 1 | text   | longtext | text | text     | text     | text  |

> Note: MySql `[MaxLength(-2)]` or `[Column(StringLength = -2)]` maps to `longtext`. Other databases follow the same mapping rules as -1.

### Nullable

```csharp
class Topic
{
    [Column(IsNullable = false)]
    public string Title { get; set; }
}
```

If `DbType` and `IsNullable` are not specified, FreeSql provides default settings, such as:

- `int` -> not null
- `int?` -> nullable

Typically, only specify `IsNullable` for `string` types (string is nullable by default).

## Server Time

```csharp
class Topic
{
    [Column(ServerTime = DateTimeKind.Utc, CanUpdate = false)]
    public DateTime CreateTime { get; set; }

    [Column(ServerTime = DateTimeKind.Utc)]
    public DateTime UpdateTime { get; set; }
}
```

When using database time to insert data:

- Setting the entity's value is ineffective upon insertion.
- The value of the entity will still be the C# time after the successful insert.

## Ignore

```csharp
class Topic
{
    [Column(IsIgnore = true)]
    public string Title { get; set; }
}
```

If the property is not mappable, `IsIgnore` does not need to be specified. For example, the following is unnecessary:

```csharp
class Topic
{
    [Column(IsIgnore = true)]
    public Topic Parent { get; set; }
}
```

## Optimistic Lock (RowVersion)

```csharp
class Topic
{
    public Guid Id { get; set; }
    public string Title { get; set; }

    [Column(IsVersion = true)]
    public int Version { get; set; }
}
```

The principle of optimistic locking is to use a field in the entity, such as `long version`. Before updating, query the data; if `version` is 1, the generated SQL will include `where version = 1`. If the modification fails (i.e., `Affrows == 0`), an exception (`DbUpdateVersionException`) is thrown.

Each entity supports only one optimistic lock property and supports `int`, `long`, `string`, `Guid`.

> Applicable to [`SetSource`](update.md#_5-setsource-entity) for updating data. Regardless of how the version value is updated, it will be incremented by 1.

## Custom Type Mapping (MapType)

Using MapType Enum -> string/int etc.:

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
public enum PeopleType { TaiWan, abc, HongKong }
```

TypeHandlers (Custom):

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
    public override void FluentApi(FluentColumn col) => col.MapType(typeof(string)).StringLength(-1);
}
class DateOnlyTypeHandler : TypeHandler<DateOnly>
{
    public override object Serialize(DateOnly value) => value.ToString("yyyy-MM-dd");
    public override DateOnly Deserialize(object value) => DateOnly.TryParse(string.Concat(value), out var trydo) ? trydo : DateOnly.MinValue;
    public override void FluentApi(FluentColumn col) => col.MapType(typeof(string)).StringLength(12);
}
class DateTimeOffsetTypeHandler : TypeHandler<DateTimeOffset>
{
    public override object Serialize(DateTimeOffset value) => value.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
    public override DateTimeOffset Deserialize(object value) => DateTimeOffset.TryParse((string)value, out var dts) ? dts : DateTimeOffset.MinValue;
    public override void FluentApi(FluentColumn col) => col.MapType(typeof(string)).DbType("datetime");
}
```

JsonMap:

> dotnet add package FreeSql.Extensions.JsonMap

```csharp
fsql.UseJsonMap(); //Open

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

## Field Position

Applicable scenario: When inheriting entity classes, the order of fields created by CodeFirst might not be desired. Use this attribute to set the order.

Specify field positions when creating tables, e.g., `[Column(Position = 1)]`, negative values are for reverse positions.

## CanInsert, CanUpdate

Indicates whether the field can be inserted or updated, default is `true`. If set to `false`, the field will be ignored during insert or update operations.

When specifying methods like `InsertColumn`/`UpdateColumns`, this attribute may become ineffective.

## InsertValueSql

Use this value when executing the Insert method; its syntax is SQL.

Note: For functions like `getdate()`, consider using `ServerTime` as it is adapted for all databases.

```csharp
class Topic
{
    [Column(InsertValueSql = "'xxx'")]
    public string Name { get; set; }
}

fsql.Insert(new Type()).ExecuteAffrows();
// INSERT INTO `type`(`Name`) VALUES('xxx')

// v3.2.700 Ignore InsertValueSql
fsql.Insert(new Type()).IgnoreInsertValueSql(a => a.Name).ExecuteAffrows();
// INSERT INTO `type`(`Name`) VALUES('')
```

## RewriteSql, RereadSql

Rewrite SQL for insertion and read SQL for querying. For example, handling geography type read and write scenarios:

```csharp
class Topic
{
    [Column(DbType = "geography",
        RewriteSql = "geography::STGeomFromText({0}, 4236)",
        RereadSql = "{0}.STAsText()")]
    public string Geo { get; set; }
}
// Insert: INSERT INTO [ts_geocrud01]([id], [geo])
// VALUES(@id_0, geography::STGeomFromText(@geo_0, 4236))

// Query: SELECT TOP 1 a.[id], a.[geo].STAsText()
// FROM [ts_geocrud01] a
// WHERE (a.[id] = 'c7227d5e-0bcf-4b71-8f0f-d69a552fe84e')
```

## Disable Migration

`fsql.CodeFirst.IsAutoSyncStructure` sets global automatic structure migration, or use `FreeSqlBuilder.UseAutoSyncStructure(true)` when creating `IFreeSql`.

When an [entity class] corresponds to a database [view] or other objects, you can disable migration for specific entities.

```csharp
[Table(DisableSyncStructure = true)]
class Topic2
{
    [Column(IsPrimary = false)]
    public int Id { get; set; }
}
```

## Database Comments

FreeSql CodeFirst supports migrating C# code comments to database comments. Prerequisites:

1. The assembly containing the entity classes must have XML documentation enabled.
2. The XML file must be in the same directory as the assembly, with the file name: `xxx.dll` -> `xxx.xml`.

> v1.5.0+ versions add support for parsing `[Description("xxx")]` attributes, with a lower priority than C# code comments.
