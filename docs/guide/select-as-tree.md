# 树型查询 ✨

无限级分类（父子）是一种比较常用的表设计，每种设计方式突出优势的同时也带来缺陷，如：

- 方法 1：表设计中只有 parent_id 字段，困扰：查询麻烦（本文可解决）；
- 方法 2：表设计中冗余子级 id 便于查询，困扰：添加/更新/删除的时候需要重新计算；
- 方法 3：表设计中存储左右值编码，困扰：同上；

方法 1 设计最简单，本文解决它的递归查询问题，让使用透明化。

## 父子导航属性

FreeSql 导航属性之中，有针对父子关系的设置方式，如下：

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

定义 Parent 属性，在表达式中可以这样：

```csharp
fsql.Select<Area>().Where(a => a.Parent.Parent.Parent.Name == "中国").First();
```

定义 Childs 属性，在表达式中可以这样（子查询）：

```csharp
fsql.Select<Area>().Where(a => a.Childs.Any(c => c.Name == "北京")).First();
```

定义 Childs 属性，还可以使用【级联保存】、【贪婪加载】等等操作。

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

## 1、ToTreeList

配置好父子属性之后，就可以这样用了：

```csharp
var t1 = fsql.Select<Area>().ToTreeList();
Assert.Single(t1);
Assert.Equal("100000", t1[0].Code);
Assert.Equal("110000", t1[0].Childs[0].Code);
Assert.Equal("110100", t1[0].Childs[0].Childs[0].Code);
Assert.Equal("110101", t1[0].Childs[0].Childs[1].Code);
```

ToList 查询数据是平面的，ToTreeList 将返回的平面数据在内存加工为树型 List 返回。

## 2、AsTreeCte 递归删除

MySql 连接字符串需要增加 `Allow User Variables=True`，否则会有 `MySqlException Parameter '@cte ids' must be defined`

很常见的无限级分类表功能，删除树节点时，把子节点也处理一下。

```csharp
fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte()
    .ToDelete()
    .ExecuteAffrows(); //删除 中国 下的所有记录
```

如果软删除：

```csharp
fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte()
    .ToUpdate()
    .Set(a => a.IsDeleted, true)
    .ExecuteAffrows(); //软删除 中国 下的所有记录
```

## 3、AsTreeCte 递归查询

若不做数据冗余的无限级分类表设计，递归查询少不了，AsTreeCte 正是解决递归查询的封装，方法参数说明：

| 参数                 | 描述                                                              |
| -------------------- | ----------------------------------------------------------------- |
| (可选) pathSelector  | 路径内容选择，可以设置查询返回：中国 -> 北京 -> 东城区            |
| (可选) up            | false(默认)：由父级向子级的递归查询，true：由子级向父级的递归查询 |
| (可选) pathSeparator | 设置 pathSelector 的连接符，默认：->                              |
| (可选) level         | 设置递归层级                                                      |

> 通过测试的数据库：MySql8.0、SqlServer、PostgreSQL、Oracle、Sqlite、Firebird、DuckDB、达梦、人大金仓、南大通用、翰高

姿势一：AsTreeCte() + ToTreeList

```csharp
var t2 = fsql.Select<Area>()
    .Where(a => a.Name == "中国")
    .AsTreeCte() //查询 中国 下的所有记录
    .OrderBy(a => a.Code)
    .ToTreeList(); //非必须，也可以使用 ToList（见姿势二）
Assert.Single(t2);
Assert.Equal("100000", t2[0].Code);
Assert.Single(t2[0].Childs);
Assert.Equal("110000", t2[0].Childs[0].Code);
Assert.Equal(2, t2[0].Childs[0].Childs.Count);
Assert.Equal("110100", t2[0].Childs[0].Childs[0].Code);
Assert.Equal("110101", t2[0].Childs[0].Childs[1].Code);
// WITH "as_tree_cte"
// as
// (
// SELECT 0 as cte_level, a."Code", a."Name", a."ParentCode"
// FROM "Area" a
// WHERE (a."Name" = '中国')

// union all

// SELECT wct1.cte_level + 1 as cte_level, wct2."Code", wct2."Name", wct2."ParentCode"
// FROM "as_tree_cte" wct1
// INNER JOIN "Area" wct2 ON wct2."ParentCode" = wct1."Code"
// )
// SELECT a."Code", a."Name", a."ParentCode"
// FROM "as_tree_cte" a
// ORDER BY a."Code"
```

姿势二：AsTreeCte() + ToList

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
//执行的 SQL 与姿势一相同
```

姿势三：AsTreeCte(pathSelector) + ToList

设置 pathSelector 参数后，如何返回隐藏字段？

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
// WITH "as_tree_cte"
// as
// (
// SELECT 0 as cte_level, a."Name" || '[' || a."Code" || ']' as cte_path, a."Code", a."Name", a."ParentCode"
// FROM "Area" a
// WHERE (a."Name" = '中国')

// union all

// SELECT wct1.cte_level + 1 as cte_level, wct1.cte_path || ' -> ' || wct2."Name" || '[' || wct2."Code" || ']' as cte_path, wct2."Code", wct2."Name", wct2."ParentCode"
// FROM "as_tree_cte" wct1
// INNER JOIN "Area" wct2 ON wct2."ParentCode" = wct1."Code"
// )
// SELECT a."Code" as1, a."Name" as2, a."ParentCode" as5, a.cte_level as6, a.cte_path as7
// FROM "as_tree_cte" a
// ORDER BY a."Code"
```

> 更多姿势...请根据代码注释进行尝试
