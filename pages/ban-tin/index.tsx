import type { GetServerSideProps } from "next";

import News from "@/pages/News";

import { createClientPage } from "@/lib/createClientPage";

import { getCmsServerProps } from "@/lib/cms/serverProps";

import { staticSeo } from "@/lib/seo/config";



const Page = createClientPage(News, { seo: staticSeo.news });



export const getServerSideProps: GetServerSideProps = async () => {

  const { cmsInitial } = await getCmsServerProps();

  return { props: { cmsInitial, seo: staticSeo.news } };

};



export default Page;

