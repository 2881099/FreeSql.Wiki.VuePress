import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as t,a as e}from"./app-CbJXcJcp.js";const p={};function o(c,n){return a(),t("div",null,n[0]||(n[0]=[e(`<h1 id="ado" tabindex="-1"><a class="header-anchor" href="#ado" aria-hidden="true">#</a> Ado</h1><p>Ado is one of the important objects under <code>IFreeSql</code>, encapsulating all SQL operations and providing methods such as <code>ExecuteReader</code>, <code>ExecuteDataSet</code>, <code>ExecuteDataTable</code>, <code>ExecuteNonQuery</code>, and <code>ExecuteScalar</code>. It works similarly to the traditional <code>SqlHelper</code>.</p><h2 id="query-sql" tabindex="-1"><a class="header-anchor" href="#query-sql" aria-hidden="true">#</a> Query SQL</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token comment">// Return multiple records</span>
<span class="token class-name">List<span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Query</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;select * from t1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Return a single record</span>
<span class="token class-name">T</span> item <span class="token operator">=</span> fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">QuerySingle</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;select * from t1 where id = @id&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token punctuation">{</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Return multiple result sets</span>
<span class="token class-name"><span class="token keyword">var</span></span> result <span class="token operator">=</span> fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Query</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>T1<span class="token punctuation">,</span> T2<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;select * from t1; select * from t2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">List<span class="token punctuation">&lt;</span>T1<span class="token punctuation">&gt;</span></span> list1 <span class="token operator">=</span> result<span class="token punctuation">.</span>Item1<span class="token punctuation">;</span>
<span class="token class-name">List<span class="token punctuation">&lt;</span>T2<span class="token punctuation">&gt;</span></span> list2 <span class="token operator">=</span> result<span class="token punctuation">.</span>Item2<span class="token punctuation">;</span>

<span class="token comment">// Like query</span>
<span class="token class-name"><span class="token keyword">string</span></span> searchText <span class="token operator">=</span> <span class="token string">&quot;abc&quot;</span><span class="token punctuation">;</span>
<span class="token class-name">List<span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span> users <span class="token operator">=</span> _fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Query</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;select * from t1 where name like @name&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token punctuation">{</span> name <span class="token operator">=</span> <span class="token string">&quot;%&quot;</span> <span class="token operator">+</span> searchText <span class="token operator">+</span> <span class="token string">&quot;%&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Get database time</span>
<span class="token comment">// SELECT now(), utc_timestamp()</span>
<span class="token class-name"><span class="token keyword">var</span></span> result <span class="token operator">=</span> fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token function">QuerySingle</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">new</span>
<span class="token punctuation">{</span>
    DateTime<span class="token punctuation">.</span>Now<span class="token punctuation">,</span>
    DateTime<span class="token punctuation">.</span>UtcNow
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="parameter" tabindex="-1"><a class="header-anchor" href="#parameter" aria-hidden="true">#</a> Parameter</h2><p>All parameters for <code>Ado</code> can accept anonymous objects or dictionaries:</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code> <span class="token keyword">new</span> <span class="token punctuation">{</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span> name <span class="token operator">=</span> <span class="token string">&quot;xx&quot;</span> <span class="token punctuation">}</span>
 <span class="token keyword">new</span> <span class="token constructor-invocation class-name">Dictionary<span class="token punctuation">&lt;</span><span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">object</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span> <span class="token punctuation">[</span><span class="token string">&quot;id&quot;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">&quot;name&quot;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;xx&quot;</span> <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Regarding <strong>parameter prefixes</strong>:</p><ul><li><code>odbc</code> uses <strong>?</strong> and does not have a specific identifier, so <code>freesql</code> disables <code>odbc</code> parameterization.</li></ul><table><thead><tr><th>Type</th><th>Prefix Symbol</th></tr></thead><tbody><tr><td>oracle</td><td><strong>:</strong></td></tr><tr><td>mysql.data</td><td><strong>?</strong></td></tr><tr><td>mysqlconnector</td><td><strong>@</strong></td></tr><tr><td>Others</td><td><strong>@</strong></td></tr></tbody></table><p>IN parameterization queries:</p><blockquote><p>Currently, only <code>Array</code> and <code>IList</code> types are supported for binding</p></blockquote><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> ids <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name"><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span></span> <span class="token punctuation">{</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token class-name">List<span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Query</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;select * from t1 where id in @ids&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token punctuation">{</span> ids <span class="token operator">=</span> ids <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="check-connection" tabindex="-1"><a class="header-anchor" href="#check-connection" aria-hidden="true">#</a> Check Connection</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">bool</span></span> isok <span class="token operator">=</span> fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token function">ExecuteConnectTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="command-fluent" tabindex="-1"><a class="header-anchor" href="#command-fluent" aria-hidden="true">#</a> Command Fluent</h2><p>When there are too many overloaded methods in <code>fsql.Ado</code>, it is recommended to use <code>CommandFluent</code>, for example, with stored procedures:</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name">DbParameter</span> p2 <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token function">CommandFluent</span><span class="token punctuation">(</span><span class="token string">&quot;dbo.GetICMaxNum&quot;</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">CommandType</span><span class="token punctuation">(</span>CommandType<span class="token punctuation">.</span>StoredProcedure<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">CommandTimeout</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithParameter</span><span class="token punctuation">(</span><span class="token string">&quot;TableName&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;tb1&quot;</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">WithParameter</span><span class="token punctuation">(</span><span class="token string">&quot;FInterID&quot;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> p <span class="token operator">=&gt;</span>
    <span class="token punctuation">{</span>
        <span class="token comment">//(p as OracleParameter).OracleType = ...;</span>
        p2 <span class="token operator">=</span> p<span class="token punctuation">;</span> <span class="token comment">// Output parameter</span>
        p<span class="token punctuation">.</span>DbType <span class="token operator">=</span> DbType<span class="token punctuation">.</span>Int32<span class="token punctuation">;</span>
        p<span class="token punctuation">.</span>Direction <span class="token operator">=</span> ParameterDirection<span class="token punctuation">.</span>Output<span class="token punctuation">;</span>
        <span class="token punctuation">(</span>p <span class="token keyword">as</span> <span class="token class-name">SqlParameter</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Size <span class="token operator">=</span> <span class="token number">50</span><span class="token punctuation">;</span> <span class="token comment">// Specific database parameter</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">ExecuteNonQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//.Query&lt;T&gt;() or .ExecuteDataTable() or ...</span>

Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span>p2<span class="token punctuation">.</span>Value<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Oracle stored procedure to get <code>DataTable</code>:</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name">OracleParameter</span> p2 <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">var</span></span> dt <span class="token operator">=</span> fsql<span class="token punctuation">.</span>Ado<span class="token punctuation">.</span><span class="token function">CommandFluent</span><span class="token punctuation">(</span><span class="token string">&quot;getTableInfo&quot;</span><span class="token punctuation">)</span>
     <span class="token punctuation">.</span><span class="token function">CommandType</span><span class="token punctuation">(</span>CommandType<span class="token punctuation">.</span>StoredProcedure<span class="token punctuation">)</span>
     <span class="token punctuation">.</span><span class="token function">CommandTimeout</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span>
     <span class="token punctuation">.</span><span class="token function">WithParameter</span><span class="token punctuation">(</span><span class="token string">&quot;out_var&quot;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> p <span class="token operator">=&gt;</span>
     <span class="token punctuation">{</span>
         p2 <span class="token operator">=</span> p <span class="token keyword">as</span> <span class="token class-name">OracleParameter</span><span class="token punctuation">;</span>
         p2<span class="token punctuation">.</span>OracleDbType <span class="token operator">=</span> OracleDbType<span class="token punctuation">.</span>RefCursor<span class="token punctuation">;</span>
         p2<span class="token punctuation">.</span>Direction <span class="token operator">=</span> ParameterDirection<span class="token punctuation">.</span>Output<span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">)</span>
     <span class="token punctuation">.</span><span class="token function">ExecuteDataTable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span>dt<span class="token punctuation">.</span>Rows<span class="token punctuation">.</span>Count<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ado-net-extensions" tabindex="-1"><a class="header-anchor" href="#ado-net-extensions" aria-hidden="true">#</a> Ado.net Extensions</h2><p>Provides usage similar to Dapper, <code>FreeSql</code> adds extension methods <code>Select/Insert/Update/Delete</code> for <code>IDbConnection/IDbTransaction</code> objects to implement CRUD operations.</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">using</span> <span class="token namespace">FreeSql</span><span class="token punctuation">;</span>

<span class="token keyword">using</span> <span class="token punctuation">(</span><span class="token class-name"><span class="token keyword">var</span></span> conn <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">SqlConnection</span><span class="token punctuation">(</span><span class="token range operator">..</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token comment">//IFreeSql fsql = conn.GetIFreeSql();</span>
  <span class="token comment">//fsql.CodeFirst.IsNoneCommandParameter = true;</span>
  <span class="token comment">//fsql.CodeFirst.IsSyncStructureToUpper = true;</span>
  <span class="token comment">//fsql.Aop.CommandBefore += (_, e) =&gt; Trace.WriteLine(e.Command.CommandText);</span>
  <span class="token comment">//The entire program only needs to be set once</span>

  conn<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Select</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span><span class="token range operator">..</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  conn<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token constructor-invocation class-name">T</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  conn<span class="token punctuation">.</span><span class="token function">Update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">SetSource</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token constructor-invocation class-name">T</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  conn<span class="token punctuation">.</span><span class="token function">InsertOrUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">SetSource</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token constructor-invocation class-name">T</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  conn<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Delete</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span><span class="token range operator">..</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ExecuteAffrows</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Each <code>SqlConnection</code>&#39;s <code>GetFreeSql()</code> returns the same <code>IFreeSql</code> instance;</li><li>You can set <code>Aop</code> events for <code>fsql</code>, such as monitoring SQL;</li><li>The <code>IDbFirst</code> and <code>Transaction</code> members of <code>IFreeSql</code> are not available;</li></ul><p>This feature allows for quick integration of <code>FreeSql</code> into a project, as long as you handle entity class attributes properly.</p><p>Hint: <code>FreeSql</code> is 99% compatible with EFCore entity attributes</p>`,26)]))}const i=s(p,[["render",o],["__file","ado.html.vue"]]);export{i as default};