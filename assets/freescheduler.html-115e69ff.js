import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as a,c as r,a as e,b as d,d as i,e as l}from"./app-7c25fe7b.js";const c={},u=e("h1",{id:"freescheduler",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#freescheduler","aria-hidden":"true"},"#"),d(" FreeScheduler")],-1),o=e("p",null,"FreeScheduler 是利用 IdleBus 实现的轻量化定时任务调度，支持临时的延时任务和重复循环任务(可持久化)，可按秒，每天/每周/每月固定时间，自定义间隔执行，支持 .NET Core 2.1+、.NET Framework 4.0+ 运行环境。",-1),v={href:"https://github.com/2881099/FreeScheduler",target:"_blank",rel:"noopener noreferrer"},b={href:"https://www.cnblogs.com/FreeSql/p/16623030.html",target:"_blank",rel:"noopener noreferrer"},m=l(`<h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><blockquote><p>dotnet add package FreeScheduler</p></blockquote><blockquote><p>Install-Package FreeScheduler</p></blockquote><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>static Lazy&lt;Scheduler&gt; _schedulerLazy = new Lazy(() =&gt; new Scheduler(new MyTaskHandler()));
static Scheduler scheduler =&gt; _schedulerLazy.Value;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="临时任务-不可持久化" tabindex="-1"><a class="header-anchor" href="#临时任务-不可持久化" aria-hidden="true">#</a> 临时任务(不可持久化)</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>void Callback()
{
    Console.WriteLine(&quot;时间到了&quot;);
    scheduler.AddTempTask(TimeSpan.FromSeconds(10), Callback); //下一次定时
}

scheduler.AddTempTask(TimeSpan.FromSeconds(10), Callback);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>Method</th><th>说明</th></tr></thead><tbody><tr><td>string AddTempTask(TimeSpan, Action)</td><td>创建临时的延时任务，返回 id</td></tr><tr><td>bool RemoveTempTask(string id)</td><td>删除任务(临时任务)</td></tr><tr><td>bool ExistsTempTask(string id)</td><td>判断任务是否存在(临时任务)</td></tr><tr><td>int QuantityTempTask</td><td>任务数量(临时任务)</td></tr></tbody></table><h2 id="普通任务" tabindex="-1"><a class="header-anchor" href="#普通任务" aria-hidden="true">#</a> 普通任务</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>class MyTaskHandler : FreeScheduler.TaskHandlers.TestHandler
{
    public override void OnExecuting(Scheduler scheduler, TaskInfo task)
    {
        //todo..
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="持久化任务" tabindex="-1"><a class="header-anchor" href="#持久化任务" aria-hidden="true">#</a> 持久化任务</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>// 使用 FreeSql 持久化任务
class MyTaskHandler : FreeScheduler.TaskHandlers.FreeSqlHandler
{
    public MyTaskHandler(IFreeSql fsql) : base(fsql) { }

    public override void OnExecuting(Scheduler scheduler, TaskInfo task)
    {
        Console.WriteLine($&quot;[{DateTime.Now.ToString(&quot;HH:mm:ss.fff&quot;)}] {task.Topic} 被执行&quot;);

        //强制使任务完成
        //task.Status = TaskStatus.Completed;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Redis 持久化请安装：</p><blockquote><p>dotnet add package FreeScheduler.TaskHandlers.FreeRedis</p></blockquote><blockquote><p>Install-Package FreeScheduler.TaskHandlers.FreeRedis</p></blockquote><h2 id="管理任务" tabindex="-1"><a class="header-anchor" href="#管理任务" aria-hidden="true">#</a> 管理任务</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>// 使用 FreeSql 或者 SQL 查询 TaskInfo、TaskLog 两个表进行分页显示
fsql.Select&lt;TaskInfo&gt;().Count(out var total).Page(pageNumber, 30).ToList();
fsql.Select&lt;TaskLog&gt;().Count(out var total).Page(pageNumber, 30).ToList();

//暂停任务
scheduler.PauseTask(id);
//恢复暂停的任务
scheduler.ResumeTask(id);
//删除任务
scheduler.RemoveTask(id);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="api-循环任务-可持久化" tabindex="-1"><a class="header-anchor" href="#api-循环任务-可持久化" aria-hidden="true">#</a> API (循环任务/可持久化)</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>//每5秒触发，执行N次
var id = scheduler.AddTask(&quot;topic1&quot;, &quot;body1&quot;, round: -1, 5);

//每次 不同的间隔秒数触发，执行6次
var id = scheduler.AddTask(&quot;topic1&quot;, &quot;body1&quot;, new [] { 5, 5, 10, 10, 60, 60 });

//每天 20:00:00 触发，指定utc时间，执行N次
var id = scheduler.AddTaskRunOnDay(&quot;topic1&quot;, &quot;body1&quot;, round: -1, &quot;20:00:00&quot;);

//每周一 20:00:00 触发，指定utc时间，执行1次
var id = scheduler.AddTaskRunOnWeek(&quot;topic1&quot;, &quot;body1&quot;, round: 1, &quot;1:20:00:00&quot;);

//每月1日 20:00:00 触发，指定utc时间，执行12次
var id = scheduler.AddTaskRunOnMonth(&quot;topic1&quot;, &quot;body1&quot;, round: 12, &quot;1:20:00:00&quot;);

//自定义间隔
var id = scheduler.AddTaskCustom(&quot;topic1&quot;, &quot;body1&quot;, &quot;0/1 * * * * ? &quot;);
class MyCustomTaskHandler : FreeScheduler.ITaskIntervalCustomHandler
{
    public TimeSpan? NextDelay(TaskInfo task)
    {
        //利用 cron 功能库解析 task.IntervalArgument 得到下一次执行时间
        //与当前时间相减，得到 TimeSpan，若返回 null 则任务完成
        return TimeSpan.FromSeconds(5);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>Method</th><th>说明</th></tr></thead><tbody><tr><td>void ctor(ITaskHandler)</td><td>指定任务调度器（单例）</td></tr><tr><td>string AddTask(string topic, string body, int round, int seconds)</td><td>创建循环定时任务，返回 id</td></tr><tr><td>string AddTask(string topic, string body, int[] seconds)</td><td>创建每轮间隔不同的定时任务，返回 id</td></tr><tr><td>string AddTaskRunOnDay(..)</td><td>创建每日循环任务，指定utc时间，返回 id</td></tr><tr><td>string AddTaskRunOnWeek(..)</td><td>创建每周循环任务，指定utc时间，返回 id</td></tr><tr><td>string AddTaskRunOnMonth(..)</td><td>创建每月循环任务，指定utc时间，返回 id</td></tr><tr><td>string AddTaskCustom(string topic, string body, string expression)</td><td>创建自定义任务，返回 id</td></tr><tr><td>bool RemoveTask(string id)</td><td>删除任务</td></tr><tr><td>bool ExistsTask(string id)</td><td>判断任务是否存在</td></tr><tr><td>bool ResumeTask(string id)</td><td>恢复已暂停的任务</td></tr><tr><td>bool PauseTask(string id)</td><td>暂停正在运行的任务</td></tr><tr><td>TaskInfo[] FindTask(lambda)</td><td>查询正在运行中的任务</td></tr><tr><td>int QuantityTask</td><td>任务数量</td></tr></tbody></table>`,19);function h(k,p){const n=t("ExternalLinkIcon");return a(),r("div",null,[u,o,e("p",null,[d("开源地址："),e("a",v,[d("https://github.com/2881099/FreeScheduler"),i(n)])]),e("p",null,[d("扩展资料："),e("a",b,[d("《.NET 定时任务 -- FreeScheduler 支持 cron、持久化、可变定时设置》"),i(n)])]),m])}const q=s(c,[["render",h],["__file","freescheduler.html.vue"]]);export{q as default};
