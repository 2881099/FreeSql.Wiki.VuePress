# 多表查询

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10")
    .Build(); //请务必定义成 Singleton 单例模式

class Topic {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
    public int Clicks { get; set; }
    public DateTime CreateTime { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
}
class Category {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Name { get; set; }

    public int ParentId { get; set; }
    public CategoryType Parent { get; set; }
    public List<Topic> Topics { get; set; }
}
class CategoryType {
    public int Id { get; set; }
    public string Name { get; set; }
}
```

## 1、导航属性联表

```csharp
fsql.Select<Topic>()
  .LeftJoin(a => a.Category.Id == a.CategoryId)
  .LeftJoin(a => a.Category.Parent.Id == a.Category.ParentId)
  .Where(a => a.Category.Parent.Id > 0)
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`, a__Category.`Id` as6, a__Category.`Name`, a__Category.`ParentId`
//FROM `Topic` a
//LEFT JOIN `Category` a__Category ON a__Category.`Id` = a.`CategoryId`
//LEFT JOIN `CategoryType` a__Category__Parent ON a__Category__Parent.`Id` = a__Category.`ParentId`
```

> 提示：正确配置 【导航关系】后，不需要手工调用 LeftJoin

## 2、复杂联表

```csharp
fsql.Select<Topic, Category, CategoryType>()
  .LeftJoin((a,b,c) => a.CategoryId == b.Id)
  .LeftJoin((a,b,c) => b.ParentId == c.Id)
  .Where((a,b,c) => c.Id > 0)
  .ToList((a,b,c) => new { a,b,c });

//或者
fsql.Select<Topic>().From<Category, CategoryType>((s, b, c) => s
  .LeftJoin(a => a.CategoryId == b.Id)
  .LeftJoin(a => b.ParentId == c.Id))
  .Where((a,b,c) => c.Id > 0)
  .ToList((a,b,c) => new { a,b,c });
  
//减少定义 a,b,c 写法
fsql.Select<Topic, Category, CategoryType>()
  .LeftJoin(w => w.t1.CategoryId == w.t2.Id)
  .LeftJoin(w => w.t2.ParentId == w.t3.Id)
  .Where(w => w.t3.Id > 0)
  .ToList(w => new { w.t1,w.t2,w.t3 });
  
//SELECT ...
//FROM `Topic` a
//LEFT JOIN `Category` b ON a.`CategoryId` = b.`Id`
//LEFT JOIN `CategoryType` c ON b.`ParentId` = c.`Id`
//WHERE c. `Id` > 0
```

> 经验：[一对多，分表只取最后一条记录](https://github.com/dotnetcore/FreeSql/issues/430)

## 3、WithSql

```csharp
fsql.Select<Topic, Category, CategoryType>()
  .WithSql(
      "select * from Topic where id=@id1",
      "select * from Category where id=@id2",
      null, //不设置 CategoryType 对应的 SQL
      new { id1 = 10, id2 = 11, id3 = 13 }
  )
  .LeftJoin((a,b,c) => a.CategoryId == b.Id)
  .LeftJoin((a,b,c) => b.ParentId == c.Id)
  .ToList();
//SELECT ...
//FROM ( select * from Topic where id=@id1 ) a
//LEFT JOIN ( select * from Category where id=@id2 ) b ON a.`CategoryId` = b.`Id`
//LEFT JOIN `CategoryType` c ON b.`ParentId` = c.`Id`
```

> 提示：ISelect.ToSql 可与 WithSql 配合使用

## 4、SQL联表

```csharp
fsql.Select<Topic>()
  .LeftJoin("Category b on b.Id = a.CategoryId and b.Name = @bname", new { bname = "xxx" })
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//LEFT JOIN Category b on b.Id = a.CategoryId and b.Name = @bname
```

延伸问题：SQL联表 b 表的字段如何在 ToList 中指定？

```csharp
.ToList(a => new {
  bid = Convert.ToInt32("b.Id"),
  bName = "b.Name"
})
```

## 5、子表Exists

```csharp
fsql.Select<Topic>()
  .Where(a => fsql.Select<Topic>().As("b").Where(b => b.Id == a.Id).Any())
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//WHERE (exists(SELECT 1
//    FROM `Topic` b
//    WHERE (b.`Id` = a.`Id`)
//    limit 0,1))
```

> 提示：由于子查询的实体类与上层相同，使用 As("b") 指明别名，以便区分

## 6、子表In

```csharp
fsql.Select<Topic>()
  .Where(a => fsql.Select<Topic>().As("b").ToList(b => b.Id).Contains(a.Id))
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//WHERE (((a.`Id`) in (SELECT b.`Id`
//    FROM `Topic` b)))
```

## 7、子表Join

v1.8.0+ string.Join + ToList 实现将子查询的多行结果，拼接为一个字符串，如："1,2,3,4"

```csharp
fsql.Select<Topic>().ToList(a => new {
  id = a.Id,
  concat = string.Join(",", fsql.Select<StringJoin01>().ToList(b => b.Id))
});
//SELECT a.`Id`, (SELECT group_concat(b.`Id` separator ',') 
//    FROM `StringJoin01` b) 
//FROM `Topic` a
```

> 提示：子查询 string.Join + ToList 适配了 sqlserver/pgsql/oracle/mysql/sqlite/firebird/达梦/金仓/南大/翰高 [#405](https://github.com/dotnetcore/FreeSql/issues/405)

## 8、子表First/Count/Sum/Max/Min/Avg

```csharp
fsql.Select<Category>().ToList(a => new  {
  all = a,
  first = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).First(b => b.Id),
  count = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Count(),
  sum = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Sum(b => b.Clicks),
  max = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Max(b => b.Clicks),
  min = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Min(b => b.Clicks),
  avg = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Avg(b => b.Clicks)
});
```

## 9、子表ToList

> v3.2.650+ 以下最多执行3次 SQL

```csharp
fsql.Select<Topic>().ToList(a => new
{
  all = a,
  list1 = fsql.Select<T2>().ToList(),
  list2 = fsql.Select<T2>().Where(b => b.TopicId == a.Id).ToList()
});

fsql.Select<Topic>()
    .GroupBy(a => new { a.Author })
    .WithTempQuery(a => new { Author = a.Key.Author, Count = a.Count() })
    .ToList(a => new {
        a.Author, a.Count,
        list1 = fsql.Select<T2>().ToList(),
        list2 = fsql.Select<T2>().Where(b => b.Author == a.Author).ToList()
    });
```

## 10、集合属性

```csharp
fsql.Select<Category>()
  .Where(a => a.Topics.Any(b => b.Title.Contains("xx"))) //v3.2.600 以下使用 a.Topics.AsSelect()
  .ToList();
```

效果等同于：

```csharp
fsql.Select<Category>()
  .Where(a => fsql.Select<Topic>().Any(b => b.Title.Contains("xx")))
  .ToList();
```

将集合属性快速转换为 ISelect 进行子查询操作。

## 11、WhereCascade

多表查询时，像isdeleted每个表都给条件，挺麻烦的。WhereCascade使用后生成sql时，所有表都附上这个条件。

如：

```csharp
fsql.Select<t1>()
.LeftJoin<t2>(...)
.WhereCascade(x => x.IsDeleted == false)
.ToList();
```

得到的 SQL：

```sql
SELECT ...
FROM t1
LEFT JOIN t2 on ... AND (t2.IsDeleted = 0) 
WHERE t1.IsDeleted = 0
```

实体可附加表达式时才生效，支持子表查询。单次查询使用的表数目越多收益越大。

可应用范围：

- 子查询，一对多、多对多、自定义的子查询；
- Join 查询，导航属性、自定义的Join查询；
- Include/[IncludeMany](../guide/select-include.md) 的子集合查询；

> 暂时不支持【延时属性】的广播；

> 此功能和【过滤器】不同，用于单次多表查询条件的传播；
