import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NovelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.novel.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        coverImage: true,
        updatedAt: true,
      },
    });
  }

  async findOneBySlug(slug: string) {
    const novel = await this.prisma.novel.findUnique({
      where: { slug },
      include: {
        chapters: {
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            updatedAt: true,
            // Exclude content to keep the response read-optimized
          },
          orderBy: { chapterNumber: 'asc' },
        },
      },
    });

    if (!novel) {
      throw new NotFoundException(`Novel with slug ${slug} not found`);
    }
    return novel;
  }

  async findChapterByNumber(slug: string, chapterNumber: number) {
    const chapter = await this.prisma.chapter.findFirst({
      where: {
        novel: { slug },
        chapterNumber,
      },
      include: {
        novel: {
          select: {
            slug: true,
            title: true,
          },
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter ${chapterNumber} for novel ${slug} not found`);
    }

    // Parse JSON string content back to array
    return {
      ...chapter,
      content: JSON.parse(chapter.content),
    };
  }
}
