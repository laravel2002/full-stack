"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Compass, BookOpen, User, ArrowRight, Eye, ChevronRight } from "lucide-react";
import { getStories } from "@/lib/api";

// Định nghĩa kiểu dữ liệu truyện
interface Story {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  coverUrl?: string;
  viewCount: number;
  chapters?: any[];
}

export default function ExplorePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [sortBy, setSortBy] = useState<"views" | "chapters">("views");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const data = await getStories();
        setStories(data);
      } catch (error) {
        console.error("[Mặc Quán] Lỗi khi tải dữ liệu khám phá:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  // Danh sách thể loại
  const categories = ["Tất Cả", "Võ Hiệp", "Triết Học", "Lịch Sử", "Thiền Tông", "Thi Ca"];

  // Hàm lấy thể loại truyện
  const getStoryCategory = (slug: string, title: string): string => {
    if (slug === "thien-long-bat-bo") return "Võ Hiệp";
    if (slug === "dao-duc-kinh") return "Triết Học";
    if (slug === "dong-chu-liet-quoc") return "Lịch Sử";
    if (slug === "nam-hoa-kinh") return "Thiền Tông";
    if (slug === "kinh-thi") return "Thi Ca";
    return "Võ Hiệp";
  };

  // Logic lọc và sắp xếp truyện
  const getFilteredStories = (): Story[] => {
    let list = stories.filter(story => {
      // Tìm theo từ khóa
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Lọc theo thể loại
      const cat = getStoryCategory(story.slug, story.title);
      const matchesCategory = selectedCategory === "Tất Cả" || cat === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sắp xếp
    if (sortBy === "views") {
      list.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === "chapters") {
      list.sort((a, b) => (b.chapters?.length || 0) - (a.chapters?.length || 0));
    }

    return list;
  };

  const filteredStories = getFilteredStories();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Tiêu đề trang */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zen-cinnabar/25 bg-zen-cinnabar/5 px-4 py-1 text-xs font-semibold text-zen-cinnabar tracking-wider font-sans uppercase">
            <Compass className="h-3.5 w-3.5" /> Khai Phá Tầm Nhìn
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zen-ink tracking-wide">
            Tìm Kiếm & Khám Phá
          </h1>
          <p className="text-sm italic font-serif text-zen-gray/80 px-4 leading-relaxed">
            "Vạn dặm sơn hà quy nhất kiếm, Thiên niên chương tịch ngộ chân kinh."
          </p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zen-cinnabar/40 to-transparent mx-auto mt-2" />
        </div>

        {/* PHẦN 1: Ô TÌM KIẾM KHỔNG LỒ TỐI GIẢN */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group shadow-sm rounded-2xl bg-white/40 dark:bg-black/10 border border-zen-muted/80 focus-within:border-zen-cinnabar/40 transition-all duration-300">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zen-gray/80 group-hover:text-zen-cinnabar transition-colors duration-200 stroke-[1.5]" />
            <input
              type="text"
              placeholder="Gõ tên tác phẩm, tác giả hoặc từ khóa bất kỳ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-transparent focus:outline-none font-sans text-base text-zen-ink placeholder-zen-gray/50"
            />
          </div>
        </div>

        {/* PHẦN 2: THANH LỌC VÀ SẮP XẾP */}
        <div className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center justify-between border-b border-zen-muted/60 pb-5 mb-8">
          {/* Bộ lọc thể loại */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full sm:max-w-[550px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => startTransition(() => setSelectedCategory(cat))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-zen-cinnabar/10 text-zen-cinnabar border-zen-cinnabar/30"
                    : "bg-white/20 border-zen-muted hover:border-zen-gray/40 text-zen-gray hover:text-zen-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sắp xếp */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-zen-gray font-sans font-medium">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-sans rounded-lg border border-zen-muted bg-white/40 dark:bg-black/10 focus:outline-none focus:border-zen-cinnabar/40 text-zen-ink cursor-pointer"
            >
              <option value="views">Lượt xem nhiều</option>
              <option value="chapters">Số lượng chương</option>
            </select>
          </div>
        </div>

        {/* PHẦN 3: LƯỚI KẾT QUẢ TÌM KIẾM */}
        {loading ? (
          <div className="text-center py-20">
            <span className="text-sm text-zen-gray animate-pulse font-sans">Đang truy vấn thư lâu thư tịch...</span>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zen-muted rounded-2xl bg-white/20">
            <Search className="w-12 h-12 text-zen-gray mx-auto mb-4 opacity-40 stroke-[1.2]" />
            <h3 className="text-lg font-serif font-bold text-zen-ink mb-1">
              Không có kết quả trùng khớp
            </h3>
            <p className="text-sm text-zen-gray font-sans max-w-sm mx-auto">
              Hãy thử đổi từ khóa khác hoặc điều chỉnh bộ lọc thể loại để tìm được tác phẩm ưng ý.
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
            {filteredStories.map((story) => {
              const category = getStoryCategory(story.slug, story.title);
              return (
                <div
                  key={story.slug}
                  className="group flex gap-5 p-5 rounded-2xl border border-zen-muted/60 bg-white/30 hover:border-zen-cinnabar/30 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  {/* Bìa truyện */}
                  <Link
                    href={`/story/${story.slug}`}
                    className="w-24 sm:w-28 aspect-[2/3] bg-muted rounded-xl overflow-hidden border border-zen-muted shrink-0 shadow-2xs block bg-white/40"
                  >
                    <img
                      src={story.coverUrl || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200"}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </Link>

                  {/* Chi tiết nội dung */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] bg-zen-cinnabar/10 text-zen-cinnabar border border-zen-cinnabar/20 px-2 py-0.5 rounded-full font-sans font-medium uppercase tracking-wider">
                          {category}
                        </span>
                        <span className="text-[10px] text-zen-gray font-sans flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 opacity-60" /> {story.viewCount.toLocaleString()} đọc
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-zen-ink group-hover:text-zen-cinnabar transition-colors duration-200 line-clamp-1">
                        <Link href={`/story/${story.slug}`}>{story.title}</Link>
                      </h3>

                      <p className="text-xs text-zen-gray font-sans">
                        Tác giả: <span className="font-medium text-zen-ink">{story.author}</span>
                      </p>

                      <p className="text-xs text-zen-gray/90 font-sans line-clamp-2 leading-relaxed pt-1">
                        {story.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zen-muted/40 pt-3 mt-4">
                      <span className="text-[10px] text-zen-gray font-serif italic">
                        {story.chapters?.length || 0} chương tổng cộng
                      </span>

                      <Link
                        href={`/story/${story.slug}`}
                        className="inline-flex items-center gap-1 rounded-full bg-zen-ink hover:bg-zen-cinnabar text-zen-paper py-1.5 px-4 text-xs font-semibold shadow-3xs transition-all duration-200 group-hover:scale-[1.02]"
                      >
                        Bắt Đầu Đọc <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
