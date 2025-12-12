// frontend/services/api.ts
import type { StationStatus } from '../types';

// 後端基底網址：優先用 .env.local 裡的 VITE_API_URL，沒有就用預設值
//const API_BASE =
  //(import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://100.73.255.39:8000/api';

export async function fetchStations(): Promise<StationStatus[]> {
  try {
    const res = await fetch(`${API_BASE}/stations`);

    if (!res.ok) {
      console.error('Failed to fetch /stations', res.status);
      return [];
    }

    const data = await res.json();
    return data as StationStatus[];
  } catch (err) {
    console.error('fetchStations error:', err);
    return [];
  }
}