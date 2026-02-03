# AI Project Log

### 📅 2026-02-03 17:40 Phase 1: Infrastructure Complete
- **功能**: 完成基礎建設 (Step 1-5)。
- **決策**:
  - 採用 `decimal.js` 並設定 ROUND_HALF_UP (20位精度) 以符合金融計算需求。
  - 測試框架遷移至 **Jest** + **Nock**，提升測試可維護性與速度。
  - `BinanceClient` 整合簽章與 Axios Interceptors，統一處理錯誤日誌。
- **變更**:
  - 新增 `src/utils/Precision.js`, `src/utils/Logger.js`, `src/api/auth.js`, `src/api/BinanceClient.js`。
  - 新增並重構所有測試至 `tests/*.test.js`。
  - 產出繁體中文 `README.md`。
