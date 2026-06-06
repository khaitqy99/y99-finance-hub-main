import Link from "next/link";
import { CheckCircle2, FileText, Clock, BadgeDollarSign, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "./PageHero";
import LoanCalculator from "./LoanCalculator";
import ProductHeroVisual from "./ProductHeroVisual";
import { productImages } from "@/data/loanProducts";
import { parseImageLine } from "@/lib/cms/content-images";
import { resolveArticleImageAlt } from "@/lib/seo/image-alt";

export interface LoanProductData {
  slug: string;
  name: string;
  seoH1?: string;
  imageAlt?: string;
  tagline: string;
  description: string;
  maxAmount: string;
  maxTerm: string;
  interestRate: string;
  approvalTime: string;
  benefits: string[];
  conditions: string[];
  documents: string[];
  process: { title: string; desc: string }[];
  image?: string | null;
}

const LoanProductPage = ({ data }: { data: LoanProductData }) => {
  const fallback = productImages[data.slug as keyof typeof productImages];
  const heroSrc = data.image ?? fallback;
  const altCtx = { title: data.name, excerpt: data.tagline, category: "Cho vay cầm cố" };
  let imageIndex = 0;
  const heroAlt = resolveArticleImageAlt(imageIndex++, data.imageAlt, altCtx);

  return (
    <>
      <PageHero
        eyebrow="Cho vay cầm cố"
        title={data.seoH1 || data.name}
        description={data.tagline}
        crumbs={[{ label: "Cho vay cầm cố" }, { label: data.name }]}
        media={heroSrc ? <ProductHeroVisual src={heroSrc} alt={heroAlt} /> : undefined}
      />

      {/* Quick stats */}
      <section className="container -mt-10 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BadgeDollarSign, label: "Hạn mức", value: data.maxAmount },
            { icon: Clock, label: "Kỳ hạn", value: data.maxTerm },
            { icon: ShieldCheck, label: "Lãi suất", value: data.interestRate },
            { icon: FileText, label: "Duyệt vay", value: data.approvalTime },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-5 shadow-card border border-border/60 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="text-lg font-extrabold text-foreground">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Description + Benefits */}
      <section className="py-16">
        <div className="container grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl font-extrabold mb-4 text-foreground">Giới thiệu sản phẩm</h2>
              <div className="text-muted-foreground leading-relaxed text-lg space-y-4">
                {data.description.split('\n').map((line, i) => {
                  const img = parseImageLine(line);
                  if (img) {
                    const idx = imageIndex++;
                    return (
                      <img
                        key={i}
                        src={img.url}
                        alt={resolveArticleImageAlt(idx, img.alt, altCtx)}
                        loading={idx < 3 ? "eager" : "lazy"}
                        className="rounded-2xl w-full max-h-96 object-cover shadow-card"
                      />
                    );
                  }
                  if (!line.trim()) return null;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold mb-5 text-foreground">Quyền lợi nổi bật</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-2xl bg-card p-6 border border-border/60 shadow-soft">
                <h3 className="text-xl font-bold mb-4 text-foreground">Điều kiện vay</h3>
                <ul className="grid gap-2.5 md:grid-cols-2 md:gap-x-6">
                  {data.conditions.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold mb-5 text-foreground">Quy trình vay</h2>
              <ol className="grid sm:grid-cols-2 gap-4">
                {data.process.map((p, i) => (
                  <li key={p.title} className="rounded-2xl bg-gradient-soft p-5 border border-border/50 relative">
                    <div className="absolute -top-3 -left-3 h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground font-bold flex items-center justify-center shadow-soft">
                      {i + 1}
                    </div>
                    <h4 className="font-bold text-foreground mt-2">{p.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1.5">{p.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sticky CTA */}
          <aside className="lg:sticky lg:top-28 h-fit space-y-4">
            <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-6 shadow-card">
              <h3 className="text-xl font-extrabold">Đăng ký vay ngay</h3>
              <div className="space-y-3 mt-5">
                <Button variant="cta" size="lg" className="w-full gap-2" asChild>
                  <a href="tel:1900575792"><Phone className="h-4 w-4" /> Gọi 1900575792</a>
                </Button>
                <Button variant="outlineLight" size="lg" className="w-full" asChild>
                  <Link href="/lien-he">Yêu cầu liên hệ <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl bg-card p-6 border border-border/60">
              <h4 className="font-bold text-foreground mb-3">Sản phẩm liên quan</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { to: "/cho-vay-cam-co/vay-tien-bang-cavet-xe-may", label: "Vay bằng cà vẹt xe máy" },
                  { to: "/cho-vay-cam-co/vay-tien-bang-cavet-oto", label: "Vay bằng cà vẹt ô tô" },
                  { to: "/cho-vay-cam-co/vay-bang-icloud", label: "Vay bằng iCloud" },
                ]
                  .filter((x) => !x.to.endsWith(data.slug))
                  .map((p) => (
                    <li key={p.to}>
                      <Link href={p.to} className="flex items-center justify-between text-muted-foreground hover:text-primary transition-smooth py-1.5">
                        <span>{p.label}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <LoanCalculator />
    </>
  );
};

export default LoanProductPage;
