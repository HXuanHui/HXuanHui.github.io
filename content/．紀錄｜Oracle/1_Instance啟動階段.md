### **1. NOMOUNT 階段**

- Oracle軟體定位參數檔案（SPFILE或PFILE）
- 分配記憶體給System Global Area (SGA)
- 啟動背景程序
- 開啟alert log和trace檔案
- **使用時機**：建立資料庫、重新建立控制檔案、特定備份和復原作業

### **2. MOUNT 階段**

- Oracle軟體將資料庫與已啟動的實例關聯
- 開啟並讀取初始化參數檔案中指定的控制檔案
- 取得資料檔案和線上重做日誌檔案的名稱和狀態
- **注意**：此階段不會驗證資料檔案和重做日誌檔案是否真實存在
- **使用時機**：重新命名資料檔案、執行完整資料庫復原

### **3. OPEN 階段**

- 根據控制檔案中的清單開啟重做日誌檔案和資料檔案
- 檢查資料庫一致性
- 讓使用者能夠連接到資料庫實例
- **注意**：預設情況下，PDBs不會在CDB開啟時自動啟動



**啟動順序：**

```sql
STARTUP NOMOUNT → MOUNT → OPEN
```

- **NOMOUNT**：啟動Instance，讀取parameter file，分配SGA，啟動background processes
- **MOUNT**：讀取control files，取得data files和redo log files資訊
- **OPEN**：開啟data files和redo log files，檢查資料庫一致性

**常用啟動命令：**

```sql
SQL> STARTUP                    -- 等同於 STARTUP OPEN
SQL> STARTUP NOMOUNT
SQL> ALTER DATABASE MOUNT;
SQL> ALTER DATABASE OPEN;
```

## **資料庫實例關閉模式**

| 模式            | 允許新連線 | 等待目前會話結束 | 等待目前交易結束 | 強制檢查點並關閉檔案 |
| ------------- | ----- | -------- | -------- | ---------- |
| NORMAL        | 否     | 是        | 是        | 是          |
| TRANSACTIONAL | 否     | 否        | 是        | 是          |
| IMMEDIATE     | 否     | 否        | 否        | 是          |
| ABORT         | 否     | 否        | 否        | 否          |

### **各模式詳細說明**

**NORMAL模式（預設）**：

- 不允許新連線
- 等待所有使用者斷線才完成關閉
- 資料庫和重做緩衝區寫入磁碟
- 背景程序終止，SGA從記憶體移除

**IMMEDIATE模式（最常用）**：

- 目前執行中的SQL語句不會完成
- 不等待使用者斷線
- 回滾活動交易並斷開所有連線使用者
- 在關閉實例前先關閉和卸載資料庫

**TRANSACTIONAL模式**：

- 不允許用戶端開始新交易
- 當用戶端結束進行中的交易時斷開連線
- 所有交易完成後立即關閉

**ABORT模式（緊急使用）**：

- 立即終止目前的SQL語句
- 不等待使用者斷線
- 資料庫和重做緩衝區不寫入磁碟
- 未確認的交易不會回滾
- 實例在不關閉檔案的情況下終止
- **後果**：下次啟動需要實例復原（自動執行）


## **PDB的管理**

### **PDB啟動**

- CDB重啟後，PDBs預設保持在MOUNT模式
- 個別開啟：`ALTER PLUGGABLE DATABASE pdb_name OPEN;`
- 全部開啟：`ALTER PLUGGABLE DATABASE ALL OPEN;`

### **自動開啟PDB**

- 儲存狀態：`ALTER PLUGGABLE DATABASE pdb_name SAVE STATE;`
- 放棄狀態：`ALTER PLUGGABLE DATABASE pdb_name DISCARD STATE;`
- 查詢儲存狀態：`SELECT * FROM DBA_PDB_SAVED_STATES;`

---

## **我認為需要特別說明的部分**

### **1. ABORT模式的風險性**

您的教材雖然提到ABORT模式，但我覺得需要特別強調其危險性。ABORT模式會讓資料庫處於不一致狀態，因為：

- 未提交的交易不會回滾
- 緩衝區的內容不會寫入磁碟
- 下次啟動必須進行實例復原

### **2. 實例復原的自動化**

當使用ABORT模式關閉或發生實例故障後，下次啟動時會自動進行實例復原，這個過程包括：

- SMON程序會自動執行
- 重新應用所有已提交的交易
- 回滾所有未提交的交易

### **3. CDB與PDB的關係**

在19c的多租戶架構中，需要理解：

- CDB開啟不代表PDB也開啟
- PDB的狀態需要單獨管理
- SAVE STATE功能對自動化管理很重要

這些概念在實際DBA工作中非常重要，特別是在規劃維護窗口和災難復原策略時。

# 問題及複習
1. [rollforward跟rollback](rollforward跟rollback.md)
2. [如果沒有設置 undo_retention 的話 commit之後 undo的資料就會被清空了是嗎？](如果沒有設置%20undo_retention%20的話%20commit之後%20undo的資料就會被清空了是嗎？.md)
3. [哪個tablespace會在commit之後資料就清除？](哪個tablespace會在commit之後資料就清除？.md)
4. [parameter file可以在open的時候修改，但是因為nomount就會讀取了，所以必須重啟可以使用starup force，對嗎？](parameter%20file可以在open的時候修改，但是因為nomount就會讀取了，所以必須重啟可以使用starup%20force，對嗎？.md)