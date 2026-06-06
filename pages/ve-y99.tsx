import About from "@/pages/About";

import { createClientPage } from "@/lib/createClientPage";

import { withCmsProps } from "@/lib/cms/withCmsProps";

import { staticSeo } from "@/lib/seo/config";



const Page = createClientPage(About, { seo: staticSeo.about });



export const getServerSideProps = withCmsProps(() => ({

  props: { seo: staticSeo.about },

}));



export default Page;

