#ORACLE 
## **會在COMMIT後立即清除的資料結構**

### **1. Global Temporary Table (ON COMMIT DELETE ROWS)**

**預設行為**是transaction-specific：

```sql
-- 建立transaction-specific的global temporary table
CREATE GLOBAL TEMPORARY TABLE trans_buff_area(
    date1 DATE,
    col1 NUMBER
) ON COMMIT DELETE ROWS;  -- 這是預設值

-- 資料會在COMMIT後立即被清除
INSERT INTO trans_buff_area VALUES (SYSDATE, 100);
SELECT * FROM trans_buff_area;  -- 可以看到資料
COMMIT;
SELECT * FROM trans_buff_area;  -- 資料被清除了！
```

### **2. PL/SQL Collection Variables**

```sql
DECLARE
    TYPE num_array IS TABLE OF NUMBER;
    my_array num_array := num_array(1,2,3);
BEGIN
    -- 在PL/SQL block結束時，collection自動清除
    NULL;
END;  -- my_array在這裡被清除
```

## **在Session結束時清除的資料結構**

### **1. Global Temporary Table (ON COMMIT PRESERVE ROWS)**

```sql
-- 建立session-specific的global temporary table
CREATE GLOBAL TEMPORARY TABLE sess_buff_area(
    date1 DATE,
    col1 NUMBER
) ON COMMIT PRESERVE ROWS;

-- 資料在COMMIT後保留，但在session結束時清除
INSERT INTO sess_buff_area VALUES (SYSDATE, 100);
COMMIT;
SELECT * FROM sess_buff_area;  -- 資料仍在
-- 當session結束時，資料才會被清除
```

### **2. Private Temporary Table**

根據您的教材：

```sql
-- 預設是transaction duration
CREATE PRIVATE TEMPORARY TABLE ORA$PTT_mine (
    c1 DATE, 
    c3 NUMBER(10,2)
);  -- Transaction結束時自動DROP

-- 或指定session duration
CREATE PRIVATE TEMPORARY TABLE ORA$PTT_mine2 (
    c1 DATE, 
    c3 NUMBER(10,2)
) ON COMMIT PRESERVE DEFINITION;  -- Session結束時自動DROP
```

## **Temporary Tablespace的特殊行為**

### **Sort操作和臨時資料**

```sql
-- 大型排序操作使用temporary tablespace
SELECT * FROM large_table ORDER BY col1;

-- 排序完成後，temporary segments自動釋放
-- 不需要等到COMMIT，查詢完成就釋放
```

### **Hash Join和臨時資料**

```sql
-- 大型hash join使用temporary tablespace
SELECT * FROM table1 t1, table2 t2 
WHERE t1.id = t2.id;

-- Join完成後，temporary segments自動釋放
```

## **重要的區別說明**

| 資料結構                            | COMMIT後行為     | Session結束後行為  | 儲存位置                 |
| ------------------------------- | ------------- | ------------- | -------------------- |
| **Regular Table**               | 資料永久保留        | 資料永久保留        | 永久tablespace         |
| **Undo Data**                   | 進入unexpired狀態 | 進入unexpired狀態 | Undo tablespace      |
| **Global Temp (DELETE ROWS)**   | **立即清除**      | 立即清除          | Temporary tablespace |
| **Global Temp (PRESERVE ROWS)** | 資料保留          | **立即清除**      | Temporary tablespace |
| **Private Temp (預設)**           | **立即清除**      | 立即清除          | Memory               |
| **Private Temp (PRESERVE DEF)** | 資料保留          | **立即清除**      | Memory               |
| **Sort/Hash臨時資料**               | **操作完成即清除**   | 操作完成即清除       | Temporary tablespace |

## **我認為需要特別說明的部分**

### **1. Temporary Undo的概念**

根據您的教材，當`temp_undo_enabled=TRUE`時：

- 對temporary table的操作產生的undo會放在temporary tablespace中
- 這些temporary undo不會寫入redo log
- 效能更好，因為減少了redo的產生

### **2. 為什麼這樣設計**

**Transaction-specific temporary table**的設計理念：

- 用於暫存中間結果
- 每個transaction都應該有乾淨的開始
- 避免transaction間的資料污染

**Session-specific temporary table**的設計理念：

- 用於整個session期間的暫存
- 可以跨multiple transactions使用
- Session結束時自動清理，避免memory leak

### **3. 效能考量**

Temporary table的優勢：

- 不產生redo log entries（直接變更）
- 但仍然產生undo（支援rollback和讀取一致性）
- 比regular table的DML操作快很多

所以回答您的問題：**Global Temporary Table with ON COMMIT DELETE ROWS** 是在COMMIT後立即清除資料的主要資料結構，這也是Oracle設計來處理需要在交易完成後立即清理的臨時資料。