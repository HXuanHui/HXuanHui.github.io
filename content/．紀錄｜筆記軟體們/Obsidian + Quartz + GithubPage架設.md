---
title:
draft: false
maturity: Tree
---
# 前言
我從學生時期就使用Obsidian+Github的組合在各個裝置上面編輯筆記，將網站架設在github page上面是熟悉的，因此採用這個組合。

# 步驟

## 環境準備

在開始之前，請確保電腦已安裝：

1. **Node.js** 
    
2. **Git**
    
3. 一個 **GitHub 帳號**
    

---

## 建立Quartz專案

1. **打開終端機 (Terminal/CMD)**，執行以下指令來下載並初始化 Quartz：
    
    ```
    git clone https://github.com/jackyzha0/quartz.git
    cd quartz
    npm i 
    npx quartz create
    ```

>[!notes]
>如原本就有Node.js環境的人，在這個步驟可能遇到npx, npm或Node.js本身版本不符的問題。再根據指示執行升級(npx,npm）或重新下載新版本的Node.js。
>
>重新下載環境的人需要以Admin身份去改PowerShell的執行原則`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`。


2. **依照提示選擇：**
    
    - 選擇 `Empty Quartz` (最乾淨，適合新手)。
        
    - 選擇 `Treat links as shortest path` (這與 Obsidian 預設的連結方式一致)。
        

---

## 同步 Obsidian 筆記

1. 找到 Quartz 資料夾內的 `content` 子資料夾。

2. **將 Obsidian 筆記（.md 檔案）複製到這個 `content` 資料夾中。**
	
	我有自己的檔案夾結構，直接在content中撰寫筆記會破壞我的規則，所以我決定把我的筆記複製一份到Content，雖然這樣資料會冗於，但是這麼做還可以控管哪些資料可以公開在網路上（使用Git Page架網站，Repo必須是Public，這不是設置網站的[draft tag](#隱私保護)可以控管的），[[Obsidian筆記搬移腳本|我還寫了一些腳本搬移筆記跟上架，期許我之後能寫成一個Obsidian Plugin]]。

    - _提示：`index.md` 將會是網站首頁。_

2. 在本地預覽看看效果：
    
    ```
    npx quartz build --serve
    ```
    
    打開瀏覽器輸入 `http://localhost:8080`，就能看到網頁了。
    

---

## 發佈到 GitHub Pages


1. **在 GitHub 上建立新倉庫：**
    
    - 建立一個新的 Repository，名稱自訂（例如 `my-notes`）。**不要**勾選 Initialize with README。


	之後還是可以在repo中自行添加或修改README（在[這個步驟](#建立Quartz專案)直接clone人家的repo的話，會自動附帶他們的README），讓網路上順藤摸瓜想要知道底層程式碼的小變態😈可以好好了解了解！
        
2. 連結本地與遠端：
    
    在 Quartz 資料夾執行：
    
    ```
    git remote remove origin
    git remote add origin https://github.com/自己的帳號/倉庫名.git
    git remote -v
    ```
	先把跟大神開發好的repo斷連結之後接上自己的倉庫。最後再確認自己有成功接上自己的倉庫。


2. 設定 GitHub Actions (自動部署)：
    
    Quartz 內建了 GitHub Actions 腳本。只需在 GitHub 倉庫的網頁端做一個設定：
    
    - 進入 GitHub 倉庫的 **Settings** > **Pages**。
        
    - 在 **Build and deployment** 下方的 **Source**，將 `Deploy from a branch` 改為 **`GitHub Actions`**。
        
3. 推送代碼：
    
    回到終端機，執行 Quartz 專案專用的同步指令：
    
    ```
    npx quartz sync
    ```
    
    這個指令會自動 `git push` 到分支 `v4`。
    

---

## 隱私保護

如果有些筆記不想公開，可以在筆記的 YAML 區塊加入 `draft: true`，Quartz 就不會發佈該篇筆記。

但是請注意**githubPage必須在Repo公開的情況下才能運作**，所以就算在網頁上面看不到，搜尋github repo也能找到push的資料。

---

## 畫面修改
參考了原生Obsidian Page的配置還有參考了[大神的知識森林跟成熟度系統](https://hermitage.utsob.me/)。

**1. [[Digital-Garden-like local graph|Graph 視覺化]]**
- 節點更大更清晰（3-12 範圍）
- 節點間距增加（linkDistance 100）
- 當前節點高亮（額外圓圈）
- 標籤始終可見（alpha: 1）
- 連線更細（width: 0.5）
- 初始視圖最佳化（zoomToFit）

**2. [[Digital-Garden-like local graph|互動功能]]**
-  深度滑桿控制（1-3 層）
-  實時預覽（不重置視圖）
-  平滑過渡動畫（200ms）
-  智能縮放範圍（0.1-10x）

**3. 佈局優化**
-  側邊欄整體滾動
-  組件始終展開（Explorer, TOC）
-  字體大小優化（0.82-0.85rem）
-  間距調整（padding, gap）
-  響應式設計

**4. [[Digital Garden Forest Porting|成熟度系統]]**
-  7 個成熟度等級
-  視覺化徽章
-  Explorer 圖標整合
-  知識森林視覺化（20x10 網格）
-  統計面板
---
# 後記
其實在問Gemini有沒有繞過obsidian官方publish的解方的時候(更早之前我在研究Github Page)它給我以下三個選項：

| **方案**                    | **費用** | **技術難度**     | **自定義程度** | **特色**      |
| ------------------------- | ------ | ------------ | --------- | ----------- |
| **Obsidian Publish**      | 高      | 極低           | 中         | 官方支持、最穩定    |
| **Quartz (GitHub Pages)** | 免費     | 中 (需懂一點 Git) | 極高        | 支援圖譜、搜尋，最美觀 |
| **Digital Garden 插件**     | 免費     | 低            | 中         | 操作最接近原生插件   |
看起來Digital Garden是個不錯的選項，最接近原生插建技術難度又低，事實也是如此，我在架設好Quartz之後做了[[Digital-Garden-like local graph|多嘗試讓外觀跟一些小工具貼近原生還有Digital Garden的設置]]。

這邊附上[Digital Garden](https://github.com/oleeskild/obsidian-digital-garden?tab=readme-ov-file)的github。讓大家少走點灣路；D


# Refrenece
1. https://quartz.jzhao.xyz/
2. https://hermitage.utsob.me/
3. https://dowremi.org/Quartz-+-GitHub-+-Cloudflare-Pages-%E9%83%A8%E7%BD%B2%E7%B4%80%E9%8C%84/Quartz-+-GitHub-+-Cloudflare-Pages-%E9%83%A8%E7%BD%B2%E7%B4%80%E9%8C%84
