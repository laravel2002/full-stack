import React from 'react';

export default function StoryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-zen-paper">
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            
            {/* Cột Trái (4/12 cột): Ảnh bìa & Thông số phụ (Skeleton) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Cover Image Skeleton */}
              <div className="w-full aspect-[3/4] rounded-2xl bg-zen-muted animate-pulse border border-zen-muted/60 shadow-md" />

              {/* Thông số phụ Card Skeleton */}
              <div className="rounded-xl border border-zen-muted/50 bg-white/30 p-6 backdrop-blur-sm shadow-sm space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center border-b border-zen-muted/20 pb-3 last:border-0 last:pb-0">
                    <div className="h-4 w-20 bg-zen-muted animate-pulse rounded-md" />
                    <div className="h-4 w-24 bg-zen-muted animate-pulse rounded-md" />
                  </div>
                ))}
                
                {/* Button Skeleton */}
                <div className="h-11 w-full bg-zen-muted animate-pulse rounded-full mt-4" />
              </div>
            </div>

            {/* Cột Phải (8/12 cột): Tên truyện, Tóm tắt & Danh sách Chương (Skeleton) */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-4">
                {/* Tên truyện Skeleton */}
                <div className="h-12 w-2/3 bg-zen-muted animate-pulse rounded-md" />
                
                {/* Tóm tắt Skeleton */}
                <div className="space-y-3 pt-4">
                  <div className="h-4 w-full bg-zen-muted animate-pulse rounded-md" />
                  <div className="h-4 w-full bg-zen-muted animate-pulse rounded-md" />
                  <div className="h-4 w-5/6 bg-zen-muted animate-pulse rounded-md" />
                  <div className="h-4 w-4/5 bg-zen-muted animate-pulse rounded-md" />
                </div>
              </div>

              {/* Danh sách mục lục Skeleton */}
              <div className="space-y-6">
                <div className="h-8 w-48 bg-zen-muted animate-pulse rounded-md border-b border-zen-muted pb-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex items-center p-4 rounded-xl border border-zen-muted/40 bg-white/10"
                    >
                      {/* Số chương Skeleton */}
                      <div className="h-4 w-6 bg-zen-muted animate-pulse rounded-md mr-3" />
                      {/* Tiêu đề chương Skeleton */}
                      <div className="h-4 w-40 bg-zen-muted animate-pulse rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
