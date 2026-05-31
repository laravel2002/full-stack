'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Settings, RotateCcw, ListOrdered } from 'lucide-react';
import { ProgressTracker } from './ProgressTracker';

interface ReaderUIProps {
  chapter: {
    id: number;
    title: string;
    content: string;
    order: number;
    story: { title: string; slug: string };
  };
  prevId: number | null;
  nextId: number | null;
}

export function ReaderUI({ chapter, prevId, nextId }: ReaderUIProps) {
  const [fontSize, setFontSize] = useState<number>(20);
  const [lineHeight, setLineHeight] = useState<string>('relaxed');
  const [theme, setTheme] = useState<'paper' | 'sepia' | 'dark' | 'xuyenchi'>('paper');
  const [showToolbar, setShowToolbar] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia', 'xuyenchi');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia');
    } else if (theme === 'xuyenchi') {
      root.classList.add('xuyenchi');
    }
  }, [theme]);

  const paragraphs = chapter.content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 pb-24 md:pb-16 bg-[#fbf9f4] dark:bg-[#141512] text-zen-ink dark:text-[#d1cdb8]">
      
      {/* Auto Save Progress */}
      <ProgressTracker chapterId={chapter.id} />

      <header className="w-full py-4 px-6 border-b border-zen-muted/20 flex items-center justify-between sticky top-0 bg-inherit z-40 backdrop-blur-md">
        <Link 
          href={`/novel/${chapter.story.slug}`}
          className="flex items-center gap-1.5 font-sans text-xs text-zen-gray hover:text-zen-cinnabar transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Chi tiết truyện
        </Link>
        <span className="font-serif text-sm tracking-widest uppercase truncate max-w-[40%] text-zen-gray">
          {chapter.story.title}
        </span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowToolbar(!showToolbar)}
            className="rounded-full p-2 hover:bg-zen-muted/50 hover:text-zen-cinnabar transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {showToolbar && (
        <div className="fixed top-16 right-6 z-50 w-72 rounded-2xl border border-zen-muted/60 bg-white/95 dark:bg-zinc-900/95 p-5 shadow-lg backdrop-blur-md">
          <div className="space-y-6">
            <h4 className="font-serif text-sm font-bold border-b border-zen-muted/30 pb-2">Tùy Chọn Đọc</h4>
            
            <div className="space-y-2">
              <span className="font-sans text-xs opacity-80 block">Cỡ chữ: {fontSize}px</span>
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => setFontSize(Math.max(14, fontSize - 1))} className="flex-1 rounded-lg border border-zen-muted/50 py-1.5 hover:border-zen-cinnabar">A-</button>
                <button onClick={() => setFontSize(20)} className="px-2 py-1.5"><RotateCcw className="h-3.5 w-3.5" /></button>
                <button onClick={() => setFontSize(Math.min(32, fontSize + 1))} className="flex-1 rounded-lg border border-zen-muted/50 py-1.5 hover:border-zen-cinnabar">A+</button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-sans text-xs opacity-80 block">Màu nền:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button onClick={() => setTheme('paper')} className="rounded-lg py-2 border bg-[#fbf9f4] text-zinc-800">Giấy Tuyên</button>
                <button onClick={() => setTheme('xuyenchi')} className="rounded-lg py-2 border bg-[#efe8d4] text-[#2d261e]">Xuyến Chỉ</button>
                <button onClick={() => setTheme('sepia')} className="rounded-lg py-2 border bg-[#f4edd8] text-[#433422]">Sepia</button>
                <button onClick={() => setTheme('dark')} className="rounded-lg py-2 border bg-[#141512] text-zinc-300">Mực Đêm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-[800px] mx-auto px-6 sm:px-8 mt-12 md:mt-20 w-full">
        <article className="space-y-12">
          <div className="text-center space-y-6 border-b border-zen-muted/30 pb-12 mb-12">
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight tracking-wide text-zen-cinnabar">
              {chapter.title}
            </h1>
          </div>

          <div 
            className="font-serif tracking-wide space-y-6 text-justify"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight === 'normal' ? '1.6' : '2.0' 
            }}
          >
            {paragraphs.map((p, idx) => (
              <p key={idx} className="indent-8">{p}</p>
            ))}
          </div>
        </article>

        <div className="flex items-center justify-between border-t border-zen-muted/30 pt-10 mt-20 pb-16">
          {prevId ? (
            <Link href={`/read/${chapter.story.slug}/${prevId}`} className="inline-flex items-center gap-2 rounded-full border border-zen-muted/60 px-6 py-2.5 font-semibold hover:border-zen-cinnabar hover:text-zen-cinnabar transition-all">
              <ArrowLeft className="h-4 w-4" /> Chương Trước
            </Link>
          ) : <div className="w-32" />}

          <Link href={`/novel/${chapter.story.slug}`} className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <ListOrdered className="h-5 w-5" /> Mục Lục
          </Link>

          {nextId ? (
            <Link href={`/read/${chapter.story.slug}/${nextId}`} className="inline-flex items-center gap-2 rounded-full bg-zen-cinnabar text-white px-6 py-2.5 font-semibold hover:bg-opacity-90 transition-all">
              Chương Sau <ArrowRight className="h-4 w-4" />
            </Link>
          ) : <div className="w-32" />}
        </div>
      </main>
    </div>
  );
}
