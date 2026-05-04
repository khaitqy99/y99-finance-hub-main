import { useState } from "react";
import { Check, Dot, ShieldCheck, PhoneCall, Building2, Bike, Car, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { loanProducts } from "@/data/loanProducts";

const requiredProfiles = [
  "Cavet xe (đăng ký xe) chính chủ, CCCD, SIM chính chủ.",
  "Cavet xe không chính chủ, CCCD, SIM chính chủ và bổ sung thêm một số giấy tờ chứng minh quyền sở hữu tài sản.",
];

const highlights = [
  "Bảo mật thông tin tuyệt đối.",
  "Không gọi thẩm định người thân.",
  "Không cần chứng minh thu nhập.",
  "Đơn vị uy tín với hơn 800+ PGD toàn quốc.",
];

const collateral = [
  "Khách hàng được mượn lại tài sản đảm bảo.",
  "Tài sản đảm bảo: xe máy, xe ô tô.",
];

const terms = [
  { label: "Giá trị khoản vay", value: "Từ 3 triệu đến 2 tỷ" },
  { label: "Thời gian vay", value: "Tối thiểu 3 tháng và tối đa 18 tháng" },
  { label: "Lãi suất", value: "1.6% / tháng (dư nợ giảm dần)" },
  { label: "Hình thức giải ngân", value: "Tiền mặt hoặc chuyển khoản" },
];

const feeDetails = [
  "Lãi và chi phí vay tính trên dự nợ gốc giảm dần.",
  "Chi phí vay bao gồm: Phí dịch vụ quản lý khoản vay, Phí dịch vụ quản lý tài sản.",
  "Không còn phí nào khác ngoại trừ phí thanh toán trước hạn hoặc phí trả chậm.",
  "Phí dịch vụ quản lý khoản vay được tính dựa trên giá trị của khoản vay và được sử dụng để duy trì và quản lý tài khoản vay. Điều này bao gồm xử lý các tài liệu vay, duy trì hồ sơ và cung cấp dịch vụ hỗ trợ trong suốt quá trình vay tiền. Phí này đảm bảo rằng quá trình quản lý khoản vay diễn ra một cách thuận lợi và chuyên nghiệp, mang lại sự tiện lợi và an tâm cho bạn khi vay tiền tại Y99.",
  "Phí dịch vụ quản lý tài sản được tính dựa trên giá trị của tài sản đảm bảo và thời gian mà tài sản đó được quản lý. Đây là khoản phí được sử dụng để chi trả cho các hoạt động quản lý tài sản, giúp Y99 tiếp tục hỗ trợ người vay trong việc sử dụng tài sản đảm bảo của họ. Điều này đảm bảo rằng tài sản được quản lý một cách chuyên nghiệp và hiệu quả, mang lại lợi ích tối đa cho cả bên vay và Y99.",
  "Lãi và chi phí vay sẽ được xác định tùy theo giá trị tài sản đảm bảo, thời hạn vay và giá trị khoản vay.",
  "Lãi và chi phí vay sẽ được cung cấp đầy đủ và chính xác trên hợp đồng vay.",
  "Người vay có thể nhận bảng báo giá lãi và chi phí vay sau khi được tư vấn về gói vay phù hợp.",
];

const feeBreakdown = [
  "Lãi và chi phí vay nếu được quy đổi, trên dư nợ gốc ban đầu (lãi phẳng), sẽ tương đương từ 2.6% - 4.6%/tháng (32% - 55%/năm). Trong đó bao gồm:",
  "Lãi: 0.9%/tháng.",
  "Chi phí vay: 1.6% - 3.4%/tháng. Trong đó bao gồm:",
  "Phí dịch vụ quản lý khoản vay: 0.8%/tháng.",
  "Phí dịch vụ quản lý tài sản từ: 0.8% - 2.6%/tháng.",
];

const cities = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Cần Thơ",
  "Bắc Ninh",
];

const districtsByCity: Record<string, string[]> = {
  "Hà Nội": [
    "Ba Đình",
    "Hoàn Kiếm",
    "Tây Hồ",
    "Long Biên",
    "Cầu Giấy",
    "Đống Đa",
    "Hai Bà Trưng",
    "Hoàng Mai",
    "Thanh Xuân",
    "Nam Từ Liêm",
    "Bắc Từ Liêm",
    "Hà Đông",
  ],
  "TP. Hồ Chí Minh": [
    "Quận 1",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 7",
    "Quận 8",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Tân Bình",
    "Bình Thạnh",
    "Gò Vấp",
    "Phú Nhuận",
    "Thủ Đức",
  ],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ", "Hòa Vang"],
  "Bình Dương": ["Thủ Dầu Một", "Dĩ An", "Thuận An", "Tân Uyên", "Bến Cát", "Bàu Bàng", "Phú Giáo"],
  "Đồng Nai": ["Biên Hòa", "Long Khánh", "Trảng Bom", "Long Thành", "Nhơn Trạch", "Vĩnh Cửu", "Xuân Lộc"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt", "Phong Điền", "Cờ Đỏ", "Vĩnh Thạnh"],
  "Bắc Ninh": ["Bắc Ninh", "Quế Võ", "Tiên Du", "Yên Phong", "Từ Sơn", "Thuận Thành", "Gia Bình", "Lương Tài"],
};

const projectPackages = Object.values(loanProducts);

const VayTienOnlineSeo = () => {
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreed) {
      toast({
        title: "Bạn chưa xác nhận điều khoản",
        description: "Vui lòng đồng ý chính sách bảo mật trước khi gửi thông tin.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Đăng ký thành công",
      description: "Chuyên viên tư vấn sẽ liên hệ bạn trong thời gian sớm nhất.",
    });
  };

  return (
    <div className="bg-background">
      <section className="bg-gradient-hero text-white">
        <div className="container py-14 md:py-20 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          <div>
            <Breadcrumb>
              <BreadcrumbList className="text-white/80">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="hover:text-white">Trang chủ</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">Vay tiền online</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Vay cầm cố trả góp
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl leading-tight">
              Hỗ trợ vay cầm cố nhanh, gọn, chuyên nghiệp.
              <span className="block text-accent mt-2">Lãi suất 1.099% / tháng</span>
            </h1>
            <p className="mt-4 text-white/90 max-w-2xl">
              Vay tiền trả góp bằng đăng ký xe với lãi suất theo dư nợ giảm dần, hồ sơ đơn giản.
            </p>

            <div className="mt-7">
              <div className="text-xs uppercase tracking-wider text-white/70">Tài sản đảm bảo</div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 font-semibold">
                <div className="flex items-center gap-2">
                  <Bike className="h-5 w-5" /> Xe máy
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5" /> Xe ô tô
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" /> iCloud
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-3xl bg-white text-foreground p-6 md:p-7 shadow-card">
            <h2 className="text-2xl font-extrabold">Đăng ký ngay</h2>
            <p className="text-sm text-muted-foreground mt-1">Để lại thông tin, chuyên viên sẽ liên hệ tư vấn nhanh.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-semibold">Số điện thoại *</label>
                <Input required type="tel" placeholder="09xx xxx xxx" className="mt-2 h-11" />
              </div>
              <div>
                <label className="text-sm font-semibold">Tài sản cầm cố *</label>
                <select className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Cavet xe máy chính chủ</option>
                  <option>Cavet oto chính chủ</option>
                  <option>ICloud Iphone từ 12 pro max trở lên</option>
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Tỉnh / Thành phố *</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Quận Huyện *</label>
                  <select className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {(districtsByCity[selectedCity] ?? []).map((district) => (
                      <option key={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="mt-0.5"
                />
                <span>
                  Tôi đã đọc và đồng ý với chính sách bảo mật thông tin và điều khoản đăng ký vay.
                </span>
              </label>
              <Button type="submit" variant="hero" className="w-full h-11">
                Gửi thông tin
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <div className="rounded-3xl border border-border bg-card p-7 md:p-8">
            <h3 className="text-2xl md:text-3xl font-extrabold">Thông tin khoản vay / Cầm cố</h3>
            <div className="mt-6 grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold">Hồ sơ vay</h4>
                <div className="mt-3 space-y-3">
                  {requiredProfiles.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold">Điểm nổi bật</h4>
                <div className="mt-3 space-y-3">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold">Tài sản đảm bảo</h4>
                <div className="mt-3 space-y-3">
                  {collateral.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold">Thông tin khoản vay</h4>
                <div className="mt-3 space-y-3">
                  {terms.map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <Dot className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <p>
                        <span className="font-semibold text-foreground">{item.label}: </span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container">
          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="text-2xl font-extrabold">Các gói vay đang áp dụng tại Y99</h3>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {projectPackages.map((pkg) => (
                <Link
                  key={pkg.slug}
                  to={`/cho-vay-cam-co/${pkg.slug}`}
                  className="rounded-2xl border border-border bg-background p-4 hover:border-primary transition-smooth"
                >
                  <div className="font-bold text-foreground">{pkg.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{pkg.tagline}</div>
                  <div className="text-xs text-primary font-semibold mt-3">
                    Hạn mức {pkg.maxAmount} - {pkg.interestRate}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-secondary/40 border-y border-border/60">
        <div className="container">
          <h3 className="text-2xl md:text-3xl font-extrabold">Lãi và chi phí vay</h3>
          <div className="mt-5 rounded-3xl bg-background border border-border p-6 md:p-8">
            <ol className="space-y-3 text-muted-foreground list-decimal pl-5">
              {feeDetails.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <div className="mt-5 rounded-2xl bg-secondary/60 border border-border p-5">
              <ul className="space-y-2">
                {feeBreakdown.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-muted-foreground">
                    <Dot className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <div className="rounded-3xl bg-gradient-hero text-white p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-extrabold">Phương thức trả nợ</h3>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h4 className="font-bold">Phương án 1</h4>
                <p className="text-white/90 mt-2">Trả gốc, lãi và chi phí vay hàng tháng.</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h4 className="font-bold">Phương án 2</h4>
                <p className="text-white/90 mt-2">
                  Trả lãi, chi phí vay hàng tháng và trả nợ gốc cuối thời hạn cho vay.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="tel:1900575792"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground"
              >
                <PhoneCall className="h-5 w-5" /> Hotline: 1900575792
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container">
          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="text-2xl font-extrabold">Hình thức giải ngân</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground">Giải ngân bằng tiền mặt hoặc chuyển khoản.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="text-2xl font-extrabold">Giới thiệu</h3>
            <div className="mt-4 space-y-3 text-muted-foreground">
              <p>
                Y99, một tổ chức chuyên cung cấp dịch vụ tài chính cá nhân theo mô hình chuỗi, đã xây
                dựng mạng lưới phòng giao dịch tại nhiều tỉnh thành trên khắp Việt Nam. Dịch vụ tài chính
                của Y99 được đánh giá cao về tính linh hoạt, sự minh bạch và đặc biệt phù hợp với nhóm
                khách hàng không đáp ứng đầy đủ tiêu chuẩn vay ngân hàng.
              </p>
              <p>
                Ngoài mạng lưới giao dịch rộng khắp, Y99 còn có ưu điểm cạnh tranh như nguồn vốn lớn,
                hỗ trợ cấp vốn nhanh chóng, điều kiện thủ tục đơn giản và minh bạch về lãi suất, chi phí.
                Điểm nổi bật là khả năng hỗ trợ khách hàng mượn lại tài sản cầm cố để tiếp tục sử dụng,
                bảo quản, ổn định cuộc sống và mưu sinh trong suốt kỳ vay.
              </p>
              <p>
                Hơn nữa, Y99 không chỉ cung cấp khoản vay mà còn triển khai nhiều giải pháp hỗ trợ khác:
                tư vấn hạn mức phù hợp, chia sẻ kiến thức quản lý tài chính cá nhân, hỗ trợ tất toán nhanh
                và đưa ra phương án gia hạn nợ theo từng tình huống cụ thể của khách hàng.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="text-2xl font-extrabold">Mô tả chi phí vay</h3>
            <div className="mt-4 text-muted-foreground space-y-3">
              <p>
                Khách hàng ký hợp đồng vay cầm cố xe máy trị giá 50.000.000 đồng trong 18 tháng, tổng
                chi phí vay bao gồm lãi suất là 43,2%/năm. Khách hàng lựa chọn thanh toán gốc, lãi và phí
                vay hàng tháng.
              </p>
              <p>
                Như vậy, khách hàng sẽ phải trả <span className="font-semibold text-foreground">4.113.064 VNĐ/tháng</span>, gồm:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2.5">
                  <Dot className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Lãi hàng tháng (1,6%) là 422.222 đồng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Dot className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Phí quản lý khoản vay hàng tháng (1,4%) là 627.446 đồng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Dot className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Phí quản lý tài sản hàng tháng (0,6%) là 285.617 đồng.</span>
                </li>
              </ul>
              <p>
                Tổng số tiền phải trả bao gồm chi phí vay và tiền gốc là
                <span className="font-semibold text-foreground"> 74.035.153 đồng</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VayTienOnlineSeo;
