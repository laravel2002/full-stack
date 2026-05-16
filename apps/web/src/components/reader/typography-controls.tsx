'use client';

import { useReaderStore, ContentWidth } from '@/stores/reader-store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Type, ALargeSmall, Minus, Plus, Maximize, Minimize, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TypographyControls() {
  const { 
    fontSize, setFontSize, 
    lineHeight, setLineHeight, 
    contentWidth, setContentWidth 
  } = useReaderStore();

  const widthOptions: { id: ContentWidth; label: string; icon: LucideIcon }[] = [
    { id: 'narrow', label: 'Narrow', icon: Minimize },
    { id: 'medium', label: 'Medium', icon: Type },
    { id: 'wide', label: 'Wide', icon: Maximize },
    { id: 'full', label: 'Full', icon: Maximize },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 w-72">
      {/* Font Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Font Size</label>
          <span className="text-xs text-muted-foreground">{fontSize}px</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 shrink-0"
            onClick={() => setFontSize(Math.max(12, fontSize - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Slider
            value={[fontSize]}
            min={12}
            max={32}
            step={1}
            onValueChange={(val) => setFontSize(Array.isArray(val) ? val[0] : val)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 shrink-0"
            onClick={() => setFontSize(Math.min(32, fontSize + 1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Line Height</label>
          <span className="text-xs text-muted-foreground">{lineHeight}</span>
        </div>
        <div className="flex items-center gap-4">
          <ALargeSmall className="h-4 w-4 text-muted-foreground shrink-0" />
          <Slider
            value={[lineHeight]}
            min={1.2}
            max={2.5}
            step={0.1}
            onValueChange={(val) => setLineHeight(Array.isArray(val) ? val[0] : val)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Content Width */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Content Width</label>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          {widthOptions.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => setContentWidth(id)}
              className={cn(
                'flex-1 h-8 px-2 transition-all',
                contentWidth === id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              title={label}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
