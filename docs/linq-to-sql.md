---
layout: default
---

原本不支持 IQueryable 主要出于使用习惯的考虑，编写代码的智能总会提示出现一堆你不想使用的方法（对不起，我有强迫症），IQueryable 自身提供了一堆没法实现的方法，还有外部入侵的扩展方法，严重影响编码体验。如下图：

![image](https://user-images.githubusercontent.com/16286519/57295126-5dd7bd00-70fc-11e9-99c0-d1c46423afa2.png)

v1.4.0+ 版本请使用以下命令安装（老版本不需要安装）：

> dotnet add package FreeSql.Extensions.Linq

## 特别说明

* 请尽量不要在 ISelect 模式下的使用 Linq 方法：GroupJoin、Select、SelectMany、Join、DefaultIfEmpty；

* 如果一定要在 ISelect 中使用 .Select() 方法，请务必在 .ToList() 之前调用它；

## IQueryable

FreeSql 提供强大的数据查询对象 ISelect。

FreeSql.Extensions.Linq v1.4.0+ 实现了 IQueryable 查询对象常用功能，以便在各框架中交互使用。

```csharp
//将 ISelect 转为 IQueryable
IQueryable<Student> queryable = fsql.Select<Student>().AsQueryable();

//Linq 方法查询
var t1 = queryable.Where(a => a.id == 1).FirstOrDefault();

//将 IQueryable 还原为 ISelect
ISelect<Studeng> select = queryable.RestoreToSelect();
```

注意：IQueryable 的实现目前不支持 GroupBy，可以考虑使用 RestoreSelect 方法转回 ISelect 进行查询

## Where
```csharp
var t1 = (
    from a in fsql.Select<Student>()
    where a.id == item.id
    select a
).ToList();
```

## Select(指定字段)
```csharp
var t1 = (
    from a in fsql.Select<Student>()
    where a.id == item.id
    select new { a.id }
).ToList();
```

## CaseWhen
```csharp
var t1 = (
    from a in fsql.Select<Student>()
    where a.id == item.id
    select new {
        a.id,
        a.name,
        testsub = new {
            time = a.age > 10 ? "大于" : "小于或等于"
        }
    }
).ToList();
```

## Join
```csharp
var t1 = (
    from a in fsql.Select<Student>()
    join b in fsql.Select<School>() on a.id equals b.StudentId
    select a
).ToList();

var t2 = (
    from a in fsql.Select<Student>()
    join b in fsql.Select<School>() on a.id equals b.StudentId
    select new { a.id, bid = b.id }
).ToList();

var t3 = (
    from a in fsql.Select<Student>()
    join b in fsql.Select<School>() on a.id equals b.StudentId
    where a.id == item.id
    select new { a.id, bid = b.id }
).ToList();
```

## LeftJoin
```csharp
var t1 = (
    from a in fsql.Select<Student>()
    join b in fsql.Select<School>() on a.id equals b.StudentId into temp
    from tc in temp.DefaultIfEmpty()
    select a
).ToList();

var t2 = (
    from a in fsql.Select<Student>()
    join b in fsql.Select<School>() on a.id equals b.StudentId into temp
    from tc in temp.DefaultIfEmpty()
    select new { a.id, bid = tc.id }
).ToList();

var t3 = (
    from a in fsql.Select<Student>()
    join b in fsql.Select<School>() on a.id equals b.StudentId into temp
    from tc in temp.DefaultIfEmpty()
    where a.id == item.id
    select new { a.id, bid = tc.id }
).ToList();
```

## From(多表查询)
```csharp
var t1 = (
    from a in fsql.Select<Student>()
    from b in fsql.Select<School>()
    where a.id == b.StudentId
    select a
).ToList();

var t2 = (
    from a in fsql.Select<Student>()
    from b in fsql.Select<School>()
    where a.id == b.StudentId
    select new { a.id, bid = b.id }
).ToList();

var t3 = (
    from a in fsql.Select<Student>()
    from b in fsql.Select<School>()
    where a.id == b.StudentId
    where a.id == item.id
    select new { a.id, bid = b.id }
).ToList();
```

## GroupBy(分组)
```csharp
var t1 = (
    from a in fsql.Select<Student>()
    where a.id == item.id
    group a by new {a.id, a.name } into g
    select new {
        g.Key.id, g.Key.name,
        cou = g.Count(),
        avg = g.Avg(g.Value.age),
        sum = g.Sum(g.Value.age),
        max = g.Max(g.Value.age),
        min = g.Min(g.Value.age)
    }
).ToList();
```
