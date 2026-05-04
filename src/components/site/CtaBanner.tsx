import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

const CtaBanner = () => {
  return (
    <section className="py-10 md:py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-gradient-hero p-5 sm:p-7 md:p-14 shadow-card">
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid md:grid-cols-[1.5fr,1fr] gap-5 md:gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-primary-foreground">
                <span className="block">Cần xoay tiền gấp?</span>
                <span className="mt-3 block">Gọi Y99 ngay hôm nay!</span>
              </h2>
              <p className="mt-3 md:mt-4 text-sm sm:text-base text-primary-foreground/85 max-w-lg">
                Hồ sơ được duyệt trong 15 phút - Giải ngân tức thì.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 md:gap-3">
              <Button variant="cta" size="xl" className="gap-2 w-full h-11 md:h-14 text-sm md:text-base bg-gradient-accent text-accent-foreground hover:brightness-105" asChild>
                <a href="tel:1900575792"><Phone className="h-5 w-5" /> Hotline 1900575792</a>
              </Button>
              <Button size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full gap-2 h-11 md:h-14 text-sm md:text-base" asChild>
                <Link to="/lien-he">Đăng ký online <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
