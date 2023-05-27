import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  port: 8083,

  locales: {
    "/": {
      lang: "zh-CN",
      title: "FreeSql 官方文档",
      description: "FreeSql Documents",
    },
    "/en/": {
      lang: "en-US",
      title: "FreeSql Documents",
      description: "FreeSql Documents",
    },
  },

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `/favicon-16x16.png`,
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `/favicon-32x32.png`,
      },
    ],
    ["meta", { name: "application-name", content: "FreeSql" }],
    ["meta", { name: "keywords", content: "FreeSql,.NET,ORM" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "FreeSql" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    ["link", { rel: "apple-touch-icon", href: `/apple-touch-icon.png` }],
    [
      "script",
      {
        type: "text/javascript",
        crossorigin: "anonymous",
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7223766210897652",
      },
    ],
    [
      "script",
      {
        type: "text/javascript",
        src: "/js/base.js",
      },
    ],
  ],
  theme,
  shouldPrefetch: false,
  plugins: [
    docsearchPlugin({
      appId: "8QM97XX5VE",
      apiKey: "4f26d8ac064a7f23065db5354cb5cfe6",
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
    }),
    googleAnalyticsPlugin({
      id: "G-DBKD2VY1WB",
    }),
  ],
});
