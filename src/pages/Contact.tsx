import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ProductHeroVisual from "@/components/site/ProductHeroVisual";
import imgContact from "@/assets/page-contact.webp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/cms/fetch";
import { useCms } from "@/context/CmsContext";

const Contact = () => {
  const { toast } = useToast();
  const { settings } = useCms();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const product = String(form.get("product") ?? "");
      const message = String(form.get("message") ?? "").trim();
      await submitLead({
        full_name: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? "") || undefined,
        loan_need: product ? `[Liên hệ] ${product}` : "[Liên hệ]",
        asset: message || undefined,
      });
      setSubmitted(true);
      toast({ title: "Đã gửi yêu cầu", description: "Y99 sẽ liên hệ bạn trong vòng 15 phút." });
    } catch {
      toast({
        title: "Không gửi được yêu cầu",
        description: "Vui lòng thử lại hoặc gọi hotline " + settings.hotline,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Liên hệ"
        title="Y99 luôn sẵn sàng lắng nghe"
        description="Để lại thông tin hoặc gọi hotline, đội ngũ tư vấn Y99 sẽ hỗ trợ bạn nhanh chóng và tận tâm."
        crumbs={[{ label: "Liên hệ" }]}
        media={<ProductHeroVisual src={imgContact} alt="Liên hệ Y99 Finance" />}
      />

      <section className="py-16">
        <div className="container grid lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: Phone, title: "Hotline 24/7", value: "1900575792", href: "tel:1900575792" },
              { icon: Phone, title: "Hotline (Nước ngoài)", value: "+84 292 38 999 33", href: "tel:+842923899933" },
              { icon: Phone, title: "Zalo / WhatsApp", value: "078 876 6009", href: "https://zalo.me/+84788766009" },
              { icon: Mail, title: "Email hỗ trợ", value: "cskh@y99.vn", href: "mailto:cskh@y99.vn" },
              { icon: MapPin, title: "Trụ sở chính", value: "99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ" },
              { icon: MapPin, title: "Mã số thuế", value: "1801778932" },
            ].map((c) => (
              <a
                key={c.title}
                href={c.href ?? "#"}
                className="flex items-start gap-4 rounded-2xl bg-card border border-border/60 p-5 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.title}</div>
                  <div className="text-lg font-bold text-foreground mt-0.5">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-3xl bg-card border border-border/60 p-8 shadow-card">
            {submitted ? (
              <div className="text-center py-10">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground">Cảm ơn bạn!</h3>
                <p className="mt-2 text-muted-foreground">Y99 đã nhận được yêu cầu và sẽ liên hệ bạn trong vòng 15 phút.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <h2 className="text-2xl font-extrabold text-foreground">Yêu cầu tư vấn</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-foreground">Họ và tên *</label>
                    <Input required name="fullName" placeholder="Nguyễn Văn A" className="mt-2 h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">Số điện thoại *</label>
                    <Input required type="tel" name="phone" placeholder="09xx xxx xxx" className="mt-2 h-12" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Email</label>
                  <Input type="email" name="email" placeholder="email@example.com" className="mt-2 h-12" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Sản phẩm quan tâm</label>
                  <select
                    name="product"
                    className="mt-2 w-full h-12 rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue="Vay theo lương"
                  >
                    <option>Vay theo lương</option>
                    <option>Vay bằng cà vẹt xe máy</option>
                    <option>Vay bằng cà vẹt ô tô</option>
                    <option>Vay bằng iCloud</option>
                    <option>Vay theo hoá đơn</option>
                    <option>Bảo hiểm</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Nội dung</label>
                  <Textarea name="message" rows={4} placeholder="Mô tả nhu cầu của bạn..." className="mt-2" />
                </div>
                <Button type="submit" variant="hero" size="xl" className="w-full gap-2" disabled={submitting}>
                  {submitting ? "Đang gửi…" : "Gửi yêu cầu"} <Send className="h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
