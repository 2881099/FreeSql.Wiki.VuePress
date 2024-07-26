# CodeFirst

`FreeSql` supports migrating structures to the database using `CodeFirst`, which is a standard feature for (`O/RM`).

Unlike other (`O/RM`) frameworks, `FreeSql` supports more database features beyond basic data types. This is both an advantage and a disadvantage: the advantage is the full utilization of database features to aid development, while the disadvantage is that switching databases becomes more challenging. Different programmers might have varying philosophies; `FreeSql` tries to push feature support to its limits, but whether to use it is another matter for the project team to assess.

Although adapting to multiple databases is complex, `FreeSql` adheres to the principle of optimizing development habits, implementing solutions to challenges that are not technically feasible, such as custom database types which conflict with entity classes. To reduce usage costs, such database features are not supported.

```csharp
IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    .UseAutoSyncStructure(true) // Automatically sync entity structures [essential for development environment]. FreeSql will not scan assemblies; tables are only created during CRUD operations.
    .UseMonitorCommand(cmd => Console.Write(cmd.CommandText))
    .Build(); // Please define this as a Singleton
```

## Migrating Structures

| Create Database | Sqlite | Sql Server                                                                                                                         | MySql                                                                                                                              | PostgreSQL                                                                                                                        | Oracle |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
|                 | √      | X [Reference](https://github.com/luoyunchong/lin-cms-dotnetcore/blob/master/src/LinCms.Infrastructure/FreeSql/FreeSqlExtension.cs#L153) | X [Reference](https://github.com/luoyunchong/lin-cms-dotnetcore/blob/master/src/LinCms.Infrastructure/FreeSql/FreeSqlExtension.cs#L129) | X[Reference](https://github.com/luoyunchong/lin-cms-dotnetcore/blob/master/src/LinCms.Infrastructure/FreeSql/FreeSqlExtension.cs#L233) | X      |

| Entity & Table Comparison | Add | Rename | Delete |
| ------------------------- | --- | ------ | ------ |
|                         | √   | √      | X      |

| Entity Property & Field Comparison | Add | Modify Nullable | Modify Auto-Increment | Modify Type | Rename | Delete | Notes |
| --------------------------------- | --- | --------------- | --------------------- | ----------- | ------ | ------ | ----- |
|                                   | √   | √               | √                     | √           | √      | X      | √     |

> To ensure safety, field deletion is not provided.

Warning: Incomplete mapping between entity class properties and database table fields may lead to data loss.

> Reason: Some migration comparison operations involve creating temporary tables, importing old table data, and deleting old tables.

### FreeSql Provides Two CodeFirst Migration Methods: Automatic and Manual.

**Note**: Exercise caution when using this feature in production environments.

**Note**: Exercise caution when using this feature in production environments.

**Note**: Exercise caution when using this feature in production environments.

### Automatically Sync Entity Structure [Essential for Development Environment]

Automatically synchronize entity structures to the database. The program checks if the entity tables exist during runtime and then performs migration to create or modify them.

```csharp
fsql.CodeFirst.IsAutoSyncDataStructure = true;
```

> This feature is enabled by default. Please modify this setting after deploying to the production environment.

> Although the [automatic synchronization of entity structures] feature is very useful during development, it can clutter the database with unnecessary fields. Try to control changes in entity or property names to minimize this issue.

- Note: Table structures are automatically generated only when CURD operations are performed on the table. For migrating table structures during system runtime, use the **SyncStructure** method.
- `FreeSql` does not create the database for you; you need to create the database manually. **If you are using `MySql`, `Sql Server`, or `PostgreSQL`, and need to automatically create databases, refer to this code and copy it yourself: [FreeSqlExtension.cs](https://github.com/luoyunchong/lin-cms-dotnetcore/blob/master/src/LinCms.Infrastructure/FreeSql/FreeSqlExtension.cs)**

### Disabling Migration

When the [entity class] corresponds to a database [view] or other objects, you can disable the specified entity migration operation by using [Table(DisableSyncStructure = true)].

```csharp
[Table(DisableSyncStructure = true)]
class ModelDisableSyncStructure {
    [Column(IsPrimary = false)]
    public int pkid { get; set; }
}
```

## Notes

FreeSql CodeFirst supports migrating C# code comments to database comments. Prerequisites:

1. The assembly containing the entity class must have XML documentation enabled;
2. The XML file must be in the same directory as the assembly and named: xxx.dll -> xxx.xml;

> Version 1.5.0+ added support for the Description attribute, with a lower priority than C# code comments.

### Manual Synchronization of Entity Structure

Provides an interface method to compare entities with changes in the database, returning SQL statements.

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

Provides an interface method to synchronize structure

```csharp
fsql.CodeFirst.SyncStructure<Topic>();
// Sync entity types to the database
```

#### Bulk Table Structure Generation

- `void SyncStructure(params Type[])` overloaded method supports arrays, synchronizing a collection of entity types to the database.
- IEntity class can be any class in the assembly where the entity class is located.

Method 1: Scan the assembly where the IEntity class is located and reflect to find all classes with the TableAttribute feature tag. This method requires the entity class to have a [Table(Name = "xxx")] attribute.

```csharp
public static Type[] GetTypesByTableAttribute()
{
    List<Type> tableAssembies = new List<Type>();
    foreach (Type type in Assembly.GetAssembly(typeof(IEntity)).GetExportedTypes())
        foreach (Attribute attribute in type.GetCustomAttributes())
            if (attribute is TableAttribute tableAttribute)
                if (tableAttribute.DisableSyncStructure == false)
                    tableAssembies.Add(type);

    return tableAssembies.ToArray();
}
```

Call

```csharp
fsql.CodeFirst.SyncStructure(GetTypesByTableAttribute());
```

Method 2: Obtain all entity classes to be created through namespaces. Adjust the namespace values in `entitiesFullName` as needed. For example, we create an Entities folder to store entity classes. This method filters all entity classes in the assembly where IEntity is located. Their namespaces all start with LinCms.Entities and are checked using StartsWith.

```csharp
public static Type[] GetTypesByNameSpace()
{
    List<Type> tableAssembies = new List<Type>();
    List<string> entitiesFullName = new List<string>()
    {
        "LinCms.Entities.Settings",
        "LinCms.Entities.Base",
    };
    foreach (Type type in Assembly.GetAssembly(typeof(IEntity)).GetExportedTypes())
        foreach (var fullname in entitiesFullName)
            if (type.FullName.StartsWith(fullname) && type.IsClass)
                tableAssembies.Add(type);

    return tableAssembies.ToArray();
}
```

Or call to synchronize all table structures

```csharp
fsql.CodeFirst.SyncStructure(GetTypesByNameSpace());
```

## Entity Attributes

Specify the table name for the entity. When specified, changes in the entity class name do not affect the corresponding database table. FreeSql tries to support multiple databases or schema naming, but specifying the table name as: other database.table name varies between databases; this will be explained in detail later.

```csharp
[Table(Name = "db2.tb_topic111")]
class Topic {
  //...
}
```

Without specifying the entity table name, it defaults to the entity class name. For old table names in the database, when modifying the entity name, set this parameter to the previous value so CodeFirst can correctly modify the database table; otherwise, it will be treated as [creating a new table].

```csharp
[Table(OldName = "Topic")]
class Topic2 {
  //...
}
```

```sql
ALTER TABLE `cccddd`.`Topic` RENAME TO `cccddd`.`Topic2`;
```

To modify field types, change the Title type to varchar(128).

```csharp
[Column(DbType = "varchar(128)")]
public string Title { get; set; }
```

```sql
ALTER TABLE `cccddd`.`Topic2` MODIFY `Title` VARCHAR(128);
```

To specify the field name for a property, modifying the property name does not affect the corresponding database column.

```csharp
[Column(Name = "titl2")]
public string Title { get; set; }
```

If no field name is specified for a property, the field name defaults to the property name. When specifying the old column name in the database, if the entity property name is modified, set this parameter to the previous value so that CodeFirst can correctly modify the database field; otherwise, it will be treated as [adding a new field].

```csharp
[Column(OldName = "Title2")]
public string Title { get; set; }
```

```sql
ALTER TABLE `cccddd`.`Topic2` CHANGE COLUMN `Title2` `Title` VARCHAR(255);
```
