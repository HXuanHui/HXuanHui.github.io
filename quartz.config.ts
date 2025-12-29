import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "H.XuanHui's Notes", // 這是網頁左上角的標題
    pageTitleSuffix: " | 知識庫",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "zh-TW", // 改為繁體中文
    baseUrl: "hxuanhui.github.io/HXuanHui.github.io-CGM-", // 這是你的發佈路徑
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Lora", // 標題使用 Aster 類型的優雅襯線體
        body: "Inter",  // 內文使用現代簡潔的無襯線體
        code: "Fira Code",
      },
      colors: {
        lightMode: {
          light: "#fcfcfc",       // 極簡白背景
          lightgray: "#f2f2f2",   // 淺灰邊框
          gray: "#a0a0a0",        // 中灰文字
          darkgray: "#333333",    // 深灰內文 (提升閱讀舒適度)
          dark: "#1a1a1a",        // 標題近乎黑
          secondary: "#3e6b89",   // 穩重的湖水藍 (Aster 風格的主題色)
          tertiary: "#94b0c2",    // 輔助藍灰色
          highlight: "rgba(62, 107, 137, 0.08)", 
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config