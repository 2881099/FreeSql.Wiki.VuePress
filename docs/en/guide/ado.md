# Ado

Ado is one of the important objects under `IFreeSql`, encapsulating all SQL operations and providing methods such as `ExecuteReader`, `ExecuteDataSet`, `ExecuteDataTable`, `ExecuteNonQuery`, and `ExecuteScalar`. It works similarly to the traditional `SqlHelper`.

## Query SQL

```csharp
// Return multiple records
List<T> list = fsql.Ado.Query<T>("select * from t1");

// Return a single record
T item = fsql.Ado.QuerySingle<T>("select * from t1 where id = @id", new { id = 1 });

// Return multiple result sets
var result = fsql.Ado.Query<T1, T2>("select * from t1; select * from t2");
List<T1> list1 = result.Item1;
List<T2> list2 = result.Item2;

// Like query
string searchText = "abc";
List<T> users = _fsql.Ado.Query<T>("select * from t1 where name like @name", new { name = "%" + searchText + "%" });

// Get database time
// SELECT now(), utc_timestamp()
var result = fsql.Ado.QuerySingle(() => new
{
    DateTime.Now,
    DateTime.UtcNow
});
```

## Parameter

All parameters for `Ado` can accept anonymous objects or dictionaries:

```csharp
 new { id = 1, name = "xx" }
 new Dictionary<string, object> { ["id"] = 1, ["name"] = "xx" }
```

Regarding **parameter prefixes**:

- `odbc` uses **?** and does not have a specific identifier, so `freesql` disables `odbc` parameterization.

| Type        | Prefix Symbol |
|-------------|---------------|
| oracle      | **:**         |
| mysql.data  | **?**         |
| mysqlconnector | **@**     |
| Others      | **@**         |

IN parameterization queries:

> Currently, only `Array` and `IList` types are supported for binding

```csharp
var ids = new int[] { 1, 2, 3 };
List<T> list = fsql.Ado.Query<T>("select * from t1 where id in @ids", new { ids = ids });
```

## Check Connection

```csharp
bool isok = fsql.Ado.ExecuteConnectTest();
```

## Command Fluent

When there are too many overloaded methods in `fsql.Ado`, it is recommended to use `CommandFluent`, for example, with stored procedures:

```csharp
DbParameter p2 = null;
fsql.Ado.CommandFluent("dbo.GetICMaxNum")
    .CommandType(CommandType.StoredProcedure)
    .CommandTimeout(60)
    .WithParameter("TableName", "tb1")
    .WithParameter("FInterID", null, p =>
    {
        //(p as OracleParameter).OracleType = ...;
        p2 = p; // Output parameter
        p.DbType = DbType.Int32;
        p.Direction = ParameterDirection.Output;
        (p as SqlParameter).Size = 50; // Specific database parameter
    })
    .ExecuteNonQuery(); //.Query<T>() or .ExecuteDataTable() or ...

Console.WriteLine(p2.Value);
```

Oracle stored procedure to get `DataTable`:

```csharp
OracleParameter p2 = null;
var dt = fsql.Ado.CommandFluent("getTableInfo")
     .CommandType(CommandType.StoredProcedure)
     .CommandTimeout(60)
     .WithParameter("out_var", null, p =>
     {
         p2 = p as OracleParameter;
         p2.OracleDbType = OracleDbType.RefCursor;
         p2.Direction = ParameterDirection.Output;
     })
     .ExecuteDataTable();
Console.WriteLine(dt.Rows.Count);
```

## Ado.net Extensions

Provides usage similar to Dapper, `FreeSql` adds extension methods `Select/Insert/Update/Delete` for `IDbConnection/IDbTransaction` objects to implement CRUD operations.

```csharp
using FreeSql;

using (var conn = new SqlConnection(...))
{
  //IFreeSql fsql = conn.GetIFreeSql();
  //fsql.CodeFirst.IsNoneCommandParameter = true;
  //fsql.CodeFirst.IsSyncStructureToUpper = true;
  //fsql.Aop.CommandBefore += (_, e) => Trace.WriteLine(e.Command.CommandText);
  //The entire program only needs to be set once

  conn.Select<T>().Where(...).ToList();

  conn.Insert(new T {}).ExecuteAffrows();
  conn.Update().SetSource(new T {}).ExecuteAffrows();
  conn.InsertOrUpdate().SetSource(new T {}).ExecuteAffrows();

  conn.Delete<T>().Where(...).ExecuteAffrows();
}
```

- Each `SqlConnection`'s `GetFreeSql()` returns the same `IFreeSql` instance;
- You can set `Aop` events for `fsql`, such as monitoring SQL;
- The `IDbFirst` and `Transaction` members of `IFreeSql` are not available;

This feature allows for quick integration of `FreeSql` into a project, as long as you handle entity class attributes properly.

Hint: `FreeSql` is 99% compatible with EFCore entity attributes