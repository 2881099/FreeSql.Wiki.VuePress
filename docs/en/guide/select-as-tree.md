# Tree Table ✨

Designing hierarchical data (parent-child relationships) is common in databases. Each design approach has its own strengths and weaknesses:

- **Method 1**: Only a `parent_id` field in the table. Challenge: Complex querying (this article addresses it).
- **Method 2**: Redundant child IDs in the table for easier querying. Challenge: Need to recalculate during additions/updates/deletions.
- **Method 3**: Storing left and right values for encoding. Challenge: Similar to Method 2.

Method 1 is the simplest in design. This article provides a solution for its recursive querying issue, making it transparent for use.

## Parent-Child Navigation Properties

FreeSql provides navigation properties specifically for parent-child relationships:

```csharp
public class Area
{
    [Column(IsPrimary = true)]
    public string Code { get; set; }

    public string Name { get; set; }
    public string ParentCode { get; set; }

    [Navigate(nameof(ParentCode))]
    public Area Parent { get; set; }
    [Navigate(nameof(ParentCode))]
    public List<Area> Childs { get; set; }
}
```

### Querying Parent and Child Data

**Querying Parent Data**:

```csharp
fsql.Select<Area>().Where(a => a.Parent.Parent.Parent.Name == "中国").First();
```

**Querying Child Data**:

```csharp
fsql.Select<Area>().Where(a => a.Childs.Any(c => c.Name == "北京")).First();
```

**Cascade Save Example**:

```csharp
var repo = fsql.GetRepository<Area>();
repo.DbContextOptions.EnableCascadeSave = true;
repo.Insert(new Area
{
    Code = "100000",
    Name = "中国",
    Childs = new List<Area>(new[]
    {
        new Area
        {
            Code = "110000",
            Name = "北京",
            Childs = new List<Area>(new[]
            {
                new Area{ Code="110100", Name = "北京市" },
                new Area{ Code="110101", Name = "东城区" },
            })
        }
    })
});
```

## 1. `ToTreeList`

After configuring the parent-child properties, you can use:

```csharp
var t1 = fsql.Select<Area>().ToTreeList();
Assert.Single(t1);
Assert.Equal("100000", t1[0].Code);
Assert.Equal("110000", t1[0].Childs[0].Code);
Assert.Equal("110100", t1[0].Childs[0].Childs[0].Code);
Assert.Equal("110101", t1[0].Childs[0].Childs[1].Code);
```

`ToTreeList` converts flat data into a tree structure in memory.

## 2. `AsTreeCte` Recursive Deletion

For MySQL, ensure to add `Allow User Variables=True` to the connection string to avoid `MySqlException Parameter '@cte ids' must be defined`.

Recursive deletion of tree nodes:

```csharp
fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte()
    .ToDelete()
    .ExecuteAffrows(); // Deletes all records under 中国
```

For soft deletion:

```csharp
fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte()
    .ToUpdate()
    .Set(a => a.IsDeleted, true)
    .ExecuteAffrows(); // Soft deletes all records under 中国
```

## 3. `AsTreeCte` Recursive Querying

`AsTreeCte` handles recursive queries efficiently. Parameters include:

| Parameter                  | Description                                                                   |
| -------------------------- | ----------------------------------------------------------------------------- |
| (Optional) `pathSelector`  | Path content selection; e.g., 中国 -> 北京 -> 东城区                          |
| (Optional) `up`            | false (default): Query from parent to child; true: Query from child to parent |
| (Optional) `pathSeparator` | Separator for `pathSelector`, default: ->                                     |
| (Optional) `level`         | Set recursion level                                                           |

### Examples

**Example 1: `AsTreeCte()` + `ToTreeList`**

```csharp
var t2 = fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte() // Queries all records under 中国
    .OrderBy(a => a.Code)
    .ToTreeList(); // Optional, can use ToList (see Example 2)
Assert.Single(t2);
Assert.Equal("100000", t2[0].Code);
Assert.Single(t2[0].Childs);
Assert.Equal("110000", t2[0].Childs[0].Code);
Assert.Equal(2, t2[0].Childs[0].Childs.Count);
Assert.Equal("110100", t2[0].Childs[0].Childs[0].Code);
Assert.Equal("110101", t2[0].Childs[0].Childs[1].Code);
```

**Example 2: `AsTreeCte()` + `ToList`**

```csharp
var t3 = fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte()
    .OrderBy(a => a.Code)
    .ToList();
Assert.Equal(4, t3.Count);
Assert.Equal("100000", t3[0].Code);
Assert.Equal("110000", t3[1].Code);
Assert.Equal("110100", t3[2].Code);
Assert.Equal("110101", t3[3].Code);
// Executed SQL is similar to Example 1
```

**Example 3: `AsTreeCte(pathSelector)` + `ToList`**

```csharp
var t4 = fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte(a => a.Name + "[" + a.Code + "]")
    .OrderBy(a => a.Code)
    .ToList(a => new {
        item = a,
        level = Convert.ToInt32("a.cte_level"),
        path = "a.cte_path"
    });
Assert.Equal(4, t4.Count);
Assert.Equal("100000", t4[0].item.Code);
Assert.Equal("110000", t4[1].item.Code);
Assert.Equal("110100", t4[2].item.Code);
Assert.Equal("110101", t4[3].item.Code);
Assert.Equal("中国[100000]", t4[0].path);
Assert.Equal("中国[100000] -> 北京[110000]", t4[1].path);
Assert.Equal("中国[100000] -> 北京[110000] -> 北京市[110100]", t4[2].path);
Assert.Equal("中国[100000] -> 北京[110000] -> 东城区[110101]", t4[3].path);
```

> For more examples, please refer to the code comments.
