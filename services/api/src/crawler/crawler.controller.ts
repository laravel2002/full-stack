import { Controller, Post, Body, Headers, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('tvtruyen')
  @HttpCode(HttpStatus.OK)
  runCrawler(
    @Headers('x-admin-key') adminKey: string,
    @Body('url') url: string,
  ) {
    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret || adminKey !== secret) {
      throw new UnauthorizedException('Admin Key không hợp lệ hoặc bị thiếu!');
    }
    
    if (!url) {
      throw new UnauthorizedException('Thiếu URL truyện!');
    }

    // Chạy ngầm không đợi await
    this.crawlerService.runTvTruyenCrawler(url);

    return {
      status: 'success',
      message: 'Tiến trình cào truyện đã được khởi động ngầm trong background.',
      url
    };
  }
}
