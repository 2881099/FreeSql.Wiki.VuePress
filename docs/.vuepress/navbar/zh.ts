import { navbar } from "vuepress-theme-hope";

export const zhNavbarConfig = navbar([
  {
    text: "文档",
    icon: "lightbulb",
    link: "/guide/",
  },
  {
    text: "参考",
    icon: "book",
    prefix: "/reference/",
    children: [
      {
        text: "参考",
        children: ["api", "change-log", "vs-dapper", "vs-entity-framework"],
      },
      {
        text: "学习与交流",
        children: ["faq", "donation", "awesome-freesql"],
      },
    ],
  },
  {
    text: "扩展",
    icon: "share",
    link: "/extra/",
  },
  {
    text: "其他作品",
    icon: "laptop-file",
    prefix: "/guide/",
    children: [
      {
        text: "AdminBlazor SaaS（中台项目）",
        link: "AdminBlazor",
      },
      {
        text: "FreeRedis（RedisClient）",
        link: "freeredis",
      },
      {
        text: "FreeScheduler（定时任务）",
        link: "freescheduler",
      },
      {
        text: "FreeIM（通讯架构）",
        link: "freeim",
      },
      {
        text: "更多作品（CSRedisCore）",
        link: "otherworks",
      },
    ],
  },
  {
    text: "捐赠",
    icon: "hand-holding-dollar",
    link: "/reference/service-support",
  },
]);
