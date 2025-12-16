'use client';

import { useState, useEffect } from 'react';
import { 
  Wand2, Download, Trash2, Settings, 
  Image as ImageIcon, Sparkles, X, History, 
  Maximize2
} from 'lucide-react';
import { galleryStorage, type StoredImage } from './lib/storage';

export default function CreativeStudio() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [history, setHistory] = useState<StoredImage[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 初始化: 僅在客戶端執行 IndexedDB 讀取
  useEffect(() => {
    setIsClient(true);
    galleryStorage.getAll().then(setHistory);
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, width, height }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      if (data.image) {
        setImage(data.image);
        
        const newRecord: StoredImage = {
          id: Date.now(),
          url: data.image,
          prompt,
          ratio: `${width}x${height}`,
          timestamp: Date.now(),
          model: 'Flux.1'
        };
        
        // 更新數據庫並刷新 UI
        const updated = await galleryStorage.add(newRecord);
        setHistory(updated);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Delete this image?')) {
      const updated = await galleryStorage.remove(id);
      setHistory(updated);
      // 如果刪除的是當前顯示的圖片，清空畫布
      if (history.find(h => h.id === id)?.url === image) {
        setImage(null);
      }
    }
  };

  const ratios = [
    { label: 'Square', w: 1024, h: 1024, icon: '1:1' },
    { label: 'Portrait', w: 768, h: 1024, icon: '3:4' },
    { label: 'Landscape', w: 1024, h: 768, icon: '4:3' },
    { label: 'Wide', w: 1280, h: 720, icon: '16:9' },
  ];

  if (!isClient) return null;

  return (
    <div className="flex h-screen bg-[#09090b] text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-800 bg-[#0c0c0e] flex flex-col z-20 shadow-xl h-full">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Flux Studio
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Ratios */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ratios.map((r) => (
                <button
                  key={r.label}
                  onClick={() => { setWidth(r.w); setHeight(r.h); }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-sm ${
                    width === r.w && height === r.h
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700'
                  }`}
                >
                  <span className="font-mono text-xs opacity-70">{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gallery List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center sticky top-0 bg-[#0c0c0e] pb-2 z-10">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <History className="w-3 h-3" /> History ({history.length})
              </label>
              <button 
                onClick={async () => { if(confirm('Clear all history?')) { await galleryStorage.clear(); setHistory([]); setImage(null); }}}
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pb-20">
              {history.slice(0, 50).map((h) => (
                <div 
                  key={h.id} 
                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-800 bg-gray-900 cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={() => { setImage(h.url); setPrompt(h.prompt); }}
                >
                  <img src={h.url} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={(e) => deleteImage(e, h.id)}
                    className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-[#09090b]">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden relative">
          
          <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-emerald-400 font-medium text-lg animate-pulse">Generating...</p>
                  <p className="text-gray-500 text-sm max-w-xs truncate px-4">{prompt}</p>
                </div>
              </div>
            ) : image ? (
              <div className="relative group max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10">
                <img src={image} alt="Generated" className="max-w-full max-h-[calc(100vh-200px)] object-contain" />
                
                {/* Image Actions */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <a 
                    href={image} 
                    download={`flux-${Date.now()}.jpg`} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-black/80 hover:bg-black text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                  <button 
                    onClick={() => window.open(image, '_blank')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                  >
                    <Maximize2 className="w-4 h-4" /> Fullscreen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-700 space-y-4">
                <div className="w-24 h-24 rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                  <Wand2 className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-lg font-medium opacity-50">Enter a prompt to start dreaming</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full p-6 pb-8 bg-[#09090b] border-t border-gray-800/50 z-30">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-lg"></div>
            <div className="relative flex gap-3 p-2 bg-[#18181b] rounded-2xl border border-gray-700 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all shadow-2xl">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleGenerate();
                   }
                }}
                placeholder="Describe your imagination here..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 min-h-[50px] max-h-[150px] py-3 px-4 resize-none text-base"
                rows={1}
                style={{ fieldSizing: 'content' } as any} // CSS 新特性, 自動高度
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="self-end mb-1 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                ) : (
                  <Wand2 className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="mt-2 text-right">
              <span className="text-[10px] text-gray-600 uppercase tracking-widest">Model: Flux.1 Schnell</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
