import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,o as c,c as l,a,b as t,d as s,e as i}from"./app-CbJXcJcp.js";const u={},k={href:"https://github.com/2881099/FreeSql/blob/master/Providers/FreeSql.Provider.Custom/CustomAdapter.cs",target:"_blank",rel:"noopener noreferrer"};function r(d,n){const p=o("ExternalLinkIcon");return c(),l("div",null,[n[3]||(n[3]=a(`<p>FreeSql 最多支持 SqlServer2000，根据不同的需求选择驱动包，微软提供了两个 SqlClient 访问包，因此我们也发布了两个，分别是：</p><ul><li>FreeSql.Provider.SqlServer</li><li>FreeSql.Provider.SqlServerForSystem （强制使用 System.Data.SqlClient.dll，对 .NET Framework 更友好）</li></ul><h2 id="withlock-withindex" tabindex="-1"><a class="header-anchor" href="#withlock-withindex" aria-hidden="true">#</a> WithLock/WithIndex</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> list <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Region<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="增删改-sqlbulkcopy" tabindex="-1"><a class="header-anchor" href="#增删改-sqlbulkcopy" aria-hidden="true">#</a> 增删改 SqlBulkCopy</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code>fsql<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span>items<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">ExecuteSqlBulkCopy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

fsql<span class="token punctuation">.</span>Update<span class="token operator">&lt;</span>T<span class="token operator">&gt;</span><span class="token punctuation">.</span><span class="token function">SetSource</span><span class="token punctuation">(</span>items<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">ExecuteSqlBulkCopy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//临时表 + MERGE INTO</span>

fsql<span class="token punctuation">.</span>InsertOrUpdate<span class="token operator">&lt;</span>T<span class="token operator">&gt;</span><span class="token punctuation">.</span><span class="token function">SetSource</span><span class="token punctuation">(</span>items<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">ExecuteSqlBulkCopy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//临时表 + MERGE INTO</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="访问-sqlserver2000" tabindex="-1"><a class="header-anchor" href="#访问-sqlserver2000" aria-hidden="true">#</a> 访问 SqlServer2000</h2><p>使用自定义适配更多的数据库，比如 mssql2000、db2，自定义适配将牺牲一些功能：</p><ul><li>不支持 CodeFirst 自动迁移</li><li>不支持 DbFirst 接口方法的实现</li><li>不支持 原来的分页方法，需要自行判断 id 进行分页</li><li>只支持较少的基础类型：bool,sbyte,short,int,long,byte,ushort,uint,ulong,double,float,decimal,DateTime,byte[],string,Guid</li></ul><p>使用者只需求重写类 FreeSql.Custom.CustomAdapter 就可以自定义访问不同的数据库。</p>`,14)),t("p",null,[n[1]||(n[1]=s("默认做了一套 sqlserver 的语法和映射适配，代码在 ")),t("a",k,[n[0]||(n[0]=s("CustomAdapter.cs")),i(p)]),n[2]||(n[2]=s("，请查看代码了解。"))]),n[4]||(n[4]=a(`<div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">class</span> <span class="token class-name">Mssql2000Adapter</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">FreeSql<span class="token punctuation">.</span>Custom<span class="token punctuation">.</span>CustomAdapter</span></span>
<span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">override</span> <span class="token return-type class-name"><span class="token keyword">string</span></span> InsertAfterGetIdentitySql <span class="token operator">=&gt;</span> <span class="token string">&quot;SELECT SCOPE_IDENTITY()&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">//可以重写更多的设置</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DB</span>
<span class="token punctuation">{</span>
   <span class="token keyword">static</span> <span class="token class-name">Lazy<span class="token punctuation">&lt;</span>IFreeSql<span class="token punctuation">&gt;</span></span> sqliteLazy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Lazy<span class="token punctuation">&lt;</span>IFreeSql<span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> 
   <span class="token punctuation">{</span>
        <span class="token class-name"><span class="token keyword">var</span></span> fsql <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">FreeSql<span class="token punctuation">.</span>FreeSqlBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token punctuation">.</span><span class="token function">UseConnectionString</span><span class="token punctuation">(</span>DataType<span class="token punctuation">.</span>Custom<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">OdbcConnection</span><span class="token punctuation">(</span><span class="token range operator">..</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token punctuation">.</span><span class="token function">UseMonitorCommand</span><span class="token punctuation">(</span>cmd <span class="token operator">=&gt;</span> Trace<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Sql：</span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">cmd<span class="token punctuation">.</span>CommandText</span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token punctuation">.</span><span class="token function">Build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        fsql<span class="token punctuation">.</span><span class="token function">SetCustomAdapter</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token constructor-invocation class-name">Mssql2000Adapter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> fsql<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token return-type class-name">IFreeSql</span> Sqlite <span class="token operator">=&gt;</span> sqliteLazy<span class="token punctuation">.</span>Value<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>适配好新的 CustomAdapter 后，请在 FreeSqlBuilder.Build 之后调用 IFreeSql.SetCustomAdapter 方法生效。</p><p>使用 ODBC 访问古董数据库。</p>`,3))])}const b=e(u,[["render",r],["__file","freesql-provider-sqlserver.html.vue"]]);export{b as default};