# 技巧：自定义解析表达式树，实现动态聚合列 sum(case when ...)

```sql
SELECT
a."Time",
v1 = sum(case when a."Id" == 1 then 1 else 0 end),
v2 = sum(case when a."Id" == 2 then 1 else 0 end),
v3 = sum(case when a."Id" == 3 then 1 else 0 end)
FROM "table" a
WHERE a."Id" IN (1,2,3)
GROUP BY a."Time"
```

如上 v1,v2,v3 是动态聚合值，如果 where IN (1,2,3,4) 那就会产生 v1-v4

正常情况下，静态的 lambda 查询没办法处理这种动态列查询。

---

变通一下，这样查询：

```sql
SELECT
a."Time",
v = sum(case when a."Id" == 1 then 1 else 0 end) + ','
    sum(case when a."Id" == 2 then 1 else 0 end) + ','
    sum(case when a."Id" == 3 then 1 else 0 end)
FROM "table" a
WHERE a."Id" IN (1,2,3)
GROUP BY a."Time"
```

如此便可以使用 FreeSql 实现：

```csharp
var ids = new int[] { 1,2,3 };
fsql.Select<table>()
    .Where(a => ids.Contains(a.Id))
    .GroupBy(a => a.Time)
    .ToList(g => new 
    {
        Time = g.Key,
        Values = MyExt.SumCase(ids, g.Value.Id)
    });
```

自定义解析表达式树，实现如下：

```csharp
[ExpressionCall]
public static class MyExt
{
    internal static ThreadLocal<ExpressionCallContext> expContext = new ThreadLocal<ExpressionCallContext>();

    public static string SumCase<TValue>([RawValue] TValue[] values, TValue column)
    {
        var ctx = expContext.Value;
        ctx.Result = ctx.Utility.CommonUtils.StringConcat(
            values.Select((val, idx) => 
                new [] {
                    ctx._commonExp._common.IsNull($"SUM(case when {ctx.ParsedContent["column"]} = {ctx.FormatSql(val)} then 1 else 0 end)", 0),
                    idx == values.Length - 1 ? "''" : "','"
                }).SelectMany(a => a).ToArray(), 
            values.Select(val => 
                new[]{
                    typeof(TValue),
                    typeof(string)
                }).SelectMany(a => a).ToArray());
        return default;
    }
}
```
