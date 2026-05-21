import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

// Layout này chịu trách nhiệm render Navbar và Footer cho các trang cổng thông tin (Trang chủ, Thư viện, Chi tiết truyện)
// Giúp tránh việc các trang này tự render dẫn đến Double Header, 
// đồng thời giữ cho trang đọc truyện (/read) không bị dính Navbar/Footer trang chủ.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}
