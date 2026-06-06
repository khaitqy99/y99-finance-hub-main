import Disclaimer from "@/pages/Disclaimer";

import { createClientPage } from "@/lib/createClientPage";

import { withCmsProps } from "@/lib/cms/withCmsProps";

import { staticSeo } from "@/lib/seo/config";



export default createClientPage(Disclaimer, { seo: staticSeo.disclaimer });



export const getServerSideProps = withCmsProps(() => ({

  props: { seo: staticSeo.disclaimer },

}));

