export interface NewsArticle {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: string[];
}

export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
};

export type ProcessStep = { title: string; desc: string };

export interface LoanProductData {
  slug: string;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  tagline: string;
  description: string;
  maxAmount: string;
  maxTerm: string;
  interestRate: string;
  approvalTime: string;
  benefits: string[];
  conditions: string[];
  documents: string[];
  process: ProcessStep[];
  /** URL ảnh từ CMS (Supabase Storage); null khi chưa gắn */
  image?: string | null;
}

export type RecruitmentPost = {
  title: string;
  excerpt: string;
  location: string;
  type: string;
  deadline: string;
};

export type HeroSlide = {
  image: string;
  alt: string;
  to: string;
};

export type TestimonialItem = {
  name: string;
  role: string;
  text: string;
};

export type SiteSettings = {
  seoHomeTitle?: string;
  seoHomeDescription?: string;
  seoOgImageUrl?: string;
  companyName: string;
  hotline: string;
  foreignPhone: string;
  email: string;
  address: string;
  taxId: string;
  facebook: string;
  zalo: string;
  whatsapp: string;
  headerMarquee: string;
};
