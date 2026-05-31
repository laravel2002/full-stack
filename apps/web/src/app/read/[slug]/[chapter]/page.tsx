import { notFound } from 'next/navigation';
import { getChapter } from '@/lib/api';
import { ReaderUI } from '@/components/novel/ReaderUI';

export const dynamic = 'force-dynamic';

export default async function ReadChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter: chapterIdStr } = await params;
  const chapterId = parseInt(chapterIdStr, 10);

  if (isNaN(chapterId)) {
    notFound();
  }

  const res = await getChapter(chapterId);
  const data = res.data;

  if (!data) {
    notFound();
  }

  // Chuyển đổi dữ liệu từ API cho phù hợp với props của ReaderUI
  const chapterData = {
    id: data.id,
    title: data.title,
    content: data.content,
    order: data.order,
    story: {
      title: data.novel.title,
      slug: data.novel.slug,
    }
  };

  return (
    <ReaderUI 
      chapter={chapterData}
      prevId={res.prevId}
      nextId={res.nextId}
    />
  );
}
