import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import * as cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2Service: R2Service,
  ) {}

  async runTvTruyenCrawler(storyUrl: string) {
    this.logger.log(`Bắt đầu cào ngầm từ URL: ${storyUrl}`);
    const baseUrl = new URL(storyUrl).origin;

    try {
      const res = await fetch(storyUrl);
      const html = await res.text();
      const $ = cheerio.load(html);

      const title = $('h1.title, .title h1, h1').first().text().trim() || $('meta[property="og:title"]').attr('content')?.replace('Đọc truyện', '')?.split('|')[0]?.trim() || 'Unknown Title';
      const authorText = $('.author, .info .author, a[href*="/tac-gia/"]').first().text().trim();
      const author = authorText.replace('Tác giả:', '').trim() || 'Unknown Author';
      const coverUrl = $('meta[property="og:image"]').attr('content') || '';
      const description = $('meta[property="og:description"]').attr('content') || '';
      const slug = storyUrl.split('/').pop()?.replace('.html', '') || 'unknown-slug';

      this.logger.log(`Thông tin: ${title} - ${author}`);

      const chapters = $('.chapter-list a, .list-chapter a, ul.list-chapter li a').map((i, el) => {
        return {
          title: $(el).text().trim(),
          url: $(el).attr('href')?.startsWith('http') ? $(el).attr('href')! : baseUrl + $(el).attr('href')
        };
      }).get();

      const validChapters = chapters.filter(c => c.title.toLowerCase().includes('chương') || c.url.includes('chuong'));
      this.logger.log(`Tìm thấy ${validChapters.length} chương. Đang tiến hành lấy data...`);

      // Xóa cũ
      await this.prisma.chapter.deleteMany({ where: { story: { slug } } });
      await this.prisma.story.deleteMany({ where: { slug } });

      const story = await this.prisma.story.create({
        data: {
          title, slug, author, description, coverUrl,
          viewCount: Math.floor(Math.random() * 1000) + 100,
        }
      });

      const BATCH_SIZE = 10;
      for (let i = 0; i < validChapters.length; i += BATCH_SIZE) {
        const batch = validChapters.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (chapterInfo, index) => {
          const chapterNum = i + index + 1;
          try {
            const cRes = await fetch(chapterInfo.url);
            const cHtml = await cRes.text();
            const $c = cheerio.load(cHtml);
            
            let paragraphs: string[] = [];
            const contentNodes = $c('.chapter-content p, #chapter-content p, .content p');
            if (contentNodes.length > 0) {
              contentNodes.each((_, el) => {
                const text = $c(el).text().trim();
                if (text) paragraphs.push(text);
              });
            } else {
              let rawHtml = $c('.chapter-content').html() || $c('#chapter-content').html() || $c('.content').html();
              if (!rawHtml) rawHtml = $c('div').filter((_, el) => $c(el).find('p').length > 5).first().html() || '';
              paragraphs = rawHtml.split(/<br\s*\/?>|<\/p>|<\/div>/i)
                .map(s => $c('<div>').html(s).text().trim())
                .filter(s => s.length > 0);
              if (paragraphs.length === 0) paragraphs.push('Không tìm thấy nội dung.');
            }

            const objectKey = `stories/${slug}/chapters/${chapterNum}.json`;
            await this.r2Service.uploadChapterJson(objectKey, { storySlug: slug, chapterNum, title: chapterInfo.title, paragraphs });

            await this.prisma.chapter.create({
              data: { storyId: story.id, chapterNum, title: chapterInfo.title, storagePath: objectKey }
            });
          } catch (err) {
            this.logger.error(`❌ Lỗi cào chương ${chapterNum}: ${err.message}`);
          }
        }); // Kết thúc batch.map

        // Chờ toàn bộ batch chạy xong
        await Promise.all(batchPromises);

        // Nghỉ 500ms giữa mỗi đợt cào (batch) để server không bị block và nhả RAM
        await new Promise(r => setTimeout(r, 500));
      }

      this.logger.log(`Đã hoàn tất cào truyện ${title}!`);
    } catch (error) {
      this.logger.error(`Lỗi Crawler: ${error.message}`);
    }
  }
}
