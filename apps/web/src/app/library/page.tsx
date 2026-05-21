"use client";

import { useLibraryStore } from "@/stores/library-store";
import { getStories } from "@/lib/api";
import {
  Book,
  ChevronLeft,
  Search,
  BookOpen,
  Heart,
  Clock,
  BookMarked,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { restoreReadingProgress } from "@/lib/reader/progress";

// Định nghĩa kiểu dữ liệu truyện từ API thực tế
interface StoryChapter {
  id: string;
  chapterNum: number;
  title: string;
}

interface Story {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  coverUrl?: string;
  viewCount: number;
  chapters?: StoryChapter[];
}

// Hàm ánh xạ thể loại nhất quán dựa trên slug hoặc tiêu đề
function getStoryCategory(slug: string, title: string): string {
  if (slug === "thien-long-bat-bo") return "Võ Hiệp";
  if (slug === "dao-duc-kinh") return "Triết Học";
  if (slug === "dong-chu-liet-quoc") return "Lịch Sử";
  if (slug === "nam-hoa-kinh") return "Thiền Tông";
  if (slug === "kinh-thi") return "Thi Ca";

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const categories = ["Võ Hiệp", "Triết Học", "Lịch Sử", "Thiền Tông", "Thi Ca"];
  return categories[Math.abs(hash) % categories.length];
}

export default function LibraryPage() {
  const { savedNovels, readingHistory, getContinueReading } = useLibraryStore();
  const [mounted, setMounted] = useState(false);

  // Quản lý danh sách truyện từ API
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc và Tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [activeTab, setActiveTab] = useState<"explore" | "saved">("explore");

  // Dùng useTransition để tối ưu hóa việc chuyển đổi bộ lọc mượt mà
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);

    // Nạp dữ liệu truyện từ API backend thực tế hoặc dữ liệu dự phòng
    const loadStories = async () => {
      try {
        setLoading(true);
        const data = await getStories();
        setStories(data);
      } catch (error) {
        console.error("[Mặc Quán] Lỗi khi tải danh sách tác phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  // Lấy truyện đang đọc dở gần nhất
  const [lastReadProgress, setLastReadProgress] = useState<any>(null);
  useEffect(() => {
    if (mounted && stories.length > 0) {
      const continueRead = getContinueReading();
      if (continueRead) {
        const foundStory = stories.find(s => s.slug === continueRead.novelSlug);
        if (foundStory) {
          const foundChapter = foundStory.chapters?.find(
            c => c.chapterNum === continueRead.chapterNumber
          ) || { id: "c1", chapterNum: continueRead.chapterNumber, title: `Chương ${continueRead.chapterNumber}` };

          const progress = restoreReadingProgress(foundChapter.id);
          const percentage = progress ? progress.percentage : 0;

          setLastReadProgress({
            story: foundStory,
            chapter: foundChapter,
            percentage
          });
        }
      }
    }
  }, [mounted, stories, getContinueReading]);

  // Giải quyết danh sách lịch sử đọc từ store và API
  const [resolvedHistory, setResolvedHistory] = useState<any[]>([]);
  useEffect(() => {
    if (mounted && stories.length > 0 && readingHistory.length > 0) {
      const recentHistory = readingHistory.slice(0, 4);
      const resolved = recentHistory.map(entry => {
        const story = stories.find(s => s.slug === entry.novelSlug);
        if (!story) return null;
        const chapter = story.chapters?.find(c => c.chapterNum === entry.chapterNumber) || {
          id: `ch-${entry.chapterNumber}`,
          chapterNum: entry.chapterNumber,
          title: `Chương ${entry.chapterNumber}`
        };

        const date = new Date(entry.updatedAt);
        const timeString = date.toLocaleDateString("vi-VN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        return {
          story,
          chapter,
          timeString
        };
      }).filter(item => item !== null);

      setResolvedHistory(resolved);
    }
  }, [mounted, stories, readingHistory]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <span className="text-sm text-zen-gray animate-pulse font-sans">Đang mở cổng Thư Các...</span>
      </div>
    );
  }

  // Danh sách thể loại để lọc
  const categories = ["Tất Cả", "Võ Hiệp", "Triết Học", "Lịch Sử", "Thiền Tông", "Thi Ca"];

  // Logic lọc và tìm kiếm truyện
  const filteredStories = stories.filter(story => {
    // 1. Tìm theo từ khóa (tiêu đề hoặc tác giả)
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Lọc theo thể loại
    const storyCat = getStoryCategory(story.slug, story.title);
    const matchesCategory = selectedCategory === "Tất Cả" || storyCat === selectedCategory;

    // 3. Lọc theo Tab (Khám phá hoặc Đã lưu)
    const matchesTab = activeTab === "explore" || savedNovels.includes(story.slug);

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20 font-[family-name:var(--font-geist-sans)]">
      {/* Header tối giản cổ phong */}
      <header className="sticky top-0 z-40 w-full border-b border-zen-muted bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-zen-gray hover:text-zen-ink transition-colors flex items-center gap-1 text-sm font-sans"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
              <span>Trang chủ</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 font-serif font-bold text-lg text-zen-ink">
            <Book className="w-5 h-5 text-zen-cinnabar stroke-[1.5]" />
            Mặc Quán Thư Các
          </div>

          <div className="w-20"></div> {/* Giữ cân đối layout */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Lời đề từ cổ phong đầu trang */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zen-ink tracking-wide">
            Thư Các Mặc Quán
          </h1>
          <p className="text-sm italic font-serif text-zen-gray/80 px-4 leading-relaxed">
            "Sách mở ngàn năm soi vạn dặm, Trà thơm một tách tĩnh tâm thiền."
          </p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zen-cinnabar/40 to-transparent mx-auto mt-2" />
        </div>

        {/* Khối truyện đang đọc dở (Zen Continue Reading Card) */}
        {lastReadProgress && (
          <div className="bg-white/40 dark:bg-black/10 border border-zen-muted rounded-2xl p-6 shadow-sm mb-10 transition-all duration-300 hover:border-zen-cinnabar/20 backdrop-blur-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-20 bg-muted rounded-md overflow-hidden border border-zen-muted shrink-0 hidden sm:block shadow-xs">
                  {lastReadProgress.story.coverUrl ? (
                    <img
                      src={lastReadProgress.story.coverUrl}
                      alt={lastReadProgress.story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zen-muted flex items-center justify-center text-[10px] text-zen-gray font-serif">Bìa sách</div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-zen-cinnabar/10 text-zen-cinnabar px-2 py-0.5 rounded-full font-sans font-medium uppercase tracking-wider">
                      Đang đọc dở
                    </span>
                    <span className="text-xs text-zen-gray font-sans">
                      {getStoryCategory(lastReadProgress.story.slug, lastReadProgress.story.title)}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-zen-ink line-clamp-1">
                    {lastReadProgress.story.title}
                  </h3>
                  <p className="text-sm text-zen-gray font-sans flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 opacity-70" />
                    {lastReadProgress.chapter.title}
                  </p>

                  {lastReadProgress.percentage > 0 && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-36 sm:w-48 h-1 bg-zen-muted/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zen-cinnabar transition-all duration-300"
                          style={{ width: `${lastReadProgress.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-zen-gray italic font-serif">
                        Đã đọc {Math.round(lastReadProgress.percentage)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/read/${lastReadProgress.story.slug}/${lastReadProgress.chapter.chapterNum}`}
                className="w-full md:w-auto shrink-0 py-2.5 px-6 rounded-full bg-zen-ink hover:bg-zen-cinnabar text-zen-paper transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold shadow-xs"
              >
                <BookOpen className="w-4 h-4 stroke-[1.5]" />
                Đọc Tiếp Chương Mới
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Layout Hai Cột: Cột chính tìm kiếm/lọc và danh sách, Cột phụ lịch sử và thông số */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">

          {/* CỘT CHÍNH: KHÁM PHÁ & BỘ LỌC */}
          <div className="space-y-8">

            {/* Thanh Tab chính & Tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-zen-muted pb-4">
              {/* Tab Chuyển Đổi Khám Phá / Đã Lưu */}
              <div className="flex bg-zen-muted/40 p-1 rounded-lg border border-zen-muted/60">
                <button
                  onClick={() => startTransition(() => setActiveTab("explore"))}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-md transition-all font-sans font-medium ${activeTab === "explore"
                      ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs"
                      : "text-zen-gray hover:text-zen-ink"
                    }`}
                >
                  <Sparkles className="w-4 h-4 stroke-[1.5]" />
                  Khám Phá Thư Các
                </button>
                <button
                  onClick={() => startTransition(() => setActiveTab("saved"))}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-md transition-all font-sans font-medium ${activeTab === "saved"
                      ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs"
                      : "text-zen-gray hover:text-zen-ink"
                    }`}
                >
                  <Heart className="w-4 h-4 stroke-[1.5]" />
                  Kệ Sách Đã Lưu ({savedNovels.length})
                </button>
              </div>

              {/* Ô Tìm Kiếm Dưới Dạng Tối Giản */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-gray stroke-[1.5]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tác phẩm, tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-zen-muted bg-white/40 dark:bg-black/10 focus:outline-none focus:border-zen-cinnabar/40 focus:ring-1 focus:ring-zen-cinnabar/20 font-sans transition-all text-zen-ink placeholder-zen-gray/60"
                />
              </div>
            </div>

            {/* Các Tab Bộ Lọc Thể Loại Ngang */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => startTransition(() => setSelectedCategory(cat))}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all border ${selectedCategory === cat
                      ? "bg-zen-cinnabar/10 text-zen-cinnabar border-zen-cinnabar/30"
                      : "bg-white/20 border-zen-muted hover:border-zen-gray/40 text-zen-gray hover:text-zen-ink"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Lưới Danh Sách Truyện */}
            {loading ? (
              // Trạng thái Loading với Skeleton cổ phong nhẹ nhàng
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse space-y-3 p-4 border border-zen-muted/40 rounded-xl">
                    <div className="aspect-[3/4] bg-zen-muted/60 rounded-lg" />
                    <div className="h-4 bg-zen-muted w-3/4 rounded" />
                    <div className="h-3 bg-zen-muted w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredStories.length === 0 ? (
              // Trạng thái trống
              <div className="text-center py-20 px-4 border border-dashed border-zen-muted rounded-2xl bg-white/20">
                <BookMarked className="w-12 h-12 text-zen-gray mx-auto mb-4 opacity-40 stroke-[1.2]" />
                <h3 className="text-lg font-serif font-bold text-zen-ink mb-1">
                  Không tìm thấy tác phẩm
                </h3>
                <p className="text-sm text-zen-gray font-sans max-w-sm mx-auto">
                  {searchQuery || selectedCategory !== "Tất Cả"
                    ? "Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc thể loại khác."
                    : activeTab === "saved"
                      ? "Kệ sách hiện chưa có tác phẩm nào. Hãy tìm kiếm truyện và lưu vào thư viện cá nhân."
                      : "Thư Các hiện đang trống. Hãy quay lại sau."}
                </p>
              </div>
            ) : (
              // Danh sách truyện thực tế
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
                {filteredStories.map((story) => {
                  const category = getStoryCategory(story.slug, story.title);
                  const isSaved = savedNovels.includes(story.slug);

                  return (
                    <div key={story.slug} className="group relative flex flex-col">
                      {/* Bìa truyện thiết kế tinh xảo */}
                      <Link
                        href={`/story/${story.slug}`}
                        className="aspect-[2/3] bg-muted rounded-xl overflow-hidden border border-zen-muted/60 mb-4 block shadow-xs group-hover:border-zen-cinnabar/30 group-hover:shadow-md transition-all duration-300 bg-white/40 relative"
                      >
                        {story.coverUrl ? (
                          <img
                            src={story.coverUrl}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-zen-muted flex items-center justify-center font-serif text-zen-gray font-medium p-4 text-center text-xs">
                            Bìa tác phẩm Mặc Quán
                          </div>
                        )}

                        {/* Huy hiệu nhỏ hiển thị thể loại chìm */}
                        <div className="absolute top-2 left-2 bg-background/90 text-zen-ink border border-zen-muted px-2 py-0.5 rounded-md text-[9px] font-sans font-medium uppercase tracking-wider backdrop-blur-xs opacity-90">
                          {category}
                        </div>

                        {/* Icon tim đỏ nếu đã lưu truyện */}
                        {isSaved && (
                          <div className="absolute top-2 right-2 bg-white/95 text-zen-cinnabar p-1.5 rounded-full shadow-xs backdrop-blur-xs">
                            <Heart className="w-3.5 h-3.5 fill-zen-cinnabar stroke-none" />
                          </div>
                        )}
                      </Link>

                      {/* Thông tin truyện */}
                      <div className="space-y-1">
                        <Link
                          href={`/story/${story.slug}`}
                          className="font-serif font-bold text-base text-zen-ink group-hover:text-zen-cinnabar transition-colors duration-200 line-clamp-1"
                        >
                          {story.title}
                        </Link>
                        <p className="text-xs text-zen-gray font-sans line-clamp-1">
                          Tác giả: <span className="font-medium">{story.author}</span>
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-zen-muted/30">
                          <span className="text-[10px] text-zen-gray/80 font-serif italic">
                            {story.chapters?.length || 0} chương
                          </span>
                          <span className="text-[10px] text-zen-gray/80 font-sans">
                            {story.viewCount.toLocaleString()} đọc
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CỘT PHỤ (SIDEBAR): LỊCH SỬ ĐỌC & TRUYỆN ĐÃ LƯU NHANH */}
          <aside className="space-y-8 lg:border-l lg:border-zen-muted lg:pl-8">

            {/* Lịch sử đọc gần đây */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold flex items-center gap-2 text-zen-ink">
                <Clock className="w-4.5 h-4.5 text-zen-cinnabar stroke-[1.5]" />
                Lịch Sử Đọc Gần Đây
              </h3>

              {resolvedHistory.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-zen-muted rounded-xl bg-white/10">
                  <Clock className="w-8 h-8 text-zen-gray mx-auto mb-2 opacity-35 stroke-[1.2]" />
                  <p className="text-xs text-zen-gray font-sans px-2">
                    Lịch sử đọc của bạn đang trống.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {resolvedHistory.map((item, idx) => (
                    <Link
                      key={`${item.story.slug}-${item.chapter.chapterNum}-${idx}`}
                      href={`/read/${item.story.slug}/${item.chapter.chapterNum}`}
                      className="group flex flex-col p-4 rounded-xl border border-zen-muted/40 bg-white/20 hover:border-zen-cinnabar/30 hover:bg-white/40 transition-all duration-200 shadow-3xs"
                    >
                      <h4 className="font-serif font-bold text-zen-ink group-hover:text-zen-cinnabar text-sm transition-colors line-clamp-1">
                        {item.story.title}
                      </h4>
                      <p className="font-sans text-xs text-zen-gray mt-1 line-clamp-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 opacity-60" />
                        {item.chapter.title}
                      </p>
                      <span className="font-sans text-[10px] text-zen-gray/80 mt-2 text-right italic">
                        {item.timeString}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Khối Thống kê nho nhỏ của Thư Phòng */}
            <div className="p-5 rounded-2xl bg-zen-muted/30 border border-zen-muted/50 text-center space-y-3 font-serif">
              <div className="w-8 h-8 bg-zen-cinnabar/10 text-zen-cinnabar rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-4.5 h-4.5 stroke-[1.5]" />
              </div>
              <h4 className="font-bold text-zen-ink text-sm">Thống Kê Thư Các</h4>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zen-muted/40">
                <div>
                  <div className="text-xl font-bold text-zen-cinnabar">{stories.length}</div>
                  <div className="text-[10px] text-zen-gray font-sans">Tác Phẩm</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-zen-ink">{savedNovels.length}</div>
                  <div className="text-[10px] text-zen-gray font-sans">Đã Lưu</div>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}
