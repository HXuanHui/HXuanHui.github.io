---
title: 安裝之後是不是要跑腳本去建立view跟其他管理工具？
draft: false
maturity: stone
---

#ORACLE 
## 需要執行的腳本

當使用`CREATE DATABASE`指令建立資料庫後，確實需要執行額外的腳本來建立data dictionary views和內建的管理工具：

### 必要執行的腳本：

#### 1. **catalog.sql** 
```sql
SQL> @$ORACLE_HOME/rdbms/admin/catalog.sql
-- 或者
SQL> @?/rdbms/admin/catalog.sql
```

- **功能**：建立data dictionary views
- **執行時間**：約3分鐘
- **目的**：讓使用者能夠更方便、清楚地理解data dictionary內容

#### 2. **catproc.sql**

```sql
SQL> @$ORACLE_HOME/rdbms/admin/catproc.sql
-- 或者
SQL> @?/rdbms/admin/catproc.sql
```

- **功能**：建立內建package/procedure/function/trigger
- **執行時間**：約30分鐘
- **目的**：提供資料庫額外功能，如DBMS_OUTPUT等

### 替代方案：**catcdb.sql**

對於CDB，也可以執行：

```sql
SQL> @$ORACLE_HOME/rdbms/admin/catcdb.sql
```

這個腳本會自動執行catalog.sql和catproc.sql以及其他相關腳本。

## 教材中的實際例子

從您的教材可以看到執行前後的差異：

**執行前：**

```sql
SQL> select count(*) from dba_tables;
ERROR: ORA-00942: table or view does not exist

SQL> desc dbms_output
ERROR: ORA-04043: object dbms_output does not exist
```

**執行後：**

```sql
SQL> select count(*) from dba_tables;
  COUNT(*)
----------
       702

SQL> desc dbms_output   --內建package也建立完成
PROCEDURE DISABLE
PROCEDURE ENABLE
...
```

## 重要說明

1. **DBCA vs 手動建立的差異**：
    
    - 使用**DBCA建立資料庫**時，這些腳本會**自動執行**
    - 使用**CREATE DATABASE**指令手動建立時，需要**手動執行**這些腳本
2. **執行順序**：
    
    - 先執行`catalog.sql`
    - 再執行`catproc.sql`
    - 或直接執行`catcdb.sql`
3. **為什麼需要這些腳本**：
    
    - `CREATE DATABASE`只建立了基本的物理結構和系統表
    - 但DBA常用的views (如DBA_TABLES, DBA_USERS等)和內建packages (如DBMS_OUTPUT等)需要額外建立

所以您的記憶完全正確！手動建立資料庫後確實需要執行這些腳本來完成完整的資料庫建置。

