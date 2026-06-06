'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { cmsApi } from '@/lib/cms/api-client';
import { Modal } from '@/components/Modal';
import { ImageField } from '@/components/media/ImageField';
import { ContentTextarea } from '@/components/media/ContentTextarea';
import {
  Banknote,
  Clock,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Percent,
  Plus,
  Package,
  Trash2,
} from 'lucide-react';
import {
  arrayToLines,
  linesToArray,
  linesToProcess,
  processToLines,
  slugify,
} from '@/lib/cms/helpers';
import { useSortableReorder } from '@/lib/hooks/useSortableReorder';
import { SeoFields } from '@/components/content/SeoFields';
import type { ProductRow } from '@/lib/cms/types';

type ProductSortable = ProductRow & { id: string };

type FormState = Partial<ProductRow> & {
  benefitsText?: string;
  conditionsText?: string;
  documentsText?: string;
  processText?: string;
};

function productPayload(p: ProductRow) {
  return {
    slug: p.slug,
    name: p.name,
    meta_title: p.meta_title ?? '',
    meta_description: p.meta_description ?? '',
    seo_h1: p.seo_h1 ?? '',
    tagline: p.tagline,
    description: p.description,
    max_amount: p.max_amount,
    max_term: p.max_term,
    interest_rate: p.interest_rate,
    approval_time: p.approval_time,
    benefits: p.benefits,
    conditions: p.conditions,
    documents: p.documents,
    process: p.process,
    image_key: p.image_key,
    image_url: p.image_url,
    image_alt: p.image_alt ?? '',
    published: p.published,
    sort_order: p.sort_order,
  };
}

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const textareaClass =
  'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const clientBase = process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:5173';

export default function ProductsPage() {
  const { data, refresh } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const products = useMemo((): ProductSortable[] => {
    if (!data) return [];
    return [...data.products]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({ ...p, id: p.slug }));
  }, [data]);

  const {
    items: orderedProducts,
    draggedId,
    overId,
    onDragStart,
    onDragEnd,
    onDragOver,
    commitDrop,
    isDragging,
  } = useSortableReorder(products);

  const publishedCount = products.filter((p) => p.published).length;

  const persistOrder = async (reordered: ProductSortable[]) => {
    if (!data) return;
    const withOrder = reordered.map((p, i) => ({ ...p, sort_order: i + 1 }));
    const prevMap = new Map(data.products.map((p) => [p.slug, p.sort_order]));
    const changed = withOrder.filter((p) => prevMap.get(p.slug) !== p.sort_order);
    if (changed.length === 0) return;

    setReordering(true);
    try {
      await Promise.all(changed.map((p) => cmsApi.saveProduct(productPayload(p), p.slug)));
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thứ tự thất bại');
      await refresh();
    } finally {
      setReordering(false);
    }
  };

  const handleDrop = (targetId: string) => {
    const next = commitDrop(targetId);
    if (next) void persistOrder(next);
  };

  if (!data) return null;

  const isExisting =
    editing?.slug && data.products.some((p) => p.slug === editing.slug);

  const openEdit = (item?: ProductRow) => {
    setEditing(
      item
        ? {
            ...item,
            benefitsText: arrayToLines(item.benefits),
            conditionsText: arrayToLines(item.conditions),
            documentsText: arrayToLines(item.documents),
            processText: processToLines(item.process),
          }
        : {
            slug: '',
            name: '',
            meta_title: '',
            meta_description: '',
            seo_h1: '',
            tagline: '',
            description: '',
            max_amount: '',
            max_term: '',
            interest_rate: '',
            approval_time: '',
            benefitsText: '',
            conditionsText: '',
            documentsText: '',
            processText: '',
            image_key: '',
            image_url: '',
            image_alt: '',
            published: true,
            sort_order: products.length + 1,
          },
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const slug = editing.slug || slugify(editing.name ?? '');
      const payload = {
        slug,
        name: editing.name,
        meta_title: editing.meta_title ?? '',
        meta_description: editing.meta_description ?? '',
        seo_h1: editing.seo_h1 ?? '',
        tagline: editing.tagline,
        description: editing.description,
        max_amount: editing.max_amount,
        max_term: editing.max_term,
        interest_rate: editing.interest_rate,
        approval_time: editing.approval_time,
        benefits: linesToArray(editing.benefitsText ?? ''),
        conditions: linesToArray(editing.conditionsText ?? ''),
        documents: linesToArray(editing.documentsText ?? ''),
        process: linesToProcess(editing.processText ?? ''),
        image_key: editing.image_key || slug,
        image_url: editing.image_url ?? null,
        image_alt: editing.image_alt ?? '',
        published: editing.published ?? true,
        sort_order: editing.sort_order ?? 0,
      };
      const exists = data.products.some((p) => p.slug === slug);
      if (exists) await cmsApi.saveProduct(payload, slug);
      else await cmsApi.saveProduct(payload);
      setIsModalOpen(false);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Xóa sản phẩm này khỏi website?')) return;
    await cmsApi.deleteProduct(slug);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
            <Package size={16} />
            <span>Gói vay & cầm cố</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sản phẩm Vay</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Quản lý trang chi tiết{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
              /cho-vay-cam-co/[slug]
            </code>{' '}
            trên web client.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openEdit()}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tổng SP</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Đang live</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{publishedCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Xem trên web</p>
          <Link
            href={
              products[0]
                ? `${clientBase}/cho-vay-cam-co/${products[0].slug}`
                : clientBase
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
          >
            Xem sản phẩm
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
            <Package className="text-slate-400" size={28} />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">Chưa có sản phẩm nào</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Thêm gói vay đầu tiên để trang cầm cố hiển thị nội dung từ CMS.
          </p>
          <button
            type="button"
            onClick={() => openEdit()}
            className="mt-6 inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={16} className="mr-2" />
            Tạo sản phẩm đầu tiên
          </button>
        </div>
      ) : (
        <>
          {products.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
              <GripVertical size={16} className="shrink-0 text-slate-400" />
              <span>
                Kéo biểu tượng <strong className="font-medium text-slate-800">≡</strong> trên thẻ để
                sắp xếp thứ tự sản phẩm.
              </span>
              {reordering ? (
                <span className="text-xs font-medium text-sky-700 ml-auto">Đang lưu thứ tự…</span>
              ) : null}
              {isDragging ? (
                <span className="text-xs text-slate-500 ml-auto">Thả lên thẻ đích để đổi vị trí</span>
              ) : null}
            </div>
          )}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 ${reordering ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {orderedProducts.map((item, index) => (
              <article
                key={item.slug}
                onDragOver={(e) => onDragOver(e, item.id)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(item.id);
                }}
                className={`group rounded-xl border bg-white shadow-sm overflow-hidden transition-all hover:shadow-md ${
                  draggedId === item.id
                    ? 'opacity-50 scale-[0.98] border-slate-300'
                    : overId === item.id && draggedId
                      ? 'border-sky-400 ring-2 ring-sky-400/40 ring-offset-2'
                      : 'border-slate-200'
                }`}
              >
                <div className="relative aspect-[16/9] bg-slate-100">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Package size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      draggable={!reordering}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', item.id);
                        onDragStart(item.id);
                      }}
                      onDragEnd={onDragEnd}
                      className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur cursor-grab active:cursor-grabbing touch-none select-none"
                      title="Kéo để sắp xếp"
                    >
                      <GripVertical size={12} className="text-slate-500" />
                      #{index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
                        item.published
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-slate-800/80 text-white'
                      }`}
                    >
                      {item.published ? (
                        <>
                          <Eye size={12} /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> Ẩn
                        </>
                      )}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
                      title="Sửa"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.slug)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-rose-600 shadow hover:bg-rose-50"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {index === 0 && item.published && (
                    <span className="absolute top-3 right-3 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                      Nổi bật
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
                    {item.tagline ? (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.tagline}</p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-slate-50 px-2.5 py-2 border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Banknote size={11} /> Hạn mức
                      </span>
                      <p className="font-medium text-slate-800 mt-0.5 truncate">
                        {item.max_amount || '—'}
                      </p>
                    </div>
                    <div className="rounded-md bg-slate-50 px-2.5 py-2 border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Percent size={11} /> Lãi suất
                      </span>
                      <p className="font-medium text-slate-800 mt-0.5 truncate">
                        {item.interest_rate || '—'}
                      </p>
                    </div>
                    <div className="rounded-md bg-slate-50 px-2.5 py-2 border border-slate-100">
                      <span className="text-slate-500">Kỳ hạn</span>
                      <p className="font-medium text-slate-800 mt-0.5 truncate">
                        {item.max_term || '—'}
                      </p>
                    </div>
                    <div className="rounded-md bg-slate-50 px-2.5 py-2 border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock size={11} /> Duyệt
                      </span>
                      <p className="font-medium text-slate-800 mt-0.5 truncate">
                        {item.approval_time || '—'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`${clientBase}/cho-vay-cam-co/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <span className="truncate max-w-[220px]">/cho-vay-cam-co/{item.slug}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isExisting ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        description="Thông tin chính bên trái — thông số & ảnh bên phải."
        size="xl"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 truncate">
              {editing?.slug ? (
                <>
                  URL:{' '}
                  <span className="font-medium text-slate-700">
                    /cho-vay-cam-co/{editing.slug}
                  </span>
                  {' · '}
                  {editing.published ? (
                    <span className="text-emerald-700">Live trên web</span>
                  ) : (
                    <span className="text-amber-700">Đang ẩn</span>
                  )}
                </>
              ) : (
                'Nhập tên để tạo slug tự động'
              )}
            </p>
            <div className="flex shrink-0 justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-9 px-4 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={saving}
                className="h-9 min-w-[100px] px-4 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Đang lưu…' : 'Lưu sản phẩm'}
              </button>
            </div>
          </div>
        }
      >
        <form
          id="product-form"
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 lg:gap-8 text-sm"
        >
          <div className="min-w-0 space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Thông tin cơ bản
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Tên sản phẩm</label>
                <input
                  required
                  placeholder="Vay bằng cavet xe máy"
                  value={editing?.name ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing!,
                      name: e.target.value,
                      slug: editing?.slug || slugify(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Slug (URL)</label>
                <input
                  required
                  placeholder="vay-tien-bang-cavet-xe-may"
                  value={editing?.slug ?? ''}
                  onChange={(e) => setEditing({ ...editing!, slug: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Tagline</label>
                <input
                  placeholder="Giải ngân nhanh — thủ tục đơn giản"
                  value={editing?.tagline ?? ''}
                  onChange={(e) => setEditing({ ...editing!, tagline: e.target.value })}
                  className={inputClass}
                />
              </div>
              <ContentTextarea
                label="Mô tả sản phẩm"
                value={editing?.description ?? ''}
                onChange={(description) => setEditing({ ...editing!, description })}
                rows={4}
                priorImageCount={editing?.image_url ? 1 : 0}
                altSuggestion={editing?.name ?? ''}
                hint="Mỗi đoạn một dòng. «Chèn ảnh» — 3 ảnh đầu cần alt mô tả + từ khóa."
              />
            </section>

            <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Nội dung chi tiết
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Lợi ích</label>
                <textarea
                  rows={3}
                  placeholder="Mỗi dòng một lợi ích"
                  value={editing?.benefitsText ?? ''}
                  onChange={(e) => setEditing({ ...editing!, benefitsText: e.target.value })}
                  className={textareaClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Điều kiện</label>
                <textarea
                  rows={2}
                  placeholder="Mỗi dòng một điều kiện"
                  value={editing?.conditionsText ?? ''}
                  onChange={(e) => setEditing({ ...editing!, conditionsText: e.target.value })}
                  className={textareaClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Hồ sơ</label>
                <textarea
                  rows={2}
                  placeholder="Mỗi dòng một giấy tờ"
                  value={editing?.documentsText ?? ''}
                  onChange={(e) => setEditing({ ...editing!, documentsText: e.target.value })}
                  className={textareaClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Quy trình</label>
                <textarea
                  rows={4}
                  placeholder="Tiêu đề|Mô tả — mỗi bước một dòng"
                  value={editing?.processText ?? ''}
                  onChange={(e) => setEditing({ ...editing!, processText: e.target.value })}
                  className={textareaClass}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-0 lg:self-start">
            <SeoFields
              metaTitle={editing?.meta_title ?? ''}
              metaDescription={editing?.meta_description ?? ''}
              seoH1={editing?.seo_h1 ?? ''}
              onMetaTitleChange={(meta_title) => setEditing({ ...editing!, meta_title })}
              onMetaDescriptionChange={(meta_description) =>
                setEditing({ ...editing!, meta_description })
              }
              onSeoH1Change={(seo_h1) => setEditing({ ...editing!, seo_h1 })}
              pagePath={
                editing?.slug ? `/cho-vay-cam-co/${editing.slug}` : undefined
              }
              titleFallback={editing?.name}
              h1Fallback={editing?.name}
              descriptionFallback={editing?.tagline || editing?.description?.slice(0, 160)}
              primaryKeyword={editing?.name}
            />

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Thông số vay
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Hạn mức</label>
                <input
                  value={editing?.max_amount ?? ''}
                  onChange={(e) => setEditing({ ...editing!, max_amount: e.target.value })}
                  className={inputClass}
                  placeholder="Đến 500 triệu"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Kỳ hạn</label>
                <input
                  value={editing?.max_term ?? ''}
                  onChange={(e) => setEditing({ ...editing!, max_term: e.target.value })}
                  className={inputClass}
                  placeholder="3–18 tháng"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Lãi suất</label>
                <input
                  value={editing?.interest_rate ?? ''}
                  onChange={(e) => setEditing({ ...editing!, interest_rate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Thời gian duyệt</label>
                <input
                  value={editing?.approval_time ?? ''}
                  onChange={(e) => setEditing({ ...editing!, approval_time: e.target.value })}
                  className={inputClass}
                  placeholder="15–30 phút"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Thứ tự</label>
                <input
                  type="number"
                  min={1}
                  value={editing?.sort_order ?? 1}
                  onChange={(e) =>
                    setEditing({ ...editing!, sort_order: Number(e.target.value) })
                  }
                  className={inputClass}
                />
                <p className="text-xs text-slate-500">
                  Hoặc kéo thả thẻ sản phẩm trên danh sách.
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ảnh sản phẩm
              </h3>
              <ImageField
                label=""
                value={editing?.image_url ?? ''}
                onChange={(image_url) => setEditing({ ...editing!, image_url })}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">
                  Alt text ảnh sản phẩm <span className="text-sky-700 font-normal">(#1)</span>
                </label>
                <input
                  placeholder={`vd. "${editing?.name || 'Vay tiền bằng cà vẹt xe máy'} tại Y99"`}
                  value={editing?.image_alt ?? ''}
                  onChange={(e) => setEditing({ ...editing!, image_alt: e.target.value })}
                  className={inputClass}
                />
              </div>
              {editing?.image_url ? (
                <div className="rounded-md border border-slate-200 overflow-hidden">
                  <div className="aspect-[16/9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editing.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : null}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">image_key (fallback)</label>
                <input
                  value={editing?.image_key ?? ''}
                  onChange={(e) => setEditing({ ...editing!, image_key: e.target.value })}
                  className={inputClass}
                  placeholder="Trùng slug nếu để trống"
                />
              </div>
            </section>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                editing?.published
                  ? 'border-emerald-200 bg-emerald-50/80'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={editing?.published ?? true}
                onChange={(e) => setEditing({ ...editing!, published: e.target.checked })}
                className="accent-slate-900 mt-0.5 h-4 w-4"
              />
              <span>
                <span className="text-sm font-medium text-slate-900 block">Sản phẩm live</span>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  Bật để hiển thị trên website công khai.
                </span>
              </span>
            </label>
          </aside>
        </form>
      </Modal>
    </div>
  );
}
