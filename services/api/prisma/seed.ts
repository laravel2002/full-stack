import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL không tồn tại trong biến môi trường!');
}

// Khởi tạo PostgreSQL Connection Pool tiêu chuẩn kèm SSL
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Hỗ trợ chứng chỉ bảo mật của Neon
  },
});

// Khởi tạo Adapter PostgreSQL cho Prisma v7
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bắt đầu gieo mầm dữ liệu (Seeding database)...');

  // Xóa sạch dữ liệu cũ để tránh lỗi trùng lặp khi chạy lại nhiều lần
  await prisma.chapter.deleteMany({});
  await prisma.story.deleteMany({});

  // 1. Gieo mầm truyện "Thiên Long Bát Bộ"
  const thienLong = await prisma.story.create({
    data: {
      title: 'Thiên Long Bát Bộ',
      slug: 'thien-long-bat-bo',
      author: 'Kim Dung',
      description: 'Thiên Long Bát Bộ là tác phẩm võ hiệp đỉnh cao bậc nhất của nhà văn Kim Dung. Tác phẩm xoay quanh mối quan hệ nhân quả phức tạp giữa nhiều cá nhân, quốc gia và môn phái võ học, thông qua hình ảnh ba nhân vật chính: Kiều Phong (hào kiệt bi tráng), Đoàn Dự (vương tử phong lưu đắc đạo) và Hư Trúc (tiểu hòa thượng nhân duyên kỳ ngộ). Tác phẩm thấm đẫm tư tưởng Phật giáo về nỗi khổ ải nhân gian và ước vọng siêu thoát tiêu dao.',
      coverUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000&auto=format&fit=crop',
      viewCount: 15420,
      chapters: {
        create: [
          {
            chapterNum: 1,
            title: 'Chương 1: Khởi đầu hồng trần, kiếm khí phong vân',
            storagePath: 'mock://chapters/thien-long-bat-bo/ch1.html',
          },
          {
            chapterNum: 2,
            title: 'Chương 2: Hạnh Hoa thôn viễn khách, hào khí can vân',
            storagePath: 'mock://chapters/thien-long-bat-bo/ch2.html',
          },
        ],
      },
    },
  });

  // 2. Gieo mầm truyện "Đạo Đức Kinh"
  const daoDuc = await prisma.story.create({
    data: {
      title: 'Đạo Đức Kinh',
      slug: 'dao-duc-kinh',
      author: 'Lão Tử',
      description: 'Đạo Đức Kinh là cuốn sách triết học kinh điển của triết gia vĩ đại Lão Tử, được coi là nền tảng cốt tủy của Đạo gia. Tác phẩm bàn sâu về hai khái niệm "Đạo" (nguyên lý vô hình tối cao vận hành vũ trụ) và "Đức" (phương thức sống và hành xử thuận theo tự nhiên). Với ngôn từ cô đọng mang tính triết lý thiền định cao, Đạo Đức Kinh hướng người đọc đến sự giản đơn, vô vi, khiêm nhường và tĩnh lặng tuyệt đối.',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop',
      viewCount: 8900,
      chapters: {
        create: [
          {
            chapterNum: 1,
            title: 'Chương 1: Đạo khả Đạo phi thường Đạo',
            storagePath: 'mock://chapters/dao-duc-kinh/ch1.html',
          },
          {
            chapterNum: 2,
            title: 'Chương 2: Thiên hạ giai tri mỹ chi vi mỹ',
            storagePath: 'mock://chapters/dao-duc-kinh/ch2.html',
          },
        ],
      },
    },
  });

  // 3. Gieo mầm truyện "Đông Chu Liệt Quốc"
  await prisma.story.create({
    data: {
      title: 'Đông Chu Liệt Quốc',
      slug: 'dong-chu-liet-quoc',
      author: 'Phùng Mộng Long',
      description: 'Đông Chu Liệt Quốc là bộ tiểu thuyết lịch sử vĩ đại ghi chép lại toàn bộ thời kỳ biến động phân tranh hào hùng từ khi triều Chu suy yếu cho đến thời Xuân Thu Chiến Quốc và đỉnh điểm là Tần Thủy Hoàng thống nhất Trung Hoa. Tác phẩm khắc họa sống động hàng vạn mưu kế chính trị và những tấm gương anh hùng trung nghĩa.',
      coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=1000&auto=format&fit=crop',
      viewCount: 12050,
      chapters: {
        create: [
          {
            chapterNum: 1,
            title: 'Chương 1: Tuyên Vương nghe câu đồng dao, U Vương đốt lửa đài phong',
            storagePath: 'mock://chapters/dong-chu-liet-quoc/ch1.html',
          },
        ],
      },
    },
  });

  // 4. Gieo mầm truyện "Nam Hoa Kinh"
  await prisma.story.create({
    data: {
      title: 'Nam Hoa Kinh',
      slug: 'nam-hoa-kinh',
      author: 'Trang Tử',
      description: 'Nam Hoa Kinh (hay còn gọi là Trang Tử) là tác phẩm văn học kiêm triết học vô song của triết gia Trang Tử. Sử dụng những câu chuyện ngụ ngôn ẩn dụ phóng khoáng, bay bổng tột cùng như "Tiêu Dao Du", Trang Tử đưa hành giả vượt lên trên những ràng buộc tục lụy trần thế để đạt đến tự do tuyệt đối trong tâm cảnh.',
      coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
      viewCount: 6200,
      chapters: {
        create: [
          {
            chapterNum: 1,
            title: 'Chương 1: Tiêu Dao Du',
            storagePath: 'mock://chapters/nam-hoa-kinh/ch1.html',
          },
        ],
      },
    },
  });

  // 5. Gieo mầm truyện "Kinh Thi"
  await prisma.story.create({
    data: {
      title: 'Kinh Thi',
      slug: 'kinh-thi',
      author: 'Khổng Tử biên soạn',
      description: 'Kinh Thi là tuyển tập thơ ca dân gian cổ xưa nhất của Trung Hoa, tập hợp các bài hát dân ca phản ánh chân thực cuộc sống mộc mạc thanh thuần của người dân cổ đại. Tác phẩm do Khổng Tử san định để dạy học trò về nhân, nghĩa, lễ, nhạc và cảm xúc chân thật.',
      coverUrl: 'https://images.unsplash.com/photo-1463171359979-300c462947c6?q=80&w=1000&auto=format&fit=crop',
      viewCount: 4300,
      chapters: {
        create: [
          {
            chapterNum: 1,
            title: 'Chương 1: Quan Thư',
            storagePath: 'mock://chapters/kinh-thi/ch1.html',
          },
        ],
      },
    },
  });

  console.log('Gieo mầm dữ liệu thành công!');
}

main()
  .then(async () => {
    // Đóng kết nối Prisma và Pool
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
