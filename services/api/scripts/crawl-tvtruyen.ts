import 'dotenv/config';
import * as cheerio from 'cheerio';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { R2Service } from '../src/r2/r2.service';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL không tồn tại trong biến môi trường!');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const r2Service = new R2Service();

async function crawlStory() {
  const storyUrl = 'https://www.tvtruyen.co.uk/ta-danh-cap-dong-thoi-gian.html';
  const baseUrl = 'https://www.tvtruyen.co.uk';

  console.log(`Đang cào dữ liệu truyện từ: ${storyUrl}`);
  const res = await fetch(storyUrl);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('h1.title, .title h1, h1').first().text().trim() || $('meta[property="og:title"]').attr('content')?.replace('Đọc truyện', '')?.split('|')[0]?.trim() || 'Ta Đánh Cắp Dòng Thời Gian';
  const authorText = $('.author, .info .author, a[href*="/tac-gia/"]').first().text().trim();
  const author = authorText.replace('Tác giả:', '').trim() || 'Nhất Đao Trảm Trảm Trảm';
  const coverUrl = $('meta[property="og:image"]').attr('content');
  const description = $('meta[property="og:description"]').attr('content');
  const slug = 'ta-danh-cap-dong-thoi-gian';

  console.log(`Tiêu đề: ${title}`);
  console.log(`Tác giả: ${author}`);
  console.log(`Ảnh bìa: ${coverUrl}`);

  // Tìm danh sách chương
  const chapters = $('.chapter-list a, .list-chapter a, ul.list-chapter li a').map((i, el) => {
    return {
      title: $(el).text().trim(),
      url: $(el).attr('href')?.startsWith('http') ? $(el).attr('href')! : baseUrl + $(el).attr('href')
    };
  }).get();

  // Lọc bỏ những mục lục không phải là chương thực sự
  const validChapters = chapters.filter(c => c.title.toLowerCase().includes('chương') || c.url.includes('chuong'));

  console.log(`Tìm thấy ${validChapters.length} chương. Đang lấy 10 chương đầu tiên...`);

  // Xóa truyện cũ nếu có
  await prisma.chapter.deleteMany({ where: { story: { slug } } });
  await prisma.story.deleteMany({ where: { slug } });

  const story = await prisma.story.create({
    data: {
      title,
      slug,
      author,
      description,
      coverUrl,
      viewCount: Math.floor(Math.random() * 1000) + 100,
    }
  });

  // Cào tất cả các chương hợp lệ thay vì slice(0, 10)
  const chaptersToCrawl = validChapters;
  const BATCH_SIZE = 10; // Tải 10 chương cùng lúc

  console.log(`Đã chuyển sang chế độ tải toàn bộ ${chaptersToCrawl.length} chương (Concurrency Batching = ${BATCH_SIZE})...`);

  for (let i = 0; i < chaptersToCrawl.length; i += BATCH_SIZE) {
    const batch = chaptersToCrawl.slice(i, i + BATCH_SIZE);
    console.log(`\nĐang cào batch từ ${i + 1} đến ${i + batch.length}...`);

    const batchPromises = batch.map(async (chapterInfo, index) => {
      const chapterNum = i + index + 1;
      try {
        const cRes = await fetch(chapterInfo.url);
        const cHtml = await cRes.text();
        const $c = cheerio.load(cHtml);
        
        let paragraphs: string[] = [];
        // Lấy tất cả các thẻ p bên trong nội dung
        const contentNodes = $c('.chapter-content p, #chapter-content p, .content p');
        
        if (contentNodes.length > 0) {
          contentNodes.each((_, el) => {
            const text = $c(el).text().trim();
            if (text) paragraphs.push(text);
          });
        } else {
          // Fallback nếu không dùng thẻ p
          let rawHtml = $c('.chapter-content').html() || $c('#chapter-content').html() || $c('.content').html();
          if (!rawHtml) {
             rawHtml = $c('div').filter((_, el) => $c(el).find('p').length > 5).first().html() || '';
          }
          // Chia theo tag br hoặc div (giả lập đơn giản)
          paragraphs = rawHtml.split(/<br\s*\/?>|<\/p>|<\/div>/i)
            .map(s => $c('<div>').html(s).text().trim())
            .filter(s => s.length > 0);
          
          if (paragraphs.length === 0) {
            paragraphs.push('Không tìm thấy nội dung định dạng chuẩn.');
          }
        }

        const chapterData = {
          storySlug: slug,
          chapterNum,
          title: chapterInfo.title,
          paragraphs
        };

        // Upload lên R2 dưới dạng file JSON
        const objectKey = `stories/${slug}/chapters/${chapterNum}.json`;
        await r2Service.uploadChapterJson(objectKey, chapterData);

        // Lưu vào DB
        await prisma.chapter.create({
          data: {
            storyId: story.id,
            chapterNum,
            title: chapterInfo.title,
            storagePath: objectKey,
          }
        });
        
        console.log(`✅ Thành công: Chương ${chapterNum}`);
      } catch (err) {
        console.error(`❌ Lỗi khi cào chương ${chapterNum}:`, err.message);
      }
    });

    // Chờ cho toàn bộ batch tải xong
    await Promise.all(batchPromises);

    // Nghỉ 1 giây trước khi tải batch tiếp theo để tránh bị block IP
    if (i + BATCH_SIZE < chaptersToCrawl.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\nHoàn tất cào toàn bộ dữ liệu!');
}

crawlStory()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
