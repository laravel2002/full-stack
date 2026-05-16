import { notFound } from 'next/navigation';
import { ReaderLayout } from '@/components/reader/reader-layout';
import { getChapter, getNovel, getAdjacentChapters } from '@/lib/reader/mock-novel';

interface PageProps {
  params: Promise<{
    slug: string;
    chapterNumber: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const chapterNumber = parseInt(resolvedParams.chapterNumber, 10);
  const chapter = getChapter(resolvedParams.slug, chapterNumber);
  
  if (!chapter) {
    return { title: 'Chapter Not Found' };
  }
  
  return {
    title: `Reading | ${chapter.title}`,
    description: 'Immersive reading experience',
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  
  const novel = getNovel(slug);
  const chapter = getChapter(slug, chapterNum);
  const adjacent = getAdjacentChapters(slug, chapterNum);

  if (!novel || !chapter) {
    notFound();
  }

  return (
    <ReaderLayout 
      chapterId={chapter.id}
      novelSlug={novel.slug}
      title={chapter.title} 
      content={chapter.content}
      allChapters={novel.chapters}
      currentChapterNumber={chapterNum}
      prevChapter={adjacent.prev?.number || null}
      nextChapter={adjacent.next?.number || null}
    />
  );
}
