# 动态操作

## 弱类型 CRUD

```csharp
fsql.Insert<object>().AsType(实体类型)
  .AppendData(data).ExecuteAffrows();

fsql.Update<object>().AsType(实体类型)
  .SetSource(data).ExecuteAffrows();

fsql.Delete<object>().AsType(实体类型)
  .Where(a => (a as BaseEntity).Id == 1).ExecuteAffrows();

//fsql.Select<object>()...

//或者仓储
var repo = fsql.GetRepository<object>();
repo.AsType(实体类型);

repo.Insert(..);
repo.Update(..);
repo.Delete(..);
repo.InsertOrUpdate(..);
```

v3.2.695 emit 动态创建实体类型

```csharp
var table = fsql.CodeFirst.DynamicEntity("user", new TableAttribute { Name = "t_user" })
  .Property("id", typeof(int), new ColumnAttribute { IsIdentity = true, IsPrimary = rue })
  .Property("username", typeof(string), new ColumnAttribute { StringLength = 32 })
  .Build();

//如果有必要，请将 table 缓存起来
if (fsql.DbFirst.ExistsTable(table.DbName) == false)
    fsql.CodeFirst.SyncStructure(table.Type); //创建表

var dict = new Dictionary<string, object>();
dict["id"] = 1;
dict["username"] = "xxx";

//将字典转化成 type 对应的 object
//也可以直接使用 InsertDict/UpdateDict/DeleteDict 等字典 CUD 功能
object obj = table.CreateInstance(dict);

fsql.Insert<object>().AsType(table.Type).AppendData(obj).ExecuteAffrows();
fsql.Update<object>().AsType(table.Type).SetSource(obj).ExecuteAffrows();
fsql.InsertOrUpdate<object>().AsType(table.Type).SetSource(obj).ExecuteAffrows();
fsql.Delete<object>().AsType(table.Type).WhereDynamic(obj).ExecuteAffrows();
List<object> objs = fsql.Select<object>().AsType(table.Type).ToList();
```

## 字典 CUD

```csharp
var dic = new Dictionary<string, object>();
dic.Add("id", 1);
dic.Add("name", "xxxx");

fsql.InsertDict(dic).AsTable("table1").ExecuteAffrows();
fsql.UpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
fsql.DeleteDict(dic).AsTable("table1").ExecuteAffrows();
fsql.InsertOrUpdateDict(dic).AsTable("table1").WherePrimary("id").ExecuteAffrows();
```

InsertDict/UpdateDict/DeleteDict/InsertOrUpdateDict 都支持批量操作，对应类型 List\<Dictionary\<string, object\>\>

## 无类型 CRUD（更高级）

不依赖实体类型，不需要动态编译，纯字典操作，支持导航属性，级联保存，AOT 编译福音。

内容较长，请移步[《低代码》](lowcode.md)

## 动态表名

1、仓储 Repository

```csharp
var repo = fsql.GetRepository<Log>();
repo.AsTable(old => $"{old}_201903"); //对 Log_201903 表 CRUD
//repo.AsTable((t, old) => $"{old}_201903"); //对 Log_201903 表 CRUD（级联有关表也增加该后辍）
repo.Insert(new Log { ... });
```

2、原生 IFreeSql

```csharp
fsql.Select<Log>().AsTable((t, old) => $"{old}_201903").ToList(); //对 Log_201903 表查询
fsql.Insert(new Log { ... }).AsTable("Log_201903").ExecuteAffrows(); //对 Log_201903 表插入
fsql.Update<Log>().AsTable("Log_201903").SetSource(item).ExecuteAffrows(); //对 Log_201903 表更新
fsql.Delete<Log>().AsTable("Log_201903").Where(a => a.Id == 1).ExecuteAffrows(); //对 Log_201903 表删除
fsql.InsertOrUpdate<Log>().AsTable("Log_201903").SetSource(item).ExecuteAffrows(); //对 Log_201903 表插入或更新
```

## 动态条件

1、ISelect.Where(string sql) 使用原生条件：

```csharp
fsql.Select<Region>().Where("a.id > 0") //提示：存在SQL注入安全问题
```

2、动态 Lambda 表达式

- ``And``、``Or``扩展方法 [LambadaExpressionExtensions.cs](https://github.com/dotnetcore/FreeSql/blob/master/FreeSql/Extensions/LambadaExpressionExtensions.cs)

```csharp
Expression<Func<Region, bool>> where = null;
where = where.And(b => b.Id > 10);
where = where.Or(b => b.Id == 1);
fsql.Select<Region>().Where(where).ToList();
//WHERE id > 10 OR id = 1
```

3、ISelect.WhereDynamicFilter 方法实现动态过滤条件（与前端交互），支持的操作符：

- Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith：包含/不包含，like '%xx%'，或者 like 'xx%'，或者 like '%xx'
- Equal/NotEqual：等于/不等于
- GreaterThan/GreaterThanOrEqual：大于/大于等于
- LessThan/LessThanOrEqual：小于/小于等于
- Range：范围查询
- DateRange：日期范围，有特殊处理 value\[1\] + 1
- Any/NotAny：是否符合 value 中任何一项（直白的说是 SQL IN）
- Custom：自定义解析

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
//WHERE id = 1 AND (id = 2 OR id = 3)
```

[《高效理解 FreeSql WhereDynamicFilter，深入了解设计初衷》](https://www.cnblogs.com/FreeSql/p/16485310.html)

实现 Custom 的例子：

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

//nuget 安装 System.Linq.Dynamic.Core
public class DynamicFilterCustomImpl
{
    //JSON Field 对应这个值
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

## 动态排序

1、ISelect.OrderBy(string sql) 使用原生排序：

```csharp
fsql.Select<Region>().OrderBy("a.id desc") //提示：存在SQL注入安全问题
```

2、ISelect.OrderByPropertyName 使用属性名排序：

- 支持导航属性，比如 OrderByPropertyName("Parent.Code")
- 支持多表查询，比如 OrderByPropertyName("b.Code")

## 动态贪婪加载

1、ISelect.IncludeByPropertyName 方法实现动态贪婪加载，对应 Include/IncludeMany：

```csharp
fsql.Select<Region>()
    .IncludeByPropertyName("Parent.Parent.Parent")
    .IncludeByPropertyName("Childs")

    .IncludeByPropertyName("Childs", then => then
        .IncludeByPropertyName("Parent.Parent")
        .IncludeByPropertyName("Parent.Childs"))
    .ToList();
```

2、List\<TDto\>.IncludeByPropertyName 扩展方法也实现了 OneToMany 动态贪婪加载：

> 非实体类型，也可以级联加载，他们不需要配置导航属性关系。

```csharp
var dtos = fsql.Select<Region>().ToList<Dto>();

dtos.IncludeByPropertyName(
    orm: fsql, 
    property: "Childs", 
    where: "ParentId=Id", //临时关系
    take: 5, 
    select: "id,name",
    then => then.IncludeByPropertyName("Parent")
);
```

## 动态返回数据

1、ISelect.ToList 使用原生SQL返回数据：

```csharp
List<(int, string)> list = fsql.Select<Region>()
    .ToList<(int, string)>("a.id,a.name") //提示：存在SQL注入安全问题
```

2、ISelect.ToDataTableByPropertyName 使用属性名返回数据：

```csharp
DataTable dt = fsql.Select<Region>()
    .ToDataTableByPropertyName(new [] {
        "Parent.Code",
        "b.Id"
    });
```

## 动态片段

FreeSql 提供 Where(sql)、GroupBy(sql)、OrderBy(sql)、ToList(sql) 等直接使用 SQL 片段的 API。

**使用这些 API 时请务必注意SQL注入安全问题。**

不建议前端直接 POST SQL 到后端使用它们，而应该在后端做一层映射，例如：

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

//假设前端 POST 内容是 postWhere=where1&postWhereValue=100&postOrder=order1
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
