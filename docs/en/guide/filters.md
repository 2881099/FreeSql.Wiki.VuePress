# Global Filters

The IFreeSql base layer implements global filter functionality for `Select/Update/Delete`, which appends these settings to the SQL WHERE clauses executed.

```csharp
public static AsyncLocal<int> TenantId { get; set; } = new AsyncLocal<int>();

fsql.GlobalFilter
    .Apply<ITenant>("test1", a => a.TenantId == TenantId.Value)
    .Apply<AuthorTest>("test2", a => a.Name == "11")

    .ApplyOnly<AuthorTest>("test3", a => a.Name == "11")
    // ApplyOnly sets filters for a specific type only

    .ApplyIf<TestAddEnum>("test4", () => TenantId.Value != 0, a => a.Id == TenantId.Value);
    // ApplyIf filters apply only if the delegate's return value (second parameter) is true

    .Apply<ITenant>("test5", a => a.TenantId == TenantId.Value, before: true)
    // v3.2.700 added before to place the condition at the beginning of the WHERE clause
```

The `Apply` generic parameter can be set to any type, and filtering will be attempted when using `Select/Update/Delete` methods:

- For successful matches, additional WHERE conditions will be appended.
- For failed matches, the type will be marked to prevent future matches, avoiding performance loss.

`ApplyOnly` specifies that the filter should only apply to a particular type.

## How to Disable?

```csharp
fsql.Select<TestAddEnum>().ToList(); // All filters applied
fsql.Select<TestAddEnum>().DisableGlobalFilter("test1").ToList(); // Disable filter "test1"
fsql.Select<TestAddEnum>().DisableGlobalFilter().ToList(); // Disable all filters
```

The `fsql.Update/Delete` methods behave similarly.

## Tenant Fields (Dynamic Values)

Please refer to the documentation: [【Multi-Tenancy - Distinguish by Tenant Field】](multi-tenancy.md#approach-1-tenant-field-differentiation)
