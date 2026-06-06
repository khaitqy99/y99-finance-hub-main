export type LeadStatus = 'new' | 'contacted' | 'closed';

export type NewsRow = {
  id: string;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  seo_h1: string;
  excerpt: string;
  category: string;
  date_display: string;
  image_url: string;
  image_alt: string;
  content: string[];
  published: boolean;
  sort_order: number;
};

export type StoreRow = {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  active: boolean;
  sort_order: number;
};

export type ProcessStep = { title: string; desc: string };

export type ProductRow = {
  slug: string;
  name: string;
  meta_title: string;
  meta_description: string;
  seo_h1: string;
  tagline: string;
  description: string;
  max_amount: string;
  max_term: string;
  interest_rate: string;
  approval_time: string;
  benefits: string[];
  conditions: string[];
  documents: string[];
  process: ProcessStep[];
  image_key: string | null;
  image_url: string | null;
  image_alt: string;
  published: boolean;
  sort_order: number;
};

export type HeroSlideRow = {
  id: string;
  title: string;
  alt_text: string;
  image_url: string;
  link_to: string;
  active: boolean;
  sort_order: number;
};

export type TestimonialRow = {
  id: string;
  author: string;
  role: string;
  content: string;
  active: boolean;
  sort_order: number;
};

export type SiteSettingsRow = {
  id: number;
  company_name: string;
  hotline: string;
  foreign_phone: string;
  email: string;
  address: string;
  tax_id: string;
  facebook: string;
  zalo: string;
  whatsapp: string;
  header_marquee: string;
  seo_home_title: string;
  seo_home_description: string;
  seo_home_h1: string;
  seo_og_image_url: string;
  updated_at?: string;
};

export type LeadRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  loan_need: string | null;
  asset: string | null;
  status: LeadStatus;
  created_at: string;
};

export type AdminData = {
  news: NewsRow[];
  stores: StoreRow[];
  products: ProductRow[];
  marketing: {
    slides: HeroSlideRow[];
    testimonials: TestimonialRow[];
  };
  leads: LeadRow[];
  settings: SiteSettingsRow;
};
