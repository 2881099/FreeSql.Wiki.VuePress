import{_ as o}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as c,o as l,c as i,b as s,d as a,e,a as p}from"./app-Bpctl-Jy.js";const u={},r={href:"https://docs.taosdata.com/",target:"_blank",rel:"noopener noreferrer"},k={href:"https://docs.taosdata.com/connector/#%E5%AE%89%E8%A3%85%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%A9%B1%E5%8A%A8",target:"_blank",rel:"noopener noreferrer"};function d(m,n){const t=c("ExternalLinkIcon");return l(),i("div",null,[n[2]||(n[2]=s("h2",{id:"介绍",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#介绍","aria-hidden":"true"},"#"),a(" 介绍")],-1)),n[3]||(n[3]=s("p",null,"TDengine 是一款开源、高性能、云原生的时序数据库, 它专为物联网、车联网、工业互联网、金融、IT 运维等场景优化设计",-1)),s("p",null,[s("a",r,[n[0]||(n[0]=a("TDengine 文档 | TDengine 文档 | 涛思数据")),e(t)])]),n[4]||(n[4]=p(`<h2 id="安装包" tabindex="-1"><a class="header-anchor" href="#安装包" aria-hidden="true">#</a> 安装包</h2><p>FreeSql.Provider.TDengine</p><p>.NET CLI</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>dotnet <span class="token function">add</span> package FreeSql.Provider.TDengine
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Package Manager</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>Install-Package FreeSql.Provider.TDengine
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="安装客户端驱动" tabindex="-1"><a class="header-anchor" href="#安装客户端驱动" aria-hidden="true">#</a> 安装客户端驱动</h2><p>如果选择原生连接，而且应用程序不在 TDengine 同一台服务器上运行，你需要先安装客户端驱动，否则可以跳过此一步。为避免客户端驱动和服务端不兼容，请使用一致的版本。</p>`,8)),s("p",null,[s("a",k,[n[1]||(n[1]=a("安装客户端驱动 taosc")),e(t)])]),n[5]||(n[5]=p(`<h2 id="声明" tabindex="-1"><a class="header-anchor" href="#声明" aria-hidden="true">#</a> 声明</h2><blockquote><p>建议尽量使用无参数化</p></blockquote><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">static</span> <span class="token class-name">IFreeSql</span> fsql <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">FreeSql<span class="token punctuation">.</span>FreeSqlBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">UseConnectionString</span><span class="token punctuation">(</span>FreeSql<span class="token punctuation">.</span>DataType<span class="token punctuation">.</span>TDengine<span class="token punctuation">,</span>
        <span class="token string">&quot;host=localhost;port=6030;username=root;password=taosdata;protocol=Native;db=test;&quot;</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">UseMonitorCommand</span><span class="token punctuation">(</span>cmd <span class="token operator">=&gt;</span> Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Sql：</span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">cmd<span class="token punctuation">.</span>CommandText</span><span class="token punctuation">}</span></span><span class="token string">\\r\\n&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">UseNoneCommandParameter</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token comment">//无参数化</span>
    <span class="token punctuation">.</span><span class="token function">Build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="特有功能" tabindex="-1"><a class="header-anchor" href="#特有功能" aria-hidden="true">#</a> 特有功能</h2><h3 id="超级表" tabindex="-1"><a class="header-anchor" href="#超级表" aria-hidden="true">#</a> 超级表</h3><p>采用“一个数据采集点一张表”的设计虽然有助于针对性地管理每个采集点，但随着设备数量不断增加表的数量也会急剧增加，这给数据库管理和数据分析带来了挑战。在进行跨数据采集点的聚合操作时，用户需要面对大量的表，工作变得异常繁重。</p><p>为了解决这个问题，TDengine 引入超级表（Super Table，简称为 STable）的概念。超级表是一种数据结构，它能够将某一特定类型的数据采集点聚集在一起，形成一张逻辑上的统一表。这些数据采集点具有相同的表结构，但各自的静态属性（如标签）可能不同。创建超级表时，除了定义采集量以外，还需定义超级表的标签。一张超级表至少包含一个时间戳列、一个或多个采集量列以及一个或多个标签列。此外，超级表的标签可以灵活地进行增加、修改或删除操作。</p><p>在 TDengine 中，表代表具体的数据采集点，而超级表则代表一组具有相同属性的数据采集点集合。以智能电表为例，我们可以为该类型的电表创建一张超级表，其中包含了所有智能电表的共有属性和采集量。这种设计不仅简化了表的管理，还便于进行跨数据采集点的聚合操作，从而提高数据处理的效率。</p><h3 id="子表" tabindex="-1"><a class="header-anchor" href="#子表" aria-hidden="true">#</a> 子表</h3><p>子表是数据采集点在逻辑上的一种抽象表示，它是隶属于某张超级表的具体表。用户可以将超级表的定义作为模板，并通过指定子表的标签值来创建子表。这样，通过超级表生成的表便被称为子表。超级表与子表之间的关系主要体现在以下几个方面。</p><ul><li>一张超级表包含多张子表，这些子表具有相同的表结构，但标签值各异。</li><li>子表的表结构不能直接修改，但可以修改超级表的列和标签，且修改对所有子表立即生效。</li><li>超级表定义了一个模板，自身并不存储任何数据或标签信息。</li></ul><p>在 TDengine 中，查询操作既可以在子表上进行，也可以在超级表上进行。针对超级表的查询，TDengine 将所有子表中的数据视为一个整体，首先通过标签筛选出满足查询条件的表，然后在这些子表上分别查询时序数据，最终将各张子表的查询结果合并。本质上，TDengine 通过对超级表查询的支持，实现了多个同类数据采集点的高效聚合。为了更好地理解采集量、标签、超级表与子表之间的关系，这里以智能电表的数据模型为例进行说明。可以参考图 3-1 的数据模型，以便更直观地了解这些概念。</p><p>为了更好地理解采集量、标签、超级与子表的关系，以智能电表为例，可以参考下图</p><figure><img src="https://docs.taosdata.com/assets/images/data-model-b937dfef72001fd8842294bf8fb10cd0.png" alt="数据模型示意图" tabindex="0" loading="lazy"><figcaption>数据模型示意图</figcaption></figure><h3 id="例子" tabindex="-1"><a class="header-anchor" href="#例子" aria-hidden="true">#</a> 例子</h3><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code>   <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineSuperTable</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;meters&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
   <span class="token keyword">class</span> <span class="token class-name">Meters</span>
   <span class="token punctuation">{</span>
       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;ts&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token return-type class-name">DateTime</span> Ts <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>

       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;current&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">float</span></span> Current <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>

       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;voltage&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">int</span></span> Voltage <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>

       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;describe&quot;</span><span class="token punctuation">,</span> StringLength <span class="token operator">=</span> <span class="token number">50</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">string</span><span class="token punctuation">?</span></span> Describe <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>

       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineTag</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;location&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token keyword">virtual</span> <span class="token return-type class-name"><span class="token keyword">string</span><span class="token punctuation">?</span></span> Location <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>

       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineTag</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;group_id&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token keyword">virtual</span> <span class="token return-type class-name"><span class="token keyword">int</span></span> GroupId <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
   <span class="token punctuation">}</span>

   <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineSubTable</span><span class="token attribute-arguments"><span class="token punctuation">(</span>SuperTableName <span class="token operator">=</span> <span class="token string">&quot;meters&quot;</span><span class="token punctuation">,</span> Name <span class="token operator">=</span> <span class="token string">&quot;d1001&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
   <span class="token keyword">class</span> <span class="token class-name">D1001</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">Meters</span></span>
   <span class="token punctuation">{</span>
       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineTag</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;location&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token keyword">override</span> <span class="token return-type class-name"><span class="token keyword">string</span></span> Location <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token string">&quot;BeiJIng.ChaoYang&quot;</span><span class="token punctuation">;</span>

       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineTag</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;group_id&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token keyword">override</span> <span class="token return-type class-name"><span class="token keyword">int</span></span> GroupId <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>


   <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineSubTable</span><span class="token attribute-arguments"><span class="token punctuation">(</span>SuperTableName <span class="token operator">=</span> <span class="token string">&quot;meters&quot;</span><span class="token punctuation">,</span> Name <span class="token operator">=</span> <span class="token string">&quot;d1002&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
   <span class="token keyword">class</span> <span class="token class-name">D1002</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">Meters</span></span>
   <span class="token punctuation">{</span>
       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineTag</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;location&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token keyword">new</span> <span class="token return-type class-name"><span class="token keyword">string</span></span> Location <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token string">&quot;California.SanFrancisco&quot;</span><span class="token punctuation">;</span>

       <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">TDengineTag</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;group_id&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
       <span class="token keyword">public</span> <span class="token keyword">new</span> <span class="token return-type class-name"><span class="token keyword">int</span></span> GroupId <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>CodeFirst创建表</p></blockquote><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token comment">//尽量确定表结构</span>
<span class="token comment">//同步子表会自动创建超表</span>
fsql<span class="token punctuation">.</span>CodeFirst<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">SyncStructure</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>D1001<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
fsql<span class="token punctuation">.</span>CodeFirst<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">SyncStructure</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>D1002<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>插入数据</p></blockquote><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token comment">//向子表插入数据</span>
<span class="token class-name"><span class="token keyword">var</span></span> affrows <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token constructor-invocation class-name">D1002</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    Ts <span class="token operator">=</span> DateTime<span class="token punctuation">.</span>Now<span class="token punctuation">,</span>
    Current <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span>
    Voltage <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span>
    Describe <span class="token operator">=</span> <span class="token string">&quot;D10021&quot;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//批量向子表插入数据，注意 一定要关闭参数化</span>
<span class="token class-name"><span class="token keyword">var</span></span> batchRes <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token constructor-invocation class-name">List<span class="token punctuation">&lt;</span>D1002<span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">new</span> <span class="token constructor-invocation class-name">D1002</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        Ts <span class="token operator">=</span> DateTime<span class="token punctuation">.</span>Now<span class="token punctuation">,</span>
        Current <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">,</span>
        Voltage <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">,</span>
        Describe <span class="token operator">=</span> <span class="token string">&quot;D10026&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token keyword">new</span> <span class="token constructor-invocation class-name">D1002</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        Ts <span class="token operator">=</span> DateTime<span class="token punctuation">.</span>Now<span class="token punctuation">,</span>
        Current <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">,</span>
        Voltage <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">,</span>
        Describe <span class="token operator">=</span> <span class="token string">&quot;D10023&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token keyword">new</span> <span class="token constructor-invocation class-name">D1002</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        Ts <span class="token operator">=</span> DateTime<span class="token punctuation">.</span>Now<span class="token punctuation">,</span>
        Current <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">,</span>
        Voltage <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">,</span>
        Describe <span class="token operator">=</span> <span class="token string">&quot;D10024&quot;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>查询</p></blockquote><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token comment">//查询子表</span>
<span class="token class-name"><span class="token keyword">var</span></span> list <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>D1001<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//查询超表</span>
<span class="token class-name"><span class="token keyword">var</span></span> metersList <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Meters<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>d <span class="token operator">=&gt;</span> d<span class="token punctuation">.</span>GroupId <span class="token operator">==</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>删除</p></blockquote><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> startTime <span class="token operator">=</span> DateTime<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span><span class="token string">&quot;2024-11-30T02:33:52.308+00:00&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">var</span></span> endTime <span class="token operator">=</span> DateTime<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span><span class="token string">&quot;2024-11-30T02:40:58.961+00:00&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//必须包含时间戳</span>
<span class="token class-name"><span class="token keyword">var</span></span> executeAffrows <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Delete</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Meters<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>meters <span class="token operator">=&gt;</span> meters<span class="token punctuation">.</span>Ts <span class="token operator">&gt;=</span> startTime <span class="token operator">&amp;&amp;</span> meters<span class="token punctuation">.</span>Ts <span class="token operator">&lt;=</span> endTime <span class="token operator">&amp;&amp;</span> meters<span class="token punctuation">.</span>GroupId <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,24))])}const g=o(u,[["render",d],["__file","freesql-provider-tdengine.html.vue"]]);export{g as default};
