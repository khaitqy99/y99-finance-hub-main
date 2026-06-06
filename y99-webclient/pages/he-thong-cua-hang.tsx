import type { GetServerSideProps } from "next";

import Stores from "@/pages/Stores";

import { createClientPage } from "@/lib/createClientPage";

import { getCmsServerProps } from "@/lib/cms/serverProps";

import { staticSeo } from "@/lib/seo/config";



const Page = createClientPage(Stores, { seo: staticSeo.stores });



export const getServerSideProps: GetServerSideProps = async () => {

  const { cmsInitial } = await getCmsServerProps();

  return { props: { cmsInitial, seo: staticSeo.stores } };

};



export default Page;

