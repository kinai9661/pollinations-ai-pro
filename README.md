# 🎨 Flux AI Pro

<div align="center">

![Version](https://img.shields.io/badge/version-9.5.1--fixed-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)
![API](https://img.shields.io/badge/API-Pollinations.ai-purple)

**基於 Cloudflare Workers 的專業 AI 圖像生成服務**

[English](#english) | [中文](#中文)

</div>

---

## 中文

### ✨ 功能特點

- 🎨 **4 個官方模型**
  - **Z-Image Turbo** ⚡ - 6B 參數，極速生成
  - **Flux 標準版** - 平衡速度與質量
  - **Flux Turbo** ⚡ - 超快速生成
  - **Kontext** 🎨 - 支持圖生圖

- 🌐 **完整的 Web UI 界面**
  - 三欄式佈局（參數 | 結果 | 提示詞）
  - 實時配置預覽
  - 歷史記錄管理
  - 響應式設計

- 🚀 **智能優化**
  - 自動中文翻譯（支持 Cloudflare Workers AI）
  - HD 高清增強（3 種質量模式）
  - 智能參數優化
  - 複雜度分析

- 🎯 **風格預設**
  - 8+ 種藝術風格
  - 自定義風格組合
  - 正面/負面提示詞

- 🖼️ **圖生圖支持**
  - Kontext 模型支持參考圖像
  - 多張圖片輸入
  - URL 方式上傳

- 💾 **本地歷史記錄**
  - 自動保存生成記錄
  - 重用參數功能
  - 導出/清空記錄
  - 最多保存 100 條

- 🔐 **可選認證**
  - 支持官方 API Key
  - 匿名模式可用
  - 環境變量配置

### 📦 技術棧

- **運行環境**: Cloudflare Workers
- **AI 翻譯**: Cloudflare Workers AI
- **前端**: 原生 HTML/CSS/JavaScript
- **API**: Pollinations.ai Official API
- **存儲**: localStorage（客戶端）

### 🚀 快速開始

#### 1. 克隆項目

git clone https://github.com/yourusername/flux-ai-pro.git
cd flux-ai-pro

text

#### 2. 安裝 Wrangler

npm install -g wrangler

text

#### 3. 登錄 Cloudflare

wrangler login

text

#### 4. 配置環境變量（可選）

如果需要使用官方 API Key 認證：

wrangler secret put POLLINATIONS_API_KEY

輸入你的 API Key: pol_xxxxxxxxxx
text

#### 5. 部署

wrangler deploy

text

#### 6. 訪問

部署成功後，訪問你的 Worker URL：
https://flux-ai-pro.your-subdomain.workers.dev

text

### ⚙️ 配置說明

#### wrangler.toml 基本配置

name = "flux-ai-pro"
main = "worker.js"
compatibility_date = "2024-12-17"

[ai]
binding = "AI"

[limits]
cpu_ms = 50000

compatibility_flags = ["nodejs_compat"]

text

#### 環境變量

| 變量名 | 說明 | 必需 |
|--------|------|------|
| `POLLINATIONS_API_KEY` | Pollinations.ai API Key | 是 |

### 🎨 使用方法

#### 1. 基本生成

1. 輸入提示詞（支持中文）
2. 選擇模型和尺寸
3. 選擇風格（可選）
4. 點擊「開始生成」

#### 2. 進階選項

- **Seed**: 設置隨機種子（-1 為隨機）
- **生成數量**: 1-4 張
- **自動優化**: 智能調整參數
- **HD 增強**: 自動提升質量

#### 3. 圖生圖（Kontext）

1. 選擇 Kontext 模型
2. 在「參考圖像 URL」中輸入圖片地址
3. 輸入提示詞描述變化
4. 生成

#### 4. 歷史記錄

- 自動保存所有生成記錄
- 點擊「重用」快速復用參數
- 點擊圖片查看大圖
- 下載圖片到本地

### 📊 模型對比

| 模型 | 速度 | 質量 | 參數量 | 價格* | 特點 |
|------|------|------|--------|-------|------|
| Z-Image Turbo | ⚡⚡⚡ | ⭐⭐⭐ | 6B | 0.0002 | 極速生成 |
| Flux 標準版 | ⚡⚡ | ⭐⭐⭐⭐ | - | 0.00012 | 平衡 |
| Flux Turbo | ⚡⚡⚡ | ⭐⭐⭐ | - | 0.0003 | 快速 |
| Kontext | ⚡ | ⭐⭐⭐⭐⭐ | - | 0.04 | 圖生圖 |

*價格單位: Pollen credits

### 🎯 質量模式

| 模式 | 最小分辨率 | Steps 倍率 | 適用場景 |
|------|-----------|-----------|---------|
| 經濟模式 | 1024px | 0.85x | 快速預覽 |
| 標準模式 | 1280px | 1.0x | 日常使用 |
| 超高清模式 | 1536px | 1.35x | 高質量輸出 |

### 🎨 內置風格

- 動漫風格 ✨
- 寫實照片 📷
- 油畫 🎨
- 水彩畫 💧
- 賽博朋克 🌃
- 奇幻風格 🐉
- 吉卜力風格 🍃

### 📐 尺寸預設

- 方形: 1024x1024, 1536x1536, 2048x2048
- 豎屏: 1080x1920 (9:16)
- 橫屏: 1920x1080 (16:9)
- Instagram: 1080x1080
- 桌布: 1920x1080 (Full HD)

### 🔧 開發

#### 本地開發

啟動開發服務器
wrangler dev

查看日誌
wrangler tail

查看部署列表
wrangler deployments list

text

#### 文件結構

flux-ai-pro/
├── worker.js # 主程序
├── wrangler.toml # Cloudflare 配置
├── README.md # 說明文檔
└── package.json # 依賴配置（可選）

text

### 🐛 常見問題

#### Q: 圖片生成失敗？
A: 檢查網絡連接，確保提示詞不為空，嘗試更換模型。

#### Q: 中文翻譯不工作？
A: 確保 `wrangler.toml` 中已綁定 Workers AI：
[ai]
binding = "AI"

text

#### Q: 如何使用 API Key？
A: 運行以下命令設置：
wrangler secret put POLLINATIONS_API_KEY

text

#### Q: 歷史記錄丟失？
A: 歷史記錄保存在瀏覽器 localStorage，清除瀏覽器數據會丟失。

### 📜 更新日誌

#### v9.5.1-fixed (2025-12-17)
- ✅ 修復 CSP 內聯事件錯誤
- ✅ 添加 Favicon（避免 404）
- ✅ 修復生成結果顯示問題
- ✅ 優化歷史記錄顯示
- ✅ 改進錯誤處理

#### v9.5.0
- 🎨 添加 4 個官方模型支持
- 🌐 完整 Web UI 界面
- 🚀 智能參數優化
- 🖼️ 圖生圖功能
- 💾 本地歷史記錄

### 📄 許可證

MIT License

### 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 🔗 相關鏈接

- [Pollinations.ai](https://pollinations.ai/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [項目主頁](https://github.com/yourusername/flux-ai-pro)

---

## English

### ✨ Features

- 🎨 **4 Official Models**
  - **Z-Image Turbo** ⚡ - 6B parameters, lightning fast
  - **Flux Standard** - Balanced speed and quality
  - **Flux Turbo** ⚡ - Ultra-fast generation
  - **Kontext** 🎨 - Supports image-to-image

- 🌐 **Complete Web UI**
  - Three-column layout (Parameters | Results | Prompts)
  - Real-time configuration preview
  - History management
  - Responsive design

- 🚀 **Smart Optimization**
  - Auto Chinese translation (powered by Cloudflare Workers AI)
  - HD enhancement (3 quality modes)
  - Intelligent parameter optimization
  - Complexity analysis

- 🎯 **Style Presets**
  - 8+ artistic styles
  - Custom style combinations
  - Positive/negative prompts

- 🖼️ **Image-to-Image Support**
  - Kontext model supports reference images
  - Multiple image inputs
  - URL-based upload

- 💾 **Local History**
  - Auto-save generation records
  - Reuse parameters feature
  - Export/clear records
  - Up to 100 records

- 🔐 **Optional Authentication**
  - Official API Key support
  - Anonymous mode available
  - Environment variable configuration

### 📦 Tech Stack

- **Runtime**: Cloudflare Workers
- **AI Translation**: Cloudflare Workers AI
- **Frontend**: Native HTML/CSS/JavaScript
- **API**: Pollinations.ai Official API
- **Storage**: localStorage (client-side)

### 🚀 Quick Start

#### 1. Clone Repository

git clone https://github.com/yourusername/flux-ai-pro.git
cd flux-ai-pro

text

#### 2. Install Wrangler

npm install -g wrangler

text

#### 3. Login to Cloudflare

wrangler login

text

#### 4. Configure Environment Variables (Optional)

To use official API Key authentication:

wrangler secret put POLLINATIONS_API_KEY

Enter your API Key: pol_xxxxxxxxxx
text

#### 5. Deploy

wrangler deploy

text

#### 6. Visit

After successful deployment, visit your Worker URL:
https://flux-ai-pro.your-subdomain.workers.dev

text

### ⚙️ Configuration

#### Basic wrangler.toml

name = "flux-ai-pro"
main = "worker.js"
compatibility_date = "2024-12-17"

[ai]
binding = "AI"

[limits]
cpu_ms = 50000

compatibility_flags = ["nodejs_compat"]

text

#### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POLLINATIONS_API_KEY` | Pollinations.ai API Key | No |

### 🎨 Usage

#### 1. Basic Generation

1. Enter prompt (Chinese supported)
2. Select model and size
3. Choose style (optional)
4. Click "Start Generation"

#### 2. Advanced Options

- **Seed**: Set random seed (-1 for random)
- **Number**: 1-4 images
- **Auto Optimize**: Smart parameter adjustment
- **HD Enhancement**: Auto quality boost

#### 3. Image-to-Image (Kontext)

1. Select Kontext model
2. Enter image URL in "Reference Images"
3. Describe desired changes in prompt
4. Generate

#### 4. History

- Auto-save all generation records
- Click "Reuse" to quickly reuse parameters
- Click image to view full size
- Download images locally

### 📊 Model Comparison

| Model | Speed | Quality | Parameters | Price* | Features |
|-------|-------|---------|------------|--------|----------|
| Z-Image Turbo | ⚡⚡⚡ | ⭐⭐⭐ | 6B | 0.0002 | Lightning fast |
| Flux Standard | ⚡⚡ | ⭐⭐⭐⭐ | - | 0.00012 | Balanced |
| Flux Turbo | ⚡⚡⚡ | ⭐⭐⭐ | - | 0.0003 | Fast |
| Kontext | ⚡ | ⭐⭐⭐⭐⭐ | - | 0.04 | Image-to-image |

*Price unit: Pollen credits

### 🎯 Quality Modes

| Mode | Min Resolution | Steps Multiplier | Use Case |
|------|----------------|------------------|----------|
| Economy | 1024px | 0.85x | Quick preview |
| Standard | 1280px | 1.0x | Daily use |
| Ultra HD | 1536px | 1.35x | High quality |

### 🎨 Built-in Styles

- Anime ✨
- Photorealistic 📷
- Oil Painting 🎨
- Watercolor 💧
- Cyberpunk 🌃
- Fantasy 🐉
- Studio Ghibli 🍃

### 📐 Size Presets

- Square: 1024x1024, 1536x1536, 2048x2048
- Portrait: 1080x1920 (9:16)
- Landscape: 1920x1080 (16:9)
- Instagram: 1080x1080
- Wallpaper: 1920x1080 (Full HD)

### 🔧 Development

#### Local Development

Start dev server
wrangler dev

View logs
wrangler tail

List deployments
wrangler deployments list

text

#### File Structure

flux-ai-pro/
├── worker.js # Main program
├── wrangler.toml # Cloudflare config
├── README.md # Documentation
└── package.json # Dependencies (optional)

text

### 🐛 FAQ

#### Q: Image generation fails?
A: Check network connection, ensure prompt is not empty, try different model.

#### Q: Chinese translation not working?
A: Make sure Workers AI is bound in `wrangler.toml`:
[ai]
binding = "AI"

text

#### Q: How to use API Key?
A: Run this command to set it:
wrangler secret put POLLINATIONS_API_KEY

text

#### Q: History records lost?
A: History is saved in browser localStorage, clearing browser data will lose records.

### 📜 Changelog

#### v9.5.1-fixed (2025-12-17)
- ✅ Fixed CSP inline event errors
- ✅ Added Favicon (avoid 404)
- ✅ Fixed generation result display
- ✅ Improved history display
- ✅ Enhanced error handling

#### v9.5.0
- 🎨 Added 4 official model support
- 🌐 Complete Web UI interface
- 🚀 Smart parameter optimization
- 🖼️ Image-to-image feature
- 💾 Local history records

### 📄 License

MIT License

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 🔗 Links

- [Pollinations.ai](https://pollinations.ai/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Project Homepage](https://github.com/yourusername/flux-ai-pro)

---

<div align="center">

**Made with ❤️ by the community**

⭐ Star this repo if you find it helpful!

