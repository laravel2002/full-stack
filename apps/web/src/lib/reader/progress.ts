export interface ChapterProgress {
  scrollY: number;
  percentage: number;
  updatedAt: number;
}

const STORAGE_KEY = 'novel_reading_progress';

function getStorage(): Record<string, ChapterProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to parse reading progress from localStorage', error);
    return {};
  }
}

export function saveReadingProgress(chapterId: string, scrollY: number, percentage: number): void {
  if (typeof window === 'undefined') return;
  try {
    const currentData = getStorage();
    currentData[chapterId] = {
      scrollY,
      percentage,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  } catch (error) {
    console.error('Failed to save reading progress to localStorage', error);
  }
}

export function restoreReadingProgress(chapterId: string): ChapterProgress | null {
  const data = getStorage();
  return data[chapterId] || null;
}

export function clearReadingProgress(chapterId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (chapterId) {
      const data = getStorage();
      delete data[chapterId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear reading progress from localStorage', error);
  }
}
