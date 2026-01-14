---
title:
draft: false
maturity: Chest
---

我的搬移規則是把Obsidian Vault下符合以下條件的檔案搬移：
1. 根目錄下僅.md檔
2. 所有「．紀錄｜」開頭的資料夾（符合我原本的資料夾規則）
3. 子資料夾種僅.md檔 與 .png檔
並且排除原本在Obsidian Vault中的.git檔，以免Push上Github Page的干擾。


## 腳本 1：`1_SyncFiles.ps1` (負責搬移與過濾)
```PowerShell
# 強制 UTF8 BOM 編碼
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. 路徑設定
$sourceParent = "我的Obsidian筆記路徑"
$destinationParent = "我的Quartz發布路徑"

Write-Host "--- 開始安全搬移作業 (過濾機密) ---" -ForegroundColor White

# 2. 先清空目的地 content 確保乾淨 (防止舊機密殘留)
if (Test-Path $destinationParent) {
    Remove-Item -Recurse -Force "$destinationParent\*"
} else {
    New-Item -ItemType Directory -Path $destinationParent
}

# 3. 搬移「根目錄下」的所有 .md 檔案 (不進子資料夾)
Write-Host "📄 正在同步根目錄下的 .md 檔案..." -ForegroundColor Green
robocopy "$sourceParent" "$destinationParent" *.md /LEV:1 /R:2 /W:5

# 4. 遍歷並同步「．紀錄｜」開頭的資料夾 (含 .md 與 .png)
Write-Host "📂 正在同步 ．紀錄｜ 開頭的資料夾內容..." -ForegroundColor Cyan
Get-ChildItem -Path $sourceParent -Directory -Filter "．紀錄｜*" | ForEach-Object {
    $folderName = $_.Name
    $dest = Join-Path $destinationParent $folderName
    
    # 同步該資料夾及其子目錄下的 md 和 png，排除其他格式
    robocopy "$($_.FullName)" "$dest" *.md *.png /S /R:2 /W:5
}

# 5. 清除殘留的 .git 紀錄，防止 GitHub 識別為子模組而無法讀取
Write-Host "🧹 正在清除 content 內的 Git 殘留..." -ForegroundColor Magenta
Get-ChildItem -Path $destinationParent -Include ".git" -Recurse -Hidden | Remove-Item -Recurse -Force

Write-Host "---"
Write-Host "✅ 搬移完成！請檢查 D 槽 content 資料夾內容是否正確。" -ForegroundColor Green
Read-Host "按 Enter 鍵結束"
```

以上腳本還有優化的空間。比如說搬移的時候採用`/MIR`並且去掉「先清空目的地 content 確保乾淨」。

## **腳本 2：**`2_PublishToGithub.ps1` (負責上傳與發布)
```PowerShell

# 強制 UTF8 BOM 編碼
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. 路徑設定
$quartzPath = "我的Quartz發布路徑"

Write-Host "--- 開始執行 GitHub 發布作業 ---" -ForegroundColor White

if (Test-Path $quartzPath) {
    Set-Location -Path $quartzPath
    
    # 2. 登記所有變動檔案
    Write-Host "🔍 正在檢查變動..." -ForegroundColor Cyan
    git add .
    
    # 3. 檢查是否有實際變動才進行提交
    $status = git status --porcelain
    if ($status) {
        $commitMsg = "Secure Sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        git commit -m "$commitMsg"
        
        Write-Host "📤 正在上傳至 GitHub 並啟動 Quartz 同步..." -ForegroundColor Yellow
        # 執行 Quartz 同步指令
        npx quartz sync
        
        Write-Host "🚀 上傳成功！網頁將在 1 分鐘後更新。" -ForegroundColor Green
    } else {
        Write-Host "✨ 內容無變動，無需更新 GitHub。" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ 找不到 Quartz 路徑，請確認路徑設定。" -ForegroundColor Red
}

Write-Host "---"
Read-Host "✅ 任務完成！按 Enter 鍵離開"
```

將腳本分為兩個步驟：搬移、同步，提供在本地運行確認效果的機會，因為Push上Github Page要等待時間同步，不滿意的話可能還需要退回版本，嘗試的成本比較高。


## 我做過的其他嘗試
1. Softlink
	 可以想見這對Github Page是行不通的，因為Soft Link是指向本地的資料夾，Github根本無法讀取。
	 雖然在Local運行得非常順利甚至可以達到熱重載的效果，因為對Quartz來說沒有任何文件修改，所以每次的筆記修改都可以非常及時看到效果（Quartz本身的Config等文件修改還是會重新build），給想要這種效果的人參考。

## 未來展望
1. 把這個腳本寫成Obsidian的按鈕，減少發布時切換畫面找腳本的步驟
2. 實現類似IDE Git Tool的功能，可自行選擇要上架的筆記，不被搬移規則限制