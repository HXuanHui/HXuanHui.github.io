1. Index要吃到，但是不是建越多越好。Index佔Storage；物件更新時也要更新，會吃效能。
2. 查詢數（rownum）要限制才會有效降低buffer get。


**應對措施**
1. 開單要程式員修改