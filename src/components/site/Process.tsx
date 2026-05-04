import { FileText, UserCheck, Banknote, Smile } from "lucide-react";

const steps = [
  { icon: FileText, title: "Đăng ký online", desc: "Điền thông tin trong 2 phút trên website hoặc app Y99." },
  { icon: UserCheck, title: "Thẩm định nhanh", desc: "Tư vấn viên gọi xác nhận và duyệt hồ sơ." },
  { icon: Smile, title: "Tiến hành ký kết hợp đồng", desc: "Hoàn tất thủ tục và ký kết hợp đồng nhanh chóng, minh bạch." },
  { icon: Banknote, title: "Giải ngân siêu tốc", desc: "Nhận tiền chuyển khoản ngay sau khi hoàn tất ký kết." },
];

const Process = () => {
  return (
    <section id="process" className="py-20 bg-secondary/40">
      <div className="container">
        <div className="text-center mx-auto mb-16">
          <span className="inline-block text-sm font-bold uppercase tracking-widest text-primary mb-3">Quy trình 4 bước</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 whitespace-nowrap">
            Vay tiền <span className="text-primary">đơn giản</span> hơn bao giờ hết
          </h2>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-gradient-accent" />
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-primary/30" />

          {steps.map((s, i) => (
            <div key={s.title} className="relative bg-card rounded-3xl p-7 text-center shadow-soft border border-border/60">
              <div className="relative inline-flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-card">
                  <s.icon className="h-9 w-9" strokeWidth={2} />
                </div>
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-extrabold text-sm shadow-cta">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-5 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
