import { NextResponse } from 'next/server';
import prisma from '@novel-platform/db';

export async function GET() {
  try {
    // Thực hiện 1 truy vấn đơn giản để kiểm tra kết nối
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'success',
        message: 'Kết nối Database thành công!',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Không thể kết nối đến Database.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
