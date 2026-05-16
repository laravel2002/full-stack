import { ContinueReading } from '@/components/library/continue-reading';
import { LibraryGrid } from '@/components/library/library-grid';
import { ReadingHistory } from '@/components/library/reading-history';
import { Book, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Library | Antigravity',
  description: 'Your personal reading library and history.',
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      {/* Simple Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link 
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Book className="w-5 h-5 text-primary" />
            My Library
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <ContinueReading />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">Saved Novels</h2>
            <LibraryGrid />
          </section>
          
          <aside>
            <ReadingHistory />
          </aside>
        </div>
      </main>
    </div>
  );
}
