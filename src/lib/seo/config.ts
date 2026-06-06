import type { LoanProductData, NewsArticle, SiteSettings } from "@/lib/cms/types";
import { normalizeMetaDescription, pickMetaDescription } from "@/lib/seo/helpers";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo/site";

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const BRAND_SUFFIX = ` | ${SITE_NAME}`;

function pageTitle(main: string): string {
  return main.includes(SITE_NAME) ? main : `${main}${BRAND_SUFFIX}`;
}

function resolveTitle(custom: string | undefined, fallbackMain: string): string {
  const main = custom?.trim() || fallbackMain;
  return pageTitle(main);
}

function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export const staticSeo = {
  home: {
    title: pageTitle("Vay tiền nhanh, tin cậy & chuyên nghiệp"),
    description:
      "Y99 Finance — giải pháp tài chính linh hoạt: vay theo lương, vay bằng cà vẹt xe máy, ô tô, iCloud. Duyệt nhanh trong 15 phút, lãi suất minh bạch.",
    path: "/",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  about: {
    title: pageTitle("Về Y99"),
    description:
      "Tìm hiểu Y99 Finance — nền tảng cầm đồ minh bạch, uy tín với hơn 800+ phòng giao dịch trên toàn quốc.",
    path: "/ve-y99",
  },
  contact: {
    title: pageTitle("Liên hệ"),
    description: "Liên hệ Y99 Finance — hotline 1900575792, email cskh@y99.vn. Tư vấn vay nhanh, hỗ trợ 24/7.",
    path: "/lien-he",
  },
  stores: {
    title: pageTitle("Hệ thống cửa hàng"),
    description: "Tra cứu phòng giao dịch Y99 trên toàn quốc — địa chỉ, giờ làm việc, hotline từng chi nhánh.",
    path: "/he-thong-cua-hang",
  },
  news: {
    title: pageTitle("Bản tin Y99"),
    description: "Tin tức, sự kiện và cẩm nang vay vốn mới nhất từ Y99 Finance.",
    path: "/ban-tin",
  },
  vayOnline: {
    title: pageTitle("Vay tiền online"),
    description:
      "Vay cầm cố trả góp online tại Y99 — xe máy, ô tô, iCloud. Lãi suất minh bạch, duyệt nhanh, thủ tục đơn giản.",
    path: "/vay-tien-online",
  },
  dangKy: {
    title: pageTitle("Đăng ký vay ngay"),
    description: "Đăng ký vay tại Y99 — để lại thông tin, chuyên viên tư vấn liên hệ trong thời gian sớm nhất.",
    path: "/dang-ky-vay-ngay",
  },
  recruitment: {
    title: pageTitle("Tuyển dụng"),
    description: "Cơ hội nghề nghiệp tại Y99 Finance — tuyển dụng chuyên viên tư vấn, CSKH, kinh doanh.",
    path: "/tuyen-dung",
  },
  privacy: {
    title: pageTitle("Chính sách bảo mật"),
    description: "Chính sách xử lý và bảo mật dữ liệu cá nhân của Y99 Finance theo quy định pháp luật Việt Nam.",
    path: "/chinh-sach-bao-mat",
  },
  interestFee: {
    title: pageTitle("Chính sách lãi suất & phí dịch vụ"),
    description: "Chính sách lãi suất và phí dịch vụ vay tại Y99 — minh bạch, công khai trên hợp đồng.",
    path: "/chinh-sach-lai-suat-phi-dich-vu",
  },
  disclaimer: {
    title: pageTitle("Tuyên bố miễn trừ trách nhiệm"),
    description: "Tuyên bố miễn trừ trách nhiệm khi sử dụng website và dịch vụ tại y99.vn.",
    path: "/tuyen-bo-mien-tru-trach-nhiem",
  },
  notFound: {
    title: pageTitle("Không tìm thấy trang"),
    description: "Trang bạn tìm không tồn tại trên Y99 Finance.",
    path: "/404",
    noindex: true,
  },
} satisfies Record<string, PageSeo>;

/** Trang chủ — ưu tiên SEO từ Cài đặt Site (CMS). */
export function homeSeo(settings?: SiteSettings): PageSeo {
  const base = staticSeo.home;
  const description = pickMetaDescription(
    settings?.seoHomeDescription,
    base.description,
  );
  return {
    title: resolveTitle(settings?.seoHomeTitle, "Vay tiền nhanh, tin cậy & chuyên nghiệp"),
    description: description || base.description,
    path: base.path,
    ogImage: settings?.seoOgImageUrl || base.ogImage,
    ogType: base.ogType ?? "website",
  };
}

export function productSeo(data: LoanProductData): PageSeo {
  const path = `/cho-vay-cam-co/${data.slug}`;
  const description =
    pickMetaDescription(data.metaDescription, data.tagline, data.description) ||
    normalizeMetaDescription(data.name);
  return {
    title: resolveTitle(data.metaTitle, data.name),
    description,
    path,
    ogType: "website",
    ogImage: data.image || DEFAULT_OG_IMAGE,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        name: data.name,
        description,
        url: absoluteUrl(path),
        provider: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
      },
      breadcrumbJsonLd([
        { name: "Trang chủ", path: "/" },
        { name: "Cho vay cầm cố", path: "/vay-tien-online" },
        { name: data.name },
      ]),
    ],
  };
}

export function articleSeo(article: NewsArticle): PageSeo {
  const path = `/ban-tin/${article.slug}`;
  const description =
    pickMetaDescription(article.metaDescription, article.excerpt, article.title) ||
    normalizeMetaDescription(article.title);
  return {
    title: resolveTitle(article.metaTitle, article.title),
    description,
    path,
    ogImage: article.image || DEFAULT_OG_IMAGE,
    ogType: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description,
        image: article.image,
        datePublished: article.date,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE },
        },
        mainEntityOfPage: absoluteUrl(path),
      },
      breadcrumbJsonLd([
        { name: "Trang chủ", path: "/" },
        { name: "Bản tin", path: "/ban-tin" },
        { name: article.title },
      ]),
    ],
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  telephone: "1900575792",
  email: "cskh@y99.vn",
  address: {
    "@type": "PostalAddress",
    streetAddress: "99B Nguyễn Trãi",
    addressLocality: "Ninh Kiều",
    addressRegion: "Cần Thơ",
    addressCountry: "VN",
  },
  areaServed: { "@type": "Country", name: "Vietnam" },
  sameAs: [] as string[],
};
