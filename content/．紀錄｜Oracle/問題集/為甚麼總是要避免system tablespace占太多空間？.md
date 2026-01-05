---
title: 為甚麼總是要避免system tablespace占太多空間？
draft: false
maturity: stone
---

#ORACLE 

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

#我認為教材不夠清楚的部分

1. **性能影響**：教材沒有詳細說明SYSTEM tablespace空間不足時對整體資料庫性能的具體影響
    
2. **恢復複雜性**：當SYSTEM tablespace出現問題時，整個資料庫的可用性和恢復難度會大幅增加
    
3. **空間競爭**：系統元數據與用戶數據混在一起時，可能造成I/O競爭和空間分配衝突
    

總的來說，保持SYSTEM tablespace的"純淨性"是Oracle資料庫管理的最佳實踐，這不僅關係到性能，更關係到資料庫的穩定性和可維護性。