#ORACLE 
## **Parameter 修改的核心概念**

### **1. Parameter 的類型分類**

**根據修改時機分類：**

- **Static Parameters (靜態參數)**：`ISSYS_MODIFIABLE = FALSE`
- **Dynamic Parameters (動態參數)**：`ISSYS_MODIFIABLE = IMMEDIATE 或 DEFERRED`

**檢查參數屬性：**

```sql
SQL> SELECT name, issys_modifiable, isses_modifiable, ispdb_modifiable 
     FROM v$parameter 
     WHERE name = 'sga_target';
```

### **2. SCOPE 參數的使用**

**SCOPE 有三個選項：**

**MEMORY：** 僅修改記憶體中的值

```sql
SQL> ALTER SYSTEM SET job_queue_processes = 15 SCOPE=MEMORY;
-- 立即生效，但重啟後恢復原值
-- 如果使用PFILE啟動，只能用這個SCOPE
```

**SPFILE：** 僅修改SPFILE中的值

```sql
SQL> ALTER SYSTEM SET sga_target = 2G SCOPE=SPFILE;
-- 當前不生效，重啟後生效
-- 這是靜態參數的唯一選擇
```

**BOTH：** 同時修改記憶體和SPFILE

```sql
SQL> ALTER SYSTEM SET job_queue_processes = 15 SCOPE=BOTH;
-- 立即生效且重啟後仍有效
-- 使用SPFILE時的預設值
-- 靜態參數不能使用此選項
```

## **3. STARTUP FORCE 技巧**

您提到的`STARTUP FORCE`確實是重要技巧：

```sql
SQL> STARTUP FORCE;
-- 等同於：
-- SHUTDOWN ABORT;
-- STARTUP;
```

**使用時機：**

- 修改靜態參數後需要重啟
- 資料庫hang住無法正常關閉
- 緊急情況需要快速重啟

**注意事項：**

- 相當於ABORT shutdown，會導致instance recovery
- 未確認的交易會rollback
- 僅緊急時使用

## **4. 其他修改Parameter的技巧**

### **技巧1：使用DEFERRED關鍵字**

```sql
-- 對於ISSYS_MODIFIABLE = 'DEFERRED'的參數
SQL> ALTER SYSTEM SET backup_tape_io_slaves = TRUE DEFERRED;
-- 只對新會話生效，現有會話不受影響
```

### **技巧2：利用PFILE進行緊急修復**

```sql
-- 1. 從SPFILE建立PFILE
SQL> CREATE PFILE FROM SPFILE;

-- 2. 修改PFILE (用text editor)
-- 3. 使用PFILE啟動
SQL> STARTUP PFILE='$ORACLE_HOME/dbs/initORCL.ora';

-- 4. 重新建立SPFILE
SQL> CREATE SPFILE FROM PFILE;

-- 5. 重啟使用SPFILE
SQL> STARTUP FORCE;
```

### **技巧3：指定PFILE啟動**

```sql
-- 使用特定PFILE啟動
SQL> STARTUP PFILE='/path/to/custom_init.ora';

-- 或在作業系統層級
$ sqlplus / as sysdba
SQL> STARTUP PFILE='/tmp/emergency_init.ora';
```

### **技巧4：使用COMMENT記錄修改原因**

```sql
SQL> ALTER SYSTEM SET sga_target = 2G 
     COMMENT='Increase for better performance' 
     SCOPE=SPFILE;

-- 查看修改註解
SQL> SELECT name, value, update_comment 
     FROM v$parameter 
     WHERE name = 'sga_target';
```

## **5. 實務操作流程**

### **動態參數修改流程：**

```sql
-- 1. 檢查參數屬性
SQL> SELECT name, issys_modifiable, value 
     FROM v$parameter 
     WHERE name = 'job_queue_processes';

-- 2. 修改參數 (立即生效且持久)
SQL> ALTER SYSTEM SET job_queue_processes = 20 SCOPE=BOTH;

-- 3. 驗證修改
SQL> SHOW PARAMETER job_queue_processes;
```

### **靜態參數修改流程：**

```sql
-- 1. 修改SPFILE
SQL> ALTER SYSTEM SET sga_target = 3G 
     COMMENT='Performance tuning' 
     SCOPE=SPFILE;

-- 2. 重啟資料庫
SQL> STARTUP FORCE;

-- 3. 驗證修改
SQL> SHOW PARAMETER sga_target;
```

## **6. 進階技巧**

### **技巧6：PDB層級參數管理**

```sql
-- 切換到PDB
SQL> ALTER SESSION SET CONTAINER = pdb1;

-- 檢查PDB可修改的參數
SQL> SELECT name, ispdb_modifiable 
     FROM v$parameter 
     WHERE ispdb_modifiable = 'TRUE';

-- 修改PDB參數
SQL> ALTER SYSTEM SET cpu_count = 4;
```

### **技巧7：使用V$SPPARAMETER查看SPFILE內容**

```sql
-- 查看SPFILE中的設定值
SQL> SELECT name, value, isspecified 
     FROM v$spparameter 
     WHERE name = 'sga_target';

-- isspecified = TRUE 表示在SPFILE中有明確設定
```

### **技巧8：Reset參數到預設值**

```sql
-- 重設為預設值
SQL> ALTER SYSTEM RESET job_queue_processes SCOPE=SPFILE;

-- 重啟後生效
SQL> STARTUP FORCE;
```

## **7. 緊急情況處理技巧**

### **情境1：錯誤的記憶體參數導致無法啟動**

```sql
-- 1. 建立應急PFILE
$ cd $ORACLE_HOME/dbs
$ cp init.ora initORCL.ora

-- 2. 編輯PFILE，設定安全的記憶體值
# 編輯文件，設定較小的記憶體值

-- 3. 使用PFILE啟動
SQL> STARTUP PFILE='$ORACLE_HOME/dbs/initORCL.ora';

-- 4. 重建SPFILE
SQL> CREATE SPFILE FROM PFILE;
```

### **情境2：快速修改靜態參數**

```sql
-- 一行指令完成修改並重啟
SQL> ALTER SYSTEM SET db_cache_size = 500M SCOPE=SPFILE;
SQL> STARTUP FORCE;
```

## **8. 最佳實務建議**

### **修改前的檢查：**

```sql
-- 檢查當前值和屬性
SQL> SELECT name, value, issys_modifiable, isdefault 
     FROM v$parameter 
     WHERE name = 'parameter_name';

-- 檢查是否有依賴參數
SQL> SELECT name, value 
     FROM v$parameter 
     WHERE name IN ('memory_target', 'sga_target', 'pga_aggregate_target');
```

### **修改後的驗證：**

```sql
-- 驗證修改是否生效
SQL> SHOW PARAMETER parameter_name;

-- 檢查alert log
SQL> SELECT value FROM v$diag_info WHERE name = 'Diag Trace';
-- 然後檢查alert log檔案
```

您提到的技巧都是正確的，特別是理解parameter file在NOMOUNT階段就被讀取，以及使用`STARTUP FORCE`來應用靜態參數的修改。這些技巧在實務DBA工作中非常重要！