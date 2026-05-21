import { Controller, Get, Param } from '@nestjs/common';
import { StoryService } from './story.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Stories')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('featured')
  @ApiOperation({ summary: 'Lấy tác phẩm truyện nổi bật nhất (Featured Story)' })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tác phẩm truyện có lượt xem (viewCount) cao nhất cùng thông tin chương mới nhất.',
  })
  async getFeatured() {
    return this.storyService.getFeatured();
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Lấy bảng xếp hạng Top 5 truyện nhiều lượt xem nhất' })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách 5 bộ truyện được sắp xếp theo viewCount từ cao xuống thấp.',
  })
  async getLeaderboard() {
    return this.storyService.getLeaderboard();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết tác phẩm truyện và danh sách chương' })
  @ApiParam({
    name: 'slug',
    description: 'Slug định danh duy nhất của tác phẩm',
    example: 'dao-duc-kinh',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết truyện kèm theo toàn bộ danh sách chương được sắp xếp theo số thứ tự chương tăng dần.',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tác phẩm truyện tương ứng với slug đã cung cấp.',
  })
  async getBySlug(@Param('slug') slug: string) {
    return this.storyService.getBySlug(slug);
  }
}
