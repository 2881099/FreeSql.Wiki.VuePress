# Mysql 5.5 兼容性

## Mysql 5.5 不支持 datetime(3)，导致 codefirst 报错

二种解决办法：

1、[Column(DbType = "DATETIME")]

2、统一处理的话写个AOP

```csharp
fsql.Aop.ConfigEntityProperty += (s, e) =>
{
    if (e.Property.PropertyType == typeof(DateTime) || e.Property.PropertyType == typeof(DateTime?))
         e.ModifyResult.DbType = "DATETIME";
};
```
