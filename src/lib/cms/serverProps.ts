import {
  fetchHeroSlides,
  fetchLoanProducts,
  fetchNewsArticles,
  fetchRecruitmentPosts,
  fetchSiteSettings,
  fetchStoreLocations,
  fetchTestimonials,
} from "@/lib/cms/fetch";
import type { CmsInitialState } from "@/context/CmsContext";
import { sanitizeForProps } from "@/lib/cms/serialize";

export async function getCmsServerProps(): Promise<{ cmsInitial: CmsInitialState }> {
  const [news, stores, products, recruitment, heroSlides, testimonials, settings] =
    await Promise.all([
      fetchNewsArticles(),
      fetchStoreLocations(),
      fetchLoanProducts(),
      fetchRecruitmentPosts(),
      fetchHeroSlides(),
      fetchTestimonials(),
      fetchSiteSettings(),
    ]);

  return {
    cmsInitial: sanitizeForProps({
      ready: true,
      news,
      stores,
      products,
      recruitment,
      heroSlides,
      testimonials,
      settings,
    }),
  };
}
