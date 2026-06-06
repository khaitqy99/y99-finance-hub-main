import type { GetServerSideProps } from "next";

import Recruitment from "@/pages/Recruitment";

import { createClientPage } from "@/lib/createClientPage";

import { getCmsServerProps } from "@/lib/cms/serverProps";

import { staticSeo } from "@/lib/seo/config";



const Page = createClientPage(Recruitment, { seo: staticSeo.recruitment });



export const getServerSideProps: GetServerSideProps = async () => {

  const { cmsInitial } = await getCmsServerProps();

  return { props: { cmsInitial, seo: staticSeo.recruitment } };

};



export default Page;

