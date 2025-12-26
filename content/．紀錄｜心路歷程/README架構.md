---
draft: true
---

[Using your GitHub profile to enhance your resume - GitHub Docs](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/using-your-github-profile-to-enhance-your-resume)
# **Password Modification Management**

- 管理密碼修改規則的網站

## 功能

1. **相機控制**：應用程式可以啟動或停止網路鏡頭。
2. **影像捕捉**：系統會定期從鏡頭捕捉照片並上傳至臉部辨識 API。
3. **臉部辨識**：從鏡頭捕捉的影像會發送至API 進行臉部辨識。
4. **結果顯示**：辨識結果會在網頁上顯示，顯示個人名字。

### 使用步驟

1. **啟動鏡頭**
    
    - 在網頁上切換開關按鈕來啟動網路鏡頭。當鏡頭成功啟動後，畫面會顯示在網頁上。
2. **捕捉照片**
    
    - 開啟鏡頭後，系統會每隔 1700 毫秒捕捉一次影像並自動上傳至 API 進行臉部辨識。
3. **顯示辨識結果**
    
    - 如果臉部辨識成功，頁面會顯示該人名。如果辨識過程中發生錯誤，訊息會顯示在畫面。
## **系統架構或邏輯概述 (Architecture or Logic Overview)**

**系統架構：**

- 系統由三層組成：前端 (React)、後端 (.Net Core API)、資料庫 (Oracle)。
- 前端 (Frontend)：使用 React.js 負責用戶界面顯示。
- 後端 (Backend)：使用 .Net Core API 處理用戶請求並與資料庫互動。
- 資料庫 (Database)：使用 Oracle 存儲用戶數據。

**邏輯流程：**

4. 用戶訪問登入程式管理網站，輸入用戶名和密碼。
5. 發送帳號及加密密碼至API `sign-in` 進行驗證。
6. 帳號密碼權限正確，API 回傳 Token。
7. 網站跳轉至`/password-management`頁面。
8. API `modify-management`提供讀取、新增、刪除、修改。
9. API `feature-options`返回feature選項。
10. 登出時刪除token。

**錯誤處理**
- 如果鏡頭無法啟動，會顯示錯誤訊息，並且頁面會顯示一個沒有鏡頭的覆蓋圖層。
- 如果臉部辨識 API 呼叫失敗，錯誤訊息會在控制台中列印。
- 如果無法辨識人臉，訊息會顯示在畫面
    - 遮蓋臉部的錯誤(error 7)
    - 無人臉的錯誤(code -300)

### 安裝與部署指南 (Installation & Deployment)
添加一些部屬方式

### **目錄結構 (Directory Structure)**
```
password-modifying-management.client/  # 前端專案根目錄
├── index.html                        # 前端入口文件
├── package.json                      # 專案配置檔案 (管理依賴和腳本)
├── package-lock.json                 # 鎖定依賴版本 (自動生成)
├── public/                           # 公共靜態資源
├── README.md                         # 專案說明文件
├── src/                              
│   ├── App.css                       # 全局樣式
│   ├── App.jsx                       # 根組件
│   ├── Components/                   
│   │   ├── Common/                   # 通用元件
│   │   │   ├── AuthButton.jsx        # 登入驗證按鈕
│   │   │   ├── Header.jsx            # 頁面標題
│   │   │   ├── TableFilter.jsx       # 表格過濾器
│   │   └── Login/                    # 登入頁相關元件
│   │   │   ├── Login.jsx             # 登入頁
│   │   └── ManageOption/             
│   │       ├── ManageOption.jsx      # 選項管理主元件(未使用)
│   │   └── ManageUser/              
│   │       ├── ManageOption.jsx      # 使用者管理主元件(未使用)
│   │   └── TablePage/                
│   │       ├── ActionBar.jsx         # 表格操作列
│   │       ├── TablePage.jsx         # 表格主頁
│   ├── Hooks/                        
│   │   ├── useAuthHook.js            # 驗證相關 Hook
│   │   ├── useTableFilterHook.js     # 表格過濾器 Hook
│   ├── index.css                     # 預設樣式
│   ├── main.jsx                      # 應用程式入口
│   ├── Service/                      
│       ├── alertService.jsx          # 提示服務
├── tailwind.config.js                # Tailwind 配置
├── vite.config.js                    # Vite 配置


password-modifying-management.Server/   # API專案根目錄
├── appsettings.Development.json       # 開發環境設定檔
├── appsettings.json                   # 一般設定檔
├── Configurations/                    
│   ├── login-permissions.json         # 登入權限設定檔
│   ├── users.json                     # 測試版用的使用者資料設定檔
│
├── Controllers/                       # API 控制器
│   ├── FeatureController.cs           # 處理功能相關 API
│   ├── FeatureOptionController.cs     # 處理功能選項相關 API
│   ├── SignController.cs              # 處理登入註冊相關 API
├── Domain/                            # 領域層 (Domain Models 和 DTO)
│   ├── Feature/                       
│   │   ├── FeatureDTO.cs              # 功能資料的主 DTO
│   │   ├── GetFeatureDTO.cs           # 讀取功能資料的 DTO
│   │   └── PutFeatureDTO.cs           # 更新功能資料的 DTO
│   ├── FeatureOption/                 
│   │   ├── GetFeatureOptionDTO.cs     # 讀取功能選項的 DTO
│   │   └── PutFeatureOptionDTO.cs     # 更新功能選項的 DTO
│   ├── Sign/                          
│   │   ├── SignInRequestDTO.cs        # 登入請求的 DTO
│   │   ├── SignInResponseDTO.cs       # 登入回應的 DTO
│   │   ├── SignUpRequestDTO.cs        # 註冊請求的 DTO
│   │   └── UserDTO.cs                 # 使用者資料 DTO
├── Middlewares/                       # 中介層 (Middlewares)
│   ├── JwtAuthenticationMiddleware.cs # JWT 驗證中介層
├── Models/                            # 資料模型和資料庫相關
│   ├── AncestorDbContext.cs           # Ancestor資料庫Context (X86)
│   ├── DBEntities/                    # 資料庫實體
│   │   ├── FeatureEntities.cs         # 功能資料的資料庫實體
│   │   ├── FeatureOptionEntities.cs   # 功能選項的資料庫實體
│   │   └── SignEntities.cs            # 登入/註冊相關資料庫實體
│   ├── featureLabels.cs               # 功能標籤
│   ├── InMemDbContext.cs              # 記憶體資料庫Context (測試用)
│   ├── OracleDbContext.cs             # Oracle 資料庫Context
│   ├── Repository/                    # 資料倉儲
│   │   ├── AncestorFeatureRepo.cs     # Ancestor功能資料倉儲 (X86)
│   │   ├── InMemFeatureOptionRepo.cs  # 記憶體功能選項資料倉儲
│   │   ├── InMemFeatureRepo.cs        # 記憶體功能資料倉儲
│   │   ├── Interface/                 # 倉儲介面
│   │   │   ├── IFeatureOptionRepository.cs # 功能選項資料的介面
│   │   │   ├── IFeatureRepository.cs       # 功能資料的介面
│   │   │   ├── ISignPermissionRepository.cs# 登入權限資料的介面
│   │   │   └── ISignRepository.cs          # 登入資料的介面
│   │   ├── LocalSignRepo.cs           # 本地登入資料倉儲
│   │   ├── OracleFeatureOptionRepo.cs # Oracle 功能選項資料倉儲
│   │   ├── OracleFeatureRepo.cs       # Oracle 功能資料倉儲
│   │   ├── OracleSignPermissionRepo.cs# Oracle 登入權限資料倉儲
│   │   └── OracleSignRepo.cs          # Oracle 登入資料倉儲

```

## **常見問題 (FAQ)**
- Q: 如何連接資料庫？  
    1. 修改`appsettings.json` 連線字串  
    2. 檢查`program.cs`註冊的服務是否為正確的資料庫，根據需求連接InMem/Oracle/Ancestor資料庫。
- Q: 如何設定登入權限？  
    A: 修改`Configurations/login-permissions.json`設定檔。  
    
- Q: 如何設定API連接？  
    A: 修改前端`Hooks/tableHooks` `API_BASE_URL`。

## 未來改進
- 更多API結果解析