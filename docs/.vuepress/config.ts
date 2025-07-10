import { viteBundler } from "@vuepress/bundler-vite";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  port: 8083,

  locales: {
    "/": {
      lang: "zh-CN",
      title: "FreeSql",
      description: "FreeSql 文档",
    },
    "/en/": {
      lang: "en-US",
      title: "FreeSql",
      description: "FreeSql Documents",
    },
  },

  head: [
    ["meta", { name: "keywords", content: "FreeSql,.NET,ORM" }],
    [
      /*
      "script",
      {
        crossorigin: "anonymous",
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7223766210897652",
      },
      */
    ],
    [
      "script",
      {},
      `
(adsbygoogle = window.adsbygoogle || []).push({});
`,
    ],
  ],

  bundler: viteBundler(),
  theme,

  plugins: [
    googleAnalyticsPlugin({
      id: "G-DBKD2VY1WB",
    }),
  ],

  shouldPrefetch: false,
});
