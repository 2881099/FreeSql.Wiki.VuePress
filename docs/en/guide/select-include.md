# Include Loading ✨

## 1. Child Table ToList

```csharp
// Executes at most 3 SQL queries
fsql.Select<Song>().ToList(a => new
{
    all = a,
    list1 = fsql.Select<T2>().ToList(),
    list2 = fsql.Select<T2>().Where(b => b.SongId == a.Id).ToList()
});

// After grouping, executes at most 3 SQL queries
fsql.Select<Song>()
    .GroupBy(a => new { a.Author })
    .WithTempQuery(a => new { Author = a.Key.Author, Count = a.Count() })
    .ToList(a => new 
    {
        a.Author, a.Count,
        list1 = fsql.Select<T2>().ToList(),
        list2 = fsql.Select<T2>().Where(b => b.Author == a.Author).ToList()
    });
```

---

The following content heavily relies on correct configuration of [【Navigation Properties】](navigate-attribute.md); please learn it before continuing!

## 2. Navigation Properties ManyToOne/OneToOne

`Include` ultimately uses a Left Join approach (one query) to return multiple table records.

```csharp
fsql.Select<Tag>().Include(a => a.Parent.Parent).ToList();

fsql.Select<Tag>().Where(a => a.Parent.Parent.Name == "1").ToList();
// This query does not require Include; the expression is automatically processed during parsing
```

## 3. Collection Properties OneToMany/ManyToMany/PgArrayToMany

`IncludeMany` ultimately queries the child table after `ToList` (total of two queries) to return multiple table records.

```csharp
fsql.Select<Tag>().IncludeMany(a => a.Songs).ToList();
```

## 4. IncludeMany Enhanced

For the second query, use `then` modifier:

```csharp
fsql.Select<Tag>().IncludeMany(a => a.Songs,
    then => then.Where(b => b.User == "admin")).ToList();
// `ISelect<Song> then` can continue to use Include/IncludeMany, supporting up to 100 levels deep
```

For one-to-many relationships without configured navigation, greedy loading is also possible:

```csharp
fsql.Select<Tag>().IncludeMany(a => a.TestManys.Where(b => b.TagId == a.Id));
```

To query only the first few records of each child collection:

```csharp
fsql.Select<Tag>().IncludeMany(a => a.TestManys.Take(10));
```

To return partial fields of the child collection:

```csharp
fsql.Select<Tag>().IncludeMany(a => a.TestManys.Select(b => new TestMany { Title = b.Title ... }));
```

## 5. IncludeMany Extensions

When the main data is already in memory, how to load child data? We have added the `List<T>` extension method, as shown below:

```csharp
new List<Song>(new[] { song1, song2, song3 })
    .IncludeMany(fsql, a => a.Tags);
```

```csharp
//v3.2.605+
new List<Song>(new[] { song1, song2, song3 })
    .IncludeByPropertyName(
        orm: fsql,
        property: "Tags",
        where: "ParentId=Code",
        take: 5,
        select: "id,name"
    );
```

## 6. Comparison of Two Ways to Use IncludeMany

Method 1 (IncludeMany extension method):

```csharp
var list = fsql.Select<SysModule>()
    .Page(1, 10)
    .ToList(a => new { Id = a.Id }) // Query data id
    .Select(a => new SysModule { Id = a.Id }).ToList() // In-memory operation
    .IncludeMany(fsql, a => a.Permissions, then => then.Include(a => a.Button));
```

```sql
SELECT a."Id" as1 
FROM "SysModule" a 
limit 0,10

SELECT a."Id", a."SysModuleId", a."SysModuleButtonId", a."Status", 
a__Button."Id" as5, a__Button."Name", a__Button."EventName", a__Button."EnCode", a__Button."Icon", a__Button."Sort", a__Button."CreateTime" 
FROM "SysModulePermission" a 
LEFT JOIN "SysModuleButton" a__Button ON a__Button."Id" = a."SysModuleButtonId" 
WHERE ((a."SysModuleId") in ('menu1','menu2'))
```

---

Method 2 (Directly IncludeMany + ToList):

```csharp
var list = fsql.Select<SysModule>()
    .IncludeMany(m => m.Permissions, then => then.Include(a => a.Button))
    .Page(1, 10)
    .ToList();
```

```sql
SELECT a."Id", a."ParentId", a."Name", a."Icon", a."UrlAddress", a."IsShow", a."Sort", a."Description", a."CreateTime"
FROM "SysModule" a
limit 0,10

SELECT a."Id", a."SysModuleId", a."SysModuleButtonId", a."Status",
a__Button."Id" as5, a__Button."Name", a__Button."EventName", a__Button."EnCode", a__Button."Icon", a__Button."Sort", a__Button."CreateTime"
FROM "SysModulePermission" a
LEFT JOIN "SysModuleButton" a__Button ON a__Button."Id" = a."SysModuleButtonId"
WHERE ((a."SysModuleId") in ('menu1','menu2'))
```

Example: Query the Vod table, each of Category 1, Category 2, and Category 3 with 10 records each

```csharp
class Vod
{
    public Guid Id { get; set; }
    public int TypeId { get; set; }
}

// Define a temporary class, or it can be a DTO class
class Dto
{
    public int TypeId { get; set; }
    public List<Vod> Vods { get; set; }
}

var dto = new [] { 1,2,3 }.Select(a => new Dto { TypeId = a }).ToList();
dto.IncludeMany(fsql, d => d.Vods.Take(10).Where(vod => vod.TypeId == d.TypeId));

// After execution, each element in dto.Vods will have only 10 records
```