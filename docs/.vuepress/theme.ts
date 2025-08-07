import { hopeTheme } from "vuepress-theme-hope";
import { enNavbarConfig, zhNavbarConfig } from "./navbar/index.js";
import { zhSidebarConfig, enSidebarConfig } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://freesql.net",
  logo: "/logo.png",
  author: "nicye",

  favicon: "/favicon-32x32.png",
  repo: "dotnetcore/FreeSql",
  docsRepo: "https://github.com/2881099/FreeSql.Wiki.VuePress",
  docsDir: "docs",

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

  pageInfo: [
    "Author",
    "Original",
    "Date",
    "Category",
    "Tag",
    "ReadingTime",
    "Word",
  ],

  markdown: {
    codeTabs: true,
    component: true,
    figure: true,
    hint: false,
    imgLazyload: true,
  },

  plugins: {
    components: {
      components: ["VPBanner"],
    },

    docsearch: {
      appId: "8QM97XX5VE",
      apiKey: "5110e946ab01a84a298aebef76e22b69",
      indexName: "freesql",
      locales: {
        "/": {
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
        "/en/": {
          placeholder: "Search docs",
          translations: {
            button: {
              buttonText: "Search docs",
            },
          },
        },
      },
    },

    icon: {
      assets: "fontawesome",
    },

    feed: {
      atom: true,
      json: true,
      rss: true,
    },

    pwa: {
      manifest: {
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      apple: {
        icon: "/apple-touch-icon.png",
      },
    },
  },
});
