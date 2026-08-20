import type { GetServerSideProps } from "next";

import NewsDetail from "@/pages/NewsDetail";
import { createClientPage } from "@/lib/createClientPage";
import { fetchNewsArticles } from "@/lib/cms/fetch";
import { sanitizeForProps } from "@/lib/cms/serialize";
import { articleSeo } from "@/lib/seo/config";
import type { NewsArticle } from "@/lib/cms/types";

const Page = createClientPage(NewsDetail);

function pathSegments(slugParam: string | string[] | undefined): string[] {
  if (!slugParam) return [];
  return (Array.isArray(slugParam) ? slugParam : [slugParam])
    .flatMap((part) => part.split("/"))
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveArticle(news: NewsArticle[], segments: string[]): NewsArticle | undefined {
  if (segments.length === 0) return undefined;
  const last = segments[segments.length - 1];
  const joined = segments.join("/");
  return (
    news.find((a) => a.slug === last) ||
    news.find((a) => a.slug === joined) ||
    news.find((a) => a.slug.replace(/\/+$/, "").endsWith(`/${last}`)) ||
    news.find((a) => a.slug.split("/").filter(Boolean).pop() === last)
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const segments = pathSegments(params?.slug);
  const news = await fetchNewsArticles();
  const article = resolveArticle(news, segments);

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      slug: article.slug,
      cmsInitial: sanitizeForProps({ news, ready: true }),
      seo: articleSeo(article),
    },
  };
};

export default Page;
