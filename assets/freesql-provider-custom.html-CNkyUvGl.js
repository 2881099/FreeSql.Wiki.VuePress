import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as t}from"./app-B3jd7LhO.js";const l={};function n(h,s){return t(),a("div",null,s[0]||(s[0]=[e(`<h1 id="国产数据库" tabindex="-1"><a class="header-anchor" href="#国产数据库"><span>国产数据库</span></a></h1><table><thead><tr><th>数据库名称</th><th>提供者</th><th>系列风格</th></tr></thead><tbody><tr><td>达梦</td><td>FreeSql.Provider.Dameng</td><td>Oracle</td></tr><tr><td>神州通用</td><td>FreeSql.Provider.ShenTong</td><td>PostgreSQL</td></tr><tr><td>人大金仓</td><td>FreeSql.Provider.KingbaseES</td><td>PostgreSQL</td></tr><tr><td>南大通用</td><td>FreeSql.Provider.GBase</td><td>Informix</td></tr><tr><td>虚谷</td><td>FreeSql.Provider.Xugu</td><td>Oracle</td></tr><tr><td>翰高</td><td>FreeSql.Provider.Custom、FreeSql.Provider.Odbc</td><td>PostgreSQL</td></tr><tr><td>华为(OpenGuass)</td><td>FreeSql.Provider.PostgreSQL</td><td>PostgreSQL</td></tr></tbody></table><p>由于太多，在此不一一列举，它们大多数语法兼容 MySql、Oracle、SqlServer、PostgreSQL 四种常用数据库之一。</p><p>FreeSql.Provider.Custom 提供了这四种数据库适配，并且支持 CodeFirst/DbFirst 以及完整的 FreeSql 功能。</p><p>FreeSql.Provider.Custom 不依赖具体 ado.net/odbc/oledb dll 驱动，使用者在外部自行引用 dll 驱动。</p><p>访问 MySql 数据库为例：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">var</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeSqlBuilder</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseConnectionFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DataType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">CustomMySql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, () =&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">MySqlConnection</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Data Source=...&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">))</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseNoneCommandParameter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseMonitorCommand</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">cmd</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">WriteLine</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">cmd</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">CommandText</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">))</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Build</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">SetDbProviderFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">MySqlConnectorFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Instance</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>若某国产数据库兼容 MySql SQL，先引用对方提供的 DLL，然后：</p><ul><li>将上面 new MySqlConnection 替换成 new XxxConnection</li><li>将上面 MySqlConnectorFactory.Instance 替换成对应的 DbProviderFactory</li></ul><p>提示：对方 DLL 一般都会提供这两个现实类</p><hr><p>华为报错：Received AuthenticationSASL message with 0 mechanisms!</p><p>1、连接串</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Host</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">127.0.0.1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Port</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">15432</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Username</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">qadmin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Password</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">******</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Database</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">db</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">No</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Reset</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> On</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Close=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Pooling</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Minimum</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Pool</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Size=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>2、pg_hba.conf</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">host</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    all</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">             all</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">             0.0.0.0/0</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">               sha256</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">host</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    all</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">             all</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">             127.0.0.1/32</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">            trust</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>3、postgresql.conf</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">password_encryption_type</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h1 id="自定义适配" tabindex="-1"><a class="header-anchor" href="#自定义适配"><span>自定义适配</span></a></h1><p>除了上面，还提供了自定义适配更多的数据库，比如 mssql2000、db2，自定义适配将牺牲一些功能：</p><ul><li>不支持 CodeFirst 自动迁移</li><li>不支持 DbFirst 接口方法的实现</li><li>不支持 原来的分页方法，需要自行判断 id 进行分页</li><li>只支持较少的基础类型：bool,sbyte,short,int,long,byte,ushort,uint,ulong,double,float,decimal,DateTime,byte[],string,Guid</li></ul><p>使用者只需求重写类 FreeSql.Custom.CustomAdapter 就可以自定义访问不同的数据库。</p><p>我们默认做了一套 sqlserver 的语法和映射适配，代码在 <a href="https://github.com/2881099/FreeSql/blob/master/Providers/FreeSql.Provider.Custom/CustomAdapter.cs" target="_blank" rel="noopener noreferrer">CustomAdapter.cs</a>，请查看代码了解。</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Mssql2000Adapter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> : </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Custom</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">CustomAdapter</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> override</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> string</span><span style="--shiki-light:#4078F2;--shiki-dark:#ABB2BF;"> InsertAfterGetIdentitySql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;SELECT SCOPE_IDENTITY()&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    //可以重写更多的设置</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">static</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> IFreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeSqlBuilder</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseConnectionString</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DataType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Custom</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, () =&gt; new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">SqlConnection</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">@&quot;Data Source=...&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">))</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Build</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//be sure to define as singleton mode</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">SetCustomAdapter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Mssql2000Adapter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>适配好新的 CustomAdapter 后，请在 FreeSqlBuilder.Build 之后调用 IFreeSql.SetCustomAdapter 方法生效。</p>`,25)]))}const p=i(l,[["render",n],["__file","freesql-provider-custom.html.vue"]]),d=JSON.parse('{"path":"/guide/freesql-provider-custom.html","title":"国产数据库","lang":"zh-CN","frontmatter":{"description":"国产数据库 由于太多，在此不一一列举，它们大多数语法兼容 MySql、Oracle、SqlServer、PostgreSQL 四种常用数据库之一。 FreeSql.Provider.Custom 提供了这四种数据库适配，并且支持 CodeFirst/DbFirst 以及完整的 FreeSql 功能。 FreeSql.Provider.Custom 不依...","head":[["meta",{"property":"og:url","content":"https://freesql.net/guide/freesql-provider-custom.html"}],["meta",{"property":"og:site_name","content":"FreeSql"}],["meta",{"property":"og:title","content":"国产数据库"}],["meta",{"property":"og:description","content":"国产数据库 由于太多，在此不一一列举，它们大多数语法兼容 MySql、Oracle、SqlServer、PostgreSQL 四种常用数据库之一。 FreeSql.Provider.Custom 提供了这四种数据库适配，并且支持 CodeFirst/DbFirst 以及完整的 FreeSql 功能。 FreeSql.Provider.Custom 不依..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-01-16T10:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-01-16T10:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"国产数据库\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-01-16T10:00:00.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql RSS Feed"}]]},"headers":[],"git":{"createdTime":1657357932000,"updatedTime":1737021600000,"contributors":[{"name":"igeekfan","username":"igeekfan","email":"luoyunchong@foxmail.com","commits":1,"url":"https://github.com/igeekfan"},{"name":"2881099","username":"2881099","email":"2881099@users.noreply.github.com","commits":17,"url":"https://github.com/2881099"},{"name":"Mister-Hope","username":"Mister-Hope","email":"mister-hope@outlook.com","commits":1,"url":"https://github.com/Mister-Hope"}]},"readingTime":{"minutes":1.66,"words":499},"filePathRelative":"guide/freesql-provider-custom.md","localizedDate":"2022年7月9日","autoDesc":true}');export{p as comp,d as data};
