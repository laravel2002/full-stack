import { NextResponse } from 'next/server';
import prisma from '@novel-platform/db';
import { z } from 'zod';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

// Helper tạo slug từ title
function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Tách các ký tự có dấu
    .replace(/[\u0300-\u036f]/g, '') // Bỏ các dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-') // Đổi khoảng trắng thành gạch ngang
    .replace(/[^\w-]+/g, '') // Xóa các ký tự không phải chữ/số/gạch ngang
    .replace(/--+/g, '-') // Gộp nhiều gạch ngang liên tiếp
    .replace(/^-+/, '') // Xóa gạch ngang ở đầu
    .replace(/-+$/, ''); // Xóa gạch ngang ở cuối
}

const createNovelSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  cover: z.string().url('Link ảnh bìa không hợp lệ').optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true },
          },
          _count: {
            select: { chapters: true },
          },
        },
      }),
      prisma.novel.count(),
    ]);

    return NextResponse.json({
      data: novels,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi tải danh sách truyện' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const data = createNovelSchema.parse(body);

    let baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let counter = 1;

    // Kiểm tra trùng lặp slug
    while (await prisma.novel.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const novel = await prisma.novel.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        cover: data.cover,
        authorId: user.id,
      },
    });

    return NextResponse.json({ message: 'Tạo truyện thành công', data: novel }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}
