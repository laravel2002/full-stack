import { useEffect, useRef, useCallback } from 'react';
import { useReaderStore } from '@/stores/reader-store';
import { useLibraryStore } from '@/stores/library-store';
import { saveReadingProgress, restoreReadingProgress } from '@/lib/reader/progress';

interface UseReadingProgressProps {
  chapterId: string;
  novelSlug: string;
  chapterNumber: number;
  contentRef: React.RefObject<HTMLElement | null>;
}

export function useReadingProgress({ chapterId, novelSlug, chapterNumber, contentRef }: UseReadingProgressProps) {
  const { setReadingProgress } = useReaderStore();
  const { addToHistory } = useLibraryStore();
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(true);

  const calculateAndSaveProgress = useCallback(() => {
    if (!contentRef.current) return;
    if (isRestoringRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const windowHeight = scrollHeight - clientHeight;
    
    let percentage = 0;
    if (windowHeight > 0) {
      percentage = Math.min(100, Math.max(0, (scrollTop / windowHeight) * 100));
    } else {
      percentage = 100; // If content doesn't overflow, it's 100% read
    }

    setReadingProgress(percentage);
    saveReadingProgress(chapterId, scrollTop, percentage);
    addToHistory(novelSlug, chapterNumber);
  }, [chapterId, novelSlug, chapterNumber, contentRef, setReadingProgress, addToHistory]);

  // Initial Restore
  useEffect(() => {
    const restore = () => {
      const savedProgress = restoreReadingProgress(chapterId);
      
      if (savedProgress && savedProgress.scrollY > 0) {
        // Use auto behavior for an invisible, instant jump
        window.scrollTo({ top: savedProgress.scrollY, behavior: 'auto' });
        setReadingProgress(savedProgress.percentage);
      }
      
      // Give the browser a tiny delay to finish the scroll before enabling tracking
      // This prevents the instant scroll from immediately overwriting the saved progress
      // due to slightly delayed scroll events.
      setTimeout(() => {
        isRestoringRef.current = false;
        calculateAndSaveProgress();
      }, 100);
    };

    // We wait for the next frame to ensure the DOM is painted and scrollHeight is accurate
    requestAnimationFrame(() => {
      restore();
    });
  }, [chapterId, setReadingProgress, calculateAndSaveProgress]);

  // Scroll Tracking with Throttle
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringRef.current) return;

      if (throttleTimeoutRef.current) {
        return;
      }

      throttleTimeoutRef.current = setTimeout(() => {
        calculateAndSaveProgress();
        throttleTimeoutRef.current = null;
      }, 500); // 500ms throttle to prevent excessive localStorage writes
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [calculateAndSaveProgress]);
}
