# AOP✨

FreeSql AOP 已有的功能介绍，未来为会根据用户需求不断增强。

## 审计命令(如何监视 SQL？)

如果因为某个 sql 骚操作耗时很高，没有一个相关的审计功能，排查起来可以说无从下手

fsql.Aop.CommandBefore、fsql.Aop.CommandAfter 这两个事件触发所有 SQL 命令的执行前、和执行后。

执行后的事件会附带异常信息、耗时信息等。

建议在开发模式下开启无参数化模式，new FreeSqlBuilder().UseNoneCommandParameter(true)。

> 提示：new FreeSqlBuilder().UseMonitorCommand 也可以审计命令执行前后。

```csharp
fsql.Aop.CommandBefore += (s, e) =>
{
    //e.Command.CommandText = null; 可拦截命令
};

fsql.Aop.CommandAfter += (s, e) =>
{
    if (e.Exception != null)
    {
        //做一些日志记录的操作。以下为示例。
        Trace.WriteLine($"Message:{e.Exception.Message }\r\nStackTrace:{e.Exception.StackTrace}\r\nCommandText:{e.Command.CommandText}");
    }
};
```

## 审计属性值

实现插入/更新时统一处理某些值，比如某属性的雪花算法值、创建时间值、甚至是业务值。

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

当属性的类型是 long，并且标记了 [Snowflake]，并且当前值是 0，那么在插入/更新时它的值将设置为雪花 id 值。

> 说明：SnowflakeAttribute 是使用者您来定义，new Snowflake().GetId() 也是由使用者您来实现

如果命名规范，可以在 aop 里判断，`if (e.Property.Name == "createtime") e.Value = DateTime.Now;`

> v3.2.666 可设置 e.ObjectAuditBreak = true 中断对象审计，变相实现每个对象只触发一次 AuditValue 事件

## 审计迁移脚本

FreeSql 自带迁移功能，那么迁移的 SQL 语句长啥样，你可能会好奇。

- 比如创建表时；

- 比如添加字段时；

- 比如修改表名、修改字段名时；

- 又比如字段类型更改之后时；

这些操作在 FreeSql.CodeFirst 实现下基本不需要理会，而且我们只推荐在开发环境使用自动迁移的功能，正式环境可使用其他工具替代此操作。

但我们仍然可能需要对项目做完整的日志记录。

fsql.Aop.SyncStructureBefore、fsql.Aop.SyncStructureAfter 这两个事件将排上用场。

## ConfigEntity

### 统一设置架构名

提前设置 FreeSqlBuilder AOP 优先级：

UseMappingPriority(MappingPriorityType.Attribute, MappingPriorityType.FluentApi, MappingPriorityType.Aop)

```csharp

fsql.Aop.ConfigEntity += (s, e) =>
{
    e.ModifyResult.Name = "public." + e.ModifyResult.Name;
    //提示：可以利用 AsyncLocal 动态设置表名 v3.2.833
};
```

### MySql Enum 映射

默认情况 c# 枚举会映射为 MySql Enum 类型，如果想映射为 int 在 FreeSqlBuilder Build 之后执行以下 Aop 统一处理：

```csharp
fsql.Aop.ConfigEntityProperty += (s, e) =>
{
    if (e.Property.PropertyType.IsEnum)
        e.ModifyResult.MapType = typeof(int);
};
```

### 修改 decimal 默认特性

因为默认 decimal 只支持 decimal(10,2)，范围太小，我们可以全局修改 decimal 类型的支持范围，比如支持 decimal(18,6)

```csharp
fsql1.Aop.ConfigEntityProperty += (s, e) =>
{
    if (e.Property.PropertyType == typeof(decimal)|| e.Property.PropertyType == typeof(decimal?))
    {
       e.ModifyResult.Precision = 18;
       e.ModifyResult.Scale = 6;
    }
};
```

### 自定义实体特性

比如项目内已经使用了其它 orm，如 efcore，这样意味着实体中可能存在 [Key]，但它与 FreeSql [Column(IsPrimary = true] 不同。

Q： FreeSql 实体特性为啥这么别扭？

A： 为了考虑一致性用法，全部封装在 ColumnAttribute 下，这样用户使用起来，不用到处 using 或者 回忆特性应该用哪个名字，如自增 [Column(IsIdentity = true)] 即可。

FreeSql 提供 AOP 自定义特性功能，实现与多个 orm 共同拥有一套实体特性，可避免重复定义特性。

> v1.4.0+ 已自动识别 EFCore 实体特性 Key/Required/NotMapped/MaxLength/StringLength/DatabaseGenerated/Table/Column

```csharp
fsql.Aop.ConfigEntity += (s, e) =>
{
    var attr = e.EntityType.GetCustomAttributes(typeof(MyTableAttribute), false).FirstOrDefault() as MyTableAttribute;
    if (attr != null)
        e.ModifyResult.Name = attr.Name; //表名
};
fsql.Aop.ConfigEntityProperty += (s, e) =>
{
    var attr = e.Property.GetCustomAttributes(typeof(MyColumnAttribute), false).FirstOrDefault() as MyColumnAttribute;
    if (attr != null)
        e.ModifyResult.Name = attr.Name; //字段名
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

## Ado .net 读取拦截

```csharp
fsql.Aop.AuditDataReader += (_, e) =>
{
    if (e.DataReader.GetFieldType(e.Index) == typeof(string) &&
        e.Value == DBNull.Value)
            e.Value = "";
};
```

## 表达式拦截

FreeSql 内部表达式支持非常丰富，对各大数据库的兼容度也做得很好。

> 有关表达式支持的程度，可参阅：[表达式函数](expression-function.md)

即便如此丰富，也仍然无法满足用户需求，FreeSql 对外开放了自定义表达式解析接口：

```csharp
fsql.Aop.ParseExpression += (s, e) =>
{
    if (e.Expression.NodeType == Call && e.Expression.Name == "get_Item")
        e.Result = "1111";
};
```

这个解析有点复杂，当 `e.Expression` 很复杂的时候，我们还提供了 `e.FreeParse` 方法，使用它相当于调用 `FreeSql` 内置表达式解析引擎，辅助您进行解析。

## 自定义全局类型转换

框架中，除基础类型以外可以使用 `TypeHandlers` 添加转换器，一个具体的类对应一个转换器。

现在假定你有个BT需求：把数据库中的 `'A10'` 转换成 枚举的 TestType.A(int值10)

- 在 EF 中，框架遍历所有实体，在ctx创建时根据具体的 Enum 类型添加转换器。
- 在 FreeSql 中，思路类似。ConfigEntityProperty 委托中可以获取到属性的类型，然后创建一个具体的转换器即可。

```csharp
//配置代码
freeSql.Aop.ConfigEntityProperty += (s, e) =>
{
    if(e.Property.PropertyType.IsEnum)
    {
        EnumToValueStringHandler hander = new EnumToValueStringHandler(e.Property.PropertyType);
        FreeSql.Internal.Utils.TypeHandlers.TryAdd(hander.ModelType, hander);
    }
};

//转换器代码
public class EnumToValueStringHandler : ITypeHandler
{
    //ModelType这里使用 ModelType 来表达最后Handler针对那个Type进行处理
    private readonly Type enumType;
    Type ITypeHandler.Type { get => this.enumType; }
    public Type ModelType { get => this.enumType; }

    //构造函数上传递具体的 type 信息，就能针对具体的枚举执行转换了
    //你也可以根据你的需要替换为另一个Type类
    public EnumToValueStringHandler(Type enumType)
    {
        this.enumType = enumType;
    }

    // xxEnum -> string 附加A
    object ITypeHandler.Serialize(object value)
    {
        return "A" + ((TestType)value).ToString("D");
    }

    // string -> xxEnum 去掉A
    object ITypeHandler.Deserialize(object value)
    {
        return Enum.Parse<TestType>(((string)value).Replace("A", ""));
    }
}
```

核心思路是 `ITypeHandler.Type` 变成变量，可以从外部传递。额外有些问题要注意：

1. 所有的 "xxxEnum" 都会执行这个转换，如果有多个数据库多种格式，需要在 `Handler` 中处理
2. 实体类超级多，枚举属性超级多时，**可能影响性能** 。确实很多时建议不在实体类上修改，可以通过部分类(partial class)，新加一个属性去处理。(属性设置为Ignore,在getter、setter中执行转换)
