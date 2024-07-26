Here is the translated document:

---

# Cascade Save

The following content heavily relies on the correct configuration of [Navigation Properties](navigate-attribute.md), so please ensure you understand that first before proceeding!

- **Topic**: Articles table
- **Category**: Categories table
- **Comment**: Comments table
- **Tag**: Tags table
- **ManyToOne**: Topic (many) related to Category (one)
- **OneToOne**: Topic (one) related to Content (one)
- **OneToMany**: Topic (one) related to Comments (many)
- **ManyToMany**: Topic (many) related to Tags (many)

Cascade saving is not suitable for ManyToOne relationships because it is unreasonable to save the Category every time you save a Topic (consider the reasons). Therefore, only OneToOne, OneToMany, and ManyToMany cascade saving will be discussed below.

> If you do not understand the above content, please read it several times!

## Enabling the Feature

::: code-tabs

@tab:active .NET CLI

```bash
dotnet add package FreeSql.DbContext
```

@tab .NET Framework

```bash
Install-Package FreeSql.DbContext
```

:::

> This feature was implemented in 2019 (stable). You may also refer to the 2022 release of [“Aggregate Root Repository”](aggregateroot.md) (more automatic cascade saving).

Cascade saving is disabled by default and needs to be enabled manually:

```csharp
repo.DbContextOptions.EnableCascadeSave = true;
```

## Mechanism Rules

1. **OneToOne Cascade Saving**

   > Supported from v3.2.606+, and also supports [Cascade Delete](cascade-delete.md) functionality.

2. **OneToMany**: Appending or updating child records without deleting existing child records

   ```csharp
   repo.Insert(topic);
   ```

   - Existing Comment child records are not deleted
   - When `topic.Comments` is empty, no operations are performed
   - When saving `topic.Comments`, it will also save the sub-collection properties of `topic.Comments[0-..]`, recursively down 18 levels

   > Recursively down 18 levels means, for example, the Articles table has a collection property Comments, and Comments has a collection property Sub-comments. When saving the Articles table object, it will retrieve the collection property Comments, and if Comments are saved, it will further retrieve the collection property Sub-comments, and perform InsertOrUpdate operations together.

3. **ManyToMany**: Complete comparison to save the intermediate table; external tables only append, not update

   Complete comparison saves the intermediate table by comparing existing data and performing additions, modifications, and deletions.

## Examples

### Test 1: Append Save OneToMany

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
            Name = "Category1",
            Childs = new List<Cagetory>(new[]
            {
                new Cagetory { Name = "Category1_1" },
                new Cagetory { Name = "Category1_2" },
                new Cagetory { Name = "Category1_3" }
            })
        },
        new Cagetory
        {
            Name = "Category2",
            Childs = new List<Cagetory>(new[]
            {
                new Cagetory { Name = "Category2_1" },
                new Cagetory { Name = "Category2_2" }
            })
        }
    };
    repo.Insert(cts);
    //执行创建表，和插入数据：
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f', 'Category1', '00000000-0000-0000-0000-000000000000'), ('5d90afcb-ed57-f6f4-0082-cb6c5b531b3e', 'Category2', '00000000-0000-0000-0000-000000000000')
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6d0c1c5f1a', 'Category1_1', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6e74bd8eef', 'Category1_2', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6f6267cc5f', 'Category1_3', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb7057c41d46', 'Category2_1', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'), ('5d90afcb-ed57-f6f4-0082-cb7156e0375e', 'Category2_2', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
    cts[0].Name = "Category11";
    cts[0].Childs.Clear();
    cts[1].Name = "Category22";
    cts[1].Childs.Clear();
    repo.Update(cts);
    //UPDATE "Cagetory" SET "Name" = CASE "Id"
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN 'Category11'
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN 'Category22' END
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //Childs.Clear 后没有执行删除子集合操作，说明没有做完整的对比
    cts[0].Name = "Category111";
    cts[0].Childs.Clear();
    cts[0].Childs.Add(new Cagetory { Name = "Category1_33" });
    cts[1].Name = "Category222";
    cts[1].Childs.Clear();
    cts[1].Childs.Add(new Cagetory { Name = "Category2_22" });
    repo.Update(cts);
    //UPDATE "Cagetory" SET "Name" = CASE "Id"
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN 'Category111'
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN 'Category222' END
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afe8-ed57-f6f4-0082-cb725df546ea', 'Category1_33', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afe8-ed57-f6f4-0082-cb7338a6214c', 'Category2_22', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
}
```

---

Test 2: Complete Save ManyToMany

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
        new Tag { TagName = "Pop" },
        new Tag { TagName = "1980" },
        new Tag { TagName = "2000" },
        new Tag { TagName = "Rock" }
    };
    var ss = new[]
    {
        new Song
        {
            Name = "I love you.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[1]
            })
        },
        new Song
        {
            Name = "Home.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[2]
            })
        }
    };
    var repo = fsql.GetRepository<Song>();
    repo.DbContextOptions.EnableCascadeSave = true;
    repo.Insert(ss);
    //INSERT INTO "Song"("Id", "Name") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', 'I love you.mp3'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', 'Home.mp3')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90fdb7-6a6b-2c58-00c8-37991ead4f05', 'Pop'), ('5d90fdbd-6a6b-2c58-00c8-379a0432a09c', '1980')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90fdcc-6a6b-2c58-00c8-379b5af59d25', '2000')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')

    ss[0].Name = "I love you.mp5";
    ss[0].Tags.Clear();
    ss[0].Tags.Add(tags[0]);
    ss[1].Name = "Home.mp5";
    ss[1].Tags.Clear();
    ss[1].Tags.Add(tags[3]);
    repo.Update(ss);
    //UPDATE "Song" SET "Name" = CASE "Id"
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN 'I love you.mp5'
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN 'Home.mp5' END
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))

    //SELECT a."SongId", a."TagId"
    //FROM "SongTag" a
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')

    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d' AND "TagId" = '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90febd-6a6b-2c58-00c8-379c21acfc72', 'Rock')

    //SELECT a."SongId", a."TagId"
    //FROM "SongTag" a
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdb7-6a6b-2c58-00c8-37991ead4f05' OR "SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90febd-6a6b-2c58-00c8-379c21acfc72')

    ss[0].Name = "I love you.mp4";
    ss[0].Tags.Clear();
    ss[1].Name = "Home.mp4";
    ss[1].Tags.Clear();
    repo.Update(ss);
    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')
    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //UPDATE "Song" SET "Name" = CASE "Id"
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN 'I love you.mp4'
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN 'Home.mp4' END
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))
}
```
