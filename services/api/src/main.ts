import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: Cho phép các nguồn gốc cục bộ hoặc các nguồn gốc chỉ định truy cập
 // CORS: Cho phép Frontend (Vercel) hoặc Localhost truy cập
  const frontendUrl = process.env.FRONTEND_URL || '*'; // Mặc định mở '*' nếu chưa cấu hình trên Render

  app.enableCors({
    origin: frontendUrl === '*' ? '*' : [frontendUrl, 'http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Helmet: Bảo mật tiêu đề HTTP bằng cách thiết lập các tiêu đề HTTP an toàn
  app.use(helmet());

  // Compression: Nén gzip tất cả các phản hồi để giảm thiểu kích thước dữ liệu truyền tải
  app.use(compression());

  // Global Validation Pipe: Xác thực dữ liệu toàn cục, tự động lọc thuộc tính thừa và chuyển kiểu dữ liệu phù hợp
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger UI: Thiết lập tài liệu API tự động tại đường dẫn /api
  const config = new DocumentBuilder()
    .setTitle('Mặc Quán API')
    .setDescription('Tài liệu API cốt lõi cho nền tảng Đọc truyện Chữ Cao cấp Mặc Quán (Ink Pavilion)')
    .setVersion('1.0')
    .addTag('Stories', 'Các endpoint truy vấn thông tin tác phẩm truyện')
    .addTag('Chapters', 'Các endpoint liên quan đến quản lý và đọc chương truyện')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`[Mặc Quán Backend] Ứng dụng đã khởi động thành công trên cổng: ${port}`);
  console.log(`[Mặc Quán Backend] Tài liệu Swagger UI được phục vụ tại: http://localhost:${port}/api`);
}
bootstrap();
