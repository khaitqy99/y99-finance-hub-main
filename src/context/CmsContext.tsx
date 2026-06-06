import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  fetchHeroSlides,
  fetchLoanProducts,
  fetchNewsArticles,
  fetchRecruitmentPosts,
  fetchSiteSettings,
  fetchStoreLocations,
  fetchTestimonials,
} from '@/lib/cms/fetch';
import type {
  HeroSlide,
  LoanProductData,
  NewsArticle,
  RecruitmentPost,
  SiteSettings,
  StoreLocation,
  TestimonialItem,
} from '@/lib/cms/types';
import { newsArticles as staticNews } from '@/data/newsArticles';
import { storeLocations as staticStores } from '@/data/storeLocations';
import { loanProducts as staticProducts } from '@/data/loanProducts';

type CmsState = {
  ready: boolean;
  news: NewsArticle[];
  stores: StoreLocation[];
  products: Record<string, LoanProductData>;
  recruitment: RecruitmentPost[];
  heroSlides: HeroSlide[] | null;
  testimonials: TestimonialItem[] | null;
  settings: SiteSettings;
};

export type CmsInitialState = Partial<CmsState> & { ready?: boolean };

const defaultSettings: SiteSettings = {
  companyName: 'CÔNG TY CỔ PHẦN CẦM ĐỒ Y99',
  hotline: '1900575792',
  foreignPhone: '+84 292 38 999 33',
  email: 'cskh@y99.vn',
  address: '',
  taxId: '',
  facebook: '',
  zalo: '',
  whatsapp: '',
  headerMarquee: '',
};

function buildInitialState(initial?: CmsInitialState): CmsState {
  return {
    ready: initial?.ready ?? false,
    news: initial?.news ?? staticNews,
    stores: initial?.stores ?? staticStores,
    products: initial?.products ?? staticProducts,
    recruitment: initial?.recruitment ?? [],
    heroSlides: initial?.heroSlides ?? null,
    testimonials: initial?.testimonials ?? null,
    settings: initial?.settings ?? defaultSettings,
  };
}

const CmsContext = createContext<CmsState | null>(null);

export function CmsProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: CmsInitialState;
}) {
  const [state, setState] = useState<CmsState>(() => buildInitialState(initial));
  const hydratedFromServer = Boolean(initial?.ready);

  useEffect(() => {
    if (hydratedFromServer) return;

    let cancelled = false;
    (async () => {
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
      if (!cancelled) {
        setState({
          ready: true,
          news,
          stores,
          products,
          recruitment,
          heroSlides,
          testimonials,
          settings,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydratedFromServer]);

  return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}
