import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as p,o as d,c as r,b as n,d as s,e as a,w as o,a as u}from"./app-BuKgeyoU.js";const c={},k={href:"https://www.cnblogs.com/FreeSql/p/16485310.html",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/dotnetcore/FreeSql/discussions/1550",target:"_blank",rel:"noopener noreferrer"};function v(b,t){const l=p("RouterLink"),e=p("ExternalLinkIcon");return d(),r("div",null,[t[97]||(t[97]=n("h1",{id:"查询",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#查询","aria-hidden":"true"},"#"),s(" 查询")],-1)),t[98]||(t[98]=n("p",null,"FreeSql 在查询数据下足了功夫，链式风格、多表查询、表达式函数、导航属性支持得非常到位。",-1)),n("table",null,[t[18]||(t[18]=n("thead",null,[n("tr",null,[n("th"),n("th"),n("th")])],-1)),n("tbody",null,[n("tr",null,[n("td",null,[a(l,{to:"/guide/paging.html"},{default:o(()=>t[0]||(t[0]=[s("《分页查询》")])),_:1})]),n("td",null,[a(l,{to:"/guide/repository.html"},{default:o(()=>t[1]||(t[1]=[s("《仓储层 Repository》")])),_:1})]),n("td",null,[a(l,{to:"/guide/read-write-splitting.html"},{default:o(()=>t[2]||(t[2]=[s("《读写分离》")])),_:1})])]),n("tr",null,[n("td",null,[a(l,{to:"/guide/select-single-table.html"},{default:o(()=>t[3]||(t[3]=[s("《单表查询》")])),_:1})]),n("td",null,[a(l,{to:"/guide/filters.html"},{default:o(()=>t[4]||(t[4]=[s("《过滤器》")])),_:1})]),n("td",null,[a(l,{to:"/guide/linq-to-sql.html"},{default:o(()=>t[5]||(t[5]=[s("《LinqToSql》")])),_:1})])]),n("tr",null,[n("td",null,[a(l,{to:"/guide/select-multi-table.html"},{default:o(()=>t[6]||(t[6]=[s("《多表查询》")])),_:1})]),n("td",null,[a(l,{to:"/guide/select-lazy-loading.html"},{default:o(()=>t[7]||(t[7]=[s("《延时加载》")])),_:1})]),n("td",null,[a(l,{to:"/guide/performance.html"},{default:o(()=>t[8]||(t[8]=[s("《性能》")])),_:1})])]),n("tr",null,[n("td",null,[a(l,{to:"/guide/withtempquery.html"},{default:o(()=>t[9]||(t[9]=[s("《嵌套查询》")])),_:1})]),n("td",null,[a(l,{to:"/guide/select-include.html"},{default:o(()=>t[10]||(t[10]=[s("《贪婪加载》")])),_:1})]),n("td",null,[a(l,{to:"/guide/sharding.html"},{default:o(()=>t[11]||(t[11]=[s("《分表分库》")])),_:1})])]),n("tr",null,[n("td",null,[a(l,{to:"/guide/select-group-by.html"},{default:o(()=>t[12]||(t[12]=[s("《分组聚合查询》")])),_:1})]),n("td",null,[a(l,{to:"/guide/expression-function.html"},{default:o(()=>t[13]||(t[13]=[s("《表达式函数》")])),_:1})]),n("td",null,[a(l,{to:"/guide/multi-tenancy.html"},{default:o(()=>t[14]||(t[14]=[s("《多租户》")])),_:1})])]),n("tr",null,[n("td",null,[a(l,{to:"/guide/select-return-data.html"},{default:o(()=>t[15]||(t[15]=[s("《返回数据》")])),_:1})]),t[16]||(t[16]=n("td",null,null,-1)),t[17]||(t[17]=n("td",null,null,-1))])])]),t[99]||(t[99]=u('<h2 id="表达式函数" tabindex="-1"><a class="header-anchor" href="#表达式函数" aria-hidden="true">#</a> 表达式函数</h2><table><thead><tr><th>说明</th><th>Lambda 表达式</th><th>SQL</th></tr></thead><tbody><tr><td>in</td><td>Where(a =&gt; new [] { 1,2,3 }.Contains(a.Id))</td><td>[Id] in (1,2,3)</td></tr><tr><td>not in</td><td>Where(a =&gt; !new [] { 1,2,3 }.Contains(a.Id))</td><td>[Id] not in (1,2,3)</td></tr><tr><td>多列in</td><td>Where(a =&gt; list.Any(b =&gt; b.Item1 == a.Id &amp;&amp; b.Item2 == a.ct1))</td><td>([Id]=1 and [ct1]=1) or ([Id]=2 and [ct1]=2)</td></tr><tr><td>like &#39;%xxx%&#39;</td><td>Where(a =&gt; a.Title.Contains(&quot;xxx&quot;))</td><td>[Title] like &#39;%xxx%&#39;</td></tr><tr><td>like &#39;xxx%&#39;</td><td>Where(a =&gt; a.Title.StartsWith(&quot;xxx&quot;))</td><td>[Title] like &#39;xxx%&#39;</td></tr><tr><td>like &#39;%xxx&#39;</td><td>Where(a =&gt; a.Title.EndsWith(&quot;xxx&quot;))</td><td>[Title] like &#39;%xxx&#39;</td></tr><tr><td>日期范围</td><td>Where(a =&gt; a.Time.Between(time1, time2))</td><td>[Time] between @time1 and @time2</td></tr><tr><td>是否存在</td><td>.Any()</td><td>select 1 from ...</td></tr><tr><td>总数</td><td>.Count()</td><td>select count(*) from ...</td></tr><tr><td>求和</td><td>.Sum(a =&gt; a.Score)</td><td>select sum([Score]) from ...</td></tr><tr><td>平均</td><td>.Avg(a =&gt; a.Score)</td><td>select avg([Score]) from ...</td></tr><tr><td>最大值</td><td>.Max(a =&gt; a.Score)</td><td>select max([Score]) from ...</td></tr><tr><td>最小值</td><td>.Min(a =&gt; a.Score)</td><td>select min([Score]) from ...</td></tr></tbody></table>',2)),n("p",null,[t[20]||(t[20]=s("更详细请前往")),a(l,{to:"/guide/expression-function.html"},{default:o(()=>t[19]||(t[19]=[s("《表达式函数》")])),_:1})]),t[100]||(t[100]=u(`<h2 id="sqlserver-withlock-withindex" tabindex="-1"><a class="header-anchor" href="#sqlserver-withlock-withindex" aria-hidden="true">#</a> SqlServer WithLock/WithIndex</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> list <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Region<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">Limit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//SELECT TOP 1 ... FROM [Region] a With(NoLock)</span>

<span class="token class-name"><span class="token keyword">var</span></span> list <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Region<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithLock</span><span class="token punctuation">(</span>SqlServerLock<span class="token punctuation">.</span>NoLock <span class="token operator">|</span> SqlServerLock<span class="token punctuation">.</span>NoWait<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">Limit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//SELECT TOP 1 ... FROM [Region] a With(NoLock, NoWait)</span>

<span class="token class-name"><span class="token keyword">var</span></span> list <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Region<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithIndex</span><span class="token punctuation">(</span><span class="token string">&quot;idx_01&quot;</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">Limit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//SELECT TOP 1 ... FROM [Region] a With(index=idx_01, NoLock)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>多表：</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> list <span class="token operator">=</span> <span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Region<span class="token punctuation">,</span> T2<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">InnerJoin</span><span class="token punctuation">(</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>x <span class="token operator">==</span> b<span class="token punctuation">.</span>xx<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithLock</span><span class="token punctuation">(</span>SqlServerLock<span class="token punctuation">.</span>NoLock<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Dictionary<span class="token punctuation">&lt;</span>Type<span class="token punctuation">,</span> <span class="token keyword">bool</span><span class="token punctuation">&gt;</span></span>
    <span class="token punctuation">{</span>
        <span class="token punctuation">[</span><span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">T2</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithIndex</span><span class="token punctuation">(</span><span class="token string">&quot;idx_01&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Dictionary<span class="token punctuation">&lt;</span>Type<span class="token punctuation">,</span> <span class="token keyword">string</span><span class="token punctuation">&gt;</span></span>
    <span class="token punctuation">{</span>
        <span class="token punctuation">[</span><span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">T2</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;idx_02&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">Limit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//SELECT TOP 1 ..</span>
<span class="token comment">//FROM [Region] a With(index=idx_01, NoLock) </span>
<span class="token comment">//INNER JOIN [T2] b With(index=idx_02) ON a.[x] = b.[xx]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>全局设置 NoLock：</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token comment">//所有实体类生效</span>
fsql<span class="token punctuation">.</span><span class="token function">SetGlobalSelectWithLock</span><span class="token punctuation">(</span>SqlServerLock<span class="token punctuation">.</span>NoLock<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//【指定】实体类生效</span>
fsql<span class="token punctuation">.</span><span class="token function">SetGlobalSelectWithLock</span><span class="token punctuation">(</span>SqlServerLock<span class="token punctuation">.</span>NoLock<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Dictionary<span class="token punctuation">&lt;</span>Type<span class="token punctuation">,</span> <span class="token keyword">bool</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">{</span>
    <span class="token punctuation">[</span><span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">Region</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">[</span><span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">T2</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="动态过滤-wheredynamicfilter" tabindex="-1"><a class="header-anchor" href="#动态过滤-wheredynamicfilter" aria-hidden="true">#</a> 动态过滤 WhereDynamicFilter</h2>`,7)),n("p",null,[n("a",k,[t[21]||(t[21]=s("《高效理解 FreeSql WhereDynamicFilter，深入了解设计初衷》")),a(e)])]),t[101]||(t[101]=n("p",null,"ISelect.WhereDynamicFilter 方法实现动态过滤条件（与前端交互），支持的操作符：",-1)),n("ul",null,[t[24]||(t[24]=n("li",null,"Contains/StartsWith/EndsWith/NotContains/NotStartsWith/NotEndsWith：包含/不包含，like '%xx%'，或者 like 'xx%'，或者 like '%xx'",-1)),t[25]||(t[25]=n("li",null,"Equal/NotEqual：等于/不等于",-1)),t[26]||(t[26]=n("li",null,"GreaterThan/GreaterThanOrEqual：大于/大于等于",-1)),t[27]||(t[27]=n("li",null,"LessThan/LessThanOrEqual：小于/小于等于",-1)),t[28]||(t[28]=n("li",null,"Range：范围查询",-1)),t[29]||(t[29]=n("li",null,"DateRange：日期范围，有特殊处理 value[1] + 1",-1)),t[30]||(t[30]=n("li",null,"Any/NotAny：是否符合 value 中任何一项（直白的说是 SQL IN）",-1)),n("li",null,[t[23]||(t[23]=s("Custom：")),n("a",m,[t[22]||(t[22]=s("自定义解析")),a(e)])])]),t[102]||(t[102]=u(`<div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name">DynamicFilterInfo</span> dyfilter <span class="token operator">=</span> JsonConvert<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">DeserializeObject</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>DynamicFilterInfo<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">@&quot;
{
  &quot;&quot;Logic&quot;&quot;: &quot;&quot;And&quot;&quot;,
  &quot;&quot;Filters&quot;&quot;:
  [
    { &quot;&quot;Field&quot;&quot;: &quot;&quot;id&quot;&quot;, &quot;&quot;Operator&quot;&quot;: &quot;&quot;Equals&quot;&quot;, &quot;&quot;Value&quot;&quot;: 1 },
    {
      &quot;&quot;Logic&quot;&quot;: &quot;&quot;Or&quot;&quot;,
      &quot;&quot;Filters&quot;&quot;:
      [
        { &quot;&quot;Field&quot;&quot;: &quot;&quot;id&quot;&quot;, &quot;&quot;Operator&quot;&quot;: &quot;&quot;Equals&quot;&quot;, &quot;&quot;Value&quot;&quot;: 2 },
        { &quot;&quot;Field&quot;&quot;: &quot;&quot;id&quot;&quot;, &quot;&quot;Operator&quot;&quot;: &quot;&quot;Equals&quot;&quot;, &quot;&quot;Value&quot;&quot;: 3 }
      ]
    }
  ]
}&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Region<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">WhereDynamicFilter</span><span class="token punctuation">(</span>dyfilter<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//WHERE id = 1 AND (id = 2 OR id = 3)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>动态表名：ISelect.AsTable((t, old) =&gt; $&quot;{old}_201903&quot;)</p></blockquote><blockquote><p>动态排序：ISelect.OrderByPropertyName(&quot;Parent.Code&quot;)</p></blockquote><blockquote><p>动态返回：ISelect.ToDataTableByPropertyName(new string[] { &quot;Parent.Code&quot;, &quot;Id&quot; })</p></blockquote><blockquote><p>动态贪婪加载：ISelect.IncludeByPropertyName(&quot;Parent.Parent&quot;).IncludeByPropertyName(&quot;Parent.Childs&quot;)</p></blockquote><h2 id="克隆查询-iselect" tabindex="-1"><a class="header-anchor" href="#克隆查询-iselect" aria-hidden="true">#</a> 克隆查询 ISelect</h2><p>科普：csharp 7.0 支持本地函数，方法内再定义临时方法，这个特性向大家推荐，在很多时候都非常有效。</p><p>方法内还可以定义方法，那就称它：本地函数/嵌套方法。</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">void</span></span> <span class="token function">Test</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token return-type class-name">ISelect<span class="token punctuation">&lt;</span>AdmRoute<span class="token punctuation">&gt;</span></span> <span class="token function">getSelect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>AdmRoute<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Include</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Parent<span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">WhereIf</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">string</span><span class="token punctuation">.</span><span class="token function">IsNullOrEmpty</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">,</span> a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Name<span class="token punctuation">.</span><span class="token function">Contains</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token range operator">..</span><span class="token punctuation">.</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">WhereIf</span><span class="token punctuation">(</span>Parent_Id<span class="token punctuation">?.</span><span class="token function">Any</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token boolean">true</span><span class="token punctuation">,</span> a <span class="token operator">=&gt;</span> Parent_Id<span class="token punctuation">.</span><span class="token function">Contains</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span>ParentId<span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">WhereIf</span><span class="token punctuation">(</span>mn_Roles_Id<span class="token punctuation">?.</span><span class="token function">Any</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token boolean">true</span><span class="token punctuation">,</span> a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Roles<span class="token punctuation">.</span><span class="token function">Any</span><span class="token punctuation">(</span>b <span class="token operator">=&gt;</span> mn_Roles_Id<span class="token punctuation">.</span><span class="token function">Contains</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span>Id<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token class-name"><span class="token keyword">var</span></span> select1 <span class="token operator">=</span> <span class="token function">getSelect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name"><span class="token keyword">var</span></span> select2 <span class="token operator">=</span> <span class="token function">getSelect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    select1<span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Status <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//此时 select2 不会附加 a.Status == 0 条件</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h2>`,10)),n("table",null,[t[96]||(t[96]=n("thead",null,[n("tr",null,[n("th",null,"方法"),n("th",null,"返回值"),n("th",null,"参数"),n("th",null,"描述"),n("th")])],-1)),n("tbody",null,[t[38]||(t[38]=n("tr",null,[n("td",null,"ToSql"),n("td",null,"string"),n("td"),n("td",null,"返回即将执行的 SQL 语句"),n("td")],-1)),t[39]||(t[39]=n("tr",null,[n("td",null,"ToList"),n("td",null,"List<T1>"),n("td"),n("td",null,"执行 SQL 查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表"),n("td")],-1)),t[40]||(t[40]=n("tr",null,[n("td",null,"ToList<T>"),n("td",null,"List<T>"),n("td",null,"Lambda"),n("td",null,"执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表"),n("td")],-1)),t[41]||(t[41]=n("tr",null,[n("td",null,"ToList<T>"),n("td",null,"List<T>"),n("td",null,"string field"),n("td",null,"执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表"),n("td")],-1)),t[42]||(t[42]=n("tr",null,[n("td",null,"ToOne"),n("td",null,"T1"),n("td"),n("td",null,"执行 SQL 查询，返回 T1 实体所有字段的第一条记录，记录不存在时返回 null"),n("td")],-1)),t[43]||(t[43]=n("tr",null,[n("td",null,"ToAggregate<T>"),n("td",null,"List<T>"),n("td",null,"Lambda"),n("td",null,"执行 SQL 查询，返回指定字段的聚合结果（适合不需要 GroupBy 的场景）"),n("td")],-1)),t[44]||(t[44]=n("tr",null,[n("td",null,"Any"),n("td",null,"bool"),n("td"),n("td",null,"执行 SQL 查询，是否有记录"),n("td")],-1)),t[45]||(t[45]=n("tr",null,[n("td",null,"Sum"),n("td",null,"T"),n("td",null,"Lambda"),n("td",null,"指定一个列求和"),n("td")],-1)),t[46]||(t[46]=n("tr",null,[n("td",null,"Min"),n("td",null,"T"),n("td",null,"Lambda"),n("td",null,"指定一个列求最小值"),n("td")],-1)),t[47]||(t[47]=n("tr",null,[n("td",null,"Max"),n("td",null,"T"),n("td",null,"Lambda"),n("td",null,"指定一个列求最大值"),n("td")],-1)),t[48]||(t[48]=n("tr",null,[n("td",null,"Avg"),n("td",null,"T"),n("td",null,"Lambda"),n("td",null,"指定一个列求平均值"),n("td")],-1)),t[49]||(t[49]=n("tr",null,[n("td",null,"【分页】"),n("td"),n("td"),n("td"),n("td")],-1)),t[50]||(t[50]=n("tr",null,[n("td",null,"Count"),n("td",null,"long"),n("td"),n("td",null,"查询的记录数量"),n("td")],-1)),t[51]||(t[51]=n("tr",null,[n("td",null,"Count"),n("td",null,"<this>"),n("td",null,"out long"),n("td",null,"查询的记录数量，以参数 out 形式返回"),n("td")],-1)),t[52]||(t[52]=n("tr",null,[n("td",null,"Skip"),n("td",null,"<this>"),n("td",null,"int offset"),n("td",null,"查询向后偏移行数"),n("td")],-1)),t[53]||(t[53]=n("tr",null,[n("td",null,"Offset"),n("td",null,"<this>"),n("td",null,"int offset"),n("td",null,"查询向后偏移行数"),n("td")],-1)),t[54]||(t[54]=n("tr",null,[n("td",null,"Limit"),n("td",null,"<this>"),n("td",null,"int limit"),n("td",null,"查询多少条数据"),n("td")],-1)),t[55]||(t[55]=n("tr",null,[n("td",null,"Take"),n("td",null,"<this>"),n("td",null,"int limit"),n("td",null,"查询多少条数据"),n("td")],-1)),t[56]||(t[56]=n("tr",null,[n("td",null,"Page"),n("td",null,"<this>"),n("td",null,"int pageIndex, int pageSize"),n("td",null,"分页"),n("td")],-1)),t[57]||(t[57]=n("tr",null,[n("td",null,"【条件】"),n("td"),n("td"),n("td"),n("td")],-1)),t[58]||(t[58]=n("tr",null,[n("td",null,"Where"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"支持多表查询表达式，多次使用相当于 AND"),n("td")],-1)),t[59]||(t[59]=n("tr",null,[n("td",null,"WhereIf"),n("td",null,"<this>"),n("td",null,"bool, Lambda"),n("td",null,"支持多表查询表达式"),n("td")],-1)),n("tr",null,[t[34]||(t[34]=n("td",null,"Where",-1)),t[35]||(t[35]=n("td",null,"<this>",-1)),t[36]||(t[36]=n("td",null,"string, parms",-1)),n("td",null,[t[32]||(t[32]=s('原生 sql 语法条件，Where("id = @id", new { id = 1 } ,')),a(l,{to:"/guide/ado.html#%E5%8F%82%E6%95%B0%E5%8C%96"},{default:o(()=>t[31]||(t[31]=[s("注意前缀@,根据具体数据库决定")])),_:1}),t[33]||(t[33]=s(" 其他地方不再说明。同理 )"))]),t[37]||(t[37]=n("td",null,null,-1))]),t[60]||(t[60]=n("tr",null,[n("td",null,"WhereIf"),n("td",null,"<this>"),n("td",null,"bool, string, parms"),n("td",null,'原生 sql 语法条件，WhereIf(true, "id = @id", new { id = 1 }'),n("td")],-1)),t[61]||(t[61]=n("tr",null,[n("td",null,"WhereCascade"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"实现多表查询时，向每个表中附加条件"),n("td")],-1)),t[62]||(t[62]=n("tr",null,[n("td",null,"WhereDynamicFilter"),n("td",null,"<this>"),n("td",null,"DynamicFilterInfo"),n("td",null,"动态过滤条件(与前端交互)"),n("td")],-1)),t[63]||(t[63]=n("tr",null,[n("td",null,"【分组】"),n("td"),n("td"),n("td"),n("td")],-1)),t[64]||(t[64]=n("tr",null,[n("td",null,"GroupBy"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"按选择的列分组，GroupBy(a => a.Name)"),n("td",null,"GroupBy(a => new{a.Name,a.Time})")],-1)),t[65]||(t[65]=n("tr",null,[n("td",null,"GroupBy"),n("td",null,"<this>"),n("td",null,"string, parms"),n("td",null,'按原生 sql 语法分组，GroupBy("concat(name, @cc)", new { cc = 1 })'),n("td")],-1)),t[66]||(t[66]=n("tr",null,[n("td",null,"Having"),n("td",null,"<this>"),n("td",null,"string, parms"),n("td",null,'按原生 sql 语法聚合条件过滤，Having("count(name) = @cc", new { cc = 1 })'),n("td")],-1)),t[67]||(t[67]=n("tr",null,[n("td",null,"Disdinct"),n("td",null,"<this>"),n("td"),n("td",null,".Distinct().ToList(x => x.GroupName) 是对指定字段"),n("td")],-1)),t[68]||(t[68]=n("tr",null,[n("td",null,"【排序】"),n("td"),n("td"),n("td"),n("td")],-1)),t[69]||(t[69]=n("tr",null,[n("td",null,"OrderBy"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"按列排序，OrderBy(a => a.Time)，可多次使用"),n("td")],-1)),t[70]||(t[70]=n("tr",null,[n("td",null,"OrderByDescending"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"按列倒向排序，OrderByDescending(a => a.Time)"),n("td")],-1)),t[71]||(t[71]=n("tr",null,[n("td",null,"OrderBy"),n("td",null,"<this>"),n("td",null,"string, parms"),n("td",null,'按原生 sql 语法排序，OrderBy("count(name) + @cc", new { cc = 1 })'),n("td")],-1)),t[72]||(t[72]=n("tr",null,[n("td",null,"OrderByPropertyName"),n("td",null,"string, bool"),n("td",null,"按属性名字符串排序（支持导航属性）"),n("td"),n("td")],-1)),t[73]||(t[73]=n("tr",null,[n("td",null,"【联表】"),n("td"),n("td"),n("td"),n("td")],-1)),t[74]||(t[74]=n("tr",null,[n("td",null,"LeftJoin"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"左联查询，可使用导航属性，或指定关联的实体类型"),n("td")],-1)),t[75]||(t[75]=n("tr",null,[n("td",null,"InnerJoin"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"联接查询，可使用导航属性，或指定关联的实体类型"),n("td")],-1)),t[76]||(t[76]=n("tr",null,[n("td",null,"RightJoin"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"右联查询，可使用导航属性，或指定关联的实体类型"),n("td")],-1)),t[77]||(t[77]=n("tr",null,[n("td",null,"LeftJoin"),n("td",null,"<this>"),n("td",null,"string, parms"),n("td",null,'左联查询，使用原生 sql 语法，LeftJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })'),n("td")],-1)),t[78]||(t[78]=n("tr",null,[n("td",null,"InnerJoin"),n("td",null,"<this>"),n("td",null,"string, parms"),n("td",null,'联接查询，使用原生 sql 语法，InnerJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })'),n("td")],-1)),t[79]||(t[79]=n("tr",null,[n("td",null,"RightJoin"),n("td",null,"<this>"),n("td",null,"string, parms"),n("td",null,'右联查询，使用原生 sql 语法，RightJoin("type b on b.id = a.id and b.clicks > @clicks", new { clicks = 1 })'),n("td")],-1)),t[80]||(t[80]=n("tr",null,[n("td",null,"From"),n("td",null,"<this>"),n("td",null,"Lambda"),n("td",null,"多表查询，3 个表以上使用非常方便，目前设计最大支持 10 个表"),n("td")],-1)),t[81]||(t[81]=n("tr",null,[n("td",null,"FromQuery"),n("td",null,"ISelect<T1, T2>"),n("td",null,"ISelect<T2>"),n("td",null,"单表连成双表查询"),n("td")],-1)),t[82]||(t[82]=n("tr",null,[n("td",null,"WithTempQuery"),n("td",null,"ISelect<T1>"),n("td",null,"Lambda"),n("td",null,"将单表或多表查询嵌套成单表查询"),n("td")],-1)),t[83]||(t[83]=n("tr",null,[n("td",null,"WithMemory"),n("td",null,"ISelect<T1>"),n("td",null,"List<T1>"),n("td",null,"使用内存数据查询"),n("td")],-1)),t[84]||(t[84]=n("tr",null,[n("td",null,"UnionAll"),n("td",null,"ISelect<T1>"),n("td",null,"ISelect<T1>[]"),n("td",null,"联合查询"),n("td")],-1)),t[85]||(t[85]=n("tr",null,[n("td",null,"【其他】"),n("td"),n("td"),n("td"),n("td")],-1)),t[86]||(t[86]=n("tr",null,[n("td",null,"As"),n("td",null,"<this>"),n("td",null,'string alias = "a"'),n("td",null,"指定别名"),n("td")],-1)),t[87]||(t[87]=n("tr",null,[n("td",null,"Master"),n("td",null,"<this>"),n("td"),n("td",null,"指定从主库查询（默认查询从库）"),n("td")],-1)),t[88]||(t[88]=n("tr",null,[n("td",null,"CommandTimeout"),n("td",null,"<this>"),n("td",null,"int"),n("td",null,"命令超时设置(秒)"),n("td")],-1)),t[89]||(t[89]=n("tr",null,[n("td",null,"WithTransaction"),n("td",null,"<this>"),n("td",null,"DbTransaction"),n("td",null,"设置事务对象"),n("td")],-1)),t[90]||(t[90]=n("tr",null,[n("td",null,"WithConnection"),n("td",null,"<this>"),n("td",null,"DbConnection"),n("td",null,"设置连接对象"),n("td")],-1)),t[91]||(t[91]=n("tr",null,[n("td",null,"WithLock"),n("td",null,"<this>"),n("td",null,"Enum"),n("td",null,"SqlServer NoLock 等特有的设置"),n("td")],-1)),t[92]||(t[92]=n("tr",null,[n("td",null,"ForUpdate"),n("td",null,"<this>"),n("td",null,"bool"),n("td",null,"排他更新锁，对不同的数据库已作适配，详细说明见注释"),n("td")],-1)),t[93]||(t[93]=n("tr",null,[n("td",null,"AsQueryable"),n("td",null,"IQueryable"),n("td"),n("td",null,"将 ISelect 转换为 IQueryable，此方法主要用于扩展，比如：abp IRepository GetAll() 接口方法需要返回 IQueryable 对象。注意：IQueryable 方法污染较为严重，请尽量避免此转换"),n("td")],-1)),t[94]||(t[94]=n("tr",null,[n("td",null,"ToTreeList()"),n("td",null,"List<TEntity>"),n("td",null,"无"),n("td",null,"将父子关系的数据以 TreeList 的形式返回"),n("td")],-1)),t[95]||(t[95]=n("tr",null,[n("td",null,"AsTreeCte()"),n("td",null,"ISelect"),n("td",null,"(up, pathSelector, level)"),n("td",null,"递归查询父子关系表"),n("td")],-1))])])])}const f=i(c,[["render",v],["__file","select.html.vue"]]);export{f as default};