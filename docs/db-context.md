---
layout: default
---

FreeSql.DbContext 实现类似 EFCore 使用习惯，跟踪对象状态，最终通过 SaveChanges 方法提交事务。

## 特性

- Select/Attach 快照对象，Update 只更新变化的字段；
- Add/AddRange 插入数据，适配各数据库优化执行 ExecuteAffrows/ExecuteIdentity/ExecuteInserted；
- AddOrUpdate 插入或更新；
- SaveMany 方法快速保存导航对象（一对多、多对多）；

## 安装

> dotnet add package FreeSql.DbContext

## 如何使用

0、通用方法，为啥是0？？？
```csharp
using (var ctx = fsql.CreateDbContext()) {
  //var db1 = ctx.Set<Song>();
  //var db2 = ctx.Set<Tag>();

  var item = new Song { };
  ctx.Add(item);
  ctx.SaveChanges();
}
```

> 注意：DbContext 对象多线程不安全

1、在 OnConfiguring 方法上配置与 IFreeSql 关联

```csharp
public class SongContext : DbContext {

  public DbSet<Song> Songs { get; set; }
  public DbSet<Tag> Tags { get; set; }

  protected override void OnConfiguring(DbContextOptionsBuilder builder) {
    builder.UseFreeSql(GlobalVar.fsql);
    //这里直接指定一个静态的 IFreeSql 对象即可，切勿重新 Build()
  }
  
  //每个 DbContext 只触发一次
  protected override void OnModelCreating(ICodeFirst codefirst)
  {
    codefirst.Entity<Song>(eb =>
    {
      eb.ToTable("tb_song");
      eb.Ignore(a => a.Field1);
      eb.Property(a => a.Title).HasColumnType("varchar(50)").IsRequired();
      eb.Property(a => a.Url).HasMaxLength(100);

      eb.Property(a => a.RowVersion).IsRowVersion();
      eb.Property(a => a.CreateTime).HasDefaultValueSql("current_timestamp");

      eb.HasKey(a => a.Id);
      eb.HasIndex(a => new { a.Id, a.Title }).IsUnique().HasName("idx_xxx11");

      //一对多、多对一
      eb.HasOne(a => a.Type).HasForeignKey(a => a.TypeId).WithMany(a => a.Songs);

      //多对多
      eb.HasMany(a => a.Tags).WithMany(a => a.Songs, typeof(Song_tag));
    });

    codefirst.Entity<SongType>(eb =>
    {
      eb.HasMany(a => a.Songs).WithOne(a => a.Type).HasForeignKey(a => a.TypeId);

      eb.HasData(new[]
      {
        new SongType
        {
          Id = 1,
          Name = "流行",
          Songs = new List<Song>(new[]
          {
            new Song{ Title = "真的爱你" },
            new Song{ Title = "爱你一万年" },
          })
        },
        new SongType
        {
          Id = 2,
          Name = "乡村",
          Songs = new List<Song>(new[]
          {
            new Song{ Title = "乡里乡亲" },
          })
        },
      });
    });

    codefirst.SyncStructure<SongType>();
    codefirst.SyncStructure<Song>();
  }
}

public class SongType {
  public int Id { get; set; }
  public string Name { get; set; }

  public List<Song> Songs { get; set; }
}
public class Song {
  [Column(IsIdentity = true)]
  public int Id { get; set; }
  public string Title { get; set; }
  public string Url { get; set; }
  public DateTime CreateTime { get; set; }

  public int TypeId { get; set; }
  public SongType Type { get; set; }
  public List<Tag> Tags { get; set; }

  public int Field1 { get; set; }
  public long RowVersion { get; set; }
}
public class Song_tag {
  public int Song_id { get; set; }
  public Song Song { get; set; }

  public int Tag_id { get; set; }
  public Tag Tag { get; set; }
}
public class Tag {
  [Column(IsIdentity = true)]
  public int Id { get; set; }

  public string Name { get; set; }

  public List<Song> Songs { get; set; }
}
```

使用的时候与 EFCore 类似：

```csharp
long id = 0;

using (var ctx = new SongContext()) {

  var song = new Song { };
  await ctx.Songs.AddAsync(song);
  id = song.Id;

  var adds = Enumerable.Range(0, 100)
    .Select(a => new Song { Create_time = DateTime.Now, Is_deleted = false, Title = "xxxx" + a, Url = "url222" })
    .ToList();
  await ctx.Songs.AddRangeAsync(adds);

  for (var a = 0; a < adds.Count; a++)
    adds[a].Title = "dkdkdkdk" + a;

  ctx.Songs.UpdateRange(adds);

  ctx.Songs.RemoveRange(adds.Skip(10).Take(20).ToList());

  //ctx.Songs.Update(adds.First());

  adds.Last().Url = "skldfjlksdjglkjjcccc";
  ctx.Songs.Update(adds.Last());

  //throw new Exception("回滚");

  await ctx.SaveChangesAsync();
}
```

2、注入方式使用

```csharp
public void ConfigureServices(IServiceCollection services) {
  services.AddSingleton<IFreeSql>(Fsql);
  services.AddFreeDbContext<SongContext>(options => options.UseFreeSql(Fsql));
}
```

在 mvc 中获取：

```csharp
IFreeSql _orm;
public ValuesController(SongContext songContext) {
}
```

## 优先级

OnConfiguring > AddFreeDbContext

## 说明

- DbContext 操作的数据在最后 SaveChanges 时才批量保存；
- DbContext 内所有操作，使用同一个事务；
- 当实体存在自增时，或者 Add/AddRange 的时候主键值为空，会提前开启事务；
- 支持同步/异步方法；

## 合并机制

db.Add(new Xxx());
db.Add(new Xxx());
db.Add(new Xxx());

这三步，会合并成一个批量插入的语句执行，前提是它们没有自增属性。

适用 Guid 主键，Guid 主键的值不用设置，交给 FreeSql 处理即可，空着的 Guid 主键会在插入时获取有序不重值的 Guid 值。

又比如：

db.Add(new Xxx());
db.Add(new Xxx());
db.Update(xxx);
db.Add(new Xxx());

Guid Id 的情况下，执行三次命令：前两次插入合并执行，update 为一次，后面的 add 为一次。

## 联级保存

请移步文档 [【联级保存】](cascade-saving.md)

## 实体变化事件

全局设置：

```csharp
fsql.SetDbContextOptions(opt => {
  opt.OnEntityChange = report => {
    Console.WriteLine(report);
  };
});
```

单独设置 DbContext 或者 UnitOfWork：

```csharp
var ctx = fsql.CreateDbContext();
ctx.Options.OnEntityChange = report => {
  Console.WriteLine(report);
};

var uow = fsql.CreateUnitOfWork();
uow.OnEntityChange = report => {
  Console.WriteLine(report);
};
```

参数 report 是一个 List 集合，集合元素的类型定义如下：

```csharp
public class ChangeInfo {
  public object Object { get; set; }
  public EntityChangeType Type { get; set; }
  /// <summary>
  /// Type = Update 的时候，获取更新之前的对象
  /// </summary>
  public object BeforeObject { get; set; }
}
public enum EntityChangeType { Insert, Update, Delete, SqlRaw }
```

| 变化类型 | 说明 |
| -- | -- |
| Insert | 实体对象被插入 |
| Update | 实体对象被更新 |
| Delete | 实体对象被删除 |
| SqlRaw | 执行了SQL语句 |

SqlRaw 目前有两处地方比较特殊：
- 多对多联级更新导航属性的时候，对中间表的全部删除操作；
- 通用仓储类 BaseRepository 有一个 Delete 方法，参数为表达式，而并非实体；
```csharp
int Delete(Expression<Func<TEntity, bool>> predicate);
```

DbContext.SaveChanges，或者 Repository 对实体的 Insert/Update/Delete，或者 UnitOfWork.Commit 操作都会最多触发一次该事件。
