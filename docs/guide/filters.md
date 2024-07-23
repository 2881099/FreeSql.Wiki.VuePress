# 过滤器

IFreeSql 基础层实现了 Select/Update/Delete 可设置的全局过滤器功能。

```csharp
public static AsyncLocal<Guid> TenantId { get; set; } = new AsyncLocal<Guid>();

fsql.GlobalFilter
    .Apply<ITenant>("test1", a => a.TenantId == TenantId.Value)
    .Apply<AuthorTest>("test2", a => a.Name == "11")
    
    .ApplyOnly<AuthorTest>("test3", a => a.Name == "11")
    //指定类型精准设置

    .ApplyIf<TestAddEnum>("test4", () => TenantId.Value != Guid.Empty, a => a.Id == TenantId.Value);
    //1.9.0 ApplyIf 委托的返回值(第二个参数) true 才生效

    .Apply<ITenant>("test5", a => a.TenantId == TenantId.Value, before: true)
    //v3.2.700 增加 before 将条件放在 where 最前面
```

Apply 泛型参数可以设置为任何类型，当使用 Select/Update/Delete 方法时会进行过滤器匹配尝试（try catch）：

- 匹配成功的，将附加 where 条件；
- 匹配失败的，标记下次不再匹配，避免性能损耗；

如何禁用？

```csharp
fsql.Select<TestAddEnum>().ToList(); //所有生效
fsql.Select<TestAddEnum>().DisableGlobalFilter("test1").ToList(); //禁用 test1
fsql.Select<TestAddEnum>().DisableGlobalFilter().ToList(); //禁用所有
```

fsql.Update/Delete 方法效果同上。
