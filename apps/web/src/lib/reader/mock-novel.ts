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
  id: 'nov_1',
  slug: 'the-awakening',
  title: 'The Awakening',
  author: 'Elena Vance',
  coverUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000&auto=format&fit=crop',
  description: 'A journey into the unknown depths of a forgotten world.',
  totalChapters: 2,
  chapters: [
    { id: 'ch_1', chapterNumber: 1, title: 'Chapter 1: The Call' },
    { id: 'ch_2', chapterNumber: 2, title: 'Chapter 2: Departure' },
  ],
};

const mockChapters: Record<number, Chapter> = {
  1: {
    id: 'ch_1',
    chapterNumber: 1,
    title: 'Chapter 1: The Call',
    content: [
      "The wind howled through the ancient trees, their bare branches scratching against the windowpane like desperate fingers. In the dimly lit room, Elara sat huddled over the dusty tome, her eyes scanning the faded ink.",
      "She had been searching for this book for years, a relic from a forgotten age, said to hold the key to the lost city of Aethelgard. Her heart pounded against her ribs as she finally deciphered the final passage.",
      "The journey would be perilous, filled with unknown dangers and mythical beasts. But the promise of uncovering the truth, of proving her grandfather's theories, was a fire that burned brighter than any fear.",
      "With a resolute sigh, she closed the book. Tomorrow, at first light, she would leave the safety of her village. The Awakening had begun.",
      "Far away, in the heart of the shadowed mountains, a pair of crimson eyes snapped open. The seal was weakening. The time of waiting was drawing to a close."
    ]
  },
  2: {
    id: 'ch_2',
    chapterNumber: 2,
    title: 'Chapter 2: Departure',
    content: [
      "Dawn broke with a cold, grey light, painting the sky in shades of slate and pearl. Elara stood at the edge of the village, her breath pluming in the crisp air. Her pack was heavy, laden with provisions and the ancient tome.",
      "She cast one last look at the cluster of thatched-roof cottages, her home for as long as she could remember. A pang of melancholy tightened her chest, but she pushed it aside. Her path lay forward.",
      "The Whispering Woods loomed ahead, a dense tangle of ancient trees that seemed to drink the morning light. The villagers spoke of the woods in hushed tones, trading tales of spirits and shape-shifters.",
      "Elara tightened the straps of her pack and took her first step onto the moss-covered path. The forest swallowed her whole, the air growing thick with the scent of damp earth and decaying leaves.",
      "She hadn't gone far when she heard the first snap of a twig. It was faint, but unmistakable. Something was following her."
    ]
  }
};

export async function getNovel(slug: string): Promise<Novel> {
  try {
    const apiNovel = await fetchApi<any>(`/novels/${slug}`);
    return {
      id: apiNovel.id,
      slug: apiNovel.slug,
      title: apiNovel.title,
      author: 'Unknown Author', 
      coverUrl: apiNovel.coverImage || mockNovel.coverUrl,
      description: apiNovel.description || '',
      totalChapters: apiNovel.chapters?.length || 0,
      chapters: apiNovel.chapters || [],
    };
  } catch (err) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNovel), 500);
    });
  }
}

export async function getChapter(slug: string, chapterNumber: number): Promise<Chapter> {
  try {
    const apiChapter = await fetchApi<any>(`/novels/${slug}/chapters/${chapterNumber}`);
    return {
      id: apiChapter.id,
      chapterNumber: apiChapter.chapterNumber,
      title: apiChapter.title,
      content: apiChapter.content, 
    };
  } catch (err) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const chapter = mockChapters[chapterNumber];
        if (chapter) resolve(chapter);
        else reject(new Error('Chapter not found'));
      }, 500);
    });
  }
}

export async function getAllNovels(): Promise<Novel[]> {
  try {
    const apiNovels = await fetchApi<any[]>('/novels');
    return apiNovels.map(n => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      author: 'Unknown Author',
      coverUrl: n.coverImage || mockNovel.coverUrl,
      description: n.description || '',
      totalChapters: 0, 
      chapters: [],
    }));
  } catch (err) {
    return [
      mockNovel,
      {
        ...mockNovel,
        id: 'nov_2',
        slug: 'cybernetic-dawn',
        title: 'Cybernetic Dawn',
        coverUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop',
      },
      {
        ...mockNovel,
        id: 'nov_3',
        slug: 'obsidian-echoes',
        title: 'Obsidian Echoes',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
      }
    ];
  }
}

export async function getAdjacentChapters(slug: string, chapterNumber: number) {
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
