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
          "Getting-Started",
          "Install",
          "Insert-Data",
          "Delete-Data",
          "Update-Data",
          "Insert-or-Update",
        ],
      },
      {
        text: "Query",
        collapsible: true,
        children: [
          "Query-Data",
          "Pagination",
          "Query-from-Single-Table",
          "Query-from-Multi-Table",
          "Group-Aggregation-Query",
          "Return-Data",
          "Lazy-Loading",
          "Greed-Loading",
          "Linq-to-Sql",
          "With-Sql",
          "Parent-Child-Relationship-Query",
        ],
      },
      {
        text: "Repository",
        collapsible: true,
        children: [
          "Repository-Layer",
          "Cascade-Saving",
          "Unit-of-Work",
          "Unit-of-Work-Manager",
        ],
      },
      {
        text: "CodeFirst",
        collapsible: true,
        children: ["Entity-Relationship"],
      },
    ],
  },
]);
