# Aggregate Root

<style>

</style>

`FreeSql.DbContext` defines the `IBaseRepository<T>` repository interface, which, while supporting cascading save and delete functions, requires manual determination of when to enable and use these features.

Although this may look like EF, there are key differences, primarily in how cascading boundaries are set. For example, we allow `OneToMany` to cascade recursively from the lower layer up, but only for queries, not for insert, update, or delete operations. The goal is to eliminate pain points from a mechanism perspective and make operations more controllable.

**`AggregateRootRepository` is a new implementation of `IBaseRepository<T>`** that leverages the characteristics of aggregate roots to implement controllable cascading additions, updates, deletions, and queries (automatic `Include/IncludeMany` during queries).

```csharp
var repository = fsql.GetAggregateRootRepository<Order>();
```

> dotnet add package FreeSql.Extensions.AggregateRoot

For feedback and discussion, visit: [https://github.com/dotnetcore/FreeSql/discussions/1235](https://github.com/dotnetcore/FreeSql/discussions/1235)

The following content heavily relies on the correct configuration of [**Navigation Properties**](navigate-attribute.md). Please learn about it before proceeding!

## Setting Boundaries

Define a primary entity class as the aggregate root and establish a safe jurisdictional boundary. During CRUD operations, everything within the boundary is treated as a whole.

Navigation properties outside the boundary will be ignored during recursive `insert, update, delete` operations:

- ManyToOne
- ManyToMany (external tables)
- PgArrayToMany

Navigation properties within the boundary will be cascaded during recursive `insert, update, delete` operations:

- OneToOne
- OneToMany
- ManyToMany (intermediate tables)

Example 1: Recursively handling all `OneToOne/OneToMany` navigation properties within the aggregate root

- OneToOne: Order <-> OrderExt
- OneToMany: Order <== OrderDetail
- OneToOne: OrderDetail <-> OrderDetailExt
- Jurisdictional boundary of aggregate root Order: Extdata, Details, Details[?].Extdata

```csharp
class Order
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Field2 { get; set; }

    public OrderExt Extdata { get; set; }

    [Navigate(nameof(OrderDetail.OrderId))]
    public List<OrderDetail> Details { get; set; }
}
class OrderExt
{
    [Key]
    public int OrderId { get; set; }
    public string Field3 { get; set; }

    public Order Order { get; set; }
}
class OrderDetail
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string Field4 { get; set; }

    public OrderDetailExt Extdata { get; set; }
}
class OrderDetailExt
{
    [Key]
    public int OrderDetailId { get; set; }
    public string Field5 { get; set; }

    public OrderDetail OrderDetail { get; set; }
}
```

Example 2: Recursively handling all `ManyToMany` navigation properties corresponding to intermediate tables within the aggregate root

- ManyToMany: Order <=> Tag
- The aggregate root Order will manage intermediate table data for `OrderTag` based on `Tags`.
- The aggregate root Order will not manage the `Tag` entity class or navigation properties extending from Tag (external tables are outside the jurisdiction).

```csharp
class Order
{
    // ..
    [Navigate(ManyToMany = typeof(OrderTag))]
    public List<Tag> Tags { get; set; }
}
class OrderTag
{
    [Key]
    public int OrderId { get; set; }
    [Key]
    public int TagId { get; set; }

    [Navigate(nameof(OrderId))]
    public Order Order { get; set; }
    [Navigate(nameof(TagId))]
    public Tag Tag { get; set; }
}
class Tag
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Name { get; set; }

    [Navigate(ManyToMany = typeof(OrderTag))]
    public List<Order> Orders { get; set; }
}
```

## Inserting Data

According to the defined boundaries, cascading insertions will automatically occur within the boundary.

```csharp
var order = new Order
{
    Field2 = "field2",
    Extdata = new OrderExt { Field3 = "field3" },
    Details = new List<OrderDetail>
    {
        new OrderDetail { Field4 = "field4_01", Extdata = new OrderDetailExt { Field5 = "field5_01" } },
        new OrderDetail { Field4 = "field4_02", Extdata = new OrderDetailExt { Field5 = "field5_02" } },
        new OrderDetail { Field4 = "field4_03", Extdata = new OrderDetailExt { Field5 = "field5_03" } },
    },
    Tags = fsql.Select<Tag>().Where(a => new [] { 1,2,3 }.Contains(a.Id)).ToList()
};
repository.Insert(order); // Cascading insert
```

- Inserts records into the Order table;
- Inserts records into the OrderExt table;
- Inserts records into the OrderDetail table;
- Inserts records into the OrderDetailExt table;
- Inserts records into the OrderTag table (will not insert records into the Tag table).

> Note: Even if `order.Tags` do not exist in the database, no records will be inserted into the Tag table.

## Querying Data

According to the defined boundaries, queries will automatically `Include/IncludeMany` content within the boundaries.

```csharp
var list = repository.Select
    .Where(a => a.Id < 10)
    .ToList();
```

This is equivalent to:

```csharp
var list = fsql.Select<Order>()
    .Include(a => a.Extdata)
    .IncludeMany(a => a.Details,
        then => then.Include(b => b.Extdata))
    .IncludeMany(a => a.Tags)
    .Where(a => a.Id < 10)
    .ToList();
```

Extending query boundaries:

> Hint: `[AggregateRootBoundary("name", Break = true)]` sets the boundary range; see below for more details.

```csharp
class OrderRepository : AggregateRootRepository<Order>
{
    public OrderRepository(IFreeSql fsql, UnitOfWorkManager uowManager) : base(uowManager?.Orm ?? fsql)
    {
        Console.WriteLine(AggregateRootUtils.GetAutoIncludeQueryStaicCode(null, fsql, typeof(Order)));
        // Console output will include Include/IncludeMany strings, equivalent to the SelectDiy code block below
    }

    public override ISelect<IFreeSql> Select => this.SelectDiy
        //.TrackToList(this.SelectAggregateRootTracking) State tracking
        .Include(a => a.Extdata)
        .IncludeMany(a => a.Details,
            then => then.Include(b => b.Extdata))
        .IncludeMany(a => a.Tags);
}
```

Overriding `Select` can allow querying data outside the boundary (e.g., ManyToOne navigation properties), but `add/update/delete` will still follow the default boundary rules.

Manually using `SelectDiy` `Include/IncludeMany` to include content, if it is less than the default boundary rules, it is recommended not to enable `state tracking` (saving data may cause inconsistencies); otherwise, it should be enabled (details can be seen in `Updating Data`).

## Deleting Data

According to the defined boundaries, cascading deletions will automatically occur within the boundary.

```csharp
repository.Delete(order);
```

- Deletes records in the OrderExt table;
- Deletes records in the OrderDetailExt table;
- Deletes records in the OrderDetail table;
- Deletes records in the OrderTag table (will not delete records in the Tag table);
- Deletes records in the Order table;

Data deletion is done recursively in memory for the `order` instance, so you need to query the repository in advance, which may have performance drawbacks with large amounts of data.

If cascading delete functionality is set in the database table's foreign key, you only need to delete records in the Order table and do not need to query in advance.

## Updating Data

According to the defined boundaries, cascading saves will automatically occur within the boundary during updates.

`repository.Attach` stores a snapshot of the data before the update (queries automatically create snapshots), which is called a copy. During `repository.Update`, the current state is compared with the copy to save changes.

```csharp
var order = repository.Select.Where(a => a.Id == 1).First(); // Automatically attached
order.Tags.Add(new Tag { Id = 4 });
order.Details.RemoveAt(1);
order.Details[0].Extdata.Field5 = "field5_01_01";
order.Field2 = "field2_02";
repository.Update(order);
```

- Adds records to the OrderTag table (will not manage Tag table records);
- Deletes records from the OrderDetail table;
- Deletes records from the OrderDetailExt table;
- Updates records in the OrderDetailExt table;
- Updates records in the Order table;

`Complete Save` first queries and then updates, which is easier to understand and ensures data consistency. However, if the content under the aggregate root is large, performance issues may arise.

Here is the translation of the document into English, keeping the Markdown format unchanged:

---

For example, the comment data under `Order` has about 1000 records, and new records are continuously added every day. Loading all records into memory and then saving them each time is too costly.

By leveraging the characteristics of comparison saving, we can indirectly implement `record appending`:

```csharp
class Order
{
    // ..
    [Navigate(nameof(OrderComment.OrderId))]
    public List<OrderComment> Comments { get; set; }
}
class OrderComment
{
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string Field6 { get; set; }
}

var order = fsql.Select<Order>()
    .Where(a => a.Id == 1)
    .First(); // Single table data
repository.Attach(order); // At snapshot time Comments is NULL/EMPTY
order.Comments = new List<OrderComment>();
order.Comments.Add(new OrderComment { Field6 = "field6_01" });
order.Comments.Add(new OrderComment { Field6 = "field6_02" });
repository.Update(order);
```

- Using fsql only queries the single table data;
- The `order` itself has not changed, so no update is made to the `Order` table record;
- Two `OrderComment` table records are added;

> Why not directly perform single-table operations on `OrderComment`???

> The answer is for you to figure out!!!

`Comparison Saving` Rule Explanation:

| Navigation Property | Snapshot   | Latest | Result                                                                 |
| ------------------- | ---------- | ------ | ---------------------------------------------------------------------- |
| OneToOne            | NULL       | Object | `Add` latest record                                                    |
| OneToOne            | Object     | NULL   | `Delete` snapshot record                                               |
| OneToOne            | Object     | Object | If content changes, `Update` latest record; otherwise, `Ignore`        |
| OneToMany           | NULL/Empty | List   | `Add` latest list records                                              |
| OneToMany           | List       | NULL   | `Ignore`                                                               |
| OneToMany           | List       | Empty  | `Delete` snapshot list records                                         |
| OneToMany           | List       | List   | `Comparison Saving` calculates `Add`, `Update`, and `Delete` behaviors |

> ManyToMany only operates on the `intermediate table` (external table is out of scope), with the comparison saving mechanism being the same as OneToMany

## Inserting or Updating Data

`InsertOrUpdate` execution logic relies on the `primary key` and `state management` of the aggregate root object, where state management stores the snapshot.

1. If the primary key is `auto-increment`:

- If no value, `Insert data`;
- If there is a value, determine state management;
  - If exists, compare with the snapshot to `Update data`;
  - If not exists, query the database; (performance issues with large content)
    - If exists, compare with the queried content to `Update data`;
    - If not exists, `Insert data`;

2. If the primary key is not auto-increment:

- If no value, `Throw exception`;
- If there is a value, same logic as above;

## Extending Boundaries

```csharp
class Order
{
    // ..
    [AggregateRootBoundary("solution_1", Break = false, BreakThen = true)]
    [AggregateRootBoundary("solution_2", Break = true)]
    [Navigate(nameof(OrderDetail.OrderId))]
    public List<OrderDetail> Details { get; set; }
}

repository.ChangeBoundary("solution_1");
```

- Break: When recursing, terminate the current navigation property
- BreakThen: When recursing, terminate further exploration

`AggregateRootBoundary` can set navigation properties within the boundary to narrow the range.

It can also set non-boundary navigation properties ManyToOne/ManyToMany/PgArrayToMany, which are only valid for queries, but will still be ignored during `Add`, `Delete`, and `Update`.

## Summary

1. **Understand Boundaries**: Understand the boundary rules presented in this document.

- ManyToOne navigation properties are `outside the boundary`;
- ManyToMany navigation properties, `intermediate table` (OrderTag) is within the boundary, `external table` (Tag) is `outside the boundary`;
- OneToOne navigation properties are within the boundary;
- OneToMany navigation properties are within the boundary;

`AggregateRootRepository` only performs recursive CRUD operations on data within the boundary, treating the aggregate root as a whole.

Special cases can inherit and override the `Select` property to expand or narrow the query content:

- Insert/Delete/Update will not perform operations on data `outside` the expanded boundary;
- Update with narrowed query content will not delete unqueried content due to navigation property values being NULL;

2. **Use Transactions Wisely**: Use transactions to solve consistency issues in operations.
