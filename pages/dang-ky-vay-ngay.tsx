import DangKyVayNgay from "@/pages/DangKyVayNgay";

import { createClientPage } from "@/lib/createClientPage";

import { withCmsProps } from "@/lib/cms/withCmsProps";

import { staticSeo } from "@/lib/seo/config";



export default createClientPage(DangKyVayNgay, { seo: staticSeo.dangKy });



export const getServerSideProps = withCmsProps(() => ({

  props: { seo: staticSeo.dangKy },

}));

