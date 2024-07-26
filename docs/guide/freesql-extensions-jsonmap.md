# JsonMap

> 推荐使用 v3.2.701+ 版本新增加的[自定义类型转换器](type-mapping)

FreeSql 扩展包，将值对象映射成 `typeof(string)`，安装扩展包：

```bash
dotnet add package FreeSql.Extensions.JsonMap
```

```csharp
fsql.UseJsonMap(); //开启功能

class TestConfig
{
    public int clicks { get; set; }
    public string title { get; set; }
}

[Table(Name = "sysconfig")]
public class S_SysConfig<T>
{
    [Column(IsPrimary = true)]
    public string Name { get; set; }

    [JsonMap]
    public T Config { get; set; }
}
```

## 注意事项

[JsonMap]不能标记在 <b>T</b> 为string类型的实体上，否则会在特定情况下导致系统内所有标记了[Column(MapType=typeof(string)]的字段引发类型转换错误

```
ExpressionTree 转换类型错误，值(Success)，类型(TEnum)，目标类型(System.String)，Unable to cast object of type 'TEnum' to type 'System.String'.
```

## [推荐]自定义类型转换

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
```
