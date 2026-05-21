import type { Metadata } from 'next';
import { fetchApi } from '@/lib/api';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; chapter: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const chapterNum = parseInt(resolvedParams.chapter, 10);

  try {
    const payload = await fetchApi<any>(`/chapters/${slug}/${chapterNum}`);
    if (!payload || !payload.chapter) throw new Error('Không có dữ liệu chương');
    
    return {
      title: `${payload.chapter.title} - ${payload.story.title} | Mặc Quán`,
      description: `Đọc truyện ${payload.story.title} - ${payload.chapter.title} tại Mặc Quán thư phòng. Không gian đọc truyện kiếm hiệp & thiền tông tĩnh lặng bậc nhất.`,
      openGraph: {
        title: `${payload.chapter.title} - ${payload.story.title} | Mặc Quán`,
        description: `Đọc truyện ${payload.story.title} - ${payload.chapter.title} tại Mặc Quán thư phòng.`,
        type: 'article',
        url: `https://macquan.vn/read/${slug}/${chapterNum}`,
      }
    };
  } catch (error) {
    // Fallback trong trường hợp API bị lỗi hoặc build-time
    const formatTitle = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const storyTitle = formatTitle(slug);
    return {
      title: `Chương ${chapterNum} - ${storyTitle} | Mặc Quán`,
      description: `Đọc chương ${chapterNum} truyện ${storyTitle} trực tuyến tại Mặc Quán.`,
    };
  }
}

export default function ReaderLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
