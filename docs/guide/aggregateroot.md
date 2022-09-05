# 聚合根（实验室）

<style>

</style>

FreeSql.Repository 定义了 IBaseRepository\<T\> 仓储接口，实现了单表的通用仓储对象，支持了级联保存、级联删除功能，（但是）使用时需要人工自己判断何时开启、何时使用。

本文看上去像 EF，实则有区别，主要区别在级联边界的规则设定，例如我们允许 OneToMany 从下层向上递归级联，但是仅限查询，不能增删改。研究目的希望从机制上杜绝痛点，让操作变得更可控。

**AggregateRootRepository 是 IBaseRepository\<T\> 一种新的尝试实现**，它将自动处理 OneToOne/OneToMany 导航属性，以及 ManyToMany(中间表) 的级联添加、级联更新、级联删除、级联查询（查询时自动 Include/IncludeMany 它们）。

```csharp
var repository = fsql.GetAggregateRootRepository<Order>();
```

意见征集、讨论区：[https://github.com/dotnetcore/FreeSql/discussions/1235](https://github.com/dotnetcore/FreeSql/discussions/1235)

## 设定边界

将一个主要的实体类认定为聚合根，设定好安全的管辖范围（边界），CRUD 时会把边界之内的所有内容看作一个整体。

`增删改` 边界之外的导航属性，递归时会忽略：
- ManyToOne
- ManyToMany(外部表) 
- PgArrayToMany

`增删改` 边界之内的导航属性，递归时会级联操作：
- OneToOne
- OneToMany
- ManyToMany(中间表)

示例1：在聚合根内递归向下的所有 OneToOne/OneToMany 导航属性

- OneToOne: Order <-> OrderExt
- OneToMany: Order <== OrderDetail
- OneToOne: OrderDetail <-> OrderDetailExt
- 聚合根 Order 的管辖范围：Extdata、Details、Details[?].Extdata

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

示例2：在聚合根内递归向下的所有 ManyToMany 导航属性对应的中间表

- ManyToMany: Order <=> Tag
- 聚合根 Order 会根据 Tags 生成 OrderTag 中间表数据，进行管理
- 聚合根 Order 不会管理 Tag 实体类，以及 Tag 向下延申的导航属性（外部表不属于管辖范围）

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

## 插入数据

根据上面设定的边界，插入时会自动 `级联插入` 边界以内的内容。

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
repository.Insert(order); //级联插入
```

- 插入 Order 表记录；
- 插入 OrderExt 表记录；
- 插入 OrderDetail 表记录；
- 插入 OrderDetailExt 表记录；
- 插入 OrderTag 表记录；（不会插入 Tag 表记录）

> 注意：即使 order.Tags 在数据库不存在，也不会插入 Tag 表记录

## 查询数据

根据上面设定的边界，查询时会自动 `Include/IncludeMany` 边界以内的内容。

```csharp
var list = repository.Select
    .Where(a => a.Id < 10)
    .ToList();
```

效果等同于：

```csharp
var list = fsql.Select<Order>()
    .Include(a => a.Extdata)
    .IncludeMany(a => a.Details, 
        then => then.Include(b => b.Extdata))
    .IncludeMany(a => a.Tags) 
    .Where(a => a.Id < 10)
    .ToList();
```

扩展查询边界：

> 提示：\[AggregateRootBoundary("name", Break = true)\] 设置边界范围，请往后面看。。

```csharp
class OrderRepository : AggregateRootRepository<Order>
{
    public OrderRepository(IFreeSql fsql, UnitOfWorkManager uowManager) : base(uowManager?.Orm ?? fsql)
    {
        Console.WriteLine(AggregateRootUtils.GetAutoIncludeQueryStaicCode(null, fsql, typeof(Order)));
        //控制台输出一块 Include/IncludeMany 字符串，内容与下方 SelectDiy 代码块相同
    }

    public override ISelect<IFreeSql> Select => this.SelectDiy
        //.TrackToList(this.SelectAggregateRootTracking) 状态跟踪
        .Include(a => a.Extdata)
        .IncludeMany(a => a.Details, 
            then => then.Include(b => b.Extdata))
        .IncludeMany(a => a.Tags);
}
```

重写 Select 可以把边界以外的数据一起查询出来（例如 ManyToOne 导航属性），但是 `添加/修改/删除` 仍然采用默认边界规则

手工使用 SelectDiy Include/IncludeMany 包含内容，如果小于默认边界规则，则建议不要开启 `状态跟踪` （保存数据可能造成不一致），反之则应该开启。（详细请往后看 `更新数据`）

## 删除数据

根据上面设定的边界，删除时会自动 `级联删除` 边界以内的内容。

```csharp
repository.Delete(order);
```

- 删除 OrderExt 表对应的记录；
- 删除 OrderDetailExt 表对应的记录；
- 删除 OrderDetail 表对应的记录；
- 删除 OrderTag 表对应的记录；（不会删除 Tag 表记录）
- 删除 Order 表对应的记录；

删除数据是在内存递归 order 实例进行的，因此需要使用 repository 提前查询，内容庞大时有性能缺陷。

如果使用了数据库外键的级联删除功能，则只需删除 Order 表对应的记录，并且不需要提前查询。

## 更新数据

根据上面设定的边界，更新时会自动 `级联保存` 边界以内的内容。

repository.Attach 存储更新前的数据快照（查询会自动快照），称为副本，repository.Update 的时候和副本进行级联对比保存。

```csharp
var order = repository.Select.Where(a => a.Id == 1).First(); //此时已自动 Attach
order.Tags.Add(new Tag { Id = 4 });
order.Details.RemoveAt(1);
order.Details[0].Extdata.Field5 = "field5_01_01";
order.Field2 = "field2_02";
repository.Update(order);
```

- 添加 OrderTag 表记录；（不会管理 Tag 表记录）
- 删除 OrderDetail 表记录；
- 删除 OrderDetailExt 表记录；
- 更新 OrderDetailExt 表记录；
- 更新 Order 表记录；

`完整保存` 先查询再更新，机制容易理解，数据一致性也更有保障。但是如果聚合根下内容较庞大，将会造成性能问题。

例如 Order 下面的评论数据大约有 1000 条，每天还不断有新的记录，每次 Load 内存再保存代价就太大了。

利用对比保存的特点，可以变向实现 `追加记录`：

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
    .First(); //单表数据
repository.Attach(order); //快照时 Comments 是 NULL/EMPTY
order.Comments = new List<OrderComment>();
order.Comments.Add(new OrderComment { Field6 = "field6_01" });
order.Comments.Add(new OrderComment { Field6 = "field6_02" });
repository.Update(order);
```

- 使用 fsql 只查询了单表数据；
- order 本身没发生变化，所以不更新 Order 表记录；
- 添加 OrderComment 表记录2条；

> 我为什么不直接对 OrderComment 进行单表操作啊？？？

> 答案你们回答！！！

`对比保存` 规则说明：

| 导航属性 | 副本 | 最新 | 结果 |
| --- | --- | --- | --- |
| OneToOne | NULL | Object | `添加` 最新 记录 |
| OneToOne | Object | NULL | `删除` 副本 记录 |
| OneToOne | Object | Object | 内容发生变化则 `更新` 最新 记录，否则 `忽略` |
| OneToMany | NULL/Empty | List | `添加` 最新 List 记录 |
| OneToMany | List | NULL | `忽略` |
| OneToMany | List | Empty | `删除` 副本 List 记录 |
| OneToMany | List | List | `对比保存` 计算出 `添加`、`更新`、`删除` 三种行为 |

> ManyToMany 只会操作 `中间表`（外部表不属于管辖范围），对比保存的机制与 OneToMany 一致

## 插入或更新数据

InsertOrUpdate 执行逻辑依托聚合根对象的 `主键` 和 `状态管理`，状态管理存储的是副本。

1、如果主键是 `自增`：

- 无值，则 `插入数据`；
- 有值，则判断 状态管理;
    * 存在，则与副本对比 `更新数据`；
    * 不存在，则查询 数据库；（内容庞大时有性能问题）
        - 存在，则与查询的内容对比 `更新数据`；
        - 不存在，则 `插入数据`；

2、如果主键不是 自增：

- 无值，则 `抛出异常`；
- 有值，逻辑同上；

## 扩展边界

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

- Break 递归时，终止当前导航属性
- BreakThen 递归时，终止下探

AggregateRootBoundary 可以设置边界之内的导航属性，缩小边界范围。

也可以设置非边界之内的导航属性 ManyToOne/ManyToMany/PgArrayToMany，仅查询有效，`增删改` 时依然会忽略它们。

## 总结

1、**理解边界**，理解本文提出的边界规则。

- ManyToOne 导航属性，是 `边界之外`；
- ManyToMany 导航属性，`中间表`（OrderTag） 是边界之内，`外部表`（Tag） 是 `边界之外`；
- OneToOne 导航属性，是边界之内；
- OneToMany 导航属性，是边界之内；

AggregateRootRepository 只对边界之内的数据进行递归 CRUD 操作，把聚合根看成一个整体。

特殊情况可以继承后重写 Select 属性扩大、或缩小查询内容：

- Insert/Delete/Update `扩大` 后的查询内容，不会对 `扩大` 后的数据进行增删改；
- Update `缩小` 后的查询内容，由于导航属性值为 NULL，不会删除未查询的内容；

2、**善用事务**，使用事务解决一致操作问题。
