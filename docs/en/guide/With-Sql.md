# withsql

## Use Custom SQL Statements

Define entity class:

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
    public enum Sex
    {
        Boy,
        Girl
    }
    public class TestClssDto
    {
        public string ID { get; set; }

        public int? Age { get; set; }

        public DateTime? Birthday { get; set; }
    }
```

Different query results:
- Return to `DataTable`.
- Return `List<Tuplue>` i.e. `List<(string,string)>` tuple.
- Return `List<object>` and support paging.
- Return `List<TestClassDto>` and support paging.

### Return to DataTable with specified columns

```csharp
DataTable dt1 = _fsql.Select<object>()
	.WithSql("select * from TestClass ")
	.ToDataTable("ID,Age");
```

```sql
SELECT ID,Age 
	FROM(select * from TestClass  ) a
```

### Return to DataTable with all columns

```csharp
DataTable dt2 = _fsql.Select<object>()
	.WithSql("select * from TestClass ")
	.ToDataTable("*");
```
```sql
SELECT * 
FROM ( select * from TestClass  ) a
```

### Return List\<Tuple\> (i.e. List\<(string, string)\>)

```csharp
List<(string,string)> list1 = _fsql
    .Select<object>()
	.WithSql("select * from TestClass ")
	.ToList<(string, string)>("ID,Age");
```

```sql
SELECT ID, Age
	FROM(select * from TestClass  ) a
```

### Return List\<object\>

```csharp
var list2 = _fsql.Select<object>()
	.WithSql("select * from TestClass ")
	.ToList<object>("*");
```
```sql
SELECT *
	FROM(select * from TestClass  ) a
```

### Return List\<object\> and support paging

```csharp
  var list3 = _fsql.Select<object>()
    .WithSql("select * from TestClass ")
	.WhereIf(true, "1=1")
	.Page(1, 10).OrderBy("ID DESC")
	.ToList<object>("ID,Age");
```
```sql
SELECT ID, Age
	FROM(select * from TestClass  ) a
	WHERE(1 = 1)
	ORDER BY ID DESC
	limit 0,10
```

### Return List\<TestClassDto\> and support paging

```csharp
var list4 = _fsql.Select<object>()
    .WithSql("select * from TestClass ")
	.WhereIf(true, "1=1")
	.Page(1, 10)
	.OrderBy("ID DESC")
	.ToList<TestClssDto>("ID,Age,BIRTH_DAY as Birthday");
```

```sql
SELECT ID, Age,BIRTH_DAY as Birthday
	FROM(select * from TestClass  ) a
	WHERE(1 = 1)
	ORDER BY ID DESC
	limit 0,10
```


## WithSql+ ToSQL = Union ALL

### Two-Stage ISelect Query: Use WithSql Multiple Times to Convert to UNION ALL Query

After using `WithSql` multiple times, a query statement based on `UNION ALL` will be generated. So we can use `ISelect.ToSql(FieldAliasOptions.AsProperty)` to get the generated SQL as follows:

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

### Cross Sub-Table Query: Wse AsTable for the Same Entity Multiple Times to Convert to UNION ALL Query

```c#
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

### Use ToSql to Splice New SQL Statements, And Use IAdo to Execute

```c#
var sql1 = fsql.Select<Topic>()
    .Where(a => a.Id > 100 && a.Id < 200)
    .ToSql(a => new { a.Id, a.Title }, FieldAliasOptions.AsProperty);
var sql2 = fsql.Select<Topic>()
    .Where(a => a.Id > 1001 && a.Id < 1200)
    .ToSql(a => new { a.Id, a.Title }, FieldAliasOptions.AsProperty);

fsql.Ado.CommandFluent($"{sql1} UNION ALL {sql2}")
    .ExecuteDataTable();
```



## Paging Problem

After using `UNION ALL`, there will be a problem if you paginate directly. Please see the specific example:


### There is a problem with using WithSql + Page multiple times: There is a paging statement in each WithSql

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

After multiple Sql statements are combined with WithSql (and a `UNION ALL` statement is generated), if you directly use the `Page` method for paging, it will cause a paging statement to be generated in each sub-table. 

`WithSql` can realize the function of sub-table with `AsTable`. When querying across sub-tables, paging will take effect in each sub-table (that is, each SQL paging in WithSql). 

### Solution: Call WithSql Multiple Times

Call WithSql multiple times. If you need to paging, you need to follow the two steps below.

- Step 1: combine the two Sql statements into one by `WithSql`:

```csharp
 var sql = fsql.Select<Topic>()
	.WithSql("SELECT * FROM tb_topic where id > 11")
	.WithSql("SELECT * FROM tb_topic where id < 10")
	.ToSql("*")
```

The above code will be generated as a Sql statement using `UNION ALL`:

```sql
 SELECT  * from (SELECT * 
         FROM ( SELECT * FROM tb_topic where id > 11 ) a) ftb

         UNION ALL

         SELECT  * from (SELECT * 
         FROM ( SELECT * FROM tb_topic where id < 10 ) a) ftb
```

- Step 2: on the basis of the SQL statement containing `UNION ALL`, page by calling the `Page` method: 

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