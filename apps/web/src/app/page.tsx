import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <h1 className="text-4xl font-bold">Antigravity Novel Platform</h1>
        <p className="text-muted-foreground max-w-md">
          Welcome to the future of immersive reading. Explore our new minimalist reader.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link 
            href="/novel/the-awakening/chapter/1" 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Open Reader MVP
          </Link>
          <Link 
            href="/library" 
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-medium hover:bg-secondary/80 transition-colors"
          >
            Go to Library
          </Link>
        </div>
      </main>
    </div>
  );
}
