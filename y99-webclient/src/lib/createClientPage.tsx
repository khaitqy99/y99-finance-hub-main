import type { ComponentType } from "react";

import AppShell from "@/App";

import SiteSeo from "@/components/seo/SiteSeo";

import type { CmsInitialState } from "@/context/CmsContext";

import type { PageSeo } from "@/lib/seo/config";



type PageProps = {

  cmsInitial?: CmsInitialState;

  seo?: PageSeo;

  [key: string]: unknown;

};



type CreateClientPageOptions = {

  withLayout?: boolean;

  seo?: PageSeo;

};



/** Wraps a page with AppShell + SEO. Uses a direct import (not next/dynamic) to avoid hydration mismatches. */

export function createClientPage<P extends Record<string, unknown> = Record<string, unknown>>(

  PageComponent: ComponentType<P>,

  options: CreateClientPageOptions = {},

) {

  const { withLayout = true, seo: defaultSeo } = options;



  function WrappedPage(pageProps: PageProps) {

    const seo = pageProps.seo ?? defaultSeo;

    const { cmsInitial, seo: _seo, ...rest } = pageProps;



    return (

      <>

        {seo ? <SiteSeo {...seo} /> : null}

        <AppShell withLayout={withLayout} cmsInitial={cmsInitial}>

          <PageComponent {...(rest as P)} />

        </AppShell>

      </>

    );

  }



  WrappedPage.displayName = "WrappedClientPage";

  return WrappedPage;

}


