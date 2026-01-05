---
title: NLS_CHARACTERSET、NLS_NCHAR_CHARACTERSET的不同？
draft: false
maturity: stone
---

#ORACLE 
## 兩者的基本差異

**NLS_CHARACTERSET** (Database Character Set)：

- 這是資料庫的主要字符集，影響 `CHAR`、`VARCHAR2`、`CLOB`、`LONG` 等資料型別
- 在您的教材範例中，可能是 `ZHT16MSWIN950` 或 `AL32UTF8`
- 必須與 ASCII (7-bit) 或 EBCDIC (8-bit) 相容

**NLS_NCHAR_CHARACTERSET** (National Character Set)：

- 這是國家字符集，影響 `NCHAR`、`NVARCHAR2`、`NCLOB` 等資料型別
- 從 Oracle 9i 開始，**必須為 Unicode 編碼**（通常是 `AL16UTF16` 或 `UTF8`）
- 您教材中的範例顯示為 `AL16UTF16`

## 實際範例說明

從您的教材中可以看到這個重要的測試：

```sql
-- 查看字符集設定
select property_name,property_value from database_properties 
where property_name LIKE '%CHARACTERSET';

NLS_NCHAR_CHARACTERSET: AL16UTF16      -- National characterset
NLS_CHARACTERSET: ZHT16MSWIN950        -- Database characterset
```

建立表格並測試：

```sql
create table hr.t1(col1 int,col2 varchar2(10),col3 nvarchar2(10));
insert into hr.t1 values(2,'甲骨文O','甲骨文O');

-- 查看編碼差異
select col1,col2,dump(col2),col3,dump(col3) from hr.t1 where col1=2;
```

結果顯示：

- `VARCHAR2` (col2): `Typ=1 Len=7: 165,210,176,169,164,229,79`
- `NVARCHAR2` (col3): `Typ=1 Len=8: 117,50,154,168,101,135,0,79`

## 關於 Unicode 的兼容性

您記得正確！**只有 Unicode 才能兼容其他字符集**，原因如下：

1. **Unicode 是超集 (Superset)**：
    
    - Unicode (如 AL32UTF8) 包含了幾乎所有其他字符集的字符
    - 其他字符集通常只支援特定語言或地區
2. **轉換原則**：
    
    - 從小字符集轉換到 Unicode：通常沒問題
    - 從 Unicode 轉換到小字符集：可能會有字符遺失
3. **教材建議**：
    
    - 教材明確指出：「一般建議使用 Unicode，因為它是最靈活的字符集」
    - 「資料庫的編碼方案應該是所有客戶端編碼方案的超集或等效」


**NLS_LANG 參數的重要性**： 您的教材特別強調了客戶端 `NLS_LANG` 設定的重要性，如果設定不當會導致資料錯誤進入資料庫，這個概念對 DBA 來說非常關鍵。
