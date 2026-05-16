'use client';

import { useState, useEffect } from 'react';
import { Settings, ChevronLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TypographyControls } from './typography-controls';
import { ThemeSwitcher } from './theme-switcher';
import { ProgressBar } from './progress-bar';
import { ChapterSelector } from './chapter-selector';
import { FavoriteButton } from '@/components/library/favorite-button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Chapter } from '@/lib/reader/mock-novel';

interface ReaderToolbarProps {
  title: string;
  novelSlug: string;
  chapters: Pick<Chapter, 'id' | 'chapterNumber' | 'title'>[];
  currentChapterNumber: number;
}

export function ReaderToolbar({ title, novelSlug, chapters, currentChapterNumber }: ReaderToolbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for background styling
      setIsScrolled(currentScrollY > 20);
      
      // Hide toolbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hover zone at the top to reveal toolbar if hidden
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.clientY < 100 && !isVisible) {
      setIsVisible(true);
    }
  };

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-full h-16 z-40" 
        onMouseMove={handleMouseMove}
      />
      <div
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out',
          isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent border-transparent',
          isVisible ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              href="/"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "shrink-0 text-muted-foreground hover:text-foreground")}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Link>
            <h1 className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-sm">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ChapterSelector 
                novelSlug={novelSlug} 
                chapters={chapters} 
                currentChapterNumber={currentChapterNumber} 
              />
            </div>
            
            <FavoriteButton novelSlug={novelSlug} />
            
            <Popover>
              <PopoverTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-muted-foreground hover:text-foreground")}>
                <Settings className="w-5 h-5" />
                <span className="sr-only">Display Settings</span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-4 border-b">
                  <ThemeSwitcher />
                </div>
                <TypographyControls />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full translate-y-full">
          <ProgressBar />
        </div>
      </div>
    </>
  );
}
