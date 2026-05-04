import { Link } from "react-router-dom";
import { BriefcaseBusiness, Building2, Handshake, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ProductHeroVisual from "@/components/site/ProductHeroVisual";
const imgRecruitmentHero = "/Gemini_Generated_Image_3m60hz3m60hz3m60-Photoroom.png";

const highlights = [
  {
    icon: BriefcaseBusiness,
    title: "Môi trường năng động",
    description: "Đội ngũ trẻ trung, sẵn sàng hỗ trợ nhau để bứt phá và phát triển mỗi ngày.",
  },
  {
    icon: Handshake,
    title: "Chính sách hấp dẫn",
    description: "Lộ trình phát triển rõ ràng cùng các chính sách ghi nhận minh bạch, công bằng.",
  },
  {
    icon: Building2,
    title: "Mạng lưới rộng khắp",
    description: "Cơ hội nghề nghiệp đa dạng trong hệ thống dịch vụ cầm đồ hiện đại của Y99.",
  },
];

const recruitmentPosts = [
  {
    title: "Chuyên viên tư vấn tài chính",
    excerpt:
      "Tư vấn giải pháp tài chính phù hợp, hỗ trợ khách hàng hoàn thiện hồ sơ và đồng hành xuyên suốt quá trình giải ngân.",
    location: "Cần Thơ",
    type: "Toàn thời gian",
    deadline: "31/05/2026",
  },
  {
    title: "Nhân viên chăm sóc khách hàng",
    excerpt:
      "Tiếp nhận, hỗ trợ và xử lý phản hồi khách hàng đa kênh, đảm bảo trải nghiệm dịch vụ minh bạch và hài lòng.",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    deadline: "05/06/2026",
  },
  {
    title: "Chuyên viên phát triển kinh doanh",
    excerpt:
      "Mở rộng mạng lưới đối tác, triển khai hoạt động thị trường tại khu vực phụ trách và thúc đẩy hiệu quả tăng trưởng.",
    location: "Hà Nội",
    type: "Toàn thời gian",
    deadline: "10/06/2026",
  },
];

const Recruitment = () => {
  return (
    <>
      <PageHero
        eyebrow="Tuyển dụng"
        title="Gia nhập Y99 để bứt phá sự nghiệp"
        description="Y99 là công ty cầm đồ hiện đại, chuyên cung cấp dịch vụ nhanh chóng, minh bạch và an toàn. Chúng tôi tìm kiếm đồng đội sẵn sàng học hỏi và phát triển lâu dài."
        crumbs={[{ label: "Tuyển dụng" }]}
        media={<ProductHeroVisual src={imgRecruitmentHero} alt="Tuyển dụng Y99" imageClassName="scale-[1.15]" />}
      />

      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-2xl font-extrabold text-foreground">Bài tuyển dụng mới nhất</h3>
              <span className="rounded-lg bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {recruitmentPosts.length} vị trí
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recruitmentPosts.map((post) => (
                <article key={post.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
                  <h4 className="text-lg font-bold text-foreground">{post.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">Khu vực:</span> {post.location}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Hình thức:</span> {post.type}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Hạn nộp:</span> {post.deadline}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      to="/lien-he"
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-smooth hover:opacity-90"
                    >
                      Ứng tuyển ngay
                    </Link>
                    <a
                      href="mailto:cskh@y99.vn"
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-smooth hover:bg-secondary"
                    >
                      Gửi CV qua email
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 shadow-soft">
            <h3 className="text-xl font-bold text-foreground">Thông tin công ty</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>CÔNG TY CỔ PHẦN CẦM ĐỒ Y99</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <span>1900575792 | +84 292 38 999 33 (Nước ngoài)</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <span>cskh@y99.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Recruitment;
