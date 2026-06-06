import { createServiceClient } from '@/lib/supabase/server';
import type { AdminData, SiteSettingsRow } from '@/lib/cms/types';

const defaultSettings: SiteSettingsRow = {
  id: 1,
  company_name: 'CÔNG TY CỔ PHẦN CẦM ĐỒ Y99',
  hotline: '1900575792',
  foreign_phone: '+84 292 38 999 33',
  email: 'cskh@y99.vn',
  address: '',
  tax_id: '',
  facebook: '',
  zalo: '',
  whatsapp: '',
  header_marquee: '',
  seo_home_title: '',
  seo_home_description: '',
  seo_home_h1: '',
  seo_og_image_url: '',
};

export async function loadAdminData(): Promise<AdminData> {
  const supabase = createServiceClient();

  const [
    newsRes,
    storesRes,
    productsRes,
    slidesRes,
    testimonialsRes,
    settingsRes,
    leadsRes,
  ] = await Promise.all([
    supabase.from('news_articles').select('*').order('sort_order'),
    supabase.from('store_locations').select('*').order('sort_order'),
    supabase.from('loan_products').select('*').order('sort_order'),
    supabase.from('hero_slides').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('sort_order'),
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
  ]);

  const errors = [
    newsRes.error,
    storesRes.error,
    productsRes.error,
    slidesRes.error,
    testimonialsRes.error,
    settingsRes.error,
    leadsRes.error,
  ].filter(Boolean);

  if (errors.length) {
    throw new Error(errors.map((e) => e!.message).join('; '));
  }

  return {
    news: (newsRes.data ?? []).map((row) => ({
      ...row,
      content: Array.isArray(row.content) ? row.content : [],
    })),
    stores: storesRes.data ?? [],
    products: (productsRes.data ?? []).map((row) => ({
      ...row,
      benefits: row.benefits ?? [],
      conditions: row.conditions ?? [],
      documents: row.documents ?? [],
      process: row.process ?? [],
    })),
    marketing: {
      slides: slidesRes.data ?? [],
      testimonials: testimonialsRes.data ?? [],
    },
    leads: (leadsRes.data ?? []).map((l) => ({
      ...l,
      status: l.status as AdminData['leads'][0]['status'],
    })),
    settings: settingsRes.data ?? defaultSettings,
  };
}
