"use client";

import { useLibraryStore } from "@/stores/library-store";
import { getNovel, Novel } from "@/lib/reader/mock-novel";
import { restoreReadingProgress } from "@/lib/reader/progress";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ContinueReading() {
  const { getContinueReading } = useLibraryStore();
  const [lastRead, setLastRead] = useState<ReturnType<
    typeof getContinueReading
  > | null>(null);
  const [mounted, setMounted] = useState(false);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapter, setChapter] = useState<any | null>(null);

  useEffect(() => {
    setLastRead(getContinueReading());
    setMounted(true);
  }, [getContinueReading]);

  // Xử lý nạp dữ liệu truyện bất đồng bộ
  useEffect(() => {
    if (lastRead) {
      getNovel(lastRead.novelSlug)
        .then((resolvedNovel) => {
          setNovel(resolvedNovel);
          const foundChapter = resolvedNovel?.chapters.find(
            (c: any) => (c.chapterNumber || c.number) === lastRead.chapterNumber
          );
          setChapter(foundChapter || null);
        })
        .catch((err) => {
          console.error("Không thể lấy thông tin truyện tiếp tục đọc:", err);
        });
    }
  }, [lastRead]);

  if (!mounted) return null;
  if (!lastRead) return null;
  if (!novel || !chapter) return null;

  const progress = restoreReadingProgress(chapter.id);
  const percentage = progress ? progress.percentage : 0;
  const chapterNumber = chapter.chapterNumber || chapter.number || lastRead.chapterNumber;

  return (
    <div className="bg-card border border-zen-muted/60 rounded-xl p-6 shadow-sm mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-zen-cinnabar mb-1 uppercase tracking-widest">
            Đang đọc dở
          </h2>
          <h3 className="text-2xl font-serif font-bold text-zen-ink">
            {novel.title}
          </h3>
          <p className="text-sm text-zen-gray font-sans">{chapter.title}</p>

          {percentage > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <div className="w-48 h-1.5 bg-zen-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zen-cinnabar transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-zen-gray italic">
                Đã đọc {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/read/${novel.slug}/${chapterNumber}`}
          className={cn(
            buttonVariants({ size: "lg", variant: "default" }),
            "w-full sm:w-auto shrink-0 gap-2 rounded-full bg-zen-ink text-zen-paper hover:bg-zen-cinnabar shadow-sm transition-all duration-200 flex items-center justify-center"
          )}
        >
          <BookOpen className="w-4 h-4 stroke-[1.5]" />
          Đọc Tiếp
        </Link>
      </div>
    </div>
  );
}
