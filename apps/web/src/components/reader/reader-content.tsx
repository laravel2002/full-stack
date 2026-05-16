"use client";

import { useEffect, useRef, useState } from "react";
import { useReaderStore } from "@/stores/reader-store";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { ChapterNavigation } from "./chapter-navigation";
import { cn } from "@/lib/utils";

interface ReaderContentProps {
  chapterId: string;
  content: string[];
  novelSlug: string;
  currentChapterNumber: number;
  prevChapter: number | null;
  nextChapter: number | null;
}

export function ReaderContent({ 
  chapterId, 
  content,
  novelSlug,
  currentChapterNumber,
  prevChapter,
  nextChapter
}: ReaderContentProps) {
  const { fontSize, lineHeight, contentWidth } = useReaderStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize reading progress tracking and restoration
  useReadingProgress({ chapterId, novelSlug, chapterNumber: currentChapterNumber, contentRef });

  // Avoid hydration mismatch for client-rendered styles
  useEffect(() => {
    setMounted(true);
  }, []);

  const maxWidthClass = {
    narrow: "max-w-xl",
    medium: "max-w-2xl",
    wide: "max-w-4xl",
    full: "max-w-none px-4 sm:px-8",
  }[contentWidth];

  if (!mounted) {
    return <div className="min-h-screen" />; // Placeholder during SSR
  }

  return (
    <main className="min-h-screen pt-24 pb-32">
      <div
        ref={contentRef}
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out px-6",
          maxWidthClass,
        )}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
        }}
      >
        {content.map((paragraph, idx) => (
          <p
            key={idx}
            className="mb-6 text-foreground/90 selection:bg-primary/20"
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-20 pt-8 border-t text-center text-muted-foreground text-sm">
          End of Chapter
        </div>
        
        <ChapterNavigation 
          novelSlug={novelSlug}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
        />
      </div>
    </main>
  );
}
