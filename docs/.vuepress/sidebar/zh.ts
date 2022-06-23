import { sidebar } from "vuepress-theme-hope";

export const zhSidebarConfig = sidebar({
    "/guide/": [
        {
            text: "指南",
            prefix: "/guide/",
            link: "/guide/",
            icon: "creative",
            children: [
                {
                    text: "基础文档",
                    collapsable: true,
                    children: [
                        "/guide/README.md",
                        "/guide/getting-started.md",
                        "/guide/install.md",
                        "/guide/insert.md",
                        "/guide/delete.md",
                        "/guide/update.md",
                        "/guide/insert-or-update.md",
                    ],
                },
                {
                    text: "查询",
                    collapsable: true,
                    children: [
                        "/guide/select.md",
                        "/guide/paging.md",
                        "/guide/select-single-table.md",
                        "/guide/select-multi-table.md",
                        "/guide/select-group-by.md",
                        "/guide/select-return-data.md",
                        "/guide/select-lazy-loading.md",
                        "/guide/select-include.md",
                        "/guide/linq-to-sql.md",
                        "/guide/withsql.md",
                        "/guide/select-as-tree.md",
                    ],
                },
                {
                    text: "仓储层",
                    collapsable: true,
                    children: [
                        "/guide/repository.md",
                        "/guide/unit-of-work.md",
                        "/guide/cascade-saving.md",
                        "/guide/unitofwork-manager.md",
                    ],
                },
                {
                    text: "数据库提供程序",
                    collapsable: true,
                    children: ["/guide/freesql-provider-sqlitecore.md"],
                },
                {
                    text: "DbContext",
                    collapsable: true,
                    children: ["/guide/db-context.md", "/guide/ifreesql-context.md"],
                },
                {
                    text: "CodeFirst",
                    collapsable: true,
                    children: [
                        "/guide/code-first.md",
                        "/guide/entity-attribute.md",
                        "/guide/fluent-api.md",
                        "/guide/custom-attribute.md",
                        "/guide/type-mapping.md",
                        "/guide/navigate-attribute.md",
                    ],
                },
                "/guide/db-first.md",
                "/guide/expression-function.md",
                "/guide/transaction.md",
                "/guide/filters.md",
                "/guide/ado.md",
                "/guide/aop.md",
                "/guide/read-write-splitting.md",
                "/guide/sharding.md",
                "/guide/multi-tenancy.md",
                "/guide/performance.md",
                "/guide/more.md",
            ],
        },
    ],
    "/reference/": [
        {
            text: "参考", 
            collapsable: true,
            prefix: "/reference/",
            link: "/reference/api.md",
            icon: "plugin",
            children: [
                {
                    text: "参考",
                    collapsable: true,
                    icon: "view",
                    children: [
                        "/reference/api.md",
                        "/reference/change-log.md",
                        "/reference/vs-dapper.md",
                        "/reference/vs-entity-framework.md",
                    ],
                },
                {
                    text: "学习与交流",
                    collapsable: true,
                    icon: "comment",
                    children: [
                        "/reference/faq.md",
                        "/reference/donation.md",
                        "/reference/awesome-freesql.md",
                    ],
                },
            ],
        },
        {
            text: "服务支持",
            collapsable: true,
            icon: "launch",
            link: "/reference/service-support.md",
        },
    ],
    "/extra/": [
        {
            text: "扩展指南",
            prefix: "/extra/",
            link: "/extra/",
            icon: "any",  
            collapsable: true,
            children: [
                "/extra/README.md",
                "/extra/idlebus-freesql.md",
            ],
        },
    ]
});
