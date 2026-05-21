import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';

@Injectable()
export class ChapterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2Service: R2Service
  ) {}

  // 1. GET /chapters/recent: Lấy các chương mới cập nhật kèm thông tin phân trang
  async getRecent(page = 1, limit = 6) {
    const skip = (page - 1) * limit;

    const [chapters, total] = await Promise.all([
      this.prisma.chapter.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          story: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.chapter.count(),
    ]);

    return {
      data: chapters,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 2. GET /chapters/:storySlug/:chapterNum: Lấy thông tin chương và nội dung HTML từ R2
  async getChapterDetails(storySlug: string, chapterNum: number) {
    // Tìm truyện bằng slug
    const story = await this.prisma.story.findUnique({
      where: { slug: storySlug },
    });

    if (!story) {
      throw new NotFoundException(`Không tìm thấy truyện với slug: ${storySlug}`);
    }

    // Tìm chương bằng storyId và chapterNum
    const chapter = await this.prisma.chapter.findUnique({
      where: {
        storyId_chapterNum: {
          storyId: story.id,
          chapterNum,
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException(`Không tìm thấy chương ${chapterNum} của truyện ${story.title}`);
    }

    // Lấy nội dung HTML của chương từ R2
    const htmlContent = await this.r2Service.fetchChapterHtml(chapter.storagePath);

    // Xác định sự tồn tại của chương trước và chương sau
    const [prevChapter, nextChapter] = await Promise.all([
      this.prisma.chapter.findUnique({
        where: {
          storyId_chapterNum: {
            storyId: story.id,
            chapterNum: chapterNum - 1,
          },
        },
        select: { chapterNum: true },
      }),
      this.prisma.chapter.findUnique({
        where: {
          storyId_chapterNum: {
            storyId: story.id,
            chapterNum: chapterNum + 1,
          },
        },
        select: { chapterNum: true },
      }),
    ]);

    return {
      story: {
        id: story.id,
        title: story.title,
        slug: story.slug,
        author: story.author,
      },
      chapter: {
        id: chapter.id,
        chapterNum: chapter.chapterNum,
        title: chapter.title,
        storagePath: chapter.storagePath,
        createdAt: chapter.createdAt,
      },
      htmlContent,
      prevChapterNum: prevChapter?.chapterNum ?? null,
      nextChapterNum: nextChapter?.chapterNum ?? null,
    };
  }
}
