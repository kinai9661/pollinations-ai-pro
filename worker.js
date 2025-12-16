// =================================================================================
//  項目: Flux AI Pro
//  版本: 9.4.0-official
//  作者: Enhanced by AI Assistant  
//  日期: 2025-12-17
//  更新: ✅ 官方 API (gen.pollinations.ai) | ✅ API Key 認證 | ✅ 環境變量支持
//  功能: 多張生成 | Seed控制 | 39種風格 | 35+尺寸 | API優化 | 圖生圖
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "Flux-AI-Pro",
  PROJECT_VERSION: "9.4.0-official",
  API_MASTER_KEY: "1",
  
  // ✅ 新增: API 認證配置
  POLLINATIONS_AUTH: {
    enabled: false,              // 改為 true 啟用認證
    token: "",                   // 填入你的 API Key (格式: pol_xxxxxxxxxx)
    method: "header"             // "header" 是官方推薦方式
  },
  
  PROVIDERS: {
    pollinations: {
      name: "Pollinations.ai",
      // ✅ 更新: 使用新的官方端點
      endpoint: "https://gen.pollinations.ai",
      pathPrefix: "/image",      // ✅ 新增: 路徑前綴
      type: "direct",
      auth_mode: "optional",
      requires_key: false,
      enabled: true,
      default: true,
      description: "完全免費的 AI 圖像生成服務 (支持 API Key 提升速率)",
      features: {
        private_mode: true,
        custom_size: true,
        seed_control: true,
        negative_prompt: true,
        enhance: true,
        nologo: true,
        style_presets: true,
        auto_hd: true,
        quality_modes: true,
        auto_translate: true,
        ultra_hd_4k: true,
        reference_images: true,
        image_to_image: true,
        multi_image_fusion: true,
        batch_generation: true,
        api_key_auth: true
      },
      models: [
        { id: "flux", name: "Flux", confirmed: true, category: "flux", description: "均衡速度與質量", max_size: 2048 },
        { id: "flux-realism", name: "Flux Realism", confirmed: true, category: "flux", description: "超寫實風格", max_size: 2048 },
        { id: "flux-anime", name: "Flux Anime", confirmed: true, category: "flux", description: "日系動漫風格", max_size: 2048 },
        { id: "flux-3d", name: "Flux 3D", confirmed: true, category: "flux", description: "3D 渲染風格", max_size: 2048 },
        { id: "flux-pro", name: "Flux Pro", confirmed: true, category: "flux", description: "專業版最高質量", max_size: 2048 },
        { id: "any-dark", name: "Any Dark", confirmed: true, category: "flux", description: "暗黑風格", max_size: 2048 },
        { id: "turbo", name: "Turbo", confirmed: true, category: "flux", description: "極速生成", max_size: 2048 },
        { id: "flux-1.1-pro", name: "Flux 1.1 Pro 🔥", confirmed: false, fallback: ["flux-pro", "flux-realism"], experimental: true, category: "flux-advanced", description: "最新 Flux 1.1", max_size: 2048 },
        { id: "flux-kontext", name: "Flux Kontext 🎨", confirmed: false, fallback: ["flux-pro", "flux-realism"], experimental: true, category: "flux-advanced", description: "圖像編輯 (1張參考圖)", max_size: 2048, supports_reference_images: true, max_reference_images: 1 },
        { id: "flux-kontext-pro", name: "Flux Kontext Pro 💎", confirmed: false, fallback: ["flux-kontext", "flux-pro"], experimental: true, category: "flux-advanced", description: "圖像編輯專業版 (1張參考圖)", max_size: 2048, supports_reference_images: true, max_reference_images: 1 },
        { id: "nanobanana", name: "Nano Banana 🍌", confirmed: true, category: "gemini", description: "Gemini 2.5 Flash (4張參考圖)", max_size: 2048, supports_reference_images: true, max_reference_images: 4 },
        { id: "nanobanana-pro", name: "Nano Banana Pro 🍌💎", confirmed: true, category: "gemini", description: "Gemini 3 Pro (4K + 4張參考圖)", max_size: 4096, ultra_hd: true, supports_reference_images: true, max_reference_images: 4 },
        { id: "sd3", name: "Stable Diffusion 3 ⚡", confirmed: false, fallback: ["flux-realism", "flux"], experimental: true, category: "stable-diffusion", description: "SD3 標準版", max_size: 2048 },
        { id: "sd3.5-large", name: "SD 3.5 Large 🔥", confirmed: false, fallback: ["sd3", "flux-realism"], experimental: true, category: "stable-diffusion", description: "SD 3.5 大模型", max_size: 2048 },
        { id: "sd3.5-turbo", name: "SD 3.5 Turbo ⚡", confirmed: false, fallback: ["turbo", "flux"], experimental: true, category: "stable-diffusion", description: "SD 3.5 快速版", max_size: 2048 },
        { id: "sdxl", name: "SDXL 📐", confirmed: false, fallback: ["flux-realism", "flux"], experimental: true, category: "stable-diffusion", description: "經典 SDXL", max_size: 2048 },
        { id: "sdxl-lightning", name: "SDXL Lightning ⚡", confirmed: false, fallback: ["turbo", "flux"], experimental: true, category: "stable-diffusion", description: "SDXL 極速版", max_size: 2048 }
      ],
      rate_limit: null,
      max_size: { width: 4096, height: 4096 }
    }
  },
  
  DEFAULT_PROVIDER: "pollinations",
  
  // 風格預設保持不變 (39種)
  STYLE_PRESETS: {
    none: { name: "無 (使用原始提示詞)", prompt: "", negative: "" },
    anime: { name: "動漫風格 ✨", prompt: "anime style, anime art, vibrant colors, anime character, detailed anime", negative: "realistic, photograph, 3d, ugly" },
    "anime-chibi": { name: "Q版動漫 🎎", prompt: "chibi style, cute chibi character, big eyes, small body, kawaii, adorable", negative: "realistic, tall, adult proportions, serious" },
    "japanese-manga": { name: "日本漫畫 📚", prompt: "manga style, black and white manga, screentone, manga panel, Japanese comic art, ink drawing", negative: "colored, realistic, photograph, western comic" },
    "shoujo-manga": { name: "少女漫畫 💕", prompt: "shoujo manga style, sparkles, flowers background, big expressive eyes, romantic, soft lines", negative: "shounen, action, dark, gritty" },
    "seinen-manga": { name: "青年漫畫 🗡️", prompt: "seinen manga style, detailed linework, realistic anatomy, mature themes, detailed shading", negative: "childish, cute, simple, cartoon" },
    photorealistic: { name: "寫實照片 📷", prompt: "photorealistic, ultra realistic, 8k uhd, professional photography, detailed, sharp focus, DSLR, high resolution", negative: "anime, cartoon, illustration, painting, drawing, art" },
    "cinematic": { name: "電影級 🎬", prompt: "cinematic lighting, movie still, dramatic lighting, film grain, depth of field, bokeh, anamorphic lens", negative: "amateur, flat lighting, overexposed, cartoon" },
    "portrait": { name: "人像攝影 👤", prompt: "professional portrait, studio lighting, bokeh background, 85mm lens, shallow depth of field, perfect skin", negative: "full body, landscape, distorted face, bad lighting" },
    "oil-painting": { name: "油畫 🎨", prompt: "oil painting, classical oil painting style, visible brushstrokes, rich colors, artistic, canvas texture", negative: "photograph, digital art, anime, flat" },
    watercolor: { name: "水彩畫 💧", prompt: "watercolor painting, soft colors, watercolor texture, artistic, hand-painted, paper texture, flowing colors", negative: "photograph, digital, sharp edges, 3d" },
    "chinese-painting": { name: "中國水墨畫 🖌️", prompt: "Chinese ink painting, sumi-e style, traditional Chinese art, brush painting, minimalist, black ink, rice paper", negative: "colorful, western, digital, photograph" },
    "ukiyo-e": { name: "浮世繪 🗾", prompt: "ukiyo-e style, Japanese woodblock print, Hokusai style, traditional Japanese art, flat colors, bold outlines", negative: "3d, realistic, photograph, modern" },
    sketch: { name: "素描 ✏️", prompt: "pencil sketch, hand-drawn, sketch art, graphite drawing, artistic sketch, cross-hatching", negative: "colored, painted, digital, photograph" },
    "charcoal": { name: "炭筆畫 🖍️", prompt: "charcoal drawing, charcoal sketch, dramatic shading, black and white, expressive strokes", negative: "colored, digital, clean lines, photograph" },
    "digital-art": { name: "數位藝術 💻", prompt: "digital art, digital painting, concept art, artstation, highly detailed, vibrant colors", negative: "photograph, traditional art, sketch, low quality" },
    "pixel-art": { name: "像素藝術 🕹️", prompt: "pixel art, 8-bit style, retro gaming, pixelated, limited color palette, sharp pixels", negative: "high resolution, smooth, realistic, blurry" },
    "vector-art": { name: "向量藝術 📐", prompt: "vector art, flat design, clean lines, geometric shapes, Adobe Illustrator style, minimalist", negative: "realistic, textured, sketchy, photograph" },
    "low-poly": { name: "低多邊形 🔷", prompt: "low poly art, geometric, faceted, 3D low poly, minimalist 3D, triangular faces", negative: "high poly, realistic, smooth, curved" },
    fantasy: { name: "奇幻風格 🐉", prompt: "fantasy art, magical, epic fantasy, detailed fantasy illustration, mystical, enchanted", negative: "modern, realistic, mundane, contemporary" },
    "dark-fantasy": { name: "黑暗奇幻 🌑", prompt: "dark fantasy, gothic, dark atmosphere, ominous, sinister, dramatic shadows, horror elements", negative: "bright, cheerful, cute, colorful" },
    "fairy-tale": { name: "童話風格 🧚", prompt: "fairy tale art, storybook illustration, whimsical, magical, enchanted forest, dreamy", negative: "realistic, modern, dark, gritty" },
    cyberpunk: { name: "賽博朋克 🌃", prompt: "cyberpunk style, neon lights, futuristic, sci-fi, dystopian, high-tech low-life, blade runner style", negative: "natural, rustic, medieval, fantasy" },
    "sci-fi": { name: "科幻未來 🚀", prompt: "sci-fi, futuristic, advanced technology, space age, sleek design, holographic", negative: "medieval, fantasy, historical, primitive" },
    steampunk: { name: "蒸汽朋克 ⚙️", prompt: "steampunk style, Victorian era, brass and copper, gears and cogs, mechanical, industrial revolution", negative: "modern, digital, minimalist, clean" },
    "vaporwave": { name: "蒸氣波 🌈", prompt: "vaporwave aesthetic, retro 80s, neon pink and cyan, glitch art, nostalgic, geometric patterns", negative: "realistic, modern, natural colors" },
    "studio-ghibli": { name: "吉卜力風格 🍃", prompt: "Studio Ghibli style, Hayao Miyazaki, anime, soft colors, whimsical, detailed background, hand-drawn", negative: "realistic, dark, 3D, western animation" },
    "disney": { name: "迪士尼風格 🏰", prompt: "Disney animation style, 3D animated, Pixar style, colorful, expressive characters, family-friendly", negative: "realistic, anime, dark, gritty" },
    "comic-book": { name: "美式漫畫 💥", prompt: "comic book style, bold lines, halftone dots, superhero comic, dynamic pose, action lines", negative: "realistic, photograph, manga, soft" },
    "pop-art": { name: "普普藝術 🎭", prompt: "pop art style, Andy Warhol, Roy Lichtenstein, bold colors, halftone, graphic design, retro", negative: "realistic, subtle, muted colors, classical" },
    "art-deco": { name: "裝飾藝術 💎", prompt: "art deco style, geometric patterns, luxurious, elegant, 1920s, gold and black, symmetrical", negative: "organic, natural, messy, modern minimalist" },
    "art-nouveau": { name: "新藝術風格 🌺", prompt: "art nouveau style, flowing lines, organic forms, floral motifs, Alphonse Mucha, elegant curves", negative: "geometric, modern, minimalist, angular" },
    "impressionism": { name: "印象派 🌅", prompt: "impressionism style, visible brushstrokes, emphasis on light, Monet, soft focus, outdoor scenes", negative: "sharp, detailed, photorealistic, digital" },
    "abstract": { name: "抽象藝術 🎨", prompt: "abstract art, non-representational, geometric shapes, bold colors, expressive, modern art", negative: "realistic, detailed, representational, photographic" },
    "minimalist": { name: "極簡主義 ⬜", prompt: "minimalist art, simple, clean lines, negative space, limited color palette, modern, elegant", negative: "detailed, complex, ornate, cluttered" },
    "graffiti": { name: "塗鴉藝術 🎨", prompt: "graffiti art, street art, spray paint, urban, bold colors, tags, wild style lettering", negative: "classical, refined, photorealistic, corporate" },
    "surrealism": { name: "超現實主義 🌀", prompt: "surrealism, dreamlike, Salvador Dali style, impossible geometry, bizarre, subconscious imagery", negative: "realistic, ordinary, conventional, logical" },
    "horror": { name: "恐怖風格 👻", prompt: "horror art, creepy, disturbing, dark atmosphere, unsettling, macabre, gothic horror", negative: "cute, bright, cheerful, wholesome" },
    "kawaii": { name: "可愛風格 🌸", prompt: "kawaii style, cute, adorable, pastel colors, Japanese cute culture, soft, rounded shapes", negative: "realistic, dark, scary, mature" }
  },
  
  // 優化規則保持不變
  OPTIMIZATION_RULES: {
    MODEL_STEPS: {
      "turbo": { min: 4, optimal: 8, max: 12 },
      "sdxl-lightning": { min: 4, optimal: 6, max: 10 },
      "sd3.5-turbo": { min: 8, optimal: 12, max: 20 },
      "flux": { min: 15, optimal: 20, max: 30 },
      "flux-anime": { min: 15, optimal: 20, max: 30 },
      "flux-3d": { min: 15, optimal: 22, max: 35 },
      "sd3": { min: 18, optimal: 25, max: 35 },
      "sdxl": { min: 20, optimal: 28, max: 40 },
      "flux-realism": { min: 20, optimal: 28, max: 40 },
      "flux-pro": { min: 25, optimal: 32, max: 45 },
      "flux-1.1-pro": { min: 20, optimal: 28, max: 40 },
      "sd3.5-large": { min: 25, optimal: 35, max: 50 },
      "flux-kontext": { min: 22, optimal: 30, max: 40 },
      "flux-kontext-pro": { min: 25, optimal: 35, max: 45 },
      "any-dark": { min: 18, optimal: 24, max: 35 },
      "nanobanana": { min: 15, optimal: 22, max: 30 },
      "nanobanana-pro": { min: 25, optimal: 35, max: 50 }
    },
    SIZE_MULTIPLIER: {
      small: { threshold: 512 * 512, multiplier: 0.8 },
      medium: { threshold: 1024 * 1024, multiplier: 1.0 },
      large: { threshold: 1536 * 1536, multiplier: 1.15 },
      xlarge: { threshold: 2048 * 2048, multiplier: 1.3 },
      ultra_4k: { threshold: 4096 * 4096, multiplier: 1.5 }
    },
    STYLE_ADJUSTMENT: {
      "photorealistic": 1.1,
      "oil-painting": 1.05,
      "watercolor": 0.95,
      "sketch": 0.9,
      "default": 1.0
    }
  },
  
  // HD優化配置保持不變
  HD_OPTIMIZATION: {
    enabled: true,
    QUALITY_MODES: {
      economy: { name: "經濟模式", description: "快速出圖,適合測試", min_resolution: 1024, max_resolution: 2048, steps_multiplier: 0.85, guidance_multiplier: 0.9, hd_level: "basic" },
      standard: { name: "標準模式", description: "平衡質量與速度", min_resolution: 1280, max_resolution: 2048, steps_multiplier: 1.0, guidance_multiplier: 1.0, hd_level: "enhanced" },
      ultra: { name: "超高清模式", description: "極致質量,耗時較長", min_resolution: 1536, max_resolution: 4096, steps_multiplier: 1.35, guidance_multiplier: 1.15, hd_level: "maximum", force_upscale: true },
      ultra_4k: { name: "4K超高清", description: "Nano Banana Pro 專屬", min_resolution: 2048, max_resolution: 4096, steps_multiplier: 1.5, guidance_multiplier: 1.2, hd_level: "ultra_4k", force_upscale: true, exclusive_models: ["nanobanana-pro"] }
    },
    HD_PROMPTS: {
      basic: "high quality, detailed, sharp",
      enhanced: "high quality, extremely detailed, sharp focus, crisp, clear, professional, 8k uhd, masterpiece, fine details",
      maximum: "ultra high quality, extremely detailed, razor sharp focus, crystal clear, professional grade, 8k uhd resolution, masterpiece quality, fine details, intricate details, perfect clarity",
      ultra_4k: "ultra high definition 4K quality, extreme detail precision, professional grade, pixel-perfect clarity, masterpiece quality, intricate fine details"
    },
    HD_NEGATIVE: "low quality, blurry, pixelated, low resolution, jpeg artifacts, compression artifacts, bad quality, distorted, noisy, grainy, poor details, soft focus, out of focus",
    MODEL_QUALITY_PROFILES: {
      "flux-realism": { priority: "ultra_detail", min_resolution: 1536, max_resolution: 2048, optimal_steps_boost: 1.25, guidance_boost: 1.15, recommended_quality: "ultra" },
      "flux-pro": { priority: "maximum_quality", min_resolution: 1536, max_resolution: 2048, optimal_steps_boost: 1.3, guidance_boost: 1.2, recommended_quality: "ultra" },
      "flux-1.1-pro": { priority: "maximum_quality", min_resolution: 1536, max_resolution: 2048, optimal_steps_boost: 1.25, guidance_boost: 1.15, recommended_quality: "ultra" },
      "sd3.5-large": { priority: "high_detail", min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.2, guidance_boost: 1.1, recommended_quality: "standard" },
      "flux-anime": { priority: "clarity", min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.15, guidance_boost: 1.1, recommended_quality: "standard" },
      "flux-3d": { priority: "detail", min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.2, guidance_boost: 1.1, recommended_quality: "standard" },
      "flux-kontext": { priority: "image_edit", min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.2, guidance_boost: 1.1, recommended_quality: "standard" },
      "flux-kontext-pro": { priority: "image_edit_pro", min_resolution: 1536, max_resolution: 2048, optimal_steps_boost: 1.3, guidance_boost: 1.15, recommended_quality: "ultra" },
      "nanobanana": { priority: "multi_image", min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.15, guidance_boost: 1.1, recommended_quality: "standard" },
      "nanobanana-pro": { priority: "ultra_4k_multi", min_resolution: 2048, max_resolution: 4096, optimal_steps_boost: 1.5, guidance_boost: 1.25, recommended_quality: "ultra_4k" },
      "turbo": { priority: "speed", min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 0.7, guidance_boost: 0.85, recommended_quality: "economy" },
      "sdxl-lightning": { priority: "speed", min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 0.6, guidance_boost: 0.8, recommended_quality: "economy" },
      "sd3.5-turbo": { priority: "balanced_speed", min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 0.8, guidance_boost: 0.9, recommended_quality: "economy" }
    }
  },
  
  FETCH_TIMEOUT: 90000,
  MAX_RETRIES: 3,
  
  // 尺寸預設保持不變 (33種)
  PRESET_SIZES: {
    "square-512": { width: 512, height: 512, name: "方形 512px (快速測試)" },
    "square-1k": { width: 1024, height: 1024, name: "方形 1K (標準)" },
    "square-1.5k": { width: 1536, height: 1536, name: "方形 1.5K (高清)" },
    "square-2k": { width: 2048, height: 2048, name: "方形 2K (超清)" },
    "square-4k": { width: 4096, height: 4096, name: "方形 4K 🍌", exclusive: ["nanobanana-pro"] },
    "portrait-9-16": { width: 768, height: 1344, name: "豎屏 9:16 (TikTok/Story)" },
    "portrait-9-16-hd": { width: 1080, height: 1920, name: "豎屏 9:16 HD (1080p)" },
    "portrait-9-16-2k": { width: 1536, height: 2688, name: "豎屏 9:16 2K" },
    "portrait-3-4": { width: 768, height: 1024, name: "豎屏 3:4 (Instagram)" },
    "portrait-3-4-hd": { width: 1152, height: 1536, name: "豎屏 3:4 HD" },
    "portrait-2-3": { width: 1024, height: 1536, name: "豎屏 2:3 (Pinterest)" },
    "landscape-16-9": { width: 1344, height: 768, name: "橫屏 16:9 (YouTube)" },
    "landscape-16-9-hd": { width: 1920, height: 1080, name: "橫屏 16:9 HD (1080p)" },
    "landscape-16-9-2k": { width: 2560, height: 1440, name: "橫屏 16:9 2K (1440p)" },
    "landscape-16-9-4k": { width: 3840, height: 2160, name: "橫屏 16:9 4K 🍌", exclusive: ["nanobanana-pro"] },
    "landscape-4-3": { width: 1024, height: 768, name: "橫屏 4:3 (傳統)" },
    "landscape-21-9": { width: 2560, height: 1080, name: "橫屏 21:9 (超寬螢幕)" },
    "instagram-square": { width: 1080, height: 1080, name: "Instagram 方形貼文" },
    "instagram-portrait": { width: 1080, height: 1350, name: "Instagram 豎屏貼文 (4:5)" },
    "instagram-story": { width: 1080, height: 1920, name: "Instagram Story/Reels" },
    "facebook-cover": { width: 2048, height: 1152, name: "Facebook 封面 (16:9)" },
    "twitter-header": { width: 1500, height: 500, name: "Twitter/X 橫幅 (3:1)" },
    "youtube-thumbnail": { width: 1280, height: 720, name: "YouTube 縮圖" },
    "linkedin-banner": { width: 1584, height: 396, name: "LinkedIn 橫幅" },
    "a4-portrait": { width: 2480, height: 3508, name: "A4 豎屏 (300 DPI)" },
    "a4-landscape": { width: 3508, height: 2480, name: "A4 橫屏 (300 DPI)" },
    "poster-24-36": { width: 2400, height: 3600, name: "海報 24x36 英吋" },
    "wallpaper-fhd": { width: 1920, height: 1080, name: "桌布 Full HD (1080p)" },
    "wallpaper-2k": { width: 2560, height: 1440, name: "桌布 2K (1440p)" },
    "wallpaper-4k": { width: 3840, height: 2160, name: "桌布 4K 🍌", exclusive: ["nanobanana-pro"] },
    "wallpaper-ultrawide": { width: 3440, height: 1440, name: "桌布 Ultra-Wide (21:9)" },
    "mobile-wallpaper": { width: 1242, height: 2688, name: "手機桌布 (iPhone)" },
    "custom": { width: 1024, height: 1024, name: "自定義尺寸" }
  },
  
  HISTORY: {
    MAX_ITEMS: 100,
    STORAGE_KEY: "flux_ai_history"
  }
};

// API 優化配置
const API_OPTIMIZATION = {
  RATE_LIMIT: {
    enabled: true,
    max_requests_per_minute: 10,
    max_requests_per_hour: 100,
    blacklist_duration: 3600000,
    whitelist_ips: []
  },
  CACHE: {
    enabled: true,
    ttl: 3600,
    max_size: 100,
    strategy: 'lru'
  },
  COMPRESSION: {
    enabled: true,
    threshold: 1024,
    quality: 0.85
  },
  CONCURRENCY: {
    max_parallel: 3,
    queue_limit: 10,
    timeout: 120000
  },
  MONITORING: {
    enabled: true,
    log_requests: true,
    track_errors: true,
    performance_metrics: true
  }
};

// 工具類
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.blacklist = new Map();
  }
  async check(ip) {
    if (this.blacklist.has(ip)) {
      const blockedUntil = this.blacklist.get(ip);
      if (Date.now() < blockedUntil) {
        return { allowed: false, reason: 'IP blocked', retryAfter: Math.ceil((blockedUntil - Date.now()) / 1000) };
      } else {
        this.blacklist.delete(ip);
      }
    }
    if (API_OPTIMIZATION.RATE_LIMIT.whitelist_ips.includes(ip)) return { allowed: true };
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    if (!this.requests.has(ip)) this.requests.set(ip, []);
    const userRequests = this.requests.get(ip);
    const validRequests = userRequests.filter(time => now - time < oneHour);
    this.requests.set(ip, validRequests);
    const recentRequests = validRequests.filter(time => now - time < oneMinute);
    if (recentRequests.length >= API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute) {
      return { allowed: false, reason: 'Too many requests per minute', limit: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute, current: recentRequests.length };
    }
    if (validRequests.length >= API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour) {
      this.blacklist.set(ip, now + API_OPTIMIZATION.RATE_LIMIT.blacklist_duration);
      return { allowed: false, reason: 'Hourly limit exceeded', limit: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour, blockedUntil: new Date(now + API_OPTIMIZATION.RATE_LIMIT.blacklist_duration).toISOString() };
    }
    validRequests.push(now);
    this.requests.set(ip, validRequests);
    return { allowed: true, remaining: { perMinute: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute - recentRequests.length - 1, perHour: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour - validRequests.length } };
  }
  reset(ip) {
    this.requests.delete(ip);
    this.blacklist.delete(ip);
  }
}

class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.accessTime = new Map();
  }
  get(key) {
    if (!API_OPTIMIZATION.CACHE.enabled) return null;
    const cached = this.cache.get(key);
    if (!cached) return null;
    const { value, expires } = cached;
    if (Date.now() > expires) {
      this.cache.delete(key);
      this.accessTime.delete(key);
      return null;
    }
    this.accessTime.set(key, Date.now());
    return value;
  }
  set(key, value, ttl = API_OPTIMIZATION.CACHE.ttl) {
    if (!API_OPTIMIZATION.CACHE.enabled) return;
    if (this.cache.size >= API_OPTIMIZATION.CACHE.max_size) {
      let oldestKey = null;
      let oldestTime = Date.now();
      for (const [k, time] of this.accessTime.entries()) {
        if (time < oldestTime) {
          oldestTime = time;
          oldestKey = k;
        }
      }
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.accessTime.delete(oldestKey);
      }
    }
    this.cache.set(key, { value: value, expires: Date.now() + (ttl * 1000) });
    this.accessTime.set(key, Date.now());
  }
  clear() {
    this.cache.clear();
    this.accessTime.clear();
  }
}

class PerformanceMonitor {
  constructor() {
    this.metrics = { total_requests: 0, successful_requests: 0, failed_requests: 0, total_duration: 0, avg_duration: 0, errors: [] };
  }
  recordRequest(success, duration, error = null) {
    this.metrics.total_requests++;
    this.metrics.total_duration += duration;
    this.metrics.avg_duration = this.metrics.total_duration / this.metrics.total_requests;
    if (success) {
      this.metrics.successful_requests++;
    } else {
      this.metrics.failed_requests++;
      if (error && this.metrics.errors.length < 100) {
        this.metrics.errors.push({ message: error, timestamp: new Date().toISOString() });
      }
    }
  }
  getStats() {
    return { ...this.metrics, success_rate: ((this.metrics.successful_requests / this.metrics.total_requests) * 100).toFixed(2) + '%', avg_duration_ms: this.metrics.avg_duration.toFixed(2) };
  }
  reset() {
    this.metrics = { total_requests: 0, successful_requests: 0, failed_requests: 0, total_duration: 0, avg_duration: 0, errors: [] };
  }
}

const rateLimiter = new RateLimiter();
const apiCache = new SimpleCache();
const perfMonitor = new PerformanceMonitor();

function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || (request.headers.get('X-Forwarded-For') ? request.headers.get('X-Forwarded-For').split(',')[0].trim() : null) || request.headers.get('X-Real-IP') || 'unknown';
}

function generateCacheKey(prompt, options) {
  const keyData = { prompt, model: options.model, width: options.width, height: options.height, style: options.style, quality_mode: options.qualityMode, seed: options.seed === -1 ? 'random' : options.seed };
  const str = JSON.stringify(keyData);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'cache_' + Math.abs(hash).toString(36);
}

class Logger {
    constructor() { this.logs = []; }
    add(step, data) {
        const time = new Date().toISOString().split('T')[1].slice(0, -1);
        this.logs.push({ time, step, data });
        console.log(`[${step}]`, data);
    }
    get() { return this.logs; }
}
// 翻譯功能
async function translateToEnglish(text, env) {
    try {
        const hasChinese = /[\u4e00-\u9fa5]/.test(text);
        if (!hasChinese) return { text: text, translated: false, reason: "No Chinese detected" };
        if (!env || !env.AI) {
            console.warn("⚠️ Workers AI not configured");
            return { text: text, translated: false, reason: "AI not configured" };
        }
        try {
            const response = await env.AI.run("@cf/meta/m2m100", { text: text, source_lang: "chinese", target_lang: "english" });
            if (response && response.translated_text) {
                console.log("✅ Translation:", text, "→", response.translated_text);
                return { text: response.translated_text, translated: true, original: text, model: "m2m100" };
            }
        } catch (primaryError) {
            console.warn("⚠️ m2m100 failed:", primaryError.message);
            try {
                const response = await env.AI.run("@cf/meta/m2m100-1.2b", { text: text, source_lang: "chinese", target_lang: "english" });
                if (response && response.translated_text) {
                    return { text: response.translated_text, translated: true, original: text, model: "m2m100-1.2b" };
                }
            } catch (fallbackError) {
                console.error("❌ All translation failed");
            }
        }
        return { text: text, translated: false };
    } catch (error) {
        console.error("❌ translateToEnglish error:", error);
        return { text: text, translated: false, error: error.message };
    }
}

class PromptAnalyzer {
    static analyzeComplexity(prompt) {
        const complexKeywords = ['detailed', 'intricate', 'complex', 'elaborate', 'realistic', 'photorealistic', 'hyperrealistic', 'architecture', 'cityscape', 'landscape', 'portrait', 'face', 'eyes', 'hair', 'texture', 'material', 'fabric', 'skin', 'lighting', 'shadows', 'reflections', 'fine details', 'high detail', 'ultra detailed', '4k', '8k', 'uhd'];
        let score = 0;
        const lowerPrompt = prompt.toLowerCase();
        complexKeywords.forEach(keyword => { if (lowerPrompt.includes(keyword)) score += 0.1; });
        if (prompt.length > 100) score += 0.2;
        if (prompt.length > 200) score += 0.3;
        if (prompt.split(',').length > 5) score += 0.15;
        return Math.min(score, 1.0);
    }
    static recommendQualityMode(prompt, model) {
        const complexity = this.analyzeComplexity(prompt);
        const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
        if (model === 'nanobanana-pro') return 'ultra_4k';
        if (profile?.recommended_quality) return profile.recommended_quality;
        if (complexity > 0.7) return 'ultra';
        if (complexity > 0.4) return 'standard';
        return 'economy';
    }
}

class HDOptimizer {
    static optimize(prompt, negativePrompt, model, width, height, qualityMode = 'standard', autoHD = true) {
        if (!autoHD || !CONFIG.HD_OPTIMIZATION.enabled) {
            return { prompt: prompt, negativePrompt: negativePrompt, width: width, height: height, optimized: false };
        }
        const hdConfig = CONFIG.HD_OPTIMIZATION;
        const modeConfig = hdConfig.QUALITY_MODES[qualityMode] || hdConfig.QUALITY_MODES.standard;
        const profile = hdConfig.MODEL_QUALITY_PROFILES[model];
        const optimizations = [];
        
        const hdLevel = modeConfig.hd_level;
        let enhancedPrompt = prompt;
        
        if (hdConfig.HD_PROMPTS[hdLevel]) {
            const hdBoost = hdConfig.HD_PROMPTS[hdLevel];
            enhancedPrompt = prompt + ", " + hdBoost;
            optimizations.push("HD增強: " + hdLevel);
        }
        
        let enhancedNegative = negativePrompt || "";
        if (qualityMode !== 'economy') {
            enhancedNegative = enhancedNegative ? enhancedNegative + ", " + hdConfig.HD_NEGATIVE : hdConfig.HD_NEGATIVE;
            optimizations.push("負面提示詞: 高清過濾");
        }
        
        let finalWidth = width;
        let finalHeight = height;
        let sizeUpscaled = false;
        
        const maxModelRes = profile?.max_resolution || 2048;
        const minRes = Math.max(modeConfig.min_resolution, profile?.min_resolution || 1024);
        const currentRes = Math.min(width, height);
        
        if (currentRes < minRes || modeConfig.force_upscale) {
            const scale = minRes / currentRes;
            finalWidth = Math.min(Math.round(width * scale / 64) * 64, maxModelRes);
            finalHeight = Math.min(Math.round(height * scale / 64) * 64, maxModelRes);
            sizeUpscaled = true;
            optimizations.push("尺寸優化: " + width + "x" + height + " → " + finalWidth + "x" + finalHeight);
        }
        
        if (finalWidth > maxModelRes || finalHeight > maxModelRes) {
            const scale = maxModelRes / Math.max(finalWidth, finalHeight);
            finalWidth = Math.round(finalWidth * scale / 64) * 64;
            finalHeight = Math.round(finalHeight * scale / 64) * 64;
            optimizations.push("模型限制: 調整至 " + finalWidth + "x" + finalHeight);
        }
        
        return { prompt: enhancedPrompt, negativePrompt: enhancedNegative, width: finalWidth, height: finalHeight, optimized: true, quality_mode: qualityMode, hd_level: hdLevel, optimizations: optimizations, size_upscaled: sizeUpscaled };
    }
}

class ParameterOptimizer {
    static optimizeSteps(model, width, height, style = 'none', qualityMode = 'standard', userSteps = null) {
        if (userSteps !== null && userSteps !== -1) {
            const suggestion = this.calculateOptimalSteps(model, width, height, style, qualityMode);
            return { steps: userSteps, optimized: false, suggested: suggestion.steps, reasoning: suggestion.reasoning, user_override: true };
        }
        return this.calculateOptimalSteps(model, width, height, style, qualityMode);
    }
    
    static calculateOptimalSteps(model, width, height, style, qualityMode = 'standard') {
        const rules = CONFIG.OPTIMIZATION_RULES;
        const modelRule = rules.MODEL_STEPS[model] || rules.MODEL_STEPS["flux"];
        const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
        const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
        let baseSteps = modelRule.optimal;
        const reasoning = [];
        reasoning.push(model + ": " + baseSteps + "步");
        
        const totalPixels = width * height;
        let sizeMultiplier = 1.0;
        
        if (totalPixels >= rules.SIZE_MULTIPLIER.ultra_4k.threshold) {
            sizeMultiplier = rules.SIZE_MULTIPLIER.ultra_4k.multiplier;
            reasoning.push("4K超大 x" + sizeMultiplier);
        } else if (totalPixels >= rules.SIZE_MULTIPLIER.xlarge.threshold) {
            sizeMultiplier = rules.SIZE_MULTIPLIER.xlarge.multiplier;
            reasoning.push("超大 x" + sizeMultiplier);
        } else if (totalPixels >= rules.SIZE_MULTIPLIER.large.threshold) {
            sizeMultiplier = rules.SIZE_MULTIPLIER.large.multiplier;
            reasoning.push("大尺寸 x" + sizeMultiplier);
        } else if (totalPixels <= rules.SIZE_MULTIPLIER.small.threshold) {
            sizeMultiplier = rules.SIZE_MULTIPLIER.small.multiplier;
        } else {
            sizeMultiplier = rules.SIZE_MULTIPLIER.medium.multiplier;
        }
        
        let styleMultiplier = rules.STYLE_ADJUSTMENT[style] || rules.STYLE_ADJUSTMENT.default;
        let qualityMultiplier = modeConfig?.steps_multiplier || 1.0;
        if (qualityMultiplier !== 1.0) reasoning.push(modeConfig.name + " x" + qualityMultiplier);
        
        let profileBoost = profile?.optimal_steps_boost || 1.0;
        if (profileBoost !== 1.0) reasoning.push("模型配置 x" + profileBoost);
        
        let optimizedSteps = Math.round(baseSteps * sizeMultiplier * styleMultiplier * qualityMultiplier * profileBoost);
        optimizedSteps = Math.max(modelRule.min, Math.min(optimizedSteps, modelRule.max));
        
        reasoning.push("→ " + optimizedSteps + "步");
        return { steps: optimizedSteps, optimized: true, base_steps: baseSteps, size_multiplier: sizeMultiplier, style_multiplier: styleMultiplier, quality_multiplier: qualityMultiplier, profile_boost: profileBoost, min_steps: modelRule.min, max_steps: modelRule.max, reasoning: reasoning.join(' ') };
    }
    
    static optimizeGuidance(model, style, qualityMode = 'standard') {
        const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
        const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
        let baseGuidance = 7.5;
        
        if (model.includes('turbo') || model.includes('lightning')) {
            baseGuidance = style === 'photorealistic' ? 3.0 : 2.5;
        } else if (style === 'photorealistic') {
            baseGuidance = 8.5;
        } else if (['oil-painting', 'watercolor', 'sketch'].includes(style)) {
            baseGuidance = 6.5;
        }
        
        let qualityBoost = modeConfig?.guidance_multiplier || 1.0;
        let profileBoost = profile?.guidance_boost || 1.0;
        return Math.round(baseGuidance * qualityBoost * profileBoost * 10) / 10;
    }
}

class StyleProcessor {
    static applyStyle(prompt, style, negativePrompt) {
        try {
            if (!style || style === 'none' || style === '') {
                return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
            }
            if (!CONFIG.STYLE_PRESETS || typeof CONFIG.STYLE_PRESETS !== 'object') {
                console.warn("⚠️ STYLE_PRESETS not found");
                return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
            }
            const styleConfig = CONFIG.STYLE_PRESETS[style];
            if (!styleConfig) {
                console.warn("⚠️ Style '" + style + "' not found");
                return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
            }
            let enhancedPrompt = prompt;
            if (styleConfig.prompt && styleConfig.prompt.trim()) {
                enhancedPrompt = prompt + ", " + styleConfig.prompt;
            }
            let enhancedNegative = negativePrompt || "";
            if (styleConfig.negative && styleConfig.negative.trim()) {
                if (enhancedNegative && enhancedNegative.trim()) {
                    enhancedNegative = enhancedNegative + ", " + styleConfig.negative;
                } else {
                    enhancedNegative = styleConfig.negative;
                }
            }
            console.log("✅ Style applied:", style);
            return { enhancedPrompt: enhancedPrompt, enhancedNegative: enhancedNegative };
        } catch (error) {
            console.error("❌ StyleProcessor error:", error.message);
            return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
        }
    }
}

async function fetchWithTimeout(url, options = {}, timeout = CONFIG.FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') throw new Error("Request timeout after " + timeout + "ms");
        throw error;
    }
}
// ✅ 核心提供商類 - 使用官方 gen.pollinations.ai API
class PollinationsProvider {
    constructor(config, env) {
        this.config = config;
        this.name = config.name;
        this.env = env;
    }
    
    async generate(prompt, options, logger) {
        const { 
            model = "flux", 
            width = 1024, 
            height = 1024, 
            seed = -1, 
            negativePrompt = "", 
            guidance = null, 
            steps = null, 
            enhance = false, 
            nologo = true, 
            privateMode = true, 
            style = "none", 
            autoOptimize = true, 
            autoHD = true, 
            qualityMode = 'standard',
            referenceImages = []
        } = options;
        
        const modelConfig = this.config.models.find(m => m.id === model);
        const supportsRefImages = modelConfig?.supports_reference_images || false;
        const maxRefImages = modelConfig?.max_reference_images || 0;
        const is4KModel = modelConfig?.max_size === 4096;
        
        let validReferenceImages = [];
        if (referenceImages && referenceImages.length > 0) {
            if (!supportsRefImages) {
                logger.add("⚠️ Reference Images", { 
                    warning: model + " 不支持參考圖,已忽略", 
                    supported_models: ["kontext", "kontext-pro", "nanobanana", "nanobanana-pro"] 
                });
            } else if (referenceImages.length > maxRefImages) {
                logger.add("⚠️ Reference Images", { 
                    warning: model + " 最多支持 " + maxRefImages + " 張參考圖", 
                    provided: referenceImages.length, 
                    using: maxRefImages 
                });
                validReferenceImages = referenceImages.slice(0, maxRefImages);
            } else {
                validReferenceImages = referenceImages;
                logger.add("🖼️ Reference Images", { 
                    model: model, 
                    count: validReferenceImages.length, 
                    max_allowed: maxRefImages,
                    mode: validReferenceImages.length === 1 ? "圖生圖" : "多圖融合"
                });
            }
        }
        
        let hdOptimization = null;
        let finalPrompt = prompt;
        let finalNegativePrompt = negativePrompt;
        let finalWidth = width;
        let finalHeight = height;
        
        const promptComplexity = PromptAnalyzer.analyzeComplexity(prompt);
        const recommendedQuality = PromptAnalyzer.recommendQualityMode(prompt, model);
        logger.add("🧠 Prompt Analysis", { 
            complexity: (promptComplexity * 100).toFixed(1) + '%', 
            recommended_quality: recommendedQuality, 
            selected_quality: qualityMode,
            is_4k_model: is4KModel,
            has_reference_images: validReferenceImages.length > 0
        });
        
        if (autoHD) {
            hdOptimization = HDOptimizer.optimize(
                prompt, 
                negativePrompt, 
                model, 
                width, 
                height, 
                qualityMode, 
                autoHD
            );
            finalPrompt = hdOptimization.prompt;
            finalNegativePrompt = hdOptimization.negativePrompt;
            finalWidth = hdOptimization.width;
            finalHeight = hdOptimization.height;
            
            if (hdOptimization.optimized) {
                logger.add("🎨 HD Optimization", { 
                    mode: qualityMode, 
                    hd_level: hdOptimization.hd_level, 
                    original: width + "x" + height, 
                    optimized: finalWidth + "x" + finalHeight, 
                    upscaled: hdOptimization.size_upscaled, 
                    details: hdOptimization.optimizations 
                });
            }
        }
        
        let finalSteps = steps;
        let finalGuidance = guidance;
        
        if (autoOptimize) {
            const stepsOptimization = ParameterOptimizer.optimizeSteps(model, finalWidth, finalHeight, style, qualityMode, steps);
            finalSteps = stepsOptimization.steps;
            logger.add("🎯 Steps Optimization", { steps: stepsOptimization.steps, reasoning: stepsOptimization.reasoning });
            
            if (guidance === null) {
                finalGuidance = ParameterOptimizer.optimizeGuidance(model, style, qualityMode);
            } else {
                finalGuidance = guidance;
            }
        } else {
            finalSteps = steps || 20;
            finalGuidance = guidance || 7.5;
        }
        
        const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(finalPrompt, style, finalNegativePrompt);
        
        logger.add("🎨 Style Processing", { 
            selected_style: style,
            style_applied: style !== 'none',
            original_prompt_length: finalPrompt.length,
            enhanced_prompt_length: enhancedPrompt.length,
            prompt_added: enhancedPrompt.length - finalPrompt.length
        });
        
        const translation = await translateToEnglish(enhancedPrompt, this.env);
        const finalPromptForAPI = translation.text;
        
        if (translation.translated) {
            logger.add("🌐 Auto Translation", { 
                original_zh: translation.original,
                translated_en: finalPromptForAPI.substring(0, 100) + (finalPromptForAPI.length > 100 ? '...' : ''),
                success: true,
                model: translation.model || "unknown"
            });
        } else {
            logger.add("⚠️ Translation", { 
                status: "skipped",
                reason: translation.reason || "Unknown",
                using_original: true
            });
        }
        
        const modelsToTry = [model];
        if (modelConfig?.experimental && modelConfig?.fallback) {
            modelsToTry.push(...modelConfig.fallback);
        }
        
        logger.add("🎨 Generation Config", { 
            provider: this.name, 
            model: model, 
            dimensions: finalWidth + "x" + finalHeight,
            is_4k: finalWidth >= 4096 || finalHeight >= 4096,
            quality_mode: qualityMode, 
            hd_optimized: autoHD && hdOptimization?.optimized, 
            auto_translated: translation.translated,
            style_applied: style !== 'none',
            reference_images: validReferenceImages.length,
            generation_mode: validReferenceImages.length > 0 ? (validReferenceImages.length === 1 ? "圖生圖" : "多圖融合") : "文生圖",
            steps: finalSteps, 
            guidance: finalGuidance,
            seed: seed
        });
        
        const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
        let fullPrompt = finalPromptForAPI;
        if (enhancedNegative && enhancedNegative.trim()) {
            fullPrompt = finalPromptForAPI + " [negative: " + enhancedNegative + "]";
        }
        
        const encodedPrompt = encodeURIComponent(fullPrompt);
        
        // ✅ 官方新格式: https://gen.pollinations.ai/image/{prompt}
        const pathPrefix = this.config.pathPrefix || "/image";
        let baseUrl = this.config.endpoint + pathPrefix + "/" + encodedPrompt;
        
        const params = new URLSearchParams();
        params.append('model', model);
        params.append('width', finalWidth.toString());
        params.append('height', finalHeight.toString());
        params.append('seed', currentSeed.toString());
        params.append('nologo', nologo.toString());
        params.append('enhance', enhance.toString());
        params.append('private', privateMode.toString());
        
        if (validReferenceImages && validReferenceImages.length > 0) {
            params.append('image', validReferenceImages.join(','));
            logger.add("🖼️ Reference Images Added", { 
                count: validReferenceImages.length,
                urls: validReferenceImages 
            });
        }
        
        if (finalGuidance !== 7.5) params.append('guidance', finalGuidance.toString());
        if (finalSteps !== 20) params.append('steps', finalSteps.toString());
        
        // ✅ 構建請求頭 (含官方認證)
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/*',
            'Referer': 'https://pollinations.ai/'
        };
        
        // ✅ 官方認證: Authorization: Bearer YOUR_API_KEY
        const authConfig = CONFIG.POLLINATIONS_AUTH;
        if (authConfig.enabled && authConfig.token) {
            headers['Authorization'] = `Bearer ${authConfig.token}`;
            logger.add("🔐 API Authentication", { 
                method: "Bearer Token",
                token_prefix: authConfig.token.substring(0, 8) + "...",
                enabled: true
            });
        } else {
            logger.add("🔓 Anonymous Mode", { 
                authenticated: false,
                note: "未配置 API Key,使用匿名模式"
            });
        }
        
        for (const tryModel of modelsToTry) {
            params.set('model', tryModel);
            const url = baseUrl + '?' + params.toString();
            
            logger.add("📡 API Request", { 
                endpoint: this.config.endpoint,
                path: pathPrefix + "/" + encodedPrompt.substring(0, 50) + "...",
                model: tryModel,
                authenticated: authConfig.enabled
            });
            
            for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
                try {
                    const response = await fetchWithTimeout(url, { 
                        method: 'GET', 
                        headers: headers
                    }, 90000);
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.startsWith('image/')) {
                            logger.add("✅ Success", { 
                                url: response.url, 
                                used_model: tryModel, 
                                final_size: finalWidth + "x" + finalHeight,
                                is_4k: finalWidth >= 4096 || finalHeight >= 4096,
                                quality_mode: qualityMode, 
                                style_used: style,
                                hd_optimized: autoHD && hdOptimization?.optimized, 
                                auto_translated: translation.translated,
                                reference_images_used: validReferenceImages.length,
                                generation_mode: validReferenceImages.length > 0 ? (validReferenceImages.length === 1 ? "圖生圖" : "多圖融合") : "文生圖",
                                authenticated: authConfig.enabled,
                                seed: currentSeed 
                            });
                            
                            return { 
                                url: response.url, 
                                provider: this.name, 
                                model: tryModel, 
                                requested_model: model, 
                                seed: currentSeed, 
                                style: style, 
                                steps: finalSteps, 
                                guidance: finalGuidance, 
                                width: finalWidth, 
                                height: finalHeight,
                                is_4k: finalWidth >= 4096 || finalHeight >= 4096,
                                quality_mode: qualityMode, 
                                prompt_complexity: promptComplexity, 
                                hd_optimized: autoHD && hdOptimization?.optimized, 
                                hd_details: hdOptimization, 
                                auto_translated: translation.translated,
                                reference_images: validReferenceImages,
                                reference_images_count: validReferenceImages.length,
                                generation_mode: validReferenceImages.length > 0 ? (validReferenceImages.length === 1 ? "圖生圖" : "多圖融合") : "文生圖",
                                authenticated: authConfig.enabled,
                                cost: "FREE", 
                                fallback_used: tryModel !== model, 
                                auto_optimized: autoOptimize 
                            };
                        } else {
                            throw new Error("Invalid content type: " + contentType);
                        }
                    } else {
                        throw new Error("HTTP " + response.status);
                    }
                } catch (e) {
                    logger.add("❌ Request Failed", { 
                        error: e.message, 
                        model: tryModel, 
                        retry: retry + 1,
                        max_retries: CONFIG.MAX_RETRIES
                    });
                    
                    if (retry < CONFIG.MAX_RETRIES - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
                    }
                }
            }
        }
        throw new Error("All models failed after " + CONFIG.MAX_RETRIES + " retries");
    }
}

class MultiProviderRouter {
    constructor(apiKeys = {}, env = null) {
        this.providers = {};
        this.apiKeys = apiKeys;
        this.env = env;
        
        for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
            if (config.enabled) {
                if (key === 'pollinations') {
                    this.providers[key] = new PollinationsProvider(config, env);
                }
            }
        }
    }
    
    getProvider(providerName = null) {
        if (providerName && this.providers[providerName]) {
            return { name: providerName, instance: this.providers[providerName] };
        }
        const defaultName = CONFIG.DEFAULT_PROVIDER;
        if (this.providers[defaultName]) {
            return { name: defaultName, instance: this.providers[defaultName] };
        }
        const firstProvider = Object.keys(this.providers)[0];
        if (firstProvider) {
            return { name: firstProvider, instance: this.providers[firstProvider] };
        }
        throw new Error('No available provider');
    }
    
    async generate(prompt, options, logger) {
        const { provider: requestedProvider = null, numOutputs = 1 } = options;
        const { name: providerName, instance: provider } = this.getProvider(requestedProvider);
        const results = [];
        for (let i = 0; i < numOutputs; i++) {
            const currentOptions = { ...options, seed: options.seed === -1 ? -1 : options.seed + i };
            const result = await provider.generate(prompt, currentOptions, logger);
            results.push(result);
        }
        return results;
    }
}

function corsHeaders(additionalHeaders = {}) {
    return { 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With', 
        'Access-Control-Max-Age': '86400', 
        ...additionalHeaders 
    };
}
// API 端點處理函數
async function handleImageGenerations(request, env, ctx) {
    const logger = new Logger();
    const startTime = Date.now();
    
    try {
        const body = await request.json();
        const prompt = body.prompt;
        if (!prompt || !prompt.trim()) throw new Error("Prompt is required");
        
        let width = 1024, height = 1024;
        if (body.size) {
            const [w, h] = body.size.split('x').map(Number);
            if (w && h) { width = w; height = h; }
        }
        if (body.width) width = body.width;
        if (body.height) height = body.height;
        
        let referenceImages = [];
        if (body.reference_images && Array.isArray(body.reference_images)) {
            referenceImages = body.reference_images.filter(url => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            });
        }
        
        const seedInput = body.seed !== undefined ? body.seed : -1;
        let seedValue = -1;
        if (seedInput !== -1) {
            const parsedSeed = parseInt(seedInput);
            if (!isNaN(parsedSeed) && parsedSeed >= 0 && parsedSeed <= 999999) {
                seedValue = parsedSeed;
            }
        }
        
        const options = { 
            provider: body.provider || null, 
            model: body.model || "flux", 
            width: Math.min(Math.max(width, 256), 4096), 
            height: Math.min(Math.max(height, 256), 4096), 
            numOutputs: Math.min(Math.max(body.n || 1, 1), 4), 
            seed: seedValue,
            negativePrompt: body.negative_prompt || "", 
            guidance: body.guidance_scale || null, 
            steps: body.steps || null, 
            enhance: body.enhance === true, 
            nologo: body.nologo !== false, 
            privateMode: body.private !== false, 
            style: body.style || "none", 
            autoOptimize: body.auto_optimize !== false, 
            autoHD: body.auto_hd !== false, 
            qualityMode: body.quality_mode || 'standard',
            referenceImages: referenceImages
        };
        
        let cacheKey = null;
        let cachedResult = null;
        
        if (options.seed !== -1 && referenceImages.length === 0 && options.numOutputs === 1) {
            cacheKey = generateCacheKey(prompt, options);
            cachedResult = apiCache.get(cacheKey);
            
            if (cachedResult) {
                logger.add("💾 Cache Hit", { key: cacheKey });
                return new Response(JSON.stringify({
                    created: Math.floor(Date.now() / 1000),
                    data: cachedResult,
                    cached: true,
                    cache_key: cacheKey
                }), { 
                    headers: corsHeaders({ 
                        'Content-Type': 'application/json',
                        'X-Cache': 'HIT',
                        'X-Cache-Key': cacheKey
                    }) 
                });
            }
        }
        
        const router = new MultiProviderRouter({}, env);
        const results = await router.generate(prompt, options, logger);
        
        if (cacheKey && options.seed !== -1 && options.numOutputs === 1) {
            const cacheData = results.map(r => ({
                url: r.url,
                provider: r.provider,
                model: r.model,
                seed: r.seed,
                width: r.width,
                height: r.height,
                is_4k: r.is_4k,
                style: r.style,
                quality_mode: r.quality_mode,
                reference_images: r.reference_images || [],
                reference_images_count: r.reference_images_count || 0,
                generation_mode: r.generation_mode || "文生圖",
                authenticated: r.authenticated || false,
                cost: r.cost
            }));
            apiCache.set(cacheKey, cacheData);
            logger.add("💾 Cache Saved", { key: cacheKey });
        }
        
        const duration = Date.now() - startTime;
        
        return new Response(JSON.stringify({ 
            created: Math.floor(Date.now() / 1000), 
            data: results.map(r => ({ 
                url: r.url, 
                provider: r.provider, 
                model: r.model, 
                seed: r.seed, 
                width: r.width, 
                height: r.height,
                is_4k: r.is_4k,
                reference_images: r.reference_images || [],
                reference_images_count: r.reference_images_count || 0,
                generation_mode: r.generation_mode || "文生圖",
                authenticated: r.authenticated || false,
                style: r.style, 
                quality_mode: r.quality_mode, 
                prompt_complexity: r.prompt_complexity, 
                steps: r.steps, 
                guidance: r.guidance, 
                auto_optimized: r.auto_optimized, 
                hd_optimized: r.hd_optimized, 
                auto_translated: r.auto_translated,
                cost: r.cost 
            })),
            cached: false,
            generation_time_ms: duration
        }), { 
            headers: corsHeaders({ 
                'Content-Type': 'application/json',
                'X-Cache': 'MISS',
                'X-Generation-Time': duration + 'ms'
            }) 
        });
    } catch (e) {
        logger.add("❌ Error", e.message);
        return new Response(JSON.stringify({ 
            error: { 
                message: e.message, 
                debug_logs: logger.get() 
            } 
        }), { 
            status: 500, 
            headers: corsHeaders({ 'Content-Type': 'application/json' }) 
        });
    }
}

async function handleChatCompletions(request, env, ctx) {
    const logger = new Logger();
    try {
        const body = await request.json();
        const messages = body.messages;
        if (!messages || !Array.isArray(messages)) throw new Error("messages is required");
        
        const userMessage = messages.filter(m => m.role === 'user').pop();
        if (!userMessage || !userMessage.content) throw new Error("No user message found");
        
        const prompt = userMessage.content;
        const options = { 
            model: body.model || "flux", 
            width: 1024, 
            height: 1024, 
            seed: -1, 
            style: "none", 
            autoOptimize: true, 
            autoHD: true, 
            qualityMode: 'standard' 
        };
        
        const router = new MultiProviderRouter({}, env);
        const results = await router.generate(prompt, options, logger);
        const imageUrl = results[0].url;
        
        return new Response(JSON.stringify({ 
            id: "chatcmpl-" + Date.now(), 
            object: "chat.completion", 
            created: Math.floor(Date.now() / 1000), 
            model: results[0].model, 
            choices: [{ 
                index: 0, 
                message: { 
                    role: "assistant", 
                    content: "![Generated Image](" + imageUrl + ")\n\nImage generated successfully!" 
                }, 
                finish_reason: "stop" 
            }], 
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 } 
        }), { 
            headers: corsHeaders({ 'Content-Type': 'application/json' }) 
        });
    } catch (e) {
        logger.add("❌ Error", e.message);
        return new Response(JSON.stringify({ 
            error: { 
                message: e.message, 
                debug_logs: logger.get() 
            } 
        }), { 
            status: 500, 
            headers: corsHeaders({ 'Content-Type': 'application/json' }) 
        });
    }
}

function handleModelsRequest() {
    const allModels = [];
    for (const [providerKey, providerConfig] of Object.entries(CONFIG.PROVIDERS)) {
        if (providerConfig.enabled && providerConfig.models) {
            for (const model of providerConfig.models) {
                allModels.push({ 
                    id: model.id, 
                    name: model.name, 
                    provider: providerKey, 
                    category: model.category || 'general', 
                    description: model.description || '', 
                    max_size: model.max_size || 2048, 
                    confirmed: model.confirmed !== false, 
                    experimental: model.experimental === true, 
                    fallback: model.fallback || null,
                    ultra_hd: model.ultra_hd || false,
                    supports_reference_images: model.supports_reference_images || false,
                    max_reference_images: model.max_reference_images || 0
                });
            }
        }
    }
    return new Response(JSON.stringify({ 
        object: 'list', 
        data: allModels 
    }), { 
        headers: corsHeaders({ 'Content-Type': 'application/json' }) 
    });
}

function handleProvidersRequest() {
    const providersList = [];
    for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
        if (config.enabled) {
            providersList.push({ 
                id: key, 
                name: config.name, 
                type: config.type, 
                auth_mode: config.auth_mode, 
                requires_key: config.requires_key, 
                description: config.description, 
                features: config.features, 
                model_count: config.models?.length || 0 
            });
        }
    }
    return new Response(JSON.stringify({ 
        object: 'list', 
        data: providersList 
    }), { 
        headers: corsHeaders({ 'Content-Type': 'application/json' }) 
    });
}

function handleStylesRequest() {
    const stylesList = [];
    for (const [key, styleConfig] of Object.entries(CONFIG.STYLE_PRESETS)) {
        stylesList.push({ 
            id: key, 
            name: styleConfig.name, 
            prompt_addition: styleConfig.prompt || "", 
            negative_addition: styleConfig.negative || "" 
        });
    }
    return new Response(JSON.stringify({ 
        object: 'list', 
        data: stylesList, 
        total: stylesList.length 
    }), { 
        headers: corsHeaders({ 'Content-Type': 'application/json' }) 
    });
}

// ✅ 主入口 - 支持環境變量讀取 API Key
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const startTime = Date.now();
        const clientIP = getClientIP(request);
        
        // ✅ 從環境變量讀取 API Key (優先級最高)
        if (env.POLLINATIONS_API_KEY) {
            CONFIG.POLLINATIONS_AUTH.enabled = true;
            CONFIG.POLLINATIONS_AUTH.token = env.POLLINATIONS_API_KEY;
        }
        
        console.log("=== API Request ===");
        console.log("IP:", clientIP);
        console.log("Path:", url.pathname);
        console.log("Method:", request.method);
        console.log("Workers AI:", !!env.AI);
        console.log("API Auth:", CONFIG.POLLINATIONS_AUTH.enabled ? "✅ Enabled" : "❌ Disabled");
        console.log("==================");
        
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders() });
        }
        
        if (API_OPTIMIZATION.RATE_LIMIT.enabled && url.pathname.startsWith('/v1/')) {
            const rateLimitResult = await rateLimiter.check(clientIP);
            if (!rateLimitResult.allowed) {
                perfMonitor.recordRequest(false, Date.now() - startTime, rateLimitResult.reason);
                return new Response(JSON.stringify({
                    error: {
                        message: rateLimitResult.reason,
                        code: 'RATE_LIMIT_EXCEEDED',
                        limit: rateLimitResult.limit,
                        current: rateLimitResult.current,
                        retryAfter: rateLimitResult.retryAfter,
                        blockedUntil: rateLimitResult.blockedUntil
                    }
                }), {
                    status: 429,
                    headers: corsHeaders({
                        'Content-Type': 'application/json',
                        'Retry-After': rateLimitResult.retryAfter || '60',
                        'X-RateLimit-Limit': API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute.toString(),
                        'X-RateLimit-Remaining': '0'
                    })
                });
            }
            ctx.rateLimitHeaders = {
                'X-RateLimit-Limit-Minute': API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute.toString(),
                'X-RateLimit-Limit-Hour': API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour.toString(),
                'X-RateLimit-Remaining-Minute': rateLimitResult.remaining?.perMinute.toString() || '0',
                'X-RateLimit-Remaining-Hour': rateLimitResult.remaining?.perHour.toString() || '0'
            };
        }
        
        try {
            let response;
            if (url.pathname === '/') {
                response = handleUI(request);
            } else if (url.pathname === '/v1/chat/completions') {
                response = await handleChatCompletions(request, env, ctx);
            } else if (url.pathname === '/v1/images/generations') {
                response = await handleImageGenerations(request, env, ctx);
            } else if (url.pathname === '/v1/models') {
                response = handleModelsRequest();
            } else if (url.pathname === '/v1/providers') {
                response = handleProvidersRequest();
            } else if (url.pathname === '/v1/styles') {
                response = handleStylesRequest();
            } else if (url.pathname === '/health') {
                response = new Response(JSON.stringify({
                    status: 'ok',
                    version: CONFIG.PROJECT_VERSION,
                    timestamp: new Date().toISOString(),
                    workers_ai: !!env.AI,
                    api_auth: {
                        enabled: CONFIG.POLLINATIONS_AUTH.enabled,
                        method: CONFIG.POLLINATIONS_AUTH.method,
                        has_token: !!CONFIG.POLLINATIONS_AUTH.token
                    },
                    performance: perfMonitor.getStats(),
                    cache: {
                        enabled: API_OPTIMIZATION.CACHE.enabled,
                        size: apiCache.cache.size,
                        max_size: API_OPTIMIZATION.CACHE.max_size
                    },
                    rate_limit: {
                        enabled: API_OPTIMIZATION.RATE_LIMIT.enabled,
                        active_ips: rateLimiter.requests.size,
                        blacklisted_ips: rateLimiter.blacklist.size
                    }
                }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
            } else if (url.pathname === '/stats') {
                response = new Response(JSON.stringify({
                    performance: perfMonitor.getStats(),
                    cache: {
                        size: apiCache.cache.size,
                        max_size: API_OPTIMIZATION.CACHE.max_size
                    },
                    rate_limit: {
                        active_monitoring: rateLimiter.requests.size,
                        blacklisted: rateLimiter.blacklist.size
                    }
                }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
            } else {
                response = new Response(JSON.stringify({
                    project: CONFIG.PROJECT_NAME,
                    version: CONFIG.PROJECT_VERSION,
                    api_endpoint: CONFIG.PROVIDERS.pollinations.endpoint,
                    api_authenticated: CONFIG.POLLINATIONS_AUTH.enabled,
                    optimizations: [
                        'Official API (gen.pollinations.ai) 📡',
                        'API Key Authentication 🔐',
                        'Rate Limiting 🔒',
                        'Response Caching 💾',
                        'Performance Monitoring 📊',
                        'Seed Control 🎲',
                        'Batch Generation 📦',
                        '39 Art Styles 🎨',
                        '35+ Size Presets 📐'
                    ],
                    endpoints: [
                        '/v1/images/generations',
                        '/v1/chat/completions',
                        '/v1/models',
                        '/v1/providers',
                        '/v1/styles',
                        '/health',
                        '/stats'
                    ]
                }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
            }
            
            const duration = Date.now() - startTime;
            perfMonitor.recordRequest(true, duration);
            const headers = new Headers(response.headers);
            headers.set('X-Response-Time', duration + 'ms');
            headers.set('X-Worker-Version', CONFIG.PROJECT_VERSION);
            headers.set('X-API-Endpoint', CONFIG.PROVIDERS.pollinations.endpoint);
            headers.set('X-API-Authenticated', CONFIG.POLLINATIONS_AUTH.enabled ? 'true' : 'false');
            if (ctx.rateLimitHeaders) {
                Object.entries(ctx.rateLimitHeaders).forEach(([key, value]) => {
                    headers.set(key, value);
                });
            }
            return new Response(response.body, { status: response.status, headers: headers });
        } catch (error) {
            const duration = Date.now() - startTime;
            perfMonitor.recordRequest(false, duration, error.message);
            console.error('Worker error:', error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: 'worker_error',
                    timestamp: new Date().toISOString()
                }
            }), {
                status: 500,
                headers: corsHeaders({ 'Content-Type': 'application/json' })
            });
        }
    }
};
// Web UI 界面
function handleUI() {
  const authStatus = CONFIG.POLLINATIONS_AUTH.enabled ? 
    '<span style="color:#22c55e;font-weight:600;font-size:12px">🔐 已認證</span>' : 
    '<span style="color:#f59e0b;font-weight:600;font-size:12px">🔓 匿名模式</span>';
    
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flux AI Pro v${CONFIG.PROJECT_VERSION}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#fff;padding:20px;min-height:100vh}
.container{max-width:1400px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:15px}
.header-left{flex:1}
h1{color:#f59e0b;margin:0;font-size:36px;font-weight:800;text-shadow:0 0 30px rgba(245,158,11,0.6)}
.badge{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:6px 14px;border-radius:20px;font-size:14px;margin-left:10px}
.badge-new{background:linear-gradient(135deg,#ec4899 0%,#db2777 100%);padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700;margin-left:8px}
.subtitle{color:#9ca3af;margin-top:8px;font-size:14px;display:flex;align-items:center;gap:10px}
.api-status{padding:4px 10px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(16,185,129,0.1);border:1px solid #10b981}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:15px;margin-bottom:25px}
.stat-card{background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border-radius:12px;padding:15px;border:1px solid rgba(255,255,255,0.1)}
.stat-label{color:#9ca3af;font-size:12px;margin-bottom:5px}
.stat-value{font-size:24px;font-weight:700;color:#f59e0b}
.main-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:20px;margin-bottom:25px}
@media(max-width:1024px){.main-grid{grid-template-columns:1fr}}
.panel{background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border-radius:16px;padding:25px;border:1px solid rgba(255,255,255,0.1)}
.panel-title{font-size:20px;font-weight:700;margin-bottom:20px;color:#f59e0b;display:flex;align-items:center;gap:8px}
.form-group{margin-bottom:20px}
label{display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#e5e7eb}
input,select,textarea{width:100%;padding:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:14px;transition:all 0.3s}
input:focus,select:focus,textarea:focus{outline:none;border-color:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,0.1)}
textarea{min-height:100px;resize:vertical;font-family:inherit}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:15px}
@media(max-width:768px){.grid-2{grid-template-columns:1fr}}
.btn{padding:14px 28px;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s;display:inline-flex;align-items:center;gap:8px;justify-content:center}
.btn-primary{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#fff;box-shadow:0 4px 15px rgba(245,158,11,0.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(245,158,11,0.4)}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none}
.btn-group{display:flex;gap:10px;flex-wrap:wrap}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.gallery-item{background:rgba(0,0,0,0.4);border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);transition:all 0.3s}
.gallery-item:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(245,158,11,0.3)}
.gallery-item img{width:100%;height:280px;object-fit:cover;display:block}
.gallery-info{padding:15px}
.gallery-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.model-badge{background:rgba(245,158,11,0.2);color:#f59e0b;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}
.seed-badge{background:rgba(16,185,129,0.2);color:#10b981;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}
.prompt-text{color:#9ca3af;font-size:13px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.loading{text-align:center;padding:40px;color:#9ca3af}
.spinner{border:3px solid rgba(255,255,255,0.1);border-top:3px solid #f59e0b;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 15px}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.alert{padding:15px;border-radius:10px;margin-bottom:20px;border-left:4px solid}
.alert-success{background:rgba(16,185,129,0.1);border-color:#10b981;color:#10b981}
.alert-error{background:rgba(239,68,68,0.1);border-color:#ef4444;color:#ef4444}
.alert-info{background:rgba(59,130,246,0.1);border-color:#3b82f6;color:#3b82f6}
.feature-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:15px}
.feature-item{display:flex;align-items:center;gap:8px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:13px}
.toggle-switch{position:relative;display:inline-block;width:50px;height:24px}
.toggle-switch input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:rgba(255,255,255,0.1);transition:.3s;border-radius:24px}
.toggle-slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:white;transition:.3s;border-radius:50%}
input:checked + .toggle-slider{background-color:#10b981}
input:checked + .toggle-slider:before{transform:translateX(26px)}
.range-input{width:100%;height:6px;border-radius:3px;background:rgba(255,255,255,0.1);outline:none;-webkit-appearance:none}
.range-input::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#f59e0b;cursor:pointer}
.range-input::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#f59e0b;cursor:pointer;border:none}
.advanced-toggle{cursor:pointer;color:#3b82f6;font-size:14px;margin-bottom:15px;display:inline-block}
.advanced-toggle:hover{text-decoration:underline}
.advanced-section{display:none;animation:fadeIn 0.3s}
.advanced-section.show{display:block}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.info-tooltip{display:inline-block;width:16px;height:16px;background:#3b82f6;color:#fff;border-radius:50%;text-align:center;line-height:16px;font-size:11px;margin-left:5px;cursor:help}
.ref-image-container{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
.ref-image-item{position:relative;width:80px;height:80px;border-radius:8px;overflow:hidden;border:2px solid rgba(255,255,255,0.2)}
.ref-image-item img{width:100%;height:100%;object-fit:cover}
.ref-image-remove{position:absolute;top:4px;right:4px;background:rgba(239,68,68,0.9);color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;line-height:1}
.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);color:#9ca3af;font-size:13px}
</style>
</head>
<body>
<div class="container">
<div class="header">
<div class="header-left">
<h1>🎨 Flux AI Pro <span class="badge">v${CONFIG.PROJECT_VERSION}</span><span class="badge-new">官方 API</span></h1>
<div class="subtitle">
<span>多模型AI圖像生成平台</span>
<span class="api-status">${authStatus}</span>
</div>
</div>
</div>

<div class="stats">
<div class="stat-card">
<div class="stat-label">🎨 可用模型</div>
<div class="stat-value">17+</div>
</div>
<div class="stat-card">
<div class="stat-label">🖼️ 藝術風格</div>
<div class="stat-value">39</div>
</div>
<div class="stat-card">
<div class="stat-label">📐 尺寸預設</div>
<div class="stat-value">33+</div>
</div>
<div class="stat-card">
<div class="stat-label">⚡ API 端點</div>
<div class="stat-value">${CONFIG.PROVIDERS.pollinations.endpoint}</div>
</div>
</div>

<div class="alert alert-info">
<strong>🔐 API 認證說明:</strong> 
${CONFIG.POLLINATIONS_AUTH.enabled ? 
  '已配置 API Key,享有更高速率限制和優先處理' : 
  '當前為匿名模式。如需提升速率,請在 wrangler.toml 或環境變量中設置 <code>POLLINATIONS_API_KEY</code>'}
</div>

<div class="main-grid">
<div class="panel">
<div class="panel-title">🎨 生成參數</div>
<form id="generateForm">
<div class="form-group">
<label>提示詞 (支持中文自動翻譯)</label>
<textarea id="prompt" placeholder="描述你想生成的圖像..." required></textarea>
</div>

<div class="form-group">
<label>模型選擇</label>
<select id="model">
<optgroup label="Flux 系列">
<option value="flux" selected>Flux (標準)</option>
<option value="flux-realism">Flux Realism (超寫實)</option>
<option value="flux-anime">Flux Anime (動漫)</option>
<option value="flux-3d">Flux 3D (3D渲染)</option>
<option value="flux-pro">Flux Pro (專業版)</option>
<option value="any-dark">Any Dark (暗黑)</option>
<option value="turbo">Turbo (極速)</option>
</optgroup>
<optgroup label="Flux 進階">
<option value="flux-1.1-pro">Flux 1.1 Pro 🔥</option>
<option value="flux-kontext">Flux Kontext 🎨 (圖生圖)</option>
<option value="flux-kontext-pro">Flux Kontext Pro 💎</option>
</optgroup>
<optgroup label="Gemini 系列">
<option value="nanobanana">Nano Banana 🍌 (4張參考圖)</option>
<option value="nanobanana-pro">Nano Banana Pro 🍌💎 (4K)</option>
</optgroup>
<optgroup label="Stable Diffusion">
<option value="sd3">SD 3 ⚡</option>
<option value="sd3.5-large">SD 3.5 Large 🔥</option>
<option value="sd3.5-turbo">SD 3.5 Turbo ⚡</option>
<option value="sdxl">SDXL 📐</option>
<option value="sdxl-lightning">SDXL Lightning ⚡</option>
</optgroup>
</select>
</div>

<div class="form-group">
<label>尺寸預設</label>
<select id="size">
<option value="square-1k" selected>方形 1024x1024</option>
<option value="square-1.5k">方形 1536x1536 (高清)</option>
<option value="square-2k">方形 2048x2048 (超清)</option>
<option value="square-4k">方形 4096x4096 (4K) 🍌</option>
<option value="portrait-9-16-hd">豎屏 1080x1920 (Story)</option>
<option value="landscape-16-9-hd">橫屏 1920x1080 (YouTube)</option>
<option value="landscape-16-9-4k">橫屏 3840x2160 (4K) 🍌</option>
<option value="instagram-square">Instagram 方形</option>
<option value="wallpaper-2k">桌布 2K</option>
<option value="custom">自定義尺寸</option>
</select>
</div>

<div class="form-group">
<label>藝術風格</label>
<select id="style">
<option value="none" selected>無 (原始)</option>
<option value="anime">動漫風格 ✨</option>
<option value="photorealistic">寫實照片 📷</option>
<option value="oil-painting">油畫 🎨</option>
<option value="watercolor">水彩畫 💧</option>
<option value="cyberpunk">賽博朋克 🌃</option>
<option value="fantasy">奇幻風格 🐉</option>
<option value="studio-ghibli">吉卜力風格 🍃</option>
</select>
</div>

<div class="form-group">
<label>質量模式</label>
<select id="qualityMode">
<option value="economy">經濟模式 (快速測試)</option>
<option value="standard" selected>標準模式 (平衡)</option>
<option value="ultra">超高清模式 (最佳質量)</option>
<option value="ultra_4k">4K超高清 (Nano Banana Pro)</option>
</select>
</div>

<a class="advanced-toggle" onclick="document.getElementById('advancedSection').classList.toggle('show')">
▼ 進階選項
</a>

<div id="advancedSection" class="advanced-section">
<div class="form-group">
<label>Seed (-1 = 隨機)</label>
<input type="number" id="seed" value="-1" min="-1" max="999999">
</div>

<div class="form-group">
<label>生成數量</label>
<input type="number" id="numOutputs" value="1" min="1" max="4">
</div>

<div class="form-group">
<label>負面提示詞</label>
<textarea id="negativePrompt" placeholder="描述不想要的內容..." rows="3"></textarea>
</div>

<div class="form-group">
<label>參考圖像 URL (多張用逗號分隔)</label>
<input type="text" id="referenceImages" placeholder="https://example.com/image1.jpg, https://...">
<div id="refImagePreview" class="ref-image-container"></div>
</div>

<div class="grid-2">
<div class="form-group">
<label>
<input type="checkbox" id="autoOptimize" checked> 自動優化參數
</label>
</div>
<div class="form-group">
<label>
<input type="checkbox" id="autoHD" checked> 自動HD增強
</label>
</div>
</div>
</div>

<button type="submit" class="btn btn-primary" id="generateBtn">
<span>🎨 開始生成</span>
</button>
</form>
</div>

<div class="panel">
<div class="panel-title">🖼️ 生成結果</div>
<div id="results">
<div style="text-align:center;padding:60px 20px;color:#9ca3af">
<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin:0 auto 20px">
<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
<circle cx="8.5" cy="8.5" r="1.5"></circle>
<polyline points="21 15 16 10 5 21"></polyline>
</svg>
<p style="font-size:16px;margin-bottom:10px">尚未生成任何圖像</p>
<p style="font-size:14px">填寫左側參數後點擊「開始生成」</p>
</div>
</div>
</div>
</div>

<div class="panel">
<div class="panel-title">✨ 主要特性</div>
<div class="feature-list">
<div class="feature-item">🔐 官方 API 認證支持</div>
<div class="feature-item">📡 gen.pollinations.ai 端點</div>
<div class="feature-item">🎨 17+ AI 模型</div>
<div class="feature-item">🖼️ 39 種藝術風格</div>
<div class="feature-item">📐 33+ 尺寸預設</div>
<div class="feature-item">🎲 Seed 精確控制</div>
<div class="feature-item">🌐 中文自動翻譯</div>
<div class="feature-item">⚡ 智能參數優化</div>
<div class="feature-item">🔍 HD 質量增強</div>
<div class="feature-item">🖼️ 圖生圖 (Kontext)</div>
<div class="feature-item">🍌 4K 超高清 (Nano Banana Pro)</div>
<div class="feature-item">📦 批量生成 (最多4張)</div>
</div>
</div>

<div class="footer">
<p><strong>Flux AI Pro v${CONFIG.PROJECT_VERSION}</strong> | Powered by ${CONFIG.PROVIDERS.pollinations.endpoint}</p>
<p style="margin-top:8px">API 端點: /v1/images/generations | /v1/chat/completions | /v1/models</p>
</div>
</div>

<script>
const form = document.getElementById('generateForm');
const resultsDiv = document.getElementById('results');
const generateBtn = document.getElementById('generateBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const prompt = document.getElementById('prompt').value;
  const model = document.getElementById('model').value;
  const sizePreset = document.getElementById('size').value;
  const style = document.getElementById('style').value;
  const qualityMode = document.getElementById('qualityMode').value;
  const seed = parseInt(document.getElementById('seed').value);
  const numOutputs = parseInt(document.getElementById('numOutputs').value);
  const negativePrompt = document.getElementById('negativePrompt').value;
  const autoOptimize = document.getElementById('autoOptimize').checked;
  const autoHD = document.getElementById('autoHD').checked;
  const refImagesInput = document.getElementById('referenceImages').value;
  
  let referenceImages = [];
  if (refImagesInput.trim()) {
    referenceImages = refImagesInput.split(',').map(url => url.trim()).filter(url => url);
  }
  
  const sizes = ${JSON.stringify(CONFIG.PRESET_SIZES)};
  const sizeConfig = sizes[sizePreset] || sizes['square-1k'];
  
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<div class="spinner"></div><span>生成中...</span>';
  
  resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>正在生成圖像,請稍候...</p></div>';
  
  try {
    const response = await fetch('/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model,
        width: sizeConfig.width,
        height: sizeConfig.height,
        style,
        quality_mode: qualityMode,
        seed: seed,
        n: numOutputs,
        negative_prompt: negativePrompt,
        auto_optimize: autoOptimize,
        auto_hd: autoHD,
        reference_images: referenceImages
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      resultsDiv.innerHTML = '<div class="alert alert-error"><strong>錯誤:</strong> ' + data.error.message + '</div>';
    } else {
      let html = '<div class="gallery">';
      data.data.forEach((item, index) => {
        html += \`
        <div class="gallery-item">
          <img src="\${item.url}" alt="Generated \${index + 1}" loading="lazy">
          <div class="gallery-info">
            <div class="gallery-meta">
              <span class="model-badge">\${item.model}</span>
              <span class="seed-badge">Seed: \${item.seed}</span>
            </div>
            <div class="prompt-text">\${prompt}</div>
            <div style="margin-top:10px;font-size:11px;color:#6b7280">
              \${item.width}x\${item.height} | \${item.quality_mode} | \${item.generation_mode || '文生圖'}
              \${item.authenticated ? ' | 🔐 已認證' : ''}
            </div>
          </div>
        </div>
        \`;
      });
      html += '</div>';
      
      if (data.cached) {
        html = '<div class="alert alert-success">💾 從緩存返回 (Seed相同)</div>' + html;
      }
      
      resultsDiv.innerHTML = html;
    }
  } catch (error) {
    resultsDiv.innerHTML = '<div class="alert alert-error"><strong>錯誤:</strong> ' + error.message + '</div>';
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span>🎨 開始生成</span>';
  }
});

// 參考圖像預覽
document.getElementById('referenceImages').addEventListener('input', (e) => {
  const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
  const preview = document.getElementById('refImagePreview');
  preview.innerHTML = '';
  urls.forEach(url => {
    const div = document.createElement('div');
    div.className = 'ref-image-item';
    div.innerHTML = \`<img src="\${url}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\'%3E%3Crect fill=\\'%23333\\' width=\\'80\\' height=\\'80\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-size=\\'12\\'%3E錯誤%3C/text%3E%3C/svg%3E'"></div>\`;
    preview.appendChild(div);
  });
});
</script>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      ...corsHeaders()
    }
  });
}
