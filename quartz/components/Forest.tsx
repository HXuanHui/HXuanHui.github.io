import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, FullSlug } from "../util/path"

interface Options {
  showOnlyOnIndex?: boolean
  gridWidth?: number
  gridHeight?: number
  iconSize?: string
}

const defaultOptions: Options = {
  showOnlyOnIndex: true,
  gridWidth: 20,
  gridHeight: 10,
  iconSize: "0.1rem",
}

// 成熟度等級定義（與 MaturityLevel.tsx 保持一致）
const maturityLevels: Record<string, { icon: string; label: string; color: string }> = {
  "1": { icon: "🌱", label: "Seedling", color: "#4a9b4a" },
  "seedling": { icon: "🌱", label: "Seedling", color: "#4a9b4a" },
  "2": { icon: "🌿", label: "Sapling", color: "#5cb85c" },
  "sapling": { icon: "🌿", label: "Sapling", color: "#5cb85c" },
  "3": { icon: "🌻", label: "Flower", color: "#2d5016" },
  "tree": { icon: "🌻", label: "Flower", color: "#2d5016" },
  "withered": { icon: " 🥀 ", label: "Withered", color: "#8b4513" },
  "stone": { icon: "🪨", label: "Stone", color: "#6c757d" },
  "signpost": { icon: "🪧", label: "Signpost", color: "#ffc107" },
  "chest": { icon: "🗃️", label: "Chest", color: "#ff9800" },
}

// 生成長方形網格位置
function generateRectangleGrid(width: number, height: number): Array<{ row: number; col: number }> {
  const positions: Array<{ row: number; col: number }> = []
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      positions.push({ row, col })
    }
  }
  
  return positions
}

// 隨機打亂數組（Fisher-Yates shuffle）
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  function Forest({ fileData, allFiles, cfg }: QuartzComponentProps) {
    // 如果設置為只在首頁顯示，且當前不是首頁，則不顯示
    if (opts.showOnlyOnIndex && fileData.slug !== "index") {
      return null
    }

    // 收集所有有 maturity level 的頁面
    const pagesWithMaturity = allFiles
      .filter((file) => {
        const maturity = file.frontmatter?.maturity?.toString().toLowerCase()
        return maturity && maturityLevels[maturity] && file.slug
      })
      .map((file) => {
        const maturity = file.frontmatter?.maturity!.toString().toLowerCase()
        return {
          slug: file.slug!,
          title: file.frontmatter?.title || file.slug!,
          maturity: maturity!,
          icon: maturityLevels[maturity!].icon,
          label: maturityLevels[maturity!].label,
        }
      })

    if (pagesWithMaturity.length === 0) {
      return null
    }

    // 生成長方形網格並隨機打亂位置
    const gridPositions = generateRectangleGrid(opts.gridWidth!, opts.gridHeight!)
    const shuffledPositions = shuffleArray(gridPositions)
    const shuffledPages = shuffleArray(pagesWithMaturity)
    
    // 將頁面隨機分配到網格位置
    const gridItems: Array<{
      row: number
      col: number
      page?: typeof shuffledPages[0]
    }> = shuffledPositions.map((pos, index) => ({
      row: pos.row,
      col: pos.col,
      page: shuffledPages[index] || undefined,
    }))

    // 統計各類型的數量
    const stats = pagesWithMaturity.reduce((acc, page) => {
      const key = page.maturity
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return (
      <div class="forest-container">
        <div class="forest-grid" style={`--grid-width: ${opts.gridWidth}; --grid-height: ${opts.gridHeight}; --icon-size: ${opts.iconSize};`}>
          {gridItems.map((item, index) => {
            if (!item.page) {
              return (
                <div
                  key={`empty-${index}`}
                  class="forest-cell empty"
                  style={`grid-row: ${item.row + 1}; grid-column: ${item.col + 1};`}
                />
              )
            }
            const link = resolveRelative(fileData.slug!, item.page.slug as FullSlug)
            return (
              <a
                key={item.page.slug}
                href={link}
                class="forest-cell forest-item internal"
                style={`grid-row: ${item.row + 1}; grid-column: ${item.col + 1};`}
                title={`${item.page.title} (${item.page.label})`}
              >
                <span class="forest-icon">{item.page.icon}</span>
              </a>
            )
          })}
        </div>
        <div class="forest-stats">
          <div class="forest-stats-detail">
            {Object.entries(stats).map(([maturity, count]) => {
              const level = maturityLevels[maturity]
              if (!level) return null
              return (
                <span key={maturity} class="forest-stat-item">
                  {level.icon} {level.label}: {count}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  Forest.css = `
  .forest-container {
    width: 100%;
    margin: 2rem 0;
    padding: 0;
    display: block;
  }

  .forest-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-width), 1fr);
    grid-template-rows: repeat(var(--grid-height), 1fr);
    gap: 1px;
    width: 100%;
    aspect-ratio: var(--grid-width) / var(--grid-height);
    padding: 0;
  }

  .forest-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }

  .forest-cell.empty {
    background-color: transparent;
  }

  .forest-item {
    cursor: pointer;
    background-color: transparent !important;
    border: none !important;
    text-decoration: none;
    padding: 0 !important;
    margin: 0;
    box-shadow: none !important;
  }

  /* 覆蓋 internal 連結類別的預設樣式 */
  .forest-item.internal {
    background-color: transparent !important;
    padding: 0 !important;
    border-radius: 0 !important;
  }

  .forest-item:hover {
    /* 移除所有 hover 效果，只保留 cursor: pointer */
    background-color: transparent !important;
    transform: none !important;
  }

  .forest-icon {
    font-size: var(--icon-size);
    line-height: 1;
    display: block;
  }

  .forest-item:hover .forest-icon {
    /* 移除 hover 時的樣式變化 */
  }

  .forest-stats {
    margin-top: 1.5rem;
    padding: 1rem;
    text-align: center;
    border-top: 1px solid var(--border);
  }

  .forest-stats-detail {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--secondary);
  }

  .forest-stat-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  /* 響應式設計 */
  @media (max-width: 768px) {
    .forest-container {
      margin: 1rem 0;
    }

    .forest-grid {
      gap: 0px;
    }

    .forest-icon {
      font-size: calc(var(--icon-size) * 0.8);
    }

    .forest-stats {
      margin-top: 1rem;
      padding: 0.8rem;
    }

    .forest-stats-total {
      font-size: 1rem;
    }

    .forest-stats-detail {
      gap: 0.8rem;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .forest-icon {
      font-size: calc(var(--icon-size) * 0.6);
    }
  }
  `

  return Forest
}) satisfies QuartzComponentConstructor
