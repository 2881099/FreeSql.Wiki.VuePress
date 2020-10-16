---
layout: default
---

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10")
    .Build(); //请务必定义成 Singleton 单例模式

class Topic {
    [Column(IsIdentity = true, IsPrimary = true)]
    public int Id { get; set; }
    public int Clicks { get; set; }
    public string Title { get; set; }
    public DateTime CreateTime { get; set; }
}
```

## 分组聚合

```csharp
var list = fsql.Select<Topic>()
    .GroupBy(a => new { tt2 = a.Title.Substring(0, 2), mod4 = a.Id % 4 })
    .Having(a => a.Count() > 0 && a.Avg(a.Key.mod4) > 0 && a.Max(a.Key.mod4) > 0)
    .Having(a => a.Count() < 300 || a.Avg(a.Key.mod4) < 100)
    .OrderBy(a => a.Key.tt2)
    .OrderByDescending(a => a.Count())
    .ToList(a => new { a.Key, cou1 = a.Count(), arg1 = a.Avg(a.Value.Clicks) });
//SELECT substr(a.`Title`, 1, 2) as1, count(1) as2, avg(a.`Id`) as3 
//FROM `Topic` a 
//GROUP BY substr(a.`Title`, 1, 2), (a.`Id` % 4) 
//HAVING (count(1) > 0 AND avg((a.`Id` % 4)) > 0 AND max((a.`Id` % 4)) > 0) AND (count(1) < 300 OR avg((a.`Id` % 4)) < 100) 
//ORDER BY substr(a.`Title`, 1, 2), count(1) DESC
```

> 不分组求聚合值，请使用 ToAggregate 替代 ToList

## API

| 方法 | 返回值 | 参数 | 描述 |
| ------------- | - | - | - |
| ToSql | string | | 返回即将执行的SQL语句 |
| ToList\<T\> | List\<T\> | Lambda | 执行SQL查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表 |
| ToList\<T\> | List\<T\> | string field | 执行SQL查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表 |
| ToAggregate\<T\> | List\<T\> | Lambda | 执行SQL查询，返回指定字段的聚合结果（适合不需要 GroupBy 的场景） |
| Sum | T | Lambda | 指定一个列求和 |
| Min | T | Lambda | 指定一个列求最小值 |
| Max | T | Lambda | 指定一个列求最大值 |
| Avg | T | Lambda | 指定一个列求平均值 |
| 【分组】 |
| GroupBy | \<this\> | Lambda | 按选择的列分组，GroupBy(a => a.Name) | GroupBy(a => new{a.Name,a.Time}) |
| GroupBy | \<this\> | string, parms | 按原生sql语法分组，GroupBy("concat(name, ?cc)", new { cc = 1 }) |
| Having | \<this\> | string, parms | 按原生sql语法聚合条件过滤，Having("count(name) = ?cc", new { cc = 1 }) |
| 【成员】 |
| Key | | | 返回 GroupBy 选择的对象 |
| Value | | | 返回主表 或 From\<T2,T3....\> 的字段选择器 |
