import NotFound from "@/pages/NotFound";

import { createClientPage } from "@/lib/createClientPage";

import { staticSeo } from "@/lib/seo/config";



export default createClientPage(NotFound, {

  seo: { ...staticSeo.notFound, noindex: true },

});

