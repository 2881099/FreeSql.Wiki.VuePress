import { hopeTheme } from "vuepress-theme-hope";
import { enNavbarConfig, zhNavbarConfig } from "./navbar";
import { zhSidebarConfig, enSidebarConfig } from "./sidebar";

export default hopeTheme({
    hostname: "https://freesql.net",
    logo: '/logo.png',
    repo: 'dotnetcore/FreeSql',
    docsRepo: 'https://github.com/2881099/FreeSql.Wiki.VuePress',
    docsBranch: "main",
    docsDir: 'docs',
    // pure: true, 
    iconPrefix: "iconfont icon-",
    author: 'nicye',
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
        feed: {
            atom: true,
            json: true,
            rss: true,
        },
        mdEnhance: {
            align: true,
            attrs: true,
            chart: true,
            codetabs: true,
            container: true,
            demo: true,
            echarts: true,
            flowchart: true,
            gfm: true,
            imageLazyload: true,
            imageMark: true,
            imageSize: true,
            imageTitle: true,
            include: true,
            katex: true,
            mark: true,
            mermaid: true,
            playground: {
              presets: ["ts", "vue"],
            },
            presentation: {
              plugins: ["highlight", "math", "search", "notes", "zoom"],
            },
            stylize: [
              {
                matcher: "Recommended",
                replacer: ({ tag }) => {
                  if (tag === "em")
                    return {
                      tag: "Badge",
                      attrs: { type: "tip" },
                      content: "Recommended",
                    };
                },
              },
            ],
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,
            vuePlayground: true,
        },
    },
});
