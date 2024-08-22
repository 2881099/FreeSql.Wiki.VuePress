import{_ as u}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as p,o as r,c as k,d as o,w as a,a as n,b as s,e as c}from"./app-CHQkJX5P.js";const d={},m=n("h1",{id:"transaction",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#transaction","aria-hidden":"true"},"#"),s(" Transaction")],-1),v=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[s("dotnet "),n("span",{class:"token function"},"add"),s(` package FreeSql.DbContext
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),b=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,`Install-Package FreeSql.DbContext
`)]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),g=c(`<h2 id="_1-regular-transactions" tabindex="-1"><a class="header-anchor" href="#_1-regular-transactions" aria-hidden="true">#</a> 1. Regular Transactions</h2><p><code>UnitOfWork</code> is a wrapper around the <code>DbTransaction</code> object, making it convenient to carry private data.</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uow <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token function">CreateUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">await</span> uow<span class="token punctuation">.</span>Orm<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrowsAsync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// uow.Orm API is the same as IFreeSql</span>
    <span class="token keyword">await</span> uow<span class="token punctuation">.</span>Orm<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token function">ExecuteNoneQueryAsync</span><span class="token punctuation">(</span>sql<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">await</span> fsql<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token range operator">..</span><span class="token punctuation">.</span> <span class="token comment">// Error, not within the same transaction</span>

    <span class="token class-name"><span class="token keyword">var</span></span> repo <span class="token operator">=</span> uow<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetRepository</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Repository CRUD</span>
    <span class="token keyword">await</span> repo<span class="token punctuation">.</span><span class="token function">InsertAsync</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">;</span>

    uow<span class="token punctuation">.</span><span class="token function">Commit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>Tip: Within the <code>uow</code> scope, try not to use the <code>fsql</code> object to avoid not being in the same transaction.</p></blockquote><p>Use <code>UnitOfWorkManager</code> to manage <code>UnitOfWork</code>, as follows:</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uowManager <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">UnitOfWorkManager</span><span class="token punctuation">(</span>fsql<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uow <span class="token operator">=</span> uowManager<span class="token punctuation">.</span><span class="token function">Begin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uow2 <span class="token operator">=</span> uowManager<span class="token punctuation">.</span><span class="token function">Begin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// Same transaction as uow</span>
        <span class="token punctuation">{</span>
            uow2<span class="token punctuation">.</span><span class="token function">Commit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Transaction not yet committed</span>
        <span class="token punctuation">}</span>
        uow<span class="token punctuation">.</span><span class="token function">Commit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Commit the transaction</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-repository-transactions-dependency-injection" tabindex="-1"><a class="header-anchor" href="#_2-repository-transactions-dependency-injection" aria-hidden="true">#</a> 2. Repository Transactions (Dependency Injection)</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> builder <span class="token operator">=</span> WebApplication<span class="token punctuation">.</span><span class="token function">CreateBuilder</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">Func<span class="token punctuation">&lt;</span>IServiceProvider<span class="token punctuation">,</span> IFreeSql<span class="token punctuation">&gt;</span></span> fsqlFactory <span class="token operator">=</span> r <span class="token operator">=&gt;</span>
<span class="token punctuation">{</span>
    <span class="token class-name">IFreeSql</span> fsql <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">FreeSql<span class="token punctuation">.</span>FreeSqlBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">UseConnectionString</span><span class="token punctuation">(</span>FreeSql<span class="token punctuation">.</span>DataType<span class="token punctuation">.</span>Sqlite<span class="token punctuation">,</span> <span class="token string">@&quot;Data Source=freedb.db&quot;</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">UseMonitorCommand</span><span class="token punctuation">(</span>cmd <span class="token operator">=&gt;</span> Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Sql：</span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">cmd<span class="token punctuation">.</span>CommandText</span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> fsql<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
builder<span class="token punctuation">.</span>Services<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">AddSingleton</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>IFreeSql<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span>fsqlFactory<span class="token punctuation">)</span><span class="token punctuation">;</span>

builder<span class="token punctuation">.</span>Services<span class="token punctuation">.</span><span class="token function">AddFreeRepository</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
builder<span class="token punctuation">.</span>Services<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">AddScoped</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>UnitOfWorkManager<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
builder<span class="token punctuation">.</span>Services<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">AddScoped</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>SongService<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">WebApplication</span> app <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">Build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SongService</span>
<span class="token punctuation">{</span>
    <span class="token keyword">readonly</span> <span class="token class-name">IBaseRepository<span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span> _songRepository<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> <span class="token class-name">IBaseRepository<span class="token punctuation">&lt;</span>Detail<span class="token punctuation">&gt;</span></span> _detailRepository<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token function">SongService</span><span class="token punctuation">(</span><span class="token class-name">IBaseRepository<span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span> songRepository<span class="token punctuation">,</span> <span class="token class-name">IBaseRepository<span class="token punctuation">&lt;</span>Detail<span class="token punctuation">&gt;</span></span> detailRepository<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        _songRepository <span class="token operator">=</span> songRepository<span class="token punctuation">;</span>
        _detailRepository <span class="token operator">=</span> detailRepository<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Transactional</span></span><span class="token punctuation">]</span>
    <span class="token keyword">async</span> <span class="token keyword">public</span> <span class="token return-type class-name">Task</span> <span class="token function">Test1</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token comment">// All injected repository objects are within the same transaction</span>
        <span class="token keyword">await</span> _songRepository<span class="token punctuation">.</span><span class="token function">InsertAsync</span><span class="token punctuation">(</span>xxx1<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">await</span> _detailRepository<span class="token punctuation">.</span><span class="token function">DeleteAsync</span><span class="token punctuation">(</span>xxx2<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">Test2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Transactional</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Propagation <span class="token operator">=</span> Propagation<span class="token punctuation">.</span>Nested<span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
    <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">void</span></span> <span class="token function">Test2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// Nested transaction</span>
    <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),h=c(`<h2 id="_3-same-thread-transactions" tabindex="-1"><a class="header-anchor" href="#_3-same-thread-transactions" aria-hidden="true">#</a> 3. Same-Thread Transactions</h2><p>Same-thread transactions are built into FreeSql.dll, managed by <code>fsql.Transaction</code> for committing and rolling back transactions (Note: does not support asynchronous operations).</p><p>A user purchases a product worth 100 yuan: deduct balance, deduct inventory.</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code>fsql<span class="token punctuation">.</span><span class="token function">Transaction</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> 
<span class="token punctuation">{</span>
    <span class="token comment">// fsql.Ado.TransactionCurrentThread gets the current transaction object</span>

    <span class="token class-name"><span class="token keyword">var</span></span> affrows <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Update</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>User<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Wealth <span class="token operator">-</span> <span class="token number">100</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Wealth <span class="token operator">&gt;=</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// Ensure user balance does not become negative</span>

    <span class="token comment">// Throw exception to roll back the transaction and exit</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>affrows <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Exception</span><span class="token punctuation">(</span><span class="token string">&quot;User balance insufficient&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    affrows <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Update</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Goods<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Stock <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Stock <span class="token operator">&gt;=</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
    <span class="token keyword">if</span> <span class="token punctuation">(</span>affrows <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Exception</span><span class="token punctuation">(</span><span class="token string">&quot;Product stock insufficient&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Same-thread transactions are simple to use but have some limitations:</p><ul><li><p>The transaction object is bound to the thread, and only one transaction connection can be opened per thread; nested transactions use the same transaction.</p></li><li><p>Code within the transaction body cannot switch threads, so no asynchronous methods can be used, including asynchronous database methods provided by FreeSql (but any synchronous CRUD methods can be used).</p></li></ul><h2 id="_4-pessimistic-lock" tabindex="-1"><a class="header-anchor" href="#_4-pessimistic-lock" aria-hidden="true">#</a> 4. Pessimistic Lock</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> user <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>User<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ForUpdate</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Id <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToOne</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// SELECT ... FROM User a for update nowait</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code>for update</code> syntax is common in Oracle/PostgreSQL/MySQL. We have provided special adaptation for SqlServer, and the executed SQL statement is roughly as follows:</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token keyword">FROM</span> <span class="token punctuation">[</span><span class="token keyword">User</span><span class="token punctuation">]</span> a <span class="token keyword">With</span><span class="token punctuation">(</span>UpdLock<span class="token punctuation">,</span> RowLock<span class="token punctuation">,</span> NoWait<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,10);function f(y,w){const i=p("CodeTabs"),l=p("RouterLink");return r(),k("div",null,[m,o(i,{id:"3",data:[{id:".NET CLI"},{id:"Package Manager"}],active:0},{title0:a(({value:t,isActive:e})=>[s(".NET CLI")]),title1:a(({value:t,isActive:e})=>[s("Package Manager")]),tab0:a(({value:t,isActive:e})=>[v]),tab1:a(({value:t,isActive:e})=>[b]),_:1}),g,n("p",null,[s("For more details, refer to the document: - "),o(l,{to:"/en/guide/unitofwork-manager.html"},{default:a(()=>[s("AOP Feature Tag Implementation for Cross-Method Transactions")]),_:1})]),h])}const _=u(d,[["render",f],["__file","transaction.html.vue"]]);export{_ as default};