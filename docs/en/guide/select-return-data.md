# Return Data ✨

FreeSql uses ExpressionTree to read data records. Under .NET technology, besides native code, the fastest solutions are Emit and ExpressionTree.

ExpressionTree naturally supports .NET AOT compilation. The technological decision made by FreeSql in 2018 will benefit in the future.

## 1. Return a Single Record

```csharp
Topic t1 = fsql.Select<Topic>().ToOne();
```

> FreeSql convention: ToOne/First always returns either null or an entity object with data. ToList always returns a non-null List\<entity type\>.

## 2. Return List

```csharp
List<Topic> t1 = fsql.Select<Topic>().ToList();
```

## 3. Return TreeList

```csharp
List<Area> t2 = fsql.Select<Area>().ToTreeList();
List<Area> t3 = fsql.Select<Area>().Where(a => a.Name == "Hubei").AsTreeCte().ToTreeList();
//v1.6.0 AsTreeCte() recursive CTE query to get all subcategories under Hubei
```

> Data query processed into a tree structure. Note: Entities need to configure [parent-child navigation properties](select-as-tree.md).

## 4. Return List + Navigation Properties Data

```csharp
List<Topic> t4 = fsql.Select<Topic>().LeftJoin(a => a.Category.Id == a.CategoryId).ToList();
//At this point, it will query Topic normal fields + navigation object Category fields
```

More navigation properties data return: [Eager Loading](select-include.md)

## 5. Specify Return

```csharp
//Return one field
List<int> t5 = fsql.Select<Topic>().ToList(a => a.Id);

//Return anonymous class
List<AnonymousClass> t6 = fsql.Select<Topic>().ToList(a => new { a.Id, a.Title });

//Return tuple
List<(int, string)> t7 = fsql.Select<Topic>().ToList<(int, string)>("id, title");

//Return navigation property
List<AnonymousClass> t8 = fsql.Select<Topic>().ToList(a => new
{
    a.Id, a.Title,
    a.Category //Navigation property
});

//Return SQL fields
List<AnonymousClass> t9 = fsql.Select<Topic>().ToList(a => new
{
    cstitle = "substr(a.title, 0, 2)", //Use substr(a.title, 0, 2) as a query field
    csnow = Convert.ToDateTime("now()"), //Use now() as a query field
});

//Return subquery fields
List<AnonymousClass> t10 = fsql.Select<Topic>().ToList(a => new
{
    a.Id,
    count = fsql.Select<T2>().Count(),
    max = fsql.Select<T2>().Max(b => b.Id),
    min = fsql.Select<T2>().Min(b => b.Id),
    name = fsql.Select<T2>().First(b => b.name)
});

//Return subquery collection, v3.2.650+ up to 3 SQL executions
List<AnonymousClass> t11 = fsql.Select<Topic>().ToList(a => new
{
    a.Id,
    list1 = fsql.Select<T2>().ToList(),
    list2 = fsql.Select<T2>().Where(b => b.TopicId == a.Id).ToList()
});
List<AnonymousClass> t12 = fsql.Select<Topic>()
    .GroupBy(a => new { a.Author })
    .WithTempQuery(a => new { Author = a.Key.Author, Count = a.Count() })
    .ToList(a => new
    {
        a.Author, a.Count,
        list1 = fsql.Select<T2>().ToList(),
        list2 = fsql.Select<T2>().Where(b => b.Author == a.Author).ToList()
    });
```

> The constant mechanism was initially reserved for native SQL. If you really need to return the string: "'xxx'".

## 6. Ignore Field Return

Reference implementation: [https://github.com/dotnetcore/FreeSql/issues/528](https://github.com/dotnetcore/FreeSql/issues/528)

## 7. DTO Mapping Return

```csharp
fsql.Select<Song>().ToList<Dto>();
//Case 1: Fields with the same name in Dto and Song are queried, returning List<Dto>

fsql.Select<Song>().ToList(a => new Dto { xxx = a.ext })
//Case 2: Fields with the same name in Dto and Song are queried, correcting the mapping of ext, returning List<Dto>

fsql.Select<Song>().ToList(a => new Song { id = a.id })
//Case 3: Lambda with the same type as Song, only querying specified field id, returning List<Song>

fsql.Select<Song>().ToList(a => new { id = a.id })
//Case 4: Lambda anonymous type, only querying specified field id, returning List<AnonymousObject>
```

> Handle differences carefully, handle differences carefully, handle differences carefully

```csharp
fsql.Select<Song>().ToList(a => new Dto(a.id))
//Case 5: Only querying id, returning List<Dto>

fsql.Select<Song>().ToList(a => new Dto(a.id) { xxx = a.ext })
//Case 6: Querying id and ext, returning List<Dto>

fsql.Select<Song>().ToList(a => new Song(a.id))
//Case 7: Querying id, returning List<Song>

fsql.Select<Song>().ToList(a => new Song(a.id) { xxx = a.ext })
//Case 8: Querying id and ext, returning List<Song>
```

> GroupBy methods do not use DTO mapping rules.

This mapping supports single-table/multi-table and maps before querying data (not querying all fields first and then mapping in memory).

Search rules: Search for property names by looping through internal objects _tables (which will grow after join queries), prioritizing the main table to search until the same field is found.

For example:

A, B, C all have id, Dto { id, a1, a2, b1, b2 }, A.id is mapped. You can also specify id = C.id mapping.

DTO queries only map default fields (ordinary properties). For mapping objects, use:

> Navigation object: ToList(a => new Dto { Catalog = a.Catalog })

> Multi-table object: ToList((a, b) => new Dto { Catalog = b })

## 8. ToChunk Paging Return

Execute queries and return data in chunks to reduce memory overhead. For example, read 100,000 data entries, processing 100 at a time.

```csharp
fsql.Select<Song>().OrderBy(a => a.Id).ToChunk(100, done =>
{
    List<Song> list = done.Object;
    //done.IsBreak = true; v1.7.0 stop reading
});
```

## 9. ToSql

Each ToList can use ToSql to return SQL String with two options:

- FieldAliasOptions.AsIndex (default) automatically generates aliases as1, as2, as3 .... to prevent issues with fields having the same name in multi-table queries;
- FieldAliasOptions.AsProperty uses property names as field aliases, suitable for generating SQL for further execution.

## 10. Execute SQL

```csharp
class xxx
{
    public int Id { get; set; }
    public string Path { get; set; }
    public string Title2 { get; set; }
}

List<xxx> t11 = fsql.Ado.Query<xxx>("select * from song");
List<(int, string, string)> t12 = fsql.Ado.Query<(int, string, string)>("select * from song");
List<dynamic> t13 = fsql.Ado.Query<dynamic>("select * from song");
```

> Note: The entity features of Ado.Query are invalid, for example, [Column(Name = "xxx")] is not effective.

## 11. API

| Method | Return Value | Parameter | Description |
| ------------- | - | - | - |
| ToSql | string | | Returns the SQL statement to be executed |
| ToList | List\<T1\> | | Executes SQL query and returns records with all fields of T1 entity. If navigation properties exist, they are queried and returned together. If no records are found, returns a list with Count equal to 0 |
| ToList\<Dto\> | List\<Dto\> | Lambda | Executes SQL query and returns records with specified fields or DTO mapping. If no records are found, returns a list with Count equal to 0 |
| ToList\<T\> | List\<T\> | string field | Executes SQL query and returns records of the specified field, received as a tuple or basic type (int, string, long). If no records are found, returns a list with Count equal to 0 |
| ToOne | T1 | | Executes SQL query and returns the first record with all fields of T1 entity. If no records are found, returns null |
| ToChunk | \<empty\> | int size, Action\<FetchCallbackArgs\<List\<T1\>\>\> done | Executes SQL query and returns data in chunks to reduce memory overhead. For example, reads 100,000 records, processing 100 at a time. |
| Any | bool | | Executes SQL query to check if there are any records |
| Sum | T | Lambda | Specifies a column to calculate the sum |
| Min | T | Lambda | Specifies a column to find the minimum value |
| Max | T | Lambda | Specifies a column to find the maximum value |
| Avg | T | Lambda | Specifies a column to calculate the average value |