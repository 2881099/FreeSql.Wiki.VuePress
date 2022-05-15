import { defineUserConfig } from "vuepress";
import theme from "./theme";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
export default defineUserConfig({
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'FreeSql 官方文档',
            description: 'FreeSql Documents',
        },
        '/en/': {
            lang: 'en-US',
            title: 'FreeSql Documents',
            description: 'FreeSql Documents'
        }
    },
    base: "/",

    head: [
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: `/favicon-16x16.png`,
            },
        ],
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: `/favicon-32x32.png`,
            },
        ],
        ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
        ['link', { rel: 'stylesheet', href: '//at.alicdn.com/t/font_2410206_mfj6e1vbwo.css' }],
        ['meta', { name: 'application-name', content: 'VuePress' }],
        ['meta', { name: 'apple-mobile-web-app-title', content: 'VuePress' }],
        [
            'meta',
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        ],
        [
            'link',
            { rel: 'apple-touch-icon', href: `/apple-touch-icon.png` },
        ],
        ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        // ...其他标签
    ],
    theme,
    plugins: [
        docsearchPlugin({
            apiKey: "d33b85d622e4b61625bf17443031804c",
            indexName: "freesql",
            locales: {
                "/zh/": {
                    placeholder: "搜索文档",
                    translations: {
                        button: {
                            buttonText: "搜索文档",
                            buttonAriaLabel: "搜索文档",
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: "清除查询条件",
                                resetButtonAriaLabel: "清除查询条件",
                                cancelButtonText: "取消",
                                cancelButtonAriaLabel: "取消",
                            },
                            startScreen: {
                                recentSearchesTitle: "搜索历史",
                                noRecentSearchesText: "没有搜索历史",
                                saveRecentSearchButtonTitle: "保存至搜索历史",
                                removeRecentSearchButtonTitle: "从搜索历史中移除",
                                favoriteSearchesTitle: "收藏",
                                removeFavoriteSearchButtonTitle: "从收藏中移除",
                            },
                            errorScreen: {
                                titleText: "无法获取结果",
                                helpText: "你可能需要检查你的网络连接",
                            },
                            footer: {
                                selectText: "选择",
                                navigateText: "切换",
                                closeText: "关闭",
                                searchByText: "搜索提供者",
                            },
                            noResultsScreen: {
                                noResultsText: "无法找到相关结果",
                                suggestedQueryText: "你可以尝试查询",
                                reportMissingResultsText: "你认为该查询应该有结果？",
                                reportMissingResultsLinkText: "点击反馈",
                            },
                        },
                    },
                },
            },
        })
    ]
});
