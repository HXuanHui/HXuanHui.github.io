---

title:

draft: false

maturity: tree

---

# Instance準備
## 1. Parameter File 的準備

### 方法一：從通用範本複製修改（建議新手使用）

```bash
# 1. 設定環境變數
$ . oraenv
ORACLE_SID = [orclcdb] ? mynewdb

# 2. 複製通用範本
$ cp $ORACLE_HOME/dbs/init.ora $ORACLE_HOME/dbs/initmynewdb.ora

# 3. 編輯參數檔案
$ vi $ORACLE_HOME/dbs/initmynewdb.ora
```

在 `initmynewdb.ora` 中，您需要設定這些基本參數：

```
# 基本必要參數
db_name=mynewdb
db_block_size=8192
control_files='/u01/app/oracle/oradata/MYNEWDB/control01.ctl','/u01/app/oracle/fast_recovery_area/MYNEWDB/control02.ctl'
db_create_file_dest='/u01/app/oracle/oradata'
db_recovery_file_dest='/u01/app/oracle/fast_recovery_area'
db_recovery_file_dest_size=12G
enable_pluggable_database=TRUE
remote_login_passwordfile='EXCLUSIVE'
undo_management=AUTO
undo_tablespace='UNDOTBS1'
```

### 方法二：從現有資料庫複製修改

```bash
# 複製現有的參數檔案
$ cp $ORACLE_HOME/dbs/initorclcdb.ora $ORACLE_HOME/dbs/initmynewdb.ora

# 編輯參數檔案，修改相關設定
$ vi $ORACLE_HOME/dbs/initmynewdb.ora
```

## 2. Password File 的準備

使用 `orapwd` 工具建立：

```bash
# 建立 password file
$ orapwd file=$ORACLE_HOME/dbs/orapwmynewdb password=your_sys_password entries=10
```

參數說明：

- `file`: password file 的路徑和名稱（格式：orapw+ORACLE_SID）
- `password`: SYS 使用者的密碼
- `entries`: 可以存放的特權使用者數量（建議10）

## 3. Parameter File 搜尋順序

教材中提到Oracle會按照以下順序搜尋參數檔案：

1. `$ORACLE_HOME/dbs/spfile$ORACLE_SID.ora` (二進位檔案)
2. `$ORACLE_HOME/dbs/spfile.ora` (通用二進位檔案)
3. `$ORACLE_HOME/dbs/init$ORACLE_SID.ora` (文字檔案)

## 4. PFILE 與 SPFILE 互轉

建立好資料庫後，您可以將文字檔案轉為二進位檔案：

```sql
-- 啟動到 nomount 狀態
SQL> startup nomount

-- 建立 spfile
SQL> create spfile from pfile;

-- 重新啟動使用 spfile
SQL> shutdown immediate
SQL> startup
```

## 完整範例流程

```bash
# 1. 設定環境變數
$ export ORACLE_SID=mynewdb

# 2. 準備參數檔案
$ cp $ORACLE_HOME/dbs/init.ora $ORACLE_HOME/dbs/initmynewdb.ora
$ vi $ORACLE_HOME/dbs/initmynewdb.ora  # 編輯必要參數

# 3. 建立 password file
$ orapwd file=$ORACLE_HOME/dbs/orapwmynewdb password=cloud_4U entries=10

# 4. 更新 /etc/oratab
$ echo "mynewdb:$ORACLE_HOME:N" >> /etc/oratab

# 5. 啟動 instance 並建立資料庫
$ sqlplus / as sysdba
SQL> startup nomount
SQL> CREATE DATABASE mynewdb ...
```

**注意事項**：

- 修改參數檔案時，路徑要確實存在
- Password file 的命名格式必須是 `orapw + ORACLE_SID`
- 建議先用 PFILE 建立資料庫，成功後再轉成 SPFILE

這樣就可以成功準備Instance所需的檔案了！

### **Instance 架構組成**

Instance由三個主要結構組成：

- **Memory Structures (記憶體結構)**：SGA (System Global Area) + PGA (Program Global Area)
- **Process Structures (程序結構)**：Background processes
- **Storage Structures (儲存結構)**：Physical files


### **記憶體管理模式**

**三種管理模式：**

1. **Automatic Memory Management (AMM)**：`MEMORY_TARGET > 0`
2. **Automatic Shared Memory Management (ASMM)**：`SGA_TARGET > 0`
3. **Manual Memory Management**：手動設定各記憶體元件

**關鍵參數：**

```sql
-- 檢視記憶體參數
SQL> SHOW PARAMETER MEMORY_TARGET;
SQL> SHOW PARAMETER SGA_TARGET;
SQL> SHOW PARAMETER PGA_AGGREGATE_TARGET;
```

### **CDB/PDB Instance 管理**

**PDB狀態管理：**

```sql
-- 檢視PDB狀態
SQL> SHOW PDBS;

-- 開啟所有PDB
SQL> ALTER PLUGGABLE DATABASE ALL OPEN;

-- 儲存PDB狀態
SQL> ALTER PLUGGABLE DATABASE ALL SAVE STATE;
```
# **Alert Log (警告日誌)**

### **Alert Log 基本概念**

Alert Log是Oracle自動建立的重要診斷文件，記錄資料庫的關鍵事件和錯誤。

**Alert Log內容包含：**

- 非預設初始化參數
- 所有內部錯誤 (ORA-600)、區塊損毀錯誤 (ORA-1578)、死鎖錯誤 (ORA-60)
- 管理作業：CREATE、ALTER、DROP DATABASE、TABLESPACE等
- STARTUP、SHUTDOWN、ARCHIVE LOG、RECOVER等命令
- Shared Server和Dispatcher程序相關訊息
- 具體化視圖自動重新整理錯誤

### **Alert Log 位置與格式**

```sql
-- 查詢Alert Log位置
SQL> SELECT name, value FROM v$diag_info;
```

**兩種格式：**

- **Text格式**：`alert_<SID>.log` (位於trace目錄)
- **XML格式**：`log.xml` (位於alert目錄)

**預設位置：**

```
$ORACLE_BASE/diag/rdbms/<db_name>/<SID>/trace/    -- Text版本
$ORACLE_BASE/diag/rdbms/<db_name>/<SID>/alert/    -- XML版本
```

# **Trace Files (追蹤文件)**

### **Trace Files 基本概念**

每個Server Process和Background Process都可以寫入相關的trace file，用於記錄錯誤資訊和效能調整指導。

**Trace Files內容：**

- 錯誤資訊（內部錯誤發生時，需聯絡Oracle Support）
- 應用程式或instance調整指導資訊
- 背景程序的trace file名稱包含程序名稱

**關鍵特性：**

- 當發生嚴重錯誤時，會分配incident number
- 診斷資料會立即被擷取並標記該編號
- 資料儲存在ADR中，可依incident number檢索分析

# **Automatic Diagnostic Repository (ADR)**

### **ADR 架構**

ADR是檔案式的統一診斷資料儲存庫，儲存在資料庫外部。

**ADR目錄結構：**

```
ADR Base (DIAGNOSTIC_DEST)
└── diag/
    └── rdbms/
        └── <db_name>/
            └── <SID>/
                ├── alert/     -- XML Alert Log
                ├── trace/     -- Text Alert Log & Trace Files
                ├── incident/  -- Incident dumps
                ├── cdump/     -- Core dumps
                ├── hm/        -- Health Monitor reports
                └── log/       -- DDL log files
```

**ADR Base位置設定：**

- 由`DIAGNOSTIC_DEST`參數控制
- 若未設定，則：
    - 若`ORACLE_BASE`已設定：`DIAGNOSTIC_DEST = $ORACLE_BASE`
    - 若`ORACLE_BASE`未設定：`DIAGNOSTIC_DEST = $ORACLE_HOME/log`

### **ADRCI (ADR Command Interpreter)**

ADRCI是Oracle命令列工具，用於：

- 調查問題
- 檢視健康檢查報告
- 包裝並上傳first-failure資料給Oracle Support
- 檢視trace files名稱和alert log

**常用ADRCI命令：**

```bash
$ adrci
ADRCI> show homes                    -- 顯示ADR homes
ADRCI> set home <adr_home>          -- 設定工作home
ADRCI> show alert                   -- 顯示alert log
ADRCI> show tracefile               -- 顯示trace files
```

### **ADR資料保留政策**

**兩種保留期間：**

- **長期保留**：incidents和alert log (預設365天)
- **短期保留**：traces和core dumps (預設30天)

**大小控制：** 可設定ADR home的目標大小，自動刪除舊資料。

# **DDL Log File**

### **DDL Log設定**

```sql
-- 啟用DDL logging
SQL> ALTER SYSTEM SET enable_ddl_logging = TRUE;
```

**DDL Log特性：**

- 需要Oracle Database Lifecycle Management Pack授權
- 每個DDL語句產生一筆記錄
- 有兩個相同內容的DDL logs：
    - XML格式：`log.xml` (在log/ddl子目錄)
    - Text格式：`ddl_<sid>.log` (在log子目錄)

**DDL Log範例：**

```
Thu Nov 15 08:35:47 2016
diag_adl:drop user app_user
```

# **Dynamic Performance Views (V$視圖)**

### **V$視圖基本概念**

V$視圖提供instance記憶體結構變化狀態的即時資訊。

**重要特性：**

- 由SYS使用者擁有
- 根據instance階段(NOMOUNT/MOUNT/OPEN)提供不同資訊
- 資料是動態的，沒有讀取一致性保證
- 通常稱為"v-dollar views"

**常用V$視圖分類：**

**Instance/Database相關：**

```sql
V$DATABASE        -- 資料庫資訊
V$INSTANCE        -- Instance狀態
V$PARAMETER       -- 當前session參數
V$SPPARAMETER     -- SPFILE內容
V$SYSTEM_PARAMETER -- Instance層級參數
```

**Memory相關：**

```sql
V$SGAINFO              -- SGA資訊
V$PGASTAT              -- PGA統計
V$BUFFER_POOL_STATISTICS -- Buffer Pool統計
V$LIBRARYCACHE         -- Library Cache統計
```

**Process相關：**

```sql
V$PROCESS         -- 所有程序
V$BGPROCESS       -- 背景程序
V$SESSION         -- 會話資訊
```

**Performance相關：**

```sql
V$SYSTEM_EVENT    -- 系統等待事件
V$SESSION_EVENT   -- 會話等待事件
V$SYSSTAT         -- 系統統計
V$SESSTAT         -- 會話統計
```

### **實務查詢範例**

```sql
-- 查詢所有V$視圖
SQL> SELECT * FROM v$fixed_table WHERE name LIKE 'V$%';

-- 查詢當前會話參數
SQL> SELECT name, value FROM v$parameter WHERE name = 'sga_target';

-- 查詢等待事件
SQL> SELECT event, total_waits, time_waited 
     FROM v$system_event 
     WHERE wait_class != 'Idle';
```

# **Oracle Data Dictionary (資料字典)**

### **資料字典基本概念**

Oracle資料字典是資料庫的metadata，包含所有資料庫物件的名稱和屬性。

**資料字典特性：**

- 由SYS使用者擁有
- Oracle Database server自動維護
- 當物件結構或定義被修改時自動更新
- 任何使用者都可查詢
- **絕對不可直接用SQL修改**

### **資料字典視圖前綴**

**四種視圖前綴：**

**CDB_視圖：**

- 顯示整個CDB中所有PDB的metadata
- 僅CDB環境可用

**DBA_視圖：**

- 顯示container或PDB中所有物件的metadata
- 需要DBA權限

**ALL_視圖：**

- 顯示當前使用者有權限看到的所有物件metadata
- 包含使用者擁有的和被授權存取的物件

**USER_視圖：**

- 顯示當前使用者擁有的物件metadata
- 任何使用者都可存取

### **權限需求**

```sql
-- CDB_和DBA_視圖需要以下權限之一：
-- 1. SYSDBA權限
-- 2. SELECT ANY DICTIONARY權限
-- 3. SELECT_CATALOG_ROLE角色
-- 4. 直接授權
```

### **實務查詢範例**

```sql
-- 查詢資料字典結構
SQL> SELECT * FROM dictionary;        -- 或 DICT
SQL> SELECT * FROM dict_columns;      -- 查看視圖欄位

-- 查詢使用者表格
SQL> SELECT table_name FROM user_tables;
SQL> SELECT table_name FROM all_tables WHERE owner = 'HR';
SQL> SELECT table_name FROM dba_tables WHERE owner = 'HR';

-- CDB環境查詢
SQL> SELECT con_id, table_name FROM cdb_tables WHERE owner = 'HR';
```

### **CONTAINER_DATA屬性**

在CDB環境中，當使用者連線到root container查詢CDB_*視圖時：

```sql
-- 設定CONTAINER_DATA屬性
SQL> ALTER USER username SET CONTAINER_DATA = (con1, con2, ...) FOR container_data_object;
```

# 問題及複習
1. [sys,system,sysdba差在哪裡？](sys,system,sysdba差在哪裡？.md)
2. [rollforward跟rollback](rollforward跟rollback.md)
3. [parameter file可以在open的時候修改，但是因為nomount就會讀取了，所以必須重啟可以使用starup force，對嗎？](parameter%20file可以在open的時候修改，但是因為nomount就會讀取了，所以必須重啟可以使用starup%20force，對嗎？.md)
