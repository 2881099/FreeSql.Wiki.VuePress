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
      apiKey: "4f26d8ac064a7f23065db5354cb5cfe6",
      indexName: "freesql",
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
