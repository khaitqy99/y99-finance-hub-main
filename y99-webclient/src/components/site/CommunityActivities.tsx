"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCms } from "@/context/CmsContext";
import { fallbackCommunitySlides, type CommunitySlide } from "@/data/communitySlides";
import { Play } from "lucide-react";

function toEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com/")) return url;
  const ytWatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (ytWatch?.[1]) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  return url;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function SlideMedia({
  slide,
  priority,
  playing,
  onPlay,
}: {
  slide: CommunitySlide;
  priority?: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  const embed = slide.videoUrl ? toEmbedUrl(slide.videoUrl) : null;

  if (embed && playing) {
    if (isDirectVideo(embed)) {
      return (
        <video className="h-full w-full object-cover" src={embed} controls autoPlay playsInline />
      );
    }
    return (
      <iframe
        title={slide.title || slide.alt}
        src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="group relative block h-full w-full overflow-hidden"
      onClick={embed ? onPlay : undefined}
      aria-label={embed ? `Xem video: ${slide.title || slide.alt}` : slide.alt}
    >
      <img
        src={slide.image}
        alt={slide.alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      {embed ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>
        </span>
      ) : null}
      {slide.title ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-5 pt-16 text-left">
          <span className="block text-lg font-bold text-white md:text-xl">{slide.title}</span>
        </span>
      ) : null}
    </button>
  );
}

type Props = {
  /** When false, omit the outer section wrapper (caller provides section). Default true. */
  asSection?: boolean;
  className?: string;
};

const CommunityActivities = ({ asSection = true, className = "py-16" }: Props) => {
  const { communitySlides: cmsSlides } = useCms();
  const slides = useMemo(
    () => (cmsSlides?.length ? cmsSlides : fallbackCommunitySlides),
    [cmsSlides],
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
      setPlayingId(null);
    };
    onSelect();
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || playingId) return;
    const timer = window.setInterval(() => carouselApi.scrollNext(), 5000);
    return () => window.clearInterval(timer);
  }, [carouselApi, playingId]);

  const body = (
    <div className="container">
      <div className="mb-10 text-center mx-auto max-w-2xl">
        <span className="inline-block text-sm font-bold uppercase tracking-widest text-primary mb-3">
          Y99 & Cộng đồng
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">HOẠT ĐỘNG CỘNG ĐỒNG</h2>
        <p className="mt-3 text-muted-foreground">
          Những khoảnh khắc Y99 đồng hành cùng địa phương, học sinh và cộng đồng trên khắp cả nước.
        </p>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <ClientOnly
          fallback={
            <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
              <img
                src={slides[0]?.image}
                alt={slides[0]?.alt ?? "Hoạt động cộng đồng Y99"}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Carousel setApi={setCarouselApi} opts={{ loop: true, align: "start" }} className="w-full">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={slide.id}>
                  <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
                    <SlideMedia
                      slide={slide}
                      priority={index === 0}
                      playing={playingId === slide.id}
                      onPlay={() => setPlayingId(slide.id)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {slides.length > 1 ? (
              <>
                <CarouselPrevious className="left-3 md:-left-12 border-border bg-background/90" />
                <CarouselNext className="right-3 md:-right-12 border-border bg-background/90" />
              </>
            ) : null}
          </Carousel>
        </ClientOnly>

        {slides.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.id}`}
                type="button"
                onClick={() => carouselApi?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === index
                    ? "w-7 bg-primary"
                    : "w-2.5 bg-foreground/20 hover:bg-foreground/35"
                }`}
                aria-label={`Chuyển đến hoạt động ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (!asSection) return body;
  return (
    <section className={className} id="hoat-dong-cong-dong">
      {body}
    </section>
  );
};

export default CommunityActivities;
