# Read-Write Splitting

FreeSql supports database read-write splitting. This feature pertains to client-side read-write splitting behavior; how the database server itself is configured remains unchanged and unaffected by this feature. For convenience, when referring to **read-write splitting** below, it will mean the client-side functionality support.

The methods for read-write splitting vary among different databases. Once the read-write splitting feature is enabled on the database server, the implementation generally falls into the following categories:

1. Nginx proxy, which is complex to configure and prone to errors;
2. Middleware, such as MyCat;
3. Client-side support;

FreeSql implements the third option, supporting one **master database** and multiple **slave databases**, with the query strategy for **slave databases** being random.

If a **slave database** fails, it will switch to other available **slave databases**. If all **slave databases** are unavailable, it will fall back to querying the **master database**.

Failed **slave databases** are isolated and periodically checked for availability until they recover.

```csharp
var connstr = "Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;" +
    "Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10";

static IFreeSql fsql = new FreeSql.FreeSqlBuilder()
    .UseConnectionString(FreeSql.DataType.MySql, connstr)
    .UseSlave("connectionString1", "connectionString2") // Use slave databases, multiple supported
    .Build(); // Be sure to define as Singleton

fsql.Select<T>().Where(a => a.Id == 1).ToOne(); // Read from **slave database** (default)

fsql.Select<T>().Master().WhereId(a => a.Id == 1).ToOne(); // Force read from **master database**

fsql.Ado.Query<T>("/*master*/ select * from t where ..."); // Force read from **master database**
```
