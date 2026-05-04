import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ProductHeroVisual from "@/components/site/ProductHeroVisual";
import imgNews from "@/assets/page-news.webp";
import { newsArticles } from "@/data/newsArticles";

const News = () => {
  const [featured, ...rest] = newsArticles;
  return (
    <>
      <PageHero
        eyebrow="Tin tức & Sự kiện"
        title="Bản tin Y99"
        description="Cập nhật tin tức mới nhất về Y99 Finance, hoạt động doanh nghiệp, cẩm nang vay vốn và các chương trình ưu đãi."
        crumbs={[{ label: "Tin tức" }]}
        media={<ProductHeroVisual src={imgNews} alt="Bản tin Y99" />}
      />

      <section className="py-16">
        <div className="container space-y-12">
          {/* Featured */}
          <Link to={`/ban-tin/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 items-center rounded-3xl overflow-hidden bg-card border border-border/60 shadow-soft hover:shadow-card transition-smooth">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={featured.image} alt={featured.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
            </div>
            <div className="p-8 lg:pr-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">{featured.category}</span>
              <h2 className="text-3xl font-extrabold leading-tight text-foreground group-hover:text-primary transition-smooth">{featured.title}</h2>
              <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {featured.date}</span>
                <span className="inline-flex items-center gap-1.5 text-primary font-semibold">Đọc tiếp <ArrowRight className="h-4 w-4" /></span>
              </div>
            </div>
          </Link>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((a) => (
              <Link key={a.slug} to={`/ban-tin/${a.slug}`} className="group rounded-2xl bg-card overflow-hidden border border-border/60 shadow-soft hover:shadow-card transition-smooth hover:-translate-y-1">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                </div>
                <div className="p-6">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2">{a.category}</span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-smooth line-clamp-2">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                  <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {a.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
