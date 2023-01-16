import { sidebar } from "vuepress-theme-hope";

export const zhSidebarConfig = sidebar({
    "/guide/": [
        {
            text: "指南",
            prefix: "/guide/",
            link: "/guide/",
            icon: "creative",
            collapsible: true,
            children: [
                {
                    text: "基础文档",
                    collapsible: true,
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
                    collapsible: true,
                    children: [
                        "/guide/select.md",
                        "/guide/paging.md",
                        "/guide/select-single-table.md",
                        "/guide/select-multi-table.md",
                        "/guide/withtempquery.md",
                        "/guide/unionall.md",
                        "/guide/select-group-by.md",
                        "/guide/select-return-data.md",
                        "/guide/select-lazy-loading.md",
                        "/guide/select-include.md",
                        "/guide/select-as-tree.md",
                        "/guide/linq-to-sql.md",
                        "/guide/withsql.md",
                    ],
                },
                {
                    text: "Repository",
                    collapsible: true,
                    children: [
                        "/guide/repository.md",
                        "/guide/unit-of-work.md",
                        "/guide/cascade-saving.md",
                        "/guide/cascade-delete.md",
                        "/guide/unitofwork-manager.md",
                        "/guide/aggregateroot.md",
                    ],
                },
                {
                    text: "DbContext",
                    collapsible: true,
                    children: ["/guide/db-context.md", "/guide/ifreesql-context.md"],
                },
                {
                    text: "特别提供程序",
                    collapsible: true,
                    children: [
                        "/guide/freesql-provider-custom.md",
                        "/guide/freesql-provider-mysqlconnector.md",
                        "/guide/freesql-provider-postgresql.md",
                        "/guide/freesql-provider-sqlitecore.md",
                        "/guide/freesql-provider-oracle.md",
                        "/guide/freesql-provider-odbc.md",
                    ],
                },
                {
                    text: "扩展",
                    collapsible: true,
                    children: [
                        "/guide/freesql-extensions-baseentity.md",
                        "/guide/freesql-extensions-jsonmap.md",
                        "/guide/freesqladminlte.md",
                    ],
                },
                {
                    text: "CodeFirst ✨",
                    collapsible: true,
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
                "/guide/more.md",
                {
                    text: "高级功能",
                    collapsible: true,
                    children: [
                        "/guide/read-write-splitting.md",
                        "/guide/sharding.md",
                        "/guide/multi-tenancy.md",
                        "/guide/performance.md",
                        "/guide/dynamic.md",
                    ],
                },
                {
                    text: "其他作品",
                    collapsible: true,
                    children: [
                        "/guide/freeredis.md",
                        "/guide/freescheduler.md",
                        "/guide/freeim.md",
                        {
                            text: "More..",
                            link: "/guide/otherworks.md",
                        },
                    ],
                },
            ],
        },
    ],
    "/reference/": [
        {
            text: "参考", 
            collapsible: true,
            prefix: "/reference/",
            link: "/reference/api.md",
            icon: "plugin",
            children: [
                {
                    text: "参考",
                    collapsible: true,
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
                    collapsible: true,
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
            text: "捐赠",
            collapsible: true,
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
            collapsible: true,
            children: [
                "/extra/README.md",
                "/extra/freesql-cap.md",
                "/extra/idlebus-freesql.md",
                "/extra/iselect-depcopy.md",
                "/extra/freesql-auditlog.md",
                "/extra/freesql-docker.md",
                "/extra/issues-mysql5_5.md",
                "/extra/issues-expression-groupbysum.md",
            ],
        },
        {
            text: "博客",
            prefix: "/extra/",
            icon: "any",
            collapsible: true,
            children: [
                "/extra/aop-freesql-autofac.md",
            ],
        },
    ]
});
