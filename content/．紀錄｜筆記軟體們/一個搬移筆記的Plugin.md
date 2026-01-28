---
title:
draft: false
maturity: Tree
---
# 前言
深入研究[Quartz Syncer](https://github.com/saberzero1/quartz-syncer.git) 之後發現它提供**選擇資料夾**上傳的功能，同步的整合也非常完整。但是無法完全符合我的需求：

 - 整齊的檔案結構
 - 精確選擇哪些檔案可以被上傳到Public repo
 
 因此我還是選擇搬移我的筆記到另外一個資料夾，專門做發佈的管理。

# [成果](https://github.com/HXuanHui/obsidian-file-sync.git)

![[screenshotOfFileSync.png]]

## 使用方式

### 1. 設定目的地路徑


1. 開啟「設定」→「File Sync Plugin」
2. 在「Destination Path」輸入目標目錄路徑，或點擊「Browse」按鈕選擇資料夾
    - 例如：`D:\文件\destination` 或 `C:\Backup\notes`

### 2. 選擇要同步的檔案


1. 使用「File Type Filter」下拉選單篩選檔案類型
    - 選項：All Files, .md, .png, .jpg, .pdf, .txt
2. 資料夾操作：
    - 檔案以樹狀結構顯示，子資料夾會縮排在父資料夾下方
    - 點擊資料夾名稱旁的箭頭圖示（▶/▼）可折疊/展開個別資料夾
    - 使用智慧切換按鈕快速管理所有資料夾：
        - 當大部分資料夾展開時，顯示「Collapse」
        - 當大部分資料夾收合時，顯示「Expand」
    - 勾選資料夾旁的勾選框可選擇該資料夾及所有子資料夾內的檔案
    - 資料夾勾選框支援三種狀態：
        - 勾選：所有檔案都被選擇
        - 未勾選：沒有檔案被選擇
        - 半勾選（indeterminate）：部分檔案被選擇
3. 使用勾選框選擇個別檔案
4. 或使用智慧批次選擇按鈕：
    - 未全選時顯示「Select All」- 選擇所有符合篩選的檔案
    - 全選後顯示「Deselect All」- 清除所有選擇
5. **點擊畫面下方的「Save」按鈕儲存您的選擇**
    - 按鈕會在有未儲存變更時高亮顯示
    - 檔案計數會顯示「(unsaved changes)」提示
    - 重新渲染時會自動保持滾動位置，不會跳回頂部

### 3. 執行同步

點擊左側邊欄的 Sync 圖示即可執行同步。

插件會：

- 驗證目的地路徑是否存在
- 複製已儲存選擇的檔案到目的地
- 維持原有的資料夾結構
- 顯示同步進度和結果通知
- 如有錯誤，記錄到 `sync-errors.log` 檔案


## 安裝方式

目前還沒完成release設定以及申請上架，因此暫時只能使用手動安裝。

### 手動安裝


1. 在您的 vault 中找到 `.obsidian/plugins/` 資料夾
2. 建立一個名為 `file-sync-plugin` 的資料夾
3. 將以下檔案複製到該資料夾中：
    - `main.js`
    - `manifest.json`
    - `styles.css`
4. 重新啟動 Obsidian
5. 前往「設定」→「社區插件」→ 確保「安全模式」已關閉
6. 在「已安裝插件」列表中啟用「File Sync Plugin」


# 後記 & 未來展望

目前的搬移邏輯是有選擇的檔案全部都複製過去，當資料量少的時候不是個問題，資料量大的時候最好不要重複搬移重複的檔案。未來規劃利用指令只複製當前開啟的檔案，或者是有變動的檔案統一搬移，參考[git小工具](https://github.com/Vinzent03/obsidian-git)的操作模式。

完成筆記搬移之後規劃利用[Quartz Syncer](https://github.com/saberzero1/quartz-syncer.git)進行發佈，然而我不只一個網站，而這個工具目前看起來只能管理一個網站，因此未來希望可以研究一下這個工具有沒有擴充的空間，讓它成為多網站發佈的管理工具。

# 感謝！
 - [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin.git) 此小工具由官方提供的模版發展。
 - [Google Antigravity](https://antigravity.google/) 利用這次機會實驗各種IDE的差異，感謝Antigravity順利協助完成。