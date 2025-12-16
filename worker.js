// worker.js - Pollinations AI Pro
// 版本: 1.0.0
// 作者: kinai9661

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS 處理
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // API 路由映射
    const routes = {
      '/api/generate': () => handleGenerate(request, env),
      '/api/img2img': () => handleImg2Img(request, env),
      '/api/inpaint': () => handleInpaint(request, env),
      '/api/batch': () => handleBatch(request, env),
      '/api/history': () => handleHistory(request, env),
      '/api/history/delete': () => handleDeleteHistory(request, env),
      '/api/optimize-prompt': () => handleOptimizePrompt(request, env),
      '/api/styles': () => handleGetStyles(request, env)
    };
    
    if (routes[url.pathname]) {
      const response = await routes[url.pathname]();
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
    
    // 返回前端 HTML
    return new Response(getHTML(), {
      headers: { 
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};
// 文生圖處理
async function handleGenerate(request, env) {
  try {
    const { prompt, negativePrompt, model, width, height, seed, style } = await request.json();
    
    if (!prompt || prompt.trim() === '') {
      return jsonResponse({ success: false, error: 'Prompt is required' }, 400);
    }
    
    // 應用風格預設
    let finalPrompt = prompt;
    if (style && style !== 'none') {
      const styles = getStylePresets();
      const selectedStyle = styles.find(s => s.id === style);
      if (selectedStyle) {
        finalPrompt = `${prompt}, ${selectedStyle.suffix}`;
      }
    }
    
    // 構建 Pollinations API 參數
    const params = new URLSearchParams({
      width: width || 1024,
      height: height || 1024,
      seed: seed || Math.floor(Math.random() * 999999999),
      model: model || 'flux',
      nologo: 'true',
      enhance: 'true',
      safe: 'true'
    });
    
    if (negativePrompt && negativePrompt.trim() !== '') {
      params.append('negative', negativePrompt);
    }
    
    // 添加 API Token (如果設置)
    if (env.POLLINATIONS_TOKEN) {
      params.append('token', env.POLLINATIONS_TOKEN);
    }
    
    // 調用 Pollinations API
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?${params}`;
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Pollinations-AI-Pro/1.0'
      }
    });
    
    if (!imageResponse.ok) {
      throw new Error(`API request failed: ${imageResponse.status}`);
    }
    
    const imageBlob = await imageResponse.arrayBuffer();
    
    // 創建記錄
    const record = {
      id: crypto.randomUUID(),
      type: 'text2img',
      prompt: finalPrompt,
      originalPrompt: prompt,
      negativePrompt: negativePrompt || '',
      model,
      width: parseInt(params.get('width')),
      height: parseInt(params.get('height')),
      seed: params.get('seed'),
      style: style || 'none',
      timestamp: Date.now(),
      url: imageUrl
    };
    
    // 保存到歷史記錄
    await saveToHistory(env, record);
    
    return jsonResponse({
      success: true,
      data: {
        ...record,
        image: arrayBufferToBase64(imageBlob)
      }
    });
  } catch (error) {
    console.error('Generate error:', error);
    return jsonResponse({ 
      success: false, 
      error: error.message || 'Image generation failed' 
    }, 500);
  }
}
// 圖生圖處理
async function handleImg2Img(request, env) {
  try {
    const { prompt, referenceImage, strength, model, width, height, seed } = await request.json();
    
    if (!prompt) {
      return jsonResponse({ success: false, error: 'Prompt is required' }, 400);
    }
    
    const params = new URLSearchParams({
      width: width || 1024,
      height: height || 1024,
      seed: seed || Math.floor(Math.random() * 999999999),
      model: model || 'flux',
      strength: Math.max(0, Math.min(1, strength || 0.75)),
      nologo: 'true',
      enhance: 'true'
    });
    
    if (env.POLLINATIONS_TOKEN) {
      params.append('token', env.POLLINATIONS_TOKEN);
    }
    
    // Note: Pollinations 主要通過 URL 處理,實際 img2img 可能需要其他實現
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error('Image generation failed');
    }
    
    const imageBlob = await imageResponse.arrayBuffer();
    
    const record = {
      id: crypto.randomUUID(),
      type: 'img2img',
      prompt,
      model,
      strength: parseFloat(params.get('strength')),
      width: parseInt(params.get('width')),
      height: parseInt(params.get('height')),
      seed: params.get('seed'),
      timestamp: Date.now(),
      url: imageUrl
    };
    
    await saveToHistory(env, record);
    
    return jsonResponse({
      success: true,
      data: {
        ...record,
        image: arrayBufferToBase64(imageBlob)
      }
    });
  } catch (error) {
    console.error('Img2Img error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// 局部重繪處理
async function handleInpaint(request, env) {
  try {
    const { prompt, sourceImage, maskImage, model, width, height } = await request.json();
    
    if (!prompt) {
      return jsonResponse({ success: false, error: 'Prompt is required' }, 400);
    }
    
    const params = new URLSearchParams({
      width: width || 1024,
      height: height || 1024,
      model: model || 'flux',
      nologo: 'true'
    });
    
    if (env.POLLINATIONS_TOKEN) {
      params.append('token', env.POLLINATIONS_TOKEN);
    }
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error('Inpainting failed');
    }
    
    const imageBlob = await imageResponse.arrayBuffer();
    
    const record = {
      id: crypto.randomUUID(),
      type: 'inpaint',
      prompt,
      model,
      width: parseInt(params.get('width')),
      height: parseInt(params.get('height')),
      timestamp: Date.now(),
      url: imageUrl
    };
    
    await saveToHistory(env, record);
    
    return jsonResponse({
      success: true,
      data: {
        ...record,
        image: arrayBufferToBase64(imageBlob)
      }
    });
  } catch (error) {
    console.error('Inpaint error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
// 批次生成處理
async function handleBatch(request, env) {
  try {
    const { prompt, count, model, width, height, baseSeed } = await request.json();
    
    if (!prompt) {
      return jsonResponse({ success: false, error: 'Prompt is required' }, 400);
    }
    
    const batchCount = Math.min(Math.max(1, count || 4), 16); // 限制 1-16 張
    const results = [];
    
    for (let i = 0; i < batchCount; i++) {
      const seed = baseSeed ? parseInt(baseSeed) + i : Math.floor(Math.random() * 999999999);
      
      const params = new URLSearchParams({
        width: width || 1024,
        height: height || 1024,
        seed,
        model: model || 'flux',
        nologo: 'true',
        enhance: 'true'
      });
      
      if (env.POLLINATIONS_TOKEN) {
        params.append('token', env.POLLINATIONS_TOKEN);
      }
      
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
      
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) continue;
        
        const imageBlob = await imageResponse.arrayBuffer();
        
        const record = {
          id: crypto.randomUUID(),
          type: 'batch',
          prompt,
          model,
          width: parseInt(params.get('width')),
          height: parseInt(params.get('height')),
          seed,
          batchIndex: i + 1,
          timestamp: Date.now(),
          url: imageUrl,
          image: arrayBufferToBase64(imageBlob)
        };
        
        results.push(record);
        await saveToHistory(env, record);
      } catch (err) {
        console.error(`Batch item ${i} failed:`, err);
      }
    }
    
    if (results.length === 0) {
      throw new Error('All batch generations failed');
    }
    
    return jsonResponse({ success: true, data: results });
  } catch (error) {
    console.error('Batch error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// 提示詞優化 (使用 Pollinations Text API)
async function handleOptimizePrompt(request, env) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt || prompt.trim() === '') {
      return jsonResponse({ success: false, error: 'Prompt is required' }, 400);
    }
    
    const optimizationPrompt = `Optimize this image generation prompt for better AI art results. Return ONLY the improved prompt without explanations: "${prompt}"`;
    const encodedPrompt = encodeURIComponent(optimizationPrompt);
    
    const response = await fetch(
      `https://text.pollinations.ai/${encodedPrompt}?model=openai`,
      {
        headers: { 'User-Agent': 'Pollinations-AI-Pro/1.0' }
      }
    );
    
    if (!response.ok) {
      throw new Error('Optimization failed');
    }
    
    const optimizedPrompt = await response.text();
    
    return jsonResponse({
      success: true,
      data: { 
        originalPrompt: prompt,
        optimizedPrompt: optimizedPrompt.trim().replace(/^["']|["']$/g, '')
      }
    });
  } catch (error) {
    console.error('Optimize error:', error);
    return jsonResponse({ 
      success: false, 
      error: 'Prompt optimization failed' 
    }, 500);
  }
}
// 獲取風格預設
async function handleGetStyles(request, env) {
  return jsonResponse({
    success: true,
    data: getStylePresets()
  });
}

// 獲取歷史記錄
async function handleHistory(request, env) {
  try {
    const historyJson = await env.IMAGE_HISTORY?.get('records') || '[]';
    const history = JSON.parse(historyJson);
    
    // 按時間倒序排列
    history.sort((a, b) => b.timestamp - a.timestamp);
    
    return jsonResponse(history);
  } catch (error) {
    console.error('History fetch error:', error);
    return jsonResponse([]);
  }
}

// 刪除歷史記錄
async function handleDeleteHistory(request, env) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return jsonResponse({ success: false, error: 'ID is required' }, 400);
    }
    
    const historyJson = await env.IMAGE_HISTORY?.get('records') || '[]';
    const history = JSON.parse(historyJson);
    const filtered = history.filter(item => item.id !== id);
    
    await env.IMAGE_HISTORY?.put('records', JSON.stringify(filtered));
    
    return jsonResponse({ 
      success: true, 
      message: 'Record deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
// 保存到歷史記錄
async function saveToHistory(env, record) {
  if (!env.IMAGE_HISTORY) {
    console.warn('KV namespace not configured');
    return;
  }
  
  try {
    const historyJson = await env.IMAGE_HISTORY.get('records') || '[]';
    const history = JSON.parse(historyJson);
    
    // 添加新記錄到開頭
    history.unshift(record);
    
    // 保留最近 100 條記錄
    if (history.length > 100) {
      history.splice(100);
    }
    
    await env.IMAGE_HISTORY.put('records', JSON.stringify(history));
  } catch (error) {
    console.error('Save to history error:', error);
  }
}

// ArrayBuffer 轉 Base64
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, chunk);
  }
  
  return `data:image/png;base64,${btoa(binary)}`;
}

// JSON 響應
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

// 風格預設配置
function getStylePresets() {
  return [
    { id: 'none', name: '無風格', suffix: '' },
    { id: 'anime', name: '動漫風格', suffix: 'anime style, vibrant colors, detailed illustration' },
    { id: 'realistic', name: '寫實攝影', suffix: 'photorealistic, 8k uhd, detailed, professional photography' },
    { id: 'cyberpunk', name: '賽博朋克', suffix: 'cyberpunk style, neon lights, futuristic, dark atmosphere' },
    { id: 'fantasy', name: '奇幻藝術', suffix: 'fantasy art, magical, epic, detailed concept art' },
    { id: 'oil', name: '油畫', suffix: 'oil painting style, classical art, brush strokes' },
    { id: 'watercolor', name: '水彩畫', suffix: 'watercolor painting, soft colors, artistic' },
    { id: '3d', name: '3D 渲染', suffix: '3d render, octane render, high quality, detailed' },
    { id: 'pixel', name: '像素藝術', suffix: 'pixel art style, retro, 8-bit, detailed pixels' },
    { id: 'sketch', name: '素描', suffix: 'pencil sketch, hand-drawn, artistic sketch' },
    { id: 'minimalist', name: '極簡主義', suffix: 'minimalist design, simple, clean, modern' },
    { id: 'vintage', name: '復古風格', suffix: 'vintage style, retro, classic, aged' },
    { id: 'cartoon', name: '卡通風格', suffix: 'cartoon style, colorful, fun, illustrated' },
    { id: 'gothic', name: '哥德風格', suffix: 'gothic style, dark, dramatic, Victorian' },
    { id: 'pop', name: '普普藝術', suffix: 'pop art style, bold colors, Andy Warhol style' },
    { id: 'surreal', name: '超現實', suffix: 'surrealism, dreamlike, Salvador Dali style' },
    { id: 'steampunk', name: '蒸汽龐克', suffix: 'steampunk style, Victorian era, mechanical, brass and copper' },
    { id: 'comic', name: '漫畫風格', suffix: 'comic book style, bold lines, halftone dots' },
    { id: 'impressionist', name: '印象派', suffix: 'impressionist painting, Monet style, soft brush strokes' },
    { id: 'neon', name: '霓虹美學', suffix: 'neon aesthetic, glowing, vibrant colors, futuristic' }
  ];
}
// HTML 前端生成函數
function getHTML() {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Studio - 專業圖像生成器</title>
  <meta name="description" content="基於 Pollinations AI 的專業級圖像生成平台,支持文生圖、圖生圖、局部重繪和批次生成">
  <meta name="keywords" content="AI,圖像生成,Pollinations,FLUX,Stable Diffusion">
  <style>
    /* CSS 變量定義 */
    :root {
      --bg-primary: #0a0e27;
      --bg-secondary: #1a1f3a;
      --bg-glass: rgba(255, 255, 255, 0.05);
      --border-glass: rgba(255, 255, 255, 0.1);
      --text-primary: #ffffff;
      --text-secondary: #a0aec0;
      --accent-primary: #667eea;
      --accent-secondary: #764ba2;
      --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    
    /* 亮色主題 */
    [data-theme="light"] {
      --bg-primary: #f7fafc;
      --bg-secondary: #ffffff;
      --bg-glass: rgba(255, 255, 255, 0.75);
      --border-glass: rgba(255, 255, 255, 0.3);
      --text-primary: #1a202c;
      --text-secondary: #4a5568;
      --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    }
    
    /* 基礎重置 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
      color: var(--text-primary);
      min-height: 100vh;
      transition: background 0.3s ease;
    }
    
    /* 毛玻璃效果 */
    .glass {
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid var(--border-glass);
      border-radius: 16px;
      box-shadow: var(--shadow-glass);
    }
    
    /* 導航欄 */
    .navbar {
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      backdrop-filter: blur(20px);
      background: rgba(10, 14, 39, 0.8);
      border-bottom: 1px solid var(--border-glass);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .nav-actions {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    
    .theme-toggle {
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      backdrop-filter: blur(10px);
      font-size: 14px;
    }
    
    .theme-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    /* 主容器 */
    .container {
      display: grid;
      grid-template-columns: 80px 400px 1fr 350px;
      gap: 20px;
      padding: 20px;
      max-width: 1920px;
      margin: 0 auto;
      height: calc(100vh - 80px);
    }
    
    /* 左側工具欄 */
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .tool-btn {
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
      width: 60px;
      height: 60px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      position: relative;
    }
    
    .tool-btn:hover,
    .tool-btn.active {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      transform: translateX(5px);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }
    
    .tool-btn .tooltip {
      position: absolute;
      left: 75px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    
    .tool-btn:hover .tooltip {
      opacity: 1;
    }
    
    /* 控制面板 */
    .control-panel {
      overflow-y: auto;
      padding: 25px;
    }
    
    .panel-section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }
    
    .input-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    input,
    select,
    textarea {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 14px;
      transition: all 0.3s;
      font-family: inherit;
    }
    
    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: var(--accent-primary);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    textarea {
      resize: vertical;
      min-height: 100px;
      line-height: 1.6;
    }
    
    /* 按鈕樣式 */
    .btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    
    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    
    .btn:hover::before {
      left: 100%;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .btn-secondary {
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
    }
    
    .btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    /* 參數網格 */
    .param-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    /* 範圍滑桿 */
    input[type="range"] {
      padding: 0;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: var(--accent-primary);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      background: var(--accent-primary);
      border-radius: 50%;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }
    
    .range-value {
      float: right;
      font-size: 12px;
      color: var(--accent-primary);
      font-weight: 600;
    }
  </style>
</head>`;
}
// 接續 getHTML() 函數內的 <style> 標籤
function getHTMLStyles2() {
  return `
    /* 中央預覽區 */
    .preview-area {
      display: flex;
      flex-direction: column;
      gap: 15px;
      overflow: hidden;
    }
    
    .preview-container {
      flex: 1;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      min-height: 400px;
    }
    
    .preview-container img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      object-fit: contain;
    }
    
    .preview-placeholder {
      text-align: center;
      color: var(--text-secondary);
      padding: 40px;
    }
    
    .preview-placeholder svg {
      width: 120px;
      height: 120px;
      opacity: 0.3;
      margin-bottom: 20px;
    }
    
    /* Canvas 編輯器 */
    #inpaintCanvas {
      max-width: 100%;
      max-height: 100%;
      border-radius: 12px;
      cursor: crosshair;
      display: none;
    }
    
    .canvas-controls {
      position: absolute;
      top: 20px;
      left: 20px;
      display: none;
      gap: 10px;
    }
    
    .canvas-btn {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s;
    }
    
    .canvas-btn:hover {
      background: rgba(102, 126, 234, 0.8);
    }
    
    /* 操作按鈕組 */
    .action-bar {
      display: flex;
      gap: 10px;
    }
    
    .action-btn {
      flex: 1;
      padding: 12px;
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 13px;
      font-weight: 500;
    }
    
    .action-btn:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: var(--accent-primary);
    }
    
    /* 右側參數面板 */
    .params-panel {
      overflow-y: auto;
      padding: 25px;
    }
    
    /* 風格預設網格 */
    .style-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .style-card {
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 2px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      font-size: 12px;
    }
    
    .style-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--accent-primary);
    }
    
    .style-card.active {
      background: rgba(102, 126, 234, 0.2);
      border-color: var(--accent-primary);
    }
    
    /* 歷史記錄區域 */
    .history-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--border-glass);
    }
    
    .history-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .history-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s;
    }
    
    .history-item:hover {
      transform: scale(1.05);
      z-index: 10;
    }
    
    .history-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .history-item .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      padding: 10px;
      transform: translateY(100%);
      transition: transform 0.3s;
    }
    
    .history-item:hover .overlay {
      transform: translateY(0);
    }
    
    .history-item .overlay p {
      font-size: 11px;
      color: white;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .delete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 59, 48, 0.9);
      color: white;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .history-item:hover .delete-btn {
      opacity: 1;
    }
    
    /* 載入動畫 */
    .loading {
      text-align: center;
      padding: 40px;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* 狀態訊息 */
    .status {
      margin-top: 15px;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    
    .status.success {
      background: rgba(52, 211, 153, 0.1);
      border: 1px solid rgba(52, 211, 153, 0.3);
      color: #34d399;
    }
    
    .status.error {
      background: rgba(248, 113, 113, 0.1);
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: #f87171;
    }
    
    .status.info {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #3b82f6;
    }
    
    /* 批次生成網格 */
    .batch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    
    .batch-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.03);
      padding: 10px;
    }
    
    .batch-item img {
      width: 100%;
      border-radius: 8px;
    }
    
    .batch-item .seed-label {
      text-align: center;
      margin-top: 8px;
      font-size: 11px;
      color: var(--text-secondary);
    }
    
    /* 捲軸樣式 */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `;
}
// 接續 CSS 樣式
function getHTMLStyles3() {
  return `
    /* 響應式設計 */
    @media (max-width: 1400px) {
      .container {
        grid-template-columns: 400px 1fr 300px;
      }
      .toolbar {
        display: none;
      }
    }
    
    @media (max-width: 1024px) {
      .container {
        grid-template-columns: 1fr;
        height: auto;
      }
      .params-panel {
        display: none;
      }
      .control-panel {
        max-height: none;
      }
    }
    
    @media (max-width: 768px) {
      .navbar {
        padding: 15px 20px;
      }
      .logo {
        font-size: 20px;
      }
      .nav-actions {
        gap: 10px;
      }
      .theme-toggle {
        padding: 8px 12px;
        font-size: 12px;
      }
      .container {
        padding: 15px;
        gap: 15px;
      }
      .param-grid {
        grid-template-columns: 1fr;
      }
      .btn-group {
        grid-template-columns: 1fr;
      }
      .action-bar {
        flex-direction: column;
      }
    }
  </style>
</head>

<body data-theme="dark">
  <!-- 導航欄 -->
  <div class="navbar">
    <div class="logo">
      <span>🎨</span>
      <span>AI Studio</span>
    </div>
    <div class="nav-actions">
      <button class="theme-toggle" onclick="toggleTheme()">
        <span id="themeIcon">🌙</span> 主題
      </button>
      <button class="theme-toggle" onclick="loadHistory()">
        📚 歷史
      </button>
    </div>
  </div>

  <!-- 主容器 -->
  <div class="container">
    <!-- 左側工具欄 -->
    <div class="toolbar">
      <button class="tool-btn active" data-tool="text2img" onclick="switchTool('text2img')">
        ✨
        <span class="tooltip">文生圖</span>
      </button>
      <button class="tool-btn" data-tool="img2img" onclick="switchTool('img2img')">
        🖼️
        <span class="tooltip">圖生圖</span>
      </button>
      <button class="tool-btn" data-tool="inpaint" onclick="switchTool('inpaint')">
        🎨
        <span class="tooltip">局部重繪</span>
      </button>
      <button class="tool-btn" data-tool="batch" onclick="switchTool('batch')">
        📦
        <span class="tooltip">批次生成</span>
      </button>
    </div>
  `;
}
// 接續 HTML Body
function getHTMLBody2() {
  return `
    <!-- 中央預覽區 -->
    <div class="preview-area">
      <div class="glass preview-container" id="previewContainer">
        <div class="preview-placeholder" id="placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>在左側輸入提示詞並點擊生成</p>
          <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">支持文生圖、圖生圖、局部重繪和批次生成</p>
        </div>
        
        <!-- Canvas for Inpainting -->
        <canvas id="inpaintCanvas"></canvas>
        
        <!-- Canvas 控制按鈕 -->
        <div class="canvas-controls" id="canvasControls">
          <button class="canvas-btn" onclick="clearMask()">🗑️ 清除遮罩</button>
          <button class="canvas-btn" onclick="adjustBrushSize(-5)">➖ 筆刷</button>
          <button class="canvas-btn" onclick="adjustBrushSize(5)">➕ 筆刷</button>
        </div>
      </div>
      
      <!-- 操作按鈕欄 -->
      <div class="action-bar">
        <button class="action-btn" onclick="downloadImage()">💾 下載</button>
        <button class="action-btn" onclick="copyPrompt()">📋 複製提示詞</button>
        <button class="action-btn" onclick="shareImage()">🔗 分享</button>
      </div>
    </div>
  `;
}
// 接續 HTML Body
function getHTMLBody3() {
  return `
    <!-- 右側參數面板 -->
    <div class="glass params-panel">
      <div class="panel-section">
        <div class="section-title">風格預設</div>
        <div class="style-grid" id="styleGrid">
          <!-- 動態載入風格卡片 -->
        </div>
      </div>

      <div class="history-section">
        <div class="section-title">
          最近生成
          <button class="btn-secondary" onclick="loadHistory()" style="float: right; padding: 6px 12px; font-size: 12px; width: auto;">🔄</button>
        </div>
        <div class="history-grid" id="historyGrid">
          <!-- 動態載入歷史記錄 -->
        </div>
      </div>
    </div>
  </div>
  `;
}
// 接續 HTML - JavaScript 部分開始
function getHTMLScript1() {
  return `
  <script>
    // 全局變量
    let currentTool = 'text2img';
    let currentRecord = null;
    let selectedStyle = 'none';
    let referenceImageData = null;
    let canvas, ctx;
    let isDrawing = false;
    let brushSize = 30;

    // 頁面載入時初始化
    window.addEventListener('DOMContentLoaded', () => {
      loadStyles();
      loadHistory();
      initCanvas();
      loadThemePreference();
    });

    // 主題切換
    function toggleTheme() {
      const body = document.body;
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      document.getElementById('themeIcon').textContent = newTheme === 'dark' ? '🌙' : '☀️';
      localStorage.setItem('theme', newTheme);
    }

    function loadThemePreference() {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      document.body.setAttribute('data-theme', savedTheme);
      document.getElementById('themeIcon').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }

    // 工具切換
    function switchTool(tool) {
      currentTool = tool;
      
      // 更新按鈕狀態
      document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tool') === tool);
      });

      // 顯示/隱藏相關面板
      document.getElementById('img2imgSection').style.display = tool === 'img2img' ? 'block' : 'none';
      document.getElementById('batchSection').style.display = tool === 'batch' ? 'block' : 'none';
      
      // Canvas 相關
      const canvas = document.getElementById('inpaintCanvas');
      const controls = document.getElementById('canvasControls');
      const placeholder = document.getElementById('placeholder');
      
      if (tool === 'inpaint') {
        canvas.style.display = 'block';
        controls.style.display = 'flex';
        if (placeholder) placeholder.style.display = 'none';
      } else {
        canvas.style.display = 'none';
        controls.style.display = 'none';
        if (!currentRecord && placeholder) placeholder.style.display = 'flex';
      }
    }

    // 載入風格預設
    async function loadStyles() {
      try {
        const response = await fetch('/api/styles');
        const result = await response.json();
        const grid = document.getElementById('styleGrid');
        
        if (result.success && result.data) {
          grid.innerHTML = result.data.map(style => \`
            <div class="style-card \${style.id === selectedStyle ? 'active' : ''}" 
                 onclick="selectStyle('\${style.id}')">
              \${style.name}
            </div>
          \`).join('');
        }
      } catch (error) {
        console.error('載入風格失敗:', error);
      }
    }

    function selectStyle(styleId) {
      selectedStyle = styleId;
      document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('active');
      });
      event.target.classList.add('active');
    }
  `;
}
// 接續 JavaScript
function getHTMLScript2() {
  return `
    // 主生成函數
    async function generate() {
      const prompt = document.getElementById('prompt').value.trim();
      if (!prompt) {
        showStatus('請輸入提示詞', 'error');
        return;
      }

      const btn = document.getElementById('generateBtn');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = '⏳ 生成中...';
      showStatus('正在生成圖片,請稍候...', 'info');

      try {
        let result;
        
        if (currentTool === 'text2img') {
          result = await generateText2Img();
        } else if (currentTool === 'img2img') {
          result = await generateImg2Img();
        } else if (currentTool === 'inpaint') {
          result = await generateInpaint();
        } else if (currentTool === 'batch') {
          result = await generateBatch();
          if (result.success) {
            displayBatchResults(result.data);
            showStatus(\`✅ 成功生成 \${result.data.length} 張圖片!\`, 'success');
          }
          return;
        }

        if (result && result.success) {
          currentRecord = result.data;
          displayImage(result.data);
          loadHistory();
          showStatus('✅ 生成成功!', 'success');
        } else {
          showStatus('❌ 生成失敗: ' + (result?.error || '未知錯誤'), 'error');
        }
      } catch (error) {
        console.error('生成錯誤:', error);
        showStatus('❌ 生成失敗: ' + error.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }

    // 文生圖
    async function generateText2Img() {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: document.getElementById('prompt').value,
          negativePrompt: document.getElementById('negativePrompt').value,
          model: document.getElementById('model').value,
          width: parseInt(document.getElementById('width').value),
          height: parseInt(document.getElementById('height').value),
          seed: document.getElementById('seed').value || undefined,
          style: selectedStyle
        })
      });
      return response.json();
    }

    // 圖生圖
    async function generateImg2Img() {
      if (!referenceImageData) {
        showStatus('請先上傳參考圖片', 'error');
        throw new Error('No reference image');
      }

      const response = await fetch('/api/img2img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: document.getElementById('prompt').value,
          referenceImage: referenceImageData,
          strength: parseFloat(document.getElementById('strength').value),
          model: document.getElementById('model').value,
          width: parseInt(document.getElementById('width').value),
          height: parseInt(document.getElementById('height').value),
          seed: document.getElementById('seed').value || undefined
        })
      });
      return response.json();
    }

    // 局部重繪
    async function generateInpaint() {
      const maskData = canvas.toDataURL();
      
      const response = await fetch('/api/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: document.getElementById('prompt').value,
          sourceImage: currentRecord?.image,
          maskImage: maskData,
          model: document.getElementById('model').value,
          width: parseInt(document.getElementById('width').value),
          height: parseInt(document.getElementById('height').value)
        })
      });
      return response.json();
    }

    // 批次生成
    async function generateBatch() {
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: document.getElementById('prompt').value,
          count: parseInt(document.getElementById('batchCount').value),
          model: document.getElementById('model').value,
          width: parseInt(document.getElementById('width').value),
          height: parseInt(document.getElementById('height').value),
          baseSeed: document.getElementById('seed').value || undefined
        })
      });
      return response.json();
    }
  `;
}
// 接續 JavaScript
function getHTMLScript3() {
  return `
    // 提示詞優化
    async function optimizePrompt() {
      const prompt = document.getElementById('prompt').value.trim();
      if (!prompt) {
        showStatus('請先輸入提示詞', 'error');
        return;
      }

      showStatus('正在優化提示詞...', 'info');
      try {
        const response = await fetch('/api/optimize-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const result = await response.json();
        
        if (result.success) {
          document.getElementById('prompt').value = result.data.optimizedPrompt;
          showStatus('✅ 提示詞已優化!', 'success');
        } else {
          showStatus('優化失敗', 'error');
        }
      } catch (error) {
        console.error('優化錯誤:', error);
        showStatus('優化失敗', 'error');
      }
    }

    // 顯示單張圖片
    function displayImage(data) {
      const container = document.getElementById('previewContainer');
      const placeholder = document.getElementById('placeholder');
      
      if (placeholder) placeholder.style.display = 'none';
      
      container.innerHTML = \`
        <img src="\${data.image}" alt="\${data.prompt}" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;">
      \`;
    }

    // 顯示批次結果
    function displayBatchResults(results) {
      const container = document.getElementById('previewContainer');
      const placeholder = document.getElementById('placeholder');
      
      if (placeholder) placeholder.style.display = 'none';
      
      container.innerHTML = \`
        <div class="batch-grid">
          \${results.map(item => \`
            <div class="batch-item" onclick='displayImage(\${JSON.stringify(item).replace(/'/g, "&#39;")})'>
              <img src="\${item.image}" alt="Seed: \${item.seed}">
              <div class="seed-label">Seed: \${item.seed}</div>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    // 參考圖片處理
    function handleReferenceImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showStatus('請上傳圖片文件', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        referenceImageData = e.target.result;
        document.getElementById('referencePreview').innerHTML = \`
          <img src="\${e.target.result}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">
          <p style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">已上傳參考圖片</p>
        \`;
        showStatus('✅ 參考圖片已上傳', 'success');
      };
      reader.readAsDataURL(file);
    }
  `;
}
// 接續 JavaScript
function getHTMLScript4() {
  return `
    // Canvas 初始化
    function initCanvas() {
      canvas = document.getElementById('inpaintCanvas');
      if (!canvas) return;
      
      ctx = canvas.getContext('2d');
      canvas.width = 1024;
      canvas.height = 1024;
      
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
      
      // 觸控支持
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
      });
    }

    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }

    function draw(e) {
      if (!isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    function stopDrawing() {
      isDrawing = false;
    }

    function clearMask() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      showStatus('遮罩已清除', 'info');
    }

    function adjustBrushSize(delta) {
      brushSize = Math.max(10, Math.min(100, brushSize + delta));
      showStatus(\`筆刷大小: \${brushSize}px\`, 'info');
    }

    // 載入歷史記錄
    async function loadHistory() {
      try {
        const response = await fetch('/api/history');
        const history = await response.json();
        const grid = document.getElementById('historyGrid');
        
        if (!history || history.length === 0) {
          grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px; grid-column: 1 / -1;">尚無生成記錄</p>';
          return;
        }
        
        grid.innerHTML = history.slice(0, 20).map(item => \`
          <div class="history-item" onclick='displayImage(\${JSON.stringify(item).replace(/'/g, "&#39;")})'>
            <img src="\${item.url}" alt="\${item.prompt}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'%3E%3Crect fill=\\'%23333\\' width=\\'100\\' height=\\'100\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23666\\'%3EError%3C/text%3E%3C/svg%3E'">
            <button class="delete-btn" onclick="deleteHistory('\${item.id}', event)" title="刪除">×</button>
            <div class="overlay">
              <p title="\${item.prompt}">\${item.prompt.slice(0, 40)}...</p>
              <p style="font-size: 9px; opacity: 0.7;">\${new Date(item.timestamp).toLocaleString('zh-TW', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
            </div>
          </div>
        \`).join('');
      } catch (error) {
        console.error('載入歷史失敗:', error);
      }
    }

    // 刪除歷史記錄
    async function deleteHistory(id, event) {
      event.stopPropagation();
      if (!confirm('確定要刪除此記錄嗎?')) return;
      
      try {
        const response = await fetch('/api/history/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        if (result.success) {
          showStatus('✅ 記錄已刪除', 'success');
          loadHistory();
        } else {
          showStatus('刪除失敗', 'error');
        }
      } catch (error) {
        console.error('刪除錯誤:', error);
        showStatus('刪除失敗', 'error');
      }
    }
  `;
}
// 接續 JavaScript - 最後部分
function getHTMLScript5() {
  return `
    // 下載圖片
    function downloadImage() {
      if (!currentRecord || !currentRecord.image) {
        showStatus('沒有可下載的圖片', 'error');
        return;
      }
      
      const a = document.createElement('a');
      a.href = currentRecord.image;
      a.download = \`pollinations-ai-\${currentRecord.id}.png\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showStatus('✅ 下載開始', 'success');
    }

    // 複製提示詞
    function copyPrompt() {
      if (!currentRecord || !currentRecord.prompt) {
        showStatus('沒有可複製的提示詞', 'error');
        return;
      }
      
      navigator.clipboard.writeText(currentRecord.prompt).then(() => {
        showStatus('✅ 提示詞已複製', 'success');
      }).catch(() => {
        showStatus('複製失敗', 'error');
      });
    }

    // 分享圖片
    function shareImage() {
      if (!currentRecord) {
        showStatus('沒有可分享的圖片', 'error');
        return;
      }
      
      const shareText = \`AI Studio 生成 - \${currentRecord.prompt.slice(0, 100)}\`;
      
      if (navigator.share) {
        navigator.share({
          title: 'AI Studio',
          text: shareText,
          url: window.location.href
        }).then(() => {
          showStatus('✅ 分享成功', 'success');
        }).catch(() => {
          // 回退到複製
          fallbackShare(shareText);
        });
      } else {
        fallbackShare(shareText);
      }
    }

    function fallbackShare(text) {
      navigator.clipboard.writeText(text).then(() => {
        showStatus('✅ 分享文字已複製', 'success');
      }).catch(() => {
        showStatus('分享失敗', 'error');
      });
    }

    // 更新範圍值顯示
    function updateRangeValue(id) {
      const input = document.getElementById(id);
      const display = document.getElementById(id + 'Value');
      if (display) {
        display.textContent = input.value;
      }
    }

    // 顯示狀態訊息
    function showStatus(message, type) {
      const status = document.getElementById('status');
      if (!status) return;
      
      status.textContent = message;
      status.className = 'status ' + type;
      
      if (type === 'success') {
        setTimeout(() => {
          status.textContent = '';
          status.className = 'status';
        }, 3000);
      }
    }

    // 快捷鍵支持
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter 或 Cmd+Enter 生成
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generate();
      }
      // Ctrl+D 或 Cmd+D 下載
      else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadImage();
      }
    });

    // 錯誤處理
    window.addEventListener('error', (e) => {
      console.error('全局錯誤:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('未處理的 Promise 拒絕:', e.reason);
    });
  </script>
</body>
</html>`;
}
// 將所有部分組合成完整的 HTML
function getHTML() {
  return getHTMLStyles2() + 
         getHTMLStyles3() + 
         getHTMLBody1() + 
         getHTMLBody2() + 
         getHTMLBody3() + 
         getHTMLScript1() + 
         getHTMLScript2() + 
         getHTMLScript3() + 
         getHTMLScript4() + 
         getHTMLScript5();
}
