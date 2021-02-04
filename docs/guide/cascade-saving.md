# 级联保存

联级保存功能可实现保存对象的时候，将其【OneToMany】、【ManyToMany】导航属性集合也一并保存，本文档说明实现的机制防止误用。

## OneToMany 级联保存

方式一：完整保存，对比表已存在的数据，计算出添加、修改、删除执行

```csharp
var repo = fsql.GetRepository<T>();
repo.Insert(item);
repo.SaveMany(item, "Childs");
```

- 有可能删除表已存在的数据，确认？
- 当 Childs 属性为 Empty 时，删除 item 存在的 Childs 所有表数据，确认？
- 保存 Childs 的时候，不、不、不遍历 Childs\[0-..\] 的集合属性保存，只保存 Childs 属性，确认？

方式二：追加保存，不删除表已存在的数据

```csharp
var repo = fsql.GetRepository<T>();
repo.DbContextOptions.EnableAddOrUpdateNavigateList = true; //需要手工开启
repo.Insert(item);
```
- 不删除表已存在的数据，确认？
- 当 Childs 属性为 Empty 时，不做任何操作，确认？
- 保存 Childs 的时候，还会遍历 Childs\[0-..\] 的集合属性保存，向下18层，确认？

> 向下18层的意思，比如【类型】表，下面有集合属性【文章】，【文章】下面有集合属性【评论】。

> 保存【类型】表对象的时候，他会向下检索出集合属性【文章】，然后如果【文章】被保存的时候，再继续向下检索出集合属性【评论】。一起做 InsertOrUpdate 操作。

## ManyToMany 级联保存

只有一种机制：完整保存。

> 开启 EnableAddOrUpdateNavigateList 或者 SaveMany 都是完整保存。

---

测试1：追加保存 OneToMany

```csharp
[Table(Name = "EAUNL_OTMP_CT")]
class CagetoryParent {
    public Guid Id { get; set; }
    public string Name { get; set; }

    public Guid ParentId { get; set; }
    [Navigate(nameof(ParentId))]
    public List<CagetoryParent> Childs { get; set; }
}

[Fact]
public void EnableAddOrUpdateNavigateList_OneToMany_Parent() {
    var repo = g.sqlite.GetRepository<CagetoryParent>();
    repo.DbContextOptions.EnableAddOrUpdateNavigateList = true;
    var cts = new[] {
        new CagetoryParent
        {
            Name = "分类1",
            Childs = new List<CagetoryParent>(new[]
            {
                new CagetoryParent { Name = "分类1_1" },
                new CagetoryParent { Name = "分类1_2" },
                new CagetoryParent { Name = "分类1_3" }
            })
        },
        new CagetoryParent
        {
            Name = "分类2",
            Childs = new List<CagetoryParent>(new[]
            {
                new CagetoryParent { Name = "分类2_1" },
                new CagetoryParent { Name = "分类2_2" }
            })
        }
    };
    repo.Insert(cts);
    //执行创建表，和插入数据：
    //INSERT INTO "EAUNL_OTMP_CT"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f', '分类1', '00000000-0000-0000-0000-000000000000'), ('5d90afcb-ed57-f6f4-0082-cb6c5b531b3e', '分类2', '00000000-0000-0000-0000-000000000000')
    //INSERT INTO "EAUNL_OTMP_CT"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6d0c1c5f1a', '分类1_1', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6e74bd8eef', '分类1_2', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6f6267cc5f', '分类1_3', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb7057c41d46', '分类2_1', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'), ('5d90afcb-ed57-f6f4-0082-cb7156e0375e', '分类2_2', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
    cts[0].Name = "分类11";
    cts[0].Childs.Clear();
    cts[1].Name = "分类22";
    cts[1].Childs.Clear();
    repo.Update(cts);
    //UPDATE "EAUNL_OTMP_CT" SET "Name" = CASE "Id" 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN '分类11' 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN '分类22' END 
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //Childs.Clear 后没有执行删除子集合操作，说明没有做完整的对比
    cts[0].Name = "分类111";
    cts[0].Childs.Clear();
    cts[0].Childs.Add(new CagetoryParent { Name = "分类1_33" });
    cts[1].Name = "分类222";
    cts[1].Childs.Clear();
    cts[1].Childs.Add(new CagetoryParent { Name = "分类2_22" });
    repo.Update(cts);
    //UPDATE "EAUNL_OTMP_CT" SET "Name" = CASE "Id" 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN '分类111' 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN '分类222' END 
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //INSERT INTO "EAUNL_OTMP_CT"("Id", "Name", "ParentId") VALUES('5d90afe8-ed57-f6f4-0082-cb725df546ea', '分类1_33', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afe8-ed57-f6f4-0082-cb7338a6214c', '分类2_22', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
}
```

测试2：追加保存 ManyToMany

```csharp
[Table(Name = "EAUNL_MTM_SONG")]
class Song {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Tag> Tags { get; set; }
}
[Table(Name = "EAUNL_MTM_TAG")]
class Tag {
    public Guid Id { get; set; }
    public string TagName { get; set; }
    public List<Song> Songs { get; set; }
}
[Table(Name = "EAUNL_MTM_SONGTAG")]
class SongTag {
    public Guid SongId { get; set; }
    public Song Song { get; set; }
    public Guid TagId { get; set; }
    public Tag Tag { get; set; }
}

[Fact]
public void EnableAddOrUpdateNavigateList_ManyToMany() {
    var tags = new[] {
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
    var repo = g.sqlite.GetRepository<Song>();
    repo.DbContextOptions.EnableAddOrUpdateNavigateList = true;
    repo.Insert(ss);
    //INSERT INTO "EAUNL_MTM_SONG"("Id", "Name") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', '爱你一万年.mp3'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '李白.mp3')
    //INSERT INTO "EAUNL_MTM_TAG"("Id", "TagName") VALUES('5d90fdb7-6a6b-2c58-00c8-37991ead4f05', '流行'), ('5d90fdbd-6a6b-2c58-00c8-379a0432a09c', '80后')
    //INSERT INTO "EAUNL_MTM_SONGTAG"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "EAUNL_MTM_TAG"("Id", "TagName") VALUES('5d90fdcc-6a6b-2c58-00c8-379b5af59d25', '00后')
    //INSERT INTO "EAUNL_MTM_SONGTAG"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')

    ss[0].Name = "爱你一万年.mp5";
    ss[0].Tags.Clear();
    ss[0].Tags.Add(tags[0]);
    ss[1].Name = "李白.mp5";
    ss[1].Tags.Clear();
    ss[1].Tags.Add(tags[3]);
    repo.Update(ss);
    //UPDATE "EAUNL_MTM_SONG" SET "Name" = CASE "Id" 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN '爱你一万年.mp5' 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN '李白.mp5' END 
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))

    //SELECT a."SongId", a."TagId" 
    //FROM "EAUNL_MTM_SONGTAG" a 
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')

    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d' AND "TagId" = '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "EAUNL_MTM_TAG"("Id", "TagName") VALUES('5d90febd-6a6b-2c58-00c8-379c21acfc72', '摇滚')

    //SELECT a."SongId", a."TagId" 
    //FROM "EAUNL_MTM_SONGTAG" a 
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdb7-6a6b-2c58-00c8-37991ead4f05' OR "SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')
    //INSERT INTO "EAUNL_MTM_SONGTAG"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90febd-6a6b-2c58-00c8-379c21acfc72')

    ss[0].Name = "爱你一万年.mp4";
    ss[0].Tags.Clear();
    ss[1].Name = "李白.mp4";
    ss[1].Tags.Clear();
    repo.Update(ss);
    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')
    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //UPDATE "EAUNL_MTM_SONG" SET "Name" = CASE "Id" 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN '爱你一万年.mp4' 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN '李白.mp4' END 
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))
}
```
