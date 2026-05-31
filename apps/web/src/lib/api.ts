import { useAuthStore } from '@/stores/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isLocalhost = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');
  const isBuildEnv = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

  if (isLocalhost && isBuildEnv) {
    throw new Error('Bỏ qua fetch API cục bộ lúc build để tránh lỗi kết nối.');
  }

  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }
  return data;
}

export async function getNovels(page = 1, limit = 10) {
  try {
    const res = await fetch(`${API_URL}/novels?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch novels');
    return res.json();
  } catch (error) {
    console.error('Error fetching novels:', error);
    return { data: [], pagination: {} };
  }
}

export async function getNovelBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/novels/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch novel');
    return res.json();
  } catch (error) {
    console.error('Error fetching novel details:', error);
    return { data: null };
  }
}

export async function getChapter(id: number) {
  try {
    const res = await fetch(`${API_URL}/chapters/${id}`, {
      cache: 'no-store' // Để realtime cho nút Prev/Next và Views
    });
    if (!res.ok) throw new Error('Failed to fetch chapter');
    return res.json();
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return { data: null };
  }
}

export async function getLeaderboard() {
  return [
    { rank: 1, title: 'Thiên Long Bát Bộ', slug: 'thien-long-bat-bo', author: 'Kim Dung', views: '15,420 lượt', category: 'Kiếm hiệp' },
    { rank: 2, title: 'Đông Chu Liệt Quốc', slug: 'dong-chu-liet-quoc', author: 'Phùng Mộng Long', views: '12,050 lượt', category: 'Lịch sử' },
    { rank: 3, title: 'Đạo Đức Kinh', slug: 'dao-duc-kinh', author: 'Lão Tử', views: '8,900 lượt', category: 'Triết học' },
    { rank: 4, title: 'Nam Hoa Kinh', slug: 'nam-hoa-kinh', author: 'Trang Tử', views: '6,200 lượt', category: 'Thiền tông' },
    { rank: 5, title: 'Kinh Thi', slug: 'kinh-thi', author: 'Khổng Tử biên soạn', views: '4,300 lượt', category: 'Thi ca' },
  ];
}

export async function getStories(q?: string) {
  const fallbackStories = [
    {
      id: '1', title: 'Thiên Long Bát Bộ', slug: 'thien-long-bat-bo', author: 'Kim Dung',
      description: 'Một kiệt tác kiếm hiệp.', coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      viewCount: 15420, chapters: [{ id: 'c1', chapterNum: 1, title: 'Chương 1' }]
    }
  ];
  return fallbackStories;
}
