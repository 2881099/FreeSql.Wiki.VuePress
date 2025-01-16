import { navbar } from "vuepress-theme-hope";

export const enNavbarConfig = navbar([
  {
    text: "Documention",
    icon: "lightbulb",
    link: "/en/guide/",
  },
  {
    text: "NuGet",
    link: "https://www.nuget.org/packages?q=freesql",
  },
  {
    text: "API Browser",
    link: "https://dotnetcore.github.io/FreeSql/api/index.html",
  },
  {
    text: "Redis Client",
    link: "https://www.github.com/2881099/FreeRedis",
  },
  {
    text: "Donate",
    icon: "hand-holding-dollar",
    link: "/reference/service-support.md",
  },
]);
