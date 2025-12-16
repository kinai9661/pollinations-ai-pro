import { get, set } from 'idb-keyval';

export interface StoredImage {
  id: number;
  url: string;      // Base64 數據
  prompt: string;
  ratio: string;
  timestamp: number;
  model: string;
}

const STORAGE_KEY = 'pollinations_pro_gallery';
const MAX_ITEMS = 500;

export const galleryStorage = {
  // 獲取所有圖片
  async getAll(): Promise<StoredImage[]> {
    try {
      return (await get<StoredImage[]>(STORAGE_KEY)) || [];
    } catch (e) {
      console.error('Failed to load history:', e);
      return [];
    }
  },

  // 新增圖片 (自動維護 MAX_ITEMS, 新圖在前)
  async add(image: StoredImage): Promise<StoredImage[]> {
    const current = (await get<StoredImage[]>(STORAGE_KEY)) || [];
    const updated = [image, ...current];
    
    if (updated.length > MAX_ITEMS) {
      updated.length = MAX_ITEMS;
    }
    
    await set(STORAGE_KEY, updated);
    return updated;
  },

  // 刪除單張
  async remove(id: number): Promise<StoredImage[]> {
    const current = (await get<StoredImage[]>(STORAGE_KEY)) || [];
    const updated = current.filter(item => item.id !== id);
    await set(STORAGE_KEY, updated);
    return updated;
  },

  // 清空所有
  async clear(): Promise<void> {
    await set(STORAGE_KEY, []);
  }
};
