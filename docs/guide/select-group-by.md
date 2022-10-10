# 分组聚合

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10")
    .Build(); //请务必定义成 Singleton 单例模式

class Topic 
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## GroupBy分组聚合

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { tt2 = a.Title.Substring(0, 2), mod4 = a.Id % 4 })
    .Having(a => a.Count() > 0 && a.Avg(a.Key.mod4) > 0 && a.Max(a.Key.mod4) > 0)
    .Having(a => a.Count() < 300 || a.Avg(a.Key.mod4) < 100)
    .OrderBy(a => a.Key.tt2)
    .OrderByDescending(a => a.Count())
    .ToList(a => new 
    {
        a.Key, 
        cou1 = a.Count(), 
        arg1 = a.Avg(a.Value.Clicks), 
        arg2 = a.Sum(a.Value.Clicks > 100 ? 1 : 0)
    });
//SELECT 
//substr(a.`Title`, 1, 2) as1, 
//count(1) as2, 
//avg(a.`Clicks`) as3, 
//sum(case when a.`Clicks` > 100 then 1 else 0 end) as4 
//FROM `Topic` a 
//GROUP BY substr(a.`Title`, 1, 2), (a.`Id` % 4) 
//HAVING (count(1) > 0 AND avg((a.`Id` % 4)) > 0 AND max((a.`Id` % 4)) > 0) AND (count(1) < 300 OR avg((a.`Id` % 4)) < 100)
//ORDER BY substr(a.`Title`, 1, 2), count(1) DESC
```

> 不分组求聚合值，请使用 ToAggregate 替代 ToList

## 导航属性分组

假如 Topic 有导航属性 Category，Category 又有导航属性 Area，导航属性分组代码如下：

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(a => new { a.Key.Category.Area.Name });
```

注意：如上这样编写，会报错无法解析 a.Key.Category.Area.Name，解决办法使用 Include：

```csharp
var list = fsql.Select<Topic>()
    .Include(a => a.Category.Area)
    //必须添加此行，否则只分组 Category 而不包含它的下级导航属性 Area

    .GroupBy(a => new { a.Clicks, a.Category })
    .ToList(a => new { a.Key.Category.Area.Name });
```

但是，你还可以这样解决：

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { a.Clicks, a.Category, a.Category.Area })
    .ToList(a => new { a.Key.Area.Name });
```

## 多表分组

```csharp
var list = fsql.Select<Topic, Category, Area>()
    .GroupBy((a, b, c) => new { a.Title, c.Name })
    .Having(g => g.Count() < 300 || g.Avg(g.Value.Item1.Clicks) < 100)
    .ToList(g => new { count = g.Count(), Name = g.Key.Name });
```

- g.Value.Item1 对应 Topic
- g.Value.Item2 对应 Category
- g.Value.Item3 对应 Area

## Aggregate

### Distinct

```csharp
var list = fsql.Select<Topic>()
    .Aggregate(a => Convert.ToInt32("count(distinct title)"), out var count)
    .ToList();
```
> SELECT count(distinct title) as1 
FROM "Topic" a

> SELECT a."Id", a."Clicks", a."Title", a."CreateTime" 
FROM "Topic" a

### SqlExt.DistinctCount

```csharp
fsql.Select<Topic>()
    .Aggregate(a => SqlExt.DistinctCount(a.Key.Title), out var count);
```

> SELECT count(distinct a."title") as1 FROM "Topic" a

### ToAggregate + SqlExt.DistinctCount

```csharp
var distinctAggregate = fsql.Select<Topic>().ToAggregate(a => new
    {
        TitleCount = SqlExt.DistinctCount(a.Key.Title),
        ClicksCount= SqlExt.DistinctCount(a.Key.Clicks),
    }
);
```

> SELECT count(distinct a."Title") as1, count(distinct a."Clicks") as2 
FROM "Topic" a

## API

| 方法 | 返回值 | 参数 | 描述 |
| ------------- | - | - | - |
| ToSql            | string    |               | 返回即将执行的 SQL 语句                                                                                               |
| ToList\<T\>      | List\<T\> | Lambda        | 执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表                                                 |
| ToList\<T\>      | List\<T\> | string field  | 执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表 |
| ToAggregate\<T\> | List\<T\> | Lambda        | 执行 SQL 查询，返回指定字段的聚合结果（适合不需要 GroupBy 的场景）                                                    |
| Sum              | T         | Lambda        | 指定一个列求和                                                                                                        |
| Min              | T         | Lambda        | 指定一个列求最小值                                                                                                    |
| Max              | T         | Lambda        | 指定一个列求最大值                                                                                                    |
| Avg              | T         | Lambda        | 指定一个列求平均值                                                                                                    |
| 【分组】 |
| GroupBy | \<this\> | Lambda | 按选择的列分组，GroupBy(a => a.Name) | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy | \<this\> | string, parms | 按原生sql语法分组，GroupBy("concat(name, @cc)", new { cc = 1 }) |
| Having | \<this\> | string, parms | 按原生sql语法聚合条件过滤，Having("count(name) = @cc", new { cc = 1 }) |
| 【成员】 |
| Key              |           |               | 返回 GroupBy 选择的对象                                                                                               |
| Value            |           |               | 返回主表 或 From\<T2,T3....\> 的字段选择器                                                                            |
