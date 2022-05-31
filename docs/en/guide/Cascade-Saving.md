# Cascade Saving

## Savemany save manually

Save completely, compare the existing data in the table, and calculate the execution of addition, modification and deletion.

Recursive saving of navigation attributes is unsafe and uncontrollable. It is not a technical problem, but for security reasons. It provides a way to save navigation attributes manually and completely.

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
repo.SaveMany(type, "Topics"); ////Manually and completely save topics
```

-SaveMany only supports onetomany and manytomany navigation properties
-Save only topics, not downward recursive tracing
-When topics is empty, delete all table data of topics existing in type, and confirm?
-The manytomany mechanism is to completely compare and save the intermediate table, and only append the external table without updating

For example:

-This table song
-External table tag
-Intermediate table Songtag

## EnableCascadeSave warehouse cascade save

Dbcontext / repository EnableCascadeSave can realize recursive tracing and save the OneToOne/OneToMany/ManyToMany navigation attributes when saving objects. This document describes the mechanism to prevent misuse.

1. Onetoone cascade save

> v3.2.606 + support, and support [cascade deletion function](Delete-Data.md#cascade-deletion-of-ibaserepository)

2. Onetomany appends or updates the sub table without deleting the existing data of the sub table

```csharp
repo. DbContextOptions. EnableCascadeSave = true; // Manual opening required
repo. Insert(type);
```

-Do not delete the existing data in the topics sub table. Are you sure?
-When the topics attribute is empty, do not do anything. Confirm?
-When you save topics, you will also save the subordinate collection properties of topics \ [0 -.. \]. Go down to 18 layers and confirm?

> For example, in the [type] table, there is set attribute [article] below and set attribute [comment] below [article].

> When saving the [type] table object, it will retrieve the set attribute [article], and then if the [article] is saved, it will continue to retrieve the set attribute [comment]. Do insertorupdate operation together.

3. Manytomany completely compares and saves the intermediate table and appends the external table

Compare and save the intermediate table completely, compare the existing data of the [many to many] intermediate table, and calculate the execution of addition, modification and deletion.

Append external tables, only append without updating.

-This table song
-External table tag
-Intermediate table Songtag

---

Test 1: append and save OneToMany

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
            Name = "class1",
            Childs = new List<Cagetory>(new[]
            {
                new Cagetory { Name = "class1_1" },
                new Cagetory { Name = "class1_2" },
                new Cagetory { Name = "class1_3" }
            })
        },
        new Cagetory
        {
            Name = "class2",
            Childs = new List<Cagetory>(new[]
            {
                new Cagetory { Name = "class2_1" },
                new Cagetory { Name = "class2_2" }
            })
        }
    };
    repo.Insert(cts);
    //To create a table and insert data:
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f', 'class1', '00000000-0000-0000-0000-000000000000'), ('5d90afcb-ed57-f6f4-0082-cb6c5b531b3e', 'class2', '00000000-0000-0000-0000-000000000000')
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6d0c1c5f1a', 'class1_1', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6e74bd8eef', 'class1_2', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6f6267cc5f', 'class1_3', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb7057c41d46', 'class2_1', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'), ('5d90afcb-ed57-f6f4-0082-cb7156e0375e', 'class2_2', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
    cts[0].Name = "class11";
    cts[0].Childs.Clear();
    cts[1].Name = "class22";
    cts[1].Childs.Clear();
    repo.Update(cts);
    //UPDATE "Cagetory" SET "Name" = CASE "Id"
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN 'class11'
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN 'class22' END
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //Childs.Clear After that, the operation of deleting subsets was not performed, indicating that no complete comparison was made
    cts[0].Name = "class111";
    cts[0].Childs.Clear();
    cts[0].Childs.Add(new Cagetory { Name = "class1_33" });
    cts[1].Name = "class222";
    cts[1].Childs.Clear();
    cts[1].Childs.Add(new Cagetory { Name = "class2_22" });
    repo.Update(cts);
    //UPDATE "Cagetory" SET "Name" = CASE "Id"
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN 'class111'
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN 'class222' END
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //INSERT INTO "Cagetory"("Id", "Name", "ParentId") VALUES('5d90afe8-ed57-f6f4-0082-cb725df546ea', 'class1_33', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afe8-ed57-f6f4-0082-cb7338a6214c', 'class2_22', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
}
```

---

Test 2: Full save ManyToMany

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
        new Tag { TagName = "pop music" },
        new Tag { TagName = "the post-80s generation" },
        new Tag { TagName = "the post-00s generation" },
        new Tag { TagName = "Rock music" }
    };
    var ss = new[]
    {
        new Song
        {
            Name = "love you forever.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[1]
            })
        },
        new Song
        {
            Name = "Li Bai.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[2]
            })
        }
    };
    var repo = fsql.GetRepository<Song>();
    repo.DbContextOptions.EnableCascadeSave = true;
    repo.Insert(ss);
    //INSERT INTO "Song"("Id", "Name") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', 'love you forever.mp3'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', 'Li Bai.mp3')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90fdb7-6a6b-2c58-00c8-37991ead4f05', 'pop music'), ('5d90fdbd-6a6b-2c58-00c8-379a0432a09c', 'the post-80s generation')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90fdcc-6a6b-2c58-00c8-379b5af59d25', 'the post-00s generation')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')

    ss[0].Name = "love you forever.mp5";
    ss[0].Tags.Clear();
    ss[0].Tags.Add(tags[0]);
    ss[1].Name = "Li Bai.mp5";
    ss[1].Tags.Clear();
    ss[1].Tags.Add(tags[3]);
    repo.Update(ss);
    //UPDATE "Song" SET "Name" = CASE "Id"
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN 'love you forever.mp5'
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN 'Li Bai.mp5' END
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))

    //SELECT a."SongId", a."TagId"
    //FROM "SongTag" a
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')

    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d' AND "TagId" = '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "Tag"("Id", "TagName") VALUES('5d90febd-6a6b-2c58-00c8-379c21acfc72', 'Rock music')

    //SELECT a."SongId", a."TagId"
    //FROM "SongTag" a
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdb7-6a6b-2c58-00c8-37991ead4f05' OR "SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')
    //INSERT INTO "SongTag"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90febd-6a6b-2c58-00c8-379c21acfc72')

    ss[0].Name = "love you forever.mp4";
    ss[0].Tags.Clear();
    ss[1].Name = "Li Bai.mp4";
    ss[1].Tags.Clear();
    repo.Update(ss);
    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')
    //DELETE FROM "SongTag" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //UPDATE "Song" SET "Name" = CASE "Id"
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN 'love you forever.mp4'
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN 'Li Bai.mp4' END
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))
}
```
