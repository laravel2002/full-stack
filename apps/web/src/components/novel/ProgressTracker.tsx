'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { fetchApi } from '@/lib/api';

export function ProgressTracker({ chapterId }: { chapterId: number }) {
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!user || !token) return;

    // Fire and forget auto-save progress
    fetchApi('/progress', {
      method: 'POST',
      body: JSON.stringify({ chapterId }),
    }).catch(err => console.error('Failed to save progress:', err));
  }, [user, token, chapterId]);

  return null;
}
