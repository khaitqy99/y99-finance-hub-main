import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { useCms } from "@/context/CmsContext";
import { parseImageLine } from "@/lib/cms/content-images";

type Props = {
  /** From getServerSideProps — router.query.slug is empty on first client paint */
  slug: string;
};

const NewsDetail = ({ slug }: Props) => {
  const { news: newsArticles } = useCms();
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) return null;

  const related = newsArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={article.category}
        title={article.title}
        crumbs={[{ label: "Tin tức", to: "/ban-tin" }, { label: article.title.slice(0, 40) + "..." }]}
      />

      <article className="py-16">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4" /> {article.date}
          </div>
          <img src={article.image} alt={article.title} className="rounded-3xl w-full aspect-[16/9] object-cover shadow-card" />

          <div className="prose prose-lg max-w-none mt-8 space-y-5 text-foreground/85">
            <p className="text-xl leading-relaxed font-medium text-foreground">{article.excerpt}</p>
            {article.content.map((p, i) => {
              const img = parseImageLine(p);
              if (img) {
                return (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.alt || article.title}
                    loading="lazy"
                    className="rounded-2xl w-full my-6 shadow-card object-cover"
                  />
                );
              }
              return (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              );
            })}
          </div>

          <Link href="/ban-tin" className="inline-flex items-center gap-2 mt-10 text-primary font-semibold hover:gap-3 transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
          </Link>
        </div>
      </article>

      <section className="py-12 bg-gradient-soft">
        <div className="container">
          <h2 className="text-2xl font-extrabold mb-6 text-foreground">Tin liên quan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((a) => (
              <Link key={a.slug} href={`/ban-tin/${a.slug}`} className="group rounded-2xl bg-card overflow-hidden border border-border/60 shadow-soft hover:shadow-card transition-smooth">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">{a.category}</span>
                  <h3 className="font-bold mt-1.5 line-clamp-2 group-hover:text-primary transition-smooth">{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsDetail;
