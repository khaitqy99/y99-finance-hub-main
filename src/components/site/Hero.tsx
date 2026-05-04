import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const heroSlides = [
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

const Hero = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);

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

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
        {/* Left text */}
        <div className="text-primary-foreground space-y-7">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
            <span className="block">Dù bạn <span className="text-accent">ở đâu</span></span>
            <span className="mt-3 block md:mt-4"><span className="text-[1.25em]">Y99</span> <span className="text-accent">luôn sẵn sàng</span></span>
          </h1>

          <p className="text-lg text-primary-foreground/85 max-w-lg">
            Y99 đồng hành cùng bạn với khoản vay linh hoạt, lãi suất minh bạch và thủ tục cực kỳ đơn giản.
          </p>

          <ul className="space-y-2.5">
            {[
              "Hạn mức lên đến 300.000.000 VNĐ",
              "Chỉ cần CCCD - VNeID mức 2",
              "Hỗ trợ vay online bằng Icloud",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-primary-foreground/95">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="hero" size="xl" className="gap-2" asChild>
              <Link to="/lien-he">Đăng ký vay ngay <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <Button variant="outlineLight" size="xl" asChild>
              <Link to="/cho-vay-cam-co/vay-tien-bang-cavet-xe-may">Tìm hiểu sản phẩm</Link>
            </Button>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-accent blur-3xl opacity-30" />
            <Carousel
              setApi={setCarouselApi}
              opts={{ loop: true, align: "start" }}
              className="relative mx-auto w-full max-w-[520px]"
            >
              <CarouselContent className="ml-0">
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={slide.to} className="pl-0">
                    <Link to={slide.to} className="block">
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="relative mx-auto h-[520px] w-full max-w-[520px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "low"}
                        decoding="async"
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="mt-4 flex items-center justify-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={`dot-${slide.to}`}
                  type="button"
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index ? "w-7 bg-[#FACC15]" : "w-2.5 bg-white/45 hover:bg-white/70"
                  }`}
                  aria-label={`Chuyển đến slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
