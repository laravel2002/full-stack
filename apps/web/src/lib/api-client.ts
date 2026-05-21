const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Bình luận Tiếng Việt: Bỏ qua kết nối localhost lúc build để tránh lỗi ECONNREFUSED trên Vercel
  const isLocalhost = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
  const isBuildEnv = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

  if (isLocalhost && isBuildEnv) {
    throw new Error('Bỏ qua fetch API cục bộ lúc build để tránh lỗi kết nối.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
