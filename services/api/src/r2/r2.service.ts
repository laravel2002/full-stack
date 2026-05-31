import { Injectable, Logger } from '@nestjs/common';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.R2_BUCKET_NAME || '';

    // Khởi tạo S3Client kết nối với Cloudflare R2 Endpoint
    this.s3Client = new S3Client({
      region: 'auto', // Cloudflare R2 yêu cầu thiết lập region là 'auto'
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
    });
  }

  /**
   * Phương thức hỗ trợ chuyển đổi luồng dữ liệu (Readable Stream) từ Cloudflare R2 sang chuỗi UTF-8
   */
  private async streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  /**
   * Phương thức nạp nội dung chương HTML theo phương án Lai (Hybrid Loader)
   * @param storagePath Đường dẫn tệp tin: có thể là link HTTP/HTTPS, mã giả lập mock://, hoặc R2 Object Key thực tế
   */
  async fetchChapterHtml(storagePath: string): Promise<string> {
    // Trường hợp 1: Nếu storagePath bắt đầu bằng http:// hoặc https:// (sử dụng khi phục vụ tệp qua CDN công cộng)
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      try {
        const response = await fetch(storagePath);
        if (!response.ok) {
          throw new Error(`Fetch HTTP/HTTPS thất bại với mã trạng thái: ${response.status}`);
        }
        return await response.text();
      } catch (error) {
        this.logger.error(
          `Lỗi khi nạp nội dung chương qua đường dẫn mạng [${storagePath}]: ${error.message}`
        );
        return this.getZenFallbackHtml();
      }
    }

    // Trường hợp 2: Nếu storagePath bắt đầu bằng mock:// (sử dụng khi phát triển cục bộ và dữ liệu mẫu)
    if (storagePath.startsWith('mock://')) {
      return this.getZenFallbackHtml();
    }

    // Trường hợp 3: Giả định storagePath là một Object Key thực tế trên Cloudflare R2 (ví dụ: stories/novel-slug/chapters/1.html)
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: storagePath,
      });

      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new Error('Nội dung phản hồi (Body) từ R2 rỗng');
      }

      return await this.streamToString(response.Body as Readable);
    } catch (error) {
      this.logger.error(
        `Lỗi kết nối Cloudflare R2 khi tải Object Key [${storagePath}]: ${error.message}. Chuyển sang nội dung dự phòng.`
      );
      // Cơ chế dự phòng an toàn giúp ứng dụng không bị lỗi ngắt quãng
      return this.getZenFallbackHtml();
    }
  }

  /**
   * Phương thức tải lên nội dung chương HTML lên Cloudflare R2
   * @param objectKey Đường dẫn (key) để lưu trên R2 (vd: stories/slug/chapters/1.html)
   * @param htmlContent Nội dung HTML
   * @returns URL hoặc Object Key sau khi upload thành công
   */
  async uploadChapterHtml(objectKey: string, htmlContent: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: htmlContent,
        ContentType: 'text/html; charset=utf-8',
      });

      await this.s3Client.send(command);
      this.logger.log(`Tải lên thành công: ${objectKey}`);
      return objectKey;
    } catch (error) {
      this.logger.error(`Lỗi khi tải lên R2 [${objectKey}]: ${error.message}`);
      throw error;
    }
  }

  /**
   * Phương thức tải lên nội dung chương dạng JSON lên Cloudflare R2
   * @param objectKey Đường dẫn (key) để lưu trên R2 (vd: stories/slug/chapters/1.json)
   * @param jsonData Nội dung object JSON
   */
  async uploadChapterJson(objectKey: string, jsonData: any): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: JSON.stringify(jsonData, null, 2),
        ContentType: 'application/json; charset=utf-8',
      });

      await this.s3Client.send(command);
      this.logger.log(`Tải lên thành công: ${objectKey}`);
      return objectKey;
    } catch (error) {
      this.logger.error(`Lỗi khi tải lên R2 [${objectKey}]: ${error.message}`);
      throw error;
    }
  }

  /**
   * Trả về chuỗi HTML thiền tông cổ trang Á Đông giả lập cao cấp làm dự phòng
   */
  private getZenFallbackHtml(): string {
    return `
      <div class="zen-reader-content prose prose-stone max-w-none space-y-6">
        <p class="first-letter:text-5xl first-letter:font-serif first-letter:text-[#b6191a] first-letter:float-left first-letter:mr-3 first-letter:font-bold leading-relaxed">
          Trang giấy trắng mực đen này lưu giữ tinh hoa chữ nghĩa của bậc tiền nhân...
        </p>
        <p class="leading-relaxed">
          Thời gian trôi như nước chảy qua cầu, công danh phú quý chỉ như mây nổi. 
          Giữa chốn hồng trần cuộn cuộn cát bụi đầy rẫy tranh đoạt tai ương, Mặc Quán mở ra một góc thanh bình trầm lặng, 
          nơi độc giả có thể tĩnh tâm thưởng trà, thưởng sách, hòa mình vào thế giới kiếm hiệp đầy hào tình trượng nghĩa.
        </p>
        <div class="flex flex-col items-center justify-center my-8 p-4 border-y border-[#e7e3d4] border-dashed">
          <p class="italic text-[#b6191a] text-center font-serif text-lg leading-loose">
            "Đường kiếm ngút ngàn, tâm tựa chỉ thủy,<br/>
            Mực mài bóng tối, vẽ họa sơn hà."
          </p>
        </div>
        <p class="leading-relaxed">
          Kiếm khách độc hành dưới trăng lạnh đỉnh Hoa Sơn, nghe tiếng gió vi vu qua kẽ đá, 
          tâm cảnh trầm mặc tựa mặt hồ mùa thu không một gợn sóng. Từng câu chữ tại Mặc Quán không chỉ kể về những ân oán tình thù võ lâm, 
          mà còn là con đường dẫn dắt hành giả tìm về sự an nhiên tự tại vốn có của bản tâm.
        </p>
        <p class="leading-relaxed text-right text-xs text-muted-foreground italic">
          — Mặc Quán thư phòng lục giả —
        </p>
      </div>
    `;
  }
}
