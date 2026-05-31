import { NextResponse } from 'next/server';
import prisma from '@novel-platform/db';
import { z } from 'zod';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

const createChapterSchema = z.object({
  novelId: z.number().int().positive('ID Truyện không hợp lệ'),
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  content: z.string().min(1, 'Nội dung không được để trống'),
});

export async function POST(request: Request) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const data = createChapterSchema.parse(body);

    // Kiểm tra quyền (chỉ người tạo truyện mới được thêm chương)
    const novel = await prisma.novel.findUnique({
      where: { id: data.novelId },
    });

    if (!novel) {
      return NextResponse.json({ error: 'Không tìm thấy truyện' }, { status: 404 });
    }

    if (novel.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Bạn không có quyền thêm chương cho truyện này' }, { status: 403 });
    }

    // Lấy order lớn nhất hiện tại
    const lastChapter = await prisma.chapter.findFirst({
      where: { novelId: data.novelId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = lastChapter ? lastChapter.order + 1 : 1;

    // Tạo chương
    const chapter = await prisma.chapter.create({
      data: {
        title: data.title,
        content: data.content,
        order: nextOrder,
        novelId: data.novelId,
      },
    });

    return NextResponse.json({ message: 'Tạo chương thành công', data: chapter }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}
