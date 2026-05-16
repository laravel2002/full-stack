import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContentWidth = 'narrow' | 'medium' | 'wide' | 'full';
export type Theme = 'light' | 'dark' | 'sepia';

export interface ReaderState {
  fontSize: number;
  lineHeight: number;
  contentWidth: ContentWidth;
  theme: Theme;
  readingProgress: number;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setContentWidth: (width: ContentWidth) => void;
  setTheme: (theme: Theme) => void;
  setReadingProgress: (progress: number) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      fontSize: 18,
      lineHeight: 1.6,
      contentWidth: 'medium',
      theme: 'dark', // Defaulting to dark as per constraints
      readingProgress: 0,
      setFontSize: (size) => set({ fontSize: size }),
      setLineHeight: (height) => set({ lineHeight: height }),
      setContentWidth: (width) => set({ contentWidth: width }),
      setTheme: (theme) => set({ theme }),
      setReadingProgress: (progress) => set({ readingProgress: progress }),
    }),
    {
      name: 'reader-preferences',
      partialize: (state) => ({
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
        contentWidth: state.contentWidth,
        theme: state.theme,
        // We might want to persist progress per chapter, but for MVP we just keep it globally.
      }),
    }
  )
);
