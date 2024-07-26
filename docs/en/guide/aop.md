# Aop ✨

FreeSql AOP introduces existing features and will continue to enhance them based on user needs in the future.

## Audit Commands (How to Monitor SQL?)

If a SQL operation is taking a long time and there is no related auditing feature, it can be challenging to troubleshoot.

The `fsql.Aop.CommandBefore` and `fsql.Aop.CommandAfter` events trigger before and after the execution of all SQL commands, respectively.

The post-execution event will include exception information, execution time, and other details.

It is recommended to enable the non-parameterized mode in development mode using `new FreeSqlBuilder().UseNoneCommandParameter(true)`.

> Tip: `new FreeSqlBuilder().UseMonitorCommand` can also audit command execution before and after.

```csharp
fsql.Aop.CommandBefore += (s, e) => 
{
    // e.Command.CommandText = null; can intercept the command
};

fsql.Aop.CommandAfter += (s, e) =>
{
    if (e.Exception != null)
    {
        // Perform some logging. The following is an example.
        Trace.WriteLine($"Message:{e.Exception.Message}\r\nStackTrace:{e.Exception.StackTrace}\r\nCommandText:{e.Command.CommandText}");
    }
};
```

## Audit Property Values

Handle certain values uniformly during insert/update, such as a snowflake algorithm value, creation time value, or even business values.

```csharp
fsql.Aop.AuditValue += (s, e) =>
{
    if (e.Column.CsType == typeof(long) &&
        e.Property.GetCustomAttribute<SnowflakeAttribute>(false) != null &&
        e.Value?.ToString() == "0")
        e.Value = new Snowflake().GetId();
};

class Order {
    [Snowflake]
    public long Id { get; set; }
    //...
}
```

When the property's type is `long`, and it is marked with `[Snowflake]`, and the current value is `0`, its value will be set to a snowflake ID during insert/update.

> Note: `SnowflakeAttribute` is defined by you, and `new Snowflake().GetId()` should also be implemented by you.

If naming conventions are followed, you can check in the AOP, `if (e.Property.Name == "createtime") e.Value = DateTime.Now;`

> v3.2.666 allows setting `e.ObjectAuditBreak = true` to interrupt object auditing, effectively ensuring each object triggers the `AuditValue` event only once.

## Audit Migration Scripts

FreeSql comes with migration features, so you might be curious about what migration SQL statements look like.

- For example, when creating a table;
- For example, when adding fields;
- For example, when renaming tables or fields;
- And also when changing field types;

These operations are largely abstracted under `FreeSql.CodeFirst`, and we recommend using automated migration features only in development environments; in production, use other tools instead.

However, you might still need to keep complete logs for the project.

The `fsql.Aop.SyncStructureBefore` and `fsql.Aop.SyncStructureAfter` events will be useful here.

## ConfigEntity

### Unified Configuration Architecture

```csharp
// Set FreeSqlBuilder AOP priority in advance
// UseMappingPriority(MappingPriorityType.Attribute, MappingPriorityType.FluentApi, MappingPriorityType.Aop)

fsql.Aop.ConfigEntity += (s, e) => {
    e.ModifyResult.Name = "public." + e.ModifyResult.Name;
    // Tip: You can use AsyncLocal to dynamically set table names v3.2.833
};
```

### MySql Enum Mapping

By default, C# enums will be mapped to MySql Enum types. If you want to map them to `int`, execute the following AOP configuration after `FreeSqlBuilder Build`:

```csharp
fsql.Aop.ConfigEntityProperty += (s, e) => {
    if (e.Property.PropertyType.IsEnum)
        e.ModifyResult.MapType = typeof(int);
};
```

### Modify Decimal Default Properties

By default, `decimal` only supports `decimal(10,2)`, which has too small a range. We can globally modify the supported range for `decimal` types, for example, to support `decimal(18,6)`.

```csharp
fsql1.Aop.ConfigEntityProperty += (s, e) =>
{
    if (e.Property.PropertyType == typeof(decimal) || e.Property.PropertyType == typeof(decimal?))
    {
       e.ModifyResult.Precision = 18;
       e.ModifyResult.Scale = 6;
    }
};
```

### Custom Entity Attributes

For example, if the project already uses another ORM like EFCore, it means the entity might contain `[Key]`, which is different from FreeSql's `[Column(IsPrimary = true)]`.

Q: Why are FreeSql entity attributes so awkward?

A: To ensure consistency, all are encapsulated under `ColumnAttribute`, so users don’t need to remember which attribute name to use, e.g., auto-increment `[Column(IsIdentity = true)]`.

FreeSql provides AOP custom attribute functionality to implement a unified set of entity attributes with multiple ORMs, avoiding repetitive definitions of attributes.

> v1.4.0+ automatically recognizes EFCore entity attributes `Key/Required/NotMapped/MaxLength/StringLength/DatabaseGenerated/Table/Column`.

```csharp
fsql.Aop.ConfigEntity += (s, e) =>
{
    var attr = e.EntityType.GetCustomAttributes(typeof(MyTableAttribute), false).FirstOrDefault() as MyTableAttribute;
    if (attr != null)
        e.ModifyResult.Name = attr.Name; // Table name
};
fsql.Aop.ConfigEntityProperty += (s, e) =>
{
    var attr = e.Property.GetCustomAttributes(typeof(MyColumnAttribute), false).FirstOrDefault() as MyColumnAttribute;
    if (attr != null)
        e.ModifyResult.Name = attr.Name; // Field name
};

[MyTable("xxx")]
class YourEntity
{
    [MyColumn("id")]
    public int pkid { get; set; }
}

class MyTableAttribute : Attribute
{
    public string Name { get; }
    public MyTableAttribute(string name)
    {
      this.Name = name;
    }
}
class MyColumnAttribute : Attribute
{
    public string Name { get; }
    public MyColumnAttribute(string name)
    {
      this.Name = name;
    }
}
```

## Ado .NET Read Interception

```csharp
fsql.Aop.AuditDataReader += (_, e) =>
{
    if (e.DataReader.GetFieldType(e.Index) == typeof(string) &&
        e.Value == DBNull.Value)
            e.Value = "";
};
```

## Expression Interception

FreeSql's internal expression support is very rich and compatible with major databases.

> For details on expression support, refer to: [Expression Functions](expression-function)

Despite this richness, it may still not meet all user needs. FreeSql provides a custom expression parsing interface:

```csharp
fsql.Aop.ParseExpression += (s, e) =>
{
    if (e.Expression.NodeType == Call && e.Expression.Name == "get_Item")
        e.Result = "1111";
};
```

This parsing can be complex. When `e.Expression` is very complicated, we also provide the `e.FreeParse` method, which is equivalent to calling FreeSql’s built-in expression parsing engine to assist with parsing.

## Custom Global Type Conversions

In the framework, apart from basic types, you can use `TypeHandlers` to add converters, with one specific class corresponding to one converter.

Suppose you have a BT requirement: convert `'A10'` from the database to the enum `TestType.A` (with int value 10).

- In EF, the framework traverses all entities and adds converters based on specific Enum types when `ctx` is created.
- In FreeSql, the approach is similar. In the `ConfigEntityProperty` delegate, you can obtain the property type and then create a specific converter.

```csharp
// Configuration code
freeSql.Aop.ConfigEntityProperty += (s, e) =>
{
    if(e.Property.PropertyType.IsEnum)
    {
        EnumToValueStringHandler handler = new EnumToValueStringHandler(e.Property.PropertyType);
        FreeSql.Internal.Utils.TypeHandlers.TryAdd(handler.ModelType, handler);
    }
};

// Converter code
public class EnumToValueStringHandler : ITypeHandler
{
    // ModelType here uses ModelType to express which type the Handler is targeting
    private readonly Type enumType;
    Type ITypeHandler.Type { get => this.enumType; } 
    public Type ModelType { get => this.enumType; }

    // Constructor passes specific type information to handle the conversion
    public EnumToValueStringHandler(Type enumType)
    {
        this.enumType = enumType;
    }

    // xxEnum -> string with A prefix
    object ITypeHandler.Serialize(object value)
    {
        return "A" + ((TestType)value).ToString("D");
    }

    // string -> xxEnum by removing A prefix
    object ITypeHandler.Deserialize(object value)
    {
        return Enum.Parse<TestType>(((string)value).Replace("A", ""));
    }
}
```

The core idea is that `ITypeHandler.Type` becomes a variable that can be passed from outside. There are some additional issues to consider:

1. All "xxxEnum" values will be converted using this handler. If multiple database formats are involved, handle this in the `Handler`.
2. When there are many entity classes and numerous enum properties, performance may be impacted. In such cases, it is advisable not to modify the entity classes directly. Instead, you can use partial classes to add a new property for handling conversions. Set the property to Ignore and perform the conversion in the getter and setter.
