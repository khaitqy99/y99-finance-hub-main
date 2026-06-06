import { useEffect, useState, type CSSProperties } from "react";
import type { StaticImageData } from "next/image";
import { ClientOnly } from "@/components/ClientOnly";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import imgMotorbike from "@/assets/loan-motorbike.webp";
import imgCar from "@/assets/loan-car.webp";
import imgIcloud from "@/assets/loan-icloud.webp";
import imgNews from "@/assets/page-news.webp";
import imgContact from "@/assets/page-contact.webp";
import imgBooster from "@/assets/booster.webp";
import imgLogo from "@/assets/logo.png";
import imgStores from "@/assets/page-stores.webp";
import { useCms } from "@/context/CmsContext";

const fallbackHeroSlides = [
  {
    image: imgMotorbike,
    alt: "Vay tiền bằng cà vẹt xe máy tại Y99",
    to: "/cho-vay-cam-co/vay-tien-bang-cavet-xe-may",
  },
  {
    image: imgCar,
    alt: "Vay tiền bằng cà vẹt ô tô tại Y99",
    to: "/cho-vay-cam-co/vay-tien-bang-cavet-oto",
  },
  {
    image: imgIcloud,
    alt: "Vay tiền bằng iCloud tại Y99",
    to: "/cho-vay-cam-co/vay-bang-icloud",
  },
  {
    image: imgNews,
    alt: "Khám phá giải pháp vay tiền online của Y99",
    to: "/vay-tien-online",
  },
  {
    image: imgContact,
    alt: "Liên hệ tư vấn khoản vay nhanh cùng Y99",
    to: "/lien-he",
  },
  {
    image: imgBooster,
    alt: "Chương trình The Booster từ Y99",
    to: "/vay-tien-online",
  },
  {
    image: imgLogo,
    alt: "Logo Y99",
    to: "/",
  },
  {
    image: imgStores,
    alt: "Hệ thống cửa hàng Y99 trên toàn quốc",
    to: "/he-thong-cua-hang",
  },
];

function slideImageSrc(image: string | StaticImageData) {
  return typeof image === "string" ? image : image.src;
}

const Hero = () => {
  const { heroSlides: cmsSlides, settings } = useCms();
  const heroSlides = cmsSlides ?? fallbackHeroSlides;
  const h1Text = settings.seoHomeH1?.trim() || "Vay tiền nhanh — Y99 luôn sẵn sàng";
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const firstSlide = heroSlides[0];

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const autoplayTimer = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);

    return () => window.clearInterval(autoplayTimer);
  }, [carouselApi]);

  const heroMinHeight = "min-h-[min(85vh,720px)] md:min-h-[min(80vh,680px)]";
  const bannerImageClass = "h-full w-full object-contain object-center";

  return (
    <section className={`relative overflow-hidden ${heroMinHeight}`}>
      {/* Full-width banner carousel */}
      <div className={`absolute inset-0 bg-background [&_.overflow-hidden]:h-full [&_.overflow-hidden_.flex]:h-full`}>
        <ClientOnly
          fallback={
            firstSlide ? (
              <Link href={firstSlide.to} className="block h-full w-full">
                <img
                  src={slideImageSrc(firstSlide.image)}
                  alt={firstSlide.alt}
                  className={bannerImageClass}
                  loading="eager"
                  decoding="async"
                  style={{ fetchPriority: "high" } as CSSProperties}
                />
              </Link>
            ) : null
          }
        >
          <Carousel setApi={setCarouselApi} opts={{ loop: true, align: "start" }} className="absolute inset-0 h-full w-full">
            <CarouselContent className="ml-0 h-full [&>div]:h-full">
              {heroSlides.map((slide, index) => (
                <CarouselItem key={slide.to} className="pl-0 h-full basis-full">
                  <Link href={slide.to} className="block h-full w-full">
                    <img
                      src={slideImageSrc(slide.image)}
                      alt={slide.alt}
                      className={bannerImageClass}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      style={
                        index === 0
                          ? ({ fetchPriority: "high" } as CSSProperties)
                          : ({ fetchPriority: "low" } as CSSProperties)
                      }
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </ClientOnly>
      </div>

      {/* Full-height text backdrop — flush left, fade toward right */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full max-w-[min(100%,44rem)] lg:max-w-[min(52%,48rem)]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-primary/12 blur-3xl [mask-image:linear-gradient(to_right,#000_0%,#00000066_45%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,#000_0%,#00000066_45%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-[hsl(var(--primary-dark)/0.22)] to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_right,#000_0%,#000_55%,#000000b3_68%,#00000073_78%,#00000040_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,#000_0%,#000_55%,#000000b3_68%,#00000073_78%,#00000040_88%,transparent_100%)]" />
      </div>

      {/* Content over banner */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
        <div className="container flex flex-1 flex-col justify-center py-16 pl-0 lg:py-24">
        <div className="pointer-events-auto relative max-w-xl px-6 text-primary-foreground sm:px-8 md:px-10 lg:px-12">
          <div className="space-y-7">
            <h1 className="hero-text-outline-strong text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              {h1Text.includes("—") ? (
                <>
                  <span className="block">{h1Text.split("—")[0]?.trim()}</span>
                  <span className="mt-3 block text-accent md:mt-4">{h1Text.split("—").slice(1).join("—").trim()}</span>
                </>
              ) : (
                h1Text
              )}
            </h1>

            <p className="hero-text-outline text-lg text-primary-foreground/85 max-w-lg">
              Y99 đồng hành cùng bạn với <strong className="font-semibold text-primary-foreground">khoản vay linh hoạt</strong>,
              lãi suất minh bạch và thủ tục <strong className="font-semibold text-primary-foreground">vay tiền</strong> cực kỳ đơn giản.
            </p>

            <ul className="hero-text-outline space-y-2.5">
              {[
                "Hạn mức lên đến 300.000.000 VNĐ",
                "Chỉ cần CCCD - VNeID mức 2",
                "Hỗ trợ vay online bằng iCloud",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-primary-foreground/95">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5 drop-shadow-[0_0_2px_rgba(0,0,0,0.85)]" />
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-nowrap items-center gap-3 sm:gap-4">
            <Button variant="hero" size="xl" className="h-12 shrink-0 gap-2 px-6 text-base sm:h-14 sm:px-10 sm:text-lg" asChild>
              <Link href="/vay-tien-online">
                Đăng ký vay ngay <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outlineLight" size="xl" className="h-12 shrink-0 px-6 text-base sm:h-14 sm:px-10 sm:text-lg" asChild>
              <Link href="/cho-vay-cam-co/vay-tien-bang-cavet-xe-may">Tìm hiểu sản phẩm</Link>
            </Button>
          </div>
        </div>

        </div>
        <div className="pointer-events-auto flex items-center justify-center gap-2 pb-6 pt-4">
          {heroSlides.map((slide, index) => (
            <button
              key={`dot-${slide.to}`}
              type="button"
              onClick={() => carouselApi?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeSlide === index ? "w-7 bg-[#FACC15]" : "w-2.5 bg-slate-900/35 hover:bg-slate-900/55"
              }`}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
