import Link from 'next/link';
import { Flame, Compass } from 'lucide-react';
import { getNovels } from '@/lib/api';
import { ReadingHistory } from '@/components/novel/ReadingHistory';
import { NovelCard } from '@/components/novel/NovelCard';

// Opt out of static generation since we fetch realtime API data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: novels = [] } = await getNovels(1, 12);
  const featured = novels.length > 0 ? novels[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-zen-paper selection:bg-zen-cinnabar selection:text-zen-paper">
      <main className="flex-1">
        {/* SECTION 1: HERO */}
        <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 border-b border-zen-muted/30">
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper.png")' }}></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-zen-cinnabar/25 bg-zen-cinnabar/5 px-4 py-1 text-xs font-semibold text-zen-cinnabar tracking-wider font-sans">
              <Compass className="h-3 w-3" /> KHÁM PHÁ VÕ HIỆP THIỀN TÔNG
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wide text-zen-ink leading-tight">
              Tìm Về Bản Ngã Giữa <br />
              <span className="text-zen-cinnabar relative inline-block mt-2">
                Thư Phòng Mực Thơm
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-zen-cinnabar/20 rounded-full"></span>
              </span>
            </h1>
            
            <p className="font-sans text-base sm:text-lg text-zen-gray max-w-2xl mx-auto leading-relaxed">
              Mặc Quán khai mở không gian tinh khiết, tĩnh lặng giúp hành giả thưởng lãm những tuyệt tác võ hiệp hào tình và triết lý Đông phương sâu xa trong tâm thế thư thái nhất.
            </p>
          </div>
        </section>

        {/* SECTION 2: CONTENT */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Tích hợp Lịch sử đọc dở (Client Component) */}
            <ReadingHistory />

            <div className="border-b border-zen-muted/40 pb-4 mb-8">
              <h2 className="font-serif text-2xl font-bold tracking-wider text-zen-ink flex items-center gap-2">
                <Flame className="h-6 w-6 text-zen-cinnabar stroke-[1.5]" /> Truyện Mới Cập Nhật
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {novels.map((novel: any) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>

            {novels.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zen-gray font-sans">Hiện chưa có truyện nào được đăng tải.</p>
              </div>
            )}
            
          </div>
        </section>
      </main>
    </div>
  );
}
