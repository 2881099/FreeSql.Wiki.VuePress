import { hopeTheme } from "vuepress-theme-hope";
import { enNavbarConfig, zhNavbarConfig } from "./navbar";
import { zhSidebarConfig, enSidebarConfig } from "./sidebar";

export default hopeTheme({
    hostname: "http://freesql.net",
    logo: '/logo.png',
    repo: 'dotnetcore/FreeSql',
    docsRepo: 'https://github.com/2881099/FreeSql.Wiki.VuePress',
    docsBranch: "main",
    docsDir: 'docs',
    iconPrefix: "iconfont icon-",
    locales: {
        "/": {
            navbar: zhNavbarConfig,
            sidebar: zhSidebarConfig,
            footer: "Copyright © 2018-present nicye",
            displayFooter: true,
            metaLocales: {
                lastUpdated: "上次编辑于",
                editLink: "在 GitHub 上编辑此页",
            },
        },
        "/en/": {
            navbar: enNavbarConfig,
            sidebar: enSidebarConfig, 
            footer: "Copyright © 2018-present nicye",
            displayFooter: true,
        },
    },

    pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime", "Word"],

    encrypt: {

    },

    plugins: {
        git: {
            createdTime: true,
            updatedTime: true,
            contributors: true,
        },
        pwa: true,
        mdEnhance: {
            enableAll: true,
            presentation: {
                plugins: ["highlight", "math", "search", "notes", "zoom"],
            },
        },
    },
});
