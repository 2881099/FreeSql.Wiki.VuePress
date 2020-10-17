const dayjs = require('dayjs')

module.exports = {
    base: '/',
    title: 'FreeSql',
    description: 'freesql.net',
    theme: '@vuepress/theme-default',
    themeConfig: {
        logo: '/logo.png',
        navbar: true,
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide' },
            { text: 'NuGet', link: 'https://www.nuget.org/packages?q=freesql' },
            { text: 'Github', link: 'https://github.com/dotnetcore/FreeSql' },
        ],
        //sidebar: 'auto',
        sidebar: [
            ['/guide', '指南'],
            {
                title: '基础文档',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/getting-started', '入门'],
                    ['/install', '安装'],
                    ['/insert', '添加'],
                    ['/delete', '删除'],
                    ['/update', '修改'],
                    ['/insert-or-update', '添加或修改✨'],
                    {
                        title: '查询',
                        children: [
                            ['/select', '查询'],
                            ['/paging', '分页查询'],
                            ['/select-single-table', '单表查询'],
                            ['/select-multi-table', '多表查询'],
                            ['/select-group-by', '分组聚合'],
                            ['/select-return-data', '返回数据✨'],
                            ['/select-lazy-loading', '延时加载'],
                            ['/select-include', '贪婪加载✨'],
                            ['/linq-to-sql', 'LinqToSql'],
                            ['/select-as-tree', '树型查询✨'],
                        ]
                    },
                    {
                        title: '仓储层',
                        children: [
                            ['/repository', '仓储对象'],
                            ['/unit-of-work', '工作单元'],
                            ['/cascade-saving', '级联保存'],
                        ],
                    },
                    ['/db-context', 'DbContext'],
                    {
                        title: 'CodeFirst',
                        children: [
                            ['/code-first', '代码先行'],
                            ['/entity-attribute', '实体特性✨'],
                            ['/fluent-api', '流式接口'],
                            ['/custom-attribute', '自定义特性'],
                            ['/type-mapping', '类型映射'],
                            ['/navigate-attribute', '导航属性✨'],
                        ],
                    },
                    ['/db-first', '数据库先行'],
                    ['/expression-function', '表达式函数'],
                    ['/transaction', '事务'],
                    ['/filters', '过滤器'],
                    ['/aop', 'AOP✨'],
                    ['/read-write-splitting', '读写分离'],
                    ['/sharding', '分表分库'],
                    ['/multi-tenancy', '多租户'],
                    ['/performance', '性能'],
                    ['/more', '你不知道的功能✨'],
                    ['/api-references', 'API 参考'],
                ]
            },
            {
                title: '友谊第一',
                children: [
                    ['/vs-dapper', '与 Dapper 比较'],
                    ['/vs-entity-framework.md', '与 EntityFramework 比较'],
                ]
            },
            {
                title: '学习与交流',
                collapsable: false,
                children: [
                    ['/faq.md', '常见问题'],
                    ['https://github.com/2881099/FreeSql/issues/new', '提交问题']
                ]
            },
            {
                title: '更多信息',
                collapsable: false,
                children: [
                    ['/change-log.md', '更新日志']
                ]
            }
        ],
        lastUpdated: '更新于',
        nextLinks: true,
        prevLinks: true,
        editLinks: true,
        editLinkText: '改进此文档',
        smoothScroll: true,
        markdown: {
            lineNumbers: true
        },
    },
    plugins: [
        [
            '@vuepress/last-updated',
            {
                transformer: (timestamp, lang) => {
                    const dayjs = require('dayjs')
                    return dayjs().format('YYYY-MM-DD HH:mm:ss')
                }
            }
        ]
    ]
}