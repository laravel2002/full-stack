"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { User, BookOpen, Clock, Settings, Heart, Palette, Sparkles, Trash2, ArrowLeft, ChevronRight } from "lucide-react";
import { useLibraryStore } from "@/stores/library-store";
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

export default function ProfilePage() {
  const { savedNovels, readingHistory, toggleSaved } = useLibraryStore();
  const [mounted, setMounted] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"library" | "history" | "settings">("library");

  // Thiết lập cấu hình đọc sách Zen
  const [readerTheme, setReaderTheme] = useState("xuyenchi");
  const [readerFont, setReaderFont] = useState("serif");
  const [readerFontSize, setReaderFontSize] = useState("lg");

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);

    // Tải thông số thiết lập trình đọc từ localStorage
    const savedTheme = localStorage.getItem("zen-reader-theme") || "xuyenchi";
    const savedFont = localStorage.getItem("zen-reader-font") || "serif";
    const savedFontSize = localStorage.getItem("zen-reader-font-size") || "lg";
    setReaderTheme(savedTheme);
    setReaderFont(savedFont);
    setReaderFontSize(savedFontSize);

    // Tải truyện
    const loadStories = async () => {
      try {
        setLoading(true);
        const data = await getStories();
        setStories(data);
      } catch (error) {
        console.error("[Mặc Quán] Lỗi tải truyện trong trang cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  // Lưu thiết lập trình đọc
  const saveReaderSettings = (key: string, value: string) => {
    localStorage.setItem(key, value);
    if (key === "zen-reader-theme") setReaderTheme(value);
    if (key === "zen-reader-font") setReaderFont(value);
    if (key === "zen-reader-font-size") setReaderFontSize(value);

    // Phát sự kiện cập nhật để các trang khác (ví dụ trang đọc truyện) đồng bộ tức thì
    window.dispatchEvent(new Event("storage"));
  };

  // Ánh xạ danh sách truyện đã lưu từ store
  const savedStories = stories.filter(s => savedNovels.includes(s.slug));

  // Giải quyết danh sách lịch sử đọc
  const resolvedHistory = readingHistory.map(entry => {
    const story = stories.find(s => s.slug === entry.novelSlug);
    if (!story) return null;
    const date = new Date(entry.updatedAt);
    const timeString = date.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    return {
      story,
      chapterNumber: entry.chapterNumber,
      timeString
    };
  }).filter(Boolean) as any[];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <span className="text-sm text-zen-gray animate-pulse font-sans">Đang phục hồi thư án cá nhân...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        
        {/* PHẦN 1: CARD HỒ SƠ ĐỘC GIẢ (Cổ Phong Độc Bản) */}
        <div className="relative overflow-hidden rounded-3xl border border-zen-muted bg-white/40 p-6 sm:p-8 mb-10 shadow-sm backdrop-blur-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-20 h-20 rounded-full border-2 border-zen-cinnabar/40 overflow-hidden bg-zen-paper p-1 select-none shrink-0 shadow-xs">
            <div className="w-full h-full rounded-full bg-zen-cinnabar/10 flex items-center justify-center font-serif text-3xl font-bold text-zen-cinnabar">
              墨
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl font-bold text-zen-ink">Hành Giả Mặc Quán</h1>
              <span className="inline-block text-[10px] bg-zen-cinnabar/10 text-zen-cinnabar border border-zen-cinnabar/20 px-2 py-0.5 rounded-full font-sans font-medium uppercase tracking-widest self-center">
                Hiền giả thư phòng
              </span>
            </div>
            <p className="text-xs text-zen-gray font-sans">Đồng hành cùng Mặc Quán thư phòng từ 2026</p>
            <div className="flex justify-center sm:justify-start items-center gap-4 text-xs text-zen-gray pt-2 border-t border-zen-muted/30">
              <span>Đã lưu: <span className="font-semibold text-zen-ink">{savedNovels.length}</span> tác phẩm</span>
              <span>•</span>
              <span>Lịch sử: <span className="font-semibold text-zen-ink">{readingHistory.length}</span> chương sách</span>
            </div>
          </div>
        </div>

        {/* PHẦN 2: THANH TAB ĐIỀU HƯỚNG NỘI BỘ */}
        <div className="flex bg-zen-muted/40 p-1 rounded-xl border border-zen-muted/60 mb-8 max-w-md mx-auto sm:mx-0">
          <button
            onClick={() => startTransition(() => setActiveTab("library"))}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm rounded-lg transition-all font-sans font-semibold ${
              activeTab === "library"
                ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs border border-zen-muted/30"
                : "text-zen-gray hover:text-zen-ink"
            }`}
          >
            <Heart className="w-4 h-4 stroke-[1.5] text-zen-cinnabar" />
            Tủ Sách
          </button>
          <button
            onClick={() => startTransition(() => setActiveTab("history"))}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm rounded-lg transition-all font-sans font-semibold ${
              activeTab === "history"
                ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs border border-zen-muted/30"
                : "text-zen-gray hover:text-zen-ink"
            }`}
          >
            <Clock className="w-4 h-4 stroke-[1.5]" />
            Lịch Sử Đọc
          </button>
          <button
            onClick={() => startTransition(() => setActiveTab("settings"))}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm rounded-lg transition-all font-sans font-semibold ${
              activeTab === "settings"
                ? "bg-white dark:bg-zen-ink text-zen-ink shadow-xs border border-zen-muted/30"
                : "text-zen-gray hover:text-zen-ink"
            }`}
          >
            <Settings className="w-4 h-4 stroke-[1.5]" />
            Trình Đọc Zen
          </button>
        </div>

        {/* PHẦN 3: HIỂN THỊ NỘI DUNG THEO TAB */}
        {loading ? (
          <div className="text-center py-20">
            <span className="text-sm text-zen-gray animate-pulse font-sans">Đang lật mở các trang hồ sơ...</span>
          </div>
        ) : (
          <div className={`transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
            
            {/* TAB 1: TỦ SÁCH CÁ NHÂN */}
            {activeTab === "library" && (
              <div>
                {savedStories.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-zen-muted rounded-2xl bg-white/20">
                    <Heart className="w-12 h-12 text-zen-gray mx-auto mb-3 opacity-30 stroke-[1.2]" />
                    <h3 className="text-base font-serif font-bold text-zen-ink mb-1">
                      Kệ sách gỗ đang trống
                    </h3>
                    <p className="text-xs text-zen-gray font-sans max-w-xs mx-auto">
                      Hãy duyệt qua các truyện kiếm hiệp thi ca kỳ vĩ và lưu tác phẩm yêu thích của bạn tại đây.
                    </p>
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold text-zen-cinnabar hover:underline"
                    >
                      Duyệt truyện ngay <Sparkles className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {savedStories.map((story) => (
                      <div
                        key={story.slug}
                        className="group flex gap-4 p-4 rounded-2xl border border-zen-muted/50 bg-white/30 hover:border-zen-cinnabar/30 transition-all duration-300 relative"
                      >
                        {/* Ảnh bìa */}
                        <Link
                          href={`/story/${story.slug}`}
                          className="w-16 sm:w-20 aspect-[2/3] bg-muted rounded-lg overflow-hidden border border-zen-muted shrink-0 shadow-2xs block bg-white/40"
                        >
                          <img
                            src={story.coverUrl || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600"}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Chi tiết */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="space-y-1">
                            <h3 className="font-serif font-bold text-base text-zen-ink group-hover:text-zen-cinnabar transition-colors duration-200 line-clamp-1">
                              <Link href={`/story/${story.slug}`}>{story.title}</Link>
                            </h3>
                            <p className="text-xs text-zen-gray font-sans">Tác giả: {story.author}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-zen-muted/30 pt-2 mt-2">
                            <Link
                              href={`/story/${story.slug}`}
                              className="text-xs text-zen-cinnabar hover:underline font-semibold"
                            >
                              Đọc tác phẩm
                            </Link>

                            <button
                              onClick={() => toggleSaved(story.slug)}
                              className="p-1 text-zen-gray hover:text-zen-cinnabar transition-colors"
                              title="Bỏ lưu khỏi tủ sách"
                            >
                              <Trash2 className="w-4 h-4 stroke-[1.5]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: LỊCH SỬ ĐỌC */}
            {activeTab === "history" && (
              <div>
                {resolvedHistory.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-zen-muted rounded-2xl bg-white/20">
                    <Clock className="w-12 h-12 text-zen-gray mx-auto mb-3 opacity-30 stroke-[1.2]" />
                    <h3 className="text-base font-serif font-bold text-zen-ink mb-1">
                      Chưa ghi nhận lịch sử đọc
                    </h3>
                    <p className="text-xs text-zen-gray font-sans max-w-xs mx-auto">
                      Hãy mở bất kỳ chương truyện nào, tiến trình đọc sẽ tự động được ghi nhận tĩnh lặng tại đây.
                    </p>
                  </div>
                ) : (
                  <div className="relative border-l border-zen-muted/80 pl-6 ml-4 space-y-6">
                    {resolvedHistory.map((item, idx) => (
                      <div key={`${item.story.slug}-${idx}`} className="relative group">
                        {/* Chấm tròn mốc dòng thời gian */}
                        <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-zen-muted bg-background group-hover:border-zen-cinnabar transition-colors" />

                        <div className="bg-white/30 hover:bg-white/50 border border-zen-muted/50 rounded-2xl p-4 sm:p-5 transition-all duration-300">
                          <span className="text-[10px] text-zen-gray font-sans italic block mb-1">
                            {item.timeString}
                          </span>
                          <h4 className="font-serif font-bold text-base text-zen-ink hover:text-zen-cinnabar">
                            <Link href={`/story/${item.story.slug}`}>{item.story.title}</Link>
                          </h4>
                          <p className="text-xs sm:text-sm text-zen-gray font-sans mt-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 opacity-60" />
                            Đọc đến: <span className="font-semibold text-zen-ink">Chương {item.chapterNumber}</span>
                          </p>

                          <div className="text-right mt-3">
                            <Link
                              href={`/read/${item.story.slug}/${item.chapterNumber}`}
                              className="inline-flex items-center gap-1 text-xs text-zen-cinnabar hover:underline font-semibold"
                            >
                              Đọc Tiếp <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: THIẾT LẬP TRÌNH ĐỌC ZEN */}
            {activeTab === "settings" && (
              <div className="bg-white/30 border border-zen-muted rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
                
                {/* 1. Theme màu độc giả */}
                <div className="space-y-3">
                  <h3 className="text-sm font-sans font-semibold text-zen-ink flex items-center gap-2">
                    <Palette className="w-4 h-4 text-zen-cinnabar stroke-[1.5]" />
                    Chủ Đề Trình Đọc (Theme Màu)
                  </h3>
                  <p className="text-xs text-zen-gray font-sans">
                    Chọn màu sắc chủ đạo phù hợp nhất cho thị lực của bạn khi thưởng thức sách.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                      { id: "light", name: "Tuyên Giấy (Sáng)", class: "bg-[#fbf9f4] text-[#1b1c19] border-[#e7e3d4]" },
                      { id: "dark", name: "Mực Đêm (Tối)", class: "bg-[#141512] text-[#d1cdb8] border-[#2c2d2a]" },
                      { id: "sepia", name: "Vân Vy (Cổ Điển)", class: "bg-[#f4edd8] text-[#433422] border-[#dfcfab]" },
                      { id: "xuyenchi", name: "Xuyến Chỉ (Nghệ Thuật)", class: "bg-[#efe8d4] text-[#2d261e] border-[#dcd2b7]" }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => saveReaderSettings("zen-reader-theme", t.id)}
                        className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${t.class} ${
                          readerTheme === t.id
                            ? "ring-2 ring-zen-cinnabar ring-offset-2 scale-[1.02]"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Lựa chọn Font chữ */}
                <div className="space-y-3 pt-4 border-t border-zen-muted/40">
                  <h3 className="text-sm font-sans font-semibold text-zen-ink flex items-center gap-2">
                    <User className="w-4 h-4 text-zen-cinnabar stroke-[1.5]" />
                    Kiểu Chữ (Font Family)
                  </h3>
                  
                  <div className="flex gap-4 pt-2">
                    {[
                      { id: "serif", name: "Chữ Có Chân (Cổ Điển Serif)", class: "font-serif" },
                      { id: "sans", name: "Chữ Không Chân (Hiện Đại Sans)", class: "font-sans" }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => saveReaderSettings("zen-reader-font", f.id)}
                        className={`flex-1 p-3.5 text-sm rounded-xl border text-center transition-all ${f.class} ${
                          readerFont === f.id
                            ? "bg-zen-cinnabar/10 border-zen-cinnabar/40 text-zen-cinnabar font-bold shadow-xs"
                            : "bg-white/40 border-zen-muted hover:border-zen-gray/60 text-zen-gray"
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Kích thước chữ */}
                <div className="space-y-3 pt-4 border-t border-zen-muted/40">
                  <h3 className="text-sm font-sans font-semibold text-zen-ink flex items-center gap-2">
                    <Settings className="w-4 h-4 text-zen-cinnabar stroke-[1.5]" />
                    Cỡ Chữ (Font Size)
                  </h3>
                  
                  <div className="flex gap-3 pt-2">
                    {[
                      { id: "sm", name: "Nhỏ (SM)" },
                      { id: "base", name: "Vừa (MD)" },
                      { id: "lg", name: "Lớn (LG)" },
                      { id: "xl", name: "Cực Lớn (XL)" }
                    ].map(fs => (
                      <button
                        key={fs.id}
                        onClick={() => saveReaderSettings("zen-reader-font-size", fs.id)}
                        className={`flex-1 py-2 px-3 text-xs rounded-lg border text-center transition-all font-sans font-semibold ${
                          readerFontSize === fs.id
                            ? "bg-zen-cinnabar text-zen-paper border-zen-cinnabar shadow-2xs"
                            : "bg-white/40 border-zen-muted hover:border-zen-gray/60 text-zen-gray"
                        }`}
                      >
                        {fs.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Xem trước trình đọc Zen */}
                <div className="pt-6 border-t border-zen-muted/40 space-y-3">
                  <h4 className="text-xs font-sans font-semibold text-zen-gray uppercase tracking-widest">
                    Xem trước trang đọc Zen
                  </h4>
                  <div className={`p-5 rounded-2xl border border-zen-muted/60 transition-all ${
                    readerTheme === "light" ? "bg-[#fbf9f4] text-[#1b1c19]" :
                    readerTheme === "dark" ? "bg-[#141512] text-[#d1cdb8]" :
                    readerTheme === "sepia" ? "bg-[#f4edd8] text-[#433422]" :
                    "bg-[#efe8d4] text-[#2d261e] [background-image:radial-gradient(rgba(45,38,30,0.015)_1px,transparent_0),radial-gradient(rgba(45,38,30,0.010)_1px,transparent_0)] bg-[size:24px_24px] bg-[position:0_0,12px_12px]"
                  }`}>
                    <p className={`leading-relaxed text-justify ${
                      readerFont === "serif" ? "font-serif" : "font-sans"
                    } ${
                      readerFontSize === "sm" ? "text-sm" :
                      readerFontSize === "base" ? "text-base" :
                      readerFontSize === "lg" ? "text-lg" : "text-xl"
                    }`}>
                      "Đạo khả đạo phi thường đạo. Danh khả danh phi thường danh. Vô danh thiên địa chi thủy, hữu danh vạn vật chi mẫu..."
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
