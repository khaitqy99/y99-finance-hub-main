'use client';

import { useMemo, useState } from 'react';
import { Modal } from '@/components/Modal';
import { useAdminStore, type LeadStatus } from '@/lib/store';
import type { LeadRow } from '@/lib/cms/types';
import {
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Trash2,
  Search,
  X,
} from 'lucide-react';

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'closed'];

const statusLabels: Record<LeadStatus, string> = {
  new: 'Lead Mới',
  contacted: 'Đã Liên Hệ',
  closed: 'Đã Chốt',
};

const selectClass =
  'h-9 w-full appearance-none rounded-md border px-3 pr-9 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:opacity-60';

const statusSelectStyles: Record<LeadStatus, string> = {
  new: 'border-slate-200 bg-white text-slate-900',
  contacted: 'border-slate-200 bg-slate-100 text-slate-800',
  closed: 'border-slate-800 bg-slate-900 text-white',
};

const checkboxClass =
  'h-4 w-4 shrink-0 rounded border-slate-300 text-slate-900 accent-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const filterControlClass =
  'h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

type LeadSource = 'all' | 'loan' | 'contact' | 'online';
type DatePreset = 'all' | 'today' | '7d' | '30d' | 'custom';

const sourceLabels: Record<Exclude<LeadSource, 'all'>, string> = {
  loan: 'Đăng ký vay',
  contact: 'Liên hệ',
  online: 'Vay online',
};

function getLeadSource(lead: LeadRow): Exclude<LeadSource, 'all'> {
  const need = lead.loan_need ?? '';
  if (need.startsWith('[Liên hệ]')) return 'contact';
  if (need.startsWith('[Vay online]')) return 'online';
  return 'loan';
}

function matchesDate(iso: string, preset: DatePreset, fromDate: string, toDate: string) {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return false;
  if (preset === 'all') return true;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  if (preset === 'today') return time >= startOfToday;
  if (preset === '7d') return time >= startOfToday - 6 * 24 * 60 * 60 * 1000;
  if (preset === '30d') return time >= startOfToday - 29 * 24 * 60 * 60 * 1000;

  if (fromDate) {
    const from = new Date(`${fromDate}T00:00:00`).getTime();
    if (time < from) return false;
  }
  if (toDate) {
    const to = new Date(`${toDate}T23:59:59.999`).getTime();
    if (time > to) return false;
  }
  return true;
}

export default function LeadsPage() {
  const { data, updateLeadStatus, deleteLeads } = useAdminStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const leads = data?.leads ?? [];
  const cities = useMemo(() => {
    const unique = new Set<string>();
    for (const lead of leads) {
      const city = lead.city?.trim();
      if (city) unique.add(city);
    }
    return [...unique].sort((a, b) => a.localeCompare(b, 'vi'));
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && getLeadSource(lead) !== sourceFilter) return false;
      if (cityFilter !== 'all' && (lead.city ?? '') !== cityFilter) return false;
      if (!matchesDate(lead.created_at, datePreset, fromDate, toDate)) return false;
      if (!needle) return true;
      const haystack = [
        lead.full_name,
        lead.phone,
        lead.email ?? '',
        lead.city ?? '',
        lead.district ?? '',
        lead.loan_need ?? '',
        lead.asset ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [leads, query, statusFilter, sourceFilter, cityFilter, datePreset, fromDate, toDate]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const visibleSelectedIds = useMemo(
    () => filteredLeads.filter((lead) => selectedSet.has(lead.id)).map((lead) => lead.id),
    [filteredLeads, selectedSet],
  );
  const allSelected = filteredLeads.length > 0 && visibleSelectedIds.length === filteredLeads.length;
  const filtersActive =
    query.trim() !== '' ||
    statusFilter !== 'all' ||
    sourceFilter !== 'all' ||
    cityFilter !== 'all' ||
    datePreset !== 'all' ||
    fromDate !== '' ||
    toDate !== '';

  const statusCounts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((lead) => lead.status === 'new').length,
      contacted: leads.filter((lead) => lead.status === 'contacted').length,
      closed: leads.filter((lead) => lead.status === 'closed').length,
    }),
    [leads],
  );

  const pendingLeads = useMemo(
    () => (pendingIds ? leads.filter((lead) => pendingIds.includes(lead.id)) : []),
    [leads, pendingIds],
  );

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    setUpdatingId(leadId);
    try {
      await updateLeadStatus(leadId, status);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cập nhật trạng thái thất bại');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleAll = () => {
    const visibleIds = filteredLeads.map((lead) => lead.id);
    setSelectedIds((current) => {
      if (allSelected) return current.filter((id) => !visibleIds.includes(id));
      return [...new Set([...current, ...visibleIds])];
    });
  };

  const resetFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setSourceFilter('all');
    setCityFilter('all');
    setDatePreset('all');
    setFromDate('');
    setToDate('');
  };

  const openDeleteModal = (ids: string[]) => {
    if (ids.length === 0) return;
    setPendingIds(ids);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setPendingIds(null);
  };

  const confirmDelete = async () => {
    if (!pendingIds?.length) return;
    setDeleting(true);
    try {
      await deleteLeads(pendingIds);
      setSelectedIds((current) => current.filter((id) => !pendingIds.includes(id)));
      setPendingIds(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Xóa lead thất bại');
    } finally {
      setDeleting(false);
    }
  };

  if (!data) return null;

  const statusColors = {
    new: 'bg-white text-slate-900 border-slate-200',
    contacted: 'bg-slate-100 text-slate-700 border-transparent',
    closed: 'bg-slate-900 text-slate-50 border-transparent',
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Inbox Đơn Đăng Ký</h2>
          <p className="text-sm text-slate-500 mt-1">
            Leads từ form đăng ký vay, liên hệ và vay online trên website client.
          </p>
        </div>
        {filteredLeads.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={allSelected}
                onChange={toggleAll}
              />
              {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </label>
            <button
              type="button"
              disabled={visibleSelectedIds.length === 0}
              onClick={() => openDeleteModal(visibleSelectedIds)}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-rose-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={14} />
              Xóa đã chọn{visibleSelectedIds.length > 0 ? ` (${visibleSelectedIds.length})` : ''}
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900">Bộ lọc</p>
          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <X size={12} />
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {([
            ['all', 'Tất cả'],
            ['new', 'Lead mới'],
            ['contacted', 'Đã liên hệ'],
            ['closed', 'Đã chốt'],
          ] as const).map(([value, label]) => {
            const active = statusFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
                <span className={active ? 'text-slate-300' : 'text-slate-400'}>
                  {statusCounts[value]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Tìm kiếm</span>
            <Search size={14} className="pointer-events-none absolute left-3 top-[38px] text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tên, SĐT, email, nhu cầu…"
              className={`${filterControlClass} pl-8`}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Nguồn</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as LeadSource)}
              className={filterControlClass}
            >
              <option value="all">Tất cả nguồn</option>
              <option value="loan">{sourceLabels.loan}</option>
              <option value="contact">{sourceLabels.contact}</option>
              <option value="online">{sourceLabels.online}</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Tỉnh / thành</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className={filterControlClass}
            >
              <option value="all">Tất cả khu vực</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Thời gian</span>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value as DatePreset)}
              className={filterControlClass}
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="7d">7 ngày gần đây</option>
              <option value="30d">30 ngày gần đây</option>
              <option value="custom">Khoảng ngày</option>
            </select>
          </label>
        </div>

        {datePreset === 'custom' && (
          <div className="grid gap-3 sm:grid-cols-2 lg:max-w-lg">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Từ ngày</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={filterControlClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Đến ngày</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={filterControlClass}
              />
            </label>
          </div>
        )}

        <p className="text-xs text-slate-500">
          Hiển thị <span className="font-medium text-slate-800">{filteredLeads.length}</span>
          {' / '}
          {leads.length} lead
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            selected={selectedSet.has(lead.id)}
            updating={updatingId === lead.id}
            statusColors={statusColors}
            formatDate={formatDate}
            onToggle={() => toggleOne(lead.id)}
            onStatusChange={handleStatusChange}
            onDelete={() => openDeleteModal([lead.id])}
          />
        ))}
        {leads.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl border border-dashed text-sm text-slate-500">
            Chưa có lead. Khách gửi form trên website sẽ hiện tại đây.
          </div>
        )}
        {leads.length > 0 && filteredLeads.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl border border-dashed text-sm text-slate-500">
            Không có lead khớp bộ lọc.
            <button
              type="button"
              onClick={resetFilters}
              className="ml-2 font-medium text-slate-800 underline underline-offset-2"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(pendingIds?.length)}
        onClose={closeDeleteModal}
        title="Xác nhận xóa lead"
        description={
          pendingLeads.length === 1
            ? `Xóa lead “${pendingLeads[0].full_name}”? Thao tác này không hoàn tác.`
            : `Xóa ${pendingLeads.length} lead đã chọn? Thao tác này không hoàn tác.`
        }
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              className="h-9 px-4 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-100 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              disabled={deleting}
              className="inline-flex h-9 min-w-[108px] items-center justify-center gap-2 rounded-md bg-rose-600 px-4 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {deleting ? 'Đang xóa…' : pendingLeads.length > 1 ? `Xóa ${pendingLeads.length} lead` : 'Xóa lead'}
            </button>
          </div>
        }
      >
        {pendingLeads.length > 1 && (
          <ul className="max-h-56 space-y-2 overflow-y-auto text-sm text-slate-700">
            {pendingLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-900">{lead.full_name}</span>
                <span className="shrink-0 text-slate-500">{lead.phone}</span>
              </li>
            ))}
          </ul>
        )}
        {pendingLeads.length === 1 && (
          <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{pendingLeads[0].full_name}</p>
            <p className="mt-1">{pendingLeads[0].phone}</p>
            {pendingLeads[0].loan_need ? <p className="mt-1">{pendingLeads[0].loan_need}</p> : null}
          </div>
        )}
      </Modal>
    </div>
  );
}

function LeadCard({
  lead,
  selected,
  updating,
  statusColors,
  formatDate,
  onToggle,
  onStatusChange,
  onDelete,
}: {
  lead: LeadRow;
  selected: boolean;
  updating: boolean;
  statusColors: Record<LeadStatus, string>;
  formatDate: (iso: string) => string;
  onToggle: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-xl border bg-white shadow-sm p-6 flex flex-col ${
        selected ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
      }`}
    >
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <input
            type="checkbox"
            className={`${checkboxClass} mt-1`}
            checked={selected}
            onChange={onToggle}
            aria-label={`Chọn lead ${lead.full_name}`}
          />
          <div className="min-w-0">
            <h3 className="font-semibold">{lead.full_name}</h3>
            <p className="text-sm text-slate-500 mt-1">{lead.loan_need ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors[lead.status]}`}>
            {statusLabels[lead.status]}
          </span>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            title="Xóa lead"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 text-sm mb-6 text-slate-600 flex-1">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400" />
          <a href={`tel:${lead.phone}`} className="hover:text-slate-900 font-medium">{lead.phone}</a>
        </div>
        {lead.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-slate-400" />
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </div>
        )}
        {(lead.city || lead.district) && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400" />
            <span>{[lead.district, lead.city].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {lead.asset && (
          <p className="text-xs">
            <span className="font-medium">
              {lead.loan_need?.startsWith("[Liên hệ]") ? "Nội dung:" : "Tài sản:"}
            </span>{" "}
            {lead.asset}
          </p>
        )}
        <div className="flex items-center gap-2 text-slate-500">
          <CalendarDays size={14} className="text-slate-400" />
          <span>{formatDate(lead.created_at)}</span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <label
          htmlFor={`lead-status-${lead.id}`}
          className="text-xs font-medium text-slate-500 mb-2 block"
        >
          Trạng thái
        </label>
        <div
          className={`relative ${updating ? 'opacity-70' : ''}`}
          aria-busy={updating}
        >
          <select
            id={`lead-status-${lead.id}`}
            value={lead.status}
            disabled={updating}
            onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
            className={`${selectClass} ${statusSelectStyles[lead.status]} ${updating ? 'cursor-wait' : ''}`}
          >
            {STATUS_OPTIONS.map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusLabels[statusValue]}
              </option>
            ))}
          </select>
          {updating ? (
            <Loader2
              size={16}
              className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin ${
                lead.status === 'closed' ? 'text-slate-300' : 'text-sky-600'
              }`}
              aria-hidden
            />
          ) : (
            <ChevronDown
              size={16}
              className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 ${
                lead.status === 'closed' ? 'text-slate-300' : 'text-slate-500'
              }`}
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );
}
