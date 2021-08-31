# ADO

Ado 是 IFreeSql 下重要的对象之一，它包括所有对 SQL 操作的封装，提供 ExecuteReader、ExecuteDataSet、ExecuteDataTable、ExecuteNonQuery、ExecuteScalar 等方法，使用起来和传统 SqlHelper 一样。

## 查询 SQL 返回实体

```c#
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

- odbc 是 ? 并且没有标识，所以freesql禁用了 odbc 参数化
- oracle 是 :
- mysql.data 是 ?
- mysqlconnector 是 @
- 其他基本都是 @

IN 参数化查询：

> 当前仅支持Array和IList类型绑定
```c#
var ids = new int[] { 1,2,3 };
List<T> list = fsql.Ado.Query<T>("select * from t1 where id in @ids", new { ids = ids });
```

## 检测连接

```c#
bool isok = fsql.Ado.ExecuteConnectTest();
```

## CommandFluent

fsql.Ado 重载方法太多的情况下，建议使用 CommandFluent，例如存储过程：

```c#
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