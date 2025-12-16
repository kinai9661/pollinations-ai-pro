// =================================================================================
//  項目: Flux-AI-Pro (重建優化版)
//  版本: 10.0.0
//  作者: AI Assistant
//  日期: 2025-12-17
//  功能: 完整 UI | 17模型 | 39風格 | Seed控制 | 批量生成 | 圖生圖 | 中文支持
//  優化: 代碼重構 | 詳細註釋 | 錯誤處理增強 | 性能優化
// =================================================================================

// ==================== 配置層 ====================

/**
 * 全局配置對象
 * 包含所有模型、風格、尺寸、優化規則的配置
 */
const CONFIG = {
  // 項目基本信息
  PROJECT_NAME: "Flux-AI-Pro",
  PROJECT_VERSION: "10.0.0",
  API_MASTER_KEY: "1",
  
  // 圖像生成提供商配置
  PROVIDERS: {
    pollinations: {
      name: "Pollinations.ai",
      endpoint: "https://image.pollinations.ai",
      type: "direct",
      auth_mode: "free",
      requires_key: false,
      enabled: true,
      default: true,
      description: "完全免費的 AI 圖像生成服務",
      
      // 功能特性
      features: {
        private_mode: true,           // 私密模式
        custom_size: true,            // 自定義尺寸
        seed_control: true,           // Seed 控制
        negative_prompt: true,        // 負面提示詞
        enhance: true,                // 增強模式
        nologo: true,                 // 無水印
        style_presets: true,          // 風格預設
        auto_hd: true,                // 自動 HD
        quality_modes: true,          // 質量模式
        auto_translate: true,         // 自動翻譯
        ultra_hd_4k: true,            // 4K 超清
        reference_images: true,       // 參考圖
        image_to_image: true,         // 圖生圖
        multi_image_fusion: true,     // 多圖融合
        batch_generation: true        // 批量生成
      },
      
      // 支持的模型列表（17個）
      models: [
        // ⚡ Flux 系列（7個）
        { 
          id: "flux", 
          name: "Flux", 
          confirmed: true, 
          category: "flux", 
          description: "均衡速度與質量，通用首選", 
          max_size: 2048 
        },
        { 
          id: "flux-realism", 
          name: "Flux Realism", 
          confirmed: true, 
          category: "flux", 
          description: "超寫實照片風格", 
          max_size: 2048 
        },
        { 
          id: "flux-anime", 
          name: "Flux Anime", 
          confirmed: true, 
          category: "flux", 
          description: "日系動漫風格", 
          max_size: 2048 
        },
        { 
          id: "flux-3d", 
          name: "Flux 3D", 
          confirmed: true, 
          category: "flux", 
          description: "3D 渲染風格", 
          max_size: 2048 
        },
        { 
          id: "flux-pro", 
          name: "Flux Pro", 
          confirmed: true, 
          category: "flux", 
          description: "專業版最高質量", 
          max_size: 2048 
        },
        { 
          id: "any-dark", 
          name: "Any Dark", 
          confirmed: true, 
          category: "flux", 
          description: "暗黑風格", 
          max_size: 2048 
        },
        { 
          id: "turbo", 
          name: "Turbo", 
          confirmed: true, 
          category: "flux", 
          description: "極速生成", 
          max_size: 2048 
        },
        
        // 🔥 Flux 進階系列（3個）
        { 
          id: "flux-1.1-pro", 
          name: "Flux 1.1 Pro 🔥", 
          confirmed: false, 
          fallback: ["flux-pro", "flux-realism"], 
          experimental: true, 
          category: "flux-advanced", 
          description: "最新 Flux 1.1，更強細節", 
          max_size: 2048 
        },
        { 
          id: "flux-kontext", 
          name: "Flux Kontext 🎨", 
          confirmed: false, 
          fallback: ["flux-pro", "flux-realism"], 
          experimental: true, 
          category: "flux-advanced", 
          description: "圖像編輯（1張參考圖）", 
          max_size: 2048,
          supports_reference_images: true,
          max_reference_images: 1
        },
        { 
          id: "flux-kontext-pro", 
          name: "Flux Kontext Pro 💎", 
          confirmed: false, 
          fallback: ["flux-kontext", "flux-pro"], 
          experimental: true, 
          category: "flux-advanced", 
          description: "圖像編輯專業版（1張參考圖）", 
          max_size: 2048,
          supports_reference_images: true,
          max_reference_images: 1
        },
        
        // 🍌 Nano Banana 系列（2個）
        { 
          id: "nanobanana", 
          name: "Nano Banana 🍌", 
          confirmed: true, 
          category: "gemini", 
          description: "Gemini 2.5 Flash（4張參考圖）", 
          max_size: 2048,
          supports_reference_images: true,
          max_reference_images: 4
        },
        { 
          id: "nanobanana-pro", 
          name: "Nano Banana Pro 🍌💎", 
          confirmed: true, 
          category: "gemini", 
          description: "Gemini 3 Pro（4K + 4張參考圖）", 
          max_size: 4096,
          ultra_hd: true,
          supports_reference_images: true,
          max_reference_images: 4
        },
        
        // ⚡ Stable Diffusion 系列（5個）
        { 
          id: "sd3", 
          name: "Stable Diffusion 3 ⚡", 
          confirmed: false, 
          fallback: ["flux-realism", "flux"], 
          experimental: true, 
          category: "stable-diffusion", 
          description: "SD3 標準版", 
          max_size: 2048 
        },
        { 
          id: "sd3.5-large", 
          name: "SD 3.5 Large 🔥", 
          confirmed: false, 
          fallback: ["sd3", "flux-realism"], 
          experimental: true, 
          category: "stable-diffusion", 
          description: "SD 3.5 大模型", 
          max_size: 2048 
        },
        { 
          id: "sd3.5-turbo", 
          name: "SD 3.5 Turbo ⚡", 
          confirmed: false, 
          fallback: ["turbo", "flux"], 
          experimental: true, 
          category: "stable-diffusion", 
          description: "SD 3.5 快速版", 
          max_size: 2048 
        },
        { 
          id: "sdxl", 
          name: "SDXL 📐", 
          confirmed: false, 
          fallback: ["flux-realism", "flux"], 
          experimental: true, 
          category: "stable-diffusion", 
          description: "經典 SDXL", 
          max_size: 2048 
        },
        { 
          id: "sdxl-lightning", 
          name: "SDXL Lightning ⚡", 
          confirmed: false, 
          fallback: ["turbo", "flux"], 
          experimental: true, 
          category: "stable-diffusion", 
          description: "SDXL 極速版", 
          max_size: 2048 
        }
      ],
      
      rate_limit: null,
      max_size: { width: 4096, height: 4096 }
    }
  },
  
  DEFAULT_PROVIDER: "pollinations",
  
  // 藝術風格預設（39種）
  STYLE_PRESETS: {
    none: { 
      name: "無（使用原始提示詞）", 
      prompt: "", 
      negative: "" 
    },
    
    // 🎌 動漫系列（6種）
    anime: { 
      name: "動漫風格 ✨", 
      prompt: "anime style, anime art, vibrant colors, anime character, detailed anime", 
      negative: "realistic, photograph, 3d, ugly" 
    },
    "anime-chibi": { 
      name: "Q版動漫 🎎", 
      prompt: "chibi style, cute chibi character, big eyes, small body, kawaii, adorable", 
      negative: "realistic, tall, adult proportions, serious" 
    },
    "japanese-manga": { 
      name: "日本漫畫 📚", 
      prompt: "manga style, black and white manga, screentone, manga panel, Japanese comic art", 
      negative: "colored, realistic, photograph, western comic" 
    },
    "shoujo-manga": { 
      name: "少女漫畫 💕", 
      prompt: "shoujo manga style, sparkles, flowers background, big expressive eyes, romantic", 
      negative: "shounen, action, dark, gritty" 
    },
    "seinen-manga": { 
      name: "青年漫畫 🗡️", 
      prompt: "seinen manga style, detailed linework, realistic anatomy, mature themes", 
      negative: "childish, cute, simple, cartoon" 
    },
    "studio-ghibli": { 
      name: "吉卜力風格 🍃", 
      prompt: "Studio Ghibli style, Hayao Miyazaki, anime, soft colors, whimsical, hand-drawn", 
      negative: "realistic, dark, 3D, western animation" 
    },
    
    // 📷 寫實系列（3種）
    photorealistic: { 
      name: "寫實照片 📷", 
      prompt: "photorealistic, ultra realistic, 8k uhd, professional photography, detailed, sharp focus", 
      negative: "anime, cartoon, illustration, painting, drawing, art" 
    },
    cinematic: { 
      name: "電影級 🎬", 
      prompt: "cinematic lighting, movie still, dramatic lighting, film grain, depth of field, bokeh", 
      negative: "amateur, flat lighting, overexposed, cartoon" 
    },
    portrait: { 
      name: "人像攝影 👤", 
      prompt: "professional portrait, studio lighting, bokeh background, 85mm lens, perfect skin", 
      negative: "full body, landscape, distorted face, bad lighting" 
    },
    
    // 🖌️ 傳統繪畫（8種）
    "oil-painting": { 
      name: "油畫 🎨", 
      prompt: "oil painting, classical oil painting style, visible brushstrokes, rich colors, canvas texture", 
      negative: "photograph, digital art, anime, flat" 
    },
    watercolor: { 
      name: "水彩畫 💧", 
      prompt: "watercolor painting, soft colors, watercolor texture, hand-painted, paper texture", 
      negative: "photograph, digital, sharp edges, 3d" 
    },
    "chinese-painting": { 
      name: "中國水墨畫 🖌️", 
      prompt: "Chinese ink painting, sumi-e style, traditional Chinese art, brush painting, black ink", 
      negative: "colorful, western, digital, photograph" 
    },
    "ukiyo-e": { 
      name: "浮世繪 🗾", 
      prompt: "ukiyo-e style, Japanese woodblock print, Hokusai style, flat colors, bold outlines", 
      negative: "3d, realistic, photograph, modern" 
    },
    sketch: { 
      name: "素描 ✏️", 
      prompt: "pencil sketch, hand-drawn, sketch art, graphite drawing, cross-hatching", 
      negative: "colored, painted, digital, photograph" 
    },
    charcoal: { 
      name: "炭筆畫 🖍️", 
      prompt: "charcoal drawing, charcoal sketch, dramatic shading, black and white, expressive strokes", 
      negative: "colored, digital, clean lines, photograph" 
    },
    impressionism: { 
      name: "印象派 🌅", 
      prompt: "impressionism style, visible brushstrokes, emphasis on light, Monet, soft focus", 
      negative: "sharp, detailed, photorealistic, digital" 
    },
    surrealism: { 
      name: "超現實主義 🌀", 
      prompt: "surrealism, dreamlike, Salvador Dali style, impossible geometry, bizarre", 
      negative: "realistic, ordinary, conventional, logical" 
    },
    
    // 💻 數位藝術（4種）
    "digital-art": { 
      name: "數位藝術 💻", 
      prompt: "digital art, digital painting, concept art, artstation, highly detailed, vibrant colors", 
      negative: "photograph, traditional art, sketch, low quality" 
    },
    "pixel-art": { 
      name: "像素藝術 🕹️", 
      prompt: "pixel art, 8-bit style, retro gaming, pixelated, limited color palette", 
      negative: "high resolution, smooth, realistic, blurry" 
    },
    "vector-art": { 
      name: "向量藝術 📐", 
      prompt: "vector art, flat design, clean lines, geometric shapes, minimalist", 
      negative: "realistic, textured, sketchy, photograph" 
    },
    "low-poly": { 
      name: "低多邊形 🔷", 
      prompt: "low poly art, geometric, faceted, 3D low poly, minimalist 3D", 
      negative: "high poly, realistic, smooth, curved" 
    },
    
    // 🌌 幻想科幻（7種）
    fantasy: { 
      name: "奇幻風格 🐉", 
      prompt: "fantasy art, magical, epic fantasy, detailed fantasy illustration, mystical", 
      negative: "modern, realistic, mundane, contemporary" 
    },
    "dark-fantasy": { 
      name: "黑暗奇幻 🌑", 
      prompt: "dark fantasy, gothic, dark atmosphere, ominous, sinister, dramatic shadows", 
      negative: "bright, cheerful, cute, colorful" 
    },
    "fairy-tale": { 
      name: "童話風格 🧚", 
      prompt: "fairy tale art, storybook illustration, whimsical, magical, enchanted forest", 
      negative: "realistic, modern, dark, gritty" 
    },
    cyberpunk: { 
      name: "賽博朋克 🌃", 
      prompt: "cyberpunk style, neon lights, futuristic, sci-fi, dystopian, blade runner style", 
      negative: "natural, rustic, medieval, fantasy" 
    },
    "sci-fi": { 
      name: "科幻未來 🚀", 
      prompt: "sci-fi, futuristic, advanced technology, space age, sleek design, holographic", 
      negative: "medieval, fantasy, historical, primitive" 
    },
    steampunk: { 
      name: "蒸汽朋克 ⚙️", 
      prompt: "steampunk style, Victorian era, brass and copper, gears and cogs, mechanical", 
      negative: "modern, digital, minimalist, clean" 
    },
    vaporwave: { 
      name: "蒸氣波 🌈", 
      prompt: "vaporwave aesthetic, retro 80s, neon pink and cyan, glitch art, nostalgic", 
      negative: "realistic, modern, natural colors" 
    },
    
    // 🎬 動畫影視（2種）
    disney: { 
      name: "迪士尼風格 🏰", 
      prompt: "Disney animation style, 3D animated, Pixar style, colorful, expressive characters", 
      negative: "realistic, anime, dark, gritty" 
    },
    "comic-book": { 
      name: "美式漫畫 💥", 
      prompt: "comic book style, bold lines, halftone dots, superhero comic, dynamic pose", 
      negative: "realistic, photograph, manga, soft" 
    },
    
    // 🎭 藝術流派（6種）
    "pop-art": { 
      name: "普普藝術 🎭", 
      prompt: "pop art style, Andy Warhol, Roy Lichtenstein, bold colors, halftone, retro", 
      negative: "realistic, subtle, muted colors, classical" 
    },
    "art-deco": { 
      name: "裝飾藝術 💎", 
      prompt: "art deco style, geometric patterns, luxurious, elegant, 1920s, gold and black", 
      negative: "organic, natural, messy, modern minimalist" 
    },
    "art-nouveau": { 
      name: "新藝術風格 🌺", 
      prompt: "art nouveau style, flowing lines, organic forms, floral motifs, elegant curves", 
      negative: "geometric, modern, minimalist, angular" 
    },
    abstract: { 
      name: "抽象藝術 🎨", 
      prompt: "abstract art, non-representational, geometric shapes, bold colors, expressive", 
      negative: "realistic, detailed, representational, photographic" 
    },
    minimalist: { 
      name: "極簡主義 ⬜", 
      prompt: "minimalist art, simple, clean lines, negative space, limited color palette, modern", 
      negative: "detailed, complex, ornate, cluttered" 
    },
    
    // 🎨 特殊風格（3種）
    graffiti: { 
      name: "塗鴉藝術 🎨", 
      prompt: "graffiti art, street art, spray paint, urban, bold colors, wild style lettering", 
      negative: "classical, refined, photorealistic, corporate" 
    },
    horror: { 
      name: "恐怖風格 👻", 
      prompt: "horror art, creepy, disturbing, dark atmosphere, unsettling, macabre", 
      negative: "cute, bright, cheerful, wholesome" 
    },
    kawaii: { 
      name: "可愛風格 🌸", 
      prompt: "kawaii style, cute, adorable, pastel colors, Japanese cute culture, soft", 
      negative: "realistic, dark, scary, mature" 
    }
  },
  
  // 參數優化規則
  OPTIMIZATION_RULES: {
    // 不同模型的最佳步數範圍
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
    
    // 尺寸對步數的影響係數
    SIZE_MULTIPLIER: {
      small: { threshold: 512 * 512, multiplier: 0.8 },
      medium: { threshold: 1024 * 1024, multiplier: 1.0 },
      large: { threshold: 1536 * 1536, multiplier: 1.15 },
      xlarge: { threshold: 2048 * 2048, multiplier: 1.3 },
      ultra_4k: { threshold: 4096 * 4096, multiplier: 1.5 }
    },
    
    // 風格對步數的影響係數
    STYLE_ADJUSTMENT: {
      "photorealistic": 1.1,
      "oil-painting": 1.05,
      "watercolor": 0.95,
      "sketch": 0.9,
      "default": 1.0
    }
  },
  
  // HD 畫質優化配置
  HD_OPTIMIZATION: {
    enabled: true,
    
    // 4種質量模式
    QUALITY_MODES: {
      economy: { 
        name: "經濟模式", 
        description: "快速出圖，適合測試", 
        min_resolution: 1024, 
        max_resolution: 2048, 
        steps_multiplier: 0.85, 
        guidance_multiplier: 0.9, 
        hd_level: "basic" 
      },
      standard: { 
        name: "標準模式", 
        description: "平衡質量與速度", 
        min_resolution: 1280, 
        max_resolution: 2048, 
        steps_multiplier: 1.0, 
        guidance_multiplier: 1.0, 
        hd_level: "enhanced" 
      },
      ultra: { 
        name: "超高清模式", 
        description: "極致質量，耗時較長", 
        min_resolution: 1536, 
        max_resolution: 4096, 
        steps_multiplier: 1.35, 
        guidance_multiplier: 1.15, 
        hd_level: "maximum", 
        force_upscale: true 
      },
      ultra_4k: { 
        name: "4K超高清", 
        description: "Nano Banana Pro 專屬", 
        min_resolution: 2048, 
        max_resolution: 4096, 
        steps_multiplier: 1.5, 
        guidance_multiplier: 1.2, 
        hd_level: "ultra_4k", 
        force_upscale: true, 
        exclusive_models: ["nanobanana-pro"] 
      }
    },
    
    // HD 提示詞增強
    HD_PROMPTS: {
      basic: "high quality, detailed, sharp",
      enhanced: "high quality, extremely detailed, sharp focus, crisp, clear, professional, 8k uhd",
      maximum: "ultra high quality, extremely detailed, razor sharp focus, crystal clear, professional grade, 8k uhd, masterpiece, fine details",
      ultra_4k: "ultra high definition 4K quality, extreme detail precision, professional grade, pixel-perfect clarity, masterpiece quality"
    },
    
    // HD 負面提示詞
    HD_NEGATIVE: "low quality, blurry, pixelated, low resolution, jpeg artifacts, bad quality, distorted, noisy, grainy",
    
    // 模型專屬質量配置
    MODEL_QUALITY_PROFILES: {
      "flux-realism": { 
        priority: "ultra_detail", 
        min_resolution: 1536, 
        max_resolution: 2048, 
        optimal_steps_boost: 1.25, 
        guidance_boost: 1.15, 
        recommended_quality: "ultra" 
      },
      "flux-pro": { 
        priority: "maximum_quality", 
        min_resolution: 1536, 
        max_resolution: 2048, 
        optimal_steps_boost: 1.3, 
        guidance_boost: 1.2, 
        recommended_quality: "ultra" 
      },
      "flux-1.1-pro": { 
        priority: "maximum_quality", 
        min_resolution: 1536, 
        max_resolution: 2048, 
        optimal_steps_boost: 1.25, 
        guidance_boost: 1.15, 
        recommended_quality: "ultra" 
      },
      "nanobanana-pro": { 
        priority: "ultra_4k_multi", 
        min_resolution: 2048, 
        max_resolution: 4096, 
        optimal_steps_boost: 1.5, 
        guidance_boost: 1.25, 
        recommended_quality: "ultra_4k" 
      },
      "turbo": { 
        priority: "speed", 
        min_resolution: 1024, 
        max_resolution: 2048, 
        optimal_steps_boost: 0.7, 
        guidance_boost: 0.85, 
        recommended_quality: "economy" 
      }
    }
  },
  
  // 請求超時設置
  FETCH_TIMEOUT: 90000,  // 90秒
  MAX_RETRIES: 3,        // 最大重試次數
  
  // 尺寸預設（33種）
  PRESET_SIZES: {
    // ⬜ 方形系列（5種）
    "square-512": { width: 512, height: 512, name: "方形 512px（快速測試）" },
    "square-1k": { width: 1024, height: 1024, name: "方形 1K（標準）" },
    "square-1.5k": { width: 1536, height: 1536, name: "方形 1.5K（高清）" },
    "square-2k": { width: 2048, height: 2048, name: "方形 2K（超清）" },
    "square-4k": { width: 4096, height: 4096, name: "方形 4K 🍌", exclusive: ["nanobanana-pro"] },
    
    // 📱 豎屏系列（6種）
    "portrait-9-16": { width: 768, height: 1344, name: "豎屏 9:16（TikTok/Story）" },
    "portrait-9-16-hd": { width: 1080, height: 1920, name: "豎屏 9:16 HD（1080p）" },
    "portrait-9-16-2k": { width: 1536, height: 2688, name: "豎屏 9:16 2K" },
    "portrait-3-4": { width: 768, height: 1024, name: "豎屏 3:4（Instagram）" },
    "portrait-3-4-hd": { width: 1152, height: 1536, name: "豎屏 3:4 HD" },
    "portrait-2-3": { width: 1024, height: 1536, name: "豎屏 2:3（Pinterest）" },
    
    // 🖥️ 橫屏系列（6種）
    "landscape-16-9": { width: 1344, height: 768, name: "橫屏 16:9（YouTube）" },
    "landscape-16-9-hd": { width: 1920, height: 1080, name: "橫屏 16:9 HD（1080p）" },
    "landscape-16-9-2k": { width: 2560, height: 1440, name: "橫屏 16:9 2K（1440p）" },
    "landscape-16-9-4k": { width: 3840, height: 2160, name: "橫屏 16:9 4K 🍌", exclusive: ["nanobanana-pro"] },
    "landscape-4-3": { width: 1024, height: 768, name: "橫屏 4:3（傳統）" },
    "landscape-21-9": { width: 2560, height: 1080, name: "橫屏 21:9（超寬螢幕）" },
    
    // 📲 社交媒體（7種）
    "instagram-square": { width: 1080, height: 1080, name: "Instagram 方形貼文" },
    "instagram-portrait": { width: 1080, height: 1350, name: "Instagram 豎屏貼文（4:5）" },
    "instagram-story": { width: 1080, height: 1920, name: "Instagram Story/Reels" },
    "facebook-cover": { width: 2048, height: 1152, name: "Facebook 封面（16:9）" },
    "twitter-header": { width: 1500, height: 500, name: "Twitter/X 橫幅（3:1）" },
    "youtube-thumbnail": { width: 1280, height: 720, name: "YouTube 縮圖" },
    "linkedin-banner": { width: 1584, height: 396, name: "LinkedIn 橫幅" },
    
    // 🖨️ 印刷/設計（3種）
    "a4-portrait": { width: 2480, height: 3508, name: "A4 豎屏（300 DPI）" },
    "a4-landscape": { width: 3508, height: 2480, name: "A4 橫屏（300 DPI）" },
    "poster-24-36": { width: 2400, height: 3600, name: "海報 24x36 英吋" },
    
    // 🖼️ 桌布系列（5種）
    "wallpaper-fhd": { width: 1920, height: 1080, name: "桌布 Full HD（1080p）" },
    "wallpaper-2k": { width: 2560, height: 1440, name: "桌布 2K（1440p）" },
    "wallpaper-4k": { width: 3840, height: 2160, name: "桌布 4K 🍌", exclusive: ["nanobanana-pro"] },
    "wallpaper-ultrawide": { width: 3440, height: 1440, name: "桌布 Ultra-Wide（21:9）" },
    "mobile-wallpaper": { width: 1242, height: 2688, name: "手機桌布（iPhone）" },
    
    // 🔧 自定義
    "custom": { width: 1024, height: 1024, name: "自定義尺寸" }
  },
  
  // 歷史記錄配置
  HISTORY: {
    MAX_ITEMS: 100,
    STORAGE_KEY: "flux_ai_history"
  }
};

/**
 * API 優化配置
 * 包含速率限制、緩存、壓縮、併發控制等設置
 */
const API_OPTIMIZATION = {
  // 速率限制
  RATE_LIMIT: {
    enabled: true,
    max_requests_per_minute: 10,      // 每分鐘最多10次
    max_requests_per_hour: 100,       // 每小時最多100次
    blacklist_duration: 3600000,      // 封禁時長1小時
    whitelist_ips: []                 // 白名單IP
  },
  
  // 緩存設置
  CACHE: {
    enabled: true,
    ttl: 3600,          // 緩存有效期1小時
    max_size: 100,      // 最多100項
    strategy: 'lru'     // LRU策略
  },
  
  // 壓縮設置
  COMPRESSION: {
    enabled: true,
    threshold: 1024,
    quality: 0.85
  },
  
  // 併發控制
  CONCURRENCY: {
    max_parallel: 3,      // 最多3個並行請求
    queue_limit: 10,      // 隊列上限
    timeout: 120000       // 超時時間2分鐘
  },
  
  // 性能監控
  MONITORING: {
    enabled: true,
    log_requests: true,
    track_errors: true,
    performance_metrics: true
  }
};

// ==================== 核心工具類 ====================

/**
 * 速率限制器
 * 使用滑動窗口算法，防止API濫用
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();      // IP → 時間戳數組
    this.blacklist = new Map();     // IP → 封禁到期時間
  }
  
  /**
   * 檢查IP是否允許訪問
   * @param {string} ip - 客戶端IP
   * @returns {Object} - { allowed: boolean, reason?: string, retryAfter?: number }
   */
  async check(ip) {
    // 1. 檢查黑名單
    if (this.blacklist.has(ip)) {
      const blockedUntil = this.blacklist.get(ip);
      if (Date.now() < blockedUntil) {
        return { 
          allowed: false, 
          reason: 'IP blocked', 
          retryAfter: Math.ceil((blockedUntil - Date.now()) / 1000) 
        };
      } else {
        this.blacklist.delete(ip);
      }
    }
    
    // 2. 檢查白名單
    if (API_OPTIMIZATION.RATE_LIMIT.whitelist_ips.includes(ip)) {
      return { allowed: true };
    }
    
    // 3. 初始化請求記錄
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    
    if (!this.requests.has(ip)) {
      this.requests.set(ip, []);
    }
    
    // 4. 清理過期記錄（超過1小時）
    const userRequests = this.requests.get(ip);
    const validRequests = userRequests.filter(time => now - time < oneHour);
    this.requests.set(ip, validRequests);
    
    // 5. 檢查每分鐘限制
    const recentRequests = validRequests.filter(time => now - time < oneMinute);
    if (recentRequests.length >= API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute) {
      return { 
        allowed: false, 
        reason: 'Too many requests per minute', 
        limit: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute,
        current: recentRequests.length
      };
    }
    
    // 6. 檢查每小時限制
    if (validRequests.length >= API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour) {
      // 超過小時限制，加入黑名單
      this.blacklist.set(ip, now + API_OPTIMIZATION.RATE_LIMIT.blacklist_duration);
      return { 
        allowed: false, 
        reason: 'Hourly limit exceeded', 
        limit: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour,
        blockedUntil: new Date(now + API_OPTIMIZATION.RATE_LIMIT.blacklist_duration).toISOString()
      };
    }
    
    // 7. 記錄本次請求
    validRequests.push(now);
    this.requests.set(ip, validRequests);
    
    return { 
      allowed: true, 
      remaining: {
        perMinute: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute - recentRequests.length - 1,
        perHour: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour - validRequests.length
      }
    };
  }
  
  /**
   * 重置IP限制（管理員功能）
   * @param {string} ip - 客戶端IP
   */
  reset(ip) {
    this.requests.delete(ip);
    this.blacklist.delete(ip);
  }
}

/**
 * LRU 緩存系統
 * 最近最少使用策略，自動淘汰冷數據
 */
class SimpleCache {
  constructor() {
    this.cache = new Map();         // key → { value, expires }
    this.accessTime = new Map();    // key → 最後訪問時間
  }
  
  /**
   * 獲取緩存
   * @param {string} key - 緩存鍵
   * @returns {*} - 緩存值或null
   */
  get(key) {
    if (!API_OPTIMIZATION.CACHE.enabled) return null;
    
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const { value, expires } = cached;
    
    // 檢查是否過期
    if (Date.now() > expires) {
      this.cache.delete(key);
      this.accessTime.delete(key);
      return null;
    }
    
    // 更新訪問時間（LRU）
    this.accessTime.set(key, Date.now());
    return value;
  }
  
  /**
   * 設置緩存
   * @param {string} key - 緩存鍵
   * @param {*} value - 緩存值
   * @param {number} ttl - 有效期（秒）
   */
  set(key, value, ttl = API_OPTIMIZATION.CACHE.ttl) {
    if (!API_OPTIMIZATION.CACHE.enabled) return;
    
    // 達到容量上限，淘汰最久未訪問項（LRU）
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
    
    // 存入新緩存
    this.cache.set(key, {
      value: value,
      expires: Date.now() + (ttl * 1000)
    });
    this.accessTime.set(key, Date.now());
  }
  
  /**
   * 清空所有緩存
   */
  clear() {
    this.cache.clear();
    this.accessTime.clear();
  }
}

/**
 * 性能監控器
 * 記錄請求統計、成功率、平均耗時等
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      total_requests: 0,
      successful_requests: 0,
      failed_requests: 0,
      total_duration: 0,
      avg_duration: 0,
      errors: []  // 最多保存100條錯誤
    };
  }
  
  /**
   * 記錄請求結果
   * @param {boolean} success - 是否成功
   * @param {number} duration - 耗時（毫秒）
   * @param {string} error - 錯誤信息
   */
  recordRequest(success, duration, error = null) {
    this.metrics.total_requests++;
    this.metrics.total_duration += duration;
    this.metrics.avg_duration = this.metrics.total_duration / this.metrics.total_requests;
    
    if (success) {
      this.metrics.successful_requests++;
    } else {
      this.metrics.failed_requests++;
      if (error && this.metrics.errors.length < 100) {
        this.metrics.errors.push({
          message: error,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
  
  /**
   * 獲取統計數據
   * @returns {Object} - 統計信息
   */
  getStats() {
    return {
      ...this.metrics,
      success_rate: ((this.metrics.successful_requests / this.metrics.total_requests) * 100).toFixed(2) + '%',
      avg_duration_ms: this.metrics.avg_duration.toFixed(2)
    };
  }
  
  /**
   * 重置統計
   */
  reset() {
    this.metrics = {
      total_requests: 0,
      successful_requests: 0,
      failed_requests: 0,
      total_duration: 0,
      avg_duration: 0,
      errors: []
    };
  }
}

// 初始化全局實例
const rateLimiter = new RateLimiter();
const apiCache = new SimpleCache();
const perfMonitor = new PerformanceMonitor();

/**
 * 獲取客戶端真實IP
 * @param {Request} request - 請求對象
 * @returns {string} - 客戶端IP
 */
function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 
         (request.headers.get('X-Forwarded-For') ? 
          request.headers.get('X-Forwarded-For').split(',')[0].trim() : null) || 
         request.headers.get('X-Real-IP') || 
         'unknown';
}

/**
 * 生成緩存鍵
 * 基於提示詞和主要參數生成唯一標識
 * @param {string} prompt - 提示詞
 * @param {Object} options - 生成選項
 * @returns {string} - 緩存鍵
 */
function generateCacheKey(prompt, options) {
  const keyData = {
    prompt,
    model: options.model,
    width: options.width,
    height: options.height,
    style: options.style,
    quality_mode: options.qualityMode,
    seed: options.seed === -1 ? 'random' : options.seed
  };
  
  // 簡單hash算法
  const str = JSON.stringify(keyData);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return 'cache_' + Math.abs(hash).toString(36);
}

/**
 * 日誌記錄器
 * 記錄生成過程的各個階段
 */
class Logger {
  constructor() {
    this.logs = [];
  }
  
  /**
   * 添加日誌
   * @param {string} step - 步驟名稱
   * @param {*} data - 日誌數據
   */
  add(step, data) {
    const time = new Date().toISOString().split('T')[1].slice(0, -1);
    this.logs.push({ time, step, data });
    console.log(`[${step}]`, data);
  }
  
  /**
   * 獲取所有日誌
   * @returns {Array} - 日誌數組
   */
  get() {
    return this.logs;
  }
}
// ==================== AI 功能層 ====================

/**
 * 中文翻譯引擎
 * 使用 Cloudflare Workers AI 自動翻譯中文提示詞
 * @param {string} text - 原始文本
 * @param {Object} env - 環境變量
 * @returns {Promise<Object>} - { text: string, translated: boolean, model?: string }
 */
async function translateToEnglish(text, env) {
  // 檢測是否包含中文
  const hasChinese = /[\u4e00-\u9fa5]/.test(text);
  if (!hasChinese) {
    return { text, translated: false };
  }
  
  // 檢查是否有 Workers AI 綁定
  if (!env?.AI) {
    console.warn('Workers AI not available, using original text');
    return { text, translated: false, reason: 'no_workers_ai' };
  }
  
  try {
    // 嘗試主模型: m2m100
    const response = await env.AI.run("@cf/meta/m2m100-1.2b", {
      text: text,
      source_lang: "chinese",
      target_lang: "english"
    });
    
    if (response?.translated_text) {
      console.log('[Translation] Success:', { original: text, translated: response.translated_text });
      return { 
        text: response.translated_text, 
        translated: true,
        model: "m2m100-1.2b",
        original: text
      };
    }
  } catch (primaryError) {
    console.error('[Translation] Primary model failed:', primaryError.message);
    
    // 回退策略：嘗試備用模型
    try {
      const fallbackResponse = await env.AI.run("@cf/meta/m2m100-1.2b", {
        text: text,
        source_lang: "zh",
        target_lang: "en"
      });
      
      if (fallbackResponse?.translated_text) {
        return { 
          text: fallbackResponse.translated_text, 
          translated: true,
          model: "m2m100-1.2b-fallback" 
        };
      }
    } catch (fallbackError) {
      console.error('[Translation] Fallback model failed:', fallbackError.message);
    }
  }
  
  // 全部失敗，返回原文
  console.warn('[Translation] All models failed, using original text');
  return { text, translated: false, reason: 'translation_failed' };
}

/**
 * 提示詞分析器
 * 分析提示詞複雜度，智能推薦質量模式
 */
class PromptAnalyzer {
  /**
   * 分析提示詞複雜度
   * @param {string} prompt - 提示詞
   * @returns {number} - 複雜度評分 (0-1)
   */
  static analyzeComplexity(prompt) {
    let score = 0;
    
    // 1. 關鍵詞檢測 (每個+0.1)
    const complexityKeywords = [
      'detailed', 'intricate', 'complex', 'elaborate', 'sophisticated',
      'realistic', 'photorealistic', 'ultra realistic', 'hyper realistic',
      'high quality', 'masterpiece', 'best quality', 'ultra detailed',
      '4k', '8k', 'uhd', 'professional', 'cinematic',
      'dramatic lighting', 'volumetric', 'ray tracing', 'global illumination'
    ];
    
    complexityKeywords.forEach(keyword => {
      if (prompt.toLowerCase().includes(keyword)) {
        score += 0.1;
      }
    });
    
    // 2. 長度獎勵
    if (prompt.length > 100) score += 0.2;
    if (prompt.length > 200) score += 0.3;
    if (prompt.length > 300) score += 0.2;
    
    // 3. 逗號數量 (描述細節多)
    const commaCount = (prompt.match(/,/g) || []).length;
    if (commaCount > 5) score += 0.15;
    if (commaCount > 10) score += 0.15;
    
    // 4. 括號使用 (權重控制)
    const hasParentheses = /\(|\)/.test(prompt);
    if (hasParentheses) score += 0.1;
    
    // 限制在 0-1 範圍
    return Math.min(score, 1.0);
  }
  
  /**
   * 推薦質量模式
   * @param {string} prompt - 提示詞
   * @param {string} model - 模型ID
   * @returns {string} - 推薦的質量模式
   */
  static recommendQualityMode(prompt, model) {
    const complexity = this.analyzeComplexity(prompt);
    
    // Nano Banana Pro 強制 4K
    if (model === 'nanobanana-pro') {
      return 'ultra_4k';
    }
    
    // 快速模型建議經濟模式
    if (['turbo', 'sdxl-lightning', 'sd3.5-turbo'].includes(model)) {
      return 'economy';
    }
    
    // 根據複雜度推薦
    if (complexity > 0.7) return 'ultra';
    if (complexity > 0.4) return 'standard';
    return 'economy';
  }
}

/**
 * HD 優化器
 * 根據質量模式自動優化提示詞和參數
 */
class HDOptimizer {
  /**
   * 執行 HD 優化
   * @param {string} prompt - 原始提示詞
   * @param {string} negativePrompt - 負面提示詞
   * @param {string} model - 模型ID
   * @param {number} width - 寬度
   * @param {number} height - 高度
   * @param {string} qualityMode - 質量模式
   * @param {boolean} autoHD - 是否啟用自動HD
   * @returns {Object} - 優化後的參數
   */
  static optimize(prompt, negativePrompt, model, width, height, qualityMode = 'standard', autoHD = true) {
    if (!autoHD || !CONFIG.HD_OPTIMIZATION.enabled) {
      return {
        prompt,
        negativePrompt,
        width,
        height,
        optimized: false
      };
    }
    
    const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
    if (!modeConfig) {
      console.warn('[HDOptimizer] Invalid quality mode:', qualityMode);
      return { prompt, negativePrompt, width, height, optimized: false };
    }
    
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
    const optimizations = [];
    
    // 1. 增強提示詞 (添加 HD 關鍵詞)
    let enhancedPrompt = prompt;
    const hdLevel = modeConfig.hd_level;
    const hdBoost = CONFIG.HD_OPTIMIZATION.HD_PROMPTS[hdLevel];
    
    if (hdBoost && !prompt.toLowerCase().includes('quality')) {
      enhancedPrompt = prompt + ", " + hdBoost;
      optimizations.push(`HD增強: ${hdLevel}`);
    }
    
    // 2. 增強負面提示詞
    let enhancedNegative = negativePrompt || "";
    if (qualityMode !== 'economy') {
      const hdNegative = CONFIG.HD_OPTIMIZATION.HD_NEGATIVE;
      if (!enhancedNegative.toLowerCase().includes('low quality')) {
        enhancedNegative = enhancedNegative ? 
          (enhancedNegative + ", " + hdNegative) : 
          hdNegative;
        optimizations.push("負面詞增強");
      }
    }
    
    // 3. 智能尺寸優化
    let finalWidth = width;
    let finalHeight = height;
    const currentRes = Math.min(width, height);
    const minRes = Math.max(modeConfig.min_resolution, profile?.min_resolution || 1024);
    
    // 檢查是否需要上採樣
    if (currentRes < minRes || modeConfig.force_upscale) {
      const scale = minRes / currentRes;
      
      // 確保是 64 的倍數（Stable Diffusion 要求）
      finalWidth = Math.min(Math.round(width * scale / 64) * 64, modeConfig.max_resolution);
      finalHeight = Math.min(Math.round(height * scale / 64) * 64, modeConfig.max_resolution);
      
      optimizations.push(`尺寸優化: ${width}x${height} → ${finalWidth}x${finalHeight}`);
    }
    
    // 4. 模型專屬優化
    if (profile) {
      // 檢查最大分辨率限制
      if (profile.max_resolution) {
        finalWidth = Math.min(finalWidth, profile.max_resolution);
        finalHeight = Math.min(finalHeight, profile.max_resolution);
      }
      
      optimizations.push(`模型配置: ${profile.priority}`);
    }
    
    return {
      prompt: enhancedPrompt,
      negativePrompt: enhancedNegative,
      width: finalWidth,
      height: finalHeight,
      optimized: true,
      qualityMode: qualityMode,
      hdLevel: hdLevel,
      optimizations: optimizations
    };
  }
}

/**
 * 參數優化器
 * 智能計算最佳步數和引導係數
 */
class ParameterOptimizer {
  /**
   * 優化步數
   * @param {string} model - 模型ID
   * @param {number} width - 寬度
   * @param {number} height - 高度
   * @param {string} style - 風格
   * @param {string} qualityMode - 質量模式
   * @param {number} userSteps - 用戶指定步數
   * @returns {Object} - { steps: number, reasoning: string }
   */
  static optimizeSteps(model, width, height, style, qualityMode, userSteps = null) {
    // 如果用戶指定了步數，直接使用
    if (userSteps !== null && userSteps > 0) {
      return { 
        steps: userSteps, 
        reasoning: "用戶指定步數",
        source: "user"
      };
    }
    
    // 1. 獲取模型基礎步數
    const modelRule = CONFIG.OPTIMIZATION_RULES.MODEL_STEPS[model];
    if (!modelRule) {
      console.warn('[ParameterOptimizer] Unknown model, using default steps');
      return { steps: 20, reasoning: "默認步數", source: "default" };
    }
    
    let baseSteps = modelRule.optimal;
    const reasoning = [];
    
    // 2. 尺寸調整
    const totalPixels = width * height;
    let sizeMultiplier = 1.0;
    
    if (totalPixels >= 4096 * 4096) {
      sizeMultiplier = CONFIG.OPTIMIZATION_RULES.SIZE_MULTIPLIER.ultra_4k.multiplier;
      reasoning.push("4K超清");
    } else if (totalPixels >= 2048 * 2048) {
      sizeMultiplier = CONFIG.OPTIMIZATION_RULES.SIZE_MULTIPLIER.xlarge.multiplier;
      reasoning.push("2K大圖");
    } else if (totalPixels >= 1536 * 1536) {
      sizeMultiplier = CONFIG.OPTIMIZATION_RULES.SIZE_MULTIPLIER.large.multiplier;
      reasoning.push("1.5K高清");
    } else if (totalPixels >= 1024 * 1024) {
      sizeMultiplier = CONFIG.OPTIMIZATION_RULES.SIZE_MULTIPLIER.medium.multiplier;
      reasoning.push("1K標準");
    } else {
      sizeMultiplier = CONFIG.OPTIMIZATION_RULES.SIZE_MULTIPLIER.small.multiplier;
      reasoning.push("小圖快速");
    }
    
    // 3. 風格調整
    const styleMultiplier = CONFIG.OPTIMIZATION_RULES.STYLE_ADJUSTMENT[style] || 
                           CONFIG.OPTIMIZATION_RULES.STYLE_ADJUSTMENT.default;
    if (styleMultiplier !== 1.0) {
      reasoning.push(`風格: ${style}`);
    }
    
    // 4. 質量模式調整
    const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
    const qualityMultiplier = modeConfig?.steps_multiplier || 1.0;
    if (qualityMultiplier !== 1.0) {
      reasoning.push(`質量: ${qualityMode}`);
    }
    
    // 5. 模型配置加成
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
    const profileBoost = profile?.optimal_steps_boost || 1.0;
    if (profileBoost !== 1.0) {
      reasoning.push(`模型配置加成`);
    }
    
    // 6. 計算最終步數
    let finalSteps = Math.round(
      baseSteps * sizeMultiplier * styleMultiplier * qualityMultiplier * profileBoost
    );
    
    // 7. 限制在合理範圍
    finalSteps = Math.max(modelRule.min, Math.min(finalSteps, modelRule.max));
    
    return {
      steps: finalSteps,
      reasoning: `${model}: ${baseSteps}步 × ${reasoning.join(' × ')} → ${finalSteps}步`,
      source: "optimized",
      factors: {
        base: baseSteps,
        size: sizeMultiplier,
        style: styleMultiplier,
        quality: qualityMultiplier,
        profile: profileBoost
      }
    };
  }
  
  /**
   * 優化引導係數 (Guidance Scale)
   * @param {string} model - 模型ID
   * @param {string} style - 風格
   * @param {string} qualityMode - 質量模式
   * @returns {number} - 引導係數
   */
  static optimizeGuidance(model, style, qualityMode) {
    // 基礎引導係數
    let guidance = 7.5;
    
    // 質量模式調整
    const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
    if (modeConfig?.guidance_multiplier) {
      guidance *= modeConfig.guidance_multiplier;
    }
    
    // 模型配置調整
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
    if (profile?.guidance_boost) {
      guidance *= profile.guidance_boost;
    }
    
    // 風格調整
    if (style === 'photorealistic' || style === 'cinematic') {
      guidance *= 1.1;
    } else if (style === 'sketch' || style === 'watercolor') {
      guidance *= 0.9;
    }
    
    // 限制在合理範圍 (3-15)
    return Math.max(3, Math.min(guidance, 15));
  }
  
  /**
   * 計算最優步數（新方法，向後兼容）
   * @deprecated 使用 optimizeSteps 代替
   */
  static calculateOptimalSteps(model, width, height, style, qualityMode) {
    return this.optimizeSteps(model, width, height, style, qualityMode, null).steps;
  }
}

/**
 * 風格處理器
 * 應用藝術風格預設
 */
class StyleProcessor {
  /**
   * 應用風格
   * @param {string} prompt - 原始提示詞
   * @param {string} style - 風格ID
   * @param {string} negativePrompt - 負面提示詞
   * @returns {Object} - { enhancedPrompt: string, enhancedNegative: string }
   */
  static applyStyle(prompt, style, negativePrompt) {
    // 無風格或不存在的風格
    if (!style || style === 'none' || !CONFIG.STYLE_PRESETS[style]) {
      return { 
        enhancedPrompt: prompt, 
        enhancedNegative: negativePrompt 
      };
    }
    
    const styleConfig = CONFIG.STYLE_PRESETS[style];
    
    // 1. 增強正面提示詞
    let enhancedPrompt = prompt;
    if (styleConfig.prompt) {
      // 避免重複添加
      const lowerPrompt = prompt.toLowerCase();
      const lowerStylePrompt = styleConfig.prompt.toLowerCase();
      
      if (!lowerPrompt.includes(lowerStylePrompt)) {
        enhancedPrompt = prompt + ", " + styleConfig.prompt;
      }
    }
    
    // 2. 增強負面提示詞
    let enhancedNegative = negativePrompt || "";
    if (styleConfig.negative) {
      const lowerNegative = enhancedNegative.toLowerCase();
      const lowerStyleNegative = styleConfig.negative.toLowerCase();
      
      if (!lowerNegative.includes(lowerStyleNegative)) {
        enhancedNegative = enhancedNegative ? 
          (enhancedNegative + ", " + styleConfig.negative) : 
          styleConfig.negative;
      }
    }
    
    return { 
      enhancedPrompt, 
      enhancedNegative,
      styleName: styleConfig.name,
      styleApplied: true
    };
  }
  
  /**
   * 獲取風格列表
   * @returns {Array} - 風格列表
   */
  static getStylesList() {
    return Object.entries(CONFIG.STYLE_PRESETS).map(([key, config]) => ({
      id: key,
      name: config.name,
      prompt: config.prompt,
      negative: config.negative
    }));
  }
}

// ==================== 圖像生成層 ====================

/**
 * Pollinations.ai 提供商
 * 處理圖像生成的核心邏輯
 */
class PollinationsProvider {
  constructor(config, env = null) {
    this.name = config.name;
    this.config = config;
    this.env = env;
  }
  
  /**
   * 生成圖像（核心方法）
   * @param {string} prompt - 提示詞
   * @param {Object} options - 生成選項
   * @param {Logger} logger - 日誌記錄器
   * @returns {Promise<Object>} - 生成結果
   */
  async generate(prompt, options, logger) {
    const startTime = Date.now();
    
    // ============ 階段 1: 參數解析 ============
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
    
    logger.add("參數解析", { model, width, height, seed, style, qualityMode });
    
    // ============ 階段 2: 模型驗證 ============
    const modelConfig = this.config.models.find(m => m.id === model);
    if (!modelConfig) {
      throw new Error(`模型 ${model} 不存在`);
    }
    
    logger.add("模型配置", { 
      name: modelConfig.name, 
      category: modelConfig.category,
      confirmed: modelConfig.confirmed,
      max_size: modelConfig.max_size
    });
    
    // ============ 階段 3: 參考圖驗證 ============
    const maxRefImages = modelConfig.max_reference_images || 0;
    let validReferenceImages = [];
    let generationMode = "文生圖";
    
    if (referenceImages && referenceImages.length > 0) {
      if (!modelConfig.supports_reference_images) {
        logger.add("⚠️ 警告", `模型 ${model} 不支持參考圖，已忽略`);
      } else if (referenceImages.length > maxRefImages) {
        validReferenceImages = referenceImages.slice(0, maxRefImages);
        logger.add("⚠️ 警告", `參考圖數量超限，僅使用前 ${maxRefImages} 張`);
      } else {
        validReferenceImages = referenceImages;
      }
      
      if (validReferenceImages.length > 0) {
        generationMode = validReferenceImages.length === 1 ? "圖生圖" : "多圖融合";
        logger.add("參考圖", { 
          count: validReferenceImages.length, 
          mode: generationMode,
          urls: validReferenceImages
        });
      }
    }
    
    // ============ 階段 4: 提示詞複雜度分析 ============
    const promptComplexity = PromptAnalyzer.analyzeComplexity(prompt);
    const recommendedQuality = PromptAnalyzer.recommendQualityMode(prompt, model);
    
    logger.add("提示詞分析", { 
      complexity: promptComplexity.toFixed(2), 
      recommended_quality: recommendedQuality 
    });
    
    // ============ 階段 5: HD 優化 ============
    let finalPrompt = prompt;
    let finalNegativePrompt = negativePrompt;
    let finalWidth = width;
    let finalHeight = height;
    let hdOptimization = null;
    
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
      
      logger.add("HD優化", {
        optimized: hdOptimization.optimized,
        quality_mode: qualityMode,
        hd_level: hdOptimization.hdLevel,
        optimizations: hdOptimization.optimizations
      });
    }
    
    // ============ 階段 6: 參數優化 ============
    let finalSteps = steps;
    let finalGuidance = guidance || 7.5;
    
    if (autoOptimize) {
      const stepsOpt = ParameterOptimizer.optimizeSteps(
        model, 
        finalWidth, 
        finalHeight, 
        style, 
        qualityMode, 
        steps
      );
      
      finalSteps = stepsOpt.steps;
      
      if (!guidance) {
        finalGuidance = ParameterOptimizer.optimizeGuidance(model, style, qualityMode);
      }
      
      logger.add("參數優化", {
        steps: finalSteps,
        steps_reasoning: stepsOpt.reasoning,
        guidance: finalGuidance.toFixed(1)
      });
    } else if (!finalSteps) {
      finalSteps = 20;  // 默認步數
    }
    
    // ============ 階段 7: 風格處理 ============
    const styleResult = StyleProcessor.applyStyle(finalPrompt, style, finalNegativePrompt);
    const styledPrompt = styleResult.enhancedPrompt;
    const styledNegative = styleResult.enhancedNegative;
    
    if (styleResult.styleApplied) {
      logger.add("風格應用", { 
        style: style, 
        style_name: styleResult.styleName 
      });
    }
    
    // ============ 階段 8: 中文翻譯 ============
    const translation = await translateToEnglish(styledPrompt, this.env);
    const finalPromptForAPI = translation.text;
    
    if (translation.translated) {
      logger.add("翻譯完成", { 
        model: translation.model,
        original_length: translation.original?.length,
        translated_length: finalPromptForAPI.length
      });
    }
    
    // ============ 階段 9: 構建 API URL ============
    const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
    
    // 組合完整提示詞（負面提示詞格式：[negative: xxx]）
    let fullPrompt = finalPromptForAPI;
    if (styledNegative) {
      fullPrompt += " [negative: " + styledNegative + "]";
    }
    
    const encodedPrompt = encodeURIComponent(fullPrompt);
    let url = `${this.config.endpoint}/prompt/${encodedPrompt}`;
    
    // 構建查詢參數
    const params = new URLSearchParams();
    params.append('model', model);
    params.append('width', finalWidth.toString());
    params.append('height', finalHeight.toString());
    params.append('seed', currentSeed.toString());
    params.append('nologo', nologo ? 'true' : 'false');
    params.append('enhance', enhance ? 'true' : 'false');
    params.append('private', privateMode ? 'true' : 'false');
    
    // 參考圖（多個用逗號分隔）
    if (validReferenceImages.length > 0) {
      params.append('image', validReferenceImages.join(','));
    }
    
    // 僅在非默認值時添加
    if (finalGuidance !== 7.5) {
      params.append('guidance', finalGuidance.toFixed(1));
    }
    if (finalSteps !== 20) {
      params.append('steps', finalSteps.toString());
    }
    
    url += '?' + params.toString();
    
    logger.add("API請求", { 
      url_length: url.length,
      seed: currentSeed,
      final_size: `${finalWidth}x${finalHeight}`
    });
    
    // ============ 階段 10: 發送請求（含回退機制）============
    const modelsToTry = [model];
    
    // 添加回退模型
    if (modelConfig.fallback && modelConfig.fallback.length > 0) {
      modelsToTry.push(...modelConfig.fallback);
      logger.add("回退策略", { models: modelsToTry });
    }
    
    let lastError = null;
    
    for (let modelIndex = 0; modelIndex < modelsToTry.length; modelIndex++) {
      const tryModel = modelsToTry[modelIndex];
      const isFallback = modelIndex > 0;
      
      if (isFallback) {
        // 更新URL中的模型參數
        url = url.replace(/model=[^&]+/, `model=${tryModel}`);
        logger.add("嘗試回退模型", { model: tryModel, attempt: modelIndex + 1 });
      }
      
      // 重試3次
      for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
        try {
          const response = await fetchWithTimeout(url, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'image/*,*/*',
              'Referer': 'https://pollinations.ai/',
              'Origin': 'https://pollinations.ai'
            }
          }, CONFIG.FETCH_TIMEOUT);
          
          // 檢查響應
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.startsWith('image/')) {
              const duration = Date.now() - startTime;
              
              logger.add("✅ 生成成功", { 
                model: tryModel,
                duration_ms: duration,
                is_fallback: isFallback,
                retry_count: retry
              });
              
              return {
                url: response.url,
                provider: this.name,
                model: tryModel,
                seed: currentSeed,
                width: finalWidth,
                height: finalHeight,
                is_4k: finalWidth >= 4096 || finalHeight >= 4096,
                quality_mode: qualityMode,
                style: style,
                style_name: styleResult.styleName || "無",
                auto_translated: translation.translated,
                translation_model: translation.model,
                prompt_complexity: promptComplexity.toFixed(2),
                reference_images: validReferenceImages,
                reference_images_count: validReferenceImages.length,
                generation_mode: generationMode,
                steps: finalSteps,
                guidance: finalGuidance,
                hd_optimizations: hdOptimization?.optimizations || [],
                generation_time_ms: duration,
                cost: "FREE",
                is_fallback: isFallback,
                debug_logs: logger.get()
              };
            } else {
              lastError = `Invalid content type: ${contentType}`;
              logger.add("⚠️ 內容類型錯誤", { contentType });
            }
          } else {
            lastError = `HTTP ${response.status}: ${response.statusText}`;
            logger.add("⚠️ HTTP錯誤", { status: response.status, statusText: response.statusText });
          }
          
        } catch (error) {
          lastError = error.message;
          logger.add("⚠️ 請求失敗", { 
            error: error.message, 
            retry: retry + 1,
            model: tryModel
          });
          
          // 等待後重試
          if (retry < CONFIG.MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
          }
        }
      }
    }
    
    // 所有模型和重試都失敗
    throw new Error(`圖像生成失敗: ${lastError}\n\n調試日誌:\n${JSON.stringify(logger.get(), null, 2)}`);
  }
}

/**
 * 多提供商路由器
 * 管理不同提供商，支持批量生成
 */
class MultiProviderRouter {
  constructor(apiKeys = {}, env = null) {
    this.providers = {};
    this.env = env;
    
    // 初始化所有啟用的提供商
    for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
      if (config.enabled) {
        if (key === 'pollinations') {
          this.providers[key] = new PollinationsProvider(config, env);
        }
        // 未來可在此添加其他提供商
      }
    }
  }
  
  /**
   * 獲取提供商實例
   * @param {string} name - 提供商名稱
   * @returns {Object} - { name: string, instance: Provider }
   */
  getProvider(name = null) {
    if (!name) {
      // 使用默認提供商
      name = CONFIG.DEFAULT_PROVIDER;
    }
    
    const provider = this.providers[name];
    if (!provider) {
      throw new Error(`提供商 ${name} 不存在或未啟用`);
    }
    
    return { name, instance: provider };
  }
  
  /**
   * 生成圖像（支持批量）
   * @param {string} prompt - 提示詞
   * @param {Object} options - 生成選項
   * @param {Logger} logger - 日誌記錄器
   * @returns {Promise<Array>} - 生成結果數組
   */
  async generate(prompt, options, logger) {
    const { provider: requestedProvider = null, numOutputs = 1 } = options;
    
    // 選擇提供商
    const { name: providerName, instance: provider } = this.getProvider(requestedProvider);
    logger.add("選擇提供商", { provider: providerName, num_outputs: numOutputs });
    
    // 批量生成（Seed自動遞增）
    const results = [];
    for (let i = 0; i < numOutputs; i++) {
      const imageLogger = new Logger();
      imageLogger.add("開始生成", { index: i + 1, total: numOutputs });
      
      // 複製選項，處理 Seed
      const currentOptions = { 
        ...options,
        seed: options.seed === -1 ? -1 : (options.seed + i)
      };
      
      try {
        const result = await provider.generate(prompt, currentOptions, imageLogger);
        results.push(result);
        
        logger.add(`圖片 ${i + 1} 完成`, { 
          seed: result.seed,
          url_length: result.url.length
        });
      } catch (error) {
        logger.add(`圖片 ${i + 1} 失敗`, { error: error.message });
        
        // 批量生成時，一個失敗不影響其他
        results.push({
          error: error.message,
          index: i + 1,
          failed: true
        });
      }
    }
    
    return results;
  }
  
  /**
   * 獲取提供商列表
   * @returns {Array} - 提供商信息數組
   */
  getProvidersList() {
    return Object.entries(CONFIG.PROVIDERS)
      .filter(([_, config]) => config.enabled)
      .map(([key, config]) => ({
        id: key,
        name: config.name,
        description: config.description,
        type: config.type,
        default: config.default || false,
        features: config.features,
        models_count: config.models.length
      }));
  }
}

/**
 * 帶超時的 fetch
 * @param {string} url - 請求URL
 * @param {Object} options - fetch選項
 * @param {number} timeout - 超時時間（毫秒）
 * @returns {Promise<Response>} - 響應對象
 */
async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`請求超時 (${timeout}ms)`);
    }
    throw error;
  }
}
// ==================== API 端點處理器 ====================

/**
 * 處理圖像生成請求
 * POST /v1/images/generations
 */
async function handleImageGenerations(request, env, ctx) {
  const logger = new Logger();
  const startTime = Date.now();
  
  try {
    // 1. 解析請求體
    const body = await request.json();
    logger.add("收到請求", { 
      has_prompt: !!body.prompt,
      model: body.model,
      size: body.size || `${body.width}x${body.height}`
    });
    
    // 2. 驗證必填參數
    const prompt = body.prompt;
    if (!prompt || !prompt.trim()) {
      throw new Error("提示詞 (prompt) 為必填項");
    }
    
    if (prompt.length > 2000) {
      throw new Error("提示詞長度不能超過 2000 字符");
    }
    
    // 3. 處理尺寸
    let width = 1024;
    let height = 1024;
    
    if (body.size) {
      // 支持 "1024x1024" 格式
      const sizeParts = body.size.split('x').map(Number);
      if (sizeParts.length === 2 && sizeParts.every(n => !isNaN(n) && n > 0)) {
        [width, height] = sizeParts;
      } else {
        throw new Error("尺寸格式錯誤，應為 'widthxheight' 如 '1024x1024'");
      }
    }
    
    // 寬高可單獨指定，優先級高於 size
    if (body.width !== undefined) width = body.width;
    if (body.height !== undefined) height = body.height;
    
    // 驗證尺寸範圍
    width = Math.min(Math.max(width, 256), 4096);
    height = Math.min(Math.max(height, 256), 4096);
    
    // 4. 處理 Seed
    const seedInput = body.seed !== undefined ? body.seed : -1;
    let seedValue = -1;
    
    if (seedInput !== -1) {
      const parsedSeed = parseInt(seedInput);
      if (isNaN(parsedSeed) || parsedSeed < 0 || parsedSeed > 999999) {
        throw new Error('Seed 必須是 0-999999 之間的整數，或 -1 表示隨機');
      }
      seedValue = parsedSeed;
    }
    
    // 5. 處理參考圖
    let referenceImages = [];
    if (body.reference_images && Array.isArray(body.reference_images)) {
      // 驗證 URL 格式
      referenceImages = body.reference_images.filter(url => {
        try {
          new URL(url);
          return true;
        } catch {
          logger.add("⚠️ 無效的參考圖URL", { url });
          return false;
        }
      });
      
      if (referenceImages.length !== body.reference_images.length) {
        logger.add("⚠️ 部分參考圖URL無效", {
          original: body.reference_images.length,
          valid: referenceImages.length
        });
      }
    }
    
    // 6. 組裝生成選項
    const options = {
      provider: body.provider || null,
      model: body.model || "flux",
      width: width,
      height: height,
      numOutputs: Math.min(Math.max(body.n || 1, 1), 4),  // 限制 1-4 張
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
    
    logger.add("選項配置", options);
    
    // 7. 檢查緩存（僅限固定 seed 單圖無參考圖）
    let cacheKey = null;
    let cachedResult = null;
    
    if (options.seed !== -1 && 
        options.numOutputs === 1 && 
        referenceImages.length === 0 &&
        API_OPTIMIZATION.CACHE.enabled) {
      
      cacheKey = generateCacheKey(prompt, options);
      cachedResult = apiCache.get(cacheKey);
      
      if (cachedResult) {
        logger.add("✅ 緩存命中", { cache_key: cacheKey });
        
        const duration = Date.now() - startTime;
        perfMonitor.recordRequest(true, duration);
        
        return new Response(JSON.stringify({
          created: Math.floor(Date.now() / 1000),
          data: cachedResult,
          cached: true,
          cache_key: cacheKey,
          cache_hit_time_ms: duration
        }), {
          status: 200,
          headers: corsHeaders({
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey
          })
        });
      } else {
        logger.add("緩存未命中", { cache_key: cacheKey });
      }
    }
    
    // 8. 執行生成
    const router = new MultiProviderRouter({}, env);
    const results = await router.generate(prompt, options, logger);
    
    // 9. 過濾失敗的結果
    const successResults = results.filter(r => !r.failed);
    const failedResults = results.filter(r => r.failed);
    
    if (successResults.length === 0) {
      throw new Error("所有圖像生成均失敗");
    }
    
    if (failedResults.length > 0) {
      logger.add("⚠️ 部分生成失敗", {
        success: successResults.length,
        failed: failedResults.length
      });
    }
    
    // 10. 保存緩存
    if (cacheKey && options.seed !== -1 && API_OPTIMIZATION.CACHE.enabled) {
      const cacheData = successResults.map(r => ({
        url: r.url,
        provider: r.provider,
        model: r.model,
        seed: r.seed,
        width: r.width,
        height: r.height,
        is_4k: r.is_4k,
        quality_mode: r.quality_mode,
        style: r.style,
        style_name: r.style_name,
        generation_mode: r.generation_mode,
        cost: r.cost
      }));
      
      apiCache.set(cacheKey, cacheData);
      logger.add("緩存已保存", { cache_key: cacheKey });
    }
    
    // 11. 返回結果
    const duration = Date.now() - startTime;
    perfMonitor.recordRequest(true, duration);
    
    const responseData = {
      created: Math.floor(Date.now() / 1000),
      data: successResults.map(r => ({
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
        style: r.style,
        style_name: r.style_name,
        quality_mode: r.quality_mode,
        prompt_complexity: r.prompt_complexity,
        auto_translated: r.auto_translated,
        steps: r.steps,
        guidance: r.guidance,
        hd_optimizations: r.hd_optimizations || [],
        cost: r.cost
      })),
      cached: false,
      generation_time_ms: duration,
      success_count: successResults.length,
      failed_count: failedResults.length
    };
    
    // 添加失敗信息（如果有）
    if (failedResults.length > 0) {
      responseData.partial_failure = true;
      responseData.failures = failedResults.map(r => ({
        index: r.index,
        error: r.error
      }));
    }
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: corsHeaders({
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Generation-Time': duration + 'ms'
      })
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    perfMonitor.recordRequest(false, duration, error.message);
    
    logger.add("❌ 請求失敗", { error: error.message, stack: error.stack });
    
    return new Response(JSON.stringify({
      error: {
        message: error.message,
        type: 'generation_error',
        code: 'GENERATION_FAILED'
      },
      debug_logs: logger.get(),
      generation_time_ms: duration
    }), {
      status: 500,
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
  }
}

/**
 * 處理 ChatGPT 兼容請求
 * POST /v1/chat/completions
 */
async function handleChatCompletions(request, env, ctx) {
  const logger = new Logger();
  
  try {
    const body = await request.json();
    const messages = body.messages;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("messages 為必填項且必須是非空數組");
    }
    
    // 提取最後一條用戶消息
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) {
      throw new Error("未找到用戶消息");
    }
    
    const lastUserMessage = userMessages[userMessages.length - 1];
    const prompt = lastUserMessage.content;
    
    if (!prompt || !prompt.trim()) {
      throw new Error("用戶消息內容不能為空");
    }
    
    logger.add("ChatGPT請求", { prompt_length: prompt.length });
    
    // 使用默認參數生成
    const options = {
      model: body.model || "flux",
      width: 1024,
      height: 1024,
      numOutputs: 1,
      seed: -1,
      style: "none",
      autoOptimize: true,
      autoHD: true,
      qualityMode: "standard"
    };
    
    const router = new MultiProviderRouter({}, env);
    const results = await router.generate(prompt, options, logger);
    
    if (results.length === 0 || results[0].failed) {
      throw new Error("圖像生成失敗");
    }
    
    const result = results[0];
    const imageUrl = result.url;
    
    // 返回 OpenAI Chat 格式
    return new Response(JSON.stringify({
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: result.model,
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: `![Generated Image](${imageUrl})\n\n✅ 圖像生成成功！\n\n**模型**: ${result.model}\n**尺寸**: ${result.width}x${result.height}\n**Seed**: ${result.seed}\n**風格**: ${result.style_name}`
        },
        finish_reason: "stop"
      }],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    }), {
      status: 200,
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
    
  } catch (error) {
    logger.add("❌ ChatGPT請求失敗", { error: error.message });
    
    return new Response(JSON.stringify({
      error: {
        message: error.message,
        type: 'chat_completion_error',
        code: 'CHAT_ERROR'
      }
    }), {
      status: 500,
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
  }
}

/**
 * 獲取模型列表
 * GET /v1/models
 */
function handleModelsRequest() {
  const allModels = [];
  
  for (const [providerKey, providerConfig] of Object.entries(CONFIG.PROVIDERS)) {
    if (!providerConfig.enabled) continue;
    
    for (const model of providerConfig.models) {
      allModels.push({
        id: model.id,
        name: model.name,
        category: model.category,
        description: model.description,
        confirmed: model.confirmed,
        experimental: model.experimental || false,
        max_size: model.max_size,
        supports_reference_images: model.supports_reference_images || false,
        max_reference_images: model.max_reference_images || 0,
        ultra_hd: model.ultra_hd || false,
        fallback: model.fallback || [],
        provider: providerKey
      });
    }
  }
  
  return new Response(JSON.stringify({
    object: 'list',
    data: allModels,
    total: allModels.length
  }), {
    status: 200,
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

/**
 * 獲取提供商列表
 * GET /v1/providers
 */
function handleProvidersRequest() {
  const router = new MultiProviderRouter();
  const providers = router.getProvidersList();
  
  return new Response(JSON.stringify({
    object: 'list',
    data: providers,
    total: providers.length
  }), {
    status: 200,
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

/**
 * 獲取風格列表
 * GET /v1/styles
 */
function handleStylesRequest() {
  const styles = StyleProcessor.getStylesList();
  
  return new Response(JSON.stringify({
    object: 'list',
    data: styles,
    total: styles.length
  }), {
    status: 200,
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

/**
 * 獲取尺寸預設列表
 * GET /v1/sizes
 */
function handleSizesRequest() {
  const sizes = Object.entries(CONFIG.PRESET_SIZES).map(([key, config]) => ({
    id: key,
    name: config.name,
    width: config.width,
    height: config.height,
    exclusive: config.exclusive || null
  }));
  
  return new Response(JSON.stringify({
    object: 'list',
    data: sizes,
    total: sizes.length
  }), {
    status: 200,
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

/**
 * 健康檢查
 * GET /health
 */
function handleHealthRequest(env) {
  const health = {
    status: 'ok',
    version: CONFIG.PROJECT_VERSION,
    timestamp: new Date().toISOString(),
    workers_ai: !!env.AI,
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
  };
  
  return new Response(JSON.stringify(health), {
    status: 200,
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

/**
 * 性能統計
 * GET /stats
 */
function handleStatsRequest() {
  const stats = {
    performance: perfMonitor.getStats(),
    cache: {
      size: apiCache.cache.size,
      max_size: API_OPTIMIZATION.CACHE.max_size,
      strategy: API_OPTIMIZATION.CACHE.strategy
    },
    rate_limit: {
      active_monitoring: rateLimiter.requests.size,
      blacklisted: rateLimiter.blacklist.size,
      limits: {
        per_minute: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute,
        per_hour: API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour
      }
    }
  };
  
  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

/**
 * CORS 頭部生成器
 * @param {Object} additional - 額外頭部
 * @returns {Headers} - Headers 對象
 */
function corsHeaders(additional = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    ...additional
  };
}
// ==================== 主入口 ====================

/**
 * Cloudflare Workers 主入口
 * 處理所有HTTP請求
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const startTime = Date.now();
    const clientIP = getClientIP(request);
    
    // 1. OPTIONS 預檢請求（CORS）
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }
    
    // 2. 速率限制檢查（僅 API 路由）
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
            'Retry-After': (rateLimitResult.retryAfter || 60).toString(),
            'X-RateLimit-Limit-Minute': API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute.toString(),
            'X-RateLimit-Limit-Hour': API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour.toString()
          })
        });
      }
      
      // 保存速率限制信息到 context
      ctx.rateLimitHeaders = {
        'X-RateLimit-Limit-Minute': API_OPTIMIZATION.RATE_LIMIT.max_requests_per_minute.toString(),
        'X-RateLimit-Limit-Hour': API_OPTIMIZATION.RATE_LIMIT.max_requests_per_hour.toString(),
        'X-RateLimit-Remaining-Minute': (rateLimitResult.remaining?.perMinute || 0).toString(),
        'X-RateLimit-Remaining-Hour': (rateLimitResult.remaining?.perHour || 0).toString()
      };
    }
    
    // 3. 路由分發
    try {
      let response;
      
      // Web UI
      if (url.pathname === '/' || url.pathname === '/index.html') {
        response = handleUI(request);
      }
      // ChatGPT 兼容端點
      else if (url.pathname === '/v1/chat/completions' && request.method === 'POST') {
        response = await handleChatCompletions(request, env, ctx);
      }
      // 圖像生成主端點
      else if (url.pathname === '/v1/images/generations' && request.method === 'POST') {
        response = await handleImageGenerations(request, env, ctx);
      }
      // 模型列表
      else if (url.pathname === '/v1/models' && request.method === 'GET') {
        response = handleModelsRequest();
      }
      // 提供商列表
      else if (url.pathname === '/v1/providers' && request.method === 'GET') {
        response = handleProvidersRequest();
      }
      // 風格列表
      else if (url.pathname === '/v1/styles' && request.method === 'GET') {
        response = handleStylesRequest();
      }
      // 尺寸列表
      else if (url.pathname === '/v1/sizes' && request.method === 'GET') {
        response = handleSizesRequest();
      }
      // 健康檢查
      else if (url.pathname === '/health' && request.method === 'GET') {
        response = handleHealthRequest(env);
      }
      // 性能統計
      else if (url.pathname === '/stats' && request.method === 'GET') {
        response = handleStatsRequest();
      }
      // 404 - 默認返回項目信息
      else {
        response = new Response(JSON.stringify({
          project: CONFIG.PROJECT_NAME,
          version: CONFIG.PROJECT_VERSION,
          status: 'ok',
          endpoints: {
            ui: '/',
            generate: 'POST /v1/images/generations',
            chat: 'POST /v1/chat/completions',
            models: 'GET /v1/models',
            providers: 'GET /v1/providers',
            styles: 'GET /v1/styles',
            sizes: 'GET /v1/sizes',
            health: 'GET /health',
            stats: 'GET /stats'
          },
          docs: 'https://github.com/kinai9661/Flux-AI-Pro',
          features: [
            '17 AI 模型',
            '39 種藝術風格',
            '33 種尺寸預設',
            '4K 超清支持',
            'Seed 控制',
            '批量生成（1-4張）',
            '圖生圖 + 多圖融合',
            '中文自動翻譯',
            'HD 智能優化',
            '本地歷史記錄'
          ]
        }), {
          status: 200,
          headers: corsHeaders({ 'Content-Type': 'application/json' })
        });
      }
      
      // 4. 添加響應頭 + 性能監控
      const duration = Date.now() - startTime;
      perfMonitor.recordRequest(true, duration);
      
      const headers = new Headers(response.headers);
      headers.set('X-Response-Time', duration + 'ms');
      headers.set('X-Worker-Version', CONFIG.PROJECT_VERSION);
      headers.set('X-Client-IP', clientIP);
      
      // 添加速率限制頭部
      if (ctx.rateLimitHeaders) {
        Object.entries(ctx.rateLimitHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
      }
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
    } catch (error) {
      // 5. 全局錯誤處理
      const duration = Date.now() - startTime;
      perfMonitor.recordRequest(false, duration, error.message);
      
      console.error('Worker Error:', error);
      
      return new Response(JSON.stringify({
        error: {
          message: error.message,
          type: 'worker_error',
          code: 'INTERNAL_ERROR',
          stack: error.stack
        },
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: corsHeaders({
          'Content-Type': 'application/json',
          'X-Response-Time': (Date.now() - startTime) + 'ms'
        })
      });
    }
  }
};

// ==================== 結束 ====================
console.log(\`✅ \${CONFIG.PROJECT_NAME} v\${CONFIG.PROJECT_VERSION} loaded successfully!\`);
