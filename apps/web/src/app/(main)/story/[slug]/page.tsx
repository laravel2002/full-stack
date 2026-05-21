import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { User, Eye, BookOpen, Layers } from 'lucide-react';
import { fetchApi } from '@/lib/api';

// Dữ liệu mock tĩnh khớp chuẩn với CSDL Neon PostgreSQL
const storiesData: Record<string, {
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  views: number;
  status: string;
  category: string;
  chapters: { chapterNum: number; title: string }[];
}> = {
  'thien-long-bat-bo': {
    title: 'Thiên Long Bát Bộ',
    author: 'Kim Dung',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    description: 'Một kiệt tác kiếm hiệp võ học đỉnh cao của nhà văn Kim Dung, lồng ghép sâu sắc các triết lý nhân quả của Phật giáo và võ hiệp cổ trang. Câu chuyện xoay quanh vận mệnh đầy thăng trầm của Kiều Phong, Đoàn Dự và Hư Trúc giữa vòng xoáy ân oán giang hồ và chiến tranh quốc gia.',
    views: 15420,
    status: 'Đang cập nhật',
    category: 'Võ Hiệp',
    chapters: [
      { chapterNum: 1, title: 'Chương 1: Khởi đầu hồng trần, kiếm khí phong vân' },
      { chapterNum: 2, title: 'Chương 2: Nhạn Môn quan ngoại, huyết lệ giang hồ' },
    ],
  },
  'dao-duc-kinh': {
    title: 'Đạo Đức Kinh',
    author: 'Lão Tử',
    coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop',
    description: 'Tác phẩm triết học kinh điển Đông Phương của hiền triết Lão Tử, nền tảng của Đạo giáo. Sách gồm 81 chương chia làm 2 phần: Đạo kinh và Đức kinh, lý giải về bản nguyên vũ trụ, nghệ thuật sống tĩnh lặng vô vi và sự an nhiên tự tại hài hòa với tự nhiên.',
    views: 8900,
    status: 'Hoàn thành',
    category: 'Triết Học',
    chapters: [
      { chapterNum: 1, title: 'Chương 1: Khải huyền chi môn - Đạo khả đạo phi thường đạo' },
      { chapterNum: 2, title: 'Chương 2: Bản nguyên vô danh, triết lý hư vô' },
    ],
  },
  'dong-chu-liet-quoc': {
    title: 'Đông Chu Liệt Quốc',
    author: 'Phùng Mộng Long',
    coverUrl: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop',
    description: 'Bộ tiểu thuyết lịch sử đồ sộ phản ánh giai đoạn đầy biến động của Trung Hoa thời Xuân Thu Chiến Quốc. Những cuộc chiến vương quyền khốc liệt, mưu kế kinh điển và tấm gương trung nghĩa muôn thuở được tái hiện sống động.',
    views: 12050,
    status: 'Hoàn thành',
    category: 'Lịch Sử',
    chapters: [
      { chapterNum: 1, title: 'Chương 1: Tuyên Vương nghe lời ca ác nghịch' },
    ],
  },
  'nam-hoa-kinh': {
    title: 'Nam Hoa Kinh',
    author: 'Trang Tử',
    coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    description: 'Một tác phẩm triết học ngụ ngôn phóng khoáng và tự tại bậc nhất của Trang Tử. Tràn ngập những câu chuyện ngụ ngôn giàu tưởng tượng như giấc mơ hóa bướm, cánh chim bằng vạn dặm, Nam Hoa Kinh phá vỡ mọi định kiến trần tục để đưa tâm hồn về cõi tiêu dao cực lạc.',
    views: 6200,
    status: 'Hoàn thành',
    category: 'Thiền Tông',
    chapters: [
      { chapterNum: 1, title: 'Chương 1: Tiêu dao du - Cánh chim bằng vạn dặm' },
    ],
  },
  'kinh-thi': {
    title: 'Kinh Thi',
    author: 'Khổng Tử biên soạn',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    description: 'Tuyển tập thơ ca dân gian đầu tiên của Trung Hoa cổ đại, phản ánh chân thực đời sống, tình yêu, lao động và văn hóa của con người cách đây hàng ngàn năm. Một lăng kính văn học tinh khiết lưu truyền muôn thuở.',
    views: 4300,
    status: 'Hoàn thành',
    category: 'Thi Ca',
    chapters: [
      { chapterNum: 1, title: 'Chương 1: Quan thư - Tiếng lòng nơi đầm nước' },
    ],
  },
};

// Hàm lấy chi tiết truyện từ API Backend
async function getStory(slug: string) {
  try {
    const data = await fetchApi<any>(`/stories/${slug}`);
    if (!data) throw new Error(`Không tìm thấy dữ liệu truyện cho slug: ${slug}`);
    
    // Ánh xạ linh hoạt từ CSDL thực tế sang giao diện
    const categories = ['Võ Hiệp', 'Triết Học', 'Lịch Sử', 'Thiền Tông', 'Thi Ca'];
    // Dựa vào slug hoặc id để ước lượng danh mục tương đương
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const category = categories[hash % categories.length];

    return {
      title: data.title,
      author: data.author,
      coverUrl: data.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      description: data.description || 'Không có mô tả cho tác phẩm này.',
      views: data.viewCount ?? 0,
      status: data.chapters && data.chapters.length > 5 ? 'Hoàn thành' : 'Đang cập nhật',
      category: category,
      chapters: (data.chapters || []).map((ch: any) => ({
        chapterNum: ch.chapterNum,
        title: ch.title,
      })),
    };
  } catch (error) {
    console.error(`[Mặc Quán] Không thể gọi API chi tiết truyện cho slug ${slug}, dùng dữ liệu dự phòng:`, error);
    const fallback = storiesData[slug];
    if (!fallback) return null;
    return fallback;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Bật Metadata động chuẩn SEO và Open Graph
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const story = await getStory(resolvedParams.slug);

  if (!story) {
    return {
      title: 'Không tìm thấy tác phẩm | Mặc Quán',
      description: 'Tác phẩm yêu cầu không tồn tại trong hệ thống thư viện Mặc Quán.',
    };
  }

  const desc = story.description || 'Tác phẩm truyện chữ tinh tế tại Mặc Quán.';
  return {
    title: `${story.title} - Tác giả ${story.author} | Mặc Quán`,
    description: desc.slice(0, 160) + (desc.length > 160 ? '...' : ''),
    openGraph: {
      title: `${story.title} - Mặc Quán`,
      description: desc,
      type: 'article',
      url: `https://macquan.vn/story/${resolvedParams.slug}`,
      images: [
        {
          url: story.coverUrl,
          width: 600,
          height: 800,
          alt: `Ảnh bìa tác phẩm ${story.title}`,
        },
      ],
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const story = await getStory(resolvedParams.slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-zen-paper selection:bg-zen-cinnabar selection:text-zen-paper">
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            
            {/* Cột Trái (4/12 cột): Ảnh bìa & Thông số phụ */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-zen-muted/60 shadow-md">
                <Image
                  src={story.coverUrl}
                  alt={story.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Bảng thông số phụ */}
              <div className="rounded-xl border border-zen-muted/50 bg-white/40 p-6 backdrop-blur-sm shadow-sm space-y-4">
                <div className="flex items-center justify-between text-sm border-b border-zen-muted/30 pb-3">
                  <span className="text-zen-gray flex items-center gap-1.5"><User className="h-4 w-4 stroke-[1.5]" /> Tác giả</span>
                  <span className="font-semibold text-zen-ink">{story.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-zen-muted/30 pb-3">
                  <span className="text-zen-gray flex items-center gap-1.5"><Layers className="h-4 w-4 stroke-[1.5]" /> Thể loại</span>
                  <span className="font-semibold text-zen-ink">{story.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-zen-muted/30 pb-3">
                  <span className="text-zen-gray flex items-center gap-1.5"><BookOpen className="h-4 w-4 stroke-[1.5]" /> Trạng thái</span>
                  <span className="font-semibold text-zen-cinnabar">{story.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm pb-1">
                  <span className="text-zen-gray flex items-center gap-1.5"><Eye className="h-4 w-4 stroke-[1.5]" /> Lượt đọc</span>
                  <span className="font-semibold text-zen-ink">{story.views.toLocaleString()}</span>
                </div>

                {story.chapters.length > 0 && (
                  <Link
                    href={`/read/${resolvedParams.slug}/${story.chapters[0].chapterNum}`}
                    className="w-full mt-4 inline-flex items-center justify-center rounded-full bg-zen-cinnabar py-3 text-sm font-semibold text-zen-paper hover:bg-opacity-95 shadow-sm transition-all duration-200"
                  >
                    Đọc Chương Đầu
                  </Link>
                )}
              </div>
            </div>

            {/* Cột Phải (8/12 cột): Tên truyện, Tóm tắt & Danh sách Chương */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-4">
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-zen-ink leading-tight">
                  {story.title}
                </h1>
                <p className="font-sans text-base text-zen-ink/90 leading-relaxed max-w-3xl pt-2">
                  {story.description}
                </p>
              </div>

              {/* Danh sách mục lục */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold tracking-wider text-zen-ink border-b border-zen-muted pb-3">
                  Mục Lục Chương ({story.chapters.length})
                </h2>

                {story.chapters.length === 0 ? (
                  <p className="font-sans text-sm text-zen-gray italic">Hiện chưa có chương truyện nào được tải lên.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {story.chapters.map((ch: any) => (
                      <Link
                        key={ch.chapterNum}
                        href={`/read/${resolvedParams.slug}/${ch.chapterNum}`}
                        className="flex items-center p-4 rounded-xl border border-zen-muted/40 bg-white/20 hover:border-zen-cinnabar/30 hover:bg-white/50 transition-all duration-200 group"
                      >
                        <span className="font-serif text-sm font-bold text-zen-cinnabar/80 mr-3 w-8 group-hover:scale-105 transition-transform">
                          #{ch.chapterNum}
                        </span>
                        <span className="font-sans text-sm font-medium text-zen-ink group-hover:text-zen-cinnabar transition-colors truncate">
                          {ch.title.replace(/^Chương \d+:\s*/, '')}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
