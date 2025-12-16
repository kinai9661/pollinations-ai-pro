# 🎨 Pollinations AI Pro Studio

> 一個基於 Next.js 15 與 Cloudflare Workers 構建的專業級、無伺服器 AI 圖像生成工作站，採用強大的 Flux.1 模型。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare-orange)
![Model](https://img.shields.io/badge/Model-Flux.1%20Schnell-emerald)

## ✨ 核心功能

- **🚀 Flux.1 Schnell 集成**: 透過 Pollinations.ai API 提供高品質、極速的圖像生成體驗。
- **💾 本地畫廊 (IndexedDB)**: 利用瀏覽器本地數據庫技術，可永久保存 **500+ 張** 生成記錄，無需任何伺服器存儲成本。
- **🎨 專業暗色 UI**: 專為創作者設計的「工作室」介面，包含獨立的左側參數控制欄與沉浸式畫布。
- **🔒 安全代理 (Secure Proxy)**: 透過後端 API Route 隱藏真實請求並處理跨域 (CORS) 問題，保護您的 API Key。
- **⚡ Serverless 架構**: 使用最新的 `wrangler autoconfig` 技術，一鍵部署至 Cloudflare Workers 全球邊緣網絡。

## 🛠️ 技術棧

- **框架**: [Next.js 15](https://nextjs.org/) (App Router)
- **部署**: [Cloudflare Workers](https://workers.cloudflare.com/) (Autoconfig 模式)
- **數據存儲**: [idb-keyval](https://github.com/jakearchibald/idb-keyval) (輕量級 IndexedDB 封裝)
- **樣式**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/)
- **AI 引擎**: [Pollinations.ai](https://pollinations.ai/)

---

## 🚀 部署指南 (免費)

本項目設計為可完全**免費部署**於 Cloudflare 平台。

### 前置準備
1. 一個 GitHub 帳號。
2. 一個 Cloudflare 帳號。
3. 本地已安裝 Node.js 環境。

### 第一步：克隆項目

git clone https://github.com/kinai9661/pollinations-ai-pro.git
cd pollinations-ai-pro
npm install

text

### 第二步：獲取 Pollinations API Key (推薦)
雖然 Pollinations API 可以免費使用，但配置 Key 可以獲得更穩定的生成體驗。
1. 前往 [https://enter.pollinations.ai/](https://enter.pollinations.ai/)
2. 註冊/登入並獲取您的 API Key。

### 第三步：本地開發

在項目根目錄創建一個 `.dev.vars` 文件 (用於本地環境變量)：

.dev.vars
POLLINATIONS_API_KEY=你的_api_key_貼在這裡

text

啟動開發服務器：

npm run dev

text

### 第四步：部署到 Cloudflare

我們使用 Wrangler 4.55+ 的最新 **Autoconfig** 功能，無需複雜配置。

1. 登入 Cloudflare 帳號：
npx wrangler login

text

2. 將 API Key 安全地上傳到 Cloudflare：
npx wrangler secret put POLLINATIONS_API_KEY

根據提示貼上你的 Key
text

3. 一鍵部署：
npx wrangler deploy --x-autoconfig

text

Cloudflare 將會自動識別 Next.js 框架，進行構建，並將應用發布到全球節點。

---

## 📸 介面預覽

| 工作室主介面 | 手機響應式效果 |
|:---:|:---:|
| *(請在此處替換為你的截圖)* | *(請在此處替換為你的截圖)* |

## 🤝 貢獻

歡迎提交 Pull Request 或 Issue 來改進這個項目！

## 📄 授權

本項目採用 MIT 授權協議 - 詳見 [LICENSE](LICENSE) 文件。

---

<p align="center">
Built with ❤️ by <a href="https://github.com/kinai9661">kinai9661</a>
</p>
