"use client";

import { useState } from "react";
import { List } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Chapter } from "@/lib/reader/mock-novel";

interface ChapterSelectorProps {
  novelSlug: string;
  chapters: Pick<Chapter, 'id' | 'chapterNumber' | 'title'>[];
  currentChapterNumber: number;
}

export function ChapterSelector({
  novelSlug,
  chapters,
  currentChapterNumber,
}: ChapterSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "text-muted-foreground hover:text-foreground",
        )}
      >
        <List className="w-5 h-5" />
        <span className="sr-only">Chapter List</span>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 max-h-80 flex flex-col" align="start">
        <div className="p-3 border-b border-border bg-muted/30 font-medium text-sm">
          Chapters
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/novel/${novelSlug}/chapter/${chapter.chapterNumber}`}
              prefetch={true}
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start font-normal text-sm",
                chapter.chapterNumber === currentChapterNumber
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {chapter.title}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
