const e=JSON.parse('{"key":"v-5d526c16","path":"/reference/change-log.html","title":"更新日志","lang":"zh-CN","frontmatter":{"description":"大约每月一次版本号，暂时以修复 bug 为主 v3.5.102-v3.5.105 增加 ISelect.Join 与 InnerJoin 方式行为一致；; 增加 ToChunkAsync 异步 Api；#1952; 增加 SqlExt.AggregateCount/AggregateSum 等方法，区分 SqlExt.Count/SqlExt.Sum ...","head":[["meta",{"property":"og:url","content":"https://freesql.net/reference/change-log.html"}],["meta",{"property":"og:site_name","content":"FreeSql 官方文档"}],["meta",{"property":"og:title","content":"更新日志"}],["meta",{"property":"og:description","content":"大约每月一次版本号，暂时以修复 bug 为主 v3.5.102-v3.5.105 增加 ISelect.Join 与 InnerJoin 方式行为一致；; 增加 ToChunkAsync 异步 Api；#1952; 增加 SqlExt.AggregateCount/AggregateSum 等方法，区分 SqlExt.Count/SqlExt.Sum ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-02-10T13:09:36.000Z"}],["meta",{"property":"article:author","content":"nicye"}],["meta",{"property":"article:modified_time","content":"2025-02-10T13:09:36.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"更新日志\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-02-10T13:09:36.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"nicye\\"}]}"],["link",{"rel":"alternate","type":"application/atom+xml","href":"https://freesql.net/atom.xml","title":"FreeSql 官方文档 Atom Feed"}],["link",{"rel":"alternate","type":"application/json","href":"https://freesql.net/feed.json","title":"FreeSql 官方文档 JSON Feed"}],["link",{"rel":"alternate","type":"application/rss+xml","href":"https://freesql.net/rss.xml","title":"FreeSql 官方文档 RSS Feed"}]]},"headers":[{"level":2,"title":"v3.5.102-v3.5.105","slug":"v3-5-102-v3-5-105","link":"#v3-5-102-v3-5-105","children":[]},{"level":2,"title":"v3.5.101","slug":"v3-5-101","link":"#v3-5-101","children":[]},{"level":2,"title":"v3.2.833","slug":"v3-2-833","link":"#v3-2-833","children":[]},{"level":2,"title":"v3.2.832","slug":"v3-2-832","link":"#v3-2-832","children":[]},{"level":2,"title":"v3.2.830","slug":"v3-2-830","link":"#v3-2-830","children":[]},{"level":2,"title":"v3.2.825","slug":"v3-2-825","link":"#v3-2-825","children":[]},{"level":2,"title":"v3.2.822","slug":"v3-2-822","link":"#v3-2-822","children":[]},{"level":2,"title":"v3.2.821","slug":"v3-2-821","link":"#v3-2-821","children":[]},{"level":2,"title":"v3.2.820","slug":"v3-2-820","link":"#v3-2-820","children":[]},{"level":2,"title":"v3.2.815","slug":"v3-2-815","link":"#v3-2-815","children":[]},{"level":2,"title":"v3.2.812","slug":"v3-2-812","link":"#v3-2-812","children":[]},{"level":2,"title":"v3.2.810","slug":"v3-2-810","link":"#v3-2-810","children":[]},{"level":2,"title":"v3.2.808","slug":"v3-2-808","link":"#v3-2-808","children":[]},{"level":2,"title":"v3.2.805","slug":"v3-2-805","link":"#v3-2-805","children":[]},{"level":2,"title":"v3.2.802","slug":"v3-2-802","link":"#v3-2-802","children":[]},{"level":2,"title":"v3.2.801","slug":"v3-2-801","link":"#v3-2-801","children":[]},{"level":2,"title":"v3.2.700 (oracle/达梦子查询有 BUG)","slug":"v3-2-700-oracle-达梦子查询有-bug","link":"#v3-2-700-oracle-达梦子查询有-bug","children":[]},{"level":2,"title":"v3.2.698","slug":"v3-2-698","link":"#v3-2-698","children":[]},{"level":2,"title":"v3.2.697","slug":"v3-2-697","link":"#v3-2-697","children":[]},{"level":2,"title":"v3.2.696","slug":"v3-2-696","link":"#v3-2-696","children":[]},{"level":2,"title":"v3.2.695","slug":"v3-2-695","link":"#v3-2-695","children":[]},{"level":2,"title":"v3.2.693","slug":"v3-2-693","link":"#v3-2-693","children":[]},{"level":2,"title":"v3.2.692","slug":"v3-2-692","link":"#v3-2-692","children":[]},{"level":2,"title":"v3.2.691","slug":"v3-2-691","link":"#v3-2-691","children":[]},{"level":2,"title":"v3.2.690","slug":"v3-2-690","link":"#v3-2-690","children":[]},{"level":2,"title":"v3.2.688","slug":"v3-2-688","link":"#v3-2-688","children":[]},{"level":2,"title":"v3.2.687","slug":"v3-2-687","link":"#v3-2-687","children":[]},{"level":2,"title":"v3.2.686","slug":"v3-2-686","link":"#v3-2-686","children":[]},{"level":2,"title":"v3.2.685","slug":"v3-2-685","link":"#v3-2-685","children":[]},{"level":2,"title":"v3.2.684","slug":"v3-2-684","link":"#v3-2-684","children":[]},{"level":2,"title":"v3.2.683","slug":"v3-2-683","link":"#v3-2-683","children":[]},{"level":2,"title":"v3.2.682","slug":"v3-2-682","link":"#v3-2-682","children":[]},{"level":2,"title":"v3.2.681","slug":"v3-2-681","link":"#v3-2-681","children":[]},{"level":2,"title":"v3.2.680","slug":"v3-2-680","link":"#v3-2-680","children":[]},{"level":2,"title":"v3.2.669","slug":"v3-2-669","link":"#v3-2-669","children":[]},{"level":2,"title":"v3.2.666","slug":"v3-2-666","link":"#v3-2-666","children":[]},{"level":2,"title":"v3.2.665","slug":"v3-2-665","link":"#v3-2-665","children":[]},{"level":2,"title":"v3.2.664","slug":"v3-2-664","link":"#v3-2-664","children":[]},{"level":2,"title":"v3.2.662","slug":"v3-2-662","link":"#v3-2-662","children":[]},{"level":2,"title":"v3.2.661","slug":"v3-2-661","link":"#v3-2-661","children":[]},{"level":2,"title":"v3.2.651","slug":"v3-2-651","link":"#v3-2-651","children":[]},{"level":2,"title":"v3.2.100 - v3.2.640","slug":"v3-2-100-v3-2-640","link":"#v3-2-100-v3-2-640","children":[]},{"level":2,"title":"v3.0.100（2021/12/17）","slug":"v3-0-100-2021-12-17","link":"#v3-0-100-2021-12-17","children":[]}],"git":{"createdTime":1612454598000,"updatedTime":1739192976000,"contributors":[{"name":"2881099","email":"2881099@users.noreply.github.com","commits":58},{"name":"igeekfan","email":"luoyunchong@foxmail.com","commits":12},{"name":"IGeekFan","email":"luoyunchong@foxmail.com","commits":5},{"name":"luoyunchong","email":"luoyunchong@foxmail.com","commits":4},{"name":"igeekfan","email":"igeekfan@foxmail.com","commits":2},{"name":"luoyunchong","email":"luoyunchong@foxmai.com","commits":1}]},"readingTime":{"minutes":19.06,"words":5718},"filePathRelative":"reference/change-log.md","localizedDate":"2021年2月4日","autoDesc":true}');export{e as data};
