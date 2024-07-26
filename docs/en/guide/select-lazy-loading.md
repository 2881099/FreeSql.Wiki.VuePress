# Lazy Loading

FreeSql supports lazy loading, which loads data from the database only when needed. It supports one-to-one, many-to-one, one-to-many, and many-to-many navigation properties.

**Caution:** Misuse of lazy loading can lead to multiple interactions with the database, which can degrade performance. Use it carefully.

For example, you can display the detailed order information only when browsing a particular order. You need to add the `virtual` keyword to the navigation properties in the model.

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

> Lazy loading is disabled by default. Enable it where you declare it before using it.
>
> Lazy loading functionality relies on the FreeSql.Extensions.LazyLoading package. Please download it from NuGet.

```csharp
new FreeSql.FreeSqlBuilder()
    ...
    .UseLazyLoading(true) // Enable lazy loading
    ...

var order1 = fsql.Select<Order>().Where(a => a.OrderID == 1).ToOne(); // Query the order table
var details1 = order.OrderDetails; // First access, query the database
var details2 = order.OrderDetails; // Second access, no query
var order2 = details1[0].Order; // At this point, no database query for Order, because OrderDetails is already populated
```

Console output:

```sql
SELECT a.`OrderID`, a.`OrderTitle`, a.`CustomerName`, a.`TransactionDate`
FROM `Order` a
WHERE (a.`OrderID` = 1)
LIMIT 0,1

SELECT a.`DetailId`, a.`OrderId`
FROM `OrderDetail` a
WHERE (a.`OrderId` = 1)
```

FreeSql lazy loading supports one-to-one, many-to-one, one-to-many, and many-to-many relationships. The first three relationships are similar in size. Below we specifically introduce many-to-many relationships.

## Many-to-Many Lazy Loading

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

In the example above, there are three tables: Song, Tag, and their relationship table.

```csharp
var songs = fsql.Select<Song>().Limit(10).ToList(); // Retrieve 10 songs
var tags1 = songs[0].Tags; // First access, query the database
var tags2 = Songs[0].Tags; // Second access, no query
```

Console output:

```sql
SELECT a.`Id`, a.`Create_time`, a.`Is_deleted`, a.`Title`, a.`Url`
FROM `Song` a
LIMIT 0,10

SELECT a.`Id`, a.`Parent_id`, a.`Ddd`, a.`Name`
FROM `Tag` a
WHERE (EXISTS(SELECT 1
FROM `Song_tag` b
WHERE (b.`Song_id` = 2 AND b.`Tag_id` = a.`Id`)
LIMIT 0,1))
```

## Summary

**Advantages:** Data is loaded only when needed, avoiding the inefficiencies caused by complex outer joins, indexes, and views.

**Trap:** Misuse can result in multiple database interactions, reducing performance. Use with caution, use with caution, use with caution.

If you need to use data within a loop, use eager loading. Otherwise, use lazy loading.