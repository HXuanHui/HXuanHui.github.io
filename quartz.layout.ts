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
        drag: true,
        zoom: true,
        depth: 1,
        scale: 1.1,
        repelForce: 0.5,
        centerForce: 0.3,
        linkDistance: 30,
        fontSize: 0.6,
        opacityScale: 1,
        showTags: false,  
        removeTags: [],
        focusOnHover: false,
        enableRadial: false,
        showDepthSlider: true,
        minDepth: 1,
        maxDepth: 3,
        initialZoom: 1.5,
      },
      globalGraph: {
        drag: true,
        zoom: true,
        depth: -1,
        scale: 0.9,
        repelForce: 0.5,
        centerForce: 0.2,
        linkDistance: 30,
        fontSize: 0.6,
        opacityScale: 1,
        showTags: false,
        removeTags: [],
        focusOnHover: true,
        enableRadial: true,
        initialZoom: 1,
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
