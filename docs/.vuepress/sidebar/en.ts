import { sidebar } from "vuepress-theme-hope";

export const enSidebarConfig = sidebar([
  {
    text: "Guide",
    prefix: "/en/guide/",
    link: "/en/guide/",
    icon: "guide",
    children: [
      {
        text: "Basics",
        collapsible: true,
        children: [
          "",
          "insert",
          "delete",
          "update",
          "insert-or-update",
          "entity-attribute",
          "navigate-attribute",
        ],
      },
      {
        text: "Query ✨",
        collapsible: true,
        children: [
          "select",
          "paging",
          "select-single-table",
          "select-multi-table",
          "withtempquery",
          "unionall",
          "select-group-by",
          "select-return-data",
          "select-lazy-loading",
          "select-include",
          "select-as-tree",
        ],
      },
      {
        text: "Repository ✨",
        collapsible: true,
        children: [
          "repository",
          "unit-of-work",
          "cascade-saving",
          "cascade-delete",
          "unitofwork-manager",
          "aggregateroot",
        ],
      },
      "expression-function",
      "transaction",
      "filters",
      "ado",
      "aop",
      {
        text: "CodeFirst",
        collapsible: true,
        children: [
          "code-first",
          "fluent-api",
          "type-mapping",
        ],
      },
      "db-first",
      {
        text: "Advanced Features",
        collapsible: true,
        children: [
          "read-write-splitting",
          "sharding",
          "multi-tenancy",
          "performance",
          "dynamic",
          "lowcode",
        ],
      },
    ],
  },
]);
