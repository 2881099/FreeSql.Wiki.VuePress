# Greed-Loading

## Navigation Properties - ManyToOne

ManyToOne navigation properties are loaded by `ToList(includeNestedMembers: false)`, parameter description:

`false`: Return the navigation data of Level 2 Join (default);

`true`: Return the navigation data of all levels of depth Join (unused navigation data will not be returned).

```csharp
Select<Tag>().Include(a => a.Parent.Parent).ToList(true);

Select<Tag>().Where(a => a.Parent.Parent.Name == "1").ToList(true);
//Write in this way, no need to mark Join, 
//it will be automatically processed into LeftJoin when parsing the expression
```

## Navigation Properties - OneToMany/ManyToMany

IncludeMany greedily loads the navigation properties of the collection. In fact, it is queried twice, and data is assembled after `ToList`.

```csharp
Select<Tag>().IncludeMany(a => a.Songs).ToList();
```

IncludeMany has a second parameter, which can be modified before the second query.

```csharp
Select<Tag>().IncludeMany(a => a.Songs, 
    then => then.Where(song => song.User == "admin")).ToList();
```

In fact, in `Then`, you can continue to use `Include`/`IncludeMany`. As long as you like it, it’s okay to go down 100 levels.

## Mutations

It can also be greedily loaded without configuring the navigation relationship.

```csharp
Select<Tag>().IncludeMany(a => a.TestManys.Where(b => b.TagId == a.Id));
```

Only query the first few pieces of data in each sub-collection to avoid poor IO performance caused by loading all data like EfCore (for example, there are 2000 comments under a product).

```csharp
Select<Tag>().IncludeMany(a => a.TestManys.Take(10));
```

The sub-collection returns a part of the fields to avoid the problem of too many fields.

```csharp
Select<Tag>().IncludeMany(a => a.TestManys.Select(b => new TestMany { Title = b.Title ... }));
```

## IncludeMany Extensions

When the main data already exists in the memory, how to load the sub-data? So we added the List\<T\> extension method, the example is as follows:

```csharp
new List<Song>(new[] { song1, song2, song3 })
    .IncludeMany(fsql, a => a.Tags);
```

```c#
new List<Song>(new[] { song1, song2, song3 })
    .IncludeByPropertyName(
        orm: fsql, 
        property: "Tags", 
        where: "ParentId=Code", 
        take: 5, 
        select: "id,name"
    );
//v3.2.605+
```

## Comparison of the Two Ways of IncludeMany

**Way 1: IncludeMany extensions**

```csharp
var list111 = fsql.Select<SysModule>()
    .Page(1, 10)
    .ToList(a => new { Id = a.Id }) //Query data id
    .Select(a => new SysModule { Id = a.Id }).ToList() //Memory operation
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

**Way 2: Directly IncludeMany + ToList**

```csharp
var list222 = fsql.Select<SysModule>()
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

Case: Query Vod table, 10 data for each of category 1, category 2, and category 3

```csharp
class Vod {
    public Guid Id { get; set; }
    public int TypeId { get; set; }
}

//Define a temporary class, it can also be a DTO
class Dto {
    public int TypeId { get; set; }
    public List<Vod> Vods { get; set; }
}

var dto = new [] { 1,2,3 }.Select(a => new Dto { TypeId = a }).ToList();
dto.IncludeMany(fsql, d => d.Vods.Take(10).Where(vod => vod.TypeId == d.TypeId));

//After execution, each element.Vods of DTO will only have 10 records
```

## Reference

- [《Query from Multi Tables》](Query-from-Multi-Tablea)
- [《Return Data》](Return-Data)
- [《LinqToSql》](Linq-to-Sql)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)