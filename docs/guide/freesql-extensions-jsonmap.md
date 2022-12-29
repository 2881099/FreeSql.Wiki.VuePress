# JsonMap

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
