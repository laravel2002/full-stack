import { NextResponse } from 'next/server';
import prisma from '@novel-platform/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapterId = parseInt(id);

    if (isNaN(chapterId)) {
      return NextResponse.json({ error: 'ID Chương không hợp lệ' }, { status: 400 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        novel: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Không tìm thấy chương' }, { status: 404 });
    }

    // Tìm chương trước và chương sau
    const [prevChapter, nextChapter] = await Promise.all([
      prisma.chapter.findFirst({
        where: { novelId: chapter.novelId, order: chapter.order - 1 },
        select: { id: true },
      }),
      prisma.chapter.findFirst({
        where: { novelId: chapter.novelId, order: chapter.order + 1 },
        select: { id: true },
      }),
    ]);

    return NextResponse.json({
      data: {
        ...chapter,
        prevId: prevChapter?.id || null,
        nextId: nextChapter?.id || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải chương' }, { status: 500 });
  }
}
