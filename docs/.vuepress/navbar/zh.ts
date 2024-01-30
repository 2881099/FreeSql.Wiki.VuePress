import { navbar } from "vuepress-theme-hope";

export const zhNavbarConfig = navbar([
    {
        text: '文档',
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
        text: '扩展',
        link: '/extra/',
        icon: "any",
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
                        link: 'http://101.34.7.82:8082/api/index.html'
                    },
                    {
                        text: '提Issues',
                        link: 'https://github.com/dotnetcore/FreeSql/issues/new'
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
        text: '捐赠',
        icon: "launch",
        link: "/reference/service-support.md"
    },
]);
