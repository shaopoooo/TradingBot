# PROJECT_RULE.md

## 1. 專案狀態 (Project Status)
> [!IMPORTANT]
> Gemini 必須在每次 [/finish] 指令後更新此區塊。
- **目前階段**: 專案啟動與環境建置 (Phase 1: Infrastructure)
- **當前任務**: 執行 Step 1-3 基礎環境與工具建置
- **待辦清單**:
  - [x] 建立完整 PROJECT_RULE.md (包含 20 階段微步驟)
  - [x] Step 1-5: 基礎建設與 API 通訊
  - [ ] Step 6-12: 市場數據與進階策略 (含動態價差/波動防禦)
  - [ ] Step 13-17: 緒控引擎與交易執行 (Worker Threads)
  - [ ] Step 18-20: 容器化部署與 React 儀表板

---

## 2. 技術規範 (Tech Stack)
- **Runtime**: Node.js 20+ (Alpine for Docker)
- **Concurrence**: Worker Threads (隔離交易邏輯與 Web 服務)
- **Math**: decimal.js (精確度: 20, 捨入: ROUND_HALF_UP)
- **API**: Binance API (REST + WebSocket)
- **Logging**: Winston (Daily Rotate File & Console)
- **Dashboard**: React 19 / Vite 7 / TailwindCSS 4
- **Container**: Docker / Docker-Compose

---

## 3. 檔案模組化架構
- **src/api/**: 交易所通訊層 (Auth, Clients, Signature)
- **src/strategies/**: 策略計算層 (Inventory Skew, Adaptive Spread, Backtest)
- **src/engine/**: 執行緒調度層 (TraderWorker, OrderManager)
- **src/web/**: 監控伺服器 (Express, Socket.io Bridge)
- **src/utils/**: 核心工具 (Logger, Precision)
- **dashboard/**: React 前端專案原始碼
- **tests/**: 單元測試與集成測試腳本

---

## 4. 二十階段微步驟與測試驗證 (Micro-Steps & Tests)

### **第一階段：基礎與安全 (Infrastructure)**
1. **Step 1: 環境隔離**: 建立 .env.example, .gitignore, .dockerignore。
   - **驗證**: 確保敏感資訊不會被 Git 追蹤。
2. **Step 2: 精度核心**: 實作 `utils/Precision.js`。
   - **測試**: 驗證 `0.1 + 0.2` 等於 `0.3` 且符合交易所 Tick Size 截斷規則。
3. **Step 3: 專業日誌**: 整合 Winston，實作分級日誌與每日輪替。
   - **測試**: 確認 `logs/` 目錄能正確產生當日日誌檔案。
4. **Step 4: 簽名模組**: 實作 `api/auth.js` (HMAC-SHA256)。
   - **測試**: 使用幣安範例數據驗證簽名結果。
5. **Step 5: 餘額同步**: 實作 `BinanceClient.getBalances()`。
   - **測試**: 成功印出當前帳戶資產列表。

### **第二階段：數據與進階策略 (Market & Advanced Strategy)**
6. **Step 6: 市場規則解析**: 自動抓取 `tickSize`, `stepSize` 與 `minNotional`。
   - **測試**: 驗證下單量計算是否永遠大於幣安最小金額限制。
7. **Step 7: WebSocket 即時盤口**: 實作 `WSClient.js` 訂閱 `@bookTicker`。
   - **測試**: 人為斷網測試 5 秒內自動重連機制。
8. **Step 8: 庫存偏移策略 (Inventory Skew)**: 參考 Backpack-MM 實作價格偏移邏輯。
   - **測試**: 模擬持倉 80% 時，賣單價格應更貼近中間價。
9. **Step 9: 動態價差 (Adaptive Spread)**: 根據市場深度與成交量自動縮放 Spread。
   - **測試**: 模擬盤口變薄時，價差是否自動拉開。
10. **Step 10: 波動率防禦 (Volatility Guard)**: 實作 ATR 或標準差監控。
    - **測試**: 模擬短時間暴漲跌時，機器人是否觸發暫停掛單 (Panic Stop)。
11. **Step 11: 多層掛單 (Shadow Orders)**: 實作多層 Grid Layers 計算。
    - **測試**: 驗證每一層掛單價格是否符合市場最小變動單位。
12. **Step 12: 本地回測引擎**: 讀取歷史 JSON 進行策略收益與風險模擬。
    - **測試**: 輸出 PnL 報告與最大庫存回撤圖表。

### **第三階段：緒控與執行 (Execution Engine)**
13. **Step 13: 緒控通訊協議**: 定義 Main 與 Worker 間的 JSON 數據格式。
    - **測試**: 驗證數據在線程傳遞過程中無精度丟失。
14. **Step 14: TraderWorker 封裝**: 將策略與 WS 邏輯搬入 Worker Thread。
    - **測試**: 主線程處理繁重任務時，Worker 報價處理不受影響。
15. **Step 15: 訂單管理員**: 實作 `OrderManager.js` 追蹤訂單 ID 與狀態。
    - **測試**: 斷線重啟後能成功對齊本地與遠端訂單。
16. **Step 16: 原子化下單**: 實作「撤舊掛新」同步機制。
    - **測試**: 在測試網 (Testnet) 驗證成交後的自動補單行為。
17. **Step 17: 頻率節流 (Throttling)**: 實作下單頻率防護。
    - **測試**: 確保在高頻行情下不會觸發 API 429 錯誤。

### **第四階段：監控與容器化 (Dashboard & Docker)**
18. **Step 18: 數據橋接**: 主線程透過 Socket.io 將數據發送至前端（節流 500ms）。
    - **測試**: 驗證前端接收頻率固定，不佔用 CPU。
19. **Step 19: Docker 化部署**: 撰寫 Dockerfile 與 docker-compose.yml。
    - **測試**: docker build 是否能在 Mac M3 Pro 上成功運行。
20. **Step 20: 壓力測試**: 啟動全系統進行 24 小時實戰壓力測試。
    - **測試**: 監控記憶體使用量，確保無 Leak 現象。

---

## 5. AI 協作協議 (AI Collaboration Protocols)

### 📋 溝通標準
- **語言模式**: 對話使用 **繁體中文**，專有名詞保留 **英文**。
- **文件格式**: Walkthrough 必須使用中英雙語對照，中文使用 Quote Block (`>`) 標示。
- **任務執行**: 嚴格遵守 Micro-Steps 順序，每步完成需附帶測試驗證。

### 🟢 狀態更新協議 (Trigger: "/update")
1. 分析程式碼變更。
2. 更新本檔案 [Project Status] 區塊的勾選狀態。

### 🔴 收工結算協議 (Trigger: "/finish")
1. **更新進度**: 勾選 [Project Status] 已完成項目。
2. **生成日誌**: 追加寫入 `AI_LOG.md` (由新到舊)。
   - 格式：`### 📅 YYYY-MM-DD HH:MM {功能}`
   - 內容：紀錄關鍵決策、變更內容、技術重點。
3. **提醒 Git**: 提醒執行 `git add . && git commit -m "feat: step X complete"`。

---