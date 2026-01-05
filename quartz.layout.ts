import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    // 如果您想在 header 中顯示裝飾性圖片，取消下面的註釋
    // Component.DecorativeImage({
    //   imagePath: "static/decorative-pattern.png",
    //   alt: "Decorative pattern",
    //   maxWidth: "600px",
    //   opacity: 0.8,
    // }),
  ],
  afterBody: [
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.MaturityLevel(),
    // 在首頁顯示知識森林
    Component.ConditionalRender({
      component: Component.Forest({
        showOnlyOnIndex: true,
        gridWidth: 20,
        gridHeight: 10,
        iconSize: "1.3rem",
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  left: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph({
      localGraph: {
        fontSize: 0.35,       // 文字大小適中（保持可讀性）
        centerForce: 0.1,     // 節點集中強度縮小（讓節點更分散）
        repelForce: 1.5,      // 互斥強度增加（讓節點分得更開，避免互相擋到）
        linkDistance: 60,     // 連接線距離增加（給文字和節點更多空間）
        linkStrength: 1.0,    // 連結強度適中
        initialZoom: 1.0,     // 初始 zoom in（保持放大以便看到所有內容）
        opacityScale: 1.0,   // 標籤初始 100% 可見
      },
      globalGraph: {
        fontSize: 0.35,       // 文字大小適中
        centerForce: 0.08,    // 節點集中強度縮小
        repelForce: 1.2,      // 互斥強度增加（避免節點互相擋到）
        linkDistance: 80,     // 連接線距離增加（給文字更多空間）
        linkStrength: 1.0,    // 連結強度適中
        initialZoom: 2.0,     // 初始 zoom in
        opacityScale: 1.0,   // 標籤初始 100% 可見
      },
    }),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
  ],
}
