# PROJECT_RULE.md

## 1. 專案狀態 (Project Status)
> [!IMPORTANT]
> Gemini 必須在每次 [/finish] 指令後更新此區塊。
- **目前階段**: 專案啟動與環境建置 (Phase 1: Infrastructure)
- **當前任務**: 執行 Step 1-3 基礎環境、工具建置與 Jest 測試環境初始化
- **待辦清單**:
  - [x] 建立完整 PROJECT_RULE.md (包含 20 階段微步驟)
  - [ ] Step 1-5: 基礎建設與 API 通訊
  - [ ] Step 6-12: 市場數據與進階策略 (參考 Backpack-MM 演化)
  - [ ] Step 13-17: 緒控引擎與交易執行 (Worker Threads)
  - [ ] Step 18-20: 容器化部署與 React 儀表板

---

## 2. 技術規範 (Tech Stack)
- **Runtime**: Node.js 20+ (Alpine for Docker)
- **Concurrence**: Worker Threads (隔離交易邏輯與 Web 服務)
- **Math**: `decimal.js` (精確度: 20, 捨入: ROUND_HALF_UP)
- **Testing**: **Jest** (核心框架), **Nock** (模擬 API 請求), **Sinon** (模擬時間與重連)
- **API**: Binance API (REST + WebSocket)
- **Logging**: Winston (Daily Rotate File & Console)
- **Dashboard**: React 19 / Vite 7 / TailwindCSS 4
- **Container**: Docker / Docker-Compose

---

## 3. 檔案模組化架構
- **src/api/**: 交易所通訊層 (Auth, Clients, Signature)
- **src/strategies/**: 策略計算層 (Inventory Skew, Adaptive Spread)
- **src/engine/**: 執行緒調度層 (TraderWorker, OrderManager)
- **src/web/**: 監控伺服器 (Express, Socket.io Bridge)
- **src/utils/**: 核心工具 (Logger, Precision)
- **tests/**: 單元測試與集成測試腳本 (`*.test.js`)
- **dashboard/**: React 前端專案原始碼

---

## 4. 二十階段微步驟與測試驗證 (Micro-Steps & Tests)

### 第一階段：基礎與安全 (Infrastructure)
1. **Step 1: 環境隔離**: 建立 `.env.example`, `.gitignore`, `.dockerignore`。
   - **驗證**: `git status` 確保無 `.env` 等敏感檔案。
2. **Step 2: 精度核心**: 實作 `utils/Precision.js` 並初始化 **Jest** 配置。
   - **測試**: 使用 Jest 驗證 `0.1 + 0.2` 精確等於 `0.3`。
3. **Step 3: 專業日誌**: 整合 Winston，實作分級日誌與每日輪替。
   - **測試**: 確認 `logs/` 目錄能產生實體日誌檔案且格式正確。
4. **Step 4: 簽名模測**: 實作 `api/auth.js` (HMAC-SHA256)。
   - **測試**: 比對幣安官方 SDK 提供之標準簽名結果。
5. **Step 5: 餘額同步**: 實作 `BinanceClient.getBalances()`。
   - **測試**: 使用 **Nock** 模擬 API 回傳，驗證餘額解析函數。

### 第二階段：數據與進階策略 (Market & Strategy)
6. **Step 6: 市場規則解析**: 自動抓取 `tickSize`, `stepSize`。
   - **測試**: 驗證下單量截斷函數是否符合交易所精度規範。
7. **Step 7: WebSocket 盤口監控**: 實作訂閱 `@bookTicker`。
   - **測試**: 使用 **Sinon** 模擬斷線，驗證 5 秒內觸發自動重連。
8. **Step 8: 庫存偏移策略**: 參考 `Backpack-MM` 實作偏移邏輯。
   - **測試**: 單元測試驗證持倉偏離 50% 時，Bid/Ask 的調整幅度。
9. **Step 9: 動態價差 (Adaptive Spread)**: 根據深度自動縮放 Spread。
   - **測試**: 模擬 Orderbook 變薄時，價差是否隨之拉開。
10. **Step 10: 波動率防禦 (Volatility Guard)**: 實作 ATR 或標準差監控。
    - **測試**: 模擬瞬時價格暴跌，驗證是否觸發 **Panic Stop**。
11. **Step 11: 多層掛單 (Shadow Orders)**: 實作多層 Grid Layers。
    - **測試**: 驗證各層級價格之最小變動單位。
12. **Step 12: 本地回測引擎**: 讀取歷史數據模擬策略。
    - **測試**: 輸出 PnL 回報率報告。

### 第三階段：緒控與執行 (Execution Engine)
13. **Step 13: 緒控通訊協議**: 定義 `Main` 與 `Worker` 傳輸格式。
    - **測試**: 驗證數據在 `postMessage` 傳遞過程中無精度丟失。
14. **Step 14: TraderWorker 封裝**: 將策略搬入獨立線程。
    - **測試**: 監控主線程阻塞時，Worker 處理報價之延遲。
15. **Step 15: 訂單管理員**: 實作 `OrderManager.js`。
    - **測試**: 模擬重複下單，驗證本地緩存與 API 的一致性。