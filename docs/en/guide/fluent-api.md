---
title: Fluent API
tag:
  - Fluent API
  - ConfigEntity
  - Entity
  - IEntityTypeConfiguration
---

## Fluent API Support

FreeSql offers Fluent API methods for configuring entity database features using a chain of calls. The `Fluent API` method names match the feature names and there are three ways to use it. You only need to choose one of the methods:

> `fsql` refers to an `IFreeSql` object. Configuration should generally be done only once to avoid performance issues. For more details, see: [《Entity Attributes》](entity-attribute.md).

## ConfigEntity

```csharp
fsql.CodeFirst
    .ConfigEntity<Table1>(a =>
    {
        a.Name("dbo.table1");
        a.Property(b => b.Id).Name("table1_id").IsIdentity(true);
        a.Property(b => b.Name).DbType("varchar(100)").IsNullable(true);
    })
    .ConfigEntity<Table2>(a =>
    {
        a.Name("dbo.table2");
        a.Property(b => b.Id).Name("table2_id").IsIdentity(true);
    });
```

> FreeSql.Extensions.EFModel（Labs）Implemented EFCore FluentApi code to make FreeSql effective

```csharp
fsql.CodeFirst.ApplyConfigurationFromEFCore(typeof(BloggingContext), typeof(OrderingContext));
```

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

    // One-to-many, many-to-one
    eb.HasOne(a => a.Type).HasForeignKey(a => a.TypeId).WithMany(a => a.Songs);

    // Many-to-many
    eb.HasMany(a => a.Tags).WithMany(a => a.Songs, typeof(Song_tag));
});

fsql.CodeFirst.Entity<SongType>(eb => {
    eb.HasMany(a => a.Songs).WithOne(a => a.Type).HasForeignKey(a => a.TypeId);
    eb.HasData(new[]
    {
        new SongType
        {
            Id = 1,
            Name = "Pop",
            Songs = new List<Song>(new[]
            {
                new Song{ Title = "Truly Love You" },
                new Song{ Title = "Love You Ten Thousand Years" },
            })
        },
        new SongType
        {
            Id = 2,
            Name = "Country",
            Songs = new List<Song>(new[]
            {
                new Song{ Title = "Hometown People" },
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

Configure entities by inheriting from the `IEntityTypeConfiguration` interface.

- .NET Framework 4.0 is not supported.

### Entity Configuration Class

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

        // One-to-many, many-to-one
        eb.HasOne(a => a.Type).HasForeignKey(a => a.TypeId).WithMany(a => a.Songs);

        // Many-to-many
        eb.HasMany(a => a.Tags).WithMany(a => a.Songs, typeof(Song_tag));
    }
}
```

### Two Ways to Use

1. **Single Configuration**

```csharp
fsql.CodeFirst.ApplyConfiguration(new SongConfiguration());
```

2. **Batch Configuration**

```csharp
fsql.CodeFirst.ApplyConfigurationsFromAssembly(typeof(SongConfiguration).Assembly);
```

## Priority

Database features > Entity attributes > Fluent API > Aop
