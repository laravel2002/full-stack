'use client';

import Link from 'next/link';
import { BookOpen, Award, Compass, Search } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };
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

        {/* Hộp hành động góc phải (Tìm kiếm & Auth) */}
        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="rounded-full p-2 text-zen-ink/75 hover:bg-zen-muted/50 hover:text-zen-cinnabar transition-all duration-200"
            aria-label="Tìm kiếm truyện"
          >
            <Search className="h-5 w-5 stroke-[1.5]" />
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-zen-muted/30">
                  <span className="font-medium text-zen-ink">{user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Tủ sách của tôi
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    Quản trị viên
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-zen-ink hover:text-zen-cinnabar transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="items-center justify-center rounded-full bg-zen-cinnabar px-5 py-2 text-sm font-medium text-zen-paper hover:bg-opacity-90 shadow-sm transition-all duration-200 hover:scale-[1.02]"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
