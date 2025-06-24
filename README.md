# Pet Shop 管理後台系統

本專案為寵物電商平台的管理後台前端，使用 Vue 3 + TypeScript + Naive UI 開發，實作商品管理、分類管理、標籤管理等功能，
並串接 [Spring Boot RESTful API](https://github.com/lichenghsu/pet-shop-backend-rest-api)。

## 技術棧

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Naive UI](https://www.naiveui.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)

---

## 專案結構

```text
pet-shop-vue-frontend/
├── public/               # 靜態資源
├── src/
│   ├── api/              # Axios API 模組
│   ├── components/       # 可重用元件（含圖表、表單等）
│   ├── views/            # 各頁面檔案（含 admin 模組）
│   ├── types/            # 回應 / 請求的 TS 型別定義
│   ├── router/           # Vue Router 設定
│   ├── stores/           # Pinia 狀態管理
│   ├── assets/           # 圖片、樣式等
│   └── main.ts           # 專案入口點
├── .vscode/              # 編輯器設定
├── .prettierrc           # 格式化規則
├── tsconfig.json         # TypeScript 設定
├── vite.config.ts        # Vite 設定
└── README.md             # 專案說明
```

---

## 已實作功能

- [x] 商品列表
- [x] 商品新增 / 編輯 / 刪除（含標籤、多選分類）
- [x] 表單驗證（Naive UI 驗證機制）
- [x] 分類與標籤動態載入
- [x] 訂單管理（查看訂單、批次狀態修改）
- [x] 會員管理（啟用 / 停用帳號切換）
- [x] 儀表板統計圖表（商品數、會員數、營收總額、每月營收條狀圖）
- [x] 權限控管（登入、前端路由守衛、ROLE_ADMIN 限制）
- [x] 響應式設計（桌面、平板、手機支援）
- [x] 表單驗證（Naive UI 表單校驗）

---

## 開發指令

```bash
# 安裝依賴
npm install

# 本地開發
npm run dev

# 建構 production
npm run build
```

如果使用 Nginx，需支援 HTML5 history 模式路由：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## API 後端

請搭配以下 REST API 專案使用：

[pet-shop-backend-rest-api](https://github.com/lichenghsu/pet-shop-backend-rest-api)

---

## 部屬建議

作者

[lichenghsu](https://github.com/lichenghsu)
