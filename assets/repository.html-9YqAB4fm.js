import{_ as r}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as i,o as d,c as k,b as n,d as a,e,w as t,a as c}from"./app-CbJXcJcp.js";const m={};function v(y,s){const u=i("CodeTabs"),p=i("RouterLink");return d(),k("div",null,[s[32]||(s[32]=n("p",null,[n("code",null,"FreeSql.DbContext"),a(" references the abp vnext interface specification and implements a generic repository layer functionality (CURD), which can be understood as an enhanced version of traditional Data Access Layer (DAL).")],-1)),e(u,{id:"3",data:[{id:".NET CLI"},{id:".NET Framework"}],active:0},{title0:t(({value:o,isActive:l})=>s[0]||(s[0]=[a(".NET CLI")])),title1:t(({value:o,isActive:l})=>s[1]||(s[1]=[a(".NET Framework")])),tab0:t(({value:o,isActive:l})=>s[2]||(s[2]=[n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[a(" dotnet "),n("span",{class:"token function"},"add"),a(` package FreeSql.DbContext
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1)])),tab1:t(({value:o,isActive:l})=>s[3]||(s[3]=[n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,`Install-Package FreeSql.DbContext
`)]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1)])),_:1}),s[33]||(s[33]=c(`<ul><li>Select/Attach snapshot objects, Update only changes modified fields;</li><li>Insert data, optimized execution with ExecuteAffrows/ExecuteIdentity/ExecuteInserted across various databases;</li><li>Cascade save and cascade delete (one-to-one, one-to-many, many-to-many);</li><li>Repository + Unit of Work design pattern, simple and unified style;</li></ul><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Song</span>
<span class="token punctuation">{</span>
    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>IsIdentity <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
    <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">int</span></span> Id <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">string</span></span> Title <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>Note: Repository objects are not thread-safe, so they should not be used concurrently across multiple threads.</p></blockquote><h2 id="temporary-usage" tabindex="-1"><a class="header-anchor" href="#temporary-usage" aria-hidden="true">#</a> Temporary Usage</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> curd <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetRepository</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>Suitable for creating repositories temporarily in local code and disposing of them when done.</p></blockquote><h2 id="generic-repository-dependency-injection" tabindex="-1"><a class="header-anchor" href="#generic-repository-dependency-injection" aria-hidden="true">#</a> Generic Repository (Dependency Injection)</h2><p>Method 2: Generic Repository + Dependency Injection (.NET Core);</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token comment">// First, refer to the entry documentation to inject IFreeSql</span>
services<span class="token punctuation">.</span><span class="token function">AddFreeRepository</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Use generic repository in the controller</span>
<span class="token keyword">public</span> <span class="token function">SongsController</span><span class="token punctuation">(</span><span class="token class-name">IBaseRepository<span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span> songRepository<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="inherited-repository-dependency-injection" tabindex="-1"><a class="header-anchor" href="#inherited-repository-dependency-injection" aria-hidden="true">#</a> Inherited Repository (Dependency Injection)</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token comment">// First, refer to the entry documentation to inject IFreeSql</span>
services<span class="token punctuation">.</span><span class="token function">AddFreeRepository</span><span class="token punctuation">(</span><span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">SongRepository</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Assembly<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// No need to pass the second parameter if no inherited repositories</span>

<span class="token comment">// Use inherited repositories</span>
<span class="token keyword">public</span> <span class="token function">SongsController</span><span class="token punctuation">(</span><span class="token class-name">SongRepository</span> repo1<span class="token punctuation">,</span> <span class="token class-name">TopicRepository</span> repo2<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SongRepository</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">BaseRepository<span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span></span>
<span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token function">SongRepository</span><span class="token punctuation">(</span><span class="token class-name">IFreeSql</span> fsql<span class="token punctuation">)</span> <span class="token punctuation">:</span> <span class="token keyword">base</span><span class="token punctuation">(</span>fsql<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

    <span class="token comment">// Add additional methods beyond CURD here</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="update-comparison" tabindex="-1"><a class="header-anchor" href="#update-comparison" aria-hidden="true">#</a> Update Comparison</h2><p>Only update changed properties:</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> repo <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetRepository</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Topic<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">var</span></span> item <span class="token operator">=</span> repo<span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Id <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">First</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// Snapshot item at this point</span>
item<span class="token punctuation">.</span>Title <span class="token operator">=</span> <span class="token string">&quot;newtitle&quot;</span><span class="token punctuation">;</span>
repo<span class="token punctuation">.</span><span class="token function">Update</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Compare changes from snapshot</span>
<span class="token comment">// UPDATE \`tb_topic\` SET \`Title\` = ?p_0</span>
<span class="token comment">// WHERE (\`Id\` = 1)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Does it seem cumbersome to query first and then update?</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> repo <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetRepository</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Topic<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">var</span></span> item <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Topic</span> <span class="token punctuation">{</span> Id <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
repo<span class="token punctuation">.</span><span class="token function">Attach</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Snapshot item at this point</span>
item<span class="token punctuation">.</span>Title <span class="token operator">=</span> <span class="token string">&quot;newtitle&quot;</span><span class="token punctuation">;</span>
repo<span class="token punctuation">.</span><span class="token function">Update</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Compare changes from snapshot</span>
<span class="token comment">// UPDATE \`tb_topic\` SET \`Title\` = ?p_0</span>
<span class="token comment">// WHERE (\`Id\` = 1)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>repo.CompareState(item)</code> can retrieve the status change information of <code>item</code>.</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token doc-comment comment">/// <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>summary</span><span class="token punctuation">&gt;</span></span></span>
<span class="token doc-comment comment">/// Compare entities and calculate properties that have changed values, as well as the old and new values of these properties.</span>
<span class="token doc-comment comment">/// <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>summary</span><span class="token punctuation">&gt;</span></span></span>
<span class="token doc-comment comment">/// <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>newdata<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>The latest entity object, which will be compared with the attached entity&#39;s state.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param</span><span class="token punctuation">&gt;</span></span></span>
<span class="token doc-comment comment">/// <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>returns</span><span class="token punctuation">&gt;</span></span>key: property name, value: [old value, new value]<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>returns</span><span class="token punctuation">&gt;</span></span></span>
<span class="token return-type class-name">Dictionary<span class="token punctuation">&lt;</span><span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">object</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">&gt;</span></span> <span class="token function">CompareState</span><span class="token punctuation">(</span><span class="token class-name">TEntity</span> newdata<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>It should be noted that when using Repository updates, <code>ServerTime</code> should not be specified in ColumnAttribute.</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> repo <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetRepository</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Dictionaries<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">var</span></span> item <span class="token operator">=</span> <span class="token keyword">await</span> repo<span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>DictId <span class="token operator">==</span> <span class="token string">&quot;1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">FirstAsync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//If the ServerTime property exists in the Column attribute, it may result in the inability to modify it</span>
item<span class="token punctuation">.</span>UpdateTime <span class="token operator">=</span>  DateTime<span class="token punctuation">.</span>Now<span class="token punctuation">;</span>
<span class="token keyword">await</span> repo<span class="token punctuation">.</span><span class="token function">UpdateAsync</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Dictionaries</span>
<span class="token punctuation">{</span>
    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;id&quot;</span><span class="token punctuation">,</span> IsPrimary <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
    <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">string</span></span> Id <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>

    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;name&quot;</span><span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
    <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">string</span></span> Name <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>

    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Column</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Name <span class="token operator">=</span> <span class="token string">&quot;update_time&quot;</span><span class="token punctuation">,</span> ServerTime <span class="token operator">=</span> DateTimeKind<span class="token punctuation">.</span>Local<span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
    <span class="token keyword">public</span> <span class="token return-type class-name">DateTime<span class="token punctuation">?</span></span> UpdateTime <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="login-information-dependency-injection" tabindex="-1"><a class="header-anchor" href="#login-information-dependency-injection" aria-hidden="true">#</a> Login Information (Dependency Injection)</h2><p><code>repo.DbContextOptions.AuditValue</code> is suitable for integration with AddScoped (Dependency Injection) to uniformly set login information.</p><p>Example: Automatically use login information when inserting/updating with repository</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code>services<span class="token punctuation">.</span><span class="token function">AddSingleton</span><span class="token punctuation">(</span>fsql<span class="token punctuation">)</span><span class="token punctuation">;</span>
services<span class="token punctuation">.</span><span class="token function">AddScoped</span><span class="token punctuation">(</span><span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">IBaseRepository<span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">MyRepository<span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
services<span class="token punctuation">.</span><span class="token function">AddScoped</span><span class="token punctuation">(</span><span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">IBaseRepository<span class="token punctuation">&lt;</span><span class="token punctuation">,</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">typeof</span><span class="token punctuation">(</span><span class="token type-expression class-name">MyRepository<span class="token punctuation">&lt;</span><span class="token punctuation">,</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
services<span class="token punctuation">.</span><span class="token function">AddScoped</span><span class="token punctuation">(</span>r <span class="token operator">=&gt;</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">MyRepositoryOptions</span>
<span class="token punctuation">{</span>
    AuditValue <span class="token operator">=</span> e <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token class-name"><span class="token keyword">var</span></span> user <span class="token operator">=</span> r<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetService</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>User<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>user <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>AuditValueType <span class="token operator">==</span> AuditValueType<span class="token punctuation">.</span>Insert <span class="token operator">&amp;&amp;</span>
            e<span class="token punctuation">.</span>Object <span class="token keyword">is</span> <span class="token class-name">IEntityCreated</span> obj1 <span class="token operator">&amp;&amp;</span> obj1 <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            obj1<span class="token punctuation">.</span>CreatedUserId <span class="token operator">=</span> user<span class="token punctuation">.</span>Id<span class="token punctuation">;</span>
            obj1<span class="token punctuation">.</span>CreatedUserName <span class="token operator">=</span> user<span class="token punctuation">.</span>Username<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>AuditValueType <span class="token operator">==</span> AuditValueType<span class="token punctuation">.</span>Update <span class="token operator">&amp;&amp;</span>
            e<span class="token punctuation">.</span>Object <span class="token keyword">is</span> <span class="token class-name">IEntityModified</span> obj2 <span class="token operator">&amp;&amp;</span> obj2 <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            obj2<span class="token punctuation">.</span>ModifiedUserId <span class="token operator">=</span> user<span class="token punctuation">.</span>Id<span class="token punctuation">;</span>
            obj2<span class="token punctuation">.</span>ModifiedUserName <span class="token operator">=</span> user<span class="token punctuation">.</span>Username<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">MyRepository<span class="token punctuation">&lt;</span>TEntity<span class="token punctuation">,</span> TKey<span class="token punctuation">&gt;</span></span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">BaseRepository<span class="token punctuation">&lt;</span>TEntity<span class="token punctuation">,</span> TKey<span class="token punctuation">&gt;</span></span></span> <span class="token keyword">where</span> <span class="token class-name">TEntity</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token keyword">class</span></span>
<span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token function">MyRepository</span><span class="token punctuation">(</span><span class="token class-name">IFreeSql</span> fsql<span class="token punctuation">,</span> <span class="token class-name">MyRepositoryOptions</span> options<span class="token punctuation">)</span> <span class="token punctuation">:</span> <span class="token keyword">base</span><span class="token punctuation">(</span>fsql<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>options<span class="token punctuation">?.</span>AuditValue <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> DbContextOptions<span class="token punctuation">.</span>AuditValue <span class="token operator">+=</span> <span class="token punctuation">(</span>_<span class="token punctuation">,</span> e<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> options<span class="token punctuation">.</span><span class="token function">AuditValue</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">MyRepository<span class="token punctuation">&lt;</span>TEntity<span class="token punctuation">&gt;</span></span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">MyRepository<span class="token punctuation">&lt;</span>TEntity<span class="token punctuation">,</span> <span class="token keyword">long</span><span class="token punctuation">&gt;</span></span></span> <span class="token keyword">where</span> <span class="token class-name">TEntity</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token keyword">class</span></span>
<span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token function">MyRepository</span><span class="token punctuation">(</span><span class="token class-name">IFreeSql</span> fsql<span class="token punctuation">,</span> <span class="token class-name">MyRepositoryOptions</span> options<span class="token punctuation">)</span> <span class="token punctuation">:</span> <span class="token keyword">base</span><span class="token punctuation">(</span>fsql<span class="token punctuation">,</span> options<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">MyRepositoryOptions</span>
<span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token return-type class-name">Action<span class="token punctuation">&lt;</span>DbContextAuditValueEventArgs<span class="token punctuation">&gt;</span></span> AuditValue <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="compatibility-issues" tabindex="-1"><a class="header-anchor" href="#compatibility-issues" aria-hidden="true">#</a> Compatibility Issues</h2><p>The <code>output inserted</code> feature provided by SqlServer allows quick retrieval of inserted data when tables use auto-increment or default values defined in the database. PostgreSQL also has similar functionality, which is convenient but not supported by every database.</p><p>When using databases that do not support this feature (Sqlite/MySql/Oracle/Dameng/Nandasoft/MsAccess), and entities use auto-increment properties, batch inserts in the repository will be executed one by one. Consider the following improvements:</p><ul><li>Use UUID as the primary key (i.e., Guid);</li><li>Avoid using default value functionality in the database;</li></ul><h2 id="cascade-save" tabindex="-1"><a class="header-anchor" href="#cascade-save" aria-hidden="true">#</a> Cascade Save</h2>`,29)),n("p",null,[s[5]||(s[5]=a("Please refer to the document ")),e(p,{to:"/en/guide/cascade-saving.html"},{default:t(()=>s[4]||(s[4]=[a("《Cascade Save》")])),_:1})]),s[34]||(s[34]=c('<h2 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h2><table><thead><tr><th>Property</th><th>Return Value</th><th>Description</th></tr></thead><tbody><tr><td>EntityType</td><td>Type</td><td>The entity type the repository is currently operating on, note that it may not be TEntity</td></tr><tr><td>UnitOfWork</td><td>IUnitOfWork</td><td>The unit of work currently in use</td></tr><tr><td>Orm</td><td>IFreeSql</td><td>The ORM currently in use</td></tr><tr><td>DbContextOptions</td><td>DbContextOptions</td><td>The DbContext settings currently in use, changes to these settings do not affect others</td></tr><tr><td>UpdateDiy</td><td>IUpdate&lt;TEntity&gt;</td><td>Preparing to update data, in the same transaction as the repository</td></tr><tr><td>Select</td><td>ISelect&lt;TEntity&gt;</td><td>Preparing to query data</td></tr></tbody></table>',2)),n("table",null,[s[31]||(s[31]=n("thead",null,[n("tr",null,[n("th",null,"Method"),n("th",null,"Return Value"),n("th",null,"Parameters"),n("th",null,"Description")])],-1)),n("tbody",null,[s[14]||(s[14]=n("tr",null,[n("td",null,"AsType"),n("td",null,"void"),n("td",null,"Type"),n("td",null,"Change the entity type the repository is currently operating on")],-1)),s[15]||(s[15]=n("tr",null,[n("td",null,"Get"),n("td",null,"TEntity"),n("td",null,"TKey"),n("td",null,"Query data by primary key")],-1)),s[16]||(s[16]=n("tr",null,[n("td",null,"Find"),n("td",null,"TEntity"),n("td",null,"TKey"),n("td",null,"Query data by primary key")],-1)),s[17]||(s[17]=n("tr",null,[n("td",null,"Delete"),n("td",null,"int"),n("td",null,"TKey"),n("td",null,"Delete data by primary key")],-1)),s[18]||(s[18]=n("tr",null,[n("td",null,"Delete"),n("td",null,"int"),n("td",null,"Lambda"),n("td",null,"Delete data based on lambda conditions")],-1)),s[19]||(s[19]=n("tr",null,[n("td",null,"Delete"),n("td",null,"int"),n("td",null,"TEntity"),n("td",null,"Delete data")],-1)),s[20]||(s[20]=n("tr",null,[n("td",null,"Delete"),n("td",null,"int"),n("td",null,"IEnumerable<TEntity>"),n("td",null,"Batch delete data")],-1)),n("tr",null,[n("td",null,[e(p,{to:"/en/guide/cascade-delete.html"},{default:t(()=>s[6]||(s[6]=[a("DeleteCascadeByDatabase")])),_:1})]),s[7]||(s[7]=n("td",null,"List<object>",-1)),s[8]||(s[8]=n("td",null,"Lambda",-1)),s[9]||(s[9]=n("td",null,"Recursively delete data by navigation properties",-1))]),s[21]||(s[21]=n("tr",null,[n("td",null,"Insert"),n("td",null,"-"),n("td",null,"TEntity"),n("td",null,"Insert data, if the entity has auto-increment columns, the auto-increment value will be filled into the entity after insertion")],-1)),s[22]||(s[22]=n("tr",null,[n("td",null,"Insert"),n("td",null,"-"),n("td",null,"IEnumerable<TEntity>"),n("td",null,"Batch insert data")],-1)),s[23]||(s[23]=n("tr",null,[n("td",null,"Update"),n("td",null,"-"),n("td",null,"TEntity"),n("td",null,"Update data")],-1)),s[24]||(s[24]=n("tr",null,[n("td",null,"Update"),n("td",null,"-"),n("td",null,"IEnumerable<TEntity>"),n("td",null,"Batch update data")],-1)),s[25]||(s[25]=n("tr",null,[n("td",null,"InsertOrUpdate"),n("td",null,"-"),n("td",null,"TEntity"),n("td",null,"Insert or update data")],-1)),s[26]||(s[26]=n("tr",null,[n("td",null,"FlushState"),n("td",null,"-"),n("td",null,"None"),n("td",null,"Clear state management data")],-1)),s[27]||(s[27]=n("tr",null,[n("td",null,"Attach"),n("td",null,"-"),n("td",null,"TEntity"),n("td",null,"Attach entity to state management, used for updating or deleting without querying")],-1)),s[28]||(s[28]=n("tr",null,[n("td",null,"Attach"),n("td",null,"-"),n("td",null,"IEnumerable<TEntity>"),n("td",null,"Batch attach entities to state management")],-1)),s[29]||(s[29]=n("tr",null,[n("td",null,"AttachOnlyPrimary"),n("td",null,"-"),n("td",null,"TEntity"),n("td",null,"Attach only primary key data of entity to state management")],-1)),n("tr",null,[n("td",null,[e(p,{to:"/en/guide/insert-or-update.html#_4-table-beginedit"},{default:t(()=>s[10]||(s[10]=[a("BeginEdit")])),_:1})]),s[11]||(s[11]=n("td",null,"-",-1)),s[12]||(s[12]=n("td",null,"List<TEntity>",-1)),s[13]||(s[13]=n("td",null,"Prepare to edit a list of entities",-1))]),s[30]||(s[30]=n("tr",null,[n("td",null,"EndEdit"),n("td",null,"int"),n("td",null,"None"),n("td",null,"Complete editing data and perform save actions")],-1))])]),s[35]||(s[35]=n("blockquote",null,[n("p",null,"State management allows Update to only update changed fields (not all fields), and using Attach and Update is very comfortable.")],-1))])}const h=r(m,[["render",v],["__file","repository.html.vue"]]);export{h as default};