import{_ as o}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,a as i,b as t,e as l,f as n,d as e,r as a,o as u}from"./app-B3jd7LhO.js";const h={};function g(p,d){const r=a("RouteLink");return u(),s("div",null,[d[43]||(d[43]=i('<h1 id="api-文档" tabindex="-1"><a class="header-anchor" href="#api-文档"><span>API 文档</span></a></h1><ul><li><a href="http://124.221.134.143:8082/api/FreeSql.html" target="_blank" rel="noopener noreferrer">http://124.221.134.143:8082/api/FreeSql.html</a></li></ul><h2 id="freesqlbuilder" tabindex="-1"><a class="header-anchor" href="#freesqlbuilder"><span>FreeSqlBuilder</span></a></h2><table><thead><tr><th>方法</th><th>返回值</th><th>说明</th></tr></thead><tbody><tr><td>UseConnectionString</td><td>this</td><td>设置连接串</td></tr><tr><td>UseAdoConnectionPool</td><td>this</td><td>设置连接池方案（默认 false，远程访问建议设置 true）</td></tr><tr><td>UseSlave</td><td>this</td><td>设置从数据库，支持多个</td></tr><tr><td>UseSlaveWeight</td><td>this</td><td>设置从数据库权重</td></tr><tr><td>UseConnectionFactory</td><td>this</td><td>设置自定义数据库连接对象（放弃内置对象连接池技术）</td></tr><tr><td>UseAutoSyncStructure</td><td>this</td><td>【开发环境必备】自动同步实体结构到数据库，程序运行中检查实体创建或修改表结构</td></tr><tr><td>UseNoneCommandParameter</td><td>this</td><td>不使用命令参数化执行，针对 Insert/Update，也可临时使用 IInsert/IUpdate.NoneParameter()</td></tr><tr><td>UseGenerateCommandParameterWithLambda</td><td>this</td><td>生成命令参数化执行，针对 lambda 表达式解析</td></tr><tr><td>UseLazyLoading</td><td>this</td><td>开启延时加载功能</td></tr><tr><td>UseMonitorCommand</td><td>this</td><td>监视全局 SQL 执行前后</td></tr><tr><td>UseMappingPriority</td><td>this</td><td>指定映射优先级（默认 Aop &lt; FluentApi &lt; Attribute）</td></tr><tr><td><strong>UseNameConvert</strong></td><td>this</td><td>自动转换名称 Entity -&gt; Db</td></tr><tr><td>UseQuoteSqlName</td><td>this</td><td>SQL名称是否使用 [] `` &quot;&quot;</td></tr><tr><td>UseExitAutoDisposePool</td><td>this</td><td>监听 AppDomain.CurrentDomain.ProcessExit/Console.CancelKeyPress 事件自动释放连接池 (默认true)</td></tr><tr><td>Build&lt;T&gt;</td><td>IFreeSql&lt;T&gt;</td><td>创建一个 IFreeSql 对象，注意：单例设计，不要重复创建</td></tr></tbody></table><h2 id="ifreesql" tabindex="-1"><a class="header-anchor" href="#ifreesql"><span>IFreeSql</span></a></h2>',5)),t("table",null,[d[15]||(d[15]=t("thead",null,[t("tr",null,[t("th",null,"属性"),t("th",null,"返回值"),t("th",null,"说明")])],-1)),t("tbody",null,[t("tr",null,[t("td",null,[l(r,{to:"/guide/ado.html"},{default:n(()=>d[0]||(d[0]=[e("Ado")])),_:1})]),d[1]||(d[1]=t("td",null,"IAdo",-1)),d[2]||(d[2]=t("td",null,"数据库访问对象，封装了类似 SqlHelper 操作：ExecuteNonQuery/ExecuteScalar/ExecuteConnectTest 等",-1))]),t("tr",null,[t("td",null,[l(r,{to:"/guide/aop.html"},{default:n(()=>d[3]||(d[3]=[e("Aop")])),_:1})]),d[4]||(d[4]=t("td",null,"IAop",-1)),d[5]||(d[5]=t("td",null,"所有 AOP 拦截方法都在这里",-1))]),t("tr",null,[t("td",null,[l(r,{to:"/guide/code-first.html"},{default:n(()=>d[6]||(d[6]=[e("CodeFirst")])),_:1})]),d[7]||(d[7]=t("td",null,"ICodeFirst",-1)),d[8]||(d[8]=t("td",null,"封装 CodeFirst 模式开发相关方法",-1))]),t("tr",null,[t("td",null,[l(r,{to:"/guide/db-first.html"},{default:n(()=>d[9]||(d[9]=[e("DbFirst")])),_:1})]),d[10]||(d[10]=t("td",null,"IDbFirst",-1)),d[11]||(d[11]=t("td",null,"封装 DbFirst 模式开发相关方法",-1))]),t("tr",null,[t("td",null,[l(r,{to:"/guide/filters.html"},{default:n(()=>d[12]||(d[12]=[e("GlobalFilter")])),_:1})]),d[13]||(d[13]=t("td",null,"GlobalFilter",-1)),d[14]||(d[14]=t("td",null,"全局过滤设置，可默认附加为 Select/Update/Delete 条件",-1))])])]),t("table",null,[d[26]||(d[26]=t("thead",null,[t("tr",null,[t("th",null,"方法"),t("th",null,"返回值"),t("th",null,"参数"),t("th",null,"说明")])],-1)),t("tbody",null,[d[21]||(d[21]=t("tr",null,[t("td",null,"Select<TEntity>"),t("td",null,"ISelect<TEntity>"),t("td",null,"无"),t("td",null,"准备查询数据")],-1)),d[22]||(d[22]=t("tr",null,[t("td",null,"Insert<TEntity>"),t("td",null,"IInsert<TEntity>"),t("td",null,"无/TEntity/TEntity[]"),t("td",null,"准备插入")],-1)),d[23]||(d[23]=t("tr",null,[t("td",null,"Update<TEntity>"),t("td",null,"IUpdate<TEntity>"),t("td",null,"无"),t("td",null,"准备更新数据")],-1)),d[24]||(d[24]=t("tr",null,[t("td",null,"Delete<TEntity>"),t("td",null,"IDelete<TEntity>"),t("td",null,"无"),t("td",null,"准备删除")],-1)),d[25]||(d[25]=t("tr",null,[t("td",null,"InsertOrUpdate<TEntity>"),t("td",null,"IInsertOrUpdate<TEntity>"),t("td",null,"无"),t("td",null,"插入或更新数据")],-1)),t("tr",null,[d[18]||(d[18]=t("td",null,"Transaction",-1)),d[19]||(d[19]=t("td",null,"void",-1)),d[20]||(d[20]=t("td",null,"Action",-1)),t("td",null,[d[17]||(d[17]=e("开启事务（不支持异步），")),l(r,{to:"/guide/transaction.html"},{default:n(()=>d[16]||(d[16]=[e("其他事务")])),_:1})])])])]),t("table",null,[d[42]||(d[42]=t("thead",null,[t("tr",null,[t("th",null,"扩展方法"),t("th",null,"返回值"),t("th",null,"参数"),t("th",null,"说明")])],-1)),t("tbody",null,[d[40]||(d[40]=t("tr",null,[t("td",null,"Select<T1, T2, ... T10>"),t("td",null,"ISelect"),t("td",null,"无"),t("td",null,"准备多表查询")],-1)),t("tr",null,[t("td",null,[l(r,{to:"/guide/db-context.html"},{default:n(()=>d[27]||(d[27]=[e("CreateDbContext")])),_:1})]),d[28]||(d[28]=t("td",null,"DbContext",-1)),d[29]||(d[29]=t("td",null,"无",-1)),d[30]||(d[30]=t("td",null,"创建普通数据上下文档对象，该对象功能类似于 EFCore",-1))]),d[41]||(d[41]=t("tr",null,[t("td",null,"SetDbContextOptions"),t("td",null,"-"),t("td",null,"Action"),t("td",null,"设置此 IFreeSql 下 DbContext 选项设置")],-1)),t("tr",null,[t("td",null,[l(r,{to:"/guide/repository.html"},{default:n(()=>d[31]||(d[31]=[e("GetRepository")])),_:1}),d[32]||(d[32]=e("<TEntity, TKey>"))]),d[33]||(d[33]=t("td",null,"BaseRepository",-1)),d[34]||(d[34]=t("td",null,"无",-1)),d[35]||(d[35]=t("td",null,"返回默认仓库功能实现",-1))]),t("tr",null,[t("td",null,[l(r,{to:"/guide/unit-of-work.html"},{default:n(()=>d[36]||(d[36]=[e("CreateUnitOfWork")])),_:1})]),d[37]||(d[37]=t("td",null,"IUnitOfWork",-1)),d[38]||(d[38]=t("td",null,"无",-1)),d[39]||(d[39]=t("td",null,"创建基于仓储功能的工作单元，务必使用 using 包含使用",-1))])])]),d[44]||(d[44]=i('<hr><h2 id="baserepository-tentity-tkey" tabindex="-1"><a class="header-anchor" href="#baserepository-tentity-tkey"><span>BaseRepository&lt;TEntity, TKey&gt;</span></a></h2><table><thead><tr><th>属性</th><th>返回值</th><th>说明</th></tr></thead><tbody><tr><td>EntityType</td><td>Type</td><td>仓储正在操作的实体类型，注意它不一定是 TEntity</td></tr><tr><td>UnitOfWork</td><td>IUnitOfWork</td><td>正在使用的工作单元</td></tr><tr><td>Orm</td><td>IFreeSql</td><td>正在使用的 Orm</td></tr><tr><td>DbContextOptions</td><td>DbContextOptions</td><td>正在使用的 DbContext 设置，修改设置不影响其他</td></tr><tr><td>DataFilter</td><td>IDataFilter&lt;TEntity&gt;</td><td>仓储过滤器，本对象内生效</td></tr><tr><td>Select</td><td>ISelect&lt;TEntity&gt;</td><td>准备查询数据</td></tr></tbody></table><table><thead><tr><th>方法</th><th>返回值</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>AsType</td><td>void</td><td>Type</td><td>改变仓储正在操作的实体类型</td></tr><tr><td>Get</td><td>TEntity</td><td>TKey</td><td>根据主键，查询数据</td></tr><tr><td>Find</td><td>TEntity</td><td>TKey</td><td>根据主键，查询数据</td></tr><tr><td>Delete</td><td>int</td><td>TKey</td><td>根据主键删除数据</td></tr><tr><td>Delete</td><td>int</td><td>Lambda</td><td>根据 lambda 条件删除数据</td></tr><tr><td>Delete</td><td>int</td><td>TEntity</td><td>删除数据</td></tr><tr><td>Delete</td><td>int</td><td>IEnumerable&lt;TEntity&gt;</td><td>批量删除数据</td></tr><tr><td>Insert</td><td>-</td><td>TEntity</td><td>插入数据，若实体有自增列，插入后的自增值会填充到实体中</td></tr><tr><td>Insert</td><td>-</td><td>IEnumerable&lt;TEntity&gt;</td><td>批量插入数据</td></tr><tr><td>Update</td><td>-</td><td>TEntity</td><td>更新数据</td></tr><tr><td>Update</td><td>-</td><td>IEnumerable&lt;TEntity&gt;</td><td>批量更新数据</td></tr><tr><td>InsertOrUpdate</td><td>-</td><td>TEntity</td><td>插入或更新数据</td></tr><tr><td>FlushState</td><td>-</td><td>无</td><td>清除状态管理数据</td></tr><tr><td>Attach</td><td>-</td><td>TEntity</td><td>附加实体到状态管理，可用于不查询就更新或删除</td></tr><tr><td>Attach</td><td>-</td><td>IEnumerable&lt;TEntity&gt;</td><td>批量附加实体到状态管理</td></tr><tr><td>AttachOnlyPrimary</td><td>-</td><td>TEntity</td><td>只附加实体的主键数据到状态管理</td></tr><tr><td>SaveMany</td><td>-</td><td>TEntity, string</td><td>保存实体的指定 ManyToMany/OneToMany 导航属性（完整对比）</td></tr><tr><td>BeginEdit</td><td>-</td><td>List&lt;TEntity&gt;</td><td>准备编辑一个 List 实体</td></tr><tr><td>EndEdit</td><td>int</td><td>无</td><td>完成编辑数据，进行保存动作</td></tr></tbody></table><blockquote><p>状态管理，可实现 Update 只更新变化的字段（不更新所有字段），灵活使用 Attach 和 Update 用起来非常舒服。</p></blockquote><p>DbContext 与 BaseRepository 功能大致类似。</p><p>DbContext 自身 = 完整事务，BaseRepository 不一定有事务（可通过设置其 UnitOfWork 属性）。</p><hr><h2 id="icodefirst" tabindex="-1"><a class="header-anchor" href="#icodefirst"><span>ICodeFirst</span></a></h2><table><thead><tr><th>属性</th><th>返回值</th><th>说明</th></tr></thead><tbody><tr><td>IsAutoSyncStructure</td><td>bool</td><td>【开发环境必备】自动同步实体结构到数据库，程序运行中检查实体表是否存在，然后创建或修改</td></tr><tr><td>IsSyncStructureToLower</td><td>bool</td><td>是否转小写映射，适合 pgsql</td></tr><tr><td>IsSyncStructureToUpper</td><td>bool</td><td>是否转大写映射，适合 oracle、dameng</td></tr><tr><td>IsNoneCommandParameter</td><td>bool</td><td>是否不使用命令参数化执行，针对 Insert/Update</td></tr><tr><td>IsGenerateCommandParameterWithLambda</td><td>bool</td><td>是否生成命令参数化执行，针对 where lambda 表达式解析</td></tr><tr><td>IsLazyLoading</td><td>bool</td><td>是否开启延时加载导航属性对象，导航属性需要声明 virtual</td></tr><tr><td>IsConfigEntityFromDbFirst</td><td>bool</td><td>将数据库的主键、自增、索引设置导入，适合 DbFirst 模式，无须在实体类型上设置 [Column(IsPrimary)]。此功能目前可用于 mysql/sqlserver/postgresql/oracle，此功能会影响 IFreeSql 首次访问的速度。若使用 CodeFirst 创建索引后，又直接在数据库上建了索引，若无本功能下一次 CodeFirst 迁移时数据库上创建的索引将被删除</td></tr></tbody></table><table><thead><tr><th>方法</th><th>返回值</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>GetComparisonDDLStatements&lt;TEntity&gt;</td><td>string</td><td>无</td><td>将实体类型与数据库对比，返回 DDL 语句</td></tr><tr><td>GetComparisonDDLStatements</td><td>string</td><td>Type[]</td><td>将多个实体类型与数据库对比，返回 DDL 语句</td></tr><tr><td>GetComparisonDDLStatements</td><td>string</td><td>Type, string</td><td>将实体类型与数据库对比，返回 DDL 语句(指定表名)</td></tr><tr><td>SyncStructure&lt;TEntity&gt;</td><td>bool</td><td>无</td><td>同步实体类型到数据库</td></tr><tr><td>SyncStructure</td><td>bool</td><td>Type[]</td><td>同步实体类型集合到数据库</td></tr><tr><td>SyncStructure</td><td>bool</td><td>Type, string</td><td>同步实体类型到数据库（指定表名）</td></tr><tr><td>ConfigEntity</td><td>ICodeFirst</td><td>Action&lt;TableFluent&lt;T&gt;&gt;</td><td>FluentAPI 配置实体的特性</td></tr><tr><td>GetTableByEntity</td><td>TableInfo</td><td>Type</td><td>获取类型在 ORM 内部的元数据</td></tr></tbody></table><hr><h2 id="idbfirst" tabindex="-1"><a class="header-anchor" href="#idbfirst"><span>IDbFirst</span></a></h2><table><thead><tr><th>方法</th><th>返回值</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>GetDatabases</td><td>List&lt;string&gt;</td><td>无</td><td>获取所有数据库</td></tr><tr><td>GetTablesByDatabase</td><td>List&lt;DbTableInfo&gt;</td><td>string[]</td><td>获取指定数据库的表信息，包括表、列详情、主键、唯一键、索引、外键、备注</td></tr><tr><td>GetTableByName</td><td>DbTableInfo</td><td>string</td><td>获取指定单表信息，包括列详情、主键、唯一键、索引、备注</td></tr><tr><td>ExistsTable</td><td>bool</td><td>string</td><td>判断表名是否存在</td></tr></tbody></table><hr><h2 id="iselect" tabindex="-1"><a class="header-anchor" href="#iselect"><span>ISelect</span></a></h2><table><thead><tr><th>方法</th><th>返回值</th><th>参数</th><th>描述</th><th></th></tr></thead><tbody><tr><td>ToSql</td><td>string</td><td></td><td>返回即将执行的 SQL 语句</td><td></td></tr><tr><td>ToList</td><td>List&lt;T1&gt;</td><td></td><td>执行 SQL 查询，返回 T1 实体所有字段的记录，若存在导航属性则一起查询返回，记录不存在时返回 Count 为 0 的列表</td><td></td></tr><tr><td>ToList&lt;T&gt;</td><td>List&lt;T&gt;</td><td>Lambda</td><td>执行 SQL 查询，返回指定字段的记录，记录不存在时返回 Count 为 0 的列表</td><td></td></tr><tr><td>ToList&lt;T&gt;</td><td>List&lt;T&gt;</td><td>string field</td><td>执行 SQL 查询，返回 field 指定字段的记录，并以元组或基础类型(int,string,long)接收，记录不存在时返回 Count 为 0 的列表</td><td></td></tr><tr><td>ToOne</td><td>T1</td><td></td><td>执行 SQL 查询，返回 T1 实体所有字段的第一条记录，记录不存在时返回 null</td><td></td></tr><tr><td>Any</td><td>bool</td><td></td><td>执行 SQL 查询，是否有记录</td><td></td></tr><tr><td>Sum</td><td>T</td><td>Lambda</td><td>指定一个列求和</td><td></td></tr><tr><td>Min</td><td>T</td><td>Lambda</td><td>指定一个列求最小值</td><td></td></tr><tr><td>Max</td><td>T</td><td>Lambda</td><td>指定一个列求最大值</td><td></td></tr><tr><td>Avg</td><td>T</td><td>Lambda</td><td>指定一个列求平均值</td><td></td></tr><tr><td>【分页】</td><td></td><td></td><td></td><td></td></tr><tr><td>Count</td><td>long</td><td></td><td>查询的记录数量</td><td></td></tr><tr><td>Count</td><td>&lt;this&gt;</td><td>out long</td><td>查询的记录数量，以参数 out 形式返回</td><td></td></tr><tr><td>Skip</td><td>&lt;this&gt;</td><td>int offset</td><td>查询向后偏移行数</td><td></td></tr><tr><td>Offset</td><td>&lt;this&gt;</td><td>int offset</td><td>查询向后偏移行数</td><td></td></tr><tr><td>Limit</td><td>&lt;this&gt;</td><td>int limit</td><td>查询多少条数据</td><td></td></tr><tr><td>Take</td><td>&lt;this&gt;</td><td>int limit</td><td>查询多少条数据</td><td></td></tr><tr><td>Page</td><td>&lt;this&gt;</td><td>int pageIndex, int pageSize</td><td>分页</td><td></td></tr><tr><td>【条件】</td><td></td><td></td><td></td><td></td></tr><tr><td>Where</td><td>&lt;this&gt;</td><td>Lambda</td><td>支持多表查询表达式，多次使用相当于 AND</td><td></td></tr><tr><td>WhereIf</td><td>&lt;this&gt;</td><td>bool, Lambda</td><td>支持多表查询表达式</td><td></td></tr><tr><td>Where</td><td>&lt;this&gt;</td><td>string, parms</td><td>原生 sql 语法条件，Where(&quot;id = ?id&quot;, new { id = 1 })</td><td></td></tr><tr><td>WhereIf</td><td>&lt;this&gt;</td><td>bool, string, parms</td><td>原生 sql 语法条件，WhereIf(true, &quot;id = ?id&quot;, new { id = 1 })</td><td></td></tr><tr><td>WhereCascade</td><td>&lt;this&gt;</td><td>Lambda</td><td>实现多表查询时，向每个表中附加条件</td><td></td></tr><tr><td>【分组】</td><td></td><td></td><td></td><td></td></tr><tr><td>GroupBy</td><td>&lt;this&gt;</td><td>Lambda</td><td>按选择的列分组，GroupBy(a =&gt; a.Name)、GroupBy(a =&gt; new{a.Name,a.Time})</td><td></td></tr><tr><td>GroupBy</td><td>&lt;this&gt;</td><td>string, parms</td><td>按原生 sql 语法分组，GroupBy(&quot;concat(name, ?cc)&quot;, new { cc = 1 })</td><td></td></tr><tr><td>Having</td><td>&lt;this&gt;</td><td>string, parms</td><td>按原生 sql 语法聚合条件过滤，Having(&quot;count(name) = ?cc&quot;, new { cc = 1 })</td><td></td></tr><tr><td>Distinct</td><td>&lt;this&gt;</td><td></td><td>.Distinct().ToList(x =&gt; x.GroupName) 是对指定字段</td><td></td></tr><tr><td>【排序】</td><td></td><td></td><td></td><td></td></tr><tr><td>OrderBy</td><td>&lt;this&gt;</td><td>Lambda</td><td>按列排序，OrderBy(a =&gt; a.Time)，可多次使用</td><td></td></tr><tr><td>OrderByDescending</td><td>&lt;this&gt;</td><td>Lambda</td><td>按列倒向排序，OrderByDescending(a =&gt; a.Time)</td><td></td></tr><tr><td>OrderBy</td><td>&lt;this&gt;</td><td>string, parms</td><td>按原生 sql 语法排序，OrderBy(&quot;count(name) + ?cc&quot;, new { cc = 1 })</td><td></td></tr><tr><td>OrderByPropertyName</td><td>string, bool</td><td>按属性名字符串排序（支持导航属性）</td><td></td><td></td></tr><tr><td>【联表】</td><td></td><td></td><td></td><td></td></tr><tr><td>LeftJoin</td><td>&lt;this&gt;</td><td>Lambda</td><td>左联查询，可使用导航属性，或指定关联的实体类型</td><td></td></tr><tr><td>InnerJoin</td><td>&lt;this&gt;</td><td>Lambda</td><td>联接查询，可使用导航属性，或指定关联的实体类型</td><td></td></tr><tr><td>RightJoin</td><td>&lt;this&gt;</td><td>Lambda</td><td>右联查询，可使用导航属性，或指定关联的实体类型</td><td></td></tr><tr><td>LeftJoin</td><td>&lt;this&gt;</td><td>string, parms</td><td>左联查询，使用原生 sql 语法，LeftJoin(&quot;type b on b.id = a.id and b.clicks &gt; ?clicks&quot;, new { clicks = 1 })</td><td></td></tr><tr><td>InnerJoin</td><td>&lt;this&gt;</td><td>string, parms</td><td>联接查询，使用原生 sql 语法，InnerJoin(&quot;type b on b.id = a.id and b.clicks &gt; ?clicks&quot;, new { clicks = 1 })</td><td></td></tr><tr><td>RightJoin</td><td>&lt;this&gt;</td><td>string, parms</td><td>右联查询，使用原生 sql 语法，RightJoin(&quot;type b on b.id = a.id and b.clicks &gt; ?clicks&quot;, new { clicks = 1 })</td><td></td></tr><tr><td>From</td><td>&lt;this&gt;</td><td>Lambda</td><td>多表查询，3 个表以上使用非常方便，目前设计最大支持 10 个表</td><td></td></tr><tr><td>【其他】</td><td></td><td></td><td></td><td></td></tr><tr><td>As</td><td>&lt;this&gt;</td><td>string alias = &quot;a&quot;</td><td>指定别名</td><td></td></tr><tr><td>Master</td><td>&lt;this&gt;</td><td></td><td>指定从主库查询（默认查询从库）</td><td></td></tr><tr><td>CommandTimeout</td><td>&lt;this&gt;</td><td>int</td><td>命令超时设置(秒)</td><td></td></tr><tr><td>WithTransaction</td><td>&lt;this&gt;</td><td>DbTransaction</td><td>设置事务对象</td><td></td></tr><tr><td>WithConnection</td><td>&lt;this&gt;</td><td>DbConnection</td><td>设置连接对象</td><td></td></tr><tr><td>WithLock</td><td>&lt;this&gt;</td><td>Enum</td><td>SqlServer NoLock 等特有的设置</td><td></td></tr><tr><td>ForUpdate</td><td>&lt;this&gt;</td><td>bool</td><td>排他更新锁，对不同的数据库已作适配，详细说明见注释</td><td></td></tr><tr><td>AsQueryable</td><td>IQueryable</td><td></td><td>将 ISelect 转换为 IQueryable，此方法主要用于扩展，比如：abp IRepository GetAll() 接口方法需要返回 IQueryable 对象。注意：IQueryable 方法污染较为严重，请尽量避免此转换</td><td></td></tr><tr><td>ToTreeList()</td><td>List&lt;TEntity&gt;</td><td>无</td><td>将父子关系的数据以 TreeList 的形式返回</td><td></td></tr><tr><td>AsTreeCte()</td><td>ISelect</td><td>(up, pathSelector, level)</td><td>递归查询父子关系表</td><td></td></tr></tbody></table><hr><h2 id="iinsert" tabindex="-1"><a class="header-anchor" href="#iinsert"><span>IInsert</span></a></h2><table><thead><tr><th>方法</th><th>返回值</th><th>参数</th><th>描述</th></tr></thead><tbody><tr><td>AppendData</td><td>&lt;this&gt;</td><td>T1 | IEnumerable&lt;T1&gt;</td><td>追加准备插入的实体</td></tr><tr><td>InsertIdentity</td><td>&lt;this&gt;</td><td>无</td><td>指明插入自增列</td></tr><tr><td>InsertColumns</td><td>&lt;this&gt;</td><td>Lambda</td><td>只插入的列</td></tr><tr><td>IgnoreColumns</td><td>&lt;this&gt;</td><td>Lambda</td><td>忽略的列</td></tr><tr><td>CommandTimeout</td><td>&lt;this&gt;</td><td>int</td><td>命令超时设置(秒)</td></tr><tr><td>WithTransaction</td><td>&lt;this&gt;</td><td>DbTransaction</td><td>设置事务对象</td></tr><tr><td>WithConnection</td><td>&lt;this&gt;</td><td>DbConnection</td><td>设置连接对象</td></tr><tr><td>ToSql</td><td>string</td><td></td><td>返回即将执行的 SQL 语句</td></tr><tr><td>OnDuplicateKeyUpdate</td><td>OnDuplicateKeyUpdate&lt;T1&gt;</td><td>无</td><td>MySql 特有的功能，On Duplicate Key Update</td></tr><tr><td>OnConflictDoUpdate</td><td>OnConflictDoUpdate&lt;T1&gt;</td><td>无</td><td>PostgreSQL 特有的功能，On Conflict Do Update</td></tr><tr><td>ExecuteAffrows</td><td>long</td><td></td><td>执行 SQL 语句，返回影响的行数</td></tr><tr><td>ExecuteIdentity</td><td>long</td><td></td><td>执行 SQL 语句，返回自增值</td></tr><tr><td>ExecuteInserted</td><td>List&lt;T1&gt;</td><td></td><td>执行 SQL 语句，返回插入后的记录</td></tr><tr><td>ExecuteSqlBulkCopy</td><td>void</td><td></td><td>SqlServer 特有的功能，执行 SqlBulkCopy 批量插入的封装</td></tr><tr><td>ExecutePgCopy</td><td>void</td><td></td><td>PostgreSQL 特有的功能，执行 Copy 批量导入数据</td></tr></tbody></table><hr><h2 id="iupdate" tabindex="-1"><a class="header-anchor" href="#iupdate"><span>IUpdate</span></a></h2><table><thead><tr><th>方法</th><th>返回值</th><th>参数</th><th>描述</th></tr></thead><tbody><tr><td>SetSource</td><td>&lt;this&gt;</td><td>T1 | IEnumerable&lt;T1&gt;</td><td>更新数据，设置更新的实体</td></tr><tr><td>IgnoreColumns</td><td>&lt;this&gt;</td><td>Lambda</td><td>忽略的列</td></tr><tr><td>Set</td><td>&lt;this&gt;</td><td>Lambda, value</td><td>设置列的新值，Set(a =&gt; a.Name, &quot;newvalue&quot;)</td></tr><tr><td>Set</td><td>&lt;this&gt;</td><td>Lambda</td><td>设置列的的新值为基础上增加，Set(a =&gt; a.Clicks + 1)，相当于 clicks=clicks+1</td></tr><tr><td>SetDto</td><td>&lt;this&gt;</td><td>object</td><td>根据 dto 更新的方法</td></tr><tr><td>SetRaw</td><td>&lt;this&gt;</td><td>string, parms</td><td>设置值，自定义 SQL 语法，SetRaw(&quot;title = ?title&quot;, new { title = &quot;newtitle&quot; })</td></tr><tr><td>Where</td><td>&lt;this&gt;</td><td>Lambda</td><td>表达式条件，仅支持实体基础成员（不包含导航对象）</td></tr><tr><td>Where</td><td>&lt;this&gt;</td><td>string, parms</td><td>原生 sql 语法条件，Where(&quot;id = ?id&quot;, new { id = 1 })</td></tr><tr><td>Where</td><td>&lt;this&gt;</td><td>T1 | IEnumerable&lt;T1&gt;</td><td>传入实体或集合，将其主键作为条件</td></tr><tr><td>WhereExists</td><td>&lt;this&gt;</td><td>ISelect</td><td>子查询是否存在</td></tr><tr><td>CommandTimeout</td><td>&lt;this&gt;</td><td>int</td><td>命令超时设置(秒)</td></tr><tr><td>WithTransaction</td><td>&lt;this&gt;</td><td>DbTransaction</td><td>设置事务对象</td></tr><tr><td>WithConnection</td><td>&lt;this&gt;</td><td>DbConnection</td><td>设置连接对象</td></tr><tr><td>ToSql</td><td>string</td><td></td><td>返回即将执行的 SQL 语句</td></tr><tr><td>ExecuteAffrows</td><td>long</td><td></td><td>执行 SQL 语句，返回影响的行数</td></tr><tr><td>ExecuteUpdated</td><td>List&lt;T1&gt;</td><td></td><td>执行 SQL 语句，返回更新后的记录</td></tr><tr><td>Join</td><td>IUpdateJoin</td><td></td><td>联表更新</td></tr></tbody></table><hr><h2 id="idelete" tabindex="-1"><a class="header-anchor" href="#idelete"><span>IDelete</span></a></h2><p>| 方法 | 返回值 | 参数 | 描述 | | --------------- | ---------- | ----------------------- | ---------------------------------------------------- | --- | | Where | &lt;this&gt; | Lambda | 表达式条件，仅支持实体基础成员（不包含导航对象） | | Where | &lt;this&gt; | string, parms | 原生 sql 语法条件，Where(&quot;id = ?id&quot;, new { id = 1 }) | | Where | &lt;this&gt; | T1 | IEnumerable&lt;T1&gt; | 传入实体或集合，将其主键作为条件 | | WhereExists | &lt;this&gt; | ISelect | 子查询是否存在 | | CommandTimeout | &lt;this&gt; | int | 命令超时设置(秒) | | WithTransaction | &lt;this&gt; | DbTransaction | 设置事务对象 | | WithConnection | &lt;this&gt; | DbConnection | 设置连接对象 | | ToSql | string | | 返回即将执行的 SQL 语句 | | ExecuteAffrows | long | | 执行 SQL 语句，返回影响的行数 | | ExecuteDeleted | List&lt;T1&gt; | | 执行 SQL 语句，返回被删除的记录 | \\ |</p>',26))])}const y=o(h,[["render",g],["__file","api.html.vue"]]),T=JSON.parse('{"path":"/reference/api.html","title":"API 文档","lang":"zh-CN","frontmatter":{"description":"API 文档 http://124.221.134.143:8082/api/FreeSql.html FreeSqlBuilder IFreeSql BaseRepository<TEntity, TKey> 状态管理，可实现 Update 只更新变化的字段（不更新所有字段），灵活使用 Attach 和 Update 用起来非常舒服。 DbConte...","head":[["meta",{"property":"og:url","content":"https://freesql.net/reference/api.html"}],["meta",{"property":"og:site_name","content":"FreeSql"}],["meta",{"property":"og:title","content":"API 文档"}],["meta",{"property":"og:description","content":"API 文档 http://124.221.134.143:8082/api/FreeSql.html FreeSqlBuilder IFreeSql BaseRepository<TEntity, TKey> 状态管理，可实现 Update 只更新变化的字段（不更新所有字段），灵活使用 Attach 和 Update 用起来非常舒服。 DbConte..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-18T12:39:52.000Z"}],["meta",{"property":"article:modified_time","content":"2024-12-18T12:39:52.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"API 文档\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-18T12:39:52.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql RSS Feed"}]]},"headers":[{"level":2,"title":"FreeSqlBuilder","slug":"freesqlbuilder","link":"#freesqlbuilder","children":[]},{"level":2,"title":"IFreeSql","slug":"ifreesql","link":"#ifreesql","children":[]},{"level":2,"title":"BaseRepository<TEntity, TKey>","slug":"baserepository-tentity-tkey","link":"#baserepository-tentity-tkey","children":[]},{"level":2,"title":"ICodeFirst","slug":"icodefirst","link":"#icodefirst","children":[]},{"level":2,"title":"IDbFirst","slug":"idbfirst","link":"#idbfirst","children":[]},{"level":2,"title":"ISelect","slug":"iselect","link":"#iselect","children":[]},{"level":2,"title":"IInsert","slug":"iinsert","link":"#iinsert","children":[]},{"level":2,"title":"IUpdate","slug":"iupdate","link":"#iupdate","children":[]},{"level":2,"title":"IDelete","slug":"idelete","link":"#idelete","children":[]}],"git":{"createdTime":1612454598000,"updatedTime":1734525592000,"contributors":[{"name":"luoyunchong","username":"luoyunchong","email":"luoyunchong@foxmail.com","commits":4,"url":"https://github.com/luoyunchong"},{"name":"igeekfan","username":"igeekfan","email":"luoyunchong@foxmail.com","commits":4,"url":"https://github.com/igeekfan"},{"name":"2881099","username":"2881099","email":"2881099@users.noreply.github.com","commits":3,"url":"https://github.com/2881099"},{"name":"igeekfan","username":"igeekfan","email":"igeekfan@foxmail.com","commits":1,"url":"https://github.com/igeekfan"}]},"readingTime":{"minutes":9.82,"words":2946},"filePathRelative":"reference/api.md","localizedDate":"2021年2月4日","autoDesc":true}');export{y as comp,T as data};
