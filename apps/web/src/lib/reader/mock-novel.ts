import { fetchApi } from '../api-client';

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string[];
}

export interface Novel {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  totalChapters: number;
  chapters: Pick<Chapter, 'id' | 'chapterNumber' | 'title'>[];
}

export const mockNovel: Novel = {
  id: 'nov_thien_long',
  slug: 'thien-long-bat-bo',
  title: 'Thiên Long Bát Bộ',
  author: 'Kim Dung',
  coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  description: 'Một kiệt tác kiếm hiệp võ học đỉnh cao của nhà văn Kim Dung, lồng ghép sâu sắc các triết lý nhân quả của Phật giáo và võ hiệp cổ trang. Câu chuyện xoay quanh vận mệnh đầy thăng trầm của Kiều Phong, Đoàn Dự và Hư Trúc giữa vòng xoáy ân oán giang hồ và chiến tranh quốc gia.',
  totalChapters: 2,
  chapters: [
    { id: 'ch_thien_long_1', chapterNumber: 1, title: 'Chương 1: Khởi đầu hồng trần, kiếm khí phong vân' },
    { id: 'ch_thien_long_2', chapterNumber: 2, title: 'Chương 2: Nhạn Môn quan ngoại, huyết lệ giang hồ' },
  ],
};

const mockChapters: Record<number, Chapter> = {
  1: {
    id: 'ch_thien_long_1',
    chapterNumber: 1,
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
    id: 'ch_thien_long_2',
    chapterNumber: 2,
    title: 'Chương 2: Nhạn Môn quan ngoại, huyết lệ giang hồ',
    content: [
      "Tiếng vó ngựa dồn dập phá tan sự yên lặng của thung lũng sương mù. Dưới chân đèo Nhạn Môn quan, từng luồng sát khí ngút trời đang tụ hội. Những chiếc áo bào thêu hoa văn kỳ lạ của các cao thủ võ lâm đại diện cho các thế lực lớn đang tập kết để đón đầu một mối hiểm họa truyền thuyết.",
      "Kiều Phong đứng trên mỏm đá cao, tà áo thô bay phần phật trong gió lớn. Y thầm kinh ngạc khi chứng kiến sự hiện diện của những danh môn chánh phái vốn ít khi can thiệp vào biên ải. Điều gì đã khiến lòng người xao động đến thế?",
      "Một bức thư mật viết trên giấy da dê đã ngả màu vàng úa, nét chữ vội vã nhưng ẩn chứa bí mật có thể làm đảo lộn cả võ lâm Trung Nguyên. Đó là câu chuyện về một đứa trẻ sơ sinh Khế Đan và một thảm án đẫm máu ba mươi năm trước.",
      "Đúng lúc ấy, tiếng tù và từ phía biên thùy Khế Đan vang lên trầm hùng, kéo theo bụi cát mù trời. Những trận chiến ân oán hồng trần sắp sửa cuốn tất cả vào vòng xoáy không lối thoát. Liệu Kiều Phong có giữ vững được tâm cảnh thanh tịnh tựa mặt hồ mùa thu trước cơn bão lớn này?"
    ]
  }
};

export async function getNovel(slug: string): Promise<Novel> {
  try {
    const apiNovel = await fetchApi<any>(`/stories/${slug}`);
    return {
      id: apiNovel.id,
      slug: apiNovel.slug,
      title: apiNovel.title,
      author: apiNovel.author || 'Kim Dung', 
      coverUrl: apiNovel.coverUrl || mockNovel.coverUrl,
      description: apiNovel.description || '',
      totalChapters: apiNovel.chapters?.length || 0,
      chapters: (apiNovel.chapters || []).map((ch: any) => ({
        id: ch.id,
        chapterNumber: ch.chapterNum,
        title: ch.title,
      })),
    };
  } catch (err) {
    console.warn(`[Mặc Quán] Không thể gọi API câu chuyện cho slug ${slug}, sử dụng fallback.`, err);
    if (slug === 'thien-long-bat-bo') {
      return mockNovel;
    }
    // Trả về mock novel với slug tương ứng
    return {
      ...mockNovel,
      slug,
      title: slug === 'dao-duc-kinh' ? 'Đạo Đức Kinh' : slug === 'dong-chu-liet-quoc' ? 'Đông Chu Liệt Quốc' : mockNovel.title,
      author: slug === 'dao-duc-kinh' ? 'Lão Tử' : slug === 'dong-chu-liet-quoc' ? 'Phùng Mộng Long' : mockNovel.author,
    };
  }
}

export async function getChapter(slug: string, chapterNumber: number): Promise<Chapter> {
  try {
    const apiChapter = await fetchApi<any>(`/chapters/${slug}/${chapterNumber}`);
    
    // Nếu backend trả về htmlContent, ta có thể split thành các đoạn văn hoặc giữ nguyên
    // Để tương thích với kiểu string[] của giao diện cũ (nếu có dùng), ta split theo thẻ p.
    // Tuy nhiên, đa số trang mới đã dùng dangerouslySetInnerHTML trực tiếp.
    let textParagraphs: string[] = [];
    if (apiChapter.htmlContent) {
      // Tách các đoạn văn thô sơ từ htmlContent
      textParagraphs = apiChapter.htmlContent
        .replace(/<[^>]*>/g, '\n')
        .split('\n')
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
    }

    return {
      id: apiChapter.chapter.id,
      chapterNumber: apiChapter.chapter.chapterNum,
      title: apiChapter.chapter.title,
      content: textParagraphs.length > 0 ? textParagraphs : [apiChapter.htmlContent || ''], 
    };
  } catch (err) {
    console.warn(`[Mặc Quán] Không thể gọi API chương ${chapterNumber} cho slug ${slug}, sử dụng fallback.`, err);
    return new Promise((resolve, reject) => {
      const chapter = mockChapters[chapterNumber];
      if (chapter) resolve(chapter);
      else reject(new Error('Chương truyện không tồn tại trong hệ thống.'));
    });
  }
}

export async function getAllNovels(): Promise<Novel[]> {
  try {
    const apiNovels = await fetchApi<any[]>('/stories/leaderboard'); // Lấy danh sách từ bảng xếp hạng hoặc tương đương
    return apiNovels.map(n => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      author: n.author || 'Kim Dung',
      coverUrl: n.coverUrl || mockNovel.coverUrl,
      description: n.description || '',
      totalChapters: 0, 
      chapters: [],
    }));
  } catch (err) {
    console.warn('[Mặc Quán] Không thể gọi danh sách tác phẩm, sử dụng dữ liệu tĩnh.', err);
    return [
      mockNovel,
      {
        ...mockNovel,
        id: 'nov_dao_duc',
        slug: 'dao-duc-kinh',
        title: 'Đạo Đức Kinh',
        author: 'Lão Tử',
        coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop',
        description: 'Tác phẩm triết học kinh điển Đông Phương của hiền triết Lão Tử, nền tảng của Đạo giáo. Sách gồm 81 chương lý giải về bản nguyên vũ trụ và lẽ sống tĩnh lặng vô vi.',
      },
      {
        ...mockNovel,
        id: 'nov_dong_chu',
        slug: 'dong-chu-liet-quoc',
        title: 'Đông Chu Liệt Quốc',
        author: 'Phùng Mộng Long',
        coverUrl: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop',
        description: 'Bộ tiểu thuyết lịch sử đồ sộ phản ánh giai đoạn đầy biến động Xuân Thu Chiến Quốc của Trung Hoa cổ đại với các mưu lược và điển tích hào hùng.',
      }
    ];
  }
}

export async function getAdjacentChapters(slug: string, chapterNumber: number) {
  try {
    const apiChapter = await fetchApi<any>(`/chapters/${slug}/${chapterNumber}`);
    return {
      prev: apiChapter.prevChapterNum ? { number: apiChapter.prevChapterNum } : null,
      next: apiChapter.nextChapterNum ? { number: apiChapter.nextChapterNum } : null,
    };
  } catch (err) {
    // Nếu API lỗi, fallback sang cơ chế offline
    const novel = await getNovel(slug);
    const currentIndex = novel.chapters.findIndex(c => c.chapterNumber === chapterNumber);
    
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }
    
    const prev = currentIndex > 0 ? novel.chapters[currentIndex - 1] : null;
    const next = currentIndex < novel.chapters.length - 1 ? novel.chapters[currentIndex + 1] : null;

    return {
      prev: prev ? { number: prev.chapterNumber } : null,
      next: next ? { number: next.chapterNumber } : null,
    };
  }
}
