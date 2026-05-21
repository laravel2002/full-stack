const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
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
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${diffDays} ngày trước`;
}

export async function getFeaturedStory() {
  try {
    const data = await fetchApi<any>('/stories/featured');
    if (!data) throw new Error('Không có dữ liệu truyện nổi bật');
    return {
      title: data.title,
      slug: data.slug,
      author: data.author,
      coverUrl: data.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      description: data.description || 'Một tác phẩm tuyệt hảo đang chờ bạn khám phá tại Mặc Quán thư phòng.',
      views: `${data.viewCount.toLocaleString()} lượt đọc`,
      latestChapter: data.chapters?.[0]?.title || 'Chương mới nhất'
    };
  } catch (error) {
    console.error('[Mặc Quán] Không thể gọi API featured, dùng dữ liệu dự phòng:', error);
    return {
      title: 'Thiên Long Bát Bộ',
      slug: 'thien-long-bat-bo',
      author: 'Kim Dung',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      description: 'Một kiệt tác kiếm hiệp võ học đỉnh cao của nhà văn Kim Dung, lồng ghép sâu sắc các triết lý nhân quả của Phật giáo và võ hiệp cổ trang. Câu chuyện xoay quanh vận mệnh đầy thăng trầm của Kiều Phong, Đoàn Dự và Hư Trúc giữa vòng xoáy ân oán giang hồ và chiến tranh quốc gia.',
      views: '15,420 lượt đọc',
      latestChapter: 'Chương 1: Khởi đầu hồng trần, kiếm khí phong vân'
    };
  }
}

export async function getLeaderboard() {
  try {
    const data = await fetchApi<any[]>('/stories/leaderboard');
    if (!data || !Array.isArray(data)) throw new Error('Dữ liệu bảng xếp hạng không hợp lệ');
    const categories = ['Kiếm hiệp', 'Lịch sử', 'Triết học', 'Thiền tông', 'Thi ca'];
    return data.slice(0, 5).map((story, index) => ({
      rank: index + 1,
      title: story.title,
      slug: story.slug,
      author: story.author,
      views: `${story.viewCount.toLocaleString()} lượt`,
      category: categories[index % categories.length]
    }));
  } catch (error) {
    console.error('[Mặc Quán] Không thể gọi API leaderboard, dùng dữ liệu dự phòng:', error);
    return [
      { rank: 1, title: 'Thiên Long Bát Bộ', slug: 'thien-long-bat-bo', author: 'Kim Dung', views: '15,420 lượt', category: 'Kiếm hiệp' },
      { rank: 2, title: 'Đông Chu Liệt Quốc', slug: 'dong-chu-liet-quoc', author: 'Phùng Mộng Long', views: '12,050 lượt', category: 'Lịch sử' },
      { rank: 3, title: 'Đạo Đức Kinh', slug: 'dao-duc-kinh', author: 'Lão Tử', views: '8,900 lượt', category: 'Triết học' },
      { rank: 4, title: 'Nam Hoa Kinh', slug: 'nam-hoa-kinh', author: 'Trang Tử', views: '6,200 lượt', category: 'Thiền tông' },
      { rank: 5, title: 'Kinh Thi', slug: 'kinh-thi', author: 'Khổng Tử biên soạn', views: '4,300 lượt', category: 'Thi ca' },
    ];
  }
}

export async function getRecentChapters() {
  try {
    const res = await fetchApi<any>('/chapters/recent?page=1&limit=5');
    if (!res || !res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu chương mới không hợp lệ');
    return res.data.map((ch: any) => ({
      storyTitle: ch.story?.title || 'Tác phẩm',
      slug: ch.story?.slug || 'slug-truyen',
      chapterNum: ch.chapterNum,
      chapterTitle: ch.title,
      time: timeAgo(ch.createdAt)
    }));
  } catch (error) {
    console.error('[Mặc Quán] Không thể gọi API recent chapters, dùng dữ liệu dự phòng:', error);
    return [
      { storyTitle: 'Thiên Long Bát Bộ', slug: 'thien-long-bat-bo', chapterNum: 2, chapterTitle: 'Chương 2: Nhạn Môn quan ngoại, huyết lệ giang hồ', time: '10 phút trước' },
      { storyTitle: 'Đạo Đức Kinh', slug: 'dao-duc-kinh', chapterNum: 2, chapterTitle: 'Chương 2: Bản nguyên vô danh, triết lý hư vô', time: '1 giờ trước' },
      { storyTitle: 'Đông Chu Liệt Quốc', slug: 'dong-chu-liet-quoc', chapterNum: 1, chapterTitle: 'Chương 1: Tuyên Vương nghe lời ca ác nghịch', time: '3 giờ trước' },
      { storyTitle: 'Nam Hoa Kinh', slug: 'nam-hoa-kinh', chapterNum: 1, chapterTitle: 'Chương 1: Tiêu dao du - Cánh chim bằng vạn dặm', time: '5 giờ trước' },
      { storyTitle: 'Kinh Thi', slug: 'kinh-thi', chapterNum: 1, chapterTitle: 'Chương 1: Quan thư - Tiếng lòng nơi đầm nước', time: '1 ngày trước' },
    ];
  }
}



export async function getStories() {
  const res = await fetch(`${API_URL}/stories`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
}

export async function getStoryBySlug(slug: string) {
  const res = await fetch(`${API_URL}/stories/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch story');
  return res.json();
}

export async function getChapter(storyId: number, chapterNum: number) {
  const res = await fetch(`${API_URL}/chapters/${storyId}/${chapterNum}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch chapter');
  return res.json();
}

export async function getLatestStories() {
  // Assuming NestJS backend has a way to get latest, e.g., ?sort=createdAt:desc or similar.
  // If not, we'll fetch all and slice, or use a specific endpoint.
  // For now, assuming `/stories` returns them sorted or we just use `/stories` and sort.
  const res = await fetch(`${API_URL}/stories`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch latest stories');
  const data = await res.json();
  return data; // Adjust if backend doesn't sort
}

export async function getPopularStories() {
  // Assuming backend has sorting by views
  const res = await fetch(`${API_URL}/stories`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch popular stories');
  const data = await res.json();
  return data; // Adjust if backend doesn't sort
}
