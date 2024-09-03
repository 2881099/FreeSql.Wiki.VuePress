import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as s,e as n}from"./app-BtK9AW-R.js";const t={},i=n(`<h1 id="dbfirst" tabindex="-1"><a class="header-anchor" href="#dbfirst" aria-hidden="true">#</a> DbFirst</h1><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name">IFreeSql</span> fsql<span class="token punctuation">;</span> <span class="token comment">// For creation details, please refer to the Getting Started documentation</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="retrieve-all-databases" tabindex="-1"><a class="header-anchor" href="#retrieve-all-databases" aria-hidden="true">#</a> Retrieve All Databases</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> t1 <span class="token operator">=</span> fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetDatabases</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//[&quot;cccddd&quot;, &quot;test&quot;]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="retrieve-table-information-for-a-specific-database" tabindex="-1"><a class="header-anchor" href="#retrieve-table-information-for-a-specific-database" aria-hidden="true">#</a> Retrieve Table Information for a Specific Database</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> t2 <span class="token operator">=</span> fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetTablesByDatabase</span><span class="token punctuation">(</span>fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetDatabases</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Returns details including tables, columns, primary keys, unique keys, indexes, foreign keys, comments, etc.</span>

<span class="token class-name"><span class="token keyword">var</span></span> t3 <span class="token operator">=</span> fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetTableByName</span><span class="token punctuation">(</span><span class="token string">&quot;table1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Returns details including columns, primary keys, unique keys, indexes, comments, etc.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="net-core-cli" tabindex="-1"><a class="header-anchor" href="#net-core-cli" aria-hidden="true">#</a> .NET Core CLI</h2><p>The code generator <code>FreeSql.Generator</code> is a code generator for FreeSql. It can generate entity classes and supports dynamically generating entities from database entities. By default, it includes two templates based on Razor, and you can specify custom templates.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>dotnet tool <span class="token function">install</span> <span class="token parameter variable">-g</span> FreeSql.Generator
dotnet tool update <span class="token parameter variable">-g</span> FreeSql.Generator
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Create a new directory, open the command window quickly by typing <code>cmd</code> in the address bar, and enter the following command:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FreeSql.Generator <span class="token parameter variable">--help</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The great advantage of using the command-line tool to generate entity classes is that subsequent regenerations and overwrite operations can be done with a single command, and it supports Mac/Linux platforms.</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>C:\\WINDOWS\\system32&gt;FreeSql.Generator --help
        ____                   ____         __
       / __/  ____ ___  ___   / __/ ___ _  / /
      / _/   / __// -_)/ -_) _\\ \\  / _ \`/ / /
     /_/    /_/   \\__/ \\__/ /___/  \\_, / /_/
                                    /_/


  # Github # https://github.com/dotnetcore/FreeSql v2.0.105

    FreeSql Quick Generate Database Entity Classes

    Update Tool: dotnet tool update -g FreeSql.Generator


  # Quick Start #

  &gt; FreeSql.Generator -Razor 1 -NameOptions 0,0,0,0 -NameSpace MyProject -DB &quot;MySql,Data Source=127.0.0.1;...&quot;

    -Razor 1                 * Select template: Entity class + attributes
    -Razor 2                 * Select template: Entity class + attributes + navigation properties
    -Razor &quot;d:\\diy.cshtml&quot;   * Custom template file

    -NameOptions             * 4 boolean values corresponding to:
                               Capitalize the first letter
                               Capitalize the first letter, others lowercase
                               All lowercase
                               Underscore to camelCase

    -NameSpace               * Namespace

    -DB &quot;MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=db;charset=utf8;sslmode=none;max pool size=2&quot;
    -DB &quot;SqlServer,data source=.;integrated security=True;initial catalog=db;pooling=true;max pool size=2&quot;
    -DB &quot;PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=db;pooling=true;maximum pool size=2&quot;
    -DB &quot;Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2&quot;
    -DB &quot;Sqlite,data source=document.db&quot;
    -DB &quot;Firebird,database=localhost:D:\\fbdata\\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2&quot;
    -DB &quot;Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2&quot;
    -DB &quot;KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=db&quot;
    -DB &quot;ShenTong,host=192.168.164.10;port=2003;database=db;username=SYSDBA;password=szoscar55;maxpoolsize=2&quot;

   -Filter                   Table+View+StoreProcedure
                             Default: Generate tables, views, and stored procedures.
                             If you don&#39;t want to generate views and stored procedures, use -Filter View+StoreProcedure.

   -Match                    Table name or regular expression to match only specific tables, e.g., dbo\\.TB_.+

   -FileName                 File name, default: {name}.cs
   -Output                   Save path, default is the current shell directory.
                             Recommended to create gen.bat in the entity directory, double-click it to regenerate all entity classes.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="common-options" tabindex="-1"><a class="header-anchor" href="#common-options" aria-hidden="true">#</a> Common Options</h3><table><thead><tr><th>Option</th><th>Description</th></tr></thead><tbody><tr><td>-Razor</td><td>Choose a template: Entity class + attributes <code>-Razor 1</code> / Entity class + attributes + navigation properties <code>-Razor 2</code> / Custom template file <code>-Razor &quot;d:\\diy.cshtml&quot;</code></td></tr><tr><td>-NameOptions</td><td>Naming convention for the generated entities. Set only one of the four boolean values to 1. Options are: <code>Pascal Case</code> / <code>Pascal Case, others lowercase</code> / <code>All lowercase</code> / <code>Underscore to camel case</code> (<code>-NameOptions 0,0,0,1</code>)</td></tr><tr><td>-NameSpace</td><td>Namespace</td></tr><tr><td>-DB</td><td>Refer to the -DB parameter section below</td></tr><tr><td>-Filter</td><td>Table+View+StoreProcedure (default: generates tables, views, and stored procedures). To exclude views and stored procedures, use -Filter View+StoreProcedure</td></tr><tr><td>-Match</td><td>Table name or regular expression to match specific tables, e.g., dbo.TB_.+</td></tr><tr><td>-FileName</td><td>File name, default: {name}.cs</td></tr><tr><td>-Output</td><td>Recommended to create gen.bat in the entity directory. Double-click it to regenerate all entity classes.</td></tr></tbody></table><h3 id="db-parameter" tabindex="-1"><a class="header-anchor" href="#db-parameter" aria-hidden="true">#</a> -DB Parameter</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-DB &quot;MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=b;charset=utf8;sslmode=none;max pool size=2&quot;
-DB &quot;SqlServer,data source=.;integrated security=True;initial catalog=db;pooling=true;max pool size=2&quot;
-DB &quot;PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=db;pooling=true;maximum pool size=2&quot;
-DB &quot;Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2&quot;
-DB &quot;Sqlite,data source=document.db&quot;
-DB &quot;Firebird,database=localhost:D:\\fbdata\\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2&quot;
-DB &quot;Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2&quot;
-DB &quot;KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=db&quot;
-DB &quot;ShenTong,host=192.168.164.10;port=2003;database=db;username=SYSDBA;password=szoscar55;maxpoolsize=2&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),r=[i];function o(d,l){return a(),s("div",null,r)}const p=e(t,[["render",o],["__file","db-first.html.vue"]]);export{p as default};
