import type { GetServerSideProps } from "next";

import NewsDetail from "@/pages/NewsDetail";

import { createClientPage } from "@/lib/createClientPage";

import { fetchNewsArticles } from "@/lib/cms/fetch";

import { sanitizeForProps } from "@/lib/cms/serialize";

import { articleSeo } from "@/lib/seo/config";



const Page = createClientPage(NewsDetail);



export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const slug = typeof params?.slug === "string" ? params.slug : "";

  const news = await fetchNewsArticles();

  const article = news.find((a) => a.slug === slug);



  if (!article) {

    return { notFound: true };

  }



  return {

    props: {

      slug,

      cmsInitial: sanitizeForProps({ news, ready: true }),

      seo: articleSeo(article),

    },

  };

};



export default Page;

