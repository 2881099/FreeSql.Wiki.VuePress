# ADO

Ado 是 IFreeSql 下重要的对象之一，它包括所有对 SQL 操作的封装，提供 ExecuteReader、ExecuteDataSet、ExecuteDataTable、ExecuteNonQuery、ExecuteScalar 等方法，使用起来和传统 SqlHelper 一样。

## 查询 SQL 返回实体

```csharp
//返回多条记录
List<T> list = fsql.Ado.Query<T>("select * from t1");

//返回单条记录
T item = fsql.Ado.QuerySingle<T>("select * from t1 where id = @id", new { id = 1 });

//返回多个结果集
var result = fsql.Ado.Query<T1, T2>("select * from t1; select * from t2");
List<T1> list1 = result.Item1;
List<T2> list2 = result.Item2;

// like 查询
string searchText = "abc";
List<T> users = _fsql.Ado.Query<T>("select * from t1 where name like @name", new { name = "%" + searchText + "%" });
```

## 参数化

Ado 下面所有参数 object parms 都可以接受匿名对象，或者字典：

- new { id = 1, name = "xx" }
- new Dictionary\<string, object\> { ["id"] = 1, ["name"] = "xx" }

关于参数前缀：

- odbc 是 ? 并且没有标识，所以 freesql 禁用了 odbc 参数化
- oracle 是 :
- mysql.data 是 ?
- mysqlconnector 是 @
- 其他基本都是 @

IN 参数化查询：

> 当前仅支持 Array 和 IList 类型绑定

```csharp
var ids = new int[] { 1,2,3 };
List<T> list = fsql.Ado.Query<T>("select * from t1 where id in @ids", new { ids = ids });
```

## 检测连接

```csharp
bool isok = fsql.Ado.ExecuteConnectTest();
```

## CommandFluent

fsql.Ado 重载方法太多的情况下，建议使用 CommandFluent，例如存储过程：

```csharp
DbParameter p2 = null;
fsql.Ado.CommandFluent("dbo.GetICMaxNum")
    .CommandType(CommandType.StoredProcedure)
    .CommandTimeout(60)

    .WithParameter("TableName", "tb1")
    .WithParameter("FInterID", null, p =>
    {
        p2 = p; //Output 参数
        p.DbType = DbType.Int32;
        p.Direction = ParameterDirection.Output;
    })
    .ExecuteNonQuery(); //.Query<T>() 或者 .ExecuteDataTable() 或者 ...

Console.WriteLine(p2.Value);
```
Oracle 存储过程获取DataTable：

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
## Ado.net 扩展方法

提供了类似 Dapper 的使用方法，FreeSql 增加了 IDbConnection/IDbTransaction 对象的扩展方法 Select/Insert/Update/Delete 实现 CRUD。

```csharp
using FreeSql;

using (var conn = new SqlConnection(...))
{
  //IFreeSql fsql = conn.GetIFreeSql();
  //fsql.CodeFirst.IsNoneCommandParameter = true;
  //fsql.CodeFirst.IsSyncStructureToUpper = true;
  //fsql.Aop.CommandBefore += (_, e) => Trace.WriteLine(e.Command.CommandText);
  //以上整个程序只需要设置一次

  conn.Select<T>().Where(...).ToList();

  conn.Insert(new T {}).ExecuteAffrows();
  conn.Update().SetSource(new T {}).ExecuteAffrows();
  conn.InsertOrUpdate().SetSource(new T {}).ExecuteAffrows();

  conn.Delete<T>().Where(...).ExecuteAffrows();
}
```

- 每个 SqlConnection GetFreeSql() 返回的 IFreeSql 实例相同；
- 可以对 fsql 设置 Aop 事件，比如监视 SQL；
- IFreeSql 自身的成员 IDbFirst、Transaction 不可用；

利用本功能可以快速将 FreeSql 使用到项目中，只需要处理好实体类的特性。

提示：FreeSql 兼容 EFCore 99% 的实体特性
