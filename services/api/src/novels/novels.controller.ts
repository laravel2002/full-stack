import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NovelsService } from './novels.service';

@Controller('novels')
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) {}

  @Get()
  findAll() {
    return this.novelsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.novelsService.findOneBySlug(slug);
  }

  @Get(':slug/chapters/:chapterNumber')
  findChapter(
    @Param('slug') slug: string, 
    @Param('chapterNumber', ParseIntPipe) chapterNumber: number
  ) {
    return this.novelsService.findChapterByNumber(slug, chapterNumber);
  }
}
