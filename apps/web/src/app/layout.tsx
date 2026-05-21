import type { Metadata } from 'next';
import { Noto_Serif, Inter } from 'next/font/google';
import './globals.css';

// Nhúng font Noto Serif cho tiêu đề tác phẩm và logo mang phong vị cổ điển Á Đông
const notoSerif = Noto_Serif({
  variable: '--font-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Nhúng font Inter cho văn bản giao diện và nội dung chính của truyện đọc
const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mặc Quán - Thư Quán Đọc Truyện Kiếm Hiệp & Thiền Học Cổ Điển',
  description: 'Nền tảng đọc truyện chữ tinh tế mang triết lý tối giản thiền tông Đông Phương. Tận hưởng không gian đọc tinh khiết, êm dịu cho tâm hồn.',
  keywords: 'mặc quán, đọc truyện, kiếm hiệp, lịch sử, cổ trang, thiền học, tối giản, web novel',
  openGraph: {
    title: 'Mặc Quán - Thư Quán Đọc Truyện Kiếm Hiệp & Thiền Học Cổ Điển',
    description: 'Nền tảng đọc truyện chữ tinh tế mang triết lý tối giản thiền tông Đông Phương. Tận hưởng không gian đọc tinh khiết, êm dịu cho tâm hồn.',
    siteName: 'Mặc Quán',
    locale: 'vi_VN',
    type: 'website',
    url: 'https://macquan.vn',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Mặc Quán - Thư Quán Đọc Truyện Kiếm Hiệp & Thiền Học Cổ Điển',
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${notoSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 font-sans">
        <div className="flex-1 flex flex-col relative z-10 selection:bg-zen-cinnabar selection:text-zen-paper">
          {children}
        </div>
      </body>
    </html>
  );
}
