import { hopeTheme } from "vuepress-theme-hope";
import { enNavbarConfig, zhNavbarConfig } from "./navbar/index.js";
import { zhSidebarConfig, enSidebarConfig } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://freesql.net",
  logo: "/logo.png",
  author: "nicye",

  iconAssets: "iconfont",
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

  plugins: {
    feed: {
      atom: true,
      json: true,
      rss: true,
    },
    git: true,
    mdEnhance: {
      codetabs: true,
      container: false,
      figure: true,
      imgLazyload: true,
    },
    pwa: true,
  },
});
