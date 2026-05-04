import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  crumbs?: Crumb[];
  media?: ReactNode;
  titleClassName?: string;
}

const PageHero = ({ eyebrow, title, description, crumbs = [], media, titleClassName = "" }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className={`container relative py-14 md:py-20 grid items-center gap-10 ${media ? "lg:grid-cols-[1.4fr,1fr]" : ""}`}>
        <div>
          {crumbs.length > 0 && (
            <nav className="flex items-center flex-wrap gap-1.5 text-sm opacity-85 mb-5">
              <Link to="/" className="hover:text-accent transition-smooth">Trang chủ</Link>
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {c.to ? (
                    <Link to={c.to} className="hover:text-accent transition-smooth">{c.label}</Link>
                  ) : (
                    <span className="text-accent font-medium">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-3">
              {eyebrow}
            </span>
          )}
          <h1 className={`font-extrabold max-w-4xl text-3xl md:text-4xl lg:text-5xl leading-tight ${titleClassName}`}>
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg text-primary-foreground/85 max-w-2xl">{description}</p>
          )}
        </div>

        {media && (
          <div className="hidden lg:flex justify-center perspective-1000">{media}</div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
