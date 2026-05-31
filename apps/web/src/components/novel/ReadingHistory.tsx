'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { fetchApi } from '@/lib/api';
import { BookOpen, ChevronRight, Clock } from 'lucide-react';

interface ProgressData {
  id: number;
  updatedAt: string;
  novel: {
    id: number;
    title: string;
    slug: string;
    cover: string | null;
  };
  chapter: {
    id: number;
    title: string;
    order: number;
  };
}

export function ReadingHistory() {
  const { user, token } = useAuthStore();
  const [progressList, setProgressList] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      if (!user || !token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetchApi<any>('/progress');
        if (res.data) {
          setProgressList(res.data);
        }
      } catch (error) {
        console.error('Failed to load progress', error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [user, token]);

  if (!user || loading || progressList.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between border-b border-zen-muted/40 pb-3 mb-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-zen-ink flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-zen-cinnabar" /> Tủ sách đang đọc
        </h2>
        <Link href="/profile" className="text-sm text-zen-cinnabar hover:underline font-sans font-medium">
          Xem tất cả &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressList.slice(0, 3).map((item) => (
          <Link
            key={item.id}
            href={`/read/${item.novel.slug}/${item.chapter.id}`}
            className="group flex flex-col rounded-xl border border-zen-muted/40 bg-white p-4 shadow-sm hover:border-zen-cinnabar/40 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-serif font-bold text-zen-ink line-clamp-1 group-hover:text-zen-cinnabar transition-colors">
                {item.novel.title}
              </h3>
              <ChevronRight className="h-4 w-4 text-zen-gray opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-zen-gray font-sans mt-auto">
              <span className="truncate flex-1">Đang đọc: {item.chapter.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
