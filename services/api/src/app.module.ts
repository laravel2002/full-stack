import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NovelsModule } from './novels/novels.module';

@Module({
  imports: [PrismaModule, NovelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
