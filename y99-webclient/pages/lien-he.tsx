import Contact from "@/pages/Contact";

import { createClientPage } from "@/lib/createClientPage";

import { withCmsProps } from "@/lib/cms/withCmsProps";

import { staticSeo } from "@/lib/seo/config";



export default createClientPage(Contact, { seo: staticSeo.contact });



export const getServerSideProps = withCmsProps(() => ({

  props: { seo: staticSeo.contact },

}));

