import{_ as d}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as e,o as r,c as i,b as n,d as l,e as s,a as p,w as o}from"./app-BuKgeyoU.js";const m={},b={href:"https://duckdb.org/docs/",target:"_blank",rel:"noopener noreferrer"};function k(c,t){const u=e("ExternalLinkIcon"),a=e("RouterLink");return r(),i("div",null,[t[33]||(t[33]=n("h2",{id:"介绍",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#介绍","aria-hidden":"true"},"#"),l(" 介绍")],-1)),t[34]||(t[34]=n("p",null,"DuckDB 是一款进程内分析数据库，它可以在无需维护分布式多服务器系统的情况下处理出人意料的大型数据集。",-1)),t[35]||(t[35]=n("p",null,"DuckDB has two configurable options for concurrency:",-1)),t[36]||(t[36]=n("ul",null,[n("li",null,"One process can both read and write to the database."),n("li",null,"Multiple processes can read from the database, but no processes can write (access_mode = 'READ_ONLY').")],-1)),n("p",null,[n("a",b,[t[0]||(t[0]=l("DuckDB | 官网 ")),s(u)])]),t[37]||(t[37]=p(`<h2 id="安装包" tabindex="-1"><a class="header-anchor" href="#安装包" aria-hidden="true">#</a> 安装包</h2><p>FreeSql.Provider.Duckdb</p><p>.NET CLI</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>dotnet <span class="token function">add</span> package FreeSql.Provider.Duckdb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Package Manager</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>Install-Package FreeSql.Provider.Duckdb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="声明" tabindex="-1"><a class="header-anchor" href="#声明" aria-hidden="true">#</a> 声明</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">static</span> <span class="token class-name">IFreeSql</span> fsql <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">FreeSql<span class="token punctuation">.</span>FreeSqlBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">UseConnectionString</span><span class="token punctuation">(</span>FreeSql<span class="token punctuation">.</span>DataType<span class="token punctuation">.</span>DuckDB<span class="token punctuation">,</span> <span class="token string">&quot;DataSource = train_services.db&quot;</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">UseMonitorCommand</span><span class="token punctuation">(</span>cmd <span class="token operator">=&gt;</span> Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Sql：</span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">cmd<span class="token punctuation">.</span>CommandText</span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">UseAutoSyncStructure</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token comment">//自动创建表</span>
    <span class="token punctuation">.</span><span class="token function">Build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>依赖的第三方 ado.net 驱动源代码：https://github.com/Giorgi/DuckDB.NET</p><table><thead><tr><th>Connection String</th><th>Description</th></tr></thead><tbody><tr><td>DataSource = :memory:</td><td>Connect to a new in-memory database</td></tr><tr><td>DataSource = :memory:?cache=shared</td><td>Connect to a shared, in-memory database</td></tr><tr><td>DataSource = train_services.db</td><td>Connect to train_services.db</td></tr><tr><td>DataSource = train_services.db;ACCESS_MODE=READ_ONLY</td><td>Connect to train_services.db, make connection read-only</td></tr><tr><td>DataSource = :memory:;threads=8;ACCESS_MODE=READ_ONLY</td><td>Connect to a new in-memory database, limit threads to 8, make connection read-only</td></tr><tr><td>DataSource = train_services.db;ACCESS_MODE=READ_ONLY;memory_limit=10GB</td><td>Connect to train_services.db, make connection read-only, limit RAM usage to 10GB</td></tr></tbody></table><h2 id="类型映射" tabindex="-1"><a class="header-anchor" href="#类型映射" aria-hidden="true">#</a> 类型映射</h2>`,11)),n("table",null,[t[29]||(t[29]=n("thead",null,[n("tr",null,[n("th",null,"CSharp"),n("th",null,"DuckDB"),n("th",null,"说明")])],-1)),n("tbody",null,[t[5]||(t[5]=n("tr",null,[n("td",null,"bool/bool?"),n("td",null,"BOOLEAN"),n("td",null,"logical boolean (true/false)")],-1)),t[6]||(t[6]=n("tr",null,[n("td",null,"sbyte/sbyte?"),n("td",null,"TINYINT"),n("td",null,"signed one-byte integer")],-1)),t[7]||(t[7]=n("tr",null,[n("td",null,"short/short?"),n("td",null,"SMALLINT"),n("td",null,"signed two-byte integer")],-1)),t[8]||(t[8]=n("tr",null,[n("td",null,"int/int?"),n("td",null,"INTEGER"),n("td",null,"signed four-byte integer")],-1)),t[9]||(t[9]=n("tr",null,[n("td",null,"long/long?"),n("td",null,"BIGINT"),n("td",null,"signed eight-byte integer")],-1)),t[10]||(t[10]=n("tr",null,[n("td",null,"byte/byte?"),n("td",null,"UTINYINT"),n("td")],-1)),t[11]||(t[11]=n("tr",null,[n("td",null,"ushort/ushort?"),n("td",null,"USMALLINT"),n("td")],-1)),t[12]||(t[12]=n("tr",null,[n("td",null,"uint/uint?"),n("td",null,"UINTEGER"),n("td")],-1)),t[13]||(t[13]=n("tr",null,[n("td",null,"ulong/ulong?"),n("td",null,"UBIGINT"),n("td")],-1)),t[14]||(t[14]=n("tr",null,[n("td",null,"double/double?"),n("td",null,"DOUBLE"),n("td",null,"double precision floating-point number (8 bytes)")],-1)),t[15]||(t[15]=n("tr",null,[n("td",null,"float/float?"),n("td",null,"FLOAT"),n("td",null,"single precision floating-point number (4 bytes)")],-1)),t[16]||(t[16]=n("tr",null,[n("td",null,"decimal/decimal?"),n("td",null,"DECIMAL(10,2)"),n("td",null,"fixed-precision number with the given width (precision) and scale")],-1)),t[17]||(t[17]=n("tr",null,[n("td",null,"TimeSpan/TimeSpan?"),n("td",null,"TIME"),n("td",null,"time of day (no time zone)")],-1)),t[18]||(t[18]=n("tr",null,[n("td",null,"DateTime/DateTime?"),n("td",null,"TIMESTAMP"),n("td",null,"combination of time and date")],-1)),t[19]||(t[19]=n("tr",null,[n("td",null,"TimeOnly/TimeOnly?"),n("td",null,"TIME"),n("td")],-1)),t[20]||(t[20]=n("tr",null,[n("td",null,"DateOnly/DateOnly?"),n("td",null,"DATE"),n("td",null,"calendar date (year, month day)")],-1)),t[21]||(t[21]=n("tr",null,[n("td",null,"byte[]"),n("td",null,"BLOB"),n("td",null,"variable-length binary data")],-1)),t[22]||(t[22]=n("tr",null,[n("td",null,"string"),n("td",null,"VARCHAR(255)"),n("td",null,"variable-length character string")],-1)),t[23]||(t[23]=n("tr",null,[n("td",null,"char"),n("td",null,"CHAR(1)"),n("td")],-1)),t[24]||(t[24]=n("tr",null,[n("td",null,"Guid/Guid?"),n("td",null,"UUID"),n("td",null,"UUID data type")],-1)),t[25]||(t[25]=n("tr",null,[n("td",null,"BitArray"),n("td",null,"BIT"),n("td",null,"string of 1s and 0s")],-1)),t[26]||(t[26]=n("tr",null,[n("td",null,"BigInteger/BigInteger?"),n("td",null,"HUGEINT"),n("td",null,"signed sixteen-byte integer")],-1)),t[27]||(t[27]=n("tr",null,[n("td",null,"T[]"),n("td",null,"ARRAY/LIST"),n("td",null,"如 int[]、string[]，不能是可空 int?[]")],-1)),n("tr",null,[n("td",null,[t[2]||(t[2]=l("class + ")),s(a,{to:"/guide/type-mapping.html#json"},{default:o(()=>t[1]||(t[1]=[l("JsonMap")])),_:1})]),t[3]||(t[3]=n("td",null,"STRUCT",-1)),t[4]||(t[4]=n("td",null,"{'i': 42, 'j': 'a'}",-1))]),t[28]||(t[28]=n("tr",null,[n("td",null,"Dictionary<TKey, TValue>"),n("td",null,"MAP"),n("td",null,"map([1, 2], ['a', 'b'])")],-1))])]),n("blockquote",null,[n("p",null,[t[31]||(t[31]=l("自定义映射，请移步")),s(a,{to:"/guide/type-mapping.html"},{default:o(()=>t[30]||(t[30]=[l("【类型映射】")])),_:1}),t[32]||(t[32]=l("文档。"))])])])}const y=d(m,[["render",k],["__file","freesql-provider-duckdb.html.vue"]]);export{y as default};