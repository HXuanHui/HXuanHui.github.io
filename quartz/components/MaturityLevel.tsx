// MaturityLevel.tsx - Quartz 成熟度系統組件
// 放置位置: quartz/components/MaturityLevel.tsx

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export default (() => {
  const MaturityLevel: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    // 從 frontmatter 讀取成熟度等級
    const maturity = fileData.frontmatter?.maturity?.toString().toLowerCase()
    
    // 成熟度等級定義
    const maturityLevels: Record<string, { icon: string; label: string; description: string }> = {
      "1": {
        icon: "🌱",
        label: "Seedling",
        description: "剛起步的想法，簡短的筆記"
      },
      "seedling": {
        icon: "🌱",
        label: "Seedling",
        description: "剛起步的想法，簡短的筆記"
      },
      "2": {
        icon: "🌿",
        label: "Sapling",
        description: "有實質內容，但仍在發展中"
      },
      "sapling": {
        icon: "🌿",
        label: "Sapling",
        description: "有實質內容，但仍在發展中"
      },
      "3": {
        icon: "🌳",
        label: "Tree",
        description: "成熟完整的文章或思考"
      },
      "tree": {
        icon: "🌳",
        label: "Tree",
        description: "成熟完整的文章或思考"
      },
      "withered": {
        icon: "🍂",
        label: "Withered",
        description: "過時的觀點，保留作為歷史記錄"
      },
      "stone": {
        icon: "🪨",
        label: "Stone",
        description: "從其他來源匯入的筆記（如閱讀筆記）"
      },
      "signpost": {
        icon: "🪧",
        label: "Signpost",
        description: "導航用頁面（如索引、目錄）"
      },
      "chest": {
        icon: "🗃️",
        label: "Chest",
        description: "工具、How-to 文件"
      }
    }

    // 如果沒有設定成熟度，返回 null
    if (!maturity || !maturityLevels[maturity]) {
      return null
    }

    const level = maturityLevels[maturity]

    return (
      <div class="maturity-badge" title={level.description}>
        <span class="maturity-icon">{level.icon}</span>
        <span class="maturity-label">{level.label}</span>
      </div>
    )
  }

  MaturityLevel.css = `
    .maturity-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.7rem;
      background-color: var(--highlight);
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      border: 1px solid var(--lightgray);
      transition: all 0.2s ease;
    }

    .maturity-badge:hover {
      background-color: var(--lightgray);
      border-color: var(--gray);
    }

    .maturity-icon {
      font-size: 1.1rem;
      line-height: 1;
    }

    .maturity-label {
      font-weight: 500;
      color: var(--darkgray);
      font-family: var(--bodyFont);
    }

    /* 暗色模式調整 */
    .darkmode .maturity-badge {
      background-color: var(--highlight);
      border-color: var(--lightgray);
    }

    .darkmode .maturity-label {
      color: var(--dark);
    }
  `

  return MaturityLevel
}) satisfies QuartzComponentConstructor
