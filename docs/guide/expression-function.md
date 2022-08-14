# 表达式函数

这是 ``FreeSql`` 非常特色的功能之一，深入细化函数解析，所支持的类型基本都可以使用对应的表达式函数，例如 日期、字符串、``IN``查询、数组（``PostgreSQL``的数组）、字典（PostgreSQL HStore)等等。

## 动态Lambda表达式

- ``And``、``Or``扩展方法 [LambadaExpressionExtensions.cs](https://github.com/dotnetcore/FreeSql/blob/master/FreeSql/Extensions/LambadaExpressionExtensions.cs)

示例

```csharp
Expression<Func<T, bool>> where = null;
where = where.And(b => b.num > 0);
where = where.Or(b => b.num > 0);
```

动态拼接``Or``,通过``Or``扩展方法动态拼接``Lambda``表达式

```csharp
Expression<Func<T, bool>> where = null;
if (xxx)
{
   where = where.Or(b => b.num > 0);  
}
```

## In查询

```csharp
var t1 = fsql.Select<T>()
  .Where(a => new[] { 1, 2, 3 }.Contains(a.Id))
  .ToList();
//SELECT .. FROM ..
//WHERE (a.`Id` in (1,2,3))
```

> 已优化，防止 where in 元素多过的 SQL 错误，如：

> [Err] ORA-01795: maximum number of expressions in a list a 1000

原来：where id in (1..1333)

现在：where id in (1..500) or id in (501..1000) or id in (1001..1333)

## In多列查询

```csharp
//元组集合
vae lst = new List<(Guid, DateTime)>();
lst.Add((Guid.NewGuid(), DateTime.Now));
lst.Add((Guid.NewGuid(), DateTime.Now));

var t2 = fsql.Select<T>()
  .Where(a => lst.Contains(a.Id, a.ct1))
  .ToList();
//SELECT .. FROM ..
//WHERE (a."Id" = '685ee1f6-bdf6-4719-a291-c709b8a1378f' AND a."ct1" = '2019-12-07 23:55:27' OR 
//a."Id" = '5ecd838a-06a0-4c81-be43-1e77633b7404' AND a."ct1" = '2019-12-07 23:55:27')
```

> v3.2.650 使用 .Where(a => list.Any(b => b.Item1 == a.Id && b.Item2 == a.ct1))

> 实现代码：[In多列查询，表达式自定义实现](../extra/issues-in-valuetype.md)

## In子表

```csharp
fsql.Select<Topic>()
  .Where(a => fsql.Select<Topic>().As("b").ToList(b => b.Id).Contains(a.Id))
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//WHERE (((a.`Id`) in (SELECT b.`Id`
//    FROM `Topic` b)))
```

## Exists子表

```csharp
fsql.Select<Topic>()
  .Where(a => fsql.Select<Topic>().As("b").Where(b => b.Id == a.Id).Any())
  .ToList();
//SELECT a.`Id`, a.`Title`, a.`Clicks`, a.`CreateTime`, a.`CategoryId`
//FROM `Topic` a
//WHERE (exists(SELECT 1
//    FROM `Topic` b
//    WHERE (b.`Id` = a.`Id`)
//    limit 0,1))
```

> 提示：由于子查询的实体类与上层相同，使用 As("b") 指明别名，以便区分

## 查找今天创建的数据

```csharp
fsql.Select<T>()
  .Where(a => a.CreateTime.Date == DateTime.Today)
  .ToList();
//这行代码说明 FreeSql 表达式解析强大，不是所有 ORM 都支持

fsql.Select<T>()
  .Where(a => a.CreateTime.Between(DateTime.Today, DateTime.Today.AddDays(1)))
  .ToList();
//正常用法应该是这样
```

> SqlServer nvarchar/varchar 已兼容表达式解析，分别解析为：N'' 和 ''，优化索引执行计划；

## 日期格式化

```csharp
fsql.Select<T>()
  .First(a => a.CreateTime.ToString("HH:mm:ss");
// SELECT date_format(a.`CreateTime`, '%H:%i:%s') as1 
// FROM `xxx` a 
// limit 0,1
```

> v1.5.0 支持了常用 c# 日期格式化，yyyy MM dd HH mm ss yy M d H hh h m s tt t

> tt t 为 AM PM

## 开窗函数

```csharp
fsql.Select<T1, T2>()
.InnerJoin((a, b) => b.Id == a.Id)
.ToList((a, b) => new
{
    Id = a.Id,
    EdiId = b.Id,
    over1 = SqlExt.Rank().Over().OrderBy(a.Id).OrderByDescending(b.EdiId).ToValue()
});
```

> v1.6.0 利用自定义解析功能，增加 SqlExt.Rank().Over().PartitionBy(...)、MySql group_concat 常用函数，欢迎 PR 补充

## 子表Join

> v1.8.0+ string.Join + ToList 实现将子查询的多行结果，拼接为一个字符串，如："1,2,3,4"

```csharp
fsql.Select<Topic>().ToList(a => new {
  id = a.Id,
  concat = string.Join(",", fsql.Select<StringJoin01>().ToList(b => b.Id))
});
//SELECT a.`Id`, (SELECT group_concat(b.`Id` separator ',') 
//    FROM `StringJoin01` b) 
//FROM `Topic` a
```

> 提示：子查询 string.Join + ToList 适配了 sqlserver/pgsql/oracle/mysql/sqlite/firebird/达梦/金仓/南大/翰高 [#405](https://github.com/dotnetcore/FreeSql/issues/405)

## 子表First/Count/Sum/Max/Min/Avg

```csharp
fsql.Select<Category>().ToList(a => new  {
  all = a,
  first = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).First(b => b.Id),
  count = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Count(),
  sum = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Sum(b => b.Clicks),
  max = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Max(b => b.Clicks),
  min = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Min(b => b.Clicks),
  avg = fsql.Select<Topic>().Where(b => b.CategoryId == a.Id).Avg(b => b.Clicks)
});
```

## 子表ToList

> v3.2.650+ 以下最多执行3次 SQL

```csharp
fsql.Select<Topic>().ToList(a => new
{
  all = a,
  list1 = fsql.Select<T2>().ToList(),
  list2 = fsql.Select<T2>().Where(b => b.TopicId == a.Id).ToList()
});
```

## 自定义解析

```csharp
[ExpressionCall]
public static class DbFunc {
  //必要定义 static + ThreadLocal
  static ThreadLocal<ExpressionCallContext> context = new ThreadLocal<ExpressionCallContext>();

  public static DateTime FormatDateTime(this DateTime that, string arg1)
  {
    var up = context.Value;
    if (up.DataType == FreeSql.DataType.Sqlite) //重写内容
      up.Result = $"date_format({up.ParsedContent["that"]}, {up.ParsedContent["arg1"]})";
    return that;
  }
}

var sql1 = fsql.Select<SysModule>()
  .ToSql(a => a.CreateTime.FormatDateTime("yyyy-MM-dd"));
//SELECT date_format(a."CreateTime", 'yyyy-MM-dd') as1 
//FROM "SysModule" a
```

\[ExpressionCall\] 特性可在静态扩展类上标记，也可以在单个静态方法上标记；

| ExpressionCallContext 属性 | 类型                         | 描述                                |
| -------------------------- | ---------------------------- | ----------------------------------- |
| DataType                   | FreeSql.DataType             | 用于实现不同数据库的适配判断条件    |
| ParsedContent              | Dictionary\<string, string\> | 函数的各参数解析结果                |
| DbParameter                | DbParameter                  | that 被参数化的对象（有可能为 null) |
| UserParameters             | List\<DbParameter\>          | 可附加参数化对象                    |
| Result                     | string                       | 返回表达式函数表示的 SQL 字符串     |

> 当扩展方法返回值为 string 时，其返回值也可以当作 context.Value.Result 功能

> 当不想解析指定参数时，使用特性 \[RawValue\] 标记

## 参数化

Where(lambda) 解析出来的默认是纯文本（已防止SQL注入），对数据库执行计划要求特别高，可以开启 lambda 参数化功能。

```csharp
var fsql = new FreeSqlBuilder() //请务必定义成 Singleton 单例模式
  .UseGenerateCommandParameterWithLambda(true)
  ...

var id = 1;
fsql.Select<Song>().Where(a => a.Id == id).ToList();
//SELECT .. FROM `Song` a WHERE `Id` = @exp_0
```

生成的参数对象，DbType、Size、Precision、Scale 值设置默认已作优化，与实体属性定义一致。

诡异操作：

> 如果不希望 string 参数与实体属性的 Size 相同，可利用自定义表达式函数功能，如下：

```csharp
var name = "testname";
fsql.Select<TestMySqlStringIsNullable>()
  .Where(a => a.varchar == name).ToList();

fsql.Select<TestMySqlStringIsNullable>()
  .Where(a => a.varchar == name.SetDbParameter(10)).ToList();

public class TestMySqlStringIsNullable {
  public Guid id { get; set; }

  [Column(DbType = "varchar(100)")]
  public string varchar { get; set; }
}

[ExpressionCall]
public static class DbFunc {
  static ThreadLocal<ExpressionCallContext> context = new ThreadLocal<ExpressionCallContext>();

  public static string SetDbParameter(this string that, int size)
  {
    if (context.Value.DbParameter != null)
      context.Value.DbParameter.Size = size;
    return context.Value.ParsedContent["that"];
  }
}
```

第一条语句产生的参数对象 Size 为 100，第二条为 10：

![image](https://user-images.githubusercontent.com/16286519/69433211-2c5fcf80-0d76-11ea-8eec-963eb37199c5.png)

## 表达式函数全览

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle | 功能说明 |
| - | - | - | - | - | - |
| a ? b : c | case when a then b else c end | case when a then b else c end | case when a then b else c end | case when a then b else c end | a成立时取b值，否则取c值 |
| a ?? b | ifnull(a, b) | isnull(a, b) | coalesce(a, b) | nvl(a, b) | 当a为null时，取b值 |
| 数字 + 数字 | a + b | a + b | a + b | a + b | 数字相加 |
| 数字 + 字符串 | concat(a, b) | cast(a as varchar) + cast(b as varchar) | case(a as varchar)\|\| b | a\|\| b | 字符串相加，a或b任意一个为字符串时 |
| a - b | a - b | a - b | a - b | a - b | 减
| a * b | a * b | a * b | a * b | a * b | 乘
| a / b | a / b | a / b | a / b | a / b | 除
| a / b | a div b | a / b | a / b | trunc(a / b) | 整除(a,b都为整数)
| a % b | a % b | a % b | a % b | mod(a,b) | 模

> 等等...

### 数组

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle | 功能说明 |
| - | - | - | - | - | - |
| a.Length | - | - | case when a is null then 0 else array_length(a,1) end | - | 数组长度 |
| 常量数组.Length | - | - | array_length(array[常量数组元素逗号分割],1) | - | 数组长度 |
| a.Any() | - | - | case when a is null then 0 else array_length(a,1) end > 0 | - | 数组是否为空 |
| 常量数组.Contains(b) | b in (常量数组元素逗号分割) | b in (常量数组元素逗号分割) | b in (常量数组元素逗号分割) | b in (常量数组元素逗号分割) | IN查询 |
| a.Contains(b) | - | - | a @> array[b] | - | a数组是否包含b元素 |
| a.Concat(b) | - | - | a \|\| b | - | 数组相连 |
| a.Count() | - | - | 同 Length | - | 数组长度 |

> 一个细节证明 FreeSql 匠心制作

通用的 in 查询 select.Where(a => new []{ 1,2,3 }.Contains(a.xxx))

假设 xxxs 是 pgsql 的数组字段类型，其实会与上面的 in 查询起冲突，FreeSql 解决了这个矛盾 select.Where(a => a.xxxs.Contains(1))

### 字典 Dictionary<string, string>

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle | 功能说明 |
| - | - | - | - | - | - |
| a.Count | - | - | case when a is null then 0 else array_length(akeys(a),1) end | - | 字典长度 |
| a.Keys | - | - | akeys(a) | - | 返回字典所有key数组 |
| a.Values | - | - | avals(a) | - | 返回字典所有value数组 |
| a.Contains(b) | - | - | a @> b | - | 字典是否包含b
| a.ContainsKey(b) | - | - | a? b | - | 字典是否包含key
| a.Concat(b) | - | - | a \|\| b | - | 字典相连 |
| a.Count() | - | - | 同 Count | - | 字典长度 |

### JSON JToken/JObject/JArray

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle | 功能说明 |
| - | - | - | - | - | - |
| a.Count | - | - | jsonb_array_length(coalesce(a, '[])) | - | json数组类型的长度 |
| a.Any() | - | - | jsonb_array_length(coalesce(a, '[])) > 0 | - | json数组类型，是否为空 |
| a.Contains(b) | - | - | coalesce(a, '{}') @> b::jsonb | - | json中是否包含b |
| a.ContainsKey(b) | - | - | coalesce(a, '{}') ? b | - | json中是否包含键b |
| a.Concat(b) | - | - | coalesce(a, '{}') || b::jsonb | - | 连接两个json |
| Parse(a) | - | - | a::jsonb | - | 转化字符串为json类型 |
| a.Field["x"] | - | - | a.Field->x | - | json成员访问 |

### 字符串

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle | Sqlite |
| - | - | - | - | - | - |
| string.Empty | '' | '' | '' | '' |
| string.IsNullOrEmpty(a) | (a is null or a = '') | (a is null or a = '') | (a is null or a = '') | (a is null or a = '') | (a is null or a = '') |
| string.Concat(a,b,c...) | concat(a, b, c) | a + b + c | a \|\| b \|\| c | a \|\| b \|\| c | a \|\| b \|\| c |
| a.CompareTo(b) | strcmp(a, b) | - | case when a = b then 0 when a > b then 1 else -1 end | case when a = b then 0 when a > b then 1 else -1 end | case when a = b then 0 when a > b then 1 else -1 end |
| a.Contains('b') | a like '%b%' | a like '%b%' | a ilike'%b%' | a like '%b%' | a like '%b%' |
| a.EndsWith('b') | a like '%b' | a like '%b' | a ilike'%b' | a like '%b' | a like '%b' |
| a.IndexOf(b) | locate(a, b) - 1 | locate(a, b) - 1 | strpos(a, b) - 1 | instr(a, b, 1, 1) - 1 | instr(a, b) - 1 |
| a.Length | char_length(a) | len(a) | char_length(a) | length(a) | length(a) |
| a.PadLeft(b, c) | lpad(a, b, c) | - | lpad(a, b, c) | lpad(a, b, c) | lpad(a, b, c) |
| a.PadRight(b, c) | rpad(a, b, c) | - | rpad(a, b, c) | rpad(a, b, c) | rpad(a, b, c) |
| a.Replace(b, c) | replace(a, b, c) | replace(a, b, c) | replace(a, b, c) | replace(a, b, c) | replace(a, b, c) |
| a.StartsWith('b') | a like 'b%' | a like 'b%' | a ilike'b%' | a like 'b%' | a like 'b%' |
| a.Substring(b, c) | substr(a, b, c + 1) | substring(a, b, c + 1) | substr(a, b, c + 1) | substr(a, b, c + 1) | substr(a, b, c + 1) |
| a.ToLower | lower(a) | lower(a) | lower(a) | lower(a) | lower(a) |
| a.ToUpper | upper(a) | upper(a) | upper(a) | upper(a) | upper(a) |
| a.Trim | trim(a) | trim(a) | trim(a) | trim(a) | trim(a) |
| a.TrimEnd | rtrim(a) | rtrim(a) | rtrim(a) | rtrim(a) | rtrim(a) |
| a.TrimStart | ltrim(a) | ltrim(a) | ltrim(a) | ltrim(a) | ltrim(a) |
| a.FirstOrDefault | substr(a,1,1) | substring(a,1,1) | substr(a,1,1) | substr(a,1,1) | substr(a,1,1) |

> 使用字符串函数可能会出现性能瓶颈，虽然不推荐使用，但是作为功能库这也是不可缺少的功能之一。

### 日期

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle |
| - | - | - | - | - |
| DateTime.Now | now() | getdate() | current_timestamp | systimestamp |
| DateTime.UtcNow | utc_timestamp() | getutcdate() | (current_timestamp at time zone 'UTC') | sys_extract_utc(systimestamp) |
| DateTime.Today | curdate | convert(char(10),getdate(),120) | current_date | trunc(systimestamp) |
| DateTime.MaxValue | cast('9999/12/31 23:59:59' as datetime) | '9999/12/31 23:59:59' | '9999/12/31 23:59:59'::timestamp | to_timestamp('9999-12-31 23:59:59','YYYY-MM-DD HH24:MI:SS.FF6') |
| DateTime.MinValue | cast('0001/1/1 0:00:00' as datetime) | '1753/1/1 0:00:00' | '0001/1/1 0:00:00'::timestamp | to_timestamp('0001-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS.FF6') |
| DateTime.Compare(a, b) | a - b | a - b | extract(epoch from a::timestamp-b::timestamp) | extract(day from (a-b)) |
| DateTime.DaysInMonth(a, b) | dayofmonth(last_day(concat(a, '-', b, '-1'))) | datepart(day, dateadd(day, -1, dateadd(month, 1, cast(a as varchar) + '-' + cast(b as varchar) + '-1'))) | extract(day from (a || '-' || b || '-01')::timestamp+'1 month'::interval-'1 day'::interval) | cast(to_char(last_day(a||'-'||b||'-01'),'DD') as number) |
| DateTime.Equals(a, b) | a = b | a = b | a = b | a = b |
| DateTime.IsLeapYear(a) | a%4=0 and a%100<>0 or a%400=0 | a%4=0 and a%100<>0 or a%400=0 | a%4=0 and a%100<>0 or a%400=0 | mod(a,4)=0 AND mod(a,100)<>0 OR mod(a,400)=0 |
| DateTime.Parse(a) | cast(a as datetime) | cast(a as datetime) | a::timestamp | to_timestamp(a,'YYYY-MM-DD HH24:MI:SS.FF6') |
| a.Add(b) | date_add(a, interval b microsecond) | dateadd(millisecond, b / 1000, a) | a::timestamp+(b||' microseconds')::interval | 增加TimeSpan值 | a + b |
| a.AddDays(b) | date_add(a, interval b day) | dateadd(day, b, a) | a::timestamp+(b||' day')::interval | a + b |
| a.AddHours(b) | date_add(a, interval b hour) | dateadd(hour, b, a) | a::timestamp+(b||' hour')::interval | a + b/24 |
| a.AddMilliseconds(b) | date_add(a, interval b*1000 microsecond) | dateadd(millisecond, b, a) | a::timestamp+(b||' milliseconds')::interval | a + b/86400000 |
| a.AddMinutes(b) | date_add(a, interval b minute) | dateadd(minute, b, a) | a::timestamp+(b||' minute')::interval | a + b/1440 |
| a.AddMonths(b) | date_add(a, interval b month) | dateadd(month, b, a) | a::timestamp+(b||' month')::interval | add_months(a,b) |
| a.AddSeconds(b) | date_add(a, interval b second) | dateadd(second, b, a) | a::timestamp+(b||' second')::interval | a + b/86400 |
| a.AddTicks(b) | date_add(a, interval b/10 microsecond) | dateadd(millisecond, b / 10000, a) | a::timestamp+(b||' microseconds')::interval | a + b/86400000000 |
| a.AddYears(b) | date_add(a, interval b year) | dateadd(year, b, a) | a::timestamp+(b||' year')::interval | add_months(a,b*12) |
| a.Date | cast(date_format(a, '%Y-%m-%d') as datetime) | convert(char(10),a,120) | a::date | trunc(a) |
| a.Day | dayofmonth(a) | datepart(day, a) | extract(day from a::timestamp) | cast(to_char(a,'DD') as number) |
| a.DayOfWeek | dayofweek(a) | datepart(weekday, a) - 1 | extract(dow from a::timestamp) | case when to_char(a)='7' then 0 else cast(to_char(a) as number) end |
| a.DayOfYear | dayofyear(a) | datepart(dayofyear, a) | extract(doy from a::timestamp) | cast(to_char(a,'DDD') as number) |
| a.Hour | hour(a) | datepart(hour, a) | extract(hour from a::timestamp) | cast(to_char(a,'HH24') as number) |
| a.Millisecond | floor(microsecond(a) / 1000) | datepart(millisecond, a) | extract(milliseconds from a::timestamp)-extract(second from a::timestamp)*1000 | cast(to_char(a,'FF3') as number) |
| a.Minute | minute(a) | datepart(minute, a) | extract(minute from a::timestamp) | cast(to_char(a,'MI') as number) |
| a.Month | month(a) | datepart(month, a) | extract(month from a::timestamp) | cast(to_char(a,'FF3') as number) |
| a.Second | second(a) | datepart(second, a) | extract(second from a::timestamp) | cast(to_char(a,'SS') as number) |
| a.Subtract(b) | timestampdiff(microsecond, b, a) | datediff(millisecond, b, a) * 1000 | (extract(epoch from a::timestamp-b::timestamp)*1000000) | a - b |
| a.Ticks | timestampdiff(microsecond, '0001-1-1', a) * 10 | datediff(millisecond, '1970-1-1', a) * 10000 + 621355968000000000 | extract(epoch from a::timestamp)*10000000+621355968000000000 | cast(to_char(a,'FF7') as number) |
| a.TimeOfDay | timestampdiff(microsecond, date_format(a, '%Y-%m-%d'), a) | '1970-1-1 ' + convert(varchar, a, 14) | extract(epoch from a::time)*1000000 | a - trunc(a) |
| a.Year | year(a) | datepart(year, a) | extract(year from a::timestamp) | 年 | cast(to_char(a,'YYYY') as number) |
| a.Equals(b) | a = b | a = b | a = b | a = b |
| a.CompareTo(b) | a - b | a - b | a - b | a - b |
| a.ToString() | date_format(a, '%Y-%m-%d %H:%i:%s.%f') | convert(varchar, a, 121) | to_char(a, 'YYYY-MM-DD HH24:MI:SS.US') | to_char(a,'YYYY-MM-DD HH24:MI:SS.FF6') |

### 时间

| 表达式 | MySql(微秒) | SqlServer(秒) | PostgreSQL(微秒) | Oracle(Interval day(9) to second(7)) |
| - | - | - | - | - |
| TimeSpan.Zero | 0 | 0 | - | 0微秒 | numtodsinterval(0,'second') |
| TimeSpan.MaxValue | 922337203685477580 | 922337203685477580 | - | numtodsinterval(233720368.5477580,'second') |
| TimeSpan.MinValue | -922337203685477580 | -922337203685477580 | - | numtodsinterval(-233720368.5477580,'second') |
| TimeSpan.Compare(a, b) | a - b | a - b | - | extract(day from (a-b)) |
| TimeSpan.Equals(a, b) | a = b | a = b | - | a = b |
| TimeSpan.FromDays(a) | a *1000000* 60 *60* 24 | a *1000000* 60 *60* 24 | - | numtodsinterval(a*86400,'second') |
| TimeSpan.FromHours(a) | a *1000000* 60 * 60 | a * 1000000 *60* 60 | - | numtodsinterval(a*3600,'second') |
| TimeSpan.FromMilliseconds(a) | a * 1000 | a * 1000 | - | numtodsinterval(a/1000,'second') |
| TimeSpan.FromMinutes(a) | a *1000000* 60 | a *1000000* 60 | - | numtodsinterval(a*60,'second') |
| TimeSpan.FromSeconds(a) | a * 1000000 | a * 1000000 | - | numtodsinterval(a,'second') |
| TimeSpan.FromTicks(a) | a / 10 | a / 10 | - | numtodsinterval(a/10000000,'second') |
| a.Add(b) | a + b | a + b | - | a + b |
| a.Subtract(b) | a - b | a - b | - | a - b |
| a.CompareTo(b) | a - b | a - b | - | extract(day from (a-b)) |
| a.Days | a div (1000000 *60* 60 * 24) | a div (1000000 * 60 *60* 24) | - | extract(day from a) |
| a.Hours | a div (1000000 *60* 60) mod 24 | a div (1000000 *60* 60) mod 24 | - | extract(hour from a) |
| a.Milliseconds | a div 1000 mod 1000 | a div 1000 mod 1000 | - | cast(substr(extract(second from a)-floor(extract(second from a)),2,3) as number) |
| a.Seconds | a div 1000000 mod 60 | a div 1000000 mod 60 | - | extract(second from a) |
| a.Ticks | a * 10 | a * 10 | - | (extract(day from a)*86400+extract(hour from a)*3600+extract(minute from a)*60+extract(second from a))*10000000 |
| a.TotalDays | a / (1000000 *60* 60 * 24) | a / (1000000 * 60 *60* 24) | - | extract(day from a) |
| a.TotalHours | a / (1000000 *60* 60) | a / (1000000 *60* 60) | - | (extract(day from a)*24+extract(hour from a)) |
| a.TotalMilliseconds | a / 1000 | a / 1000 | - | (extract(day from a)*86400+extract(hour from a)*3600+extract(minute from a)*60+extract(second from a))*1000 |
| a.TotalMinutes | a / (1000000 * 60) | a / (1000000 * 60) | - | | (extract(day from a)*1440+extract(hour from a)*60+extract(minute from a)) |
| a.TotalSeconds | a / 1000000 | a / 1000000 | - | (extract(day from a)*86400+extract(hour from a)*3600+extract(minute from a)*60+extract(second from a)) |
| a.Equals(b) | a = b | a = b | - | a = b |
| a.ToString() | cast(a as varchar) | cast(a as varchar) | - | to_char(a) |

### 数学函数

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle |
| - | - | - | - | - |
| Math.Abs(a) | abs(a) | abs(a) | abs(a) |
| Math.Acos(a) | acos(a) | acos(a) | acos(a) | acos(a) |
| Math.Asin(a) | asin(a) | asin(a) | asin(a) | asin(a) |
| Math.Atan(a) | atan(a) | atan(a) | atan(a) | atan(a) |
| Math.Atan2(a, b) | atan2(a, b) | atan2(a, b) | atan2(a, b) | - |
| Math.Ceiling(a) | ceiling(a) | ceiling(a) | ceiling(a) | ceil(a) |
| Math.Cos(a) | cos(a) | cos(a) | cos(a) | cos(a) |
| Math.Exp(a) | exp(a) | exp(a) | exp(a) | exp(a) |
| Math.Floor(a) | floor(a) | floor(a) | floor(a) | floor(a) |
| Math.Log(a) | log(a) | log(a) | log(a) | log(e,a) |
| Math.Log10(a) | log10(a) | log10(a) | log10(a) | log(10,a) |
| Math.PI(a) | 3.1415926535897931 | 3.1415926535897931 | 3.1415926535897931 | 3.1415926535897931 |
| Math.Pow(a, b) | pow(a, b) | power(a, b) | pow(a, b) | power(a, b) |
| Math.Round(a, b) | round(a, b) | round(a, b) | round(a, b) | round(a, b) |
| Math.Sign(a) | sign(a) | sign(a) | sign(a) | sign(a) |
| Math.Sin(a) | sin(a) | sin(a) | sin(a) | sin(a) |
| Math.Sqrt(a) | sqrt(a) | sqrt(a) | sqrt(a) | sqrt(a) |
| Math.Tan(a) | tan(a) | tan(a) | tan(a) | tan(a) |
| Math.Truncate(a) | truncate(a, 0) | floor(a) | trunc(a, 0) | trunc(a, 0) |

### 类型转换

| 表达式 | MySql | SqlServer | PostgreSQL | Oracle | Sqlite |
| - | - | - | - | - | - |
| Convert.ToBoolean(a) \| bool.Parse(a) | a not in ('0','false') | a not in ('0','false') | a::varchar not in ('0','false','f','no') | - | a not in ('0','false') |
| Convert.ToByte(a) \| byte.Parse(a) | cast(a as unsigned) | cast(a as tinyint) | a::int2 | cast(a as number) | cast(a as int2) |
| Convert.ToChar(a) | substr(cast(a as char),1,1) | substring(cast(a as nvarchar),1,1) | substr(a::char,1,1) | substr(to_char(a),1,1) | substr(cast(a as character),1,1) |
| Convert.ToDateTime(a) \| DateTime.Parse(a) | cast(a as datetime) | cast(a as datetime) | a::timestamp | to_timestamp(a,'YYYY-MM-DD HH24:MI:SS.FF6') | datetime(a) |
| Convert.ToDecimal(a) \| decimal.Parse(a) | cast(a as decimal(36,18)) | cast(a as decimal(36,19)) | a::numeric | cast(a as number) | cast(a as decimal(36,18)) |
| Convert.ToDouble(a) \| double.Parse(a) | cast(a as decimal(32,16)) | cast(a as decimal(32,16)) | a::float8 | cast(a as number) | cast(a as double) |
| Convert.ToInt16(a) \| short.Parse(a) | cast(a as signed) | cast(a as smallint) | a::int2 | cast(a as number) | cast(a as smallint) |
| Convert.ToInt32(a) \| int.Parse(a) | cast(a as signed) | cast(a as int) | a::int4 | cast(a as number) | cast(a as smallint) |
| Convert.ToInt64(a) \| long.Parse(a) | cast(a as signed) | cast(a as bigint) | a::int8 | cast(a as number) | cast(a as smallint) |
| Convert.ToSByte(a) \| sbyte.Parse(a) | cast(a as signed) | cast(a as tinyint) | a::int2 | cast(a as number) | cast(a as smallint) |
| Convert.ToSingle(a) \| float.Parse(a) | cast(a as decimal(14,7)) | cast(a as decimal(14,7)) | a::float4 | cast(a as number) | cast(a as float) |
| Convert.ToString(a) | cast(a as char) | cast(a as nvarchar) | a::varchar | to_char(a) | cast(a as character) |
| Convert.ToUInt16(a) \| ushort.Parse(a) | cast(a as unsigned) | cast(a as smallint) | a::int2 | cast(a as number) | cast(a as unsigned) |
| Convert.ToUInt32(a) \| uint.Parse(a) | cast(a as unsigned) | cast(a as int) | a::int4 | cast(a as number) | cast(a as decimal(10,0)) |
| Convert.ToUInt64(a) \| ulong.Parse(a) | cast(a as unsigned) | cast(a as bigint) | a::int8 | cast(a as number) | cast(a as decimal(21,0)) |
| Guid.Parse(a) | substr(cast(a as char),1,36) | cast(a as uniqueidentifier) | a::uuid | substr(to_char(a),1,36) | substr(cast(a as character),1,36) |
| Guid.NewGuid() | - | newid() | - | - | - |
| new Random().NextDouble() | rand() | rand() | random() | dbms_random.value | random() |
