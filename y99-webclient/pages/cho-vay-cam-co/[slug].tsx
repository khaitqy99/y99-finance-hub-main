import type { GetServerSideProps } from "next";

import LoanProduct from "@/pages/LoanProduct";

import { createClientPage } from "@/lib/createClientPage";

import { fetchLoanProducts } from "@/lib/cms/fetch";

import { sanitizeForProps } from "@/lib/cms/serialize";

import { productSeo } from "@/lib/seo/config";



const Page = createClientPage(LoanProduct);



export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const slug = typeof params?.slug === "string" ? params.slug : "";

  const products = await fetchLoanProducts();

  const data = products[slug];



  if (!data) {

    return { notFound: true };

  }



  return {

    props: {

      slug,

      cmsInitial: sanitizeForProps({ products, ready: true }),

      seo: productSeo(data),

    },

  };

};



export default Page;

