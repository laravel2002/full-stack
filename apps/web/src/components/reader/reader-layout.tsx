'use client';

import { useEffect, useState } from 'react';
import { useReaderStore } from '@/stores/reader-store';
import { ReaderToolbar } from './reader-toolbar';
import { ReaderContent } from './reader-content';
import { cn } from '@/lib/utils';
import { Chapter } from '@/lib/reader/mock-novel';

interface ReaderLayoutProps {
  chapterId: string;
  novelSlug: string;
  title: string;
  content: string[];
  allChapters: Chapter[];
  currentChapterNumber: number;
  prevChapter: number | null;
  nextChapter: number | null;
}

export function ReaderLayout({ 
  chapterId, 
  novelSlug,
  title, 
  content,
  allChapters,
  currentChapterNumber,
  prevChapter,
  nextChapter
}: ReaderLayoutProps) {
  const { theme } = useReaderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn('min-h-screen antialiased transition-colors duration-300', theme)}>
      <div className="bg-background min-h-screen">
        <ReaderToolbar 
          title={title} 
          novelSlug={novelSlug}
          chapters={allChapters}
          currentChapterNumber={currentChapterNumber}
        />
        <ReaderContent 
          chapterId={chapterId} 
          content={content} 
          novelSlug={novelSlug}
          currentChapterNumber={currentChapterNumber}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
        />
      </div>
    </div>
  );
}
