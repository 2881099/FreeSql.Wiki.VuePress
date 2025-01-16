# In多列查询，表达式自定义实现

FreeSql 基础库为了不依赖 System.ValueType.dll，所以将以下代码抽离了出来。

```csharp
//元组集合
var lst = new List<(Guid, DateTime)>();
lst.Add((Guid.NewGuid(), DateTime.Now));
lst.Add((Guid.NewGuid(), DateTime.Now));

var t2 = fsql.Select<T>()
  .Where(a => lst.Contains(a.Id, a.ct1))
  .ToList();
```

Oracle 产生如下SQL：

```sql
SELECT .. FROM ..
WHERE (a."Id", a."ct1") in (
('685ee1f6-bdf6-4719-a291-c709b8a1378f','2019-12-07 23:55:27'),
('5ecd838a-06a0-4c81-be43-1e77633b7404', '2019-12-07 23:55:27'))
```

非 ORACLE 产生如下 SQL：

```sql
SELECT .. FROM ..
WHERE (a."Id" = '685ee1f6-bdf6-4719-a291-c709b8a1378f' AND a."ct1" = '2019-12-07 23:55:27' OR
a."Id" = '5ecd838a-06a0-4c81-be43-1e77633b7404' AND a."ct1" = '2019-12-07 23:55:27')
```

> v3.2.650 使用 .Where(a => list.Any(b => b.Item1 == a. Id && b.Item2 == a. ct1))

代码实现：

```csharp
using FreeSql.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

[ExpressionCall]
public static class MyFreeSqlExpressionCall
{
    public static ThreadLocal<ExpressionCallContext> expContext = new ThreadLocal<ExpressionCallContext>();
    /// <summary>
    /// C#：从元组集合中查找 exp1, exp2 是否存在<para></para>
    /// SQL： <para></para>
    /// exp1 = that[0].Item1 and exp2 = that[0].Item2 OR <para></para>
    /// exp1 = that[1].Item1 and exp2 = that[1].Item2 OR <para></para>
    /// ... <para></para>
    /// 注意：当 that 为 null 或 empty 时，返回 1=0 <para></para>
    /// Oracle： (Id, Name) IN ((1, "name1"), (2, "name2"))
    /// </summary>
    /// <typeparam name="T1"></typeparam>
    /// <typeparam name="T2"></typeparam>
    /// <param name="that"></param>
    /// <param name="exp1"></param>
    /// <param name="exp2"></param>
    /// <returns></returns>
    public static bool Contains<T1, T2>([RawValue] this IEnumerable<(T1, T2)> that, T1 exp1, T2 exp2)
    {
        if (expContext.IsValueCreated == false || expContext.Value == null || expContext.Value.ParsedContent == null)
            return that?.Any(a => a.Item1.Equals(exp1) && a.Item2.Equals(exp2)) == true;
        if (that?.Any() != true)
        {
            expContext.Value.Result = "1=0";
            return false;
        }
        var sb = new StringBuilder();
        var idx = 0;

        switch (expContext.Value.DataType )
        {
            case FreeSql.DataType.Oracle:
            case FreeSql.DataType.OdbcOracle:
                sb.Append("(")
                    .Append(expContext.Value.ParsedContent["exp1"]).Append(", ")
                    .Append(expContext.Value.ParsedContent["exp2"])
                    .Append(") IN (");
                foreach (var item in that)
                {
                    if (idx++ > 0) sb.Append(", ");
                    sb.Append("(")
                        .Append(expContext.Value.FormatSql(FreeSql.Internal.Utils.GetDataReaderValue(typeof(T1), item.Item1))).Append(", ")
                        .Append(expContext.Value.FormatSql(FreeSql.Internal.Utils.GetDataReaderValue(typeof(T2), item.Item2)))
                        .Append(")");
                }
                sb.Append(")");

                expContext.Value.Result = sb.ToString();
                return false;
        }
        foreach (var item in that)
        {
            if (idx++ > 0) sb.Append(" OR \r\n");
            sb
                .Append(expContext.Value.ParsedContent["exp1"]).Append(" = ").Append(expContext.Value.FormatSql(FreeSql.Internal.Utils.GetDataReaderValue(typeof(T1), item.Item1)))
                .Append(" AND ")
                .Append(expContext.Value.ParsedContent["exp2"]).Append(" = ").Append(expContext.Value.FormatSql(FreeSql.Internal.Utils.GetDataReaderValue(typeof(T2), item.Item2)));
        }
        expContext.Value.Result = sb.ToString();
        return true;
    }
}
```
