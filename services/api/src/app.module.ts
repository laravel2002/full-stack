import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { R2Module } from './r2/r2.module';
import { StoryModule } from './story/story.module';
import { ChapterModule } from './chapter/chapter.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CrawlerModule } from './crawler/crawler.module';

const imports: any[] = [
  PrismaModule,
  R2Module,
  StoryModule,
  ChapterModule,
  // Cấu hình Rate Limiting: Giới hạn tối đa 100 requests mỗi 60,000ms (1 phút) toàn cục
  ThrottlerModule.forRoot([
    {
      ttl: 60000,
      limit: 100,
    },
  ]),
];

// Chỉ nạp CrawlerModule khi đang chạy trên máy tính (local)
// Render tự động set NODE_ENV=production, do đó Crawler sẽ tự động bị tắt khi đưa lên mạng
if (process.env.NODE_ENV !== 'production') {
  imports.push(CrawlerModule);
}

@Module({
  imports,
  controllers: [AppController],
  providers: [
    AppService,
    // Đăng ký ThrottlerGuard làm Guard toàn cục để kích hoạt giới hạn lưu lượng trên toàn bộ hệ thống
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
