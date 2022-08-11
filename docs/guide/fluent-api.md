---
title: 流式接口
tag:
  - Fluent API
  - ConfigEntity
  - Entity
  - IEntityTypeConfiguration
---

## 支持 Fluent API

FreeSql 提供了 Fluent Api 的方式,使用链式调用，可在外部配置实体的数据库特性。`Fluent Api` 的方法命名与特性名保持一致，共三种使用方法，选择**一种即可**：

> fsql 是一个 IFreeSql 对象、配置尽量只执行一次，避免性能损耗 参考：[《实体特性说明》](entity-attribute.md)

## ConfigEntity

```csharp
fsql.CodeFirst
    .ConfigEntity<TestFluenttb1>(a =>
    {
        a.Name("xxdkdkdk1");
        a.Property(b => b.Id).Name("Id22").IsIdentity(true);
        a.Property(b => b.name).DbType("varchar(100)").IsNullable(true);
    })
    .ConfigEntity<TestFluenttb2>(a =>
    {
        a.Name("xxdkdkdk2");
        a.Property(b => b.Id).Name("Id22").IsIdentity(true);
        a.Property(b => b.name).DbType("varchar(100)").IsNullable(true);
    });

//以下为实体类
class TestFluenttb1 {
    public int Id { get; set; }
    public string name { get; set; } = "defaultValue";
}

[Table(Name = "cccccdddwww")]
class TestFluenttb2 {
    public int Id { get; set; }
    public string name { get; set; } = "defaultValue";
}
```

> FreeSql.DbContext v1.4.0+ 实现了 EfCore FluentApi 99% 相似的语法

## Entity

```csharp
fsql.CodeFirst.Entity<Song>(eb => {
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

fsql.CodeFirst.Entity<SongType>(eb => {
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

    public int Field1 { get; set; }
    public long RowVersion { get; set; }
}
```

## IEntityTypeConfiguration

以继承接口`IEntityTypeConfiguration`形式配置实体的。

- .NET Framework4.0 不支持

### 实体配置类

```csharp
public class SongConfiguration : IEntityTypeConfiguration<Song>
{
    public void Configure(EfCoreTableFluent<Song> eb)
    {
        eb.ToTable("tb_song1");
        eb.Ignore(a => a.Field1);
        eb.Property(a => a.Title).HasColumnType("varchar(50)").IsRequired();
        eb.Property(a => a.Url).HasMaxLength(100);

        eb.Property(a => a.RowVersion).IsRowVersion();
        eb.Property(a => a.CreateTime).HasDefaultValueSql("current_timestamp");

        eb.HasKey(a => a.Id);
        eb.HasIndex(a => a.Title).IsUnique().HasName("idx_tb_song1111");

        //一对多、多对一
        eb.HasOne(a => a.Type).HasForeignKey(a => a.TypeId).WithMany(a => a.Songs);

        //多对多
        eb.HasMany(a => a.Tags).WithMany(a => a.Songs, typeof(Song_tag));
    }
}

```

### 二种使用方式

1.单个配置

```csharp
fsql.CodeFirst.ApplyConfiguration(new SongConfiguration());
```

2.批量配置

```csharp
fsql.CodeFirst.ApplyConfigurationsFromAssembly(typeof(SongConfiguration).Assembly);
```

## 优先级

数据库特性 > 实体特性 > FluentApi（配置特性） > Aop（配置特性）
