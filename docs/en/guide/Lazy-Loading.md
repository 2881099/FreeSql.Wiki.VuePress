# Lazy Loading
FreeSql supports lazy loading of navigation properties, that is, data is loaded (read) when we need it. It supports navigation properties of _One-to-One_, _Many-to-One_, _One-to-Many_, and _Many-to-Many_ relationships.

When we want to query a certain order information and display its corresponding order detailed records, we hope to use lazy loading to achieve. This not only speeds up the reading speed, but also avoids loading unnecessary data. Lazy loading is usually used for _foreach loop_ queries.

When we are defining the _Model_, we need to add the `virtual` keyword in front of the properties. As follows:

```csharp
public class Order {
    [Column(IsPrimary = true)]
    public int OrderID { get; set; }
    public string OrderTitle { get; set; }
    public string CustomerName { get; set; }
    public DateTime TransactionDate { get; set; }
    public virtual List<OrderDetail> OrderDetails { get; set; }
}
public class OrderDetail {
    [Column(IsPrimary = true)]
    public int DetailId { get; set; }

    public int OrderId { get; set; }
    public virtual Order Order { get; set; }
}
```

> The Lazy Loading function is _turn-off_ by default. When using this function, please turn it on at the place of declaration.

> Lazy loading function depends on _FreeSql.Extensions.LazyLoading_ package, please go to NuGet to download.

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    .UseLazyLoading(true) //Enable Lazy Loading
    .UseMonitorCommand(
        cmd => Console.WriteLine(cmd.CommandText)) //Monitor SQL commands before execution
     //Be sure to define as singleton mode
    .Build(); 

var order = fsql.Select<Order>().Where(a => a.OrderID == 1).ToOne(); //Query from Order table
var orderDetail1 = order.OrderDetails; //First visit, query the database
var orderDetail2 = order.OrderDetails; //Second visit, do not query from the database
var order1 = orderDetail1.FirstOrDefault(); //Access the navigation properties without querying the database at this time. Because this property is already populated when OrderDetails is queried
```
Console output:

```sql
SELECT a.`OrderID`, a.`OrderTitle`, a.`CustomerName`, a.`TransactionDate` 
FROM `Order` a 
WHERE (a.`OrderID` = 1) 
limit 0,1

SELECT a.`DetailId`, a.`OrderId` 
FROM `OrderDetail` a 
WHERE (a.`OrderId` = 1)
```

FreeSql lazy loading supports navigation properties of _One-to-One_, _Many-to-One_, _One-to-Many_, and _Many-to-Many_ relationships. The first three are similar. We separately introduce the _Many-to-Many_ relationship.

## Many-to-Many Lazy Loading

```csharp
public partial class Song {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public DateTime? Create_time { get; set; }
    public bool? Is_deleted { get; set; }
    public string Title { get; set; }
    public string Url { get; set; }

    public virtual ICollection<Tag> Tags { get; set; }
}
public partial class Song_tag {
    public int Song_id { get; set; }
    public virtual Song Song { get; set; }

    public int Tag_id { get; set; }
    public virtual Tag Tag { get; set; }
}
public partial class Tag {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public int? Parent_id { get; set; }
    public virtual Tag Parent { get; set; }

    public decimal? Ddd { get; set; }
    public string Name { get; set; }

    public virtual ICollection<Song> Songs { get; set; }
}
```

As above, there are three tables: **Song**, **Tag**, and their relationship table.

```csharp
var songs = fsql.Select<Song>().Limit(10).ToList(); //Take 10 pieces of song
var songs1 = songs.First().Tags; //First visit, query the database
var songs2 = Songs.First().Tags; //Second visit, do not query from the database
```

Console output:

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

## Summary

Advantages: Load data only when needed, without pre-planning, avoiding the inefficiency problems caused by various complicated outer joins, indexes, and view operations.

Defect: Interacting with DB many times, performance degradation.

If you want to use data in a loop, use [Greed Loading](Greed-Loading), otherwise use **Lazy Loading**.

## Reference

- [《Query from Multi Tables》](Query-from-Multi-Tablea)
- [《Return Data》](Return-Data)
- [《Repository Layer》](Repository-Layer)
- [《Filters and Global Filters》](Filters-and-Global-Filters)
- [《FreeSql Optimization: Lazy Loading》](Lazy-Loading)
- [《FreeSql Optimization: Greed Loading》](Greed-Loading)
- [《Expression Function》](Expression-Function)
