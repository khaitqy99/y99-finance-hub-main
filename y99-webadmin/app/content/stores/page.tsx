'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { cmsApi } from '@/lib/cms/api-client';
import { Modal } from '@/components/Modal';
import {
  Clock,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  MapPin,
  Phone,
  Plus,
  Store,
  Trash2,
} from 'lucide-react';
import { slugify } from '@/lib/cms/helpers';
import { useSortableReorder } from '@/lib/hooks/useSortableReorder';
import type { StoreRow } from '@/lib/cms/types';

function storePayload(s: StoreRow) {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    province: s.province,
    district: s.district,
    phone: s.phone,
    hours: s.hours,
    lat: s.lat,
    lng: s.lng,
    active: s.active,
    sort_order: s.sort_order,
  };
}

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const clientBase = process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:5173';

function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function StoresPage() {
  const { data, refresh } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<StoreRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const stores = useMemo(() => {
    if (!data) return [];
    return [...data.stores].sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  const {
    items: orderedStores,
    draggedId,
    overId,
    onDragStart,
    onDragEnd,
    onDragOver,
    commitDrop,
    isDragging,
  } = useSortableReorder(stores);

  const activeCount = stores.filter((s) => s.active).length;

  const persistOrder = async (reordered: StoreRow[]) => {
    if (!data) return;
    const withOrder = reordered.map((s, i) => ({ ...s, sort_order: i + 1 }));
    const prevMap = new Map(data.stores.map((s) => [s.id, s.sort_order]));
    const changed = withOrder.filter((s) => prevMap.get(s.id) !== s.sort_order);
    if (changed.length === 0) return;

    setReordering(true);
    try {
      await Promise.all(changed.map((s) => cmsApi.saveStore(storePayload(s), s.id)));
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

  const isExisting = editing?.id && data.stores.some((s) => s.id === editing.id);

  const handleEdit = (item?: StoreRow) => {
    setEditing(
      item ?? {
        id: '',
        name: '',
        address: '',
        province: '',
        district: '',
        phone: '1900575792',
        hours: '8:00 - 21:00 (Thứ 2 - Chủ nhật)',
        lat: 10.77,
        lng: 106.7,
        active: true,
        sort_order: stores.length + 1,
      },
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        id:
          editing.id ||
          slugify(`${editing.province}-${editing.district}-${editing.name}`).slice(0, 40),
        name: editing.name,
        address: editing.address,
        province: editing.province,
        district: editing.district,
        phone: editing.phone,
        hours: editing.hours,
        lat: Number(editing.lat),
        lng: Number(editing.lng),
        active: editing.active ?? true,
        sort_order: editing.sort_order ?? 0,
      };
      const isNew = !data.stores.some((s) => s.id === payload.id);
      if (isNew) await cmsApi.saveStore(payload);
      else await cmsApi.saveStore(payload, payload.id);
      setIsModalOpen(false);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa PGD này khỏi hệ thống và bản đồ?')) return;
    await cmsApi.deleteStore(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
            <Store size={16} />
            <span>Điểm giao dịch</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Hệ thống PGD</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Quản lý phòng giao dịch hiển thị trên{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
              /he-thong-cua-hang
            </code>{' '}
            và bản đồ Leaflet. PGD đang bật mới xuất hiện trên web.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleEdit()}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" />
          Thêm PGD
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tổng PGD</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stores.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Đang hiển thị</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Xem trên web</p>
          <Link
            href={`${clientBase}/he-thong-cua-hang`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
          >
            Hệ thống PGD
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {stores.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
            <MapPin className="text-slate-400" size={28} />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">Chưa có PGD nào</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Thêm điểm giao dịch đầu tiên để bản đồ và danh sách trên web client hiển thị từ CMS.
          </p>
          <button
            type="button"
            onClick={() => handleEdit()}
            className="mt-6 inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={16} className="mr-2" />
            Thêm PGD đầu tiên
          </button>
        </div>
      ) : (
        <>
          {stores.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
              <GripVertical size={16} className="shrink-0 text-slate-400" />
              <span>
                Kéo biểu tượng <strong className="font-medium text-slate-800">≡</strong> trên thẻ để
                sắp xếp thứ tự hiển thị trên web.
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
          {orderedStores.map((item, index) => (
            <article
              key={item.id}
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
              <div
                className="relative aspect-[16/9] overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(199 100% 97%) 0%, hsl(210 40% 94%) 50%, hsl(199 60% 88%) 100%)',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500/80 p-4">
                  <MapPin size={36} className="text-sky-600/70" strokeWidth={1.5} />
                  <p className="mt-2 text-xs font-mono text-slate-600">
                    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      item.active
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-slate-800/80 text-white'
                    }`}
                  >
                    {item.active ? (
                      <>
                        <Eye size={12} /> Hiển thị
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Đã ẩn
                      </>
                    )}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={mapsUrl(item.lat, item.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
                    title="Google Maps"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
                    title="Sửa"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-rose-600 shadow hover:bg-rose-50"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {index === 0 && item.active && (
                  <span className="absolute top-3 right-3 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                    Mặc định
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-medium text-slate-900 line-clamp-1">{item.name}</h3>
                <p className="text-xs font-medium text-sky-700">
                  {item.district}, {item.province}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2">{item.address}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Phone size={12} />
                    {item.phone}
                  </span>
                  <span className="inline-flex items-center gap-1 line-clamp-1">
                    <Clock size={12} className="shrink-0" />
                    <span className="truncate max-w-[180px]">{item.hours}</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate" title={item.id}>
                  ID: {item.id}
                </p>
              </div>
            </article>
          ))}
          </div>
        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isExisting ? 'Sửa PGD' : 'Thêm PGD mới'}
        description="Thông tin hiển thị bên trái — mã & tọa độ bản đồ bên phải."
        size="lg"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 truncate">
              {editing?.lat != null && editing?.lng != null ? (
                <>
                  Tọa độ:{' '}
                  <span className="font-mono text-slate-700">
                    {Number(editing.lat).toFixed(5)}, {Number(editing.lng).toFixed(5)}
                  </span>
                  {' · '}
                  {editing.active ? (
                    <span className="text-emerald-700">Hiển thị trên web</span>
                  ) : (
                    <span className="text-amber-700">Đang ẩn</span>
                  )}
                </>
              ) : (
                'Nhập tọa độ để hiển thị trên bản đồ'
              )}
            </p>
            <div className="flex shrink-0 justify-end gap-2">
              {editing?.lat != null && editing?.lng != null ? (
                <a
                  href={mapsUrl(Number(editing.lat), Number(editing.lng))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-md border border-slate-200 bg-white text-sm inline-flex items-center gap-1 hover:bg-slate-50"
                >
                  Maps
                  <ExternalLink size={14} />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-9 px-4 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="store-form"
                disabled={saving}
                className="h-9 min-w-[100px] px-4 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Đang lưu…' : 'Lưu PGD'}
              </button>
            </div>
          </div>
        }
      >
        <form
          id="store-form"
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6 lg:gap-8 text-sm"
        >
          <div className="min-w-0 space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Thông tin PGD
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Tên PGD</label>
                <input
                  required
                  placeholder="PGD Quận 1"
                  value={editing?.name ?? ''}
                  onChange={(e) => setEditing({ ...editing!, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Địa chỉ</label>
                <input
                  required
                  placeholder="Số nhà, đường, phường…"
                  value={editing?.address ?? ''}
                  onChange={(e) => setEditing({ ...editing!, address: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Tỉnh / TP</label>
                  <input
                    required
                    placeholder="TP.HCM"
                    value={editing?.province ?? ''}
                    onChange={(e) => setEditing({ ...editing!, province: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Quận / Huyện</label>
                  <input
                    required
                    placeholder="Quận 1"
                    value={editing?.district ?? ''}
                    onChange={(e) => setEditing({ ...editing!, district: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Điện thoại</label>
                  <input
                    required
                    value={editing?.phone ?? ''}
                    onChange={(e) => setEditing({ ...editing!, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Giờ mở cửa</label>
                  <input
                    required
                    value={editing?.hours ?? ''}
                    onChange={(e) => setEditing({ ...editing!, hours: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-0 lg:self-start">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Mã & bản đồ
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Mã PGD (id)</label>
                <input
                  required
                  disabled={!!isExisting}
                  placeholder="hcm-q1-pgd-1"
                  value={editing?.id ?? ''}
                  onChange={(e) => setEditing({ ...editing!, id: e.target.value })}
                  className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-500`}
                />
                <p className="text-xs text-slate-500">Tự tạo từ tên + khu vực nếu để trống khi thêm mới.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Vĩ độ (lat)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editing?.lat ?? 0}
                    onChange={(e) => setEditing({ ...editing!, lat: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Kinh độ (lng)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editing?.lng ?? 0}
                    onChange={(e) => setEditing({ ...editing!, lng: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
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
                  Hoặc kéo thả thẻ PGD trên danh sách để đổi thứ tự.
                </p>
              </div>
            </section>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                editing?.active
                  ? 'border-emerald-200 bg-emerald-50/80'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={editing?.active ?? true}
                onChange={(e) => setEditing({ ...editing!, active: e.target.checked })}
                className="accent-slate-900 mt-0.5 h-4 w-4"
              />
              <span>
                <span className="text-sm font-medium text-slate-900 block">Hiển thị trên website</span>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  Bật để PGD xuất hiện trên bản đồ và danh sách công khai.
                </span>
              </span>
            </label>
          </aside>
        </form>
      </Modal>
    </div>
  );
}
