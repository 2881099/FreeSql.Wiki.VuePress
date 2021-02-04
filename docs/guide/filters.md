# 过滤器
FreeSql 基础层实现了 Select/Update/Delete 可设置的全局过滤器功能。

```csharp
public static AsyncLocal<Guid> TenantId { get; set; } = new AsyncLocal<Guid>();

fsql.GlobalFilter
    .Apply<TestAddEnum>("test1", a => a.Id == TenantId.Value)
    .Apply<AuthorTest>("test2", a => a.Id == 111)
    .Apply<AuthorTest>("test3", a => a.Name == "11")
    .ApplyIf<TestAddEnum>("test4", () => TenantId.Value != Guid.Empty, a => a.Id == TenantId.Value);
    //1.9.0 ApplyIf 委托的返回值(第二个参数) true 才生效
```

Apply 泛型参数可以设置为任何类型，当使用 Select/Update/Delete 方法时会进行过滤器匹配尝试（try catch）：

- 匹配成功的，将附加 where 条件；
- 匹配失败的，标记下次不再匹配，避免性能损耗；

如何禁用？

```csharp
fsql.Select<TestAddEnum>().ToList(); //所有生效
fsql.Select<TestAddEnum>().DisableGlobalFilter("test1").ToList(); //禁用 test1
fsql.Select<TestAddEnum>().DisableGlobalFilter().ToList(); //禁用所有
```

fsql.Update/Delete 方法效果同上。

# 仓储过滤器

> 注意：仓储过滤器属于早期功能，如果 fsql.GlobalFilter 够用的话，可以跳过以下内容。

FreeSql.Repository 也实现了过滤器功能，它在查询时过滤，删除/修改/插入篇还会进行验证数据，避免数据安全问题。

> 注意：仓储的过滤器与 IFreeSql.GlobalFilter 不是一个功能，可以同时生效。

> 推荐使用 IFreeSql.GlobalFilter。仓储过滤器在早期出的功能，会一直保留。

每个仓储实例都有 IDataFilter 属性，可利用其完成过滤器管理，它是独立的修改后不影响全局。

```csharp
public interface IDataFilter<TEntity> where TEntity : class {
    IDataFilter<TEntity> Apply(string filterName, Expression<Func<TEntity, bool>> filterAndValidateExp);

    IDisposable Enable(params string[] filterName);
    IDisposable EnableAll();

    IDisposable Disable(params string[] filterName);
    IDisposable DisableAll();

    bool IsEnabled(string filterName);
}
```

## 临时禁用

```csharp
using (repo1.DataFilter.Disable("test")) {
    //在这段中，repo1 之 test 过滤器失效
}

//repo1 之 test 过滤器重新生效
```

## 过滤与验证

假设我们有User(用户)、Topic(主题)两个实体，在领域类中定义了两个仓储：

```csharp
var userRepository = fsql.GetGuidRepository<User>();
var topicRepository = fsql.GetGuidRepository<Topic>();
```

在开发过程中，总是担心 topicRepository 的数据安全问题，即有可能查询或操作到其他用户的主题。因此我们在v0.0.7版本进行了改进，增加了 filter lambda 表达式参数。

```csharp
var userRepository = fsql.GetGuidRepository<User>(a => a.Id == 1);
var topicRepository = fsql.GetGuidRepository<Topic>(a => a.UserId == 1);
```

* 在查询/修改/删除时附加此条件，从而达到不会修改其他用户的数据；
* 在添加时，使用表达式验证数据的合法性，若不合法则抛出异常；

## 全局过滤器

全局过滤器，可帮助实现“软删除”、“租户”等设计，目前使用 AspNetCore 注入的方式实现的全局过滤器。

```csharp
public void ConfigureServices(IServiceCollection services) {
    
    services.AddSingleton<IFreeSql>(Fsql);
    services.AddFreeRepository(filter => filter
        .Apply<ISoftDelete>("SoftDelete", a => a.IsDeleted == false)
        .Apply<ITenant>("Tenant", a => a.TenantId == 1)
        .Apply<ITenant>("Song", a => a.TenantId == 1)
        ,
        this.GetType().Assembly
    );
}
```

比 abpvnext 还要方便，因为 abp 的相关实体需要实现接口 ISoftDelete、ITenant；

我们没有这个限制，只要过滤器的表达式解析成功，就算可用；

使用在任何实体上的时候，只要 [实体].IsDeleted == false 能解析能过，就算可用；

```csharp
public class xxxx {
    public int Id { get; set; }
}
public class Song {
    [Column(IsIdentity = true)]
    public int Id { get; set; }
    public string Title { get; set; }
}
//在控制器使用
public SongsController(IBaseRepository<Song> repo1, IBaseRepository<xxxx> repos2) {
    //在此打断点，调试
}
```

第一次请求：

repo1.Select.ToSql()
```
"SELECT a."Id", a."Title"  FROM "Song" a WHERE (a."Title" = strftime('%Y-%m-%d %H:%M.%f',datetime(current_timestamp,'localtime')) || 21)"
```
repos2.Select.ToSql()
```
"SELECT a."Id"  FROM "xxxx" a"
```
第二次请求：

repo1.Select.ToSql()
```
"SELECT a."Id", a."Title"  FROM "Song" a  WHERE (a."Title" = strftime('%Y-%m-%d %H:%M.%f',datetime(current_timestamp,'localtime')) || 4)"
```
repos2.Select.ToSql()
```
"SELECT a."Id"  FROM "xxxx" a"
```
//禁用过滤器
repo1.DataFilter.Disable("test")

repo1.Select.ToSql()
```
 "SELECT a."Id", a."Title"  FROM "Song" a"
```

1、注入的变量值在使用时有了动态变化，每次获取时都是新的（Thread.CurrentThread.ManagedThreadId）；

2、设定的全局过滤，若某实体不存在表达式函数中的字段时，不会生效（如上xxxx不存在Title）；

3、使用 DataFilter.Disable("test") 可临时关闭过滤器的效果，使用 DataFilter.Enable("test") 可重新开启；

4、仓储对象创建时，从全局过滤器copy进来，然后自己管理自己。修改后不影响其他或全局设置。
