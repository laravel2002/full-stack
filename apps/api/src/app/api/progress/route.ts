import { NextResponse } from 'next/server';
import prisma from '@novel-platform/db';
import { z } from 'zod';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

const saveProgressSchema = z.object({
  novelId: z.number().int().positive('ID Truyện không hợp lệ'),
  chapterId: z.number().int().positive('ID Chương không hợp lệ'),
});

export async function GET(request: Request) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    // Lấy tủ sách đang đọc
    const progress = await prisma.readingProgress.findMany({
      where: { userId: user.id },
      include: {
        novel: {
          select: { id: true, title: true, slug: true, cover: true },
        },
        chapter: {
          select: { id: true, title: true, order: true },
        },
      },
      orderBy: { updatedAt: 'desc' }, // Gần đây nhất xếp lên đầu
    });

    return NextResponse.json({ data: progress });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải tiến độ đọc' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const data = saveProgressSchema.parse(body);

    // Dùng upsert: Nếu user đã có tiến độ đọc truyện này thì cập nhật chapterId mới, nếu chưa thì tạo mới
    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_novelId: {
          userId: user.id,
          novelId: data.novelId,
        },
      },
      update: {
        chapterId: data.chapterId,
      },
      create: {
        userId: user.id,
        novelId: data.novelId,
        chapterId: data.chapterId,
      },
    });

    return NextResponse.json({ message: 'Lưu tiến độ thành công', data: progress });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}
