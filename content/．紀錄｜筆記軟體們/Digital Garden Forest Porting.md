---
title:
draft: true
maturity: Chest
---
📁 **詳細檔案變更清單**

#### 配置檔案 (2 個)

1. **quartz.config.ts**
   ```typescript
   // 標題變更
   pageTitle: "自己想要的標題"
   // 字體變更
   typography: {
     header: "Lora", // 保持不變
     body: "Noto Serif TC", // 從 Inter 改變
     code: "Google Sans Code" // 從 Fira Code 改變
   }
   // 色彩調整為暖色調
   colors: {
     lightMode: {
       light: "#fcfaf2", // 從 #fcfcfc
       lightgray: "#e8e2d4", // 從 #f2f2f2
       gray: "#a0998b", // 從 #a0a0a0
       darkgray: "#444444", // 從 #333333
       dark: "#2b2b2b", // 從 #1a1a1a
       secondary: "#3e6b89", // 保持不變
       tertiary: "#84a59d", // 從 #94b0c2
     }
   }
   ```

2. **quartz.layout.ts**
   ```typescript
   // 移除 PageTitle
   left: [ Component.PageTitle(), // ❌ 刪除 ... ]

   // 新增 MaturityLevel
   beforeBody: [ Component.MaturityLevel(), // ✅ 新增 ... ]

   // 新增 Forest（首頁限定）
   beforeBody: [ Component.ConditionalRender({ component: Component.Forest({ ... }), condition: ... }) ]

   // Graph 完整配置
   Component.Graph({
     localGraph: { linkDistance: 100, showTags: false, centerForce: 0.3, enableRadial: false, showDepthSlider: true, minDepth: 1, maxDepth: 3, initialZoom: 1.5 },
     globalGraph: { centerForce: 0.2, showTags: false, enableRadial: true, initialZoom: 1 }
   })

   // 移除 Backlinks
   Component.Backlinks(), // ❌ 刪除
   ```

#### 新增組件 (3 個)

3. **DecorativeImage.tsx** (60 行)  
   - 用途：顯示裝飾性圖片  
   - 特點：響應式置中、可調整透明度、支援最大寬度限制

4. **MaturityLevel.tsx** (123 行)  
   - 成熟度系統：7 個等級（seedling, sapling, tree, withered, stone, signpost, chest）  
   - 從 frontmatter.maturity 讀取  
   - 顯示徽章 + hover 效果 + 暗色模式支援

5. **Forest.tsx** (273 行)  
   - 知識森林視覺化  
   - 生成 20×10 網格（200 格）  
   - Fisher-Yates 隨機排列 + 統計各成熟度數量 + 響應式設計

#### 修改組件 (4 個)

6. **Explorer.tsx**  
   - 移除桌面版摺疊按鈕 → 桌面版 Explorer 始終展開

7. **Graph.tsx**  
   - 新增 GraphConfiguration 介面欄位（linkStrength、showDepthSlider、minDepth、maxDepth、initialZoom）  
   - 更新 defaultOptions

8. **TableOfContents.tsx**  
   - 移除摺疊功能 → TOC 始終展開

9. **index.ts**  
   - 註冊新組件：MaturityLevel、DecorativeImage、Forest

#### Script 檔案 (2 個)

10. **graph.inline.ts** ⭐ (195 行重大變更)  
    - 函數簽名新增 `shouldZoomToFit` 參數  
    - 移除 visited 狀態追蹤  
    - 新增 linkStrength、initialZoom  
    - 力導向模擬優化（alphaDecay 0.10、collide radius * 1.5）  
    - 顏色邏輯、nodeRadius、hover、標籤、zoom 系統重寫  
    - 深度滑桿即時控制邏輯

11. **toc.inline.ts**  
    - 移除 toggleToc 函數 → TOC 始終展開，只保留高亮功能

#### 樣式檔案 (5 個)

12. **explorer.scss**  
    - 分離桌面/行動樣式，桌面版無 pointer cursor

13. **graph.scss** ⭐ (72 新增行)  
    - 深度控制條完整樣式（flex、thumb、hover、兼容性）

14. **toc.scss**  
    - 移除摺疊相關規則，改為 div 標頭

15. **custom.scss** ⭐ (247 新增行)  
    - 側邊欄整體滾動（隱藏滾動條）  
    - 左右側邊欄字體、間距、hover 優化  
    - 響應式與清爽設計

16. **maturity-system.scss** ⭐ (269 新增行)  
    - 成熟度徽章、Explorer 圖標整合、統計面板  
    - 7 種等級圖標、hover 效果、響應式與暗色模式支援

#### 其他變更 (1 個)

17. **`digital garden` submodule**  
    - 新增 submodule at commit 179075（作為參考實現）