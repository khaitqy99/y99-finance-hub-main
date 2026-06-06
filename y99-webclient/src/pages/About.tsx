import { Award, Heart, Users, Target, Sparkles, ShieldCheck } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ProductHeroVisual from "@/components/site/ProductHeroVisual";
import imgAbout from "@/assets/page-about.webp";

const values = [
  { icon: Heart, title: "Tử tế từ tâm", desc: "Luôn đặt khách hàng làm trung tâm trong mọi quyết định." },
  { icon: ShieldCheck, title: "Chính trực", desc: "Minh bạch, rõ ràng và trung thực trong mọi thoả thuận." },
  { icon: Sparkles, title: "Đổi mới", desc: "Không ngừng cải tiến dịch vụ, ứng dụng công nghệ mới." },
  { icon: Target, title: "Lanh lợi", desc: "Xử lý nhanh chóng, hiệu quả mọi hồ sơ của khách hàng." },
];

const milestones = [
  { year: "2018", text: "Y99 Finance được thành lập với 5 phòng giao dịch đầu tiên." },
  { year: "2020", text: "Mở rộng lên 100 điểm giao dịch, ra mắt sản phẩm vay theo lương." },
  { year: "2022", text: "Đạt mốc 500.000 khách hàng phục vụ, ra mắt nền tảng số." },
  { year: "2024", text: "Hợp tác chiến lược với các công ty bảo hiểm lớn, ra mắt mảng bảo hiểm." },
  { year: "2026", text: "Hướng tới mục tiêu 500 phòng giao dịch trên toàn quốc." },
];

const About = () => {
  return (
    <>
      <PageHero
        eyebrow="Về Y99"
        title="Dù bạn ở đâu, Y99 luôn sẵn sàng"
        description="Y99 là nền tảng hỗ trợ uy tín, chuyên cung cấp dịch vụ cầm đồ minh bạch, an toàn và tiện lợi; luôn đồng hành cùng khách hàng không giới hạn khoảng cách."
        crumbs={[{ label: "Về Y99" }]}
        media={<ProductHeroVisual src={imgAbout} alt="Về Y99" />}
      />

      {/* Story */}
      <section className="py-16">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-bold uppercase tracking-widest text-primary mb-3">Câu chuyện của chúng tôi</span>
            <h2 className="text-4xl font-extrabold leading-tight text-foreground">
              Hành trình bức phá chinh phục hàng nghìn khách hàng <span className="text-primary">chỉ trong 8 tháng</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Y99 luôn đổi mới để phục vụ khách hàng tốt hơn, ứng dụng công nghệ nhằm mang lại trải nghiệm cầm đồ nhanh chóng, linh hoạt và minh bạch.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Chúng tôi tin rằng cầm đồ không chỉ là giải pháp tài chính ngắn hạn, mà còn là sự kết nối, cơ hội và niềm tin để khách hàng an tâm vững bước.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: Users, num: "5000+", label: "Khách hàng" },
              { icon: Award, num: "2+", label: "Phòng giao dịch và còn đang mở rộng" },
              { icon: ShieldCheck, num: "8+", label: "Tháng hoạt động" },
              { icon: Sparkles, num: "15 phút", label: "Giải ngân nhanh" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-gradient-soft border border-border/60 p-6 shadow-soft">
                <s.icon className="h-8 w-8 text-primary" />
                <div className="text-3xl font-extrabold mt-3 text-foreground">{s.num}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-soft">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-extrabold text-foreground">Giá trị cốt lõi</h2>
            <p className="mt-3 text-muted-foreground">4 giá trị định hình văn hoá và cách Y99 phục vụ khách hàng mỗi ngày.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-card p-7 border border-border/60 shadow-soft text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-extrabold text-center text-foreground mb-12">Cột mốc phát triển</h2>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="shrink-0 w-20 text-2xl font-extrabold text-primary">{m.year}</div>
                <div className="flex-1 rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
                  <p className="text-foreground">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
