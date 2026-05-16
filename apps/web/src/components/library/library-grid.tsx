"use client";

import { useLibraryStore } from "@/stores/library-store";
import { getAllNovels } from "@/lib/reader/mock-novel";
import { BookMarked } from "lucide-react";
import Link from "next/link";

export function LibraryGrid() {
  const { savedNovels } = useLibraryStore();
  const allNovels = getAllNovels();

  const displayNovels = allNovels.filter((n) => savedNovels.includes(n.slug));

  if (displayNovels.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-muted/20 border border-dashed rounded-xl">
        <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-1">
          Your library is empty
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Novels you save will appear here. Start exploring to build your
          personal library.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayNovels.map((novel) => (
        <Link
          key={novel.slug}
          href={`/novel/${novel.slug}/chapter/1`}
          className="group block"
        >
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden border mb-3 flex items-center justify-center group-hover:border-primary/50 transition-colors">
            <span className="text-muted-foreground font-medium px-4 text-center">
              Cover Image Placeholder
            </span>
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {novel.title}
          </h4>
        </Link>
      ))}
    </div>
  );
}
