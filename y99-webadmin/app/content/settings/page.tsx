'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { Save } from 'lucide-react';
import { SeoFields } from '@/components/content/SeoFields';
import { ImageField } from '@/components/media/ImageField';
import type { SiteSettingsRow } from '@/lib/cms/types';

export default function SettingsPage() {
  const { data, updateSettings } = useAdminStore();
  const [formData, setFormData] = useState<SiteSettingsRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.settings) setFormData(data.settings);
  }, [data?.settings]);

  if (!data || !formData) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { id: _id, updated_at: _u, ...rest } = formData;
      await updateSettings(rest);
      alert('Đã lưu cấu hình site!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Cài đặt Hệ thống</h2>
          <p className="text-sm text-slate-500 mt-1">Header marquee, footer, hotline — đồng bộ web client.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm text-slate-50 disabled:opacity-50">
          <Save size={16} className="mr-2" />
          {isSaving ? 'Đang lưu…' : 'Lưu lại'}
        </button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <h3 className="font-semibold">Thông tin doanh nghiệp</h3>
        </div>
        <div className="p-6 space-y-4 grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">Tên công ty</label>
            <input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">Địa chỉ trụ sở</label>
            <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Mã số thuế</label>
            <input value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <h3 className="font-semibold">Liên hệ & mạng xã hội</h3>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Hotline</label>
            <input value={formData.hotline} onChange={(e) => setFormData({ ...formData, hotline: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Hotline nước ngoài</label>
            <input value={formData.foreign_phone} onChange={(e) => setFormData({ ...formData, foreign_phone: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Zalo</label>
            <input value={formData.zalo} onChange={(e) => setFormData({ ...formData, zalo: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Facebook</label>
            <input value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">WhatsApp</label>
            <input value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <h3 className="font-semibold">SEO trang chủ</h3>
          <p className="text-sm text-slate-500 mt-1">
            Meta title & description cho trang chủ web client (Google, Facebook, Zalo…).
          </p>
        </div>
        <div className="p-6 space-y-4">
          <SeoFields
            metaTitle={formData.seo_home_title}
            metaDescription={formData.seo_home_description}
            seoH1={formData.seo_home_h1}
            onMetaTitleChange={(seo_home_title) => setFormData({ ...formData, seo_home_title })}
            onMetaDescriptionChange={(seo_home_description) =>
              setFormData({ ...formData, seo_home_description })
            }
            onSeoH1Change={(seo_home_h1) => setFormData({ ...formData, seo_home_h1 })}
            pagePath="/"
            titleFallback="Vay tiền nhanh, tin cậy & chuyên nghiệp"
            h1Fallback="Vay tiền nhanh — Y99 luôn sẵn sàng"
            descriptionFallback="Y99 Finance — giải pháp tài chính linh hoạt, duyệt nhanh, lãi suất minh bạch."
            primaryKeyword="vay tiền nhanh"
          />
          <ImageField
            label="Ảnh OG mặc định (tuỳ chọn)"
            value={formData.seo_og_image_url}
            onChange={(seo_og_image_url) => setFormData({ ...formData, seo_og_image_url })}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <h3 className="font-semibold">Thanh thông báo (marquee)</h3>
        </div>
        <div className="p-6">
          <textarea rows={2} value={formData.header_marquee} onChange={(e) => setFormData({ ...formData, header_marquee: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}
