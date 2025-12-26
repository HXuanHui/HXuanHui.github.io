#ORACLE 

**不是的！** 即使沒有設置`undo_retention`參數，commit之後undo資料也不會立即被清空。

## **Oracle的自動undo管理機制**

### **Undo資料的三種狀態**

根據您的教材，undo資料被分為三個類別：

| 狀態      | 英文名稱                  | 描述                   | 處理方式             |
| ------- | --------------------- | -------------------- | ---------------- |
| **活動中** | Active (Uncommitted)  | 支援目前執行中的交易           | **永遠不會被覆寫**      |
| **未過期** | Unexpired (Committed) | 交易已確認但仍在retention期間內 | **盡可能保留**，除非空間不足 |
| **已過期** | Expired               | 超過retention期間的已確認交易  | **可以被覆寫**        |

### **自動調整機制**

即使沒有手動設置`undo_retention`，Oracle還是會自動管理：

**對於Auto-extending undo tablespace**：

- 系統會自動調整undo retention期間
- 調整基準：比最長執行查詢的時間稍長一些
- 目的：滿足所有查詢的讀取一致性需求

**對於Fixed-size undo tablespace**：

- 系統根據undo tablespace大小和使用歷史動態調整
- 提供最佳可能的retention period
- 忽略`UNDO_RETENTION`設定（除非啟用retention guarantee）

## **實際的運作情況**

```sql
-- 查看目前的undo retention設定
SQL> SHOW PARAMETER undo_retention;
NAME                TYPE        VALUE
undo_retention      integer     900    -- 預設900秒(15分鐘)

-- 即使設為0，系統仍會自動調整
SQL> ALTER SYSTEM SET undo_retention = 0;

-- 查看實際的自動調整值
SQL> SELECT tuned_undoretention FROM v$undostat;
```

## **何時undo資料才會被清除**

Undo資料被清除的條件：

1. **空間壓力**：當需要空間給新的active transaction時
2. **過期狀態**：undo資料已超過retention period
3. **覆寫順序**：優先覆寫expired undo，再考慮unexpired undo

## **UNDO_RETENTION參數真正有效的情況**

根據您的教材，`UNDO_RETENTION`只在三種情況下有效：

1. **Undo tablespace啟用AUTOEXTEND**
2. **要為LOBs設定undo retention**
3. **要保證retention（啟用RETENTION GUARANTEE）**

```sql
-- 啟用retention guarantee
SQL> ALTER TABLESPACE undotbs1 RETENTION GUARANTEE;

-- 現在undo_retention設定會被強制執行，即使造成交易失敗
```

## **我認為需要特別說明的部分**

### **1. 預設行為的智慧性**

Oracle的預設行為是"寧可覆寫expired undo也不讓active transaction失敗"，這是一個非常實用的設計。這確保了：

- 新交易不會因為空間不足而失敗
- 同時盡量保持足夠的undo以支援讀取一致性

### **2. "Snapshot too old"錯誤的原因**

當您看到ORA-01555錯誤時，不一定是因為沒有設定`undo_retention`，而可能是：

- Undo tablespace空間不足
- 查詢執行時間超過系統自動調整的retention period
- 需要的undo資料被新交易覆寫了

### **3. 監控undo使用狀況**

```sql
-- 查看undo統計資訊
SQL> SELECT 
  activeblks "Active Blocks",
  unexpiredblks "Unexpired Blocks", 
  expiredblks "Expired Blocks",
  tuned_undoretention "Auto-tuned Retention"
FROM v$undostat 
WHERE rownum = 1;
```

總結：Oracle的自動undo管理非常智慧，即使不設定`undo_retention`，系統也會根據workload自動調整，確保在空間允許的情況下盡量保留undo資料以支援讀取一致性和flashback功能。