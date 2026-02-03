# TradingBot (加密貨幣高頻交易機器人)

基於 Node.js 20+ 的高精度幣安 (Binance) 現貨交易機器人。具備進階庫存管理、動態價差調整以及嚴格的環境隔離設計。

## 🚀 專案狀態 (Project Status)
**目前階段**: Phase 1 - 基礎建設 (已完成)
- [x] 環境與安全性隔離 (.env / gitignore)
- [x] 高精度運算核心 (`decimal.js` + Jest 驗證)
- [x] 專業日誌系統 (`winston` 每日輪替)
- [x] API 安全簽章模組 (`HMAC-SHA256`)
- [x] 餘額同步與即時連線驗證

## 🛠 技術棧 (Tech Stack)
- **執行環境**: Node.js 20+
- **數學運算**: `decimal.js` (精度: 20位, 捨入: HALF_UP)
- **API 通訊**: Binance Spot API (v3)
- **日誌系統**: `winston` + `winston-daily-rotate-file`
- **測試框架**: Jest, Nock, Sinon
- **容器化**: Docker (規劃中)

## 📂 專案結構
```bash
TradingBot/
├── src/
│   ├── api/          # 交易所通訊層 (Auth, Clients)
│   ├── utils/        # 核心工具 (Logger, Precision)
│   └── ...
├── tests/            # Jest 單元與整合測試
├── logs/             # 應用程式日誌 (每日輪替)
├── .env.example      # 環境變數範本
└── PROJECT_RULES.md  # 專案開發規範文件
```

## ⚙️ 安裝與設定

1. **Clone 專案**
   ```bash
   git clone https://github.com/shaopoooo/TradingBot.git
   cd TradingBot
   ```

2. **安裝依賴套件**
   ```bash
   npm install
   ```

3. **環境變數設定**
   複製範本檔案並填入您的幣安 API 金鑰。
   ```bash
   cp .env.example .env
   ```
   **注意**: 絕對不要將 `.env` 檔案提交至版本控制系統。

## 🧪 測試說明

本專案使用 **Jest** 作為測試框架。

### 執行單元測試 (Unit Tests)
執行所有邏輯驗證，包含精度計算、日誌生成、簽章演算法與 API Mock 測試。
```bash
npm test
```

### 執行真實連線測試 (Live API Test)
使用 `.env` 中的金鑰對幣安伺服器進行真實連線測試 (讀取餘額)。
```bash
npm run test:live
```
*注意: 若未設定 API Key，此測試將自動跳過。*

## ⚠️ 免責聲明
本軟體僅供教育與實驗用途。加密貨幣交易具有極高風險，作者不對使用本機器人所產生的任何財務損失負責。
