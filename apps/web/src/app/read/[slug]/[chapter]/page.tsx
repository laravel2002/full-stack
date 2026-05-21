'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { BookOpen, ArrowLeft, ArrowRight, Settings, RotateCcw } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';
import { useLibraryStore } from '@/stores/library-store';

// Dữ liệu nội dung chương chất lượng cao mang văn phong kiếm hiệp/thiền tông để mock làm dự phòng
const chaptersData: Record<string, Record<number, {
  title: string;
  storyTitle: string;
  storySlug: string;
  content: string[];
}>> = {
  'thien-long-bat-bo': {
    1: {
      storyTitle: 'Thiên Long Bát Bộ',
      storySlug: 'thien-long-bat-bo',
      title: 'Chương 1: Khởi đầu hồng trần, kiếm khí phong vân',
      content: [
        "Màn sương lạnh phủ kín đỉnh Nhạn Môn quan, gió bấc gào rít qua khe đá nhọn như tiếng gươm đao khua động. Giữa khung cảnh tiêu điều ấy, một bóng người độc hành cưỡi ngựa từ phía xa đi tới. Y mặc áo vải thô, vai đeo một bầu rượu cũ, dung mạo phong trần nhưng đôi mắt sáng quắc như sao đêm, toát lên khí phách ngút ngàn của bậc hào kiệt giang hồ.",
        "Đó chính là Kiều Phong, bang chủ Cái Bang uy chấn thiên hạ. Y vừa nhận được mật báo về sự xuất hiện của Khế Đan kỵ binh vùng biên ải. Hồng trần cuồn cuộn, ân oán giang hồ và đại nghĩa quốc gia, tất cả như những quân cờ vô hình đang bủa vây lấy số phận của y.",
        "Tiếng đàn tranh vọng lại từ quán nước bên đường cắt ngang dòng suy nghĩ của Kiều Phong. Tiếng đàn lúc trầm lúc bổng, khi thì nhẹ nhàng như nước chảy qua cầu, khi thì dồn dập như bão táp mưa sa. Kiều Phong mỉm cười khẽ gật đầu, y biết mình sắp gặp một vị cố nhân hữu duyên.",
        "Trong giang hồ, ai cũng biết câu nói: 'Bắc Kiều Phong, Nam Mộ Dung'. Nhưng ít ai thấu hiểu được nỗi cô đơn tột cùng của kẻ đứng trên đỉnh cao võ học. Mỗi bước đi là một vết chân hằn sâu vào cát bụi thời gian, mỗi đường kiếm vạch ra là một lần ranh giới sinh tử cận kề.",
        "Kiều Phong ghìm cương ngựa, ngửa cổ uống một ngụm rượu nồng, ánh mắt hướng về phía chân trời xa xăm, nơi mây đen đang cuồn cuộn kéo tới báo hiệu một trận cuồng phong huyết lệ sắp bắt đầu."
      ]
    },
    2: {
      storyTitle: 'Thiên Long Bát Bộ',
      storySlug: 'thien-long-bat-bo',
      title: 'Chương 2: Nhạn Môn quan ngoại, huyết lệ giang hồ',
      content: [
        "Tiếng vó ngựa dồn dập phá tan sự yên lặng của thung lũng sương mù. Dưới chân đèo Nhạn Môn quan, từng luồng sát khí ngút trời đang tụ hội. Những chiếc áo bào thêu hoa văn kỳ lạ của các cao thủ võ lâm đại diện cho các thế lực lớn đang tập kết để đón đầu một mối hiểm họa truyền thuyết.",
        "Kiều Phong đứng trên mỏm đá cao, tà áo thô bay phần phật trong gió lớn. Y thầm kinh ngạc khi chứng kiến sự hiện diện của những danh môn chánh phái vốn ít khi can thiệp vào biên ải. Điều gì đã khiến lòng người xao động đến thế?",
        "Một bức thư mật viết trên giấy da dê đã ngả màu vàng úa, nét chữ vội vã nhưng ẩn chứa bí mật có thể làm đảo lộn cả võ lâm Trung Nguyên. Đó là câu chuyện về một đứa trẻ sơ sinh Khế Đan và một thảm án đẫm máu ba mươi năm trước.",
        "Đúng lúc ấy, tiếng tù và từ phía biên thùy Khế Đan vang lên trầm hùng, kéo theo bụi cát mù trời. Những trận chiến ân oán hồng trần sắp sửa cuốn tất cả vào vòng xoáy không lối thoát. Liệu Kiều Phong có giữ vững được tâm cảnh thanh tịnh tựa mặt hồ mùa thu trước cơn bão lớn này?"
      ]
    }
  },
  'dao-duc-kinh': {
    1: {
      storyTitle: 'Đạo Đức Kinh',
      storySlug: 'dao-duc-kinh',
      title: 'Chương 1: Khải huyền chi môn - Đạo khả đạo phi thường đạo',
      content: [
        "Đạo mà ta có thể gọi được, không phải là Đạo vĩnh hằng vô tận. Tên mà ta có thể đặt được, không phải là Tên vĩnh hằng bất biến. Không tên là khởi thủy của trời đất; có tên là mẹ sinh ra muôn vật.",
        "Cho nên, thường không có ham muốn thì mới nhìn thấy được bản thể vi diệu của Đạo; thường có ham muốn thì chỉ nhìn thấy cái vỏ biểu hiện bên ngoài của vạn vật mà thôi. Cả hai trạng thái ấy cùng một nguồn gốc sinh ra nhưng khác tên gọi, đều là cõi thâm sâu huyền bí.",
        "Huyền bí rồi lại huyền bí hơn nữa, đó chính là cánh cửa dẫn vào mọi sự biến hóa kỳ diệu của vũ trụ vạn vật. Người quân tử ngắm nhìn thế gian bằng đôi mắt vô vi, để vạn sự vận hành tự nhiên không cưỡng cầu.",
        "Tĩnh tọa giữa gian nhà tranh đơn sơ, nghe hơi thở hòa nhịp cùng đất trời, hiền triết mỉm cười nhận ra Đạo vốn dĩ vô hình vô tướng, chẳng ở đâu xa mà hiện hữu trong từng đóa hoa dại, từng ngọn gió lành lướt nhẹ qua vai."
      ]
    },
    2: {
      storyTitle: 'Đạo Đức Kinh',
      storySlug: 'dao-duc-kinh',
      title: 'Chương 2: Bản nguyên vô danh, triết lý hư vô',
      content: [
        "Thế gian ai cũng biết cái đẹp là đẹp, nhờ đó mới xuất hiện cái xấu. Ai cũng biết cái thiện là thiện, nhờ đó mới xuất hiện cái ác. Có và Không sinh ra lẫn nhau; Dễ và Khó hoàn thành lẫn nhau; Ngắn và Dài so sánh với nhau; Cao và Thấp dựa vào nhau.",
        "Vì vậy, bậc thánh nhân xử sự bằng thái độ Vô vi (không can thiệp khiên cưỡng) và dạy dỗ người đời bằng lời nói Vô ngôn (không dùng giáo điều sáo rỗng). Vạn vật sinh sôi mà không chiếm đoạt, nuôi dưỡng muôn loài mà không cậy công.",
        "Bởi vì không tranh giành, không nhận vinh quang về mình, nên danh tiếng và đạo đức của bậc thánh nhân mới trường tồn vĩnh cửu cùng thời gian, tựa như dòng sông lặng lẽ bồi đắp phù sa mà chẳng mưu cầu đền đáp."
      ]
    }
  }
};

export default function ReaderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const chapterNum = parseInt(params.chapter as string, 10);
  
  const addToHistory = useLibraryStore((state) => state.addToHistory);

  // 1. Quản lý trạng thái giao diện Zen Mode (sử dụng Client State để WOW người dùng)
  const [fontSize, setFontSize] = useState<number>(18); // Cỡ chữ mặc định: 18px
  const [lineHeight, setLineHeight] = useState<string>('relaxed'); // Giãn dòng: relaxed, loose, normal
  const [theme, setTheme] = useState<'paper' | 'sepia' | 'dark' | 'xuyenchi'>('paper'); // Màu nền mặc định: Giấy tuyên
  const [showToolbar, setShowToolbar] = useState<boolean>(false); // Ẩn/Hiện thanh công cụ đọc
  
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [chaptersList, setChaptersList] = useState<{ chapterNum: number; title: string }[]>([]);
  const [loadingChapters, setLoadingChapters] = useState<boolean>(false);

  // Trạng thái nạp dữ liệu động từ API Backend
  const [data, setData] = useState<{
    story: { title: string; slug: string; author: string };
    chapter: { title: string; chapterNum: number };
    htmlContent: string;
    prevChapterNum: number | null;
    nextChapterNum: number | null;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Áp dụng lớp theme tương ứng lên thẻ html/body để đảm bảo đồng nhất giao diện
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia', 'xuyenchi');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia');
    } else if (theme === 'xuyenchi') {
      root.classList.add('xuyenchi');
    }
  }, [theme]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadChapter() {
      try {
        const payload = await fetchApi<any>(`/chapters/${slug}/${chapterNum}`);
        if (!isMounted) return;
        
        setData({
          story: {
            title: payload.story.title,
            slug: payload.story.slug,
            author: payload.story.author,
          },
          chapter: {
            title: payload.chapter.title,
            chapterNum: payload.chapter.chapterNum,
          },
          htmlContent: payload.htmlContent,
          prevChapterNum: payload.prevChapterNum,
          nextChapterNum: payload.nextChapterNum,
        });
        setLoading(false);
      } catch (err) {
        console.error(`[Mặc Quán] Không thể gọi API chapter /chapters/${slug}/${chapterNum}, dùng dữ liệu dự phòng:`, err);
        if (!isMounted) return;

        // Fallback về mock data cục bộ
        const storyChapters = chaptersData[slug];
        const mockChapter = storyChapters ? storyChapters[chapterNum] : null;

        if (mockChapter) {
          // Chuyển đổi mảng các đoạn văn mock data sang cấu trúc HTML p tag
          const htmlContent = mockChapter.content
            .map((p) => `<p>${p}</p>`)
            .join('\n');

          setData({
            story: {
              title: mockChapter.storyTitle,
              slug: mockChapter.storySlug,
              author: 'Dự phòng',
            },
            chapter: {
              title: mockChapter.title,
              chapterNum: chapterNum,
            },
            htmlContent,
            prevChapterNum: storyChapters[chapterNum - 1] ? chapterNum - 1 : null,
            nextChapterNum: storyChapters[chapterNum + 1] ? chapterNum + 1 : null,
          });
        } else {
          setError('Không tìm thấy chương truyện yêu cầu.');
        }
        setLoading(false);
      }
    }

    loadChapter();

    return () => {
      isMounted = false;
    };
  }, [slug, chapterNum]);

  // Tự động ghi nhận vào lịch sử đọc khi nạp chương thành công
  useEffect(() => {
    if (data && data.story && data.chapter) {
      addToHistory(data.story.slug, data.chapter.chapterNum);
    }
  }, [data, addToHistory]);

  const toggleSidebar = async () => {
    const nextShow = !showSidebar;
    setShowSidebar(nextShow);
    if (nextShow && chaptersList.length === 0) {
      setLoadingChapters(true);
      try {
        const payload = await fetchApi<any>(`/stories/${slug}`);
        if (payload && payload.chapters) {
          setChaptersList(
            payload.chapters.map((ch: any) => ({
              chapterNum: ch.chapterNum,
              title: ch.title,
            }))
          );
        }
      } catch (err) {
        console.error('[Mặc Quán] Lỗi nạp danh sách chương cho mục lục:', err);
        // Fallback nếu lỗi API
        const fallback = chaptersData[slug];
        if (fallback) {
          const list = Object.keys(fallback).map((num) => ({
            chapterNum: parseInt(num, 10),
            title: fallback[parseInt(num, 10)].title,
          }));
          setChaptersList(list);
        }
      } finally {
        setLoadingChapters(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbf9f4] dark:bg-[#141512] transition-colors duration-300 pb-16">
        <header className="w-full py-4 px-6 border-b border-zen-muted/20 flex items-center justify-between">
          <div className="h-4 w-16 bg-zen-muted/60 animate-pulse rounded-md" />
          <div className="h-4 w-32 bg-zen-muted/60 animate-pulse rounded-md" />
          <div className="h-8 w-8 bg-zen-muted/60 animate-pulse rounded-full" />
        </header>
        <main className="flex-1 max-w-[680px] w-full mx-auto px-4 sm:px-0 mt-24 space-y-12">
          <div className="text-center space-y-4 border-b border-zen-muted/30 pb-8">
            <div className="h-8 w-3/4 mx-auto bg-zen-muted/60 animate-pulse rounded-lg" />
            <div className="h-4 w-1/2 mx-auto bg-zen-muted/60 animate-pulse rounded-md" />
          </div>
          <div className="space-y-6">
            <div className="h-4 w-full bg-zen-muted/60 animate-pulse rounded" />
            <div className="h-4 w-[95%] bg-zen-muted/60 animate-pulse rounded" />
            <div className="h-4 w-[98%] bg-zen-muted/60 animate-pulse rounded" />
            <div className="h-4 w-[90%] bg-zen-muted/60 animate-pulse rounded" />
            <div className="h-4 w-[92%] bg-zen-muted/60 animate-pulse rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbf9f4] dark:bg-[#141512] items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <h2 className="font-serif text-3xl font-bold text-zen-cinnabar">Thư Phòng Gặp Trở Ngại</h2>
          <p className="font-sans text-sm text-zen-gray leading-relaxed">
            {error || 'Không thể tìm thấy nội dung chương truyện đã yêu cầu trong Mặc Quán.'}
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href={`/story/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-zen-muted/60 px-5 py-2 text-xs font-semibold hover:border-zen-cinnabar hover:text-zen-cinnabar transition-all duration-200"
            >
              Mục Lục Truyện
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-zen-ink px-5 py-2 text-xs font-semibold text-zen-paper hover:bg-zen-cinnabar transition-all duration-200"
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 pb-24 md:pb-16 selection:bg-zen-cinnabar selection:text-zen-paper">
      
      {/* HEADER TỐI GIẢN TẬT CÙNG (Chỉ hiển thị nút quay lại & Tên truyện nhỏ) */}
      <header className="w-full py-4 px-6 border-b border-zen-muted/20 flex items-center justify-between">
        <Link 
          href={`/story/${slug}`}
          className="flex items-center gap-1.5 font-sans text-xs text-zen-gray hover:text-zen-cinnabar transition-colors duration-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại
        </Link>
        <span className="font-serif text-xs text-zen-gray tracking-widest uppercase truncate max-w-[40%]">
          {data.story.title}
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleSidebar}
            className="rounded-full p-2 text-zen-gray hover:bg-zen-muted/50 hover:text-zen-cinnabar transition-all duration-200"
            title="Mục lục chương"
          >
            <BookOpen className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setShowToolbar(!showToolbar)}
            className="rounded-full p-2 text-zen-gray hover:bg-zen-muted/50 hover:text-zen-cinnabar transition-all duration-200"
            title="Tùy chỉnh giao diện đọc"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* THANH CÔNG CỤ TÙY CHỈNH (SETTINGS FLOATING TOOLBAR) */}
      {showToolbar && (
        <div className="fixed top-16 right-6 z-50 w-72 rounded-2xl border border-zen-muted/60 bg-white/95 dark:bg-zinc-900/95 p-5 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="space-y-6">
            <h4 className="font-serif text-sm font-bold text-zen-ink dark:text-foreground border-b border-zen-muted/30 pb-2">
              Tùy Chọn Đọc Sách
            </h4>

            {/* Điều chỉnh cỡ chữ */}
            <div className="space-y-2">
              <span className="font-sans text-xs text-zen-gray block">Cỡ chữ: {fontSize}px</span>
              <div className="flex items-center justify-between gap-3">
                <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  className="flex-1 rounded-lg border border-zen-muted/50 bg-zen-paper dark:bg-zinc-800 text-xs font-semibold py-1.5 hover:border-zen-cinnabar hover:text-zen-cinnabar dark:text-foreground transition-all"
                >
                  A-
                </button>
                <button 
                  onClick={() => setFontSize(18)}
                  className="rounded-lg border border-zen-muted/50 px-2 py-1.5 text-xs text-zen-gray hover:text-zen-cinnabar transition-all"
                  title="Đặt lại mặc định"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setFontSize(Math.min(30, fontSize + 1))}
                  className="flex-1 rounded-lg border border-zen-muted/50 bg-zen-paper dark:bg-zinc-800 text-xs font-semibold py-1.5 hover:border-zen-cinnabar hover:text-zen-cinnabar dark:text-foreground transition-all"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Điều chỉnh giãn dòng */}
            <div className="space-y-2">
              <span className="font-sans text-xs text-zen-gray block">Giãn dòng:</span>
              <div className="flex rounded-lg border border-zen-muted/50 overflow-hidden text-xs">
                {(['normal', 'relaxed', 'loose'] as const).map((lh) => (
                  <button
                    key={lh}
                    onClick={() => setLineHeight(lh)}
                    className={`flex-1 py-2 font-medium capitalize transition-all ${
                      lineHeight === lh 
                        ? 'bg-zen-cinnabar text-zen-paper' 
                        : 'bg-transparent text-zen-ink/80 dark:text-foreground hover:bg-zen-muted/30'
                    }`}
                  >
                    {lh === 'normal' ? 'Gọn' : lh === 'relaxed' ? 'Thoáng' : 'Rộng'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn màu nền */}
            <div className="space-y-2">
              <span className="font-sans text-xs text-zen-gray block">Màu nền:</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setTheme('paper')}
                  className={`rounded-lg py-2 text-xs border font-medium transition-all ${
                    theme === 'paper' 
                      ? 'border-zen-cinnabar text-zen-cinnabar bg-[#fbf9f4]' 
                      : 'border-zinc-300 text-zinc-800 dark:text-zinc-300 bg-[#fbf9f4]'
                  }`}
                >
                  Giấy Tuyên
                </button>
                <button 
                  onClick={() => setTheme('xuyenchi')}
                  className={`rounded-lg py-2 text-xs border font-medium transition-all ${
                    theme === 'xuyenchi' 
                      ? 'border-zen-cinnabar text-zen-cinnabar bg-[#efe8d4]' 
                      : 'border-zinc-300 text-[#2d261e] bg-[#efe8d4]'
                  }`}
                >
                  Xuyến Chỉ
                </button>
                <button 
                  onClick={() => setTheme('sepia')}
                  className={`rounded-lg py-2 text-xs border font-medium transition-all ${
                    theme === 'sepia' 
                      ? 'border-zen-cinnabar text-[#a02021] bg-[#f4edd8]' 
                      : 'border-amber-200/50 text-[#433422] bg-[#f4edd8]'
                  }`}
                >
                  Sepia
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`rounded-lg py-2 text-xs border font-medium transition-all ${
                    theme === 'dark' 
                      ? 'border-zen-cinnabar text-zen-paper bg-[#141512]' 
                      : 'border-zinc-800 text-zinc-400 bg-[#141512]'
                  }`}
                >
                  Mực Đêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KHU VỰC NỘI DUNG ĐỌC ZEN MODE (GIỚI HẠN TUYỆT ĐỐI RỘNG 680px) */}
      <main className="flex-1 max-w-[680px] mx-auto px-4 sm:px-0 mt-12 md:mt-20">
        <article className="space-y-8">
          
          {/* Tiêu đề chương */}
          <div className="text-center space-y-4 border-b border-zen-muted/30 pb-8 mb-12">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-wide text-zen-ink dark:text-foreground">
              {data.chapter.title}
            </h1>
            <p className="font-sans text-xs text-zen-gray italic">
              Tác phẩm: {data.story.title} • Chương số #{data.chapter.chapterNum}
            </p>
          </div>

          {/* Các đoạn văn bản tối ưu hóa cao độ cho trải nghiệm Zen Reader */}
          <div 
            className="zen-html-content font-sans text-zen-ink dark:text-[#d1cdb8]"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight === 'normal' ? '1.6' : lineHeight === 'relaxed' ? '1.9' : '2.2' 
            }}
            dangerouslySetInnerHTML={{ __html: data.htmlContent }}
          />
        </article>

        {/* PHÂN TRANG / ĐIỀU HƯỚNG CHƯƠNG THANH NHÃ CỔ ĐIỂN */}
        <div className="flex items-center justify-between border-t border-zen-muted/30 pt-8 mt-16 pb-12">
          {data.prevChapterNum ? (
            <Link
              href={`/read/${slug}/${data.prevChapterNum}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-zen-muted/60 px-5 py-2 text-xs font-semibold hover:border-zen-cinnabar hover:text-zen-cinnabar dark:text-[#d1cdb8] transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Chương Trước
            </Link>
          ) : (
            <span className="opacity-30 inline-flex items-center gap-1.5 border border-zen-muted/20 px-5 py-2 text-xs text-zen-gray rounded-full select-none cursor-not-allowed">
              <ArrowLeft className="h-3.5 w-3.5" /> Chương Đầu
            </span>
          )}

          <Link
            href={`/story/${slug}`}
            className="flex items-center gap-1 text-xs text-zen-gray hover:text-zen-cinnabar transition-colors"
            title="Quay lại mục lục tác phẩm"
          >
            <BookOpen className="h-4 w-4" /> Mục Lục
          </Link>

          {data.nextChapterNum ? (
            <Link
              href={`/read/${slug}/${data.nextChapterNum}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-zen-cinnabar px-5 py-2 text-xs font-semibold text-zen-paper hover:bg-opacity-90 shadow-sm transition-all"
            >
              Chương Tiếp <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="opacity-30 inline-flex items-center gap-1.5 border border-zen-muted/20 px-5 py-2 text-xs text-zen-gray rounded-full select-none cursor-not-allowed">
              Hết Truyện <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </main>

      {/* BACKDROP CHO SIDEBAR MỤC LỤC */}
      {showSidebar && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* SIDEBAR MỤC LỤC TRƯỢT (DRAWER) */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white/95 dark:bg-zinc-900/95 border-l border-zen-muted/30 p-6 shadow-2xl backdrop-blur-md transform transition-transform duration-300 ease-in-out flex flex-col ${
        showSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between border-b border-zen-muted/30 pb-4 mb-4">
          <h3 className="font-serif text-lg font-bold text-zen-ink dark:text-foreground">
            Mục Lục Tác Phẩm
          </h3>
          <button 
            onClick={() => setShowSidebar(false)}
            className="text-xs text-zen-gray hover:text-zen-cinnabar font-sans font-semibold"
          >
            Đóng ✕
          </button>
        </div>

        {/* Nội dung danh sách chương */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-sans">
          {loadingChapters ? (
            // Skeleton Loading cho mục lục
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-full bg-zen-muted/40 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : chaptersList.length === 0 ? (
            <p className="text-xs text-zen-gray italic text-center py-8">Không thể tải mục lục.</p>
          ) : (
            chaptersList.map((ch) => (
              <Link
                key={ch.chapterNum}
                href={`/read/${slug}/${ch.chapterNum}`}
                onClick={() => setShowSidebar(false)}
                className={`flex items-center p-3 rounded-lg border text-sm transition-all duration-200 ${
                  ch.chapterNum === chapterNum
                    ? 'border-zen-cinnabar text-zen-cinnabar bg-zen-cinnabar/5 font-semibold'
                    : 'border-transparent text-zen-ink/80 dark:text-zinc-300 hover:border-zen-muted hover:bg-zen-muted/30'
                }`}
              >
                <span className="font-serif text-xs text-zen-cinnabar/80 mr-3 w-6 shrink-0">
                  #{ch.chapterNum}
                </span>
                <span className="truncate">{ch.title.replace(/^Chương \d+:\s*/, '')}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* BOTTOM BAR CỐ ĐỊNH CHO DI ĐỘNG & TRẢI NGHIỆM ĐỌC NHANH */}
      <div className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zen-muted/20 flex items-center justify-around px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] md:hidden">
        {data.prevChapterNum ? (
          <Link
            href={`/read/${slug}/${data.prevChapterNum}`}
            className="flex flex-col items-center gap-0.5 text-zen-gray hover:text-zen-cinnabar transition-colors"
            title="Chương Trước"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-[10px] font-medium font-sans">Chương Trước</span>
          </Link>
        ) : (
          <span className="opacity-30 flex flex-col items-center gap-0.5 text-zen-gray cursor-not-allowed select-none">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-[10px] font-medium font-sans">Chương Đầu</span>
          </span>
        )}

        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center gap-0.5 text-zen-gray hover:text-zen-cinnabar transition-colors"
          title="Mục Lục"
        >
          <BookOpen className="h-4 w-4" />
          <span className="text-[10px] font-medium font-sans">Mục Lục</span>
        </button>

        <button
          onClick={() => setShowToolbar(!showToolbar)}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            showToolbar ? 'text-zen-cinnabar' : 'text-zen-gray hover:text-zen-cinnabar'
          }`}
          title="Cài Đặt"
        >
          <Settings className="h-4 w-4" />
          <span className="text-[10px] font-medium font-sans">Tùy Chọn</span>
        </button>

        {data.nextChapterNum ? (
          <Link
            href={`/read/${slug}/${data.nextChapterNum}`}
            className="flex flex-col items-center gap-0.5 text-zen-gray hover:text-zen-cinnabar transition-colors"
            title="Chương Tiếp"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="text-[10px] font-medium font-sans">Chương Tiếp</span>
          </Link>
        ) : (
          <span className="opacity-30 flex flex-col items-center gap-0.5 text-zen-gray cursor-not-allowed select-none">
            <ArrowRight className="h-4 w-4" />
            <span className="text-[10px] font-medium font-sans">Hết Truyện</span>
          </span>
        )}
      </div>

    </div>
  );
}
