---
title:
draft: false
maturity: Chest
---
雖然我在[[Obsidian + Quartz + GithubPage架設|架設的紀錄中]]提供[obsidian-digital-garden的連結](https://github.com/oleeskild/obsidian-digital-garden)但是如果要自己手搓一個跟digital garden模版相似的外觀，必須去研究[這位貢獻者 oleeskild](https://github.com/oleeskild)的[digitalgarden](https://github.com/oleeskild/digitalgarden)才行。


### 1. 深度控制條 (Depth Bar) 

**位置**：`quartz/components/Graph.tsx` + `graph.inline.ts` + `graph.scss`

- **Graph.tsx 變更**：
  ```tsx
  {localGraph.showDepthSlider && (
    <div class="graph-depth-control">
      <label for="graph-depth-slider" class="depth-label">深度</label>
      <input type="range" id="graph-depth-slider"
             min={localGraph.minDepth || 1}
             max={localGraph.maxDepth || 3}
             value={localGraph.depth || 1} />
      <span class="depth-value">{localGraph.depth || 1}</span>
    </div>
  )}
  ```

- **graph.inline.ts 深度控制邏輯**：
  - 監聽滑桿輸入事件
  - 動態更新所有 graph container 配置
  - 重新渲染但不重置視圖（`renderLocalGraph(false)`）
  - 註冊清理函數避免記憶體洩漏

- **graph.scss 樣式**：
  - `.graph-depth-control` 使用 flexbox 佈局
  - 自訂 range input 外觀（18px 圓形 thumb）
  - Webkit 和 Mozilla 瀏覽器兼容
  - Hover 效果與過渡動畫

### 2. 節點外觀

**位置**：`graph.inline.ts`

- **A. 當前節點高亮**：
  ```typescript
  if (isCurrent) {
    gfx.circle(0, 0, nodeRadius(n) + 1)
    gfx.stroke({ width: 0.5, color: color(n) })
  }
  ```
  - 額外繪製半徑 +1 的圓圈，線寬 0.5，使用節點顏色

- **B. 節點大小範圍控制：
  ```typescript
  function nodeRadius(d: NodeData) {
    const numberOfNeighbours = graphData.links.filter(...).length || 2
    return Math.min(12, Math.max(numberOfNeighbours / 1.5, 3))
  }
  ```
  - 最小 3，最大 12，根據連結數量動態調整

- **C. 標籤始終可見**：
  ```typescript
  const label = new Text({
    alpha: 1, // 從 0 改為 1
    anchor: { x: 0.5, y: 0 }, // 從 {x: 0.5, y: 1.2} 改變
    style: {
      fontSize: 8, // 從 fontSize * 15 改為固定 8
      fontFamily: "Sans-Serif" // 從 bodyFont 改變
    }
  })
  label.y = nodeRadius(n) + 3 // 新增：標籤位置在節點下方
  ```

- **D. 連線變細**：
  ```typescript
  stroke({ alpha: l.alpha, width: 0.5, color: l.color }) // 從 width: 1 改為 0.5
  ```

- **E. 移除標籤動態透明度**：
  ```typescript
  // 所有標籤始終保持完全不透明
  for (const label of labelsContainer.children) {
    label.alpha = 1
  }
  ```

### 3. zoomToFit 功能

在每頁渲染的時候會自動將graph縮放至符合畫面大小

**位置**：`graph.inline.ts` 

**完整實現**：
```typescript
if (shouldZoomToFit && graphData.nodes.length > 0) {
  setTimeout(() => {
    // 1. 計算所有節點的邊界框
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity
   
    for (const node of graphData.nodes) {
      if (node.x !== undefined && node.y !== undefined) {
        minX = Math.min(minX, node.x)
        maxX = Math.max(maxX, node.x)
        minY = Math.min(minY, node.y)
        maxY = Math.max(maxY, node.y)
      }
    }
   
    // 2. 計算適當的縮放比例
    const padding = 40
    const graphWidth = maxX - minX
    const graphHeight = maxY - minY
    const scaleX = (width - padding * 2) / (graphWidth || 1)
    const scaleY = (height - padding * 2) / (graphHeight || 1)
    const scale = Math.min(scaleX, scaleY, 4) // 最大 4x
   
    // 3. 計算圖表中心點
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
   
    // 4. 計算平移量，讓圖表中心對齊畫面中心
    const translateX = width / 2 - (centerX + width / 2) * scale
    const translateY = height / 2 - (centerY + height / 2) * scale
   
    // 5. 應用變換（200ms 平滑過渡）
    currentTransform = zoomIdentity
      .translate(translateX, translateY)
      .scale(scale)
   
    select<HTMLCanvasElement, NodeData>(app.canvas)
      .transition()
      .duration(200)
      .call(zoomBehavior.transform, currentTransform)
  }, 200)
}
```


📊 **參數變更對照表**

| 參數                  | 原值              | 新值              | 用途                          |
|-----------------------|-------------------|-------------------|-------------------------------|
| linkDistance (local)  | 30                | 100               | 增加節點間距                  |
| showTags              | true              | false             | 隱藏標籤節點                  |
| centerForce (global)  | 0.2               | 0.3               | 加強中心引力                  |
| enableRadial (global) | true              | false             | 禁用徑向佈局                  |
| scaleExtent           | [0.25, 4]         | [0.1, 10]         | 擴大縮放範圍                  |
| nodeRadius            | 2 + √links        | min(12, max(n/1.5, 3)) | 控制節點大小              |
| label.alpha           | 動態              | 1                 | 標籤始終可見                  |
| label.fontSize        | fontSize*15       | 8                 | 固定字體大小                  |
| link.width            | 1                 | 0.5               | 連線變細                      |

**新增參數**：

| 參數             | 預設值          | 說明                  |
|------------------|-----------------|-----------------------|
| showDepthSlider  | true            | 顯示深度控制條        |
| minDepth         | 1               | 最小深度              |
| maxDepth         | 3               | 最大深度              |
| initialZoom      | 1.5 (local) / 1 (global) | 初始縮放級別        |
| linkStrength     | 1               | 連結強度              |



研究原模版以及套用感謝Cursor😎！死啃程式碼找到想對應的配置可能會花我好幾個小時吧🫠
以上資料整理依靠git diff以及Claude👍