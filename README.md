# Pet Shop 管理後台系統

本專案為寵物電商平台的管理後台前端，使用 Vue 3 + TypeScript + Naive UI 開發，實作商品管理、分類管理、標籤管理等功能，
並串接 [Spring Boot RESTful API](https://github.com/lichenghsu/pet-shop-backend-rest-api)。

## 技術棧

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Naive UI](https://www.naiveui.com/)
- [Pinia](https://pinia.vuejs.org/)（可擴充）
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)

## 專案結構

```text
pet-shop-vue-frontend/
├── public/ # 靜態資源
├── src/
│ ├── api/ # Axios API 模組
│ ├── components/ # 可重用元件
│ ├── views/ # 各頁面檔案（含 admin 模組）
│ ├── router/ # Vue Router 設定
│ ├── assets/ # 圖片、樣式等
│ └── main.ts # 專案入口點
├── .vscode/ # 編輯器設定
├── .prettierrc # 格式化規則
├── tsconfig.json # TypeScript 設定
├── vite.config.ts # Vite 設定
└── README.md # 專案說明
```

## 已實作功能

- [x] 商品列表
- [x] 商品新增 / 編輯 / 刪除（含標籤、多選分類）
- [x] 表單驗證（Naive UI 驗證機制）
- [x] 分類與標籤動態載入
- [x] 儀表板卡片數據展示
- [x] 響應式 RWD 支援

## 開發指令

```bash
# 安裝依賴
npm install

# 本地開發
npm run dev

# 建構 production
npm run build
```

---

## API 後端

請搭配以下 REST API 專案使用：

[pet-shop-backend-rest-api](https://github.com/lichenghsu/pet-shop-backend-rest-api)

## TODO / 下一步

[]商品圖片上傳

[]分類 / 標籤管理頁面

[]使用者登入 / 權限驗證

[]儀表板統計圖表

作者

[lichenghsu](https://github.com/lichenghsu)
