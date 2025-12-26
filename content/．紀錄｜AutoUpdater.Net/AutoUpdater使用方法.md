---
theme:
  - default
class: 
paginate: true
header: AutoUpdater使用方法
allowLocalFiles: true
---

## **1. 安裝 AutoUpdater.NET**

### 透過 NuGet Package Manager

``` powershell
Install-Package Autoupdater.NET.Official
```

或在 Visual Studio 的 NuGet 套件管理員中搜尋 "Autoupdater.NET.Official"
![](．紀錄｜AutoUpdater.Net/pictures/Download.png)


---

## **2. 建立伺服器上的 XML 更新檔案**

在伺服器上準備一個 XML 檔案，包含更新資訊。官網範例檔案（update.xml）如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<item>
  <version>2.0.0.0</version>
  <url>https://rbsoft.org/downloads/AutoUpdaterTest.zip</url>
  <changelog>https://github.com/ravibpatel/AutoUpdater.NET/releases</changelog>
  <mandatory>false</mandatory>
</item>
```

- `<version>`：你要釋出的新版本號。
    
- `<url>`：新版安裝程式或壓縮檔下載網址。
    
- `<changelog>`：更新內容說明頁（可省略）。
    
- `<mandatory>`：是否強制更新（true/false，也可在程式內設定請，參閱第6頁）。



---

### 2.1 XML 更新檔案實際操作
本地demo:

1. 在電腦資料夾建立一個檔案 `update.xml`。
    
2. update.xml內容如下
	![](．紀錄｜AutoUpdater.Net/pictures/updateXml.png)

> `url` 需用 `file:///` 作為開頭，指向你本機的安裝程式（可以先隨便放一個 EXE 或 ZIP 測試檔）。

---

## **3. 在程式啟動時檢查更新**
WinForms 範例：
``` csharp
using AutoUpdaterDotNET;

private void Form1_Load(object sender, EventArgs e)
{
    AutoUpdater.Start("https://yourdomain.com/update.xml"); // 每次啟動都檢查更新
}

```
加在程式啟動的地方（例如 MainForm 的 Load event），即可每次啟動都檢查更新。


---

## **4. 進階設定（可選）**
```csharp
using AutoUpdaterDotNET;

private void Form1_Load(object sender, EventArgs e)
{
    SetupAutoUpdater(); // 每次啟動都檢查更新
}

```
---

## **4. 進階設定（可選）（Cont'd）**



```csharp
private void SetupAutoUpdater()
{
    // 設定應用程式標題
    AutoUpdater.AppTitle = "您的系統";
    
    // 設定是否顯示略過按鈕
    AutoUpdater.ShowSkipButton = false;
    
    // 設定是否顯示稍後提醒按鈕
    AutoUpdater.ShowRemindLaterButton = true;
    
    // 設定稍後提醒的時間間隔（分鐘）
    AutoUpdater.RemindLaterTimeSpan = RemindLaterFormat.Minutes;
    AutoUpdater.RemindLaterAt = 30;
    
    // 設定是否強制更新
    AutoUpdater.Mandatory = false;
    
    // 設定下載對話框的模式
    AutoUpdater.DownloadPath = Environment.CurrentDirectory;
    
    // 開始檢查更新
    AutoUpdater.Start("http://your-server.com/version.xml");
}
```

---

## 5. 版本號管理
製作完新版本的程式，在 `AssemblyInfo.cs` 中設定版本號：
```csharp
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]
```
或在專案檔中：
```xml
<PropertyGroup>
<Version>1.0.0.0</Version>
<AssemblyVersion>1.0.0.0</AssemblyVersion>
<FileVersion>1.0.0.0</FileVersion>
</PropertyGroup>
```


---

## 6. 運行結果



![width 50%](．紀錄｜AutoUpdater.Net/pictures/Updater.png)


