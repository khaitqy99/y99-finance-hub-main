import { Quote } from "lucide-react";

const items = [
  { name: "Anh Minh Tuấn", role: "Tài xế công nghệ - Hà Nội", text: "Mình cần vốn gấp để sửa xe, Y99 duyệt và giải ngân chỉ trong 20 phút. Nhân viên tư vấn rất nhiệt tình." },
  { name: "Chị Thu Hằng", role: "Nhân viên văn phòng - TP.HCM", text: "Lãi suất rõ ràng, không có phí ẩn. App rất dễ dùng, mình theo dõi khoản trả mỗi tháng cực tiện." },
  { name: "Anh Quốc Huy", role: "Chủ shop kinh doanh - Đà Nẵng", text: "Lần đầu vay online mà cảm thấy yên tâm. Y99 chuyên nghiệp từ tư vấn đến hợp đồng." },
  { name: "Chị Ngọc Mai", role: "Chủ tiệm làm đẹp - Cần Thơ", text: "Mình cần xoay vốn nhập hàng gấp, Y99 hỗ trợ rất nhanh và giải thích hợp đồng rõ ràng từng khoản phí." },
  { name: "Anh Thanh Bình", role: "Kỹ thuật viên - Bình Dương", text: "Thủ tục đơn giản, chỉ cần giấy tờ cơ bản là được tư vấn gói phù hợp. Quy trình làm việc minh bạch, dễ hiểu." },
  { name: "Chị Hoài An", role: "Kinh doanh tự do - Đồng Nai", text: "Mình đánh giá cao cách chăm sóc khách hàng của Y99. Nhắc lịch thanh toán rõ ràng, hỗ trợ linh hoạt khi cần tư vấn thêm." },
];

const Testimonials = () => {
  const featuredItems = items.slice(0, 3);

  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-8">
          <div className="text-center mx-auto">
            <span className="inline-block text-sm font-bold uppercase tracking-widest text-primary mb-3">Khách hàng nói gì</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground whitespace-nowrap">
              Niềm tin từ <span className="text-primary">hàng nghìn</span> khách hàng
            </h2>
          </div>
        </div>

        <div className="flex items-stretch gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
          {featuredItems.map((t, index) => (
            <div
              key={`${t.name}-${index}`}
              className="w-[260px] md:w-[280px] lg:w-[calc((100%-4.5rem)/4)] shrink-0 snap-start rounded-3xl bg-card p-6 border border-border/60 shadow-soft hover:shadow-card transition-smooth self-stretch flex flex-col"
            >
              <Quote className="h-8 w-8 text-accent mb-4" />
              <p className="text-foreground/85 leading-relaxed mb-6 flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground font-bold">
                  {t.name.charAt(t.name.length - 3)}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
          <a
            href="https://maps.app.goo.gl/9T7oND4VETdzocyv7"
            target="_blank"
            rel="noreferrer"
            className="w-[260px] md:w-[280px] lg:w-[calc((100%-4.5rem)/4)] shrink-0 snap-start rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6 text-left transition-smooth hover:border-primary hover:bg-primary/10 self-stretch flex flex-col justify-center"
            aria-label="Xem thêm đánh giá khách hàng"
          >
            <span className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">Đánh giá khác</span>
            <span className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">Xem thêm</span>
            <span className="text-sm text-muted-foreground">Khám phá thêm phản hồi thực tế từ khách hàng Y99.</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
