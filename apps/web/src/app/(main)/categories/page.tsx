"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Compass, BookOpen, User, Flame, ArrowRight } from "lucide-react";
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

// Danh sách thể loại chi tiết kèm mô tả và chữ Hán cổ tương ứng
const CATEGORY_INFOS = [
  { name: "Võ Hiệp", hanzi: "武俠", desc: "Giang hồ hiểm ác, hào khí can vân. Nơi tụ hội của những kiếm sĩ chính trực và những câu chuyện võ học huyền thoại.", bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600" },
  { name: "Triết Học", hanzi: "哲學", desc: "Tinh hoa học thuật, suy tư nhân sinh. Nơi tìm hiểu các tư tưởng của các bậc hiền triết phương Đông cổ đại.", bgImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600" },
  { name: "Lịch Sử", hanzi: "歷史", desc: "Hào hùng tuế nguyệt, hưng vong chư hầu. Tái hiện những thời kỳ đầy biến động và những bài học lịch sử ngàn năm.", bgImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600" },
  { name: "Thiền Tông", hanzi: "禪宗", desc: "Tâm bình khí hòa, tiêu dao tự tại. Những áng văn khai sáng tinh thần, tìm kiếm sự tự do tuyệt đối giữa trần gian.", bgImage: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=600" },
  { name: "Thi Ca", hanzi: "詩歌", desc: "Tiếng lòng tao nhã, vần điệu nhân sinh. Phản ánh tâm tư tình cảm chân thực của con người thời cổ đại qua thơ ca tao nhã.", bgImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600" }
];

export default function CategoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Võ Hiệp");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getStories();
        setStories(data);
      } catch (error) {
        console.error("[Mặc Quán] Lỗi khi nạp dữ liệu thể loại:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Hàm phụ lấy thể loại truyện
  const getStoryCategory = (slug: string, title: string): string => {
    if (slug === "thien-long-bat-bo") return "Võ Hiệp";
    if (slug === "dao-duc-kinh") return "Triết Học";
    if (slug === "dong-chu-liet-quoc") return "Lịch Sử";
    if (slug === "nam-hoa-kinh") return "Thiền Tông";
    if (slug === "kinh-thi") return "Thi Ca";
    return "Võ Hiệp";
  };

  // Lọc truyện theo thể loại đang chọn
  const filteredStories = stories.filter(s => getStoryCategory(s.slug, s.title) === selectedCategory);
  
  // Thông tin thể loại đang được chọn
  const currentCategoryInfo = CATEGORY_INFOS.find(c => c.name === selectedCategory) || CATEGORY_INFOS[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Tiêu đề trang cổ phong */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zen-cinnabar/25 bg-zen-cinnabar/5 px-4 py-1 text-xs font-semibold text-zen-cinnabar tracking-wider font-sans uppercase">
            <Compass className="h-3.5 w-3.5" /> Phân Định Thể Thức
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zen-ink tracking-wide">
            Độc Bản Thể Loại
          </h1>
          <p className="text-sm italic font-serif text-zen-gray/80 px-4 leading-relaxed">
            "Vạn quyển thư trung tầm đạo nghĩa, Ngũ tông phái hạ kiến chân như."
          </p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zen-cinnabar/40 to-transparent mx-auto mt-2" />
        </div>

        {/* PHẦN 1: GRID THẺ GỖ THỂ LOẠI (Premium UI) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
          {CATEGORY_INFOS.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => startTransition(() => setSelectedCategory(cat.name))}
                className={`relative overflow-hidden p-5 rounded-2xl border text-center transition-all duration-300 group hover:shadow-md ${
                  isSelected
                    ? "bg-zen-cinnabar/5 border-zen-cinnabar shadow-xs"
                    : "bg-white/30 border-zen-muted hover:border-zen-gray/40"
                }`}
              >
                {/* Chữ Hán chìm nghệ thuật */}
                <span className={`absolute right-2 bottom-1 font-serif text-5xl font-black select-none pointer-events-none transition-all duration-500 ${
                  isSelected ? "text-zen-cinnabar/10 scale-110" : "text-zen-gray/5 group-hover:text-zen-gray/10"
                }`}>
                  {cat.hanzi}
                </span>

                <div className="relative space-y-2">
                  <span className={`block font-serif text-lg font-bold transition-colors ${
                    isSelected ? "text-zen-cinnabar" : "text-zen-ink group-hover:text-zen-cinnabar"
                  }`}>
                    {cat.name}
                  </span>
                  <span className={`inline-block text-[9px] font-sans font-medium px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    isSelected ? "bg-zen-cinnabar/10 text-zen-cinnabar" : "bg-zen-muted/60 text-zen-gray"
                  }`}>
                    {cat.hanzi}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* PHẦN 2: THÔNG TIN CHI TIẾT THỂ LOẠI ĐANG CHỌN */}
        <div className="bg-zen-muted/20 border border-zen-muted rounded-3xl p-6 sm:p-8 mb-12 backdrop-blur-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl font-bold text-zen-ink">
                Thể loại: {currentCategoryInfo.name}
              </h2>
              <span className="font-serif text-sm text-zen-cinnabar border border-zen-cinnabar/30 px-2 py-0.5 rounded italic">
                {currentCategoryInfo.hanzi}
              </span>
            </div>
            <p className="text-sm text-zen-gray leading-relaxed font-sans">
              {currentCategoryInfo.desc}
            </p>
          </div>

          <div className="shrink-0 font-serif text-xs text-zen-gray/80 bg-white/40 border border-zen-muted/60 px-4 py-2 rounded-xl">
            Tổng số: <span className="font-bold text-zen-ink">{filteredStories.length}</span> tác phẩm
          </div>
        </div>

        {/* PHẦN 3: LƯỚI DANH SÁCH TRUYỆN THUỘC THỂ LOẠI */}
        {loading ? (
          <div className="text-center py-20">
            <span className="text-sm text-zen-gray animate-pulse font-sans">Đang tìm kiếm thư tịch cổ...</span>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zen-muted rounded-2xl bg-white/20">
            <BookOpen className="w-12 h-12 text-zen-gray mx-auto mb-3 opacity-30 stroke-[1.2]" />
            <h3 className="text-base font-serif font-bold text-zen-ink mb-1">
              Thư Các Chưa Thu Thập Tác Phẩm
            </h3>
            <p className="text-xs text-zen-gray font-sans max-w-xs mx-auto">
              Thể loại này hiện đang được các dịch giả thu thập và biên soạn thêm dữ liệu.
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
            {filteredStories.map((story) => (
              <div
                key={story.slug}
                className="group flex gap-5 p-5 rounded-2xl border border-zen-muted/50 bg-white/30 hover:border-zen-cinnabar/30 hover:shadow-sm transition-all duration-300"
              >
                {/* Ảnh bìa */}
                <Link
                  href={`/story/${story.slug}`}
                  className="w-24 h-32 bg-muted rounded-xl overflow-hidden border border-zen-muted shrink-0 shadow-2xs block"
                >
                  <img
                    src={story.coverUrl || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600"}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </Link>

                {/* Nội dung tóm tắt */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-lg text-zen-ink group-hover:text-zen-cinnabar transition-colors duration-200 line-clamp-1">
                      <Link href={`/story/${story.slug}`}>{story.title}</Link>
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-zen-gray font-sans">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {story.author}</span>
                      <span>•</span>
                      <span>{story.viewCount.toLocaleString()} đọc</span>
                    </div>

                    <p className="text-xs sm:text-sm text-zen-gray font-sans line-clamp-2 leading-relaxed pt-1">
                      {story.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zen-muted/30 pt-3 mt-2">
                    <span className="text-[10px] text-zen-gray/80 italic font-serif">
                      Chương mới nhất: {story.chapters?.[story.chapters.length - 1]?.title || "Chương 1"}
                    </span>

                    <Link
                      href={`/story/${story.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zen-cinnabar hover:underline"
                    >
                      Chi tiết <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
