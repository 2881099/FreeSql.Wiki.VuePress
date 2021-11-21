# Cascade Saving

The cascade save function can save the one-to-many or many-to-many navigation properties when saving the object. This document introduces cascading saving to avoid misuse by developers.

## One-to-Many Cascade Saving

Method 1: Save intact, compare the existing data in the table, and calculate the added, modified, and deleted data

```csharp
var repo = fsql.GetRepository<T>();
repo.Insert(item);
repo.SaveMany(item, "Childs");
```

- It is possible to delete the existing data in the table, confirm?
- When the Childs property is Empty, delete all the table data of Childs in the item, confirm?
- When saving Topics, the subordinate collection properties of Childs\[0-..\] are not saved, only the current level of Topics. Confirm?

Method 2: Additional save, do not delete the existing data in the table

```csharp
var repo = fsql.GetRepository<T>();
repo.DbContextOptions.EnableAddOrUpdateNavigateList = true; //Need to be opened manually
repo.Insert(item);
```
- Do not delete the existing data in the table, confirm?
- When the Childs property is Empty, do nothing, confirm?
- When saving Childs, the subordinate collection properties of Childs\[0-..\] will also be saved, _down 18 levels_, confirm?

> _Down 18 levels_ is, the navigation properties that exist in the navigation properties, in which there are navigation properties.

> The navigation properties of the navigation properties are retrieved layer by layer, and the InsertOrUpdate operation is performed together.

## Many-to-Many Cascade Saving

There is only one mechanism: complete preservation.

> Enabling the `EnableAddOrUpdateNavigateList` option or `SaveMany` is a complete save.

---

Test 1: Additional Save OneToMany

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
    var repo = fsql.GetRepository<CagetoryParent>();
    repo.DbContextOptions.EnableAddOrUpdateNavigateList = true;
    var cts = new[] {
        new CagetoryParent
        {
            Name = "Category1",
            Childs = new List<CagetoryParent>(new[]
            {
                new CagetoryParent { Name = "Category1_1" },
                new CagetoryParent { Name = "Category1_2" },
                new CagetoryParent { Name = "Category1_3" }
            })
        },
        new CagetoryParent
        {
            Name = "Category2",
            Childs = new List<CagetoryParent>(new[]
            {
                new CagetoryParent { Name = "Category2_1" },
                new CagetoryParent { Name = "Category2_2" }
            })
        }
    };
    repo.Insert(cts);
    //Perform table creation and insert data:
    //INSERT INTO "EAUNL_OTMP_CT"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f', 'Category1', '00000000-0000-0000-0000-000000000000'), ('5d90afcb-ed57-f6f4-0082-cb6c5b531b3e', 'Category2', '00000000-0000-0000-0000-000000000000')
    //INSERT INTO "EAUNL_OTMP_CT"("Id", "Name", "ParentId") VALUES('5d90afcb-ed57-f6f4-0082-cb6d0c1c5f1a', 'Category1_1', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6e74bd8eef', 'Category1_2', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb6f6267cc5f', 'Category1_3', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afcb-ed57-f6f4-0082-cb7057c41d46', 'Category2_1', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'), ('5d90afcb-ed57-f6f4-0082-cb7156e0375e', 'Category2_2', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
    cts[0].Name = "Category11";
    cts[0].Childs.Clear();
    cts[1].Name = "Category22";
    cts[1].Childs.Clear();
    repo.Update(cts);
    //UPDATE "EAUNL_OTMP_CT" SET "Name" = CASE "Id" 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN 'Category11' 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN 'Category22' END 
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //After Childs.Clear, the delete sub-collection operation is not executed, indicating that a complete comparison has not been made
    cts[0].Name = "Category111";
    cts[0].Childs.Clear();
    cts[0].Childs.Add(new CagetoryParent { Name = "Category1_33" });
    cts[1].Name = "Category222";
    cts[1].Childs.Clear();
    cts[1].Childs.Add(new CagetoryParent { Name = "Category2_22" });
    repo.Update(cts);
    //UPDATE "EAUNL_OTMP_CT" SET "Name" = CASE "Id" 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f' THEN 'Category111' 
    //WHEN '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e' THEN 'Category222' END 
    //WHERE ("Id" IN ('5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f','5d90afcb-ed57-f6f4-0082-cb6c5b531b3e'))
    //INSERT INTO "EAUNL_OTMP_CT"("Id", "Name", "ParentId") VALUES('5d90afe8-ed57-f6f4-0082-cb725df546ea', 'Category1_33', '5d90afcb-ed57-f6f4-0082-cb6b78eaaf9f'), ('5d90afe8-ed57-f6f4-0082-cb7338a6214c', 'Category2_22', '5d90afcb-ed57-f6f4-0082-cb6c5b531b3e')
}
```

Test 2: Additional Save ManyToMany

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
        new Tag { TagName = "Pop" },
        new Tag { TagName = "Modern music" },
        new Tag { TagName = "Next-generation music" },
        new Tag { TagName = "Rock" }
    };
    var ss = new[]
    {
        new Song
        {
            Name = "Take Me To Your Heart.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[1]
            })
        },
        new Song
        {
            Name = "Kiss Me More.mp3",
            Tags = new List<Tag>(new[]
            {
                tags[0], tags[2]
            })
        }
    };
    var repo = fsql.GetRepository<Song>();
    repo.DbContextOptions.EnableAddOrUpdateNavigateList = true;
    repo.Insert(ss);
    //INSERT INTO "EAUNL_MTM_SONG"("Id", "Name") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', 'Take Me To Your Heart.mp3'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', 'Kiss Me More.mp3')
    //INSERT INTO "EAUNL_MTM_TAG"("Id", "TagName") VALUES('5d90fdb7-6a6b-2c58-00c8-37991ead4f05', 'Pop'), ('5d90fdbd-6a6b-2c58-00c8-379a0432a09c', 'Modern music')
    //INSERT INTO "EAUNL_MTM_SONGTAG"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37974177440d', '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "EAUNL_MTM_TAG"("Id", "TagName") VALUES('5d90fdcc-6a6b-2c58-00c8-379b5af59d25', 'Next-generation music')
    //INSERT INTO "EAUNL_MTM_SONGTAG"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdb7-6a6b-2c58-00c8-37991ead4f05'), ('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')

    ss[0].Name = "Take Me To Your Heart.mp5";
    ss[0].Tags.Clear();
    ss[0].Tags.Add(tags[0]);
    ss[1].Name = "Kiss Me More.mp5";
    ss[1].Tags.Clear();
    ss[1].Tags.Add(tags[3]);
    repo.Update(ss);
    //UPDATE "EAUNL_MTM_SONG" SET "Name" = CASE "Id" 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN 'Take Me To Your Heart.mp5' 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN 'Kiss Me More.mp5' END 
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))

    //SELECT a."SongId", a."TagId" 
    //FROM "EAUNL_MTM_SONGTAG" a 
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')

    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d' AND "TagId" = '5d90fdbd-6a6b-2c58-00c8-379a0432a09c')
    //INSERT INTO "EAUNL_MTM_TAG"("Id", "TagName") VALUES('5d90febd-6a6b-2c58-00c8-379c21acfc72', 'Rock')

    //SELECT a."SongId", a."TagId" 
    //FROM "EAUNL_MTM_SONGTAG" a 
    //WHERE (a."SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdb7-6a6b-2c58-00c8-37991ead4f05' OR "SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197' AND "TagId" = '5d90fdcc-6a6b-2c58-00c8-379b5af59d25')
    //INSERT INTO "EAUNL_MTM_SONGTAG"("SongId", "TagId") VALUES('5d90fdb3-6a6b-2c58-00c8-37987f29b197', '5d90febd-6a6b-2c58-00c8-379c21acfc72')

    ss[0].Name = "Take Me To Your Heart.mp4";
    ss[0].Tags.Clear();
    ss[1].Name = "Kiss Me More.mp4";
    ss[1].Tags.Clear();
    repo.Update(ss);
    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37974177440d')
    //DELETE FROM "EAUNL_MTM_SONGTAG" WHERE ("SongId" = '5d90fdb3-6a6b-2c58-00c8-37987f29b197')

    //UPDATE "EAUNL_MTM_SONG" SET "Name" = CASE "Id" 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37974177440d' THEN 'Take Me To Your Heart.mp4' 
    //WHEN '5d90fdb3-6a6b-2c58-00c8-37987f29b197' THEN 'Kiss Me More.mp4' END 
    //WHERE ("Id" IN ('5d90fdb3-6a6b-2c58-00c8-37974177440d','5d90fdb3-6a6b-2c58-00c8-37987f29b197'))
}
```
