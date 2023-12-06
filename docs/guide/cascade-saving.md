# 级联保存

实践发现，N 对 1 不适合做级联保存，例如：保存 Topic 的时候把 Categate 信息也保存？自下向上保存的功能太不可控了。因此下面只讲 OneToOne/OneToMany/ManyToMany 级联保存。

## SaveMany 手工保存

完整保存指定的导航属性，对比表已存在的数据，计算出添加、修改、删除执行。

```csharp
var repo = fsql.GetRepository<Type>();
var type = new Type
{
    name = "c#",
    Topics = new List<Topic>(new[]
    {
        new Topic { ... }
    })
};
repo.Insert(type);
repo.SaveMany(type, "Topics"); //手工完整保存 Topics
```

- SaveMany 仅支持 OneToMany、ManyToMany 导航属性
- 只保存 Topics，不向下递归追朔
- 当 Topics 为 Empty 时，删除 type 存在的 Topics 所有表数据
- ManyToMany 完整对比保存中间表，外部表只追加不更新

多对多举例：

- 本表 Song
- 外部表 Tag
- 中间表 SongTag

## EnableCascadeSave 仓储级联保存

> 本功能是较早时期实现的，可移步了解最新的[《聚合根仓储》](aggregateroot.md)级联机制

DbContext/Repository EnableCascadeSave 可实现保存对象的时候，递归追朔其 OneToOne、OneToMany、ManyToMany 导航属性也一并保存，本文档说明实现的机制防止误用。

1、OneToOne 级联保存

> v3.2.606+ 支持，并且支持[级联删除功能](delete.md#ibaserepository-级联删除)

2、OneToMany 追加或更新子表，不删除子表已存在的数据

```csharp
repo.DbContextOptions.EnableCascadeSave = true; //需要手工开启
repo.Insert(type);
```

- 不删除 Topics 子表已存在的数据
- 当 Topics 属性为 Empty 时，不做任何操作
- 保存 Topics 的时候，还会保存 Topics\[0-..\] 的下级集合属性，向下 18 层

> 向下 18 层的意思，比如【类型】表，下面有集合属性【文章】，【文章】下面有集合属性【评论】。

> 保存【类型】表对象的时候，他会向下检索出集合属性【文章】，然后如果【文章】被保存的时候，再继续向下检索出集合属性【评论】。一起做 InsertOrUpdate 操作。

3、ManyToMany 完整对比保存中间表，外部表只追加不更新

完整对比保存中间表，对比【多对多】中间表已存在的数据，计算出添加、修改、删除执行。

---

测试 1：追加保存 OneToMany

```csharp

class Cagetory
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    public Guid ParentId { get; set; }
    [Navigate(nameof(ParentId))]
    public List<Cagetory> Childs { get; set; }
}
public void TestOneToManyParent()
{
    var repo = fsql.GetRepository<Cagetory>();
    repo.DbContextOptions.EnableCascadeSave = true;
    var cts = new[]
    {
        new Cagetory
        {
            Name = "分类1",
            Childs = new List<Cagetory>(new[]
            {
                new Cagetory { Name = "分类1_1" },
                new Cagetory { Name = "分类1_2" },
                new Cagetory { Name = "分类1_3" }
            })
        },
        new Cagetory
        {
            Name = "分类2",
            Childs = new List<Cagetory>(new[]
            {
                new Cagetory { Name = "分类2_1" },
                new Cagetory { Name = "分类2_2" }
            })
        }
    };
    repo.Insert(cts);
    //执行创建表，和插入数据：
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f', '分类1', '00000000-0000-0000-0000-000000000000'), ('5d90afcb-ed57-f6f4-0082-cb6c5b531b3e', '分类2', '00000000-0000-0000-0000-000000000000')
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6d0c1c5f1a', '分类1_1', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6e74bd8eef', '分类1_2', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6f6267cc5f', '分类1_3', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb7057c41d46', '分类2_1', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'), ('5d90afcb-ed57-f6f4-0082-cb7156e0375e', '分类2_2', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
    cts[0].Name = "分类11";
    cts[0].Childs.Clear();
    cts[1].Name = "分类22";
    cts[1].Childs.Clear();
    repo.Update(cts);
    //UPDATE "Cagetory" SET "Name" = CASE "Id"
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN '分类11'
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN '分类22' END
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //Childs.Clear 后没有执行删除子集合操作，说明没有做完整的对比
    cts[0].Name = "分类111";
    cts[0].Childs.Clear();
    cts[0].Childs.Add(new Cagetory { Name = "分类1_33" });
    cts[1].Name = "分类222";
    cts[1].Childs.Clear();
    cts[1].Childs.Add(new Cagetory { Name = "分类2_22" });
    repo.Update(cts);
    //UPDATE "Cagetory" SET "Name" = CASE "Id"
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN '分类111'
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN '分类222' END
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afe8-ed57-f6f4-0082-cb725df546ea', '分类1_33', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afe8-ed57-f6f4-0082-cb7338a6214c', '分类2_22', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
}
```

---

测试 2：完整保存 ManyToMany

```csharp
class Song
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Tag> Tags { get; set; }
}
class Tag
{
    public Guid Id { get; set; }
    public string TagName { get; set; }
    public List<Song> Songs { get; set; }
}
class SongTag
{
    public Guid SongId { get; set; }
    public Song Song { get; set; }
    public Guid TagId { get; set; }
    public Tag Tag { get; set; }
}

[Fact]
public void TestManyToMany()
{
    var tags = new[]
    {
        new Tag { TagName = "流行" },
        new Tag { TagName = "80后" },
        new Tag { TagName = "00后" },
        new Tag { TagName = "摇滚" }
    };
    var ss = new[]
    {
        new Song
        {
            Name = "爱你一万年.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[1]
            })
        },
        new Song
        {
            Name = "李白.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[2]
            })
        }
    };
    var repo = fsql.GetRepository<Song>();
    repo.DbContextOptions.EnableCascadeSave = true;
    repo.Insert(ss);
    //INSERT INTO "Song"("Id", "Name") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', '爱你一万年.mp3'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '李白.mp3')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90fdb7-6a6b-2c58-00c8-37991ead4f05', '流行'), ('5d90fdbd-6a6b-2c58-00c8-379a0432a09c', '80后')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90fdcc-6a6b-2c58-00c8-379b5af59d25', '00后')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')

    ss[0].Name = "爱你一万年.mp5";
    ss[0].Tags.Clear();
    ss[0].Tags.Add(tags[0]);
    ss[1].Name = "李白.mp5";
    ss[1].Tags.Clear();
    ss[1].Tags.Add(tags[3]);
    repo.Update(ss);
    //UPDATE "Song" SET "Name" = CASE "Id"
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN '爱你一万年.mp5'
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN '李白.mp5' END
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))

    //SELECT a."SongId", a."TagId"
    //FROM "SongTag" a
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')

    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d' AND "TagId" = '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90febd-6a6b-2c58-00c8-379c21acfc72', '摇滚')

    //SELECT a."SongId", a."TagId"
    //FROM "SongTag" a
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdb7-6a6b-2c58-00c8-37991ead4f05' OR "SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90febd-6a6b-2c58-00c8-379c21acfc72')

    ss[0].Name = "爱你一万年.mp4";
    ss[0].Tags.Clear();
    ss[1].Name = "李白.mp4";
    ss[1].Tags.Clear();
    repo.Update(ss);
    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')
    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //UPDATE "Song" SET "Name" = CASE "Id"
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN '爱你一万年.mp4'
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN '李白.mp4' END
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))
}
```
