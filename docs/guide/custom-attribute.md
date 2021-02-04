
# 自定义特性

本功能可实现与其他 ORM 使用一套 Attribute，避免维护两份实体特性的烦恼：

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

## 优先级

数据库特性 > 实体特性 > FluentApi（配置特性） > AOP（配置特性）
