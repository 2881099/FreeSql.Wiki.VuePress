import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,a,o as n}from"./app-B3jd7LhO.js";const t={};function l(r,s){return n(),e("div",null,s[0]||(s[0]=[a(`<h1 id="dbfirst" tabindex="-1"><a class="header-anchor" href="#dbfirst"><span>DbFirst</span></a></h1><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">static</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> IFreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> new </span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeSqlBuilder</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseConnectionString</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">FreeSql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DataType</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">MySql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">connectionString</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Build</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(); </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//请务必定义成 Singleton 单例模式</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="获取所有数据库" tabindex="-1"><a class="header-anchor" href="#获取所有数据库"><span>获取所有数据库</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">var</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> t1</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DbFirst</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">GetDatabases</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//返回字符串数组, [&quot;cccddd&quot;, &quot;test&quot;]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="获取指定数据库的表信息" tabindex="-1"><a class="header-anchor" href="#获取指定数据库的表信息"><span>获取指定数据库的表信息</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">var</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> t2</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DbFirst</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">GetTablesByDatabase</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DbFirst</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">GetDatabases</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()[</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">]);</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//返回包括表、列详情、主键、唯一键、索引、外键、备注等等</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">var</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> t3</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> fsql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">DbFirst</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">GetTableByName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;table1&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">//返回表的列详情、主键、唯一键、索引、备注等等</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="net-core-cli-推荐使用" tabindex="-1"><a class="header-anchor" href="#net-core-cli-推荐使用"><span>.NET Core CLI(推荐使用)</span></a></h2><p>代码生成器<code>FreeSql.Generator</code>,是 FreeSql 的代码生成器，可生成实体类，支持将数据库实体动态生成实体，默认有二个模板，基于 Razor，可指定自定义模板</p><ul><li><code>dotnet-tool</code>安装 <code>FreeSql.Generator</code></li></ul><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">dotnet</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> tool</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -g</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> FreeSql.Generator</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>更新<code>FreeSql.Generator</code></li></ul><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">dotnet</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> tool</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> update</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -g</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> FreeSql.Generator</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>新建目录，在地址栏输入 cmd 快速打开命令窗口，输入命令：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">FreeSql.Generator</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --help</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>命令行工具生成实体类极大好处，后续再次生成覆盖操作等于一键完成，并且支持 Mac/Linux 平台。</p><p><a href="https://www.cnblogs.com/igeekfan/p/freesql-generator.html" target="_blank" rel="noopener noreferrer">详细解读：生成器是如何实现的？</a></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>C:\\WINDOWS\\system32&gt;FreeSql.Generator --help</span></span>
<span class="line"><span>        ____                   ____         __</span></span>
<span class="line"><span>       / __/  ____ ___  ___   / __/ ___ _  / /</span></span>
<span class="line"><span>      / _/   / __// -_)/ -_) _\\ \\  / _ \`/ / /</span></span>
<span class="line"><span>     /_/    /_/   \\__/ \\__/ /___/  \\_, / /_/</span></span>
<span class="line"><span>                                    /_/</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # Github # https://github.com/dotnetcore/FreeSql v2.0.105</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    FreeSql 快速生成数据库的实体类</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    更新工具：dotnet tool update -g FreeSql.Generator</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 快速开始 #</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &gt; FreeSql.Generator -Razor 1 -NameOptions 0,0,0,0 -NameSpace MyProject -DB &quot;MySql,Data Source=127.0.0.1;...&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     -Razor 1                  * 选择模板：实体类+特性</span></span>
<span class="line"><span>     -Razor 2                  * 选择模板：实体类+特性+导航属性</span></span>
<span class="line"><span>     -Razor &quot;d:\\diy.cshtml&quot;    * 自定义模板文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     -NameOptions              * 4个布尔值对应：</span></span>
<span class="line"><span>                                 首字母大写</span></span>
<span class="line"><span>                                 首字母大写,其他小写</span></span>
<span class="line"><span>                                 全部小写</span></span>
<span class="line"><span>                                 下划线转驼峰</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     -NameSpace                * 命名空间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     -DB &quot;MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=数据库;charset=utf8;sslmode=none;max pool size=2&quot;</span></span>
<span class="line"><span>     -DB &quot;SqlServer,data source=.;integrated security=True;initial catalog=数据库;pooling=true;max pool size=2&quot;</span></span>
<span class="line"><span>     -DB &quot;PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=数据库;pooling=true;maximum pool size=2&quot;</span></span>
<span class="line"><span>     -DB &quot;Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2&quot;</span></span>
<span class="line"><span>     -DB &quot;Sqlite,data source=document.db&quot;</span></span>
<span class="line"><span>     -DB &quot;Firebird,database=localhost:D:\\fbdata\\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2&quot;</span></span>
<span class="line"><span>     -DB &quot;Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2&quot;</span></span>
<span class="line"><span>     -DB &quot;KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=数据库&quot;</span></span>
<span class="line"><span>     -DB &quot;ShenTong,host=192.168.164.10;port=2003;database=数据库;username=SYSDBA;password=szoscar55;maxpoolsize=2&quot;</span></span>
<span class="line"><span>                               * Dameng(达梦数据库)、KingbaseES(人大金仓数据库)、ShenTong(神舟通用数据库)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     -Filter                   Table+View+StoreProcedure</span></span>
<span class="line"><span>                               默认生成：表+视图+存储过程</span></span>
<span class="line"><span>                               如果不想生成视图和存储过程 -Filter View+StoreProcedure</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     -Match                    表名或正则表达式，只生成匹配的表，如：dbo\\.TB_.+</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     -FileName                 文件名，默认：{name}.cs</span></span>
<span class="line"><span>     -Output                   保存路径，默认为当前 shell 所在目录</span></span>
<span class="line"><span>                               推荐在实体类目录创建 gen.bat，双击它重新所有实体类</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用选项" tabindex="-1"><a class="header-anchor" href="#常用选项"><span>常用选项</span></a></h3><table><thead><tr><th style="text-align:left;">选项</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">-Razor</td><td style="text-align:left;">选择模板：实体类+特性 <code>-Razor 1</code> / 实体类+特性+导航属性 <code>-Razor 2</code>/ 自定义模板文件 <code>-Razor &quot;d:\\diy.cshtml&quot;</code></td></tr><tr><td style="text-align:left;">-NameOptions</td><td style="text-align:left;">生成的实体命名规范，应只设置某一个为参数为 1，其中 4 个布尔值对应：<code>首字母大写</code>/<code>首字母大写,其他小写</code>/<code>全部小写</code>/<code>下划线转驼</code>（-NameOptions 0,0,0,1）</td></tr><tr><td style="text-align:left;">-NameSpace</td><td style="text-align:left;">命名空间</td></tr><tr><td style="text-align:left;">-DB</td><td style="text-align:left;">看下文中的-DB 参数</td></tr><tr><td style="text-align:left;">-Filter</td><td style="text-align:left;">Table+View+StoreProcedure（ 默认生成：表+视图+存储过程）， 如果不想生成视图和存储过程 -Filter View+StoreProcedure</td></tr><tr><td style="text-align:left;">-Match</td><td style="text-align:left;">表名或正则表达式，只生成匹配的表，如：dbo.TB_.+</td></tr><tr><td style="text-align:left;">-FileName</td><td style="text-align:left;">文件名，默认：{name}.cs</td></tr><tr><td style="text-align:left;">-Output</td><td style="text-align:left;">推荐在实体类目录创建 gen.bat，双击它重新所有实体类</td></tr></tbody></table><h3 id="db-参数" tabindex="-1"><a class="header-anchor" href="#db-参数"><span>-DB 参数</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>-DB &quot;MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=数据库;charset=utf8;sslmode=none;max pool size=2&quot;</span></span>
<span class="line"><span>-DB &quot;SqlServer,data source=.;integrated security=True;initial catalog=数据库;pooling=true;max pool size=2&quot;</span></span>
<span class="line"><span>-DB &quot;PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=数据库;pooling=true;maximum pool size=2&quot;</span></span>
<span class="line"><span>-DB &quot;Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2&quot;</span></span>
<span class="line"><span>-DB &quot;Sqlite,data source=document.db&quot;</span></span>
<span class="line"><span>-DB &quot;Firebird,database=localhost:D:\\fbdata\\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2&quot;</span></span>
<span class="line"><span>-DB &quot;Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2&quot;</span></span>
<span class="line"><span>-DB &quot;KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=数据库&quot;</span></span>
<span class="line"><span>-DB &quot;ShenTong,host=192.168.164.10;port=2003;database=数据库;username=SYSDBA;password=szoscar55;maxpoolsize=2&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h3><blockquote><p>FreeSql.Generator -Razor 1 -NameOptions 0,0,0,1 -NameSpace LinCms.Core.Entities -DB &quot;MySql,Data Source=127.0.0.1;Port=3306;User ID=root;Password=123456;Initial Catalog=lincms;Charset=utf8;SslMode=none;Max pool size=2&quot;</p></blockquote><ul><li>数据库表名是下划线，字段也是下划线方式。</li><li>-Razor 指定 第一个模板</li><li>-NameOptions 0,0,0,1 最后一个 1，代表 下划线转驼峰，满足 C#命名规则</li><li>-NameSpace 指定了命名空间 LinCms.Core.Entities</li><li>-DB 就是数据库的相关配置</li><li>mysql 本地地址 127.0.0.1 3306 端口 用户名 root 密码 123456 数据库 lin-cms</li><li>-Match book 这样就能只生成 book，支持正则表达式，如 -Match lin<em>user 就会生成以 lin_user 开头的表。如 dbo.TB</em>.+，会生成以 TB 开头的表。即只生成匹配的表</li></ul><h2 id="安装-winform-生成器-已停止更新" tabindex="-1"><a class="header-anchor" href="#安装-winform-生成器-已停止更新"><span>安装 Winform 生成器（已停止更新）</span></a></h2><p>源码地址：<a href="https://github.com/2881099/FreeSql.Tools" target="_blank" rel="noopener noreferrer">FreeSql.Tools</a></p><blockquote><p>作者：<a href="https://github.com/mypeng1985" target="_blank" rel="noopener noreferrer">mypeng1985</a> 开发了两个版本</p></blockquote><figure><img src="https://user-images.githubusercontent.com/16286519/76141354-4790e980-609e-11ea-869b-bb2c6980d98f.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure><figure><img src="https://user-images.githubusercontent.com/16286519/58793525-e0cf3300-8628-11e9-8959-d2efed685843.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure>`,29)]))}const h=i(t,[["render",l],["__file","db-first.html.vue"]]),o=JSON.parse('{"path":"/guide/db-first.html","title":"DbFirst","lang":"zh-CN","frontmatter":{"description":"DbFirst 获取所有数据库 获取指定数据库的表信息 .NET Core CLI(推荐使用) 代码生成器FreeSql.Generator,是 FreeSql 的代码生成器，可生成实体类，支持将数据库实体动态生成实体，默认有二个模板，基于 Razor，可指定自定义模板 dotnet-tool安装 FreeSql.Generator 更新FreeSql...","head":[["link",{"rel":"alternate","hreflang":"en-us","href":"https://freesql.net/en/guide/db-first.html"}],["meta",{"property":"og:url","content":"https://freesql.net/guide/db-first.html"}],["meta",{"property":"og:site_name","content":"FreeSql"}],["meta",{"property":"og:title","content":"DbFirst"}],["meta",{"property":"og:description","content":"DbFirst 获取所有数据库 获取指定数据库的表信息 .NET Core CLI(推荐使用) 代码生成器FreeSql.Generator,是 FreeSql 的代码生成器，可生成实体类，支持将数据库实体动态生成实体，默认有二个模板，基于 Razor，可指定自定义模板 dotnet-tool安装 FreeSql.Generator 更新FreeSql..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://user-images.githubusercontent.com/16286519/76141354-4790e980-609e-11ea-869b-bb2c6980d98f.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-01-16T10:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-01-16T10:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"DbFirst\\",\\"image\\":[\\"https://user-images.githubusercontent.com/16286519/76141354-4790e980-609e-11ea-869b-bb2c6980d98f.png\\",\\"https://user-images.githubusercontent.com/16286519/58793525-e0cf3300-8628-11e9-8959-d2efed685843.png\\"],\\"dateModified\\":\\"2025-01-16T10:00:00.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql RSS Feed"}]]},"headers":[{"level":2,"title":"获取所有数据库","slug":"获取所有数据库","link":"#获取所有数据库","children":[]},{"level":2,"title":"获取指定数据库的表信息","slug":"获取指定数据库的表信息","link":"#获取指定数据库的表信息","children":[]},{"level":2,"title":".NET Core CLI(推荐使用)","slug":"net-core-cli-推荐使用","link":"#net-core-cli-推荐使用","children":[{"level":3,"title":"常用选项","slug":"常用选项","link":"#常用选项","children":[]},{"level":3,"title":"-DB 参数","slug":"db-参数","link":"#db-参数","children":[]},{"level":3,"title":"示例","slug":"示例","link":"#示例","children":[]}]},{"level":2,"title":"安装 Winform 生成器（已停止更新）","slug":"安装-winform-生成器-已停止更新","link":"#安装-winform-生成器-已停止更新","children":[]}],"git":{"createdTime":1602827823000,"updatedTime":1737021600000,"contributors":[{"name":"taadis","username":"taadis","email":"i@taadis.com","commits":1,"url":"https://github.com/taadis"},{"name":"luoyunchong","username":"luoyunchong","email":"luoyunchong@foxmail.com","commits":4,"url":"https://github.com/luoyunchong"},{"name":"igeekfan","username":"igeekfan","email":"luoyunchong@foxmail.com","commits":3,"url":"https://github.com/igeekfan"},{"name":"gitlsl","username":"gitlsl","email":"lsl@live.com","commits":1,"url":"https://github.com/gitlsl"},{"name":"2881099","username":"2881099","email":"2881099@users.noreply.github.com","commits":4,"url":"https://github.com/2881099"},{"name":"Mister-Hope","username":"Mister-Hope","email":"mister-hope@outlook.com","commits":1,"url":"https://github.com/Mister-Hope"}]},"readingTime":{"minutes":4.2,"words":1261},"filePathRelative":"guide/db-first.md","localizedDate":"2020年10月16日","autoDesc":true}');export{h as comp,o as data};
