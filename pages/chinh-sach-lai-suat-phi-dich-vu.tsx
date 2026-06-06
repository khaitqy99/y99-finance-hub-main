import InterestFeePolicy from "@/pages/InterestFeePolicy";

import { createClientPage } from "@/lib/createClientPage";

import { withCmsProps } from "@/lib/cms/withCmsProps";

import { staticSeo } from "@/lib/seo/config";



export default createClientPage(InterestFeePolicy, { seo: staticSeo.interestFee });



export const getServerSideProps = withCmsProps(() => ({

  props: { seo: staticSeo.interestFee },

}));

