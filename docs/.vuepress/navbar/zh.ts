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
        text: '其他作品',
        icon: "api",
        children: [
            {
                text: 'AdminBlazor（后台管理系统）',
                link: '/guide/freeredis.md'
            },
            {
                text: 'FreeRedis（RedisClient）',
                link: '/guide/freeredis.md'
            },
            {
                text: 'FreeScheduler（定时任务）',
                link: '/guide/freescheduler.md'
            },
            {
                text: 'FreeIM（通讯架构）',
                link: '/guide/freeim.md'
            },
            {
                text: '更多作品（CSRedisCore）',
                link: '/guide/otherworks.md'
            }
        ]
    },
    {
        text: '捐赠',
        icon: "launch",
        link: "/reference/service-support.md"
    },
]);
