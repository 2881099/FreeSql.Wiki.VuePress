import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o,c as r,a as e,b as n,d as s,e as t}from"./app-6b51b305.js";const d={},c=t(`<h1 id="dbfirst" tabindex="-1"><a class="header-anchor" href="#dbfirst" aria-hidden="true">#</a> DbFirst</h1><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">static</span> <span class="token class-name">IFreeSql</span> fsql <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">FreeSql<span class="token punctuation">.</span>FreeSqlBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">UseConnectionString</span><span class="token punctuation">(</span>FreeSql<span class="token punctuation">.</span>DataType<span class="token punctuation">.</span>MySql<span class="token punctuation">,</span> connectionString<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">Build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//请务必定义成 Singleton 单例模式</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="获取所有数据库" tabindex="-1"><a class="header-anchor" href="#获取所有数据库" aria-hidden="true">#</a> 获取所有数据库</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> t1 <span class="token operator">=</span> fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetDatabases</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//返回字符串数组, [&quot;cccddd&quot;, &quot;test&quot;]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="获取指定数据库的表信息" tabindex="-1"><a class="header-anchor" href="#获取指定数据库的表信息" aria-hidden="true">#</a> 获取指定数据库的表信息</h2><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> t2 <span class="token operator">=</span> fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetTablesByDatabase</span><span class="token punctuation">(</span>fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetDatabases</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//返回包括表、列详情、主键、唯一键、索引、外键、备注等等</span>

<span class="token class-name"><span class="token keyword">var</span></span> t3 <span class="token operator">=</span> fsql<span class="token punctuation">.</span>DbFirst<span class="token punctuation">.</span><span class="token function">GetTableByName</span><span class="token punctuation">(</span><span class="token string">&quot;table1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//返回表的列详情、主键、唯一键、索引、备注等等</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="net-core-cli-推荐使用" tabindex="-1"><a class="header-anchor" href="#net-core-cli-推荐使用" aria-hidden="true">#</a> .NET Core CLI(推荐使用)</h2><p>代码生成器<code>FreeSql.Generator</code>,是 FreeSql 的代码生成器，可生成实体类，支持将数据库实体动态生成实体，默认有二个模板，基于 Razor，可指定自定义模板</p><ul><li><code>dotnet-tool</code>安装 <code>FreeSql.Generator</code></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>dotnet tool <span class="token function">install</span> <span class="token parameter variable">-g</span> FreeSql.Generator
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>更新<code>FreeSql.Generator</code></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>dotnet tool update <span class="token parameter variable">-g</span> FreeSql.Generator
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>新建目录，在地址栏输入 cmd 快速打开命令窗口，输入命令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FreeSql.Generator <span class="token parameter variable">--help</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>命令行工具生成实体类极大好处，后续再次生成覆盖操作等于一键完成，并且支持 Mac/Linux 平台。</p>`,15),u={href:"https://www.cnblogs.com/igeekfan/p/freesql-generator.html",target:"_blank",rel:"noopener noreferrer"},p=t(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>C:\\WINDOWS\\system32&gt;FreeSql.Generator --help
        ____                   ____         __
       / __/  ____ ___  ___   / __/ ___ _  / /
      / _/   / __// -_)/ -_) _\\ \\  / _ \`/ / /
     /_/    /_/   \\__/ \\__/ /___/  \\_, / /_/
                                    /_/


  # Github # https://github.com/dotnetcore/FreeSql v2.0.105

    FreeSql 快速生成数据库的实体类

    更新工具：dotnet tool update -g FreeSql.Generator


  # 快速开始 #

  &gt; FreeSql.Generator -Razor 1 -NameOptions 0,0,0,0 -NameSpace MyProject -DB &quot;MySql,Data Source=127.0.0.1;...&quot;

     -Razor 1                  * 选择模板：实体类+特性
     -Razor 2                  * 选择模板：实体类+特性+导航属性
     -Razor &quot;d:\\diy.cshtml&quot;    * 自定义模板文件

     -NameOptions              * 4个布尔值对应：
                                 首字母大写
                                 首字母大写,其他小写
                                 全部小写
                                 下划线转驼峰

     -NameSpace                * 命名空间

     -DB &quot;MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=数据库;charset=utf8;sslmode=none;max pool size=2&quot;
     -DB &quot;SqlServer,data source=.;integrated security=True;initial catalog=数据库;pooling=true;max pool size=2&quot;
     -DB &quot;PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=数据库;pooling=true;maximum pool size=2&quot;
     -DB &quot;Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2&quot;
     -DB &quot;Sqlite,data source=document.db&quot;
     -DB &quot;Firebird,database=localhost:D:\\fbdata\\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2&quot;
     -DB &quot;Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2&quot;
     -DB &quot;KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=数据库&quot;
     -DB &quot;ShenTong,host=192.168.164.10;port=2003;database=数据库;username=SYSDBA;password=szoscar55;maxpoolsize=2&quot;
                               * Dameng(达梦数据库)、KingbaseES(人大金仓数据库)、ShenTong(神舟通用数据库)

     -Filter                   Table+View+StoreProcedure
                               默认生成：表+视图+存储过程
                               如果不想生成视图和存储过程 -Filter View+StoreProcedure

     -Match                    表名或正则表达式，只生成匹配的表，如：dbo\\.TB_.+

     -FileName                 文件名，默认：{name}.cs
     -Output                   保存路径，默认为当前 shell 所在目录
                               推荐在实体类目录创建 gen.bat，双击它重新所有实体类
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用选项" tabindex="-1"><a class="header-anchor" href="#常用选项" aria-hidden="true">#</a> 常用选项</h3><table><thead><tr><th style="text-align:left;">选项</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">-Razor</td><td style="text-align:left;">选择模板：实体类+特性 <code>-Razor 1</code> / 实体类+特性+导航属性 <code>-Razor 2</code>/ 自定义模板文件 <code>-Razor &quot;d:\\diy.cshtml&quot;</code></td></tr><tr><td style="text-align:left;">-NameOptions</td><td style="text-align:left;">生成的实体命名规范，应只设置某一个为参数为 1，其中 4 个布尔值对应：<code>首字母大写</code>/<code>首字母大写,其他小写</code>/<code>全部小写</code>/<code>下划线转驼</code>（-NameOptions 0,0,0,1）</td></tr><tr><td style="text-align:left;">-NameSpace</td><td style="text-align:left;">命名空间</td></tr><tr><td style="text-align:left;">-DB</td><td style="text-align:left;">看下文中的-DB 参数</td></tr><tr><td style="text-align:left;">-Filter</td><td style="text-align:left;">Table+View+StoreProcedure（ 默认生成：表+视图+存储过程）， 如果不想生成视图和存储过程 -Filter View+StoreProcedure</td></tr><tr><td style="text-align:left;">-Match</td><td style="text-align:left;">表名或正则表达式，只生成匹配的表，如：dbo.TB_.+</td></tr><tr><td style="text-align:left;">-FileName</td><td style="text-align:left;">文件名，默认：{name}.cs</td></tr><tr><td style="text-align:left;">-Output</td><td style="text-align:left;">推荐在实体类目录创建 gen.bat，双击它重新所有实体类</td></tr></tbody></table><h3 id="db-参数" tabindex="-1"><a class="header-anchor" href="#db-参数" aria-hidden="true">#</a> -DB 参数</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-DB &quot;MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=数据库;charset=utf8;sslmode=none;max pool size=2&quot;
-DB &quot;SqlServer,data source=.;integrated security=True;initial catalog=数据库;pooling=true;max pool size=2&quot;
-DB &quot;PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=数据库;pooling=true;maximum pool size=2&quot;
-DB &quot;Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2&quot;
-DB &quot;Sqlite,data source=document.db&quot;
-DB &quot;Firebird,database=localhost:D:\\fbdata\\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2&quot;
-DB &quot;Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2&quot;
-DB &quot;KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=数据库&quot;
-DB &quot;ShenTong,host=192.168.164.10;port=2003;database=数据库;username=SYSDBA;password=szoscar55;maxpoolsize=2&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h3><blockquote><p>FreeSql.Generator -Razor 1 -NameOptions 0,0,0,1 -NameSpace LinCms.Core.Entities -DB &quot;MySql,Data Source=127.0.0.1;Port=3306;User ID=root;Password=123456;Initial Catalog=lincms;Charset=utf8;SslMode=none;Max pool size=2&quot;</p></blockquote><ul><li>数据库表名是下划线，字段也是下划线方式。</li><li>-Razor 指定 第一个模板</li><li>-NameOptions 0,0,0,1 最后一个 1，代表 下划线转驼峰，满足 C#命名规则</li><li>-NameSpace 指定了命名空间 LinCms.Core.Entities</li><li>-DB 就是数据库的相关配置</li><li>mysql 本地地址 127.0.0.1 3306 端口 用户名 root 密码 123456 数据库 lin-cms</li><li>-Match book 这样就能只生成 book，支持正则表达式，如 -Match lin<em>user 就会生成以 lin_user 开头的表。如 dbo.TB</em>.+，会生成以 TB 开头的表。即只生成匹配的表</li></ul><h2 id="安装-winform-生成器-已停止更新" tabindex="-1"><a class="header-anchor" href="#安装-winform-生成器-已停止更新" aria-hidden="true">#</a> 安装 Winform 生成器（已停止更新）</h2>`,9),m={href:"https://github.com/2881099/FreeSql.Tools",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/mypeng1985",target:"_blank",rel:"noopener noreferrer"},b=e("figure",null,[e("img",{src:"https://user-images.githubusercontent.com/16286519/76141354-4790e980-609e-11ea-869b-bb2c6980d98f.png",alt:"image",tabindex:"0",loading:"lazy"}),e("figcaption",null,"image")],-1),h=e("figure",null,[e("img",{src:"https://user-images.githubusercontent.com/16286519/58793525-e0cf3300-8628-11e9-8959-d2efed685843.png",alt:"image",tabindex:"0",loading:"lazy"}),e("figcaption",null,"image")],-1);function g(q,k){const a=l("ExternalLinkIcon");return o(),r("div",null,[c,e("p",null,[e("a",u,[n("详细解读：生成器是如何实现的？"),s(a)])]),p,e("p",null,[n("源码地址："),e("a",m,[n("FreeSql.Tools"),s(a)])]),e("blockquote",null,[e("p",null,[n("作者："),e("a",v,[n("mypeng1985"),s(a)]),n(" 开发了两个版本")])]),b,h])}const S=i(d,[["render",g],["__file","db-first.html.vue"]]);export{S as default};
