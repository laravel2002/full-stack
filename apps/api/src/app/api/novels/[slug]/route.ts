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
      include: {
        author: {
          select: { id: true, name: true },
        },
        chapters: {
          select: { id: true, title: true, order: true, createdAt: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!novel) {
      return NextResponse.json({ error: 'Không tìm thấy truyện' }, { status: 404 });
    }

    return NextResponse.json({ data: novel });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải truyện' }, { status: 500 });
  }
}
