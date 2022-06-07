import { sidebar } from "vuepress-theme-hope";

export const enSidebarConfig = sidebar([
    {
        text: "Guide",
        prefix: "/en/guide/",
        link: "/en/guide/",
        icon: "guide",
        children: [
            {
                text: 'Basics',
                collapsable: true,
                children: [
                    '/en/guide/README.md',
                    '/en/guide/Getting-Started.md',
                    '/en/guide/Install.md',
                    '/en/guide/Insert-Data.md',
                    '/en/guide/Delete-Data.md',
                    '/en/guide/Update-Data.md',
                    '/en/guide/Insert-or-Update.md'
                ]
            },
            {
                text: 'Query', collapsable: true,
                children: [
                    '/en/guide/Query-Data.md',
                    '/en/guide/Pagination.md',
                    '/en/guide/Query-from-Single-Table.md',
                    '/en/guide/Query-from-Multi-Table.md',
                    '/en/guide/Group-Aggregation-Query.md',
                    '/en/guide/Return-Data.md',
                    '/en/guide/Lazy-Loading.md',
                    '/en/guide/Greed-Loading.md',
                    '/en/guide/Linq-to-Sql.md',
                    '/en/guide/With-Sql.md',
                    '/en/guide/Parent-Child-Relationship-Query.md'
                ]
            },
            {
                text: 'Repository',
                collapsable: true,
                children: [
                    '/en/guide/Repository-Layer.md',
                    '/en/guide/Cascade-Saving.md',
                    '/en/guide/Unit-of-Work.md',
                    '/en/guide/Unit-of-Work-Manager.md',
                ]
            },
            {
                text: 'DbContext',
                collapsable: true,
                children: [
                    '/guide/db-context.md',
                    '/guide/ifreesql-context.md',
                ]
            },
            {
                text: 'CodeFirst',
                collapsable: true,
                children: [
                    '/en/guide/Entity-Relationship.md',
                ]
            }
        ],
    }
]);
