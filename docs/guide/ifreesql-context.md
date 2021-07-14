## IFreesql 和 Context

### 两者并存

在 Freesql 中，支持 IFreesql 和 Context 两种形式，这两种形式的使用方法差异也有些大，其中 Context 跟 EFCore 的 Context 使用方式基本一致，使用简单、依赖注入方便。

而 IFreesql 支持更多细粒度的操作。在 Context 中，要删除多个行记录，必须先查询实体后，再使用 `RemoveRange()` 删除这些实体，当数据量非常大的时候，便会消耗大量时间和性能。而 IFreesql 中，支持嵌入部分 SQL ，支持细粒度的行记录操作。在 IFreesql 中批量删除、修改记录，可以使用类似 SQL 的模式：

```csharp
            await _freesql.Update<Roles>()
                .Set(x => x.IsDeleted, 1)
                .Where(x =>  x.TenantId == tenantId )
                .ExecuteAffrowsAsync();

update roles set is_deleted=1 where where tenant_id=1
```



所以往往将 IFreesql 和 Context 并存，在使用时，根据场景使用这两种方式操作数据库。



### 使用方法

在 Freesql 中，IFreesql 的创建需要定义为单例模式，示例如下：

```csharp
static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connectionString)
    .UseAutoSyncStructure(true) //自动同步实体结构到数据库
    .Build(); //请务必定义成 Singleton 单例模式
```



而 Freesql 也支持了类似 EFCore 的 Context 模式。通过引入 `FreeSql.DbContext` 库，可以使用特性、Fluent api 等配置实体映射、导航属性等，生成类似于 EFCore 的 Context 类型，然后通过依赖注入实例化使用。

通过定义 Context ，我们可以根据 EFCore 的使用习惯，快速掌握 Freesql 的使用，甚至可以直接将 EFCore Context 转为 Freesql Context，因为 Freesql Context 支持了 95% 的 EFCore Fluent api 。



下面说说如何利用 Freesql 更加方便地迁移数据库以及定义 Context。



安装 Freesql 工具：

```shell
dotnet tool install -g FreeSql.Generator
```



接着还原数据库表为实体：

```shell
FreeSql.Generator  -NameOptions 1,1,0,1 -NameSpace AuthCenter.Database.Entities -DB "MySql,data source=123.123.123.123;port=3306;user id=root;password=root;initial catalog=datab;charset=utf8;sslmode=none;max pool size=2" -FileName "{name}.cs"
```



还原的实体示例：

```csharp
	[JsonObject(MemberSerialization.OptIn), Table(Name = "roles", DisableSyncStructure = true)]
	public partial class Roles
	{

		[JsonProperty, Column(Name = "id", DbType = "bigint unsigned", IsPrimary = true)]
		public ulong Id { get; set; }

		/// <summary>
		/// 创建时间
		/// </summary>
		[JsonProperty, Column(Name = "creation_time", DbType = "bigint unsigned")]
		public ulong CreationTime { get; set; }
}
```



在 Freesql 中，实体特性优先于 Fluent api，同时 Freesql 也兼容 EFCore 的实体特性。

由于 `FreeSql.Generator` 工具很方便，我们不需要另外使用 Fluent api 去定义复杂的逻辑结构。



接着定义 Context：

```csharp
using FreeSql;

namespace My.Context
{
    public partial class AuthcenterContext : DbContext
    {
        private readonly IFreeSql iFreesql;
        public AuthcenterContext()
        {
        }

        public AuthcenterContext(IFreeSql freeSql)
        {
            iFreesql = freeSql;
        }
        
        public virtual DbSet<Roles> Roles { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            // iFreesql.xxxx 
            // 使用 iFreesql 调用 Fluent api
            builder.UseFreeSql(iFreesql);
        }

        protected override void OnModelCreating(ICodeFirst codefirst)
        {

        }
    }
}
```

> 通过这种方法，IFreesql 和 Context 中的实体及其实体特性、Fluent api 等都保持一致。



接着，在依赖注入中，将 IFreesql 和 Context 都注入。

```csharp
        public void ConfigureServices(IServiceCollection services)
        {
            IFreeSql fsql = new FreeSql.FreeSqlBuilder()
              .UseConnectionString(FreeSql.DataType.MySql, @"data source=123.123.123.123;port=3306;user id=root;password=root;initial catalog=authcenter;charset=utf8")
              .Build();
            services.AddSingleton<IFreeSql>(fsql);
            services.AddFreeDbContext<AuthcenterContext>(options => options.UseFreeSql(fsql));
        }
```



我们在类型中通过依赖注入获取到这两种服务：

```csharp
        private readonly IFreeSql _freesql;
        private readonly MyContext _context;

        public Test(IFreeSql freeSql, MyContext context)
        {
            _freesql = freeSql;
            _context = context;
        }
```



然后就可以快乐地使用 Freesql 了。