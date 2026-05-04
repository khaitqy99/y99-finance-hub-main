import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import imgMotorbike from "@/assets/loan-motorbike.webp";
import imgCar from "@/assets/loan-car.webp";
import imgIcloud from "@/assets/loan-icloud.webp";

const services = [
  { image: imgMotorbike, title: "Vay đăng ký xe máy", desc: "Vay tiền bằng Cà vẹt (Giấy đăng ký xe) chính chủ.", to: "/cho-vay-cam-co/vay-tien-bang-cavet-xe-may" },
  { image: imgCar, title: "Vay đăng ký ô tô", desc: "Hỗ trợ hạn mức vốn lớn bằng đăng ký xe ô tô.", to: "/cho-vay-cam-co/vay-tien-bang-cavet-oto" },
  { image: imgIcloud, title: "Vay bằng iCloud", desc: "Điện thoại vẫn dùng - tiền vẫn về. Không giữ máy. Hỗ trợ vay ONLINE", to: "/cho-vay-cam-co/vay-bang-icloud" },
] as const;

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gradient-soft">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-sm font-bold uppercase tracking-widest text-primary mb-3">Dịch vụ của Y99</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Sản phẩm tài chính <span className="text-primary">nổi bật</span>
          </h2>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-gradient-accent" />
          <p className="text-muted-foreground mt-5">
            Khám phá các sản phẩm vay cầm cố linh hoạt, phù hợp với mọi nhu cầu của bạn.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 perspective-1000">
          {services.map((s) => (
            <Link
              to={s.to}
              key={s.title}
              className="group relative rounded-3xl bg-card p-7 pt-6 shadow-soft hover:shadow-card transition-smooth border border-border/60 hover:-translate-y-1 block overflow-hidden w-full h-full flex flex-col"
            >
              {/* Glow accent */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/30 transition-smooth" />

              {/* 3D visual */}
              <div className="relative h-40 mb-4 flex items-center justify-center">
                <div className="absolute inset-x-6 bottom-2 h-3 rounded-full bg-foreground/20 blur-md" />
                <img
                  src={s.image}
                  alt={s.title}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="relative h-full w-auto object-contain animate-float-3d group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)]"
                />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.desc}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-smooth">
                Tìm hiểu thêm <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
