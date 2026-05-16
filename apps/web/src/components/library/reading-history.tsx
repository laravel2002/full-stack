"use client";

import { useLibraryStore } from "@/stores/library-store";
import { getNovel } from "@/lib/reader/mock-novel";
import { Clock } from "lucide-react";
import Link from "next/link";

export function ReadingHistory() {
  const { readingHistory } = useLibraryStore();

  // Skip the first one if we want to show it in Continue Reading instead
  // But for this component, we'll just show the last 5
  const recentHistory = readingHistory.slice(0, 5);

  if (recentHistory.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Recent History
      </h3>

      <div className="flex flex-col gap-3">
        {recentHistory.map((entry, idx) => {
          const novel = getNovel(entry.novelSlug);
          const chapter = novel?.chapters.find(
            (c) => c.number === entry.chapterNumber,
          );

          if (!novel || !chapter) return null;

          // Simple time ago formatter
          const date = new Date(entry.updatedAt);
          const timeString = date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Link
              key={`${entry.novelSlug}-${entry.chapterNumber}-${idx}`}
              href={`/novel/${novel.slug}/chapter/${chapter.number}`}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
            >
              <div>
                <h4 className="font-medium text-foreground">{novel.title}</h4>
                <p className="text-sm text-muted-foreground">{chapter.title}</p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                {timeString}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
