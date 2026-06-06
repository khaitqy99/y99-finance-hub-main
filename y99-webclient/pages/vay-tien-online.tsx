import VayTienOnline from "@/pages/VayTienOnline";

import { createClientPage } from "@/lib/createClientPage";

import { withCmsProps } from "@/lib/cms/withCmsProps";

import { staticSeo } from "@/lib/seo/config";



export default createClientPage(VayTienOnline, { seo: staticSeo.vayOnline });



export const getServerSideProps = withCmsProps(() => ({

  props: { seo: staticSeo.vayOnline },

}));

