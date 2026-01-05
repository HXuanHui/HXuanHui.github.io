---
title: rollforward跟rollback
draft: false
maturity: stone
---

#ORACLE 
## **Rollforward（前滾/重做）**

### **定義與目的**

- **記錄內容**：如何重現/重做一個變更（How to reproduce a change）
- **使用目的**：將資料庫變更向前推進，重新應用已經完成的變更
- **儲存位置**：Redo log files（重做日誌檔案）

### **運作機制**

當系統發生故障（如停電），但交易已經COMMIT時：

1. 交易已確認寫入redo log file（持久化儲存）
2. 但變更可能尚未寫入data files
3. 系統重啟時，會自動roll forward任何尚未反映在data files中的redo records

### **實際應用場景**

```sql
-- 範例：交易已COMMIT但尚未寫入datafile時發生停電
UPDATE emp SET salary = 5000 WHERE empno = 100;
COMMIT; -- 此時redo已寫入log file，但可能尚未寫入datafile

-- 系統重啟後會自動rollforward此變更
```

## **Rollback（回滾/復原）**

### **定義與目的**

- **記錄內容**：如何撤銷一個變更（How to undo a change）
- **使用目的**：撤銷未確認的交易或提供讀取一致性
- **儲存位置**：Undo segments（在undo tablespace中）

### **運作機制**

每次進行資料變更前，Oracle會：

1. 先記錄變更前的原始內容（undo data）
2. 再記錄變更本身的內容（redo entry）
3. 如果需要rollback，使用undo data恢復原始狀態

### **實際應用場景**

```sql
-- 範例：交易中途需要rollback
UPDATE emp SET salary = 6000 WHERE empno = 100;
-- undo data: empno=100的原始salary值
-- redo entry: empno=100的新salary=6000

ROLLBACK; -- 使用undo data恢復原始salary值
```

## **兩者的關鍵差異**

| 比較項目     | Rollforward (Redo) | Rollback (Undo)  |
| -------- | ------------------ | ---------------- |
| **記錄內容** | 如何重做變更             | 如何撤銷變更           |
| **用途**   | 重新應用已確認的變更         | 撤銷變更、讀取一致性       |
| **儲存位置** | Redo log files     | Undo segments    |
| **時機**   | 實例復原、媒體復原          | 交易rollback、查詢一致性 |

## **MVCC（多版本併發控制）中的應用**

根據您的教材，Oracle使用undo data實現MVCC：

```sql
-- 原始資料
col1|col2|col3
[  1|A  |100]  row1

-- Session 1執行更新
UPDATE t1 SET col1=100 WHERE col2='A';
-- undo data: row1's col1 = 1 (只記錄被變更的欄位)
-- redo entry: row1's col1 = 100

-- Session 2同時查詢仍能看到原始值（使用undo data重建）
SELECT * FROM t1 WHERE col2='A'; -- 仍會看到col1=1
```

## **實例復原（Instance Recovery）中的雙重作用**

當發生instance crash後重啟時，SMON會自動執行：

1. **Roll Forward階段**：
    
    - 重新應用所有已COMMIT交易的redo entries
    - 確保所有已確認的變更都反映在datafiles中
2. **Roll Back階段**：
    
    - 使用undo data回滾所有未COMMIT的交易
    - 確保資料庫狀態一致

## **我認為需要特別說明的部分**

### **1. Redo和Undo的相互關係**

您的教材提到："Undo block changes are also written to the redo log"，這表示：

- 對undo block的變更本身也會產生redo
- 這確保了undo資料的完整性和可復原性

### **2. 交易確認的關鍵時點**

COMMIT真正完成的標準是redo寫入log file，不是變更寫入datafile。這個設計讓Oracle能夠：

- 提供快速的COMMIT回應
- 透過rollforward機制確保已確認交易不會遺失

### **3. Undo Retention的重要性**

雖然交易結束後undo data可以被覆蓋，但透過`undo_retention`參數可以延長保留時間，支援：

- 長時間執行的查詢（避免ORA-01555 "Snapshot too old"）
- Flashback查詢功能

這些概念是Oracle資料庫ACID特性的核心實現機制，對理解資料庫的可靠性和一致性保證非常重要。