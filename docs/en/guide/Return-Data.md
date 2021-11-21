# Return Data

FreeSql uses ExpressionTree to optimize the reading speed. If you know the technology, you must know that in addition to native code under .NETCore technology, the fastest are Emit and ExpressionTree. 

At the beginning, we used Reflection + Cache. Although .NETCore optimized the reflection performance, after comparing the performance with Dapper, we found that there was still a certain gap. After we refactored to an implementation based on ExpresstionTree, our performance was comparable to Dapper. 

FreeSql supports many types, and the complexity of implementing ExpressionTree is relatively large. If developers are interested in this, you can browse the source code.

## Return a Single Record

```csharp
Topic t1 = fsql.Select<Topic>().ToOne();
```

> The FreeSql convention is that `ToOne`/`First` will always return null or entity object with data, and `ToList` will always return a non-null List\<entity type\>

## Return List

```csharp
List<Topic> t1 = fsql.Select<Topic>().ToList();
```

## Return TreeList

```csharp
List<Category> t2 = fsql.Select<Category>.ToTreeList();
List<Category> t3 = fsql.Select<Category>.Where(a => a.Name = "Home Appliances").AsTreeCte().ToTreeList();
//v1.6.0 AsTreeCte() Recursive CTE query for all sub-categories under "Home Appliances"
```
> The query data will be processed into a tree type. 

Note: the entity needs to be configured with parent-child navigation properties

## Return List with Navigation Property Data
```csharp
List<Topic> t4 = fsql.Select<Topic>().LeftJoin(a => a.Type.Id == a.TypeId).ToList();
```

> At this time, the common field of `Topic` and the `Type` field of navigation property will be queried

## Return the Specify Field

```csharp
//Return a field
List<int> t5 = fsql.Select<Topic>().ToList(a => a.Id);

//Return anonymous class
List<ANONYMOUS_TYPE> t6 = fsql.Select<Topic>().ToList(a => new { a.Id, a.Title });

//Return tuple
List<(int, string)> t7 = fsql.Select<Topic>().ToList<(int, string)>("id, title");

//Return to navigation properties
List<ANONYMOUS_TYPE> t8 = fsql.Select<Topic>().ToList(a => new {
    a.Id, a.Title,
    a.Type //You can directly return the navigation property "Type"
});

//Return SQL field
List<ANONYMOUS_TYPE> t9 = fsql.Select<Topic>().ToList(a => new {
    cstitle = "substr(a.title, 0, 2)", //Use substr(a.title, 0, 2) as the query field
    csnow = Convert.ToDateTime("now()"), //Use now() as the query field
    //Wonderful idea: how to query the result of window function
});

//Return the fields of the subquery
List<ANONYMOUS_TYPE> t10 = fsql.Select<Topic>().ToList(a => new {
    a.Id,
    count = fsql.Select<T2>().Count(),
    max = fsql.Select<T2>().Max(b => b.Id),
    min = fsql.Select<T2>().Min(b => b.Id),
    name = fsql.Select<2>().First(b => b.name)
});
```

> In the early constant mechanism, we left it to raw SQL. If you really need to return the string, you can write: "'xxx'"

## Ignore the Specified Field When Returning

Reference to: https://github.com/dotnetcore/FreeSql/issues/528

## ToSql

All `ToList` can use `ToSql` to return SQL string. There are two options:

- FieldAliasOptions.AsIndex, the default option, automatically generates as1, as2, as3 .... etc. field aliases, which can prevent the problem of multiple tables with the same field.
- FieldAliasOptions.AsProperty, use the property name as the field alias, appropriately use the two-stage structure SQL and execute it again.

## Executing SQL

```csharp
class xxx {
    public int Id { get; set; }
    public string Path { get; set; }
    public string Title2 { get; set; }
}

List<xxx> t11 = fsql.Ado.Query<xxx>("select * from song");
List<(int, string ,string)> t12 = fsql.Ado.Query<(int, string, string)>("select * from song");
List<dynamic> t13 = fsql.Ado.Query<dynamic>("select * from song");
```

> Note: The entity attributes of `Ado.Query` are invalid, for example, `[Column(Name = "xxx")]` is invalid

## WithSql

```csharp
fsql.Select<Topic>()
  .WithSql("select * from Topic where clicks > @val", new { val = 10 })
  .Page(1, 10)
  .ToList()

//SELECT a.`Id`, a.`Clicks`, a.`CategoryId`, a.`Title`, a.`CreateTime` 
//FROM (select * from Topic where clicks > @val) a 
```

> When `WithSql` is used multiple times, `UNION ALL` query will be used

## ToChunk

Execute queries and return data in blocks, which can reduce memory overhead. For example, if 100,000 pieces of data are read, 100 pieces of data are returned for processing each time.

```csharp
var testlist1 = fsql.Select<Song>().OrderBy(a => a.Id).ToList();
var testlist2 = new List<Song>();
fsql.Select<Song>().OrderBy(a => a.Id).ToChunk(100, done => {
    testlist2.AddRange(done.Object);
    //done.IsBreak = true; v1.7.0 stop reading 
});
//Here is a demonstration that the final data returned by testlist1 and testlist2 are the same.
```

## Dto Mapping

```csharp
fsql.Select<Song>().ToList<Dto>();
//Case 1: The field with the same property name of Dto and Song is queried, and List<Dto> is returned

fsql.Select<Song>().ToList(a => new Dto { xxx = a.ext }) 
//Case 2: The field with the same property name of Dto and Song is queried, the mapping ext is adjusted, and List<Dto> is returned

fsql.Select<Song>().ToList(a => new Song { id = a.id }) 
//Case 3: The type specified by Lambda is the same as the type of Song, only the specified field id is queried, and List<Song> is returned

fsql.Select<Song>().ToList(a => new { id = a.id }) 
//Case 4: Lambda specifies an anonymous type, only queries the specified field id, and returns List<ANONYMOUS_OBJECT>
```

> Please handle the difference carefully.

```csharp
fsql.Select<Song>().ToList(a => new Dto(a.id))
//Case 5: Only query id and return List<Dto>

fsql.Select<Song>().ToList(a => new Dto(a.id) { xxx = a.ext })
//Case 6: Query id, ext and return List<Dto>

fsql.Select<Song>().ToList(a => new Song(a.id))
//Case 7: Query id and return List<Song>

fsql.Select<Song>().ToList(a => new Song(a.id) { xxx = a.ext })
//Case 8: Query id, ext and return List<Song>
```

> All methods of GroupBy are not applicable to DTO mapping rules

This kind of mapping supports single table/multi-table, mapping before querying data (not to query all fields first and then to memory mapping).

Searching rules, searching for property names, will loop the internal object `_tables` (it will grow after join query), and check the main table first until the same field is found.

For example:

Suppose A, B, and C all have id. When the queried Dto structure is: `Dto {id, a1, a2, b1, b2 }`, `A.id` is mapped. You can also specify the `id = C.id` mapping.

> Reminder: You can directly map a navigation property in DTO

## API

| Method        | Return      | Parameter                                                | Description                                                                                                                                                                                                                           |
| ------------- | ----------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ToSql         | string      |                                                          | Return the SQL statement to be executed                                                                                                                                                                                               |
| ToList        | List\<T1\>  |                                                          | Execute a SQL query and return the records of all the fields of the T1 entity. If there are navigation properties, they will be queried and returned together. If the record does not exist, a list with Count of 0 will be returned. |
| ToList\<Dto\> | List\<Dto\> | Lambda                                                   | Execute SQL query, return the record of the specified field or Dto mapping, if the record does not exist, return the list with Count as 0.                                                                                            |
| ToList\<T\>   | List\<T\>   | string field                                             | Execute SQL query, return the record of the field specified by field, and receive it as a tuple or basic type (int, string, long). If the record does not exist, return a list with Count of 0.                                       |
| ToOne         | T1          |                                                          | Execute SQL query and return the first record of all fields of the T1 entity, or null if the record does not exist.                                                                                                                   |
| ToChunk       | \<空\>      | int size, Action\<FetchCallbackArgs\<List\<T1\>\>\> done | Execute SQL query and return data in blocks, which can reduce memory overhead. For example, if 100,000 pieces of data are read, 100 pieces of data are returned for processing each time.                                             |
| Any           | bool        |                                                          | Execute SQL query to determine whether there is a record                                                                                                                                                                              |
| Sum           | T           | Lambda                                                   | Specify a column to sum.                                                                                                                                                                                                              |
| Min           | T           | Lambda                                                   | Specify a column to find the minimum.                                                                                                                                                                                                 |
| Max           | T           | Lambda                                                   | Specify a column to find the maximum.                                                                                                                                                                                                 |
| Avg           | T           | Lambda                                                   | Specify a column to average.                                                                                                                                                                                                          |

## Reference

- [《Query from Multi Tables》](Query-from-Multi-Tablea)
- [《Return Data》](Return-Data)
- [《LinqToSql》](Linq-to-Sql)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
- [《Performance》](Performance)
- [《Tenant》](Tenant)