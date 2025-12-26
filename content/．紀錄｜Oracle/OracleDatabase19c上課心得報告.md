---
marp: true
theme: gaia
paginate: true
style: |
  section {
    font-size: 28px;
    padding: 90px;
  }
  h1, h2 {
    color: #f05b62; /* Oracle red */
  }
  ul, ol {
    list-style-position: inside;
  }
  img{display: block; margin:0 auto;max-width: 100%;max-height: 80%;object-fit: contain;
  }
  table{font-size:24px}
---

![bg left:40% opacity:0.5](．紀錄｜Oracle/Oracle封面.png) 

# Oracle Database 19c 上課心得報告

**黃暄惠**  
  

---

## 課程的重點學習內容

課程涵蓋Oracle 19c的多租戶容器資料庫（CDB）和可插拔資料庫（PDB），我挑選三個在實作和後續任務中印象最深的內容分享。
 - **資料字典建立**
 - **使用者與角色管理**
 - **交易與恢復機制**


---

### 資料字典建立


兩種建立方式：  

- 使用DBCA（Database Configuration Assistant）：自動執行catalog.sql和catproc.sql腳本，一次建立好資料字典視圖、內建套件和必要功能。
- 手動使用CREATE DATABASE SQL命令：需自行執行catalog.sql和catproc.sql來補齊字典，否則資料庫功能不完整。  


```sql
-- 範例：手動建立後執行腳本
@$ORACLE_HOME/rdbms/admin/catalog.sql -- catalog建立核心資料字典
@$ORACLE_HOME/rdbms/admin/catproc.sql -- catproc建立PL/SQL內建套件
```

---

### 使用者與角色管理


- **使用者（User）**：是資料庫中可登入的帳號實體。每個使用者帳號通常擁有一個預設的 Schema，作為使用者建立和擁有的資料庫物件的集合。
- **角色（Role）**：是多個相關權限的集合，簡化權限管理。 必須透過GRANT命令分配給使用者才生效，不能直接登入。  
- 權限分為**系統權限**（如CREATE SESSION，允許登入）和**物件權限**（如SELECT ON特定表格）。  

---

### 使用者與角色管理


``` sql
CREATE USER myuser --可登入的實體
GRANT DBA TO myuser --Role授權給User
GRANT SELECT ON table TO anotheruser --將物件權限直接授權給其他User
``` 

---

### 交易與恢復機制

|方面|Rollback (回滾)|Rollforward (前滾)|
|---|---|---|
|**記錄什麼**|如何取消變更 |如何重做變更|
|**儲存位置**|Undo segments (undo表空間)|Redo log files|
|**主要用途**|交易回滾、讀取一致性、閃回、失敗恢復|資料庫前滾（恢復已提交變更）、instance/media recovery|
|**SQL命令**|`ROLLBACK;`|無直接命令（自動或在`RECOVER`中使用）|

---

### 交易與恢復機制(Cont'd)

| 方面        | Instance Recovery     | Media Recovery             |
| --------- | --------------------- | -------------------------- |
| **觸發原因**  | 實例崩潰（e.g., 電源中斷、軟體故障） | 實體媒體損壞（e.g., 資料檔遺失、磁碟故障）   |
| **執行方式**  | 自動（SMON處理）            | 手動（DBA使用RMAN或SQL）          |
| **依賴資源**  | 現有redo log和undo data  | 備份（cold/hot）+archive log   |
| **恢復範圍**  | 崩潰前的最新點（無資料遺失）        | 備份點到最新log點（可能有遺失）          |
| **時間複雜度** | 通常較快（自動、內存操作）         | 較慢（需還原備份並應用log）            |
| **命令/工具** | 無需手動命令（自動）            | `RECOVER DATABASE;` (RMAN) |


---

## 課程內容與 PostgreSQL 建置的關聯

在建置PostgreSQL資料庫的任務中，我發現許多概念與Oracle相通，這強化了我的記憶；但也有些差異，讓我反思課程內容。  

- **相似部分**：

| **項目** | **Oracle** | **PostgreSQL** |
|------|-------------------|-----------------|
| **Tablespace** | 用來管理儲存空間，分為永久和臨時Tablespace。 | 同樣用來管理儲存空間，類似永久和臨時Tablespace。 |
| **控制檔案** | Control File儲存資料庫元資料，如檔案位置和狀態。 | pg_control檔案類似，儲存元資料（如檢查點資訊），但格式和功能與Oracle不同，較簡化。



---
- **差異部分**：


| **項目**            | **Oracle**                       | **PostgreSQL**            |
|---------------------|---------------------------------------------|------------------------------------------|
| **建置工具**        | 使用DBCA或SQL命令 | 使用initdb命令初始化，搭配postgresql.conf設定檔，流程更簡潔。 |
| **角色管理**        | 角色（Role）為權限集合，需透過GRANT分配，支持系統權限和物件權限。 | ROLE可嵌套分配權限，無明確區分系統/物件權限。 |
| **複雜度與靈活性**  | Oracle，適合企業環境，預設值需調校，但功能全面。 | PostgreSQL更簡潔，預設值較適合小型環境，但需手動配置權限與參數。 |

---
# 講稿

課程結束時，我最初並未感受到強烈衝擊，因為日常工作較少涉及資料庫建立或參數調整。但是有這些基礎知識之後，讓我能理解團隊討論的議題和問題點。之後我有工作內容的需求開始建立postgresql，這項任務讓我比較兩個資料庫管理系統在建構上的異同，反過來重新審視課程內容，鞏固了我在這段時間的學習。

---
## 課程的重點學習內容

課程涵蓋Oracle 19c的多租戶容器資料庫（CDB）和可插拔資料庫（PDB），然後Oracle版本是向前兼容的所以我們可以依舊保持11g的架構，因此我今天報告的重點放在三個在實作和後續任務中印象最深的內容分享。

---

### 資料庫字典建立
我們在上課的時候很常透過資料庫字典中的table或view去查看資料庫中的metadata，而要看到這些物件的話需要在資料庫創建的時候透過腳本建立，否則資料庫僅有基本結構，缺少進階查詢功能，可以說是不完全的資料庫；但是透過工具建置db的話，會自動跑好所以就不用擔心沒有這些重要的物件。

---
### 使用者與角色管理
我對於user跟role的概念很模糊，尤其在接觸過postgresql之後就更混淆了我的觀念，因為PostgreSQL的ROLE可同時作為登入帳號和權限集合，與Oracle的嚴格分離不同。在oracle中雖然Role主要用來授權給User，但User也可透過GRANT將物件權限直接授權給其他User。然而，混淆User和Role會導致權限管理混亂，在同事之間交流也會變得很混亂，所以我特別提出這個章節來提醒自己。

---
### 交易與恢復機制

老師花了不少時間講解這部分，包含機制介紹還有參數設定等，對我來說真的覺得還蠻複雜的，結業回來之後還花了一些時間複習。  
在資料庫端的交易與恢復機制中，Rollback是對我來說個熟悉的概念，他的作用是將未commit的變更儲存於Undo Tablespace，以支援交易回滾、讀取一致性或閃回操作。課程中，老師詳細介紹了相關參數設定，例如UNDO_RETENTION，決定未commit資料的保留時間（單位：秒），以及RETENTION GUARANTEE選項，確保不覆蓋未過期的Undo資料。
相較之下，我對Rollforward非常不熟悉，希望大家也不要在工作中常常遇到需要rollforward的情況。rollforward這一機制在Instance Recovery或Media Recovery期間，應用Redo Log中已commit但尚未寫入Datafile的變更，以恢復資料庫至一致狀態。
在這個章節，老師也有稍微介紹media recovery，但是只是稍微提到而已因為這個內容龐大到可以再開一堂課。
instance recovery發生的時候System Monitor會自動先執行rollforward把已經commit的資料恢復，再執行 rollback把undo log中的資料恢復。

---
老師說學oracle就是學oracle不要帶著其他資料庫的思維去考驗他，其實我深有體驗，我在兩個資料庫都不熟悉的情況下，其實容易搞混，而且有的時候觀念會轉不過來，但是藉由這個機會我也在去複習了不是很熟悉的部分，從他們的差異去深入了解他們的特性。

像是相似的部分增加了我的記憶。
- 比如說在這兩個資料庫系統中Tablespace都用來管理儲存空間；；控制檔案（Oracle的Control File vs. PostgreSQL的pg_control，用來存元資料）。  

---
差異的部分就如同我先前提到的，oracle的role管理較為嚴謹複雜，oracle也有更多的參數可以調整。

這堂課真的非常豐富，特別是Rollback和Rollforward連結了從資料庫啟動至恢復的知識，但是還有很多部分老師都沒有細講，期待未來學長的發揮。
