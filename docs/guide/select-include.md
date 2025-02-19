# 贪婪加载 ✨

## 1、子表ToList

```csharp
//最多执行3次 SQL
fsql.Select<Song>().ToList(a => new
{
    all = a,
    list1 = fsql.Select<T2>().ToList(),
    list2 = fsql.Select<T2>().Where(b => b.SongId == a.Id).ToList()
});

//分组之后，最多执行3次 SQL
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

接下来的内容，严重依赖[【导航属性】](navigate-attribute.md)的正确配置，请先学会再继续向下！

## 2、导航属性 ManyToOne/OneToOne

Include 最终使用 Left Join 的方式（查询一次）返回多表记录。

```csharp
fsql.Select<Tag>().Include(a => a.Parent.Parent).ToList();

fsql.Select<Tag>().Where(a => a.Parent.Parent.Name == "1").ToList();
//这样写，不需要再标记 Include，解析表达式时自动处理
```

## 3、集合属性 OneToMany/ManyToMany/PgArrayToMany

IncludeMany 最终在 ToList 之后再查询子表的方式（总共查询两次）返回多表记录。

```csharp
fsql.Select<Tag>().IncludeMany(a => a.Songs).ToList();
```

## 4、IncludeMany 增强

第二次查询 then 修饰：

```csharp
fsql.Select<Tag>().IncludeMany(a => a.Songs,
    then => then.Where(b => b.User == "admin")).ToList();
//ISelect<Song> then 可以继续向下 Include/IncludeMany，支持向下 100 层
```

1对多 没有配置导航关系，也可以贪婪加载：

```csharp
fsql.Select<Tag>().IncludeMany(a => a.TestManys.Where(b => b.TagId == a.Id));
```

只查询每个子集合的前几条数据：

```csharp
fsql.Select<Tag>().IncludeMany(a => a.TestManys.Take(10));
```

子集合返回部分字段：

```csharp
fsql.Select<Tag>().IncludeMany(a => a.TestManys.Select(b => new TestMany { Title = b.Title ... }));
```

## 5、IncludeMany 扩展方法

当主数据已存在内存中，子数据怎么加载？所以我们增加了 List\<T\> 扩展方法，示例如下：

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

## 6、IncludeMany 两种方式对比

方式一（IncludeMany 扩展方法）：

```csharp
var list = fsql.Select<SysModule>()
    .Page(1, 10)
    .ToList(a => new { Id = a.Id }) //查询数据 id
    .Select(a => new SysModule { Id = a.Id }).ToList() //内存操作
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

方式二（直接 IncludeMany + ToList）：

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

案例：查询 Vod 表，分类 1、分类 2、分类 3 各 10 条数据

```csharp
class Vod
{
    public Guid Id { get; set; }
    public int TypeId { get; set; }
}

//定义临时类，也可以是 Dto 类
class Dto
{
    public int TypeId { get; set; }
    public List<Vod> Vods { get; set; }
}

var dto = new [] { 1,2,3 }.Select(a => new Dto { TypeId = a }).ToList();
dto.IncludeMany(fsql, d => d.Vods.Take(10).Where(vod => vod.TypeId == d.TypeId));

//执行后，dto 每个元素.Vods 将只有 10条记录
```
