# AdminBlazor

## 项目介绍

AdminBlazor 是一款 Blazor Server SaaS 中台项目，支持 RABC 权限菜单/按钮，支持快速代码生成一对一、一对多、多对多导航属性的 .razor 界面。

集成功能：菜单、角色、用户、公司组织、定时任务、数据字典、参数配置、租户、审批、审计、OSS文件管理

依赖组件：BootstrapBlazor、FreeSql、FreeScheduler、Rougamo

- 老版本: https://gitee.com/FreeSql/AdminBlazor
- 新版本：暂不开源（商业技术支持）

## 快速开始

1. 安装模板

> dotnet new install AdminBlazor.Template

2. 新建项目

> dotnet new admin

> 项目结构简洁（没有过多的分层）

3. 运行访问

> http://localhost:5231

用户名：admin 密码：admin

4. 新建菜单，类型选择增删改查

![image](/adminblazor/0001.png)

5. 生成代码，在实体类型维护注释、导航属性

- 实体上的注释，会生成 HTML Label
- 实体上的导航属性，会生成丰富的 UI
- 创建实体类型，建议继承 Entity/EntityCreated/EntityModifed/EntityAudited

![image](/adminblazor/0002.png)

## 权限

- SysUser 多对多 SysRole
- SysRole 多对多 SysMenu

提示：AdminContext 类型已注入为 Scoped

```csharp
class AdminContext
{
    public IServiceProvider Service { get; }
    public SysUser User { get; set; }
    public List<SysRole> Roles { get; }
    public List<SysMenus> RoleMenus { get; }

    //路由、按钮权限验证
    public bool AuthPath(string path);
    public bool AuthButton(string path)
}
```

按钮权限，在 razor 中设置特性：

```csharp
[AdminButton("name")]
void ButtonClick()
{
}

//或者 webapi
[Route("api/菜单路径")]
class XxxController : ControllerBase
{
    [HttpGet("@name")]
    public JsonResult ButtonClick()
    {
    }
}
```

之后菜单管理，会出现对应的按钮项，勾选设置角色是否有按钮的权限。

![image](/adminblazor/0003.png)

## 审批

- 实体类继承 EntityAudited
- 菜单编辑选择 【审批】

![image](/adminblazor/0005.png)

- 待提交/反审，可修改/删除
- 审核中/通过，已锁定业务数据，不可修改/删除
- EntityAudited 带版本功能、审计历史变化，且多端无法同时编辑（提示正在被[admin]编辑）

![image](/adminblazor/0006.png)

![image](/adminblazor/0007.png)

## 租户

提示：AdminContext 类型已注入为 Scoped

```csharp
class AdminContext
{
    public IServiceProvider Service { get; }
    public SysTenant Tenant { get; }
}
```

每个租户独立数据库，注入方式：

- 访问租户：IFreeSql/IAggregateRootRepository\<T\>
- 访问主库：FreeSqlCloud

> FreeSqlCloud API 访问方式与 IFreeSql 一样
> IAggregateRootRepository 是级联操作友好的仓储模式

![image](/adminblazor/0004.png)

## 定时任务

```csharp
[Scheduler("任务1", "0/30 * * * * *")]
static void Scheduler001()
{
    System.Console.WriteLine("任务1 被触发...");
}

[Scheduler("任务2", Interval = TaskInterval.SEC, Argument = "10")]
static void Scheduler002(IServiceProvider service, TaskInfo task)
{
    System.Console.WriteLine("任务2 被触发...");
}

//运行时 scheduler.AddTask("任务3"...)
[Scheduler("任务3")]
static void Scheduler003()
{
    System.Console.WriteLine("任务3 被触发...");
}
```

## 组件

以下几个是 AdminBlazor 封装的组件，更多丰富的 UI 组件可以看：BootstrapBlazor

### 1. 增删改查 AdminTable2\<TItem\>

| 名称                                                        | 说明                            |
| ----------------------------------------------------------- | ------------------------------- |
| bool IsDebug                                                | 打开UI调试                      |
| string Title                                                | 标题，弹框时                    |
| int PageSize                                                | 分页，值 -1 时不分页            |
| bool IsQueryString                                          | 查询条件与 URL QueryString 同步 |
| bool IsRemove                                               | 开启删除                        |
| bool IsRowRemove                                            | 开启删除（表格每行）            |
| bool IsView                                                 | 开启查看                        |
| bool IsAdd                                                  | 开启添加                        |
| bool IsEdit                                                 | 开启编辑                        |
| bool IsAudit                                                | 开启审批                        |
| bool IsRefersh                                              | 开启刷新                        |
| bool IsRowNumber                                            | 开启行号                        |
| bool IsNotifyChanged                                        | 开启添加/编辑/删除通知其他端     |
| bool IsSearchText                                           | 开启文本搜索                    |
| bool IsSingleSelect                                         | 开启单选                        |
| bool IsMultiSelect                                          | 开启多选                        |
| Func\<TItem, bool\> CanbeSelect                             | 行是否禁止选择                   |
| bool IsConfirmEdit                                          | 开启编辑保存时，弹框确认        |
| bool IsConfirmRemove                                        | 开启删除时，弹框确认            |
| int Colspan                                                 | 表格一行显示几条记录            |
| int BodyHeight                                              | 表格高度                        |
| string DialogClassName                                      | 弹框样式                        |
| Func\<AdminQueryInfo, Task\> InitQuery                      | 初始化查询                      |
| EventCallback\<AdminQueryEventArgs\<TItem\>\> OnQuery       | 正在查询，设置条件               |
| EventCallback\<TItem\> OnEdit                               | 正在编辑，设置编辑对象           |
| EventCallback\<AdminConfirmEventArgs\<TItem\>\> OnSaving    | 保存中，可拦截                   |
| EventCallback\<TItem\> OnSaved                              | 保存完成                        |
| EventCallback\<AdminRemoveEventArgs\<TItem\>\> OnRemoving   | 删除中，可拦截                   |
| EventCallback\<List\<TItem\>\> OnRemove                     | 删除完成                        |
| EventCallback\<List\<AdminItem\<TItem\>\>\> OnSelectChanged | 选择内容发生变化                 |
| EventCallback\<AdminItem\<TItem\>\> OnRowClick              | 单击表格行时                    |
| RenderFragment TableHeader                                  | 表格 TR 模板                    |
| RenderFragment\<TItem\> TableRow                            | 表格 TD 模板                    |
| RenderFragment\<TItem\> EditTemplate                        | 添加/编辑 模板                  |
| RenderFragment CardHeader                                   | 卡片 Header 模板                |
| RenderFragment CardFooter                                   | 卡片 Fotter 模板                |

### 2. 弹框 AdminModal

| 名称                           | 说明                                                                    |
| ------------------------------ | ----------------------------------------------------------------------- |
| string Title                   | 标题                                                                    |
| bool Visible                   | 是否显示                                                                |
| bool IsBackdropStatic          | 是否静态模式                                                            |
| bool IsKeyboard                | 是否接受 ESC 关闭                                                       |
| bool IsDraggable               | 是否拖动                                                                |
| string DialogClassName         | 弹框样式，如：modal-sm、modal-lg、modal-xl、modal-xxl、modal-fullscreen  |
| string YesButton               | 确认按钮                                                                |
| string CloseButton             | 关闭按钮                                                                |
| EventCallback\<TItem\> OnYes   | 确认时                                                                  |
| EventCallback\<TItem\> OnClose | 关闭时                                                                  |
| RenderFragment ChildContent    | 内容模板                                                                |

### 3. 其他

```html
<SelectDict ParentName="WLPZ" @bind-Value="item.xxx" />

<SelectEntity TItem="Classify" TKey="long?" @bind-Value="item.ClassifyId" DisplayText="e => e.ClassifyName" />

<SelectEnum TEnum="ArticleType" @bind-Value="item.ArticleType" />

<InputFile2 @bind-Value="item.Path" />
```

### 4. 更多参考 blazor.zone

[Bootstrap Blazor UI](https://www.blazor.zone/components)
