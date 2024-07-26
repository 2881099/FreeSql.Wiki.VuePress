# Dynamic Operations

## object CRUD

```csharp
fsql.Insert<object>().AsType(EntityType)
  .AppendData(data).ExecuteAffrows();

fsql.Update<object>().AsType(EntityType)
  .SetSource(data).ExecuteAffrows();

fsql.Delete<object>().AsType(EntityType)
  .Where(a => (a as BaseEntity).Id == 1).ExecuteAffrows();

//fsql.Select<object>()...

// Or using repository
var repo = fsql.GetRepository<object>();
repo.AsType(EntityType);

repo.Insert(..);
repo.Update(..);
repo.Delete(..);
repo.InsertOrUpdate(..);
```

v3.2.695 emits dynamic entity creation

```csharp
var table = fsql.CodeFirst.DynamicEntity("user", new TableAttribute { Name = "t_user" })
  .Property("id", typeof(int), new ColumnAttribute { IsIdentity = true, IsPrimary = true })
  .Property("username", typeof(string), new ColumnAttribute { StringLength = 32 })
  .Build();

// Cache the table if necessary
if (fsql.DbFirst.ExistsTable(table.DbName) == false)
    fsql.CodeFirst.SyncStructure(table.Type); // Create the table

var dict = new Dictionary<string, object>();
dict["id"] = 1;
dict["username"] = "xxx";

// Convert the dictionary to an object corresponding to the type
// Alternatively, use InsertDict/UpdateDict/DeleteDict, etc., for dictionary CUD operations
object obj = table.CreateInstance(dict);

fsql.Insert<object>().AsType(table.Type).AppendData(obj).ExecuteAffrows();
fsql.Update<object>().AsType(table.Type).SetSource(obj).ExecuteAffrows();
fsql.InsertOrUpdate<object>().AsType(table.Type).SetSource(obj).ExecuteAffrows();
fsql.Delete<object>().AsType(table.Type).WhereDynamic(obj).ExecuteAffrows();
List<object> objs = fsql.Select<object>().AsType(table.Type).ToList();
```

## Dictionary CUD

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
fsql.UpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
fsql.InsertOrUpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
```

InsertDict/UpdateDict/DeleteDict/InsertOrUpdateDict all support batch operations, corresponding to types `List<Dictionary<string, object>>`.

## Untyped CRUD (More Advanced)

Does not rely on entity types, does not require dynamic compilation, pure dictionary operations, supports navigation properties, cascading saves, a blessing for AOT compilation.

For more details, please refer to [《Untyped Mapping》](lowcode).

## Dynamic Table Names

1. Repository

```csharp
var repo = fsql.GetRepository<Log>();
repo.AsTable(old => $"{old}_201903"); // CRUD on Log_201903 table
//repo.AsTable((t, old) => $"{old}_201903"); // CRUD on Log_201903 table (also add suffix to related tables)
repo.Insert(new Log { ... });
```

2. IFreeSql

```csharp
fsql.Select<Log>().AsTable((t, old) => $"{old}_201903").ToList(); // Query on Log_201903 table
fsql.Insert(new Log { ... }).AsTable("Log_201903").ExecuteAffrows(); // Insert into Log_201903 table
fsql.Update<Log>().AsTable("Log_201903").SetSource(item).ExecuteAffrows(); // Update Log_201903 table
fsql.Delete<Log>().AsTable("Log_201903").Where(a => a.Id == 1).ExecuteAffrows(); // Delete from Log_201903 table
fsql.InsertOrUpdate<Log>().AsTable("Log_201903").SetSource(item).ExecuteAffrows(); // Insert or update Log_201903 table
```

## Dynamic Conditions

1. `ISelect.Where(string sql)` uses raw conditions:

```csharp
fsql.Select<Region>().Where("a.id > 0") // Warning: SQL injection vulnerability
```

2. Dynamic Lambda Expressions

- `And`, `Or` extension methods [LambadaExpressionExtensions.cs](https://github.com/dotnetcore/FreeSql/blob/master/FreeSql/Extensions/LambadaExpressionExtensions.cs)

```csharp
Expression<Func<Region, bool>> where = null;
where = where.And(b => b.Id > 10);
where = where.Or(b => b.Id == 1);
fsql.Select<Region>().Where(where).ToList();
// WHERE id > 10 OR id = 1
```

3. `ISelect.WhereDynamicFilter` method implements dynamic filter conditions (interact with frontend), supported operators:

- Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith: Contains/Does not contain, like '%xx%', or like 'xx%', or like '%xx%'
- Equal/NotEqual: Equals/Not equals
- GreaterThan/GreaterThanOrEqual: Greater than/Greater than or equal to
- LessThan/LessThanOrEqual: Less than/Less than or equal to
- Range: Range query
- DateRange: Date range, with special handling for value[1] + 1
- Any/NotAny: Matches any item in value (SQL IN)
- Custom: Custom parsing

```csharp
DynamicFilterInfo dyfilter = JsonConvert.DeserializeObject<DynamicFilterInfo>(@"
{
  ""Logic"": ""And"",
  ""Filters"":
  [
    { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 1 },
    {
      ""Logic"": ""Or"",
      ""Filters"":
      [
        { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 2 },
        { ""Field"": ""id"", ""Operator"": ""Equals"", ""Value"": 3 }
      ]
    }
  ]
}");
fsql.Select<Region>().WhereDynamicFilter(dyfilter).ToList();
// WHERE id = 1 AND (id = 2 OR id = 3)
```

Example of implementing Custom:

```json
{
  Logic: 'And',
  Filters:
  [
    { Field: 'id', Operator: 'Equals', Value: 1 },
    {
      Logic: 'Or',
      Filters:
      [
        { Field: 'id', Operator: 'Equals', Value: 2 },
        {
            Field: '{{ DynamicFilterCustomImpl.CustomLinq }}', 
            Operator: 'Custom', 
            Value: 'Title.StartsWith(\'new topic 1\')'
        }
      ]
    }
  ]
}
```

```csharp
var dyfilter = JsonConvert.DeserializeObject<DynamicFilterInfo>(json);
fsql.Select<Topic>().WhereDynamicFilter(dyfilter).ToList();
// WHERE id = 1 AND (id = 2 OR title like 'new topic 1%')

// Install nuget System.Linq.Dynamic.Core
public class DynamicFilterCustomImpl
{
    // JSON Field corresponds to this value
    public static string CustomLinq = $"{nameof(DynamicFilterCustomImpl.DynamicLinq)} {typeof(DynamicFilterCustomImpl).FullName},{typeof(DynamicFilterCustomImpl).Assembly.FullName}";

    [DynamicFilterCustom]
    public static LambdaExpression DynamicLinq(object sender, string value)
    {
        if (string.IsNullOrWhiteSpace(value)) value = "1==2";
        ParameterExpression t = Expression.Parameter(sender.GetType().GetGenericArguments()[0], "t");
        var exp = DynamicExpressionParser.ParseLambda(new ParameterExpression[] { t }, typeof(bool), value);
        return exp;
    }
}
```

## Dynamic Sorting

1. `ISelect.OrderBy(string sql)` uses raw sorting:

```csharp
fsql.Select<Region>().OrderBy("a.id desc") // Warning: SQL injection vulnerability
```

2. `ISelect.OrderByPropertyName` uses property names for sorting:

- Supports navigation properties, e.g., `OrderByPropertyName("Parent.Code")`
- Supports multi-table queries, e.g., `OrderByPropertyName("b.Code")`

## Dynamic Include

1. `ISelect.IncludeByPropertyName` method implements dynamic eager loading, corresponding to `Include/IncludeMany`:

```csharp
fsql.Select<Region>()
    .IncludeByPropertyName("Parent.Parent.Parent")
    .IncludeByPropertyName("Childs")

    .IncludeByPropertyName("Childs", then => then
        .IncludeByPropertyName("Parent.Parent")
        .IncludeByPropertyName("Parent.Childs"))
    .ToList();
```

2. `List<TDto>.IncludeByPropertyName` extension method also implements dynamic eager loading for OneToMany relationships:

> Non-entity types can also be cascaded loaded; they do not need navigation property relationships.

```csharp
var dtos = fsql.Select<Region>().ToList<Dto>();

dtos.IncludeByPropertyName(
    orm: fsql, 
    property: "Childs", 
    where: "ParentId=Id", // Temporary relationship
    take: 5, 
    select: "id,name",
    then => then.IncludeByPropertyName("Parent")
);
```

## Dynamic Data Returns

1. `ISelect.ToList` uses raw SQL to return data:

```csharp
List<(int, string)> list = fsql.Select<Region>()
    .ToList<(int, string)>("a.id,a.name") // Warning: SQL injection vulnerability
```

2. `ISelect.ToDataTableByPropertyName` uses property names to return data:

```csharp
DataTable dt = fsql.Select<Region>()
    .ToDataTableByPropertyName(new [] {
        "Parent.Code",
        "b.Id"
    });
```

## Dynamic Fragments

FreeSql provides APIs for directly using SQL fragments such as `Where(sql)`, `GroupBy(sql)`, `OrderBy(sql)`, `ToList(sql)`.

**Please be cautious of SQL injection vulnerabilities when using these APIs.**

It is not recommended to directly POST SQL from the frontend to the backend for these operations. Instead, you should map these queries on the backend. For example:

```csharp
var whereMapping = new Dictionary<string, string>
{
    ["where1"] = "a.id > {0}",
    ["where2"] = "len(a.name) > {0}"
};
var orderByMapping = new Dictionary<string, string>
{
    ["order1"] = "a.id asc, a.name desc",
    ["order2"] = "len(a.name) desc"
};

// Suppose the frontend POST content is postWhere=where1&postWhereValue=100&postOrder=order1
fsql.Select<Region>()
    .WhereIf(
        whereMapping.TryGetValue(postWhere, out var whereSql), 
        string.Format(whereSql, postWhereValue)
    )
    .OrderBy(
        orderByMapping.TryGetValue(postOrder, out var orderSql), 
        orderSql
    )
```