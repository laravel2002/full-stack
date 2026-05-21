"use client";

import { useLibraryStore } from "@/stores/library-store";
import { getNovel, Novel } from "@/lib/reader/mock-novel";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResolvedHistoryEntry {
  novel: Novel;
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
  };
  timeString: string;
}

export function ReadingHistory() {
  const { readingHistory } = useLibraryStore();
  const [resolvedHistory, setResolvedHistory] = useState<ResolvedHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const recentHistory = readingHistory.slice(0, 5);

  useEffect(() => {
    if (recentHistory.length === 0) {
      setLoading(false);
      return;
    }

    // Tải thông tin bất đồng bộ cho toàn bộ danh sách lịch sử
    const loadHistory = async () => {
      try {
        const resolved = await Promise.all(
          recentHistory.map(async (entry) => {
            try {
              const novel = await getNovel(entry.novelSlug);
              if (!novel) return null;
              
              const chapter = novel.chapters.find(
                (c: any) => (c.chapterNumber || c.number) === entry.chapterNumber
              );
              if (!chapter) return null;

              const date = new Date(entry.updatedAt);
              const timeString = date.toLocaleDateString("vi-VN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return {
                novel,
                chapter: {
                  id: chapter.id,
                  chapterNumber: chapter.chapterNumber || (chapter as any).number || entry.chapterNumber,
                  title: chapter.title,
                },
                timeString,
              };
            } catch (err) {
              console.error(`Không thể nạp lịch sử cho ${entry.novelSlug}:`, err);
              return null;
            }
          })
        );
        // Lọc bỏ những kết quả bị null
        setResolvedHistory(resolved.filter((item): item is ResolvedHistoryEntry => item !== null));
      } catch (err) {
        console.error("Lỗi khi tải lịch sử đọc:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [readingHistory]);

  if (loading || resolvedHistory.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-bold flex items-center gap-2 text-zen-ink">
        <Clock className="w-5 h-5 text-zen-cinnabar" />
        Lịch Sử Đọc Gần Đây
      </h3>

      <div className="flex flex-col gap-3">
        {resolvedHistory.map((item, idx) => (
          <Link
            key={`${item.novel.slug}-${item.chapter.chapterNumber}-${idx}`}
            href={`/read/${item.novel.slug}/${item.chapter.chapterNumber}`}
            className="flex items-center justify-between p-4 rounded-xl border border-zen-muted/40 bg-white/20 hover:border-zen-cinnabar/30 hover:bg-white/50 transition-all duration-200"
          >
            <div>
              <h4 className="font-serif font-bold text-zen-ink">{item.novel.title}</h4>
              <p className="font-sans text-sm text-zen-gray mt-1">{item.chapter.title}</p>
            </div>
            <div className="font-sans text-xs text-zen-gray whitespace-nowrap ml-4 italic">
              {item.timeString}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
