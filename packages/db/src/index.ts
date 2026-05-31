import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Ngăn tạo nhiều kết nối trong môi trường phát triển (Hot Reload)
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Export toàn bộ các type được Prisma sinh ra để các app khác dùng được
export * from '@prisma/client';

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
