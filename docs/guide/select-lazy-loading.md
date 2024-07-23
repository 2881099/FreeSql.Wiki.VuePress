# 延时加载

FreeSql 支持延时加载，当需要用到的时候才加载（读数据库），支持 1对1、多对 1、1对多、多对多导航属性。

陷阱：延时加载功能的滥用，会造成多次与 DB 交互，性能降低，请谨慎。

例如：浏览某条订单信息的时候，才显示其对应的订单详细数据，只需要在 Model 导航属性前面添加 virtual 关键字。

```csharp
public class Order
{
    [Column(IsPrimary = true)]
    public int OrderID { get; set; }
    public string OrderTitle { get; set; }
    public string CustomerName { get; set; }
    public DateTime TransactionDate { get; set; }
    public virtual List<OrderDetail> OrderDetails { get; set; }
}
public class OrderDetail
{
    [Column(IsPrimary = true)]
    public int DetailId { get; set; }

    public int OrderId { get; set; }
    public virtual Order Order { get; set; }
}
```

> 延时加载功能默认被关闭的，使用此功能之前，请在声明处开启；

> 延时加载功能，依赖 FreeSql.Extensions.LazyLoading 包，请前往 nuget 下载；

```csharp
new FreeSql.FreeSqlBuilder()
    ...
    .UseLazyLoading(true) //开启延时加载功能
    ...

var order1 = fsql.Select<Order>().Where(a => a.OrderID == 1).ToOne(); //查询订单表
var details1 = order.OrderDetails; //第一次访问，查询数据库
var details2 = order.OrderDetails; //第二次访问，不查
var order2 = details1[0].Order; //此时不查数据库 Order，因为 OrderDetails 查询出来的时候已填充了该属性
```

控制台输出内容：

```sql
SELECT a.`OrderID`, a.`OrderTitle`, a.`CustomerName`, a.`TransactionDate`
FROM `Order` a
WHERE (a.`OrderID` = 1)
limit 0,1

SELECT a.`DetailId`, a.`OrderId`
FROM `OrderDetail` a
WHERE (a.`OrderId` = 1)
```

FreeSql 延时加载支持 1对1、多对 1、1对多、多对多关系的导航属性，前三者大小同异，以下我们单独介绍多对多关系。

## 多对多延时加载

```csharp
public partial class Song
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public DateTime? Create_time { get; set; }
    public bool? Is_deleted { get; set; }
    public string Title { get; set; }
    public string Url { get; set; }

    public virtual ICollection<Tag> Tags { get; set; }
}
public partial class Song_tag
{
    public int Song_id { get; set; }
    public virtual Song Song { get; set; }

    public int Tag_id { get; set; }
    public virtual Tag Tag { get; set; }
}
public partial class Tag
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public int? Parent_id { get; set; }
    public virtual Tag Parent { get; set; }

    public decimal? Ddd { get; set; }
    public string Name { get; set; }

    public virtual ICollection<Song> Songs { get; set; }
}
```

如上有三个表，音乐、标签，以及他们的关系表。

```csharp
var songs = fsql.Select<Song>().Limit(10).ToList(); //取10条音乐
var tags1 = songs[0].Tags; //第一次访问，查询数据库
var tags2 = Songs[0].Tags; //第二次访问，不查
```

控制台输出内容：

```sql
SELECT a.`Id`, a.`Create_time`, a.`Is_deleted`, a.`Title`, a.`Url`
FROM `Song` a
limit 0,10

SELECT a.`Id`, a.`Parent_id`, a.`Ddd`, a.`Name`
FROM `Tag` a
WHERE (exists(SELECT 1
FROM `Song_tag` b
WHERE (b.`Song_id` = 2 AND b.`Tag_id` = a.`Id`)
limit 0,1))
```

## 总结

优点：只在需要的时候加载数据，不需要预先计划，避免了各种复杂的外连接、索引、视图操作带来的低效率问题。

陷阱：滥用会造成多次与 DB 交互，性能降低，谨慎使用，谨慎使用，谨慎使用。

如果要在循环中使用数据，请使用贪婪加载，否则使用懒加载。
