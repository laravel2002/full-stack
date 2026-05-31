import { NextResponse } from 'next/server';
import prisma from '@novel-platform/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const novel = await prisma.novel.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    if (!novel) {
      return NextResponse.json({ error: 'Không tìm thấy truyện' }, { status: 404 });
    }

    // Phân trang danh sách chương
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where: { novelId: novel.id },
        select: { id: true, title: true, order: true, createdAt: true },
        orderBy: { order: 'asc' },
        skip,
        take: limit,
      }),
      prisma.chapter.count({ where: { novelId: novel.id } }),
    ]);

    return NextResponse.json({
      data: chapters,
      meta: {
        novelId: novel.id,
        novelTitle: novel.title,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải danh sách chương' }, { status: 500 });
  }
}
