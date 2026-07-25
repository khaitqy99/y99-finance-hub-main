import {
  fetchCommunitySlides,
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
  const [news, stores, products, recruitment, heroSlides, communitySlides, testimonials, settings] =
    await Promise.all([
      fetchNewsArticles(),
      fetchStoreLocations(),
      fetchLoanProducts(),
      fetchRecruitmentPosts(),
      fetchHeroSlides(),
      fetchCommunitySlides(),
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
      communitySlides,
      testimonials,
      settings,
    }),
  };
}
