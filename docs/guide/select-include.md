# 贪婪加载✨

## 1、导航属性 ManyToOne

ManyToOne 导航属性通过 ToList(includeNestedMembers: false) 加载，参数说明：

false: 返回 2级 Join 的导航数据（默认）；

true: 返回所有层级深度 Join 的导航数据（未使用的导航数据不会返回）；

```csharp
Select<Tag>().Include(a => a.Parent.Parent).ToList(true);

Select<Tag>().Where(a => a.Parent.Parent.Name == "1").ToList(true);
//这样写，不需要再标记 Join，解析表达式时自动处理成 LeftJoin
```

## 2、导航属性 OneToMany/ManyToMany

IncludeMany 贪婪加载集合的导航属性，其实是分两次查询，在 ToList 后进行了数据重装。

```csharp
Select<Tag>().IncludeMany(a => a.Songs).ToList();
```

IncludeMany 有第二个参数，可以进行二次查询前的修饰工作。

```csharp
Select<Tag>().IncludeMany(a => a.Songs, 
    then => then.Where(song => song.User == "admin")).ToList();
```

其实在 then 那里，还可以继续进行向下 Include/IncludeMany。只要你喜欢，向下 100 层都没问题。

## 3、变异

没有配置导航关系，也可以贪婪加载。

```csharp
Select<Tag>().IncludeMany(a => a.TestManys.Where(b => b.TagId == a.Id));
```

只查询每项子集合的前几条数据，避免像EfCore加载所有数据导致IO性能低下（比如某商品下有2000条评论）。

```csharp
Select<Tag>().IncludeMany(a => a.TestManys.Take(10));
```

子集合返回部分字段，避免字段过多的问题。

```csharp
Select<Tag>().IncludeMany(a => a.TestManys.Select(b => new TestMany { Title = b.Title ... }));
```

## 4、IncludeMany 扩展方法

当主数据已存在内存中，子数据怎么加载？所以我们增加了 List\<T\> 扩展方法，示例如下：

```csharp
new List<Song>(new[] { song1, song2, song3 })
    .IncludeMany(fsql, a => a.Tags);
```

```c#
new List<Song>(new[] { song1, song2, song3 })
    .IncludeMany(
        orm: fsql, 
        property: "Tags", 
        where: "ParentId=Code", 
        take: 5, 
        select: "id,name"
    );
//v3.2.x
```

## 5、IncludeMany 两种方式对比

方式一（IncludeMany 扩展方法）：

```csharp
var list111 = fsql.Select<SysModule>()
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

案例：查询 Vod 表，分类1、分类2、分类3 各10条数据

```csharp
class Vod {
    public Guid Id { get; set; }
    public int TypeId { get; set; }
}

//定义临时类，也可以是 Dto 类
class Dto {
    public int TypeId { get; set; }
    public List<Vod> Vods { get; set; }
}

var dto = new [] { 1,2,3 }.Select(a => new Dto { TypeId = a }).ToList();
dto.IncludeMany(fsql, d => d.Vods.Take(10).Where(vod => vod.TypeId == d.TypeId));

//执行后，dto 每个元素.Vods 将只有 10条记录
```
