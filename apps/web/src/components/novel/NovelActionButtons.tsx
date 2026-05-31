'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { fetchApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

interface NovelActionButtonsProps {
  novelSlug: string;
  firstChapterId?: number;
}

export function NovelActionButtons({ novelSlug, firstChapterId }: NovelActionButtonsProps) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [lastReadChapterId, setLastReadChapterId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkProgress() {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchApi<any>('/progress');
        if (res.data) {
          const progress = res.data.find((p: any) => p.novel.slug === novelSlug);
          if (progress) {
            setLastReadChapterId(progress.chapter.id);
          }
        }
      } catch (error) {
        console.error('Failed to load progress', error);
      } finally {
        setLoading(false);
      }
    }

    checkProgress();
  }, [user, token, novelSlug]);

  if (loading) {
    return (
      <div className="flex gap-4">
        <Button disabled className="w-32 bg-zen-muted text-zen-gray">Đang tải...</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 mt-8">
      {lastReadChapterId ? (
        <Button onClick={() => router.push(`/read/${novelSlug}/${lastReadChapterId}`)} className="bg-zen-cinnabar hover:bg-zen-cinnabar/90 text-white rounded-full px-8 h-12 cursor-pointer">
          Đọc Tiếp <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      ) : (
        <Button onClick={() => firstChapterId && router.push(`/read/${novelSlug}/${firstChapterId}`)} className="bg-zen-ink hover:bg-black text-white rounded-full px-8 h-12 cursor-pointer" disabled={!firstChapterId}>
          Bắt Đầu Đọc <BookOpen className="ml-2 w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
