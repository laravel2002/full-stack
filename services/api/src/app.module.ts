import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { R2Module } from './r2/r2.module';
import { StoryModule } from './story/story.module';
import { ChapterModule } from './chapter/chapter.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
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
  ],
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
