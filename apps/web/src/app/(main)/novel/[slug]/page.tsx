import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { User, BookOpen, Clock, ListOrdered } from 'lucide-react';
import { getNovelBySlug } from '@/lib/api';
import { NovelActionButtons } from '@/components/novel/NovelActionButtons';

export const dynamic = 'force-dynamic';

export default async function NovelDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: novel } = await getNovelBySlug(slug);

  if (!novel) {
    notFound();
  }

  const fallbackCover = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
  const firstChapter = novel.chapters && novel.chapters.length > 0 ? novel.chapters[0] : null;

  return (
    <div className="min-h-screen bg-zen-paper pb-20">
      {/* SECTION 1: HEADER & INFO */}
      <section className="relative pt-10 pb-16 border-b border-zen-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
            
            {/* Ảnh Bìa */}
            <div className="w-full md:w-1/3 max-w-[300px] shrink-0 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-zen-muted/50">
                <Image
                  src={novel.cover || fallbackCover}
                  alt={novel.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>

            {/* Thông tin Chi Tiết */}
            <div className="flex-1 space-y-6 text-center md:text-left mt-4 md:mt-0">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zen-ink leading-tight">
                {novel.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-sm text-zen-gray font-sans">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-zen-cinnabar" />
                  <span className="font-medium">{novel.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-zen-cinnabar" />
                  <span>{novel.chapters?.length || 0} Chương</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zen-cinnabar" />
                  <span>Cập nhật gần đây</span>
                </div>
              </div>

              {/* Mô tả */}
              <div className="bg-white/40 p-6 rounded-xl border border-zen-muted/30 shadow-sm backdrop-blur-sm text-left">
                <h3 className="font-sans font-semibold text-zen-ink mb-3 text-sm tracking-wider uppercase">Giới thiệu tác phẩm</h3>
                <p className="font-sans text-zen-gray/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {novel.description || 'Tác phẩm này hiện chưa có lời giới thiệu.'}
                </p>
              </div>

              {/* Nút Hành Động (Client Component) */}
              <div className="flex justify-center md:justify-start">
                <NovelActionButtons 
                  novelSlug={novel.slug} 
                  firstChapterId={firstChapter?.id} 
                />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* SECTION 2: CHAPTER LIST */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-zen-muted/40 pb-4 mb-8">
            <h2 className="font-serif text-2xl font-bold tracking-wider text-zen-ink flex items-center gap-2">
              <ListOrdered className="h-6 w-6 text-zen-cinnabar stroke-[1.5]" /> Mục Lục
            </h2>
            <span className="text-sm text-zen-gray font-sans">{novel.chapters?.length || 0} chương</span>
          </div>

          {novel.chapters && novel.chapters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {novel.chapters.map((chapter: any) => (
                <Link
                  key={chapter.id}
                  href={`/read/${novel.slug}/${chapter.id}`}
                  className="flex flex-col p-4 rounded-xl border border-zen-muted/40 bg-white/60 hover:bg-white hover:border-zen-cinnabar/30 hover:shadow-sm transition-all duration-200 group"
                >
                  <span className="text-xs text-zen-gray/70 font-sans mb-1 font-medium tracking-widest uppercase">
                    Chương {chapter.order}
                  </span>
                  <span className="font-sans font-medium text-zen-ink group-hover:text-zen-cinnabar transition-colors line-clamp-1">
                    {chapter.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/40 rounded-xl border border-dashed border-zen-muted">
              <p className="text-zen-gray font-sans">Tác giả chưa đăng chương nào.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
