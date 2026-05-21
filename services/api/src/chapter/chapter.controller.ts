import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Chapters')
@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get('recent')
  @ApiOperation({ summary: 'Lấy danh sách các chương mới cập nhật (Phân trang)' })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách chương mới cập nhật kèm thông tin phân trang thành công.',
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi xác thực dữ liệu tham số đầu vào (phải là số nguyên dương).',
  })
  async getRecent(@Query() paginationDto: PaginationDto) {
    // Nhờ cấu hình ValidationPipe transform: true, page và limit trong paginationDto đã tự động được ép kiểu sang số nguyên
    return this.chapterService.getRecent(paginationDto.page, paginationDto.limit);
  }

  @Get(':storySlug/:chapterNum')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết chương đọc (Zen Reader Payload)' })
  @ApiParam({
    name: 'storySlug',
    description: 'Slug định danh của bộ truyện',
    example: 'thien-long-bat-bo',
  })
  @ApiParam({
    name: 'chapterNum',
    description: 'Số thứ tự của chương truyện cần lấy dữ liệu',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin truyện, chương, mã HTML chương thiền học từ R2 Hybrid Loader và số chương chuyển tiếp (prev/next).',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy truyện hoặc chương truyện yêu cầu.',
  })
  async getChapterDetails(
    @Param('storySlug') storySlug: string,
    @Param('chapterNum', ParseIntPipe) chapterNum: number,
  ) {
    return this.chapterService.getChapterDetails(storySlug, chapterNum);
  }
}
