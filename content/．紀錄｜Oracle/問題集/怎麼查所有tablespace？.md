#ORACLE 
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

#我認為需要補充說明的部分

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
