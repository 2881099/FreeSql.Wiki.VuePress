import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{r as s,o as r,c as a,a as e,b as d,d as i,e as l}from"./app-cbb4ea04.js";const u={},o=e("h1",{id:"freescheduler",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#freescheduler","aria-hidden":"true"},"#"),d(" FreeScheduler")],-1),c=e("p",null,"FreeScheduler 是利用 IdleBus 实现的轻量化定时任务调度，支持集群、临时的延时任务和重复循环任务(可持久化)，可按秒，每天/每周/每月固定时间，自定义间隔执行，支持 .NET Core 2.1+、.NET Framework 4.0+ 运行环境。",-1),v={href:"https://github.com/2881099/FreeScheduler",target:"_blank",rel:"noopener noreferrer"},m={href:"https://www.cnblogs.com/FreeSql/p/16623030.html",target:"_blank",rel:"noopener noreferrer"},b=l(`<h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><blockquote><p>dotnet add package FreeScheduler</p></blockquote><blockquote><p>Install-Package FreeScheduler</p></blockquote><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>static Scheduler scheduler = new FreeSchedulerBuilder()
    .OnExecuting(task =&gt;
    {
        Console.WriteLine($&quot;[{DateTime.Now.ToString(&quot;HH:mm:ss.fff&quot;)}] {task.Topic} 被执行&quot;);
        switch (task.Topic)
        {
            case &quot;武林大会&quot;: Wulin(task.Body); break;
            case &quot;攻城活动&quot;: AttackCity(task.Body); break;
        }
    })
    .Build();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>Method</th><th>说明</th></tr></thead><tbody><tr><td>OnExecuting(Action&lt;TaskInfo&gt; executing)</td><td>任务触发</td></tr><tr><td>UseFreeSql()</td><td>基于 数据库，使用 FreeSql ORM 持久化</td></tr><tr><td>UseFreeRedis()</td><td>基于 Redis，使用 FreeRedis 持久化</td></tr><tr><td>UseCluster()</td><td>开启集群（依赖 Redis），支持跨进程互通</td></tr><tr><td>UseCustomInterval()</td><td>自定义间隔（可实现 cron）</td></tr><tr><td>UseScanInterval()</td><td>扫描间隔（默认200ms），值越小触发精准</td></tr><tr><td>Build()</td><td>创建 Scheduler 对象</td></tr></tbody></table><h2 id="集群特性" tabindex="-1"><a class="header-anchor" href="#集群特性" aria-hidden="true">#</a> 集群特性</h2><ul><li>支持 单项目，多站点部署</li><li>支持 多进程，不重复执行</li><li>支持 进程退出后，由其他进程重新加载任务（约30秒后）</li><li>支持 进程互通，任意进程都可以执行（RemoveTask/ExistsTask/PauseTask/RunNowTask/RemoveTempTask/ExistsTempTask）</li><li>支持 进程意外离线后，卸载进程内的任务，重新安排上线</li></ul><h2 id="临时任务-不可持久化" tabindex="-1"><a class="header-anchor" href="#临时任务-不可持久化" aria-hidden="true">#</a> 临时任务(不可持久化)</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>void Callback()
{
    Console.WriteLine(&quot;时间到了&quot;);
    scheduler.AddTempTask(TimeSpan.FromSeconds(10), Callback); //下一次定时
}
scheduler.AddTempTask(TimeSpan.FromSeconds(10), Callback);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>Method</th><th>说明</th></tr></thead><tbody><tr><td>string AddTempTask(TimeSpan, Action)</td><td>创建临时的延时任务，返回 id</td></tr><tr><td>bool RemoveTempTask(string id)</td><td>删除任务(临时任务)</td></tr><tr><td>bool ExistsTempTask(string id)</td><td>判断任务是否存在(临时任务)</td></tr><tr><td>int QuantityTempTask</td><td>任务数量(临时任务)</td></tr></tbody></table><h2 id="循环任务-可持久化" tabindex="-1"><a class="header-anchor" href="#循环任务-可持久化" aria-hidden="true">#</a> 循环任务/可持久化</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>//每5秒触发，执行N次
var id = scheduler.AddTask(&quot;topic1&quot;, &quot;body1&quot;, round: -1, 5);

//每次 不同的间隔秒数触发，执行6次
var id = scheduler.AddTask(&quot;topic1&quot;, &quot;body1&quot;, new [] { 5, 5, 10, 10, 60, 60 });

//每天 20:00:00 触发，指定utc时间，执行N次
var id = scheduler.AddTaskRunOnDay(&quot;topic1&quot;, &quot;body1&quot;, round: -1, &quot;20:00:00&quot;);

//每周一 20:00:00 触发，指定utc时间，执行1次
var id = scheduler.AddTaskRunOnWeek(&quot;topic1&quot;, &quot;body1&quot;, round: 1, &quot;1:20:00:00&quot;);

//每月1日 20:00:00 触发，指定utc时间，执行12次
var id = scheduler.AddTaskRunOnMonth(&quot;topic1&quot;, &quot;body1&quot;, round: 12, &quot;1:20:00:00&quot;);
//每月最后一日 20:00:00 触发，指定utc时间，执行12次
var id = scheduler.AddTaskRunOnMonth(&quot;topic1&quot;, &quot;body1&quot;, round: 12, &quot;-1:20:00:00&quot;);

//自定义间隔 cron
var id = scheduler.AddTaskCustom(&quot;topic1&quot;, &quot;body1&quot;, &quot;0/1 * * * * ? &quot;);
new FreeSchedulerBuilder()
    ...
    .UseCustomInterval(task =&gt;
    {
        //利用 cron 功能库解析 task.IntervalArgument 得到下一次执行时间
        //与当前时间相减，得到 TimeSpan，若返回 null 则任务完成
        return TimeSpan.FromSeconds(5);
    })
    .Build();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>Method</th><th>说明</th></tr></thead><tbody><tr><td>void ctor(ITaskHandler)</td><td>指定任务调度器（单例）</td></tr><tr><td>string AddTask(string topic, string body, int round, int seconds)</td><td>创建循环定时任务，返回 id</td></tr><tr><td>string AddTask(string topic, string body, int[] seconds)</td><td>创建每轮间隔不同的定时任务，返回 id</td></tr><tr><td>string AddTaskRunOnDay(..)</td><td>创建每日循环任务，指定utc时间，返回 id</td></tr><tr><td>string AddTaskRunOnWeek(..)</td><td>创建每周循环任务，指定utc时间，返回 id</td></tr><tr><td>string AddTaskRunOnMonth(..)</td><td>创建每月循环任务，指定utc时间，返回 id</td></tr><tr><td>string AddTaskCustom(string topic, string body, string expression)</td><td>创建自定义任务，返回 id</td></tr><tr><td>bool RemoveTask(string id)</td><td>删除任务</td></tr><tr><td>bool ExistsTask(string id)</td><td>判断任务是否存在</td></tr><tr><td>bool ResumeTask(string id)</td><td>恢复已暂停的任务</td></tr><tr><td>bool PauseTask(string id)</td><td>暂停正在运行的任务</td></tr><tr><td>TaskInfo[] FindTask(lambda)</td><td>查询正在运行中的任务</td></tr><tr><td>int QuantityTask</td><td>任务数量</td></tr></tbody></table><h2 id="管理任务" tabindex="-1"><a class="header-anchor" href="#管理任务" aria-hidden="true">#</a> 管理任务</h2><div class="language-c# line-numbers-mode" data-ext="c#"><pre class="language-c#"><code>// 使用 FreeSql 或者 SQL 查询 TaskInfo、TaskLog 两个表进行分页显示
fsql.Select&lt;TaskInfo&gt;().Count(out var total).Page(pageNumber, 30).ToList();
fsql.Select&lt;TaskLog&gt;().Count(out var total).Page(pageNumber, 30).ToList();

//暂停任务
scheduler.PauseTask(id);
//恢复暂停的任务
scheduler.ResumeTask(id);
//删除任务
scheduler.RemoveTask(id);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例项目：https://github.com/2881099/FreeScheduler/tree/master/Examples/Examples_FreeScheduler_Dashboard</p><figure><img src="https://github.com/2881099/FreeSql.Wiki.VuePress/assets/16286519/fadfd7f4-c6de-4326-be65-f7c1012651ef" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure>`,17);function h(k,g){const t=s("ExternalLinkIcon");return r(),a("div",null,[o,c,e("p",null,[d("开源地址："),e("a",v,[d("https://github.com/2881099/FreeScheduler"),i(t)])]),e("p",null,[d("扩展资料："),e("a",m,[d("《.NET 定时任务 -- FreeScheduler 支持 cron、持久化、可变定时设置》"),i(t)])]),b])}const q=n(u,[["render",h],["__file","freescheduler.html.vue"]]);export{q as default};
