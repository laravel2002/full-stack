'use client';

import { useLibraryStore } from '@/stores/library-store';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  novelSlug: string;
}

export function FavoriteButton({ novelSlug }: FavoriteButtonProps) {
  const { savedNovels, toggleSaved } = useLibraryStore();
  const isSaved = savedNovels.includes(novelSlug);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-muted-foreground hover:text-foreground"
      onClick={() => toggleSaved(novelSlug)}
    >
      {isSaved ? (
        <BookmarkCheck className="w-5 h-5 text-primary" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
      <span className="sr-only">Toggle Bookmark</span>
    </Button>
  );
}
