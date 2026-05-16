import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReadingHistoryEntry {
  novelSlug: string;
  chapterNumber: number;
  updatedAt: number;
}

export interface LibraryState {
  savedNovels: string[];
  readingHistory: ReadingHistoryEntry[];
  
  toggleSaved: (novelSlug: string) => void;
  addToHistory: (novelSlug: string, chapterNumber: number) => void;
  getContinueReading: () => ReadingHistoryEntry | null;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      savedNovels: [],
      readingHistory: [],
      
      toggleSaved: (novelSlug) => set((state) => {
        const isSaved = state.savedNovels.includes(novelSlug);
        if (isSaved) {
          return { savedNovels: state.savedNovels.filter(slug => slug !== novelSlug) };
        } else {
          return { savedNovels: [novelSlug, ...state.savedNovels] };
        }
      }),
      
      addToHistory: (novelSlug, chapterNumber) => set((state) => {
        const newHistory = state.readingHistory.filter(entry => entry.novelSlug !== novelSlug);
        newHistory.unshift({
          novelSlug,
          chapterNumber,
          updatedAt: Date.now()
        });
        
        // Keep history manageable, max 100 entries
        if (newHistory.length > 100) {
          newHistory.pop();
        }
        
        return { readingHistory: newHistory };
      }),
      
      getContinueReading: () => {
        const history = get().readingHistory;
        return history.length > 0 ? history[0] : null;
      }
    }),
    {
      name: 'library-storage',
    }
  )
);
