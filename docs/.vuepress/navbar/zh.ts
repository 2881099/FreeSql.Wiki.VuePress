import { navbar } from "vuepress-theme-hope";

export const zhNavbarConfig = navbar([
    {
        text: '指南',
        link: '/guide/',
        icon: "creative",
    },
    {
        text: '参考',
        icon: "plugin",
        children: [
            {
                text: '参考', 
                icon: "view",
                children: [
                    '/reference/api.md',
                    '/reference/change-log.md',
                    '/reference/vs-dapper.md',
                    '/reference/vs-entity-framework.md'
                ]
            },
            {
                text: '学习与交流',
                icon: "comment",
                children: [
                    '/reference/faq.md',
                    '/reference/donation.md',
                    '/reference/awesome-freesql.md',
                ]
            }
        ]
    },
    {
        text: 'API',
        icon: "api",
        children: [
            {
                text: '学习与交流',
                children: [
                    {
                        text: '浏览API',
                        link: 'https://docs.dotnet-china.com/FreeSql/api/index.html'
                    },
                    {
                        text: '浏览API（国内镜像）',
                        link: 'http://124.70.130.97:8082/api/index.html'
                    },
                    {
                        text: '提Issues',
                        link: 'https://github.com/2881099/FreeSql/issues/new'
                    },
                    {
                        text: 'NuGet',
                        link: 'https://www.nuget.org/packages?q=freesql'
                    }
                ]

            }
        ]
    },
    {
        text: '服务支持',
        icon: "launch",
        link: "/reference/service-support.md"
    },
]);
