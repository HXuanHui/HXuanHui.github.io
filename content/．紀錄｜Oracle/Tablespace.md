
## 怎麼查所有tablespace?

教材中提到了幾種查詢tablespace的方式：

### 1. 使用 DBA_TABLESPACES 視圖（最常用）

```sql
SELECT DISTINCT tablespace_name FROM dba_tablespaces ORDER BY tablespace_name;
```

這個查詢會顯示所有的tablespace名稱。教材中的範例顯示了5個tablespace：

- SYSAUX
- SYSTEM
- TEMP
- UNDOTBS1
- USERS

### 2. 使用 V$TABLESPACE 視圖

```sql
SELECT * FROM v$tablespace;
```

這個視圖顯示來自控制文件的tablespace信息，包含更多詳細資訊如：

- TS#（tablespace編號）
- NAME（tablespace名稱）
- INCLUDED_IN_DATABASE_BACKUP
- BIGFILE
- FLASHBACK_ON
- ENCRYPT_IN_BACKUP
- CON_ID

### 3. 查詢更詳細的tablespace資訊

```sql
SELECT status, contents, logging, plugged_in, bigfile, 
       extent_management, allocation_type, tablespace_name
FROM dba_tablespaces;
```

---

## 我認為需要補充說明的部分

### 1. 權限要求不夠清楚

教材沒有明確說明查詢這些視圖需要什麼權限。實際上：

- 查詢 `DBA_TABLESPACES` 需要 DBA 權限或 SELECT_CATALOG_ROLE
- 查詢 `V$TABLESPACE` 需要 SELECT ANY DICTIONARY 權限或 DBA 權限
- 一般用戶可以使用 `USER_TABLESPACES` 查看自己可存取的tablespace

### 2. 在CDB/PDB環境中的差異

教材顯示了CDB和PDB的操作，但沒有清楚說明：

- 在CDB$ROOT中查詢會看到所有容器的tablespace
- 在PDB中查詢只會看到該PDB的tablespace
- 可以加上 `CON_ID` 欄位來識別tablespace屬於哪個容器

### 3. 欄位格式化

教材中使用了 `col tablespace_name format a20` 來格式化輸出，這是很實用的技巧，但沒有解釋為什麼需要這樣做。

這些是查詢tablespace的基本方法，你可以根據需要的詳細程度選擇合適的查詢方式。


## tablespace的實體位置?

## 查詢tablespace實體位置的方法

### 1. 查詢資料檔案位置（最重要）

```sql
SELECT tablespace_name, file_name, bytes, maxbytes, autoextensible 
FROM dba_data_files 
ORDER BY tablespace_name;
```

教材中的範例顯示：

```
FILE_NAME                                                         BYTES   MAXBYTES AUT
------------------------------------------------------------ ---------- ---------- ---
/u01/app/oracle/oradata/ORCLCDB/orclpdb1/demots01.dbf         209715200 1048576000 YES
/u01/app/oracle/oradata/ORCLCDB/orclpdb1/demots02.dbf         209715200          0 NO
```

### 2. 使用V$DATAFILE視圖查詢

```sql
SELECT name FROM v$datafile;
```

教材顯示的結果：

```
/u01/app/oracle/oradata/ORCLCDB/orclpdb1/system01.dbf
/u01/app/oracle/oradata/ORCLCDB/orclpdb1/sysaux01.dbf
/u01/app/oracle/oradata/ORCLCDB/orclpdb1/undotbs01.dbf
/u01/app/oracle/oradata/ORCLCDB/orclpdb1/users01.dbf
/u01/app/oracle/oradata/ORCLCDB/orclpdb1/demots01.dbf
```

### 3. 查詢暫時檔案位置

```sql
SELECT tablespace_name, file_name, bytes 
FROM dba_temp_files;
```

### 4. 整合查詢tablespace與檔案資訊

```sql
SELECT t.tablespace_name, d.file_name, d.bytes/1024/1024 AS size_mb
FROM dba_tablespaces t, dba_data_files d
WHERE t.tablespace_name = d.tablespace_name
ORDER BY t.tablespace_name;
```

---

## 我認為需要補充說明的部分

### 1. Oracle Managed Files (OMF) 概念不夠清楚

教材提到了OMF但沒有詳細說明其實際意義：

- 當設定 `DB_CREATE_FILE_DEST` 參數後，Oracle會自動管理檔案命名和位置
- 教材中顯示當沒有設定此參數時會出現 `ORA-02199: missing DATAFILE/TEMPFILE clause` 錯誤
- OMF檔案有特定的命名格式，不應手動重新命名

### 2. CDB/PDB環境中的檔案路徑結構

教材顯示的路徑結構很重要但沒有明確說明：

- CDB的檔案通常在 `/u01/app/oracle/oradata/ORCLCDB/`
- PDB的檔案在 `/u01/app/oracle/oradata/ORCLCDB/orclpdb1/`
- 這種層級結構是Oracle 12c之後多租戶架構的標準配置

### 3. 檔案大小和autoextend的實際意義

教材顯示了bytes、maxbytes和autoextensible欄位，但沒有清楚解釋：

- `BYTES` 是目前檔案實際大小
- `MAXBYTES` 是檔案可自動擴展的最大限制
- `AUTOEXTENSIBLE` 為YES表示檔案會自動增長

### 4. 權限需求

查詢這些視圖同樣需要適當權限，一般用戶可能需要使用 `USER_DATA_FILES` 等相應視圖。

這些查詢方法可以讓你完整了解tablespace的實體儲存位置和狀態。

## 為甚麼總是要避免system tablespace占太多空間?在建立user的時候也是，audit trail也是?

根據你的教材，我來解釋為什麼要避免SYSTEM tablespace占太多空間的重要原因：

## SYSTEM Tablespace為什麼要控制空間？

從教材中可以看到幾個關鍵原因：

### 1. **SYSTEM tablespace的特殊角色**

- SYSTEM和SYSAUX tablespace是用來放**metadata**（系統元數據），不建議放user data
- 它儲存Oracle的數據字典和系統相關對象，是資料庫的核心組件

### 2. **空間管理的限制**

- 教材顯示SYSTEM tablespace的SEGMENT_SPACE_MANAGEMENT=MANUAL（手動管理）
- 這與一般用戶tablespace的AUTO管理不同，效能較差且管理複雜

### 3. **稽核資料的影響**

教材特別提到audit trail的問題：

```sql
--預設情況下audit資料會放在SYSTEM tablespace
TABLE_NAME          TABLESPACE_NAME
AUD$                SYSTEM
FGA_LOG$            SYSTEM

--需要手動搬移到其他tablespace
execute dbms_audit_mgmt.set_audit_trail_location(dbms_audit_mgmt.audit_trail_aud_std,'USERS');
```

### 4. **監控警示機制**

教材顯示MMON每10分鐘檢查空間使用狀態：

- 85%發出Warning警示
- 97%發出Critical警示

## 建立用戶時的考量

雖然教材沒有直接提到建立用戶的問題，但基於SYSTEM tablespace的特殊性，應該：

- 為用戶指定專用的default tablespace（如USERS）
- 避免用戶對象意外創建在SYSTEM tablespace中

## 我認為教材不夠清楚的部分

1. **性能影響**：教材沒有詳細說明SYSTEM tablespace空間不足時對整體資料庫性能的具體影響
    
2. **恢復複雜性**：當SYSTEM tablespace出現問題時，整個資料庫的可用性和恢復難度會大幅增加
    
3. **空間競爭**：系統元數據與用戶數據混在一起時，可能造成I/O競爭和空間分配衝突
    

總的來說，保持SYSTEM tablespace的"純淨性"是Oracle資料庫管理的最佳實踐，這不僅關係到性能，更關係到資料庫的穩定性和可維護性。