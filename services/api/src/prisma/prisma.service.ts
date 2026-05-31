import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pgPool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL không tồn tại trong biến môi trường!');
    }

    // Khởi tạo PostgreSQL Connection Pool tiêu chuẩn kèm SSL
    const pgPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Hỗ trợ chứng chỉ bảo mật của Neon
      },
    });

    // Khởi tạo Adapter PostgreSQL cho Prisma v7
    const adapter = new PrismaPg(pgPool);

    // Truyền adapter vào constructor của PrismaClient
    super({ adapter });
    this.pgPool = pgPool;
  }

  async onModuleInit() {
    // Kết nối Prisma Client (Pool sẽ tự động quản lý kết nối con)
    await this.$connect();
  }

  async onModuleDestroy() {
    // Ngắt kết nối Prisma Client
    await this.$disconnect();
    // Đóng toàn bộ pool kết nối PostgreSQL
    await this.pgPool.end();
  }
}
