"use client";

import { useLibraryStore } from "@/stores/library-store";
import { getNovel } from "@/lib/reader/mock-novel";
import { restoreReadingProgress } from "@/lib/reader/progress";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ContinueReading() {
  const { getContinueReading } = useLibraryStore();
  const [lastRead, setLastRead] = useState<ReturnType<
    typeof getContinueReading
  > | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLastRead(getContinueReading());
    setMounted(true);
  }, [getContinueReading]);

  if (!mounted) return null;
  if (!lastRead) return null;

  const novel = getNovel(lastRead.novelSlug);
  const chapter = novel?.chapters.find(
    (c) => c.number === lastRead.chapterNumber,
  );

  if (!novel || !chapter) return null;

  const progress = restoreReadingProgress(chapter.id);
  const percentage = progress ? progress.percentage : 0;

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">
            Continue Reading
          </h2>
          <h3 className="text-2xl font-bold text-foreground mb-1">
            {novel.title}
          </h3>
          <p className="text-muted-foreground">{chapter.title}</p>

          {percentage > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(percentage)}% read
              </span>
            </div>
          )}
        </div>

        <Button
          size="lg"
          variant="default"
          className="w-full sm:w-auto shrink-0 gap-2"
        >
          <Link href={`/novel/${novel.slug}/chapter/${chapter.number}`}>
            <BookOpen className="w-4 h-4" />
            Resume
          </Link>
        </Button>
      </div>
    </div>
  );
}
