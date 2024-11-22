import{_ as k}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,o as r,c as d,b as s,d as a,e as c,w as t,a as l}from"./app-BuKgeyoU.js";const v={};function m(b,n){const i=o("CodeTabs"),u=o("RouterLink");return r(),d("div",null,[n[6]||(n[6]=s("h1",{id:"事务transaction",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#事务transaction","aria-hidden":"true"},"#"),a(" 事务Transaction")],-1)),c(i,{id:"3",data:[{id:".NET CLI"},{id:"Package Manager"}],active:0},{title0:t(({value:p,isActive:e})=>n[0]||(n[0]=[a(".NET CLI")])),title1:t(({value:p,isActive:e})=>n[1]||(n[1]=[a("Package Manager")])),tab0:t(({value:p,isActive:e})=>n[2]||(n[2]=[s("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[s("pre",{class:"language-bash"},[s("code",null,[a("dotnet "),s("span",{class:"token function"},"add"),a(` package FreeSql.DbContext
`)])]),s("div",{class:"line-numbers","aria-hidden":"true"},[s("div",{class:"line-number"})])],-1)])),tab1:t(({value:p,isActive:e})=>n[3]||(n[3]=[s("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[s("pre",{class:"language-bash"},[s("code",null,`Install-Package FreeSql.DbContext
`)]),s("div",{class:"line-numbers","aria-hidden":"true"},[s("div",{class:"line-number"})])],-1)])),_:1}),n[7]||(n[7]=l(`<h2 id="_1、常规事务" tabindex="-1"><a class="header-anchor" href="#_1、常规事务" aria-hidden="true">#</a> 1、常规事务</h2><p>UnitOfWork 是对 DbTransaction 事务对象的封装，方便夹带私有数据。</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uow <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token function">CreateUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">await</span> uow<span class="token punctuation">.</span>Orm<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrowsAsync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//uow.Orm API 和 IFreeSql 一样</span>
    <span class="token keyword">await</span> uow<span class="token punctuation">.</span>Orm<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token function">ExecuteNoneQueryAsync</span><span class="token punctuation">(</span>sql<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">await</span> fsql<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token range operator">..</span><span class="token punctuation">.</span> <span class="token comment">//错误，不在一个事务</span>

    <span class="token class-name"><span class="token keyword">var</span></span> repo <span class="token operator">=</span> uow<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetRepository</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//仓储 CRUD</span>
    <span class="token keyword">await</span> repo<span class="token punctuation">.</span><span class="token function">InsertAsync</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">;</span>

    uow<span class="token punctuation">.</span><span class="token function">Commit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>提示：uow 范围内，尽量别使用 fsql 对象，以免不处在一个事务</p></blockquote><p>使用 UnitOfWorkManager 管理 UnitOfWork，如下：</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uowManager <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">UnitOfWorkManager</span><span class="token punctuation">(</span>fsql<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uow <span class="token operator">=</span> uowManager<span class="token punctuation">.</span><span class="token function">Begin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uow2 <span class="token operator">=</span> uowManager<span class="token punctuation">.</span><span class="token function">Begin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">//与 uow 同一个事务</span>
        <span class="token punctuation">{</span>
            uow2<span class="token punctuation">.</span><span class="token function">Commit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//事务还未提交</span>
        <span class="token punctuation">}</span>
        uow<span class="token punctuation">.</span><span class="token function">Commit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//事务提交</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2、仓储事务-依赖注入" tabindex="-1"><a class="header-anchor" href="#_2、仓储事务-依赖注入" aria-hidden="true">#</a> 2、仓储事务（依赖注入）</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> builder <span class="token operator">=</span> WebApplication<span class="token punctuation">.</span><span class="token function">CreateBuilder</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
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
    <span class="token keyword">readonly</span> <span class="token class-name">UnitOfWorkManager</span> _unitOfWorkManager<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token function">SongService</span><span class="token punctuation">(</span>
      <span class="token class-name">IBaseRepository<span class="token punctuation">&lt;</span>Song<span class="token punctuation">&gt;</span></span> songRepository<span class="token punctuation">,</span> 
      <span class="token class-name">IBaseRepository<span class="token punctuation">&lt;</span>Detail<span class="token punctuation">&gt;</span></span> detailRepository<span class="token punctuation">,</span>
      <span class="token class-name">UnitOfWorkManager</span> unitOfWorkManager
    <span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        _songRepository <span class="token operator">=</span> songRepository<span class="token punctuation">;</span>
        _detailRepository <span class="token operator">=</span> detailRepository<span class="token punctuation">;</span>
        _unitOfWorkManager <span class="token operator">=</span> unitOfWorkManager<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Transactional</span></span><span class="token punctuation">]</span>
    <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token return-type class-name">Task</span> <span class="token function">Test1</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token comment">//所有注入的仓储对象，都是一个事务</span>
        <span class="token keyword">await</span> _songRepository<span class="token punctuation">.</span><span class="token function">InsertAsync</span><span class="token punctuation">(</span>xxx1<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">await</span> _detailRepository<span class="token punctuation">.</span><span class="token function">DeleteAsync</span><span class="token punctuation">(</span>xxx2<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">Test2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token punctuation">[</span><span class="token attribute"><span class="token class-name">Transactional</span><span class="token attribute-arguments"><span class="token punctuation">(</span>Propagation <span class="token operator">=</span> Propagation<span class="token punctuation">.</span>Nested<span class="token punctuation">)</span></span></span><span class="token punctuation">]</span>
    <span class="token keyword">public</span> <span class="token return-type class-name"><span class="token keyword">void</span></span> <span class="token function">Test2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">//嵌套事务</span>
    <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token return-type class-name">Task</span> <span class="token function">Test3</span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
    <span class="token punctuation">{</span>
      <span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> uow <span class="token operator">=</span> _unitOfWorkManager<span class="token punctuation">.</span><span class="token function">Begin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token punctuation">{</span>
          <span class="token keyword">await</span> _songRepository<span class="token punctuation">.</span><span class="token function">InsertAsync</span><span class="token punctuation">(</span>xxx1<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token keyword">await</span> _detailRepository<span class="token punctuation">.</span><span class="token function">DeleteAsync</span><span class="token punctuation">(</span>xxx2<span class="token punctuation">)</span><span class="token punctuation">;</span>
          uow<span class="token punctuation">.</span><span class="token function">Commit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8)),s("p",null,[n[5]||(n[5]=a("具体请移步文档：- ")),c(u,{to:"/guide/unitofwork-manager.html"},{default:t(()=>n[4]||(n[4]=[a("AOP 特性标签实现跨方法事务")])),_:1})]),n[8]||(n[8]=l(`<h2 id="_3、同线程事务" tabindex="-1"><a class="header-anchor" href="#_3、同线程事务" aria-hidden="true">#</a> 3、同线程事务</h2><p>同线程事务内置在 FreeSql.dll，由 fsql.Transaction 管理事务提交回滚（缺点：不支持异步）。</p><p>用户购买了价值 100 元的商品：扣余额、扣库存。</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code>fsql<span class="token punctuation">.</span><span class="token function">Transaction</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> 
<span class="token punctuation">{</span>
    <span class="token comment">//fsql.Ado.TransactionCurrentThread 获得当前事务对象</span>

    <span class="token class-name"><span class="token keyword">var</span></span> affrows <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Update</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>User<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Wealth <span class="token operator">-</span> <span class="token number">100</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Wealth <span class="token operator">&gt;=</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//判断别让用户余额扣成负数</span>

    <span class="token comment">//抛出异常，回滚事务，事务退出</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>affrows <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Exception</span><span class="token punctuation">(</span><span class="token string">&quot;用户余额不足&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    affrows <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Update</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Goods<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Stock <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Stock <span class="token operator">&gt;=</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
    <span class="token keyword">if</span> <span class="token punctuation">(</span>affrows <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Exception</span><span class="token punctuation">(</span><span class="token string">&quot;商品库存不足&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同线程事务使用简单，需要注意的限制：</p><ul><li><p>事务对象在线程挂载，每个线程只可开启一个事务连接，嵌套使用的是同一个事务；</p></li><li><p>事务体内代码不可以切换线程，因此不可使用任何异步方法，包括 FreeSql 提供的数据库异步方法（可以使用任何 Curd 同步方法）；</p></li></ul><h2 id="_4、悲观锁" tabindex="-1"><a class="header-anchor" href="#_4、悲观锁" aria-hidden="true">#</a> 4、悲观锁</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> user <span class="token operator">=</span> fsql<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>User<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ForUpdate</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span>a <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>Id <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToOne</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//SELECT ... FROM User a for update nowait</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>for update 在 Oracle/PostgreSQL/MySql 是通用的写法，我们对 SqlServer 做了特别适配，执行的 SQL 语句大致如下：</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token keyword">FROM</span> <span class="token punctuation">[</span><span class="token keyword">User</span><span class="token punctuation">]</span> a <span class="token keyword">With</span><span class="token punctuation">(</span>UpdLock<span class="token punctuation">,</span> RowLock<span class="token punctuation">,</span> NoWait<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,10))])}const w=k(v,[["render",m],["__file","transaction.html.vue"]]);export{w as default};