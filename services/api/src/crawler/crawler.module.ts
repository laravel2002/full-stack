import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [PrismaModule, R2Module],
  providers: [CrawlerService],
  controllers: [CrawlerController]
})
export class CrawlerModule {}
