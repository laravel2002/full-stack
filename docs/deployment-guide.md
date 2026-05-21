# Hướng Dẫn Triển Khai Hệ Thống Novel Platform

Tài liệu này hướng dẫn chi tiết từng bước để triển khai (deploy) hệ thống **Novel Platform** lên các nền tảng đám mây:
- **Backend API (NestJS)** triển khai trên **Render**.
- **Frontend (Next.js)** triển khai trên **Vercel**.
- **Database (PostgreSQL)** sử dụng **Neon**.
- **Lưu trữ tệp (Cloud Cloudflare R2)** dùng để lưu trữ nội dung chương truyện.

---

## Bước 1: Đẩy Mã Nguồn Lên GitHub

Cả **Render** và **Vercel** đều hỗ trợ cơ chế tự động triển khai (CI/CD) thông qua Git. Vì vậy, trước tiên bạn cần đưa dự án này lên **GitHub**:

1. Tạo một repository mới trên GitHub (ở chế độ **Private** hoặc **Public** tùy ý bạn).
2. Mở terminal tại thư mục gốc của dự án (`d:\full-stack\novel-platform`) và chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "feat: prepare configurations for cloud deployment"
   git branch -M main
   git remote add origin <URL_REPOSITORY_GITHUB_CỦA_BẠN>
   git push -u origin main
   ```

---

## Bước 2: Triển Khai Backend API lên Render

Render hỗ trợ tính năng **Blueprints** cho phép bạn tự động hóa việc tạo và cấu hình dịch vụ thông qua tệp cấu hình `render.yaml` đã được thiết lập sẵn ở thư mục gốc của dự án.

### Cách 1: Sử dụng Render Blueprint (Khuyên dùng - Rất nhanh)

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/).
2. Click vào nút **New +** ở góc trên bên phải và chọn **Blueprint**.
3. Kết nối với tài khoản GitHub của bạn và chọn repository **novel-platform**.
4. Render sẽ tự động đọc tệp `render.yaml` và hiển thị danh sách cấu hình.
5. Điền đầy đủ giá trị cho các biến môi trường được yêu cầu (Render sẽ hỏi bạn trên giao diện):
   - `DATABASE_URL`: Đường dẫn kết nối database PostgreSQL trên **Neon** (đã có trong tệp `.env` của backend).
   - Các biến Cloudflare R2 (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_DOMAIN`).
   - `FRONTEND_URL`: Tạm thời điền dấu `*` hoặc URL nháp. Sau khi triển khai xong Frontend trên Vercel, chúng ta sẽ cập nhật lại URL chính xác để bảo mật CORS.
6. Nhấn **Apply** để Render tự động tạo và triển khai dịch vụ Web Service.

> [!TIP]
> Hệ thống đã được cấu hình tự động chạy `npx prisma db push` ngay trong tiến trình Build. Điều này giúp tự động cập nhật và đồng bộ cấu trúc cơ sở dữ liệu lên Neon PostgreSQL mỗi khi bạn có bản cập nhật mã nguồn mới mà không cần thao tác thủ công.

---

### Cách 2: Triển khai thủ công trên Render (Nếu không dùng Blueprint)

Nếu bạn muốn tự tay cấu hình từng bước trên giao diện của Render:

1. Trên **Render Dashboard**, chọn **New +** -> **Web Service**.
2. Chọn repository **novel-platform** của bạn.
3. Thiết lập thông số cơ bản:
   - **Name**: `novel-platform-api`
   - **Root Directory**: `services/api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm run start:prod`
5. Nhập các biến môi trường (**Environment Variables**) tương tự như ở Cách 1:
   - `DATABASE_URL`
   - `PORT`: `10000` (hoặc để trống, Render tự động cấu hình)
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_DOMAIN`
   - `FRONTEND_URL`
6. Nhấn **Create Web Service** để bắt đầu build.

---

## Bước 3: Triển Khai Frontend lên Vercel

Vercel hỗ trợ dự án Monorepo rất tốt và sẽ tự động nhận diện cấu trúc của Turborepo.

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/).
2. Chọn **Add New...** -> **Project**.
3. Import repository **novel-platform** từ GitHub của bạn.
4. Cấu hình các thông số dự án:
   - **Framework Preset**: Chọn **Next.js**.
   - **Root Directory**: Click **Edit** và chọn thư mục `apps/web`.
5. Mở rộng phần **Environment Variables** và cấu hình biến:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: URL Web Service của backend vừa tạo trên Render (ví dụ: `https://novel-platform-api.onrender.com`).
6. Nhấn nút **Deploy**. Vercel sẽ tự động build ứng dụng Next.js và cung cấp cho bạn một URL công khai (ví dụ: `https://novel-platform-web.vercel.app`).

---

## Bước 4: Hoàn Tất Cấu Hình CORS Bảo Mật

Khi Frontend Next.js gọi API đến Backend NestJS, trình duyệt sẽ kiểm tra chính sách CORS. Bạn cần cập nhật URL Frontend chính thức vào cấu hình của Backend:

1. Truy cập vào **Render Dashboard**, chọn Web Service **novel-platform-api** của bạn.
2. Điều hướng đến mục **Environment**.
3. Cập nhật biến môi trường `FRONTEND_URL` từ giá trị mặc định (`*` hoặc nháp) thành URL Frontend chính thức của Vercel (ví dụ: `https://novel-platform-web.vercel.app`).
4. Lưu thay đổi. Render sẽ tự động kích hoạt tiến trình Deploy lại (Redeploy) để áp dụng CORS mới.

---

## Bước 5: Kiểm Tra Hoạt Động Của Hệ Thống

> [!IMPORTANT]
> **Xác minh các đường dẫn hoạt động:**
> 1. Truy cập địa chỉ API Backend trên trình duyệt của bạn kèm theo `/api` (Ví dụ: `https://novel-platform-api.onrender.com/api`). Nếu hiển thị giao diện **Swagger UI** với danh sách các API `Stories` và `Chapters`, backend của bạn đã chạy hoàn hảo!
> 2. Mở URL Frontend trên Vercel, kiểm tra xem danh sách truyện chữ có được hiển thị mượt mà hay không, thử click đọc truyện để chắc chắn rằng ứng dụng Next.js kết nối tốt với Render Backend và tải được nội dung chương từ Cloudflare R2.
