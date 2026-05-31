import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Kiểm thử tích hợp các Endpoint API (E2E)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Áp dụng ValidationPipe giống hệt cấu hình trong main.ts để test hành vi thực tế
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Phần 1: Stories Controller (/stories)', () => {
    // 1.1 Lấy danh sách truyện (Không có từ khóa tìm kiếm)
    it('GET /stories - Nên trả về danh sách tất cả các bộ truyện hiện có', async () => {
      const response = await request(app.getHttpServer())
        .get('/stories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Kiểm tra cấu trúc dữ liệu của bộ truyện đầu tiên
      const story = response.body[0];
      expect(story).toHaveProperty('id');
      expect(story).toHaveProperty('title');
      expect(story).toHaveProperty('slug');
      expect(story).toHaveProperty('author');
    });

    // 1.2 Tìm kiếm truyện với từ khóa khớp
    it('GET /stories?q=Thiên - Nên trả về danh sách truyện có chứa từ khóa khớp', async () => {
      const response = await request(app.getHttpServer())
        .get('/stories')
        .query({ q: 'Thiên' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].title).toContain('Thiên Long Bát Bộ');
    });

    // 1.3 Tìm kiếm truyện với từ khóa không tồn tại
    it('GET /stories?q=KhongTonTai - Nên trả về danh sách rỗng', async () => {
      const response = await request(app.getHttpServer())
        .get('/stories')
        .query({ q: 'KhongTonTai' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    // 1.4 Lấy bộ truyện nổi bật (Featured Story)
    it('GET /stories/featured - Nên trả về bộ truyện có lượt xem cao nhất', async () => {
      const response = await request(app.getHttpServer())
        .get('/stories/featured')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('viewCount');
      expect(response.body).toHaveProperty('chapters');
      // "Thiên Long Bát Bộ" có lượt xem cao nhất trong seed data (15420)
      expect(response.body.slug).toBe('thien-long-bat-bo');
    });

    // 1.5 Lấy bảng xếp hạng Top 5 truyện
    it('GET /stories/leaderboard - Nên trả về tối đa 5 bộ truyện xếp hạng theo lượt xem', async () => {
      const response = await request(app.getHttpServer())
        .get('/stories/leaderboard')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);

      // Đảm bảo được sắp xếp giảm dần theo lượt xem
      if (response.body.length > 1) {
        for (let i = 0; i < response.body.length - 1; i++) {
          expect(response.body[i].viewCount).toBeGreaterThanOrEqual(response.body[i + 1].viewCount);
        }
      }
    });

    // 1.6 Lấy chi tiết truyện theo slug hợp lệ
    it('GET /stories/:slug - Nên trả về chi tiết truyện và danh sách chương', async () => {
      const response = await request(app.getHttpServer())
        .get('/stories/dao-duc-kinh')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.slug).toBe('dao-duc-kinh');
      expect(response.body).toHaveProperty('chapters');
      expect(Array.isArray(response.body.chapters)).toBe(true);
      expect(response.body.chapters.length).toBeGreaterThan(0);
    });

    // 1.7 Lấy chi tiết truyện theo slug không tồn tại
    it('GET /stories/:slug (không tồn tại) - Nên trả về lỗi 404', async () => {
      await request(app.getHttpServer())
        .get('/stories/slug-khong-ton-tai-123')
        .expect(404);
    });
  });

  describe('Phần 2: Chapters Controller (/chapters)', () => {
    // 2.1 Lấy danh sách chương mới cập nhật (Không truyền tham số - Dùng mặc định)
    it('GET /chapters/recent - Nên trả về danh sách chương mới cùng thông tin phân trang', async () => {
      const response = await request(app.getHttpServer())
        .get('/chapters/recent')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('totalPages');
      expect(response.body.meta.page).toBe(1);
    });

    // 2.2 Lấy danh sách chương với tham số phân trang tùy chỉnh
    it('GET /chapters/recent?page=1&limit=2 - Nên giới hạn số bản ghi trả về là 2', async () => {
      const response = await request(app.getHttpServer())
        .get('/chapters/recent')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.meta.limit).toBe(2);
    });

    // 2.3 Lấy danh sách chương với tham số không hợp lệ
    it('GET /chapters/recent?page=-1 - Nên trả về lỗi 400 Bad Request', async () => {
      await request(app.getHttpServer())
        .get('/chapters/recent')
        .query({ page: -1 })
        .expect(400);
    });

    // 2.4 Lấy chi tiết chương đọc (Zen Reader Payload)
    it('GET /chapters/:storySlug/:chapterNum - Nên trả về nội dung chương và thông tin điều hướng', async () => {
      const response = await request(app.getHttpServer())
        .get('/chapters/thien-long-bat-bo/1')
        .expect(200);

      expect(response.body).toHaveProperty('story');
      expect(response.body).toHaveProperty('chapter');
      expect(response.body).toHaveProperty('htmlContent'); // Zen Reader HTML payload
      expect(response.body).toHaveProperty('prevChapterNum');
      expect(response.body).toHaveProperty('nextChapterNum');
      
      // Chương 1 thì prevChapterNum phải là null, nextChapterNum phải là 2
      expect(response.body.prevChapterNum).toBeNull();
      expect(response.body.nextChapterNum).toBe(2);
    });

    // 2.5 Lấy chi tiết chương không tồn tại
    it('GET /chapters/:storySlug/:chapterNum (không tồn tại) - Nên trả về lỗi 404', async () => {
      await request(app.getHttpServer())
        .get('/chapters/thien-long-bat-bo/999')
        .expect(404);
    });
  });
});
