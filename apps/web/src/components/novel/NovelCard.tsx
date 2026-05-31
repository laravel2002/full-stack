import Link from 'next/link';
import Image from 'next/image';
import { User, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NovelCardProps {
  novel: {
    id: number;
    title: string;
    slug: string;
    author: string;
    cover: string | null;
    description: string | null;
    _count?: {
      chapters: number;
    };
  };
}

export function NovelCard({ novel }: NovelCardProps) {
  const fallbackCover = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';
  
  return (
    <Link href={`/novel/${novel.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-zen-muted/30 hover:border-zen-cinnabar/40 hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative w-full aspect-[2/3] overflow-hidden bg-zen-muted/20">
            <Image
              src={novel.cover || fallbackCover}
              alt={novel.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {novel._count && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {novel._count.chapters}
              </div>
            )}
          </div>
          
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-serif text-lg font-bold text-zen-ink line-clamp-2 group-hover:text-zen-cinnabar transition-colors mb-2">
              {novel.title}
            </h3>
            <div className="flex items-center text-xs text-zen-gray mb-3 gap-1.5 font-sans">
              <User className="w-3.5 h-3.5" />
              <span className="truncate">{novel.author}</span>
            </div>
            
            <p className="text-sm text-zen-gray line-clamp-3 font-sans flex-1">
              {novel.description || 'Chưa có mô tả cho tác phẩm này.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
