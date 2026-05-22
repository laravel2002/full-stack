"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Flame, Award, BookOpen, User, Star, TrendingUp, Clock } from "lucide-react";
import { getStories, getLeaderboard } from "@/lib/api";

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

export default function LeaderboardPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"views" | "recent" | "rating">("views");
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(false);
        const data = await getStories();
        setStories(data);
      } catch (error) {
        console.error("[Mặc Quán] Lỗi khi nạp dữ liệu bảng xếp hạng:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Danh sách thể loại
  const categories = ["Tất Cả", "Võ Hiệp", "Triết Học", "Lịch Sử", "Thiền Tông", "Thi Ca"];

  // Hàm phụ lấy thể loại truyện
  const getStoryCategory = (slug: string, title: string): string => {
    if (slug === "thien-long-bat-bo") return "Võ Hiệp";
    if (slug === "dao-duc-kinh") return "Triết Học";
    if (slug === "dong-chu-liet-quoc") return "Lịch Sử";
    if (slug === "nam-hoa-kinh") return "Thiền Tông";
    if (slug === "kinh-thi") return "Thi Ca";
    return "Võ Hiệp";
  };

  // Sắp xếp và lọc truyện dựa trên tab và thể loại
  const getSortedStories = (): Story[] => {
    let list = [...stories];

    // Lọc theo thể loại
    if (selectedCategory !== "Tất Cả") {
      list = list.filter(s => getStoryCategory(s.slug, s.title) === selectedCategory);
    }

    // Sắp xếp theo tab
    if (activeTab === "views") {
      list.sort((a, b) => b.viewCount - a.viewCount);
    } else if (activeTab === "recent") {
      // Giả lập sắp xếp theo truyện mới hoặc mới cập nhật
      list.sort((a, b) => b.title.localeCompare(a.title));
    } else if (activeTab === "rating") {
      // Giả lập sắp xếp theo điểm đánh giá cao
      list.sort((a, b) => b.slug.localeCompare(a.slug));
    }

    return list;
  };

  const sortedStories = getSortedStories();
  const topThree = sortedStories.slice(0, 3);
  const remainingStories = sortedStories.slice(3);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Tiêu đề trang phong cách cổ điển Zen */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zen-cinnabar/25 bg-zen-cinnabar/5 px-4 py-1 text-xs font-semibold text-zen-cinnabar tracking-wider font-sans uppercase">
            <Award className="h-3.5 w-3.5" /> Bảng Vàng Danh Dự
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zen-ink tracking-wide">
            Bảng Xếp Hạng Mặc Quán
          </h1>
          <p className="text-sm italic font-serif text-zen-gray/80 px-4 leading-relaxed">
            "Anh hùng trục lộc giang hồ rộng, Tác phẩm lưu danh sử sách vàng."
          </p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zen-cinnabar/40 to-transparent mx-auto mt-2" />
        </div>

        {/* Thanh Tab chính & Bộ lọc ngang */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-zen-muted pb-4 mb-8">
          {/* Tabs xếp hạng */}
          <div className="flex bg-zen-muted/40 p-1 rounded-lg border border-zen-muted/60">
            <button
              onClick={() => startTransition(() => setActiveTab("views"))}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm rounded-md transition-all font-sans font-medium ${
                activeTab === "views"
                  ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs"
                  : "text-zen-gray hover:text-zen-ink"
              }`}
            >
              <Flame className="w-4 h-4 stroke-[1.5] text-zen-cinnabar" />
              Đọc Nhiều Nhất
            </button>
            <button
              onClick={() => startTransition(() => setActiveTab("recent"))}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm rounded-md transition-all font-sans font-medium ${
                activeTab === "recent"
                  ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs"
                  : "text-zen-gray hover:text-zen-ink"
              }`}
            >
              <Clock className="w-4 h-4 stroke-[1.5]" />
              Mới Cập Nhật
            </button>
            <button
              onClick={() => startTransition(() => setActiveTab("rating"))}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm rounded-md transition-all font-sans font-medium ${
                activeTab === "rating"
                  ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs"
                  : "text-zen-gray hover:text-zen-ink"
              }`}
            >
              <Star className="w-4 h-4 stroke-[1.5]" />
              Đánh Giá Cao
            </button>
          </div>

          {/* Lọc thể loại */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full md:max-w-[450px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => startTransition(() => setSelectedCategory(cat))}
                className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-zen-cinnabar/10 text-zen-cinnabar border-zen-cinnabar/30"
                    : "bg-white/20 border-zen-muted hover:border-zen-gray/40 text-zen-gray hover:text-zen-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="text-sm text-zen-gray animate-pulse font-sans">Đang mài mực tra cứu bảng vàng...</span>
          </div>
        ) : sortedStories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zen-muted rounded-2xl bg-white/20">
            <TrendingUp className="w-12 h-12 text-zen-gray mx-auto mb-4 opacity-40 stroke-[1.2]" />
            <h3 className="text-lg font-serif font-bold text-zen-ink mb-1">
              Chưa có dữ liệu xếp hạng
            </h3>
            <p className="text-sm text-zen-gray font-sans max-w-sm mx-auto">
              Không tìm thấy tác phẩm nào khớp với bộ lọc thể loại đã chọn.
            </p>
          </div>
        ) : (
          <div className={`space-y-10 transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
            {/* SECTION 1: TOP 3 TRUYỆN ĐỨNG ĐẦU (BẢNG VÀNG THỦY MẶC) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* Vị trí thứ 2 */}
              {topThree[1] && (
                <div className="order-2 md:order-1 flex flex-col items-center">
                  <div className="relative w-full max-w-[200px] aspect-[2/3] rounded-xl overflow-hidden border-2 border-zen-muted shadow-sm group hover:border-zen-cinnabar/30 transition-all duration-300">
                    <img
                      src={topThree[1].coverUrl || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200"}
                      alt={topThree[1].title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-slate-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-serif font-extrabold text-sm shadow-md">
                      2
                    </div>
                  </div>
                  <div className="text-center mt-4 space-y-1">
                    <h3 className="font-serif font-bold text-lg text-zen-ink hover:text-zen-cinnabar truncate max-w-[240px]">
                      <Link href={`/story/${topThree[1].slug}`}>{topThree[1].title}</Link>
                    </h3>
                    <p className="text-xs text-zen-gray font-sans">{topThree[1].author}</p>
                    <span className="inline-block text-[10px] bg-slate-500/10 text-slate-700 px-2 py-0.5 rounded-full font-sans font-medium mt-1">
                      {topThree[1].viewCount.toLocaleString()} lượt đọc
                    </span>
                  </div>
                </div>
              )}

              {/* Vị trí thứ 1 (Chính giữa, nổi bật hơn hẳn) */}
              {topThree[0] && (
                <div className="order-1 md:order-2 flex flex-col items-center scale-100 md:scale-105 z-10">
                  {/* Bát Nhã Trận / Điểm Nhấn Đỏ Chu Sa */}
                  <div className="relative w-full max-w-[220px] aspect-[2/3] rounded-2xl overflow-hidden border-4 border-zen-cinnabar shadow-lg group hover:shadow-xl transition-all duration-300">
                    <img
                      src={topThree[0].coverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200"}
                      alt={topThree[0].title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-zen-cinnabar text-zen-paper w-9 h-9 rounded-full flex items-center justify-center font-serif font-black text-base shadow-lg animate-pulse">
                      1
                    </div>
                  </div>
                  <div className="text-center mt-5 space-y-1">
                    <h2 className="font-serif font-extrabold text-xl text-zen-ink hover:text-zen-cinnabar transition-colors duration-200">
                      <Link href={`/story/${topThree[0].slug}`}>{topThree[0].title}</Link>
                    </h2>
                    <p className="text-sm text-zen-gray font-sans font-medium">{topThree[0].author}</p>
                    <span className="inline-block text-xs bg-zen-cinnabar/15 text-zen-cinnabar px-3 py-1 rounded-full font-sans font-semibold mt-1">
                      {topThree[0].viewCount.toLocaleString()} lượt đọc
                    </span>
                  </div>
                </div>
              )}

              {/* Vị trí thứ 3 */}
              {topThree[2] && (
                <div className="order-3 flex flex-col items-center">
                  <div className="relative w-full max-w-[190px] aspect-[2/3] rounded-xl overflow-hidden border-2 border-zen-muted shadow-sm group hover:border-zen-cinnabar/30 transition-all duration-300">
                    <img
                      src={topThree[2].coverUrl || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"}
                      alt={topThree[2].title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-amber-700 text-white w-7 h-7 rounded-full flex items-center justify-center font-serif font-extrabold text-sm shadow-md">
                      3
                    </div>
                  </div>
                  <div className="text-center mt-4 space-y-1">
                    <h3 className="font-serif font-bold text-lg text-zen-ink hover:text-zen-cinnabar truncate max-w-[240px]">
                      <Link href={`/story/${topThree[2].slug}`}>{topThree[2].title}</Link>
                    </h3>
                    <p className="text-xs text-zen-gray font-sans">{topThree[2].author}</p>
                    <span className="inline-block text-[10px] bg-amber-700/10 text-amber-800 px-2 py-0.5 rounded-full font-sans font-medium mt-1">
                      {topThree[2].viewCount.toLocaleString()} lượt đọc
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: DANH SÁCH CÁC VỊ TRÍ TIẾP THEO (TỐI GIẢN) */}
            {remainingStories.length > 0 && (
              <div className="border border-zen-muted rounded-2xl bg-white/20 backdrop-blur-xs divide-y divide-zen-muted overflow-hidden mt-12 shadow-3xs">
                {remainingStories.map((story, index) => {
                  const rank = index + 4;
                  return (
                    <div
                      key={story.slug}
                      className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 group hover:bg-white/40 transition-colors duration-200"
                    >
                      {/* Xếp hạng */}
                      <span className="font-serif text-2xl font-extrabold text-zen-gray/30 group-hover:text-zen-cinnabar/80 transition-colors duration-300 w-10 text-center select-none shrink-0">
                        {rank}
                      </span>

                      {/* Ảnh bìa nhỏ */}
                      <Link
                        href={`/story/${story.slug}`}
                        className="w-10 h-14 bg-muted rounded-md overflow-hidden border border-zen-muted/60 shrink-0 shadow-2xs block"
                      >
                        <img
                          src={story.coverUrl || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200"}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Tiêu đề & Tác giả */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-serif text-base font-bold text-zen-ink hover:text-zen-cinnabar transition-colors duration-200 truncate">
                            <Link href={`/story/${story.slug}`}>{story.title}</Link>
                          </h4>
                          <span className="text-xs text-zen-gray font-sans sm:order-first sm:mr-4 select-none italic shrink-0">
                            {getStoryCategory(story.slug, story.title)}
                          </span>
                        </div>
                        <p className="text-xs text-zen-gray font-sans mt-0.5">Tác giả: {story.author}</p>
                      </div>

                      {/* Số lượt đọc */}
                      <div className="shrink-0 text-right">
                        <span className="font-sans text-xs text-zen-ink/80 bg-zen-muted/50 px-3 py-1 rounded-full font-medium shadow-3xs">
                          {story.viewCount.toLocaleString()} đọc
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
