# FreeSql.AdminLTE

它是 FreeSql 衍生出来的 .NETCore MVC 中间件扩展包 FreeSql.AdminLTE.Preview.dll，基于 AdminLTE 前端框架动态产生实体的增删查改界面。

> dotnet add packages FreeSql.AdminLTE.Preview

输入：实体1、实体2、实体3

输出：后台管理的功能

```csharp
app.UseFreeAdminLtePreview("/",
    typeof(Config),
    typeof(Role),
    typeof(Menu),
    typeof(User),

    typeof(Department),
    typeof(Employee),
    typeof(Position),

    typeof(AppLog),
    typeof(LoginLog),
    typeof(OprationLog),

    typeof(FreeScheduler.TaskInfo),
    typeof(FreeScheduler.TaskLog)
);
```

只需要传入实体，就可以生产 curd 的管理功能，是不是有些骚啊~~~

![image](https://user-images.githubusercontent.com/16286519/187557633-351e3fbe-ae87-461f-9e45-f1c31c6a2b92.png)

![image](https://user-images.githubusercontent.com/16286519/187557677-5333484e-92d3-42a4-8543-6baf89814540.png)

对于通用后台管理系统的生成，除了单纯的对单表 crud 操作外，我还喜欢利用导航属性的操作，比如：

1、Song、Tag 多对多场景，添加/更新 Song 时可以把 Tag 一起保存；

2、列表页，希望外键、多对多出现在过滤筛选条件；

3、列表页，希望枚举出现在过滤筛选条件；

4、删除时，级联删除所有相关数据；

等等诸如此类的繁琐操作，之所以说繁琐，是因为这些工作技术不难，属于严重的重复劳动。

## 机制设定

1、添加、修改数据

中件间产生的界面包括添加、修改数据的功能，普通实体的根据属性的类型与 Html5 UI 一一映射；

比较特殊的映射规则：

| c# 类型             | Html5    |
| ------------------- | -------- |
| 布尔                | 复选框   |
| 枚举                | 下拉选择 |
| 日期                | 日期控件 |
| ManyToOne 导航属性  | 下拉选择 |
| ManyToMany 导航属性 | 多选器   |

等等。。。

什么情况会产生【上传文件】控件？
有兴趣的可以了解源码，目前没有开放在外部配置。

---

2、列表查询、过滤筛选

中件间为每个实体提供了分页列表查询，每页为20条数据；

除此外，还提供了过滤条件的支持，规则是根据导航属性（ManyToOne、ManyToMany）。比如【岗位】，内含有【部门 Department】、【员工 Employee】、【角色 Role】，则【岗位】列表页会出现按【分类】筛选的UI，详见上面的 demo 示意图，或者下载 demo 运行；

---

3、删除数据

中件间为每个实体提供了批量删除的功能；

并且支持了复杂导航属性关系的级联删除功能，而这个功能不依赖数据库外键；

## 下载 Demo

我们一直习惯用 sqlite 做测试库，测试完毕直接删除目录，不留垃圾数据，所以下面的 demo 不需要修改任何地方，运行时自动建库、建表；

运行环境：.net6.0

[https://files.cnblogs.com/files/FreeSql/freesql.adminlte.preview.zip](https://files.cnblogs.com/files/FreeSql/freesql.adminlte.preview.zip)

第一步：

> dotnet restore

第二步：

> dotnet run
