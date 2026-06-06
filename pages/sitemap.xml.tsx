import type { GetServerSideProps } from "next";
import { fetchLoanProducts, fetchNewsArticles } from "@/lib/cms/fetch";
import { absoluteUrl } from "@/lib/seo/site";

const STATIC_PATHS = [
  "/",
  "/ve-y99",
  "/lien-he",
  "/he-thong-cua-hang",
  "/ban-tin",
  "/vay-tien-online",
  "/dang-ky-vay-ngay",
  "/tuyen-dung",
  "/chinh-sach-bao-mat",
  "/chinh-sach-lai-suat-phi-dich-vu",
  "/tuyen-bo-mien-tru-trach-nhiem",
];

function buildSitemap(urls: { loc: string; priority: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
}

function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const [products, news] = await Promise.all([fetchLoanProducts(), fetchNewsArticles()]);

  const urls: { loc: string; priority: string }[] = [
    ...STATIC_PATHS.map((path) => ({
      loc: absoluteUrl(path),
      priority: path === "/" ? "1.0" : "0.8",
    })),
    ...Object.keys(products).map((slug) => ({
      loc: absoluteUrl(`/cho-vay-cam-co/${slug}`),
      priority: "0.9",
    })),
    ...news.map((article) => ({
      loc: absoluteUrl(`/ban-tin/${article.slug}`),
      priority: "0.7",
    })),
  ];

  const xml = buildSitemap(urls);
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default SiteMap;
