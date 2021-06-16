# AOP✨

FreeSql AOP 已有的功能介绍，未来为会根据用户需求不断增强。
  
## 审计 CRUD

如果因为某个 sql 骚操作耗时很高，没有一个相关的审计功能，排查起来可以说无从下手。

FreeSql 支持简单的类似功能：

```csharp
fsql.Aop.CurdAfter += (s, e) => {
	if (e.ElapsedMilliseconds > 200) {
		//记录日志
		//发送短信给负责人
	}
};
```

只需要一个事件，就可以对全局起到作用。

还有一个 CurdBefore 在执行 sql 之前触发，常用于记录日志或开发调试。

## 审计属性值

实现插入/更新时统一处理某些值，比如某属性的雪花算法值、创建时间值、甚至是业务值。

```csharp
fsql.Aop.AuditValue += (s, e) => {
    if (e.Column.CsType == typeof(long) 
        && e.Property.GetCustomAttribute<SnowflakeAttribute>(false) != null
        && e.Value?.ToString() == 0)
        e.Value = new Snowflake().GetId();
};

class Order {
    [Snowflake]
    public long Id { get; set; }
    //...
}
```
> 当属性的类型是 long，并且标记了 [Snowflake]，并且当前值是 0，那么在插入/更新时它的值将设置为雪花id值。

> 说明：SnowflakeAttribute 是使用者您来定义，new Snowflake().GetId() 也是由使用者您来实现

如果命名规范，可以在 aop 里判断，if (e.Property.Name == "createtime") e.Value = DateTime.Now;

## 审计迁移脚本

FreeSql 自带迁移功能，那么迁移的 SQL 语句长啥样，你可能会好奇。

- 比如创建表时；

- 比如添加字段时；

- 比如修改表名、修改字段名时；

- 又比如字段类型更改之后时；

这些操作在 FreeSql.CodeFirst 实现下基本不需要理会，而且我们只推荐在开发环境使用自动迁移的功能，正式环境可使用其他工具替代此操作。

但我们仍然可能需要对项目做完整的日志记录。

fsql.Aop.SyncStructureBefore、fsql.Aop.SyncStructureAfter 这两个事件将排上用场。

## 自定义实体特性

比如项目内已经使用了其它 orm，如 efcore，这样意味着实体中可能存在 [Key]，但它与 FreeSql [Column(IsPrimary = true] 不同。

Q： FreeSql 实体特性为啥这么别扭？

A： 为了考虑一致性用法，全部封装在 ColumnAttribute 下，这样用户使用起来，不用到处 using 或者 回忆特性应该用哪个名字，如自增 [Column(IsIdentity = true)] 即可。

FreeSql 提供 AOP 自定义特性功能，实现与多个 orm 共同拥有一套实体特性，可避免重复定义特性。

> v1.4.0+ 已自动识别 EFCore 实体特性 Key/Required/NotMapped/MaxLength/StringLength/DatabaseGenerated/Table/Column

```csharp
fsql.Aop.ConfigEntity += (s, e) => {
  var attr = e.EntityType.GetCustomAttributes(typeof(MyTableAttribute), false).FirstOrDefault() as MyTableAttribute;
  if (attr != null)
    e.ModifyResult.Name = attr.Name; //表名
};
fsql.Aop.ConfigEntityProperty += (s, e) => {
  var attr = e.Property.GetCustomAttributes(typeof(MyColumnAttribute), false).FirstOrDefault() as MyColumnAttribute;
  if (attr != null)
    e.ModifyResult.Name = attr.Name; //字段名
};

[MyTable("xxx")]
class YourEntity {
  [MyColumn("id")]
  public int pkid { get; set; }
}

class MyTableAttribute : Attribute {
  public string Name { get; }
  public MyTableAttribute(string name)
  {
    this.Name = name;
  }
}
class MyColumnAttribute : Attribute {
  public string Name { get; }
  public MyColumnAttribute(string name)
  {
    this.Name = name;
  }
}
```

## Ado.net 读取拦截

```csharp
fsql.Aop.AuditDataReader += (_, e) =>
{
    if (e.DataReader.GetFieldType(e.Index) == typeof(string) && 
      e.Value == DBNull.Value)
        e.Value = "";
};
```

## 表达式拦截

FreeSql 支持的表达式非常丰富，对各大数据库的兼容度也做得很好。

> 有关表达式支持的程度，可参阅：[表达式函数](expression-function.md)

即便如此丰富，也仍然无法满足用户需求，FreeSql 对外开放了自定义表达式解析接口：

```csharp
fsql.Aop.ParseExpression += (s, e) => {
    if (e.Expression.NodeType == Call && e.Expression.Name == "get_Item")
        e.Result = "1111";
};
```

这个解析有点复杂，当 `e.Expression` 很复杂的时候，我们还提供了 `e.FreeParse` 方法，使用它相当于调用 `FreeSql` 内置表达式解析引擎，辅助您进行解析。
