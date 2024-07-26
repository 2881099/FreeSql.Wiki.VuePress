---
title:  PostgreSQL
---

<!-- # FreeSql.Provider.PostgreSQL -->

nuget 安装：FreeSql.Provider.PostgreSQL

## 数组、字典

PostgreSQL 数据类型丰富，支持 int[]、string[] 数组类型，Dictionary<string, string> 字典类型。

```csharp
class model
{
    public int id { get; set; }
    public int[] tagIds { get; set; } //映射数组
    public string[] tagNames { get; set; }
    
    public Dictionary<string, string> dict { get; set; } //映射 hstore
}

// 支持索引查询
fsql.Select<model>().Where(a => a.tagIds.Contains(100)).ToList();
fsql.Select<model>().Where(a => a.dict.ContainsKey("key1")).ToList();
```

参考资料：[《PostgreSQL Array 数组类型与 FreeSql 打出一套【组合拳】》](https://www.cnblogs.com/FreeSql/p/16351417.html)

## JSONB

PostgreSQL JSON 类型的查询性能不输 mongodb，适合做动态结构的数据存储场景。

FreeSql.Provider.PostgreSQL 默认使用 Newtonsoft.Json.Linq 映射 jsonb 类型，如下三种均可：

```csharp
class model
{
    public JToken jsonb1 { get; set; }
    public JObject jsonb2 { get; set; }
    public JArray jsonb3 { get; set; }
}

// 支持索引查询
fsql.Select<model>().Where(a => a.jsonb1.ContainsKey("key1")).ToList();
//SQL: WHERE coalesce(a.jsonb1, '{}') ? 'key1'

fsql.Select<model>().Where(a => a.jsonb2["key1"].ContainsKey("key2")).ToList();
//SQL: WHERE coalesce(a.jsonb2->key1, '{}') ? 'key2'

fsql.Select<model>().Where(a => a.jsonb2.Contains(JToken.Parse("{key1:'xxx'}")).ToList();
//SQL: WHERE coalesce(a.jsonb2, '{}') @> '{"key1":'xxx'}'::jsonb

fsql.Select<model>().Where(a => a.jsonb2["key1"]["key2"].ToString() == "xxx").ToList();
//SQL: WHERE (a.jsonb2->key1->key2)::text = 'xxx'

fsql.Select<model>().Where(a => int.Parse(a.jsonb2["key1"]["key2"].ToString()) > 100).ToList();
//SQL: WHERE (a.jsonb2->key1->key2)::text::int4 > 100
```

| lambda 表达式树函数 | PostgreSQL | 功能说明 |
| - | - | - |
| a.Count | jsonb_array_length(coalesce(a, '[])) | json数组类型的长度 |
| a.Any() | jsonb_array_length(coalesce(a, '[])) > 0 | json数组类型，是否为空 |
| a.Contains(b) | coalesce(a, '{}') @> b::jsonb | json中是否包含b |
| a.ContainsKey(b) | coalesce(a, '{}') ? b | json中是否包含键b |
| a.Concat(b) | coalesce(a, '{}') || b::jsonb | 连接两个json |
| JObject.Parse(a) | a::jsonb | 转化字符串为json类型 |
| a["x"]["y"] | a->x->y | json成员访问 |

更多 lambda 表达式树函数，可以看下[《表达式函数》](expression-function.md)文档，支持自定义解析。

参考资料：[《PostgreSQL pgsql jsonb 类型 POCO 访问扩展现实方案 #1071》](https://github.com/dotnetcore/FreeSql/discussions/1071)

## 空间地理类型

```csharp
NpgsqlConnection.GlobalTypeMapper.UseLegacyPostgis();
// c# 类型：Npgsql.LegacyPostgis.*

// 或者
// NpgsqlConnection.GlobalTypeMapper.UseNetTopologySuite();
// c# 类型：NetTopologySuite.Geometries.*

var fsql = new FreeSqlBuilder()
    .UseConnectionString(DataType.PostgreSQL, @"Host=192.168.164.10;Port=5432;Username=postgres;Password=123456;Database=tedb;ArrayNullabilityMode=Always;Pooling=true;Maximum Pool Size=2")
    .UseNameConvert(FreeSql.Internal.NameConvertType.ToLower)
    .Build();

class model
{
    public int ogc_fid { get; set; }
    public PostgisPoint geometry { get; set; }
}
```

> 注意 NpgsqlConnection.GlobalTypeMapper.UseLegacyPostgis(); 与 FreeSqlBuilder 的顺序

参考资料：

- [《PostgreSQL 空间地理类型，自定义解析方案 #1422》](https://github.com/dotnetcore/FreeSql/discussions/1422)
- [《PostgreSQL 特别类型映射》](type-mapping.md#postgresql-%E7%89%B9%E5%88%AB%E7%B1%BB%E5%9E%8B%E6%98%A0%E5%B0%84)

## 时序数据库

timescaledb 是 postgresql的一个插件，一个开源的时间序列数据库，为快速获取和复杂查询进行了优化。它执行的是“完整的SQL”，相应地很容易像传统的关系数据库那样使用。

## 增删改 PgCopy

```csharp
fsql.Insert(items)
    .ExecutePgCopy();

fsql.Update<T>.SetSource(items)
    .ExecutePgCopy(); //临时表 + MERGE INTO

fsql.InsertOrUpdate<T>.SetSource(items)
    .ExecutePgCopy(); //临时表 + MERGE INTO
```