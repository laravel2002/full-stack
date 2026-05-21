"use client";

import { useLibraryStore } from "@/stores/library-store";
import { getAllNovels, Novel } from "@/lib/reader/mock-novel";
import { BookMarked } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LibraryGrid() {
  const { savedNovels } = useLibraryStore();
  const [displayNovels, setDisplayNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllNovels()
      .then((novels) => {
        const filtered = novels.filter((n) => savedNovels.includes(n.slug));
        setDisplayNovels(filtered);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách tiểu thuyết thư viện:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [savedNovels]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="text-sm text-zen-gray animate-pulse font-sans">Đang tải thư viện sách...</span>
      </div>
    );
  }

  if (displayNovels.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-muted/20 border border-dashed rounded-xl border-zen-muted">
        <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50 text-zen-gray" />
        <h3 className="text-lg font-medium text-zen-ink mb-1 font-serif">
          Thư viện trống
        </h3>
        <p className="text-zen-gray text-sm max-w-sm mx-auto font-sans">
          Truyện bạn lưu sẽ xuất hiện ở đây. Hãy khám phá và thêm truyện vào thư viện cá nhân của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayNovels.map((novel) => (
        <Link
          key={novel.slug}
          href={`/story/${novel.slug}`}
          className="group block"
        >
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden border mb-3 flex items-center justify-center group-hover:border-zen-cinnabar/50 transition-colors bg-white/40 border-zen-muted/60">
            {novel.coverUrl ? (
              <img
                src={novel.coverUrl}
                alt={novel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-zen-gray font-medium px-4 text-center font-sans text-xs">
                Ảnh bìa Mặc Quán
              </span>
            )}
          </div>
          <h4 className="font-semibold text-zen-ink group-hover:text-zen-cinnabar transition-colors line-clamp-2 font-serif text-base">
            {novel.title}
          </h4>
        </Link>
      ))}
    </div>
  );
}
