interface ProductHeroVisualProps {
  src: string;
  alt: string;
  imageClassName?: string;
}

const ProductHeroVisual = ({ src, alt, imageClassName = "" }: ProductHeroVisualProps) => {
  return (
    <div className="relative w-full max-w-md aspect-square">
      {/* Glowing aura layers */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-6 rounded-full bg-primary-glow/40 blur-2xl" />

      {/* Rotating ring */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/40" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_hsl(45_100%_55%)]" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary-glow" />
      </div>

      {/* Floating coins / dots */}
      <div className="pointer-events-none absolute -top-2 -right-4 h-10 w-10 rounded-full bg-accent shadow-cta" />
      <div className="pointer-events-none absolute -bottom-2 -left-2 h-7 w-7 rounded-full bg-primary-glow shadow-glow" />
      <div className="pointer-events-none absolute top-1/3 -left-6 h-5 w-5 rounded-full bg-accent/80" />

      {/* Static image */}
      <div className="relative h-full w-full">
        <img
          src={src}
          alt={alt}
          width={1024}
          height={1024}
          loading="lazy"
          className={`relative h-full w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.35)] ${imageClassName}`}
        />
      </div>
    </div>
  );
};

export default ProductHeroVisual;
