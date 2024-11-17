# WithSql

## WithSql 自定义 SQL

定义实体类

```csharp
public class TestClass
{
    [Column(Name = "ID", IsPrimary = true)]
    public string No { get; set; }
    public int? Age { get; set; }
    public string Name { get; set; }
    [Column(Name = "BIRTH_DAY")]
    public DateTime? Birthday { get; set; }
    public decimal Point { get; set; }
    public Sex? Sex { get; set; }
}
public enum Sex { Boy, Girl }
public class TestClssDto
{
    public string ID { get; set; }
    public int? Age { get; set; }
    public DateTime? Birthday { get; set; }
}
```

不同的查询方式。

- 返回`DataTable`
- 返回`List<Tuplue>` 即`List<(string,string)>`元组
- 返回`List<object>` 且能支持分页
- 返回`List<TestClassDto>`且能支持分页

### 1.动态表名

```csharp
//对 TestClass_201903 表查询
fsql.Select<TestClass>().AsTable((t, old) => $"{old}_201903").ToList();
```

### 2.返回 DataTable

```csharp
DataTable dt1 = _fsql.Select<object>()
    .WithSql("select * from TestClass")
    .Where(...)
    .ToDataTable("ID, Age");
```

```sql
SELECT ID, Age
FROM ( select * from TestClass ) a
WHERE ...
```

## 3.返回 DataTable

```csharp
DataTable dt2 = _fsql.Select<object>()
    .WithSql("select * from TestClass")
    .Where(...)
    .ToDataTable("*");
```

```sql
SELECT *
FROM ( select * from TestClass ) a
WHERE ...
```

### 4.返回`List<Tuple>` 即`List<(string,string)>` 元组

```csharp
List<(string,string)> list1 = _fsql
    .Select<object>()
    .WithSql("select * from TestClass")
    .Where(...)
    .ToList<(string, string)>("ID, Age");
```

```sql
SELECT ID, Age
FROM ( select * from TestClass ) a
WHERE ...
```

### 5.返回`List<object>`

```csharp
var list2 = _fsql.Select<object>()
    .WithSql("select * from TestClass ")
    .Where(...)
    .ToList<object>("*");
```

```sql
SELECT *
FROM ( select * from TestClass ) a
WHERE ...
```

### 6.返回`List<object>` 且能支持分页

```csharp
var list3 = _fsql.Select<object>()
    .WithSql("select * from TestClass ")
    .WhereIf(true, "1=1")
    .Page(1, 10).OrderBy("ID DESC")
    .ToList<object>("ID,Age");
```

```sql
SELECT ID, Age
FROM ( select * from TestClass ) a
WHERE (1 = 1)
ORDER BY ID DESC
limit 0,10
```

### 7.返回`List<TestClassDto>`且能支持分页

```csharp
var list4 = _fsql.Select<object>()
    .WithSql("select * from TestClass ")
    .WhereIf(true, "1=1")
    .Page(1, 10)
    .OrderBy("ID DESC")
    .ToList<TestClssDto>("ID,Age,BIRTH_DAY as Birthday");
```

```sql
SELECT ID,Age,BIRTH_DAY as Birthday
FROM ( select * from TestClass ) a
WHERE (1 = 1)
ORDER BY ID DESC
limit 0,10
```

## 通过 WithSql + ToSQL 实现 Union ALL 查询方法

### 1、二次 ISelect 查询：WithSql 使用多次，等于 UNION ALL 查询

WithSql 使用多次为 UNION ALL 查询，所以我们可以利用 ISelect.ToSql(FieldAliasOptions.AsProperty) 得到生成的 SQL，如下：

```csharp
var sql1 = fsql.Select<Topic>()
    .Where(a => a.Title.Contains("xxx"))
    .ToSql();
var sql2 = fsql.Select<Topic>()
    .Where(a => a.Title.Contains("yyy"))
    .ToSql();

fsql.Select<Topic>()
    .WithSql(sql1)
    .WithSql(sql2)
    .ToList();
```

```sql
SELECT  * from (SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
FROM ( SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
    FROM `tb_topic` a
    WHERE ((a.`Title`) LIKE '%xxx%') ) a) ftb

UNION ALL

SELECT  * from (SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
FROM ( SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
    FROM `tb_topic` a
    WHERE ((a.`Title`) LIKE '%yyy%') ) a) ftb
```

### 2、跨分表查询：AsTable 相同实体多次操作，等于 Union ALL 查询

```csharp
var sql = fsql.Select<User>()
    .AsTable((type, oldname) => "table_1")
    .AsTable((type, oldname) => "table_2")
    .ToSql(a => a.Id);
```

```sql
select * from (SELECT a."Id" as1 FROM "table_1" a) ftb
UNION ALL
select * from (SELECT a."Id" as1 FROM "table_2" a) ftb
```

### 3、利用 ToSql 拼接新的 SQL，使用 IAdo 执行

```csharp
var sql1 = fsql.Select<Topic>()
    .Where(a => a.Id > 100 && a.Id < 200)
    .ToSql(a => new { a.Id, a.Title }, FieldAliasOptions.AsProperty);
var sql2 = fsql.Select<Topic>()
    .Where(a => a.Id > 1001 && a.Id < 1200)
    .ToSql(a => new { a.Id, a.Title }, FieldAliasOptions.AsProperty);

fsql.Ado.CommandFluent($"{sql1} UNION ALL {sql2}")
    .ExecuteDataTable();
```

## 分页问题

Union All 之后 如果直接 分页会有一个问题。请看具体示例

多次 WithSql + Page 存在问题：每个 WithSql 内都有一个 Page 分页

```csharp
var sql1 = fsql.Select<Topic>()
    .Where(a => a.Title.Contains("xxx"))
    .ToSql();
var sql2 = fsql.Select<Topic>()
    .Where(a => a.Title.Contains("yyy"))
    .ToSql();

fsql.Select<Topic>().WithSql(sql1).WithSql(sql2).Page(1, 20).ToList();
```

```sql
 SELECT  * from (SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
    FROM ( SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
        FROM `tb_topic` a
        WHERE ((a.`Title`) LIKE '%xxx%') ) a
    limit 0,20) ftb

    UNION ALL

    SELECT  * from (SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
    FROM ( SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
        FROM `tb_topic` a
        WHERE ((a.`Title`) LIKE '%yyy%') ) a
    limit 0,20) ftb

```

多个 sql union all 使用 withsql，直接 Page 分页，会导致每个子表都生效，子表都生成分页。

WithSql 可以和 AsTable 实现分表的功能。

分表跨表查询的时候，分页是要向每个子表（即每个 WithSql 中的 SQL 分页）都生效。

### 解决方案

多次 withsql ，如需分页，需要按下面的二步操作

- 第一步：通过 witsql，将二个 sql 组成一个 sql。

```csharp
 var sql = fsql.Select<Topic>()
    .WithSql("SELECT * FROM tb_topic where id > 11")
    .WithSql("SELECT * FROM tb_topic where id < 10")
    .ToSql("*")
```

如上生成的 UOION ALL 的 sql

```sql
SELECT  * from (SELECT *
    FROM ( SELECT * FROM tb_topic where id > 11 ) a) ftb

    UNION ALL

    SELECT  * from (SELECT *
    FROM ( SELECT * FROM tb_topic where id < 10 ) a) ftb
```

- 第二步：之后 调用 Page 则是通过 Union ALL 后的结果上分页

```csharp
 var sql2 = g.mysql.Select<Topic>()
     .WithSql(sql)
     .Page(2, 10)
     .ToSql();
```

```sql
SELECT a.`Id`, a.`Clicks`, a.`TypeGuid`, a.`Title`, a.`CreateTime`
FROM ( SELECT  * from (SELECT *
    FROM ( SELECT * FROM tb_topic where id > 11 ) a) ftb

    UNION ALL

    SELECT  * from (SELECT *
    FROM ( SELECT * FROM tb_topic where id < 10 ) a) ftb ) a
limit 10,10
```
