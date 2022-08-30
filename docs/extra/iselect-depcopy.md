# ISelect 拷贝克隆(copy/clone)

当一个 ISelect 构造到一定复杂程序之后，比如：

```csharp
public void Test()
{
    var select1 = fsql.Select<AdmRoute>().Include(a => a.Parent)
        .WhereIf(!string.IsNullOrEmpty(key), a => a.Name.Contains(key) || a.Extdata.Contains(key) || a.Remark.Contains(key) || a.TenantId.Contains(key) || a.Parent.Name.Contains(key) || a.Parent.Extdata.Contains(key) || a.Parent.Remark.Contains(key) || a.Parent.TenantId.Contains(key))
        .WhereIf(Parent_Id?.Any() == true, a => Parent_Id.Contains(a.ParentId))
        .WhereIf(mn_Roles_Id?.Any() == true, a => a.Roles.AsSelect().Any(b => mn_Roles_Id.Contains(b.Id)));

    var select2 = select1;
    select1.Where(a => a.Status == 0);
    //此时 select2 也附加了 a.Status == 0 条件
}
```

利用语法糖解决：

```csharp
public void Test()
{
    ISelect<AdmRoute> GetSelect() => fsql.Select<AdmRoute>().Include(a => a.Parent)
        .WhereIf(!string.IsNullOrEmpty(key), a => a.Name.Contains(key) || a.Extdata.Contains(key) || a.Remark.Contains(key) || a.TenantId.Contains(key) || a.Parent.Name.Contains(key) || a.Parent.Extdata.Contains(key) || a.Parent.Remark.Contains(key) || a.Parent.TenantId.Contains(key))
        .WhereIf(Parent_Id?.Any() == true, a => Parent_Id.Contains(a.ParentId))
        .WhereIf(mn_Roles_Id?.Any() == true, a => a.Roles.AsSelect().Any(b => mn_Roles_Id.Contains(b.Id)));

    var select1 = GetSelect();
    var select2 = GetSelect();
    select1.Where(a => a.Status == 0);
    //此时 select2 不会附加 a.Status == 0 条件
}
```

科普：

csharp 7.0 支持本地函数，**方法内再定义临时方法**，这个特性向大家推荐，在很多时候都非常有效。

方法内还可以定义方法，那就称它：本地函数/嵌套方法。

## 原文链接

- [技巧：ISelect 如何拷贝(copy)复用，克隆(clone) · Issue #644 · dotnetcore/FreeSql (github.com)](https://github.com/dotnetcore/FreeSql/issues/644)
