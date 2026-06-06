import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, PhoneCall, Clock3, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/cms/fetch";
import { useCms } from "@/context/CmsContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const loanNeeds = [
  "Từ 3 - 10 triệu",
  "Từ 10 - 30 triệu",
  "Từ 30 - 100 triệu",
  "Trên 100 triệu",
];

const DangKyVayNgay = () => {
  const { toast } = useToast();
  const { settings } = useCms();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreed) {
      toast({
        title: "Bạn chưa đồng ý điều khoản",
        description: "Vui lòng xác nhận điều khoản trước khi gửi đăng ký.",
        variant: "destructive",
      });
      return;
    }

    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await submitLead({
        full_name: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        city: String(form.get("city") ?? ""),
        district: String(form.get("district") ?? ""),
        loan_need: String(form.get("loanNeed") ?? ""),
        asset: String(form.get("asset") ?? "") || undefined,
      });
      toast({
        title: "Gửi đăng ký thành công",
        description: "Chuyên viên Y99 sẽ liên hệ tư vấn cho bạn sớm nhất.",
      });
      e.currentTarget.reset();
      setAgreed(false);
    } catch {
      toast({
        title: "Không gửi được đăng ký",
        description: "Vui lòng thử lại hoặc gọi hotline " + settings.hotline,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      <section className="bg-gradient-hero text-white">
        <div className="container py-14 md:py-20">
          <Breadcrumb>
            <BreadcrumbList className="text-white/80">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="hover:text-white">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Đăng ký vay ngay</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4 grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" /> Hồ sơ đơn giản
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl leading-tight font-extrabold">
                Đăng ký vay ngay
                <span className="block mt-2 text-accent">Nhận tư vấn trong 5 phút</span>
              </h1>
              <p className="mt-4 text-white/90 max-w-xl">
                Điền thông tin nhanh để Y99 hỗ trợ khoản vay phù hợp theo nhu cầu và tài sản đảm bảo của bạn.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-white/95">
                  <Clock3 className="h-5 w-5 text-accent" /> Duyệt thông tin nhanh, không rườm rà.
                </div>
                <div className="flex items-center gap-2 text-white/95">
                  <Wallet className="h-5 w-5 text-accent" /> Hạn mức linh hoạt từ 3 triệu đến 2 tỷ.
                </div>
                <div className="flex items-center gap-2 text-white/95">
                  <PhoneCall className="h-5 w-5 text-accent" /> Hỗ trợ qua hotline {settings.hotline}.
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="rounded-3xl bg-white text-foreground p-6 md:p-7 shadow-card">
              <h2 className="text-2xl font-extrabold">Biểu mẫu đăng ký</h2>
              <p className="text-sm text-muted-foreground mt-1">Thông tin của bạn sẽ được bảo mật theo chính sách của Y99.</p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold">Họ và tên *</label>
                  <Input required name="fullName" placeholder="Nguyễn Văn A" className="mt-2 h-11" />
                </div>

                <div>
                  <label className="text-sm font-semibold">Số điện thoại *</label>
                  <Input required type="tel" name="phone" placeholder="09xx xxx xxx" className="mt-2 h-11" />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold">Tỉnh / Thành phố *</label>
                    <Input required name="city" placeholder="VD: TP. Hồ Chí Minh" className="mt-2 h-11" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Quận / Huyện *</label>
                    <Input required name="district" placeholder="VD: Bình Thạnh" className="mt-2 h-11" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Nhu cầu vay *</label>
                  <select
                    name="loanNeed"
                    required
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Chọn nhu cầu vay
                    </option>
                    {loanNeeds.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Tài sản đảm bảo (nếu có)</label>
                  <Input name="asset" placeholder="VD: Cavet xe máy, ô tô, iCloud..." className="mt-2 h-11" />
                </div>

                <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Checkbox
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                    className="mt-0.5"
                  />
                  <span>Tôi đồng ý để Y99 liên hệ tư vấn và xử lý thông tin theo chính sách bảo mật.</span>
                </label>

                <Button type="submit" variant="hero" className="w-full h-11" disabled={submitting}>
                  {submitting ? "Đang gửi…" : "Gửi đăng ký vay ngay"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DangKyVayNgay;
