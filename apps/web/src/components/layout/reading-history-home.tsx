'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import { useLibraryStore } from '@/stores/library-store';
import { getNovel } from '@/lib/reader/mock-novel';

interface ReadingProgress {
  title: string;
  slug: string;
  author: string;
  coverUrl: string;
  chapterNum: number;
  chapterTitle: string;
  timeString: string;
}

export function ReadingHistoryHome() {
  const { readingHistory } = useLibraryStore();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || readingHistory.length === 0) {
      setLoading(false);
      return;
    }

    const latest = readingHistory[0];

    async function loadLatestRead() {
      try {
        const novel = await getNovel(latest.novelSlug);
        if (novel) {
          const chapter = novel.chapters.find(
            (c: any) => (c.chapterNum || c.chapterNumber || c.number) === latest.chapterNumber
          );
          
          const date = new Date(latest.updatedAt);
          const timeString = date.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          setProgress({
            title: novel.title,
            slug: novel.slug,
            author: novel.author,
            coverUrl: novel.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
            chapterNum: latest.chapterNumber,
            chapterTitle: chapter ? chapter.title : `Chương ${latest.chapterNumber}`,
            timeString,
          });
        }
      } catch (err) {
        console.error('[Mặc Quán] Lỗi tải lịch sử đọc trang chủ:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLatestRead();
  }, [readingHistory, mounted]);

  if (!mounted || loading || !progress) {
    return null;
  }

  return (
    <div className="rounded-xl border border-zen-muted/60 bg-[#fbf9f4]/60 p-5 backdrop-blur-sm shadow-sm hover:border-zen-cinnabar/30 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs text-zen-cinnabar font-semibold tracking-wider uppercase font-sans">
            <Clock className="h-3.5 w-3.5 animate-pulse" /> ĐỌC TIẾP TÁC PHẨM
          </div>
          
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-zen-ink group-hover:text-zen-cinnabar transition-colors truncate">
              {progress.title}
            </h4>
            <p className="font-sans text-sm text-zen-ink/80 truncate">
              {progress.chapterTitle.replace(/^Chương \d+:\s*/, '')}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zen-gray font-sans pt-1">
            <span>Tác giả: {progress.author}</span>
            <span>•</span>
            <span className="italic">Đọc lúc: {progress.timeString}</span>
          </div>
        </div>

        <Link
          href={`/read/${progress.slug}/${progress.chapterNum}`}
          className="inline-flex items-center justify-center rounded-full bg-zen-ink h-10 w-10 text-zen-paper hover:bg-zen-cinnabar hover:scale-105 shadow-sm transition-all duration-200 shrink-0"
          title={`Đọc tiếp ${progress.title}`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
