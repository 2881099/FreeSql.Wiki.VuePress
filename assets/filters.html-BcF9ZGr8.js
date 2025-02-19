import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,a as l,b as n,d as s,e as h,f as k,r as p,o as r}from"./app-B3jd7LhO.js";const d={};function A(B,i){const a=p("RouteLink");return r(),e("div",null,[i[2]||(i[2]=l(`<h1 id="过滤器" tabindex="-1"><a class="header-anchor" href="#过滤器"><span>过滤器</span></a></h1><p>IFreeSql 基础层实现了 Select/Update/Delete 可设置的全局过滤器功能，这些设置将追加到执行的 SQL WHERE 语句中。</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> AsyncLocal</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> TenantId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> { </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; } </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">AsyncLocal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">GlobalFilter</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Apply</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">ITenant</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;test1&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">TenantId</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> ==</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> TenantId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Apply</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">AuthorTest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;test2&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> ==</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;11&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ApplyOnly</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">AuthorTest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;test3&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> ==</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;11&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    //指定类型精准设置</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ApplyIf</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">TestAddEnum</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;test4&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, () =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">TenantId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Value</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> !=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Id</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> ==</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> TenantId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    //1.9.0 ApplyIf 委托的返回值(第二个参数) true 才生效</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Apply</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">ITenant</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;test5&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">TenantId</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> ==</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> TenantId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">before</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    //v3.2.700 增加 before 将条件放在 where 最前面</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Apply 泛型参数可以设置为任何类型，当使用 Select/Update/Delete 方法时会进行过滤器匹配尝试（try catch）：</p><ul><li>匹配成功的，将附加 where 条件；</li><li>匹配失败的，标记下次不再匹配，避免性能损耗；</li></ul><p>ApplyOnly 泛型参数指定一个类型生效。</p><h2 id="如何禁用" tabindex="-1"><a class="header-anchor" href="#如何禁用"><span>如何禁用？</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">TestAddEnum</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ToList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//所有生效</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">TestAddEnum</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">DisableGlobalFilter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;test1&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ToList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//禁用 test1</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">TestAddEnum</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">DisableGlobalFilter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ToList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//禁用所有</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>fsql.Update/Delete 方法效果同上。</p><h2 id="租户字段-动态值" tabindex="-1"><a class="header-anchor" href="#租户字段-动态值"><span>租户字段（动态值）</span></a></h2>`,10)),n("p",null,[i[1]||(i[1]=s("请移步文档：")),h(a,{to:"/guide/multi-tenancy.html#%E6%96%B9%E6%A1%88%E4%B8%80-%E6%8C%89%E7%A7%9F%E6%88%B7%E5%AD%97%E6%AE%B5%E5%8C%BA%E5%88%86"},{default:k(()=>i[0]||(i[0]=[s("【多租户 - 按租户字段区分】")])),_:1})])])}const o=t(d,[["render",A],["__file","filters.html.vue"]]),c=JSON.parse('{"path":"/guide/filters.html","title":"过滤器","lang":"zh-CN","frontmatter":{"description":"过滤器 IFreeSql 基础层实现了 Select/Update/Delete 可设置的全局过滤器功能，这些设置将追加到执行的 SQL WHERE 语句中。 Apply 泛型参数可以设置为任何类型，当使用 Select/Update/Delete 方法时会进行过滤器匹配尝试（try catch）： 匹配成功的，将附加 where 条件； 匹配失败的，...","head":[["link",{"rel":"alternate","hreflang":"en-us","href":"https://freesql.net/en/guide/filters.html"}],["meta",{"property":"og:url","content":"https://freesql.net/guide/filters.html"}],["meta",{"property":"og:site_name","content":"FreeSql"}],["meta",{"property":"og:title","content":"过滤器"}],["meta",{"property":"og:description","content":"过滤器 IFreeSql 基础层实现了 Select/Update/Delete 可设置的全局过滤器功能，这些设置将追加到执行的 SQL WHERE 语句中。 Apply 泛型参数可以设置为任何类型，当使用 Select/Update/Delete 方法时会进行过滤器匹配尝试（try catch）： 匹配成功的，将附加 where 条件； 匹配失败的，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-01-16T10:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-01-16T10:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"过滤器\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-01-16T10:00:00.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql RSS Feed"}]]},"headers":[{"level":2,"title":"如何禁用？","slug":"如何禁用","link":"#如何禁用","children":[]},{"level":2,"title":"租户字段（动态值）","slug":"租户字段-动态值","link":"#租户字段-动态值","children":[]}],"git":{"createdTime":1602827823000,"updatedTime":1737021600000,"contributors":[{"name":"taadis","username":"taadis","email":"i@taadis.com","commits":1,"url":"https://github.com/taadis"},{"name":"luoyunchong","username":"luoyunchong","email":"luoyunchong@foxmail.com","commits":1,"url":"https://github.com/luoyunchong"},{"name":"igeekfan","username":"igeekfan","email":"luoyunchong@foxmail.com","commits":2,"url":"https://github.com/igeekfan"},{"name":"2881099","username":"2881099","email":"2881099@users.noreply.github.com","commits":2,"url":"https://github.com/2881099"},{"name":"2881099","username":"2881099","email":"2881099@qq.com","commits":4,"url":"https://github.com/2881099"},{"name":"Mister-Hope","username":"Mister-Hope","email":"mister-hope@outlook.com","commits":1,"url":"https://github.com/Mister-Hope"}]},"readingTime":{"minutes":0.97,"words":291},"filePathRelative":"guide/filters.md","localizedDate":"2020年10月16日","autoDesc":true}');export{o as comp,c as data};
