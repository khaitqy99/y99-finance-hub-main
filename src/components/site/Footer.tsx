import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, MessageCircle, MessageSquare, Apple, Play, Building2 } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const socialLinks = [
    { href: "https://www.facebook.com/profile.php?id=61575859284966", icon: Facebook, label: "Facebook Y99" },
    { href: "https://zalo.me/+84788766009", icon: MessageCircle, label: "Zalo Y99" },
    { href: "https://wa.me/+84788766009", icon: MessageSquare, label: "WhatsApp Y99" },
  ];

  const footerLinkGroups = [
    {
      title: "Về Y99",
      links: [
        { to: "/ve-y99", label: "Về Y99" },
        { to: "/tuyen-dung", label: "Tuyển dụng" },
        { to: "/ban-tin", label: "Tin tức" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { to: "/vay-tien-online", label: "Vay tiền online" },
        { to: "/he-thong-cua-hang", label: "Hệ thống cửa hàng" },
        { to: "/lien-he", label: "Liên hệ" },
      ],
    },
    {
      title: "Chính sách",
      links: [
        { to: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
        { to: "/tuyen-bo-mien-tru-trach-nhiem", label: "Tuyên bố miễn trừ trách nhiệm" },
        { to: "/chinh-sach-lai-suat-phi-dich-vu", label: "Lãi suất & phí dịch vụ" },
      ],
    },
  ];

  const productLinks = [
    { to: "/cho-vay-cam-co/vay-tien-bang-cavet-xe-may", label: "Vay đăng ký xe máy" },
    { to: "/cho-vay-cam-co/vay-tien-bang-cavet-oto", label: "Vay đăng ký ô tô" },
    { to: "/cho-vay-cam-co/vay-bang-icloud", label: "Vay bằng iCloud" },
  ];

  return (
    <footer className="bg-[hsl(var(--primary-dark))] text-white">
      <div className="container py-10 lg:py-12">
        <div className="grid gap-10 border-b border-white/10 pb-9 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-white px-3 py-2 shadow-soft">
              <img src={logo} alt="Y99" className="h-10 w-auto object-contain" />
            </div>
            <p className="max-w-[260px] text-sm leading-relaxed text-white/80">
              Y99 - Minh bạch - An toàn - Tiện lợi
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Giới thiệu</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              {footerLinkGroups[0].links.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex transition-smooth hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Sản phẩm</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              {productLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex transition-smooth hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Hỗ trợ</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              {footerLinkGroups[1].links.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex transition-smooth hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Chính sách</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              {footerLinkGroups[2].links.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex transition-smooth hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-5 pt-7 lg:grid-cols-[420px_1fr]">
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Liên hệ</h4>
            <ul className="space-y-2.5 text-sm text-white/85">
              <li className="flex items-start gap-2.5">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>CÔNG TY CỔ PHẦN CẦM ĐỒ Y99 | MST: 1801778932</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Hotline: 1900575792 | +84 292 38 999 33 (Nước ngoài)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>cskh@y99.vn</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-smooth hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  aria-label={item.label}
                >
                  <item.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Tải ngay ứng dụng Y99</h4>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white transition-smooth hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  aria-label="Google Play"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span className="text-xs font-semibold">GET IT ON Google Play</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white transition-smooth hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  aria-label="App Store"
                >
                  <Apple className="h-4 w-4" />
                  <span className="text-xs font-semibold">Download on the App Store</span>
                </a>
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 lg:ml-auto lg:max-w-[560px]">
            <iframe
              title="Bản đồ công ty Y99"
              src="https://www.google.com/maps?q=99B%20Nguy%E1%BB%85n%20Tr%C3%A3i%2C%20Ninh%20Ki%E1%BB%81u%2C%20C%E1%BA%A7n%20Th%C6%A1&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[300px] w-full"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-center gap-2 py-5 text-center text-xs text-white/70">
          <p>Y99 hoạt động theo mô hình dịch vụ cầm đồ hợp pháp, không phải tổ chức tín dụng hay ngân hàng.</p>
          <p>© 2025 Y99 CO.,LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
