## Creating an Oracle Database 知識統整

### 一、建立Oracle資料庫的兩種主要方法

#### 1. 使用DBCA (Database Configuration Assistant)

- **互動模式 (Interactive Mode)**：提供圖形化介面和導引流程
- **無互動/靜默模式 (Silent Mode)**：可透過命令列和回應檔案進行腳本化建立

**DBCA Silent Mode範例：**

```bash
$ORACLE_HOME/bin/dbca -silent -createDatabase \
-templateName General_Purpose.dbc -gdbname CDBTEST \
-sid CDBTEST -createAsContainerDatabase true \
-numberOfPDBs 0 -useLocalUndoForPDBs true \
-totalMemory 1800 -sysPassword password \
-systemPassword password -emConfiguration DBEXPRESS \
-emExpressPort 5502 -enableArchive true \
-datafileDestination /u01/app/oracle/oradata
```

#### 2. 使用CREATE DATABASE SQL指令

**基本語法範例：**

```sql
CREATE DATABASE cdbdev
 USER SYS IDENTIFIED BY password
 USER SYSTEM IDENTIFIED BY password
 LOGFILE GROUP 1 ('/path/redo1a.log', '/path/redo1b.log') SIZE 100M,
         GROUP 2 ('/path/redo2a.log', '/path/redo2b.log') SIZE 100M
 CHARACTER SET ZHT16MSWIN950
 NATIONAL CHARACTER SET AL16UTF16
 EXTENT MANAGEMENT LOCAL
 DEFAULT TEMPORARY TABLESPACE temp
 DEFAULT TABLESPACE users
 UNDO TABLESPACE undotbs1
 ENABLE PLUGGABLE DATABASE;
```

### 二、資料庫物理結構 (Database Physical Structure)

#### 必要檔案類型：

1. **Control Files (.ctl)**
    
    - 記錄資料庫結構
    - 儲存datafile/logfile位置
    - 包含checkpoint資訊和備份資訊
2. **Data Files (.dbf)**
    
    - 儲存實際資料
    - 包含metadata (data dictionary) 在system/sysaux tablespace
    - 使用者資料存放在一般tablespace
3. **Online Redo Log Files (.log)**
    
    - 記錄資料庫異動日誌
    - 由LGWR程序寫入redo entry
    - 用於instance recovery
    - 一定會有兩組；一組中最少一個最多五個成員

### 三、多租戶架構 (Multitenant Architecture)

#### CDB與PDB檔案結構：

- **CDB Root**：共用control files、redo log files
- **各PDB**：擁有私有的datafiles和tempfiles
- **檔案組織**：每個PDB通常放在獨立子目錄中

```
/oradata/ORCLCDB/
├── control01.ctl          # 共用
├── redo01.log             # 共用
├── system01.dbf           # CDB root
├── sysaux01.dbf           # CDB root
├── orclpdb1/              # PDB1私有目錄
│   ├── system01.dbf
│   ├── sysaux01.dbf
│   └── users01.dbf
└── pdbseed/               # PDB$SEED
    ├── system01.dbf
    └── sysaux01.dbf
```

### 四、重要設定考量

#### 字符集設定：

- **NLS_CHARACTERSET**：資料庫字符集 (如：ZHT16MSWIN950)
- **NLS_NCHAR_CHARACTERSET**：國家字符集 (必須為Unicode，如：AL16UTF16)
- 這些設定在建立後較難更改
- 只有unicode才可以兼容其他字符集

#### Oracle Managed Files (OMF)：

- 自動管理檔案命名和位置
- 透過`db_create_file_dest`參數指定位置
- 簡化檔案管理工作

### 五、建立後驗證步驟

```sql
-- 確認是否為CDB
SELECT cdb FROM v$database;

-- 檢查tablespace
SELECT tablespace_name, contents FROM dba_tablespaces;

-- 檢查datafile位置
SELECT name FROM v$datafile ORDER BY 1;

-- 檢查EM Express連接埠
SELECT dbms_xdb_config.gethttpsport() FROM dual;
```

## 我認為需要補充說明的部分：

1. **初始化參數檔案的建立**：教材提到需要建立parameter file，但沒有詳細說明PFILE與SPFILE的區別和轉換過程。
    
2. **建立後的後續步驟**：CREATE DATABASE指令執行後，還需要執行額外的腳本來建立data dictionary和內建物件，這個部分在教材中提及但不夠詳細。
    
3. **模板的使用**：DBCA可以使用既有模板或自建模板，但教材對於如何自建模板的說明較為簡略。
    

這些部分不夠清楚的原因可能是：它們屬於進階主題，需要更多實務經驗才能完全理解；或是涉及後續章節的內容，在此處只是概要介紹。
# 提問與複習
1. [[如果使用dbca的話是不是在此之前要先跑 catproc.sql才會有這個工具]]
2. [[安裝之後是不是要跑腳本去建立view跟其他管理工具？]]
3. [NLS_CHARACTERSET、NLS_NCHAR_CHARACTERSET的不同，並且我記得只有unicode還是什麼才可以兼容其他的字符集，其他的好像不能互相兼容？](NLS_CHARACTERSET、NLS_NCHAR_CHARACTERSET的不同，並且我記得只有unicode還是什麼才可以兼容其他的字符集，其他的好像不能互相兼容？.md)
4. [什麼是OMF？](什麼是OMF？.md)