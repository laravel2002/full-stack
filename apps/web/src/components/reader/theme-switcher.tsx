'use client';

import { useReaderStore } from '@/stores/reader-store';
import { Button } from '@/components/ui/button';
import { Moon, Sun, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
  const { theme, setTheme } = useReaderStore();

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'sepia', icon: BookOpen, label: 'Sepia' },
    { id: 'dark', icon: Moon, label: 'Dark' },
  ] as const;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      {themes.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          size="sm"
          onClick={() => setTheme(id)}
          className={cn(
            'flex-1 gap-2 transition-all',
            theme === id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
}
