import type { GetServerSideProps } from "next";

import Index from "@/pages/Index";

import { createClientPage } from "@/lib/createClientPage";

import { getCmsServerProps } from "@/lib/cms/serverProps";

import { homeSeo } from "@/lib/seo/config";



const Page = createClientPage(Index);



export const getServerSideProps: GetServerSideProps = async () => {

  const { cmsInitial } = await getCmsServerProps();

  return { props: { cmsInitial, seo: homeSeo(cmsInitial.settings) } };

};



export default Page;

