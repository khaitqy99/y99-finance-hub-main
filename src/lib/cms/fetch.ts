import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type {
  HeroSlide,
  LoanProductData,
  NewsArticle,
  RecruitmentPost,
  SiteSettings,
  StoreLocation,
  TestimonialItem,
} from '@/lib/cms/types';
import { newsArticles as fallbackNews } from '@/data/newsArticles';
import { storeLocations as fallbackStores } from '@/data/storeLocations';
import { loanProducts as fallbackProducts } from '@/data/loanProducts';

const defaultSettings: SiteSettings = {
  companyName: 'CÔNG TY CỔ PHẦN CẦM ĐỒ Y99',
  hotline: '1900575792',
  foreignPhone: '+84 292 38 999 33',
  email: 'cskh@y99.vn',
  address: '99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ',
  taxId: '',
  facebook: '',
  zalo: '',
  whatsapp: '',
  headerMarquee:
    'Y99 hỗ trợ cầm đồ uy tín, cung cấp dịch vụ cầm đồ online minh bạch, an toàn, tiện lợi - linh hoạt, không giới hạn khoảng cách.',
};

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackNews;

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('published', true)
    .order('sort_order');

  if (error || !data?.length) return fallbackNews;

  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
    excerpt: row.excerpt,
    date: row.date_display,
    category: row.category,
    image: row.image_url ?? '',
    content: Array.isArray(row.content) ? row.content : [],
  }));
}

export async function fetchStoreLocations(): Promise<StoreLocation[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackStores;

  const { data, error } = await supabase
    .from('store_locations')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error || !data?.length) return fallbackStores;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    province: row.province,
    district: row.district,
    phone: row.phone,
    hours: row.hours,
    lat: row.lat,
    lng: row.lng,
  }));
}

export async function fetchLoanProducts(): Promise<Record<string, LoanProductData>> {
  const supabase = getSupabase();
  if (!supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from('loan_products')
    .select('*')
    .eq('published', true)
    .order('sort_order');

  if (error || !data?.length) return fallbackProducts;

  const map: Record<string, LoanProductData> = {};
  for (const row of data) {
    map[row.slug] = {
      slug: row.slug,
      name: row.name,
      metaTitle: row.meta_title || undefined,
      metaDescription: row.meta_description || undefined,
      tagline: row.tagline,
      description: row.description,
      maxAmount: row.max_amount,
      maxTerm: row.max_term,
      interestRate: row.interest_rate,
      approvalTime: row.approval_time,
      benefits: row.benefits ?? [],
      conditions: row.conditions ?? [],
      documents: row.documents ?? [],
      process: row.process ?? [],
      image: row.image_url ?? null,
    };
  }
  return Object.keys(map).length ? map : fallbackProducts;
}

export async function fetchRecruitmentPosts(): Promise<RecruitmentPost[]> {
  const supabase = getSupabase();
  const fallback: RecruitmentPost[] = [
    {
      title: 'Chuyên viên tư vấn tài chính',
      excerpt:
        'Tư vấn giải pháp tài chính phù hợp, hỗ trợ khách hàng hoàn thiện hồ sơ và đồng hành xuyên suốt quá trình giải ngân.',
      location: 'Cần Thơ',
      type: 'Toàn thời gian',
      deadline: '31/05/2026',
    },
    {
      title: 'Nhân viên chăm sóc khách hàng',
      excerpt:
        'Tiếp nhận, hỗ trợ và xử lý phản hồi khách hàng đa kênh, đảm bảo trải nghiệm dịch vụ minh bạch và hài lòng.',
      location: 'TP. Hồ Chí Minh',
      type: 'Toàn thời gian',
      deadline: '05/06/2026',
    },
    {
      title: 'Chuyên viên phát triển kinh doanh',
      excerpt:
        'Mở rộng mạng lưới đối tác, triển khai hoạt động thị trường tại khu vực phụ trách và thúc đẩy hiệu quả tăng trưởng.',
      location: 'Hà Nội',
      type: 'Toàn thời gian',
      deadline: '10/06/2026',
    },
  ];

  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from('recruitment_jobs')
    .select('*')
    .eq('published', true)
    .order('sort_order');

  if (error || !data?.length) return fallback;

  return data.map((row) => ({
    title: row.title,
    excerpt: row.excerpt,
    location: row.location,
    type: row.job_type,
    deadline: row.deadline,
  }));
}

export async function fetchHeroSlides(): Promise<HeroSlide[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error || !data?.length) return null;

  return data.map((row) => ({
    image: row.image_url ?? '',
    alt: row.alt_text || row.title,
    to: row.link_to,
  }));
}

export async function fetchTestimonials(): Promise<TestimonialItem[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error || !data?.length) return null;

  return data.map((row) => ({
    name: row.author,
    role: row.role,
    text: row.content,
  }));
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (!supabase) return defaultSettings;

  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();

  if (error || !data) return defaultSettings;

  return {
    seoHomeTitle: data.seo_home_title || undefined,
    seoHomeDescription: data.seo_home_description || undefined,
    seoOgImageUrl: data.seo_og_image_url || undefined,
    companyName: data.company_name,
    hotline: data.hotline,
    foreignPhone: data.foreign_phone,
    email: data.email,
    address: data.address,
    taxId: data.tax_id,
    facebook: data.facebook,
    zalo: data.zalo,
    whatsapp: data.whatsapp,
    headerMarquee: data.header_marquee,
  };
}

export async function submitLead(payload: {
  full_name: string;
  phone: string;
  email?: string;
  city?: string;
  district?: string;
  loan_need?: string;
  asset?: string;
}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase chưa cấu hình');
  }
  const supabase = getSupabase()!;
  const { error } = await supabase.from('leads').insert(payload);
  if (error) throw error;
}
