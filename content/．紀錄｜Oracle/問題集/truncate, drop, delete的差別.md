---
title: truncate, drop, delete的差別
draft: false
maturity: stone
---

#ORACLE 
### 1. **TRUNCATE TABLE**

- **性質**：DDL指令
- **功能**：刪除表格內的所有資料，但保留表格結構
- **速度**：非常快速
- **恢復性**：**無法rollback**（因為是DDL，會自動commit）
- **undo記錄**：不產生undo記錄
- **觸發器**：不會觸發DELETE觸發器
- **範例**：`TRUNCATE TABLE hr.t2;`

### 2. **DROP TABLE**

- **性質**：DDL指令
- **功能**：完全刪除表格（包含結構和資料）
- **速度**：快速
- **恢復性**：**無法rollback**（因為是DDL，會自動commit）
- **相關物件**：會影響相關的index、constraint等
- **範例**：`DROP TABLE hr.t2;`

### 3. **DELETE**

- **性質**：DML指令
- **功能**：刪除表格內的資料（可指定條件）
- **速度**：相對較慢（尤其是大量資料）
- **恢復性**：**可以rollback**（因為是DML）
- **undo記錄**：會產生undo記錄
- **觸發器**：會觸發DELETE觸發器
- **範例**：`DELETE FROM hr.employees WHERE employee_id = 100;`

## 教材中的重要觀察

從您的教材中可以看到：

```sql
SQL> truncate table hr.t2;            --DDL
SQL> commit;                          --TCL
```

這個範例很好地說明了TRUNCATE是DDL指令的特性。

#我認為需要補充說明的部分

### 1. **TRUNCATE的限制條件**

- 如果表格有foreign key constraint被其他表格參考，無法直接TRUNCATE
- 如果表格參與了複寫（replication），TRUNCATE可能會有限制

### 2. **DROP TABLESPACE的相關性**

教材中提到的`DROP TABLESPACE`概念與`DROP TABLE`類似，都是DDL且無法recovery：

```sql
SQL> drop tablespace demots2
  2  including contents           
  3  and datafiles;               
```

### 3. **DELETE的WHERE子句重要性**

```sql
DELETE FROM table_name;        -- 刪除所有資料（但可rollback）
DELETE FROM table_name WHERE condition;  -- 刪除符合條件的資料
```

### 4. **稽核（Audit）記錄差異**

從教材可見，這三種操作都會被不同的audit policy捕捉：

```sql
audit table;   -- 會捕捉 TRUNCATE TABLE, DROP TABLE
-- DELETE操作則是透過DML相關的audit policy
```

## 為什麼我認為這些部分需要補充

1. **實務應用考量**：新手DBA容易在production環境誤用TRUNCATE/DROP，不了解無法rollback的風險
2. **效能影響理解**：不清楚為什麼TRUNCATE比DELETE快這麼多（undo機制的差異）
3. **相關物件影響**：不了解DROP TABLE對相關index、constraint的連鎖影響

建議您在學習過程中，可以在測試環境實際操作這三個指令，體驗它們在效能和功能上的差異。