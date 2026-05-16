'use client';

import { useEffect, useState } from 'react';
import { useReaderStore } from '@/stores/reader-store';

export function ProgressBar() {
  const { readingProgress } = useReaderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-1 w-full bg-muted" />;

  return (
    <div className="h-1 w-full bg-muted/30 overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}
