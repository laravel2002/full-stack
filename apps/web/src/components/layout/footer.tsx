export function Footer() {
  return (
    <footer className="w-full border-t border-zen-muted/30 bg-zen-paper/40 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Câu châm ngôn triết học Á Đông */}
        <div className="max-w-md mx-auto mb-8">
          <p className="font-serif italic text-sm text-zen-cinnabar leading-loose tracking-widest">
            "Mài mực tìm chữ cổ, tĩnh tọa ngắm mây trôi.<br/>
            Hồng trần dẫu cuồn cuộn, một cuốn sách bình an."
          </p>
        </div>

        {/* Thông tin bản quyền & Thư quán */}
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-serif text-base font-semibold tracking-widest text-zen-ink">
            MẶC QUÁN THƯ PHÒNG
          </span>
          <p className="font-sans text-xs text-zen-gray tracking-wide leading-relaxed">
            © {new Date().getFullYear()} Mặc Quán. Tận tâm gìn giữ tinh hoa chữ nghĩa và kiến tạo không gian đọc thiền định tối giản.
          </p>
        </div>
      </div>
    </footer>
  );
}
