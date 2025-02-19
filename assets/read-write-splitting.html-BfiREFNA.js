import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as t,o as e}from"./app-B3jd7LhO.js";const n={};function l(h,i){return e(),a("div",null,i[0]||(i[0]=[t(`<h1 id="读写分离" tabindex="-1"><a class="header-anchor" href="#读写分离"><span>读写分离</span></a></h1><p>FreeSql 支持数据库读写分离，本功能是客户端的读写分离行为，数据库服务器该怎么配置仍然那样配置，不受本功能影响，为了方便描述后面讲到的【读写分离】都是指客户端的功能支持。</p><p>各种数据库的读写方案不一，数据库端开启读写分离功能后，读写分离的实现大致分为以下几种：</p><p>1、nginx 代理，配置繁琐且容易出错；</p><p>2、中间件，如 MyCat；</p><p>3、在 client 端支持；</p><p>FreeSql 实现了第 3 种方案，支持一个【主库】多个【从库】，【从库】的查询策略为随机方式。</p><p>若某【从库】发生故障，将切换到其他可用【从库】，若已全部不可用则使用【主库】查询。</p><p>出现故障【从库】被隔离起来间隔性的检查可用状态，以待恢复。</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">var</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> connstr</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;Data Source=127.0.0.1;Port=3306;User ID=root;Password=root;&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;Initial Catalog=cccddd;Charset=utf8;SslMode=none;Max pool size=10&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">static</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> IFreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeSqlBuilder</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseConnectionString</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">FreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DataType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">MySql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">connstr</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseSlave</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;connectionString1&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;connectionString2&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//使用从数据库，支持多个</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Build</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//请务必定义成 Singleton 单例模式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">T</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Where</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Id</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> ==</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ToOne</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//读【从库】（默认）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">T</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Master</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">WhereId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Id</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> ==</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ToOne</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//强制读【主库】</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Ado</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Query</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">T</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/*master*/ select * from t where ...&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//强制读【主库】</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10)]))}const r=s(n,[["render",l],["__file","read-write-splitting.html.vue"]]),d=JSON.parse('{"path":"/guide/read-write-splitting.html","title":"读写分离","lang":"zh-CN","frontmatter":{"description":"读写分离 FreeSql 支持数据库读写分离，本功能是客户端的读写分离行为，数据库服务器该怎么配置仍然那样配置，不受本功能影响，为了方便描述后面讲到的【读写分离】都是指客户端的功能支持。 各种数据库的读写方案不一，数据库端开启读写分离功能后，读写分离的实现大致分为以下几种： 1、nginx 代理，配置繁琐且容易出错； 2、中间件，如 MyCat； 3、...","head":[["link",{"rel":"alternate","hreflang":"en-us","href":"https://freesql.net/en/guide/read-write-splitting.html"}],["meta",{"property":"og:url","content":"https://freesql.net/guide/read-write-splitting.html"}],["meta",{"property":"og:site_name","content":"FreeSql"}],["meta",{"property":"og:title","content":"读写分离"}],["meta",{"property":"og:description","content":"读写分离 FreeSql 支持数据库读写分离，本功能是客户端的读写分离行为，数据库服务器该怎么配置仍然那样配置，不受本功能影响，为了方便描述后面讲到的【读写分离】都是指客户端的功能支持。 各种数据库的读写方案不一，数据库端开启读写分离功能后，读写分离的实现大致分为以下几种： 1、nginx 代理，配置繁琐且容易出错； 2、中间件，如 MyCat； 3、..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-04-29T07:55:22.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-29T07:55:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"读写分离\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-29T07:55:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql RSS Feed"}]]},"headers":[],"git":{"createdTime":1602827823000,"updatedTime":1714377322000,"contributors":[{"name":"taadis","username":"taadis","email":"i@taadis.com","commits":1,"url":"https://github.com/taadis"},{"name":"luoyunchong","username":"luoyunchong","email":"luoyunchong@foxmail.com","commits":1,"url":"https://github.com/luoyunchong"},{"name":"igeekfan","username":"igeekfan","email":"luoyunchong@foxmail.com","commits":1,"url":"https://github.com/igeekfan"},{"name":"2881099","username":"2881099","email":"2881099@users.noreply.github.com","commits":1,"url":"https://github.com/2881099"},{"name":"fc200","username":"fc200","email":"75766479+fc200@users.noreply.github.com","commits":1,"url":"https://github.com/fc200"},{"name":"Hugh Gao","username":"Hugh Gao","email":"luoxufeiyan@gmail.com","commits":1,"url":"https://github.com/Hugh Gao"}]},"readingTime":{"minutes":1.11,"words":333},"filePathRelative":"guide/read-write-splitting.md","localizedDate":"2020年10月16日","autoDesc":true}');export{r as comp,d as data};
