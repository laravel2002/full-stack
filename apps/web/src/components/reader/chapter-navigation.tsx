import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChapterNavigationProps {
  novelSlug: string;
  prevChapter: number | null;
  nextChapter: number | null;
}

export function ChapterNavigation({
  novelSlug,
  prevChapter,
  nextChapter,
}: ChapterNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
      {prevChapter ? (
        <Button variant="outline" className="gap-2">
          <Link
            href={`/novel/${novelSlug}/chapter/${prevChapter}`}
            prefetch={true}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <div /> // Placeholder for flex-between spacing
      )}

      {nextChapter ? (
        <Button variant="outline" className="gap-2">
          <Link
            href={`/novel/${novelSlug}/chapter/${nextChapter}`}
            prefetch={true}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      ) : (
        <div className="text-muted-foreground text-sm">End of Novel</div>
      )}
    </div>
  );
}
