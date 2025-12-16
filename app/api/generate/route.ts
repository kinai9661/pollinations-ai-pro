import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 1024, height = 1024 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 讀取環境變數 (本地讀取 .dev.vars, 線上讀取 Cloudflare Secrets)
    const apiKey = process.env.POLLINATIONS_API_KEY;

    // 構建請求 URL
    // 使用 flux 模型, nologo 去水印, enhance 優化提示詞
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&enhance=true`;

    const headers: HeadersInit = {
      'User-Agent': 'Pollinations-Pro-Client/1.0',
    };

    // 如果有 API Key 則添加認證 (推薦)
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.statusText}`);
    }

    // 將圖片轉為 Base64 返回前端
    const arrayBuffer = await response.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64String}`;

    return NextResponse.json({ image: dataUrl });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
