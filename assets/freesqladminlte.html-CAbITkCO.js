import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,a,o as t}from"./app-B3jd7LhO.js";const n={};function l(p,i){return t(),e("div",null,i[0]||(i[0]=[a(`<h1 id="freesql-adminlte" tabindex="-1"><a class="header-anchor" href="#freesql-adminlte"><span>FreeSql.AdminLTE</span></a></h1><p>它是 FreeSql 衍生出来的 .NETCore MVC 中间件扩展包 FreeSql.AdminLTE.Preview.dll，基于 AdminLTE 前端框架动态产生实体的增删查改界面。</p><blockquote><p>dotnet add packages FreeSql.AdminLTE.Preview</p></blockquote><p>输入：实体1、实体2、实体3</p><p>输出：后台管理的功能</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" data-title="csharp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">app</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">UseFreeAdminLtePreview</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Config</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Role</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Menu</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">User</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Department</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Employee</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Position</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">AppLog</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">LoginLog</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">OprationLog</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeScheduler</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">TaskInfo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">),</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">    typeof</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FreeScheduler</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">TaskLog</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只需要传入实体，就可以生产 curd 的管理功能，是不是有些骚啊~~~</p><figure><img src="https://user-images.githubusercontent.com/16286519/187557633-351e3fbe-ae87-461f-9e45-f1c31c6a2b92.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure><figure><img src="https://user-images.githubusercontent.com/16286519/187557677-5333484e-92d3-42a4-8543-6baf89814540.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure><p>对于通用后台管理系统的生成，除了单纯的对单表 crud 操作外，我还喜欢利用导航属性的操作，比如：</p><p>1、Song、Tag 多对多场景，添加/更新 Song 时可以把 Tag 一起保存；</p><p>2、列表页，希望外键、多对多出现在过滤筛选条件；</p><p>3、列表页，希望枚举出现在过滤筛选条件；</p><p>4、删除时，级联删除所有相关数据；</p><p>等等诸如此类的繁琐操作，之所以说繁琐，是因为这些工作技术不难，属于严重的重复劳动。</p><h2 id="机制设定" tabindex="-1"><a class="header-anchor" href="#机制设定"><span>机制设定</span></a></h2><p>1、添加、修改数据</p><p>中件间产生的界面包括添加、修改数据的功能，普通实体的根据属性的类型与 Html5 UI 一一映射；</p><p>比较特殊的映射规则：</p><table><thead><tr><th>c# 类型</th><th>Html5</th></tr></thead><tbody><tr><td>布尔</td><td>复选框</td></tr><tr><td>枚举</td><td>下拉选择</td></tr><tr><td>日期</td><td>日期控件</td></tr><tr><td>ManyToOne 导航属性</td><td>下拉选择</td></tr><tr><td>ManyToMany 导航属性</td><td>多选器</td></tr></tbody></table><p>等等。。。</p><p>什么情况会产生【上传文件】控件？ 有兴趣的可以了解源码，目前没有开放在外部配置。</p><hr><p>2、列表查询、过滤筛选</p><p>中件间为每个实体提供了分页列表查询，每页为20条数据；</p><p>除此外，还提供了过滤条件的支持，规则是根据导航属性（ManyToOne、ManyToMany）。比如【岗位】，内含有【部门 Department】、【员工 Employee】、【角色 Role】，则【岗位】列表页会出现按【分类】筛选的UI，详见上面的 demo 示意图，或者下载 demo 运行；</p><hr><p>3、删除数据</p><p>中件间为每个实体提供了批量删除的功能；</p><p>并且支持了复杂导航属性关系的级联删除功能，而这个功能不依赖数据库外键；</p><h2 id="下载-demo" tabindex="-1"><a class="header-anchor" href="#下载-demo"><span>下载 Demo</span></a></h2><p>我们一直习惯用 sqlite 做测试库，测试完毕直接删除目录，不留垃圾数据，所以下面的 demo 不需要修改任何地方，运行时自动建库、建表；</p><p>运行环境：.net6.0</p><p><a href="https://files.cnblogs.com/files/FreeSql/freesql.adminlte.preview.zip" target="_blank" rel="noopener noreferrer">https://files.cnblogs.com/files/FreeSql/freesql.adminlte.preview.zip</a></p><p>第一步：</p><blockquote><p>dotnet restore</p></blockquote><p>第二步：</p><blockquote><p>dotnet run</p></blockquote>`,38)]))}const d=s(n,[["render",l],["__file","freesqladminlte.html.vue"]]),k=JSON.parse('{"path":"/guide/freesqladminlte.html","title":"FreeSql.AdminLTE","lang":"zh-CN","frontmatter":{"description":"FreeSql.AdminLTE 它是 FreeSql 衍生出来的 .NETCore MVC 中间件扩展包 FreeSql.AdminLTE.Preview.dll，基于 AdminLTE 前端框架动态产生实体的增删查改界面。 dotnet add packages FreeSql.AdminLTE.Preview 输入：实体1、实体2、实体3 输出：...","head":[["meta",{"property":"og:url","content":"https://freesql.net/guide/freesqladminlte.html"}],["meta",{"property":"og:site_name","content":"FreeSql"}],["meta",{"property":"og:title","content":"FreeSql.AdminLTE"}],["meta",{"property":"og:description","content":"FreeSql.AdminLTE 它是 FreeSql 衍生出来的 .NETCore MVC 中间件扩展包 FreeSql.AdminLTE.Preview.dll，基于 AdminLTE 前端框架动态产生实体的增删查改界面。 dotnet add packages FreeSql.AdminLTE.Preview 输入：实体1、实体2、实体3 输出：..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://user-images.githubusercontent.com/16286519/187557633-351e3fbe-ae87-461f-9e45-f1c31c6a2b92.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-01-16T10:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-01-16T10:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"FreeSql.AdminLTE\\",\\"image\\":[\\"https://user-images.githubusercontent.com/16286519/187557633-351e3fbe-ae87-461f-9e45-f1c31c6a2b92.png\\",\\"https://user-images.githubusercontent.com/16286519/187557677-5333484e-92d3-42a4-8543-6baf89814540.png\\"],\\"dateModified\\":\\"2025-01-16T10:00:00.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql RSS Feed"}]]},"headers":[{"level":2,"title":"机制设定","slug":"机制设定","link":"#机制设定","children":[]},{"level":2,"title":"下载 Demo","slug":"下载-demo","link":"#下载-demo","children":[]}],"git":{"createdTime":1661900513000,"updatedTime":1737021600000,"contributors":[{"name":"2881099","username":"2881099","email":"2881099@users.noreply.github.com","commits":1,"url":"https://github.com/2881099"},{"name":"Mister-Hope","username":"Mister-Hope","email":"mister-hope@outlook.com","commits":1,"url":"https://github.com/Mister-Hope"}]},"readingTime":{"minutes":2.17,"words":651},"filePathRelative":"guide/freesqladminlte.md","localizedDate":"2022年8月30日","autoDesc":true}');export{d as comp,k as data};
