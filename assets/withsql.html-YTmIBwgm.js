const t=JSON.parse('{"key":"v-6879b57d","path":"/guide/withsql.html","title":"WithSql","lang":"zh-CN","frontmatter":{"description":"WithSql 自定义 SQL 定义实体类 不同的查询方式。 返回DataTable; 返回List 即List元组; 返回List 且能支持分页; 返回List且能支持分页; 1.返回 DataTable 2.返回 DataTable 3.返回List 即List 元组 4.返回List 5.返回List 且能支持分页 6.返回List且能支持分页 ...","head":[["meta",{"property":"og:url","content":"https://freesql.net/guide/withsql.html"}],["meta",{"property":"og:site_name","content":"FreeSql 官方文档"}],["meta",{"property":"og:title","content":"WithSql"}],["meta",{"property":"og:description","content":"WithSql 自定义 SQL 定义实体类 不同的查询方式。 返回DataTable; 返回List 即List元组; 返回List 且能支持分页; 返回List且能支持分页; 1.返回 DataTable 2.返回 DataTable 3.返回List 即List 元组 4.返回List 5.返回List 且能支持分页 6.返回List且能支持分页 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-10-11T11:22:27.000Z"}],["meta",{"property":"article:author","content":"nicye"}],["meta",{"property":"article:modified_time","content":"2023-10-11T11:22:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"WithSql\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-10-11T11:22:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql 官方文档 Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql 官方文档 JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql 官方文档 RSS Feed"}]]},"headers":[{"level":2,"title":"WithSql 自定义 SQL","slug":"withsql-自定义-sql","link":"#withsql-自定义-sql","children":[{"level":3,"title":"1.返回 DataTable","slug":"_1-返回-datatable","link":"#_1-返回-datatable","children":[]},{"level":3,"title":"2.返回 DataTable","slug":"_2-返回-datatable","link":"#_2-返回-datatable","children":[]},{"level":3,"title":"3.返回List<Tuplue> 即List<(string,string)> 元组","slug":"_3-返回list-tuplue-即list-string-string-元组","link":"#_3-返回list-tuplue-即list-string-string-元组","children":[]},{"level":3,"title":"4.返回List<object>","slug":"_4-返回list-object","link":"#_4-返回list-object","children":[]},{"level":3,"title":"5.返回List<object> 且能支持分页","slug":"_5-返回list-object-且能支持分页","link":"#_5-返回list-object-且能支持分页","children":[]},{"level":3,"title":"6.返回List<TestClassDto>且能支持分页","slug":"_6-返回list-testclassdto-且能支持分页","link":"#_6-返回list-testclassdto-且能支持分页","children":[]}]},{"level":2,"title":"通过 WithSql + ToSQL 实现 Union ALL 查询方法","slug":"通过-withsql-tosql-实现-union-all-查询方法","link":"#通过-withsql-tosql-实现-union-all-查询方法","children":[{"level":3,"title":"1、二次 ISelect 查询：WithSql 使用多次，等于 UNION ALL 查询","slug":"_1、二次-iselect-查询-withsql-使用多次-等于-union-all-查询","link":"#_1、二次-iselect-查询-withsql-使用多次-等于-union-all-查询","children":[]},{"level":3,"title":"2、跨分表查询：AsTable 相同实体多次操作，等于 Union ALL 查询","slug":"_2、跨分表查询-astable-相同实体多次操作-等于-union-all-查询","link":"#_2、跨分表查询-astable-相同实体多次操作-等于-union-all-查询","children":[]},{"level":3,"title":"3、利用 ToSql 拼接新的 SQL，使用 IAdo 执行","slug":"_3、利用-tosql-拼接新的-sql-使用-iado-执行","link":"#_3、利用-tosql-拼接新的-sql-使用-iado-执行","children":[]}]},{"level":2,"title":"分页问题","slug":"分页问题","link":"#分页问题","children":[{"level":3,"title":"解决方案","slug":"解决方案","link":"#解决方案","children":[]}]}],"git":{"createdTime":1623862569000,"updatedTime":1697023347000,"contributors":[{"name":"2881099","email":"2881099@users.noreply.github.com","commits":2},{"name":"igeekfan","email":"luoyunchong@foxmail.com","commits":2},{"name":"luoyunchong","email":"luoyunchong@foxmail.com","commits":2},{"name":"luoyunchong","email":"luoyunchong@foxmai.com","commits":1}]},"readingTime":{"minutes":3.37,"words":1011},"filePathRelative":"guide/withsql.md","localizedDate":"2021年6月16日","autoDesc":true}');export{t as data};
