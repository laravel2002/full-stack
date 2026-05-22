'use client';

import Link from 'next/link';
import { BookOpen, Award, Compass, Search } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zen-muted/30 bg-zen-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Mặc Quán */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-wider text-zen-cinnabar transition-transform duration-300 group-hover:scale-105">
              墨館
            </span>
            <span className="font-serif text-lg font-medium tracking-widest text-zen-ink group-hover:text-zen-cinnabar transition-colors duration-300">
              Mặc Quán
            </span>
          </Link>
        </div>

        {/* Thanh tìm kiếm & Các link điều hướng tĩnh */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/library"
            className="flex items-center gap-2 font-sans text-sm font-medium text-zen-ink/80 hover:text-zen-cinnabar transition-colors duration-200"
          >
            <BookOpen className="h-4 w-4 stroke-[1.5]" />
            Thư Viện
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 font-sans text-sm font-medium text-zen-ink/80 hover:text-zen-cinnabar transition-colors duration-200"
          >
            <Award className="h-4 w-4 stroke-[1.5]" />
            Bảng Xếp Hạng
          </Link>
          <Link
            href="/categories"
            className="flex items-center gap-2 font-sans text-sm font-medium text-zen-ink/80 hover:text-zen-cinnabar transition-colors duration-200"
          >
            <Compass className="h-4 w-4 stroke-[1.5]" />
            Thể Loại
          </Link>
        </nav>

        {/* Hộp hành động góc phải (Tìm kiếm & Đọc ngay) */}
        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="rounded-full p-2 text-zen-ink/75 hover:bg-zen-muted/50 hover:text-zen-cinnabar transition-all duration-200"
            aria-label="Tìm kiếm truyện"
          >
            <Search className="h-5 w-5 stroke-[1.5]" />
          </Link>
          
          <Link
            href="/story/thien-long-bat-bo"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-zen-cinnabar px-5 py-2 text-sm font-medium text-zen-paper hover:bg-opacity-90 shadow-sm transition-all duration-200 hover:scale-[1.02]"
          >
            Đọc Ngay
          </Link>
        </div>
      </div>
    </header>
  );
}
