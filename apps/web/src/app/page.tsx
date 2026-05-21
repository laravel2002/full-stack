import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, User, Flame, Clock } from 'lucide-react';
import { getFeaturedStory, getLeaderboard, getRecentChapters } from '@/lib/api';
import { ReadingHistoryHome } from '@/components/layout/reading-history-home';

// Lấy dữ liệu được đưa vào lib/api.ts
export default async function Home() {
  const [featured, leaderboard, recent] = await Promise.all([
    getFeaturedStory(),
    getLeaderboard(),
    getRecentChapters()
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-zen-paper selection:bg-zen-cinnabar selection:text-zen-paper">
      <main className="flex-1">
        {/* SECTION 1: SPLIT-SCREEN HERO */}
        <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 border-b border-zen-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
              
              {/* Cột Trái: Triết lý & Truyện nổi bật */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-zen-cinnabar/25 bg-zen-cinnabar/5 px-4 py-1 text-xs font-semibold text-zen-cinnabar tracking-wider font-sans">
                  <Flame className="h-3 w-3" /> TÁC PHẨM NỔI BẬT
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-zen-ink leading-tight">
                    Tìm Về Bản Ngã Giữa <br />
                    <span className="text-zen-cinnabar">Thư Phòng Mực Thơm</span>
                  </h1>
                  <p className="font-sans text-base sm:text-lg text-zen-gray max-w-xl leading-relaxed">
                    Mặc Quán khai mở không gian tinh khiết, tĩnh lặng giúp hành giả thưởng lãm võ hiệp hào tình và triết học sâu xa trong tâm thế thư thái nhất.
                  </p>
                </div>

                {/* Tích hợp Lịch sử đọc dở */}
                <ReadingHistoryHome />

                {/* Card truyện Featured */}
                <div className="rounded-xl border border-zen-muted/50 bg-white/40 p-6 backdrop-blur-sm shadow-sm hover:border-zen-cinnabar/30 transition-all duration-300">
                  <h3 className="font-serif text-2xl font-bold text-zen-ink mb-1">
                    {featured.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-zen-gray mb-4 font-sans">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {featured.author}</span>
                    <span>•</span>
                    <span>{featured.views}</span>
                  </div>
                  <p className="font-sans text-sm text-zen-ink/80 leading-relaxed mb-6 line-clamp-3">
                    {featured.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-zen-muted/30 pt-4">
                    <span className="text-xs text-zen-gray italic font-sans truncate max-w-[280px]">
                      Mới cập nhật: {featured.latestChapter}
                    </span>
                    <Link
                      href={`/story/${featured.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-zen-ink px-6 py-2.5 text-sm font-semibold text-zen-paper hover:bg-zen-cinnabar shadow-sm transition-all duration-200"
                    >
                      Bắt Đầu Đọc
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cột Phải: Ảnh minh họa nghệ thuật thủy mặc */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-2xl overflow-hidden border border-zen-muted/50 shadow-md group">
                  <div className="absolute inset-0 bg-gradient-to-t from-zen-ink/60 via-transparent to-transparent z-10" />
                  <Image
                    src={featured.coverUrl}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20 text-white space-y-1">
                    <span className="font-serif text-sm italic tracking-widest text-zen-paper/80">Kính tặng thư sĩ</span>
                    <h4 className="font-serif text-2xl font-bold tracking-wider">{featured.title}</h4>
                    <p className="font-sans text-xs opacity-75">{featured.author}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: LỚP DƯỚI (GRID CHƯƠNG MỚI & BẢNG XẾP HẠNG) */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
              
              {/* Khối Trái: Chương mới cập nhật (8/12 cột) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between border-b border-zen-muted/40 pb-4">
                  <h2 className="font-serif text-2xl font-bold tracking-wider text-zen-ink flex items-center gap-2">
                    <Clock className="h-5 w-5 text-zen-cinnabar stroke-[1.5]" /> Chương Mới Cập Nhật
                  </h2>
                  <Link href="/library" className="text-xs text-zen-cinnabar hover:underline font-sans font-semibold tracking-wide">
                    Xem tất cả →
                  </Link>
                </div>

                <div className="divide-y divide-zen-muted/30">
                  {recent.map((ch: any, idx: number) => (
                    <div key={idx} className="py-5 flex items-start justify-between gap-4 group">
                      <div className="space-y-1 max-w-[80%]">
                        <Link 
                          href={`/story/${ch.slug}`}
                          className="font-serif text-sm font-semibold text-zen-cinnabar hover:underline"
                        >
                          {ch.storyTitle}
                        </Link>
                        <h4 className="font-sans text-base text-zen-ink group-hover:text-zen-cinnabar transition-colors duration-200">
                          <Link href={`/read/${ch.slug}/${ch.chapterNum}`}>
                            {ch.chapterTitle}
                          </Link>
                        </h4>
                      </div>
                      <span className="font-sans text-xs text-zen-gray italic pt-1 whitespace-nowrap">
                        {ch.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Khối Phải: Bảng xếp hạng Top 5 (4/12 cột) */}
              <div className="lg:col-span-4 space-y-8">
                <div className="border-b border-zen-muted/40 pb-4">
                  <h2 className="font-serif text-2xl font-bold tracking-wider text-zen-ink flex items-center gap-2">
                    <Flame className="h-5 w-5 text-zen-cinnabar stroke-[1.5]" /> Bảng Xếp Hạng
                  </h2>
                </div>

                <div className="space-y-6">
                  {leaderboard.map((story) => (
                    <div key={story.rank} className="flex items-center gap-4 group">
                      {/* Số thứ tự chu sa lớn nét thanh mảnh */}
                      <span className="font-serif text-4xl font-extrabold text-zen-cinnabar/20 group-hover:text-zen-cinnabar/80 transition-colors duration-300 w-10 text-center select-none">
                        {story.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base font-bold text-zen-ink hover:text-zen-cinnabar transition-colors duration-200 truncate">
                          <Link href={`/story/${story.slug}`}>
                            {story.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zen-gray mt-0.5 font-sans">
                          <span>{story.author}</span>
                          <span>•</span>
                          <span className="italic">{story.category}</span>
                        </div>
                      </div>
                      <span className="font-sans text-xs text-zen-gray/80 whitespace-nowrap bg-zen-muted/40 px-2 py-0.5 rounded-full select-none">
                        {story.views}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
