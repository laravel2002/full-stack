import React from 'react';

export default function HomeLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-zen-paper">
      <main className="flex-1">
        {/* SECTION 1: SPLIT-SCREEN HERO SKELETON */}
        <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 border-b border-zen-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
              
              {/* Cột Trái: Triết lý & Truyện nổi bật (Skeleton) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Badge Skeleton */}
                <div className="h-6 w-36 bg-zen-muted animate-pulse rounded-full" />
                
                {/* Title & Paragraph Skeleton */}
                <div className="space-y-4">
                  <div className="h-10 sm:h-12 w-3/4 bg-zen-muted animate-pulse rounded-md" />
                  <div className="h-10 sm:h-12 w-1/2 bg-zen-muted animate-pulse rounded-md" />
                  <div className="h-4 w-5/6 bg-zen-muted animate-pulse rounded-md mt-4" />
                  <div className="h-4 w-4/6 bg-zen-muted animate-pulse rounded-md" />
                </div>

                {/* Card truyện Featured (Skeleton) */}
                <div className="rounded-xl border border-zen-muted/50 bg-white/30 p-6 backdrop-blur-sm shadow-sm space-y-4">
                  <div className="h-8 w-2/3 bg-zen-muted animate-pulse rounded-md" />
                  <div className="flex gap-4">
                    <div className="h-4 w-24 bg-zen-muted animate-pulse rounded-md" />
                    <div className="h-4 w-20 bg-zen-muted animate-pulse rounded-md" />
                  </div>
                  <div className="space-y-2 py-2">
                    <div className="h-4 w-full bg-zen-muted animate-pulse rounded-md" />
                    <div className="h-4 w-full bg-zen-muted animate-pulse rounded-md" />
                    <div className="h-4 w-4/5 bg-zen-muted animate-pulse rounded-md" />
                  </div>
                  <div className="flex justify-between items-center border-t border-zen-muted/30 pt-4">
                    <div className="h-4 w-1/3 bg-zen-muted animate-pulse rounded-md" />
                    <div className="h-10 w-28 bg-zen-muted animate-pulse rounded-full" />
                  </div>
                </div>
              </div>

              {/* Cột Phải: Ảnh bìa lớn (Skeleton) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[400px] aspect-[3/4] rounded-2xl bg-zen-muted animate-pulse border border-zen-muted/50 shadow-md" />
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: GRID CHƯƠNG MỚI & BẢNG XẾP HẠNG (SKELETON) */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
              
              {/* Khối Trái: Chương mới cập nhật (Skeleton) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex justify-between items-center border-b border-zen-muted/40 pb-4">
                  <div className="h-7 w-52 bg-zen-muted animate-pulse rounded-md" />
                  <div className="h-4 w-20 bg-zen-muted animate-pulse rounded-md" />
                </div>

                <div className="divide-y divide-zen-muted/30">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="py-5 flex justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/4 bg-zen-muted animate-pulse rounded-md" />
                        <div className="h-5 w-2/3 bg-zen-muted animate-pulse rounded-md" />
                      </div>
                      <div className="h-4 w-20 bg-zen-muted animate-pulse rounded-md mt-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Khối Phải: Bảng xếp hạng (Skeleton) */}
              <div className="lg:col-span-4 space-y-8">
                <div className="border-b border-zen-muted/40 pb-4">
                  <div className="h-7 w-40 bg-zen-muted animate-pulse rounded-md" />
                </div>

                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-zen-muted animate-pulse rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 bg-zen-muted animate-pulse rounded-md" />
                        <div className="h-3 w-1/2 bg-zen-muted animate-pulse rounded-md" />
                      </div>
                      <div className="h-6 w-14 bg-zen-muted animate-pulse rounded-full" />
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
