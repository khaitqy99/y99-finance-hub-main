import PrivacyPolicy from "@/pages/PrivacyPolicy";

import { createClientPage } from "@/lib/createClientPage";

import { withCmsProps } from "@/lib/cms/withCmsProps";

import { staticSeo } from "@/lib/seo/config";



export default createClientPage(PrivacyPolicy, { seo: staticSeo.privacy });



export const getServerSideProps = withCmsProps(() => ({

  props: { seo: staticSeo.privacy },

}));

