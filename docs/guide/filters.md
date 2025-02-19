# 过滤器

IFreeSql 基础层实现了 Select/Update/Delete 可设置的全局过滤器功能，这些设置将追加到执行的 SQL WHERE 语句中。

```csharp
public static AsyncLocal<int> TenantId { get; set; } = new AsyncLocal<int>();

fsql.GlobalFilter
    .Apply<ITenant>("test1", a => a.TenantId == TenantId.Value)
    .Apply<AuthorTest>("test2", a => a.Name == "11")

    .ApplyOnly<AuthorTest>("test3", a => a.Name == "11")
    //指定类型精准设置

    .ApplyIf<TestAddEnum>("test4", () => TenantId.Value != 0, a => a.Id == TenantId.Value);
    //1.9.0 ApplyIf 委托的返回值(第二个参数) true 才生效

    .Apply<ITenant>("test5", a => a.TenantId == TenantId.Value, before: true)
    //v3.2.700 增加 before 将条件放在 where 最前面
```

Apply 泛型参数可以设置为任何类型，当使用 Select/Update/Delete 方法时会进行过滤器匹配尝试（try catch）：

- 匹配成功的，将附加 where 条件；
- 匹配失败的，标记下次不再匹配，避免性能损耗；

ApplyOnly 泛型参数指定一个类型生效。

## 如何禁用？

```csharp
fsql.Select<TestAddEnum>().ToList(); //所有生效
fsql.Select<TestAddEnum>().DisableGlobalFilter("test1").ToList(); //禁用 test1
fsql.Select<TestAddEnum>().DisableGlobalFilter().ToList(); //禁用所有
```

fsql.Update/Delete 方法效果同上。

## 租户字段（动态值）

请移步文档：[【多租户 - 按租户字段区分】](multi-tenancy.md#%E6%96%B9%E6%A1%88%E4%B8%80-%E6%8C%89%E7%A7%9F%E6%88%B7%E5%AD%97%E6%AE%B5%E5%8C%BA%E5%88%86)
