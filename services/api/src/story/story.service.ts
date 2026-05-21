import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. GET /stories/featured: Lấy truyện có lượt xem cao nhất kèm chương mới nhất
  async getFeatured() {
    const featuredStory = await this.prisma.story.findFirst({
      orderBy: { viewCount: 'desc' },
      include: {
        chapters: {
          orderBy: { chapterNum: 'desc' },
          take: 1,
        },
      },
    });

    if (!featuredStory) {
      throw new NotFoundException('Chưa có truyện nào trong thư viện.');
    }

    return featuredStory;
  }

  // 2. GET /stories/leaderboard: Trả về top 5 truyện có lượt xem cao nhất
  async getLeaderboard() {
    return this.prisma.story.findMany({
      orderBy: { viewCount: 'desc' },
      take: 5,
    });
  }

  // 3. GET /stories/:slug: Chi tiết truyện kèm danh sách toàn bộ chương tăng dần
  async getBySlug(slug: string) {
    const story = await this.prisma.story.findUnique({
      where: { slug },
      include: {
        chapters: {
          orderBy: { chapterNum: 'asc' },
        },
      },
    });

    if (!story) {
      throw new NotFoundException(`Không tìm thấy truyện với đường dẫn: ${slug}`);
    }

    return story;
  }

  // 4. GET /stories: Danh sách truyện hoặc tìm kiếm truyện theo tên hoặc tác giả (không phân biệt hoa thường)
  async findAll(q?: string) {
    const whereClause = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { author: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.story.findMany({
      where: whereClause,
      include: {
        chapters: {
          orderBy: { chapterNum: 'asc' },
        },
      },
      orderBy: { viewCount: 'desc' },
    });
  }
}

