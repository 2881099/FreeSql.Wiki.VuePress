import{_ as r}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,c as o,a as e,b as a,d as n,e as p,o as i}from"./app-Cap5HhGi.js";const c={},d={href:"https://github.com/2881099/FreeSql/blob/master/Providers/FreeSql.Provider.Odbc/Default/OdbcAdapter.cs",target:"_blank",rel:"noopener noreferrer"};function u(b,s){const t=l("ExternalLinkIcon");return i(),o("div",null,[s[3]||(s[3]=e('<p>FreeSql.Provider.Odbc 实现 ODBC 访问数据库，ODBC 属于比较原始的技术，更新慢，各大数据库厂支持得标准不一，不到万不得已最好别用 odbc，坑比较多。</p><p>FreeSql.Provider.Odbc 做了多种数据库的专用实现：SqlServer、PostgreSQL、Oracle、MySql、达梦、人大金仓，和一种通用实现。</p><p>和原来的 FreeSql.Provider.SqlServer 等 ado.net 相比，只支持较少的基础类型，其他功能几乎都有，包括 CodeFirst 自动迁移。</p><p>国产数据库大多数都兼容 SqlServer、PostgreSQL、Oracle、MySql 这四种数据库，所以它们也可以用来访问国产数据库。</p><h1 id="自定义适配" tabindex="-1"><a class="header-anchor" href="#自定义适配" aria-hidden="true">#</a> 自定义适配</h1><p>通用实现为了让用户自己适配更多的数据库，比如连接 mssql 2000、db2 等数据库，牺牲了一些功能：</p><ul><li>不支持 CodeFirst 自动迁移</li><li>不支持 DbFirst 接口方法的实现</li><li>不支持 原来的分页方法，需要自行判断 id 进行分页</li><li>只支持较少的基础类型：bool,sbyte,short,int,long,byte,ushort,uint,ulong,double,float,decimal,DateTime,byte[],string,Guid</li></ul><p>使用者只需求重写类 FreeSql.Odbc.Default.OdbcAdapter 就可以自定义访问不同的数据库。</p>',8)),a("p",null,[s[1]||(s[1]=n("我们默认做了一套 sqlserver 的语法和映射适配，代码在 ")),a("a",d,[s[0]||(s[0]=n("Default/OdbcAdapter.cs")),p(t)]),s[2]||(s[2]=n("，请查看代码了解。"))]),s[4]||(s[4]=e(`<div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">class</span> <span class="token class-name">Mssql2000Adapter</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">FreeSql<span class="token punctuation">.</span>Odbc<span class="token punctuation">.</span>Default<span class="token punctuation">.</span>OdbcAdapter</span></span>
<span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">override</span> <span class="token return-type class-name"><span class="token keyword">string</span></span> InsertAfterGetIdentitySql <span class="token operator">=&gt;</span> <span class="token string">&quot;SELECT SCOPE_IDENTITY()&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">//可以重写更多的设置</span>
<span class="token punctuation">}</span>

fsql<span class="token punctuation">.</span><span class="token function">SetOdbcAdapter</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token constructor-invocation class-name">Mssql2000Adapter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>适配好新的 OdbcAdapter 后，请在 FreeSqlBuilder.Build 之后调用 IFreeSql.SetOdbcAdapter 方法生效。</p>`,2))])}const m=r(c,[["render",u],["__file","freesql-provider-odbc.html.vue"]]);export{m as default};
