'use client';

import { useState } from 'react';
import { useAdminStore, type LeadStatus } from '@/lib/store';
import { ChevronDown, Loader2, Mail, Phone, CalendarDays, MapPin } from 'lucide-react';

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

export default function LeadsPage() {
  const { data, updateLeadStatus } = useAdminStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Inbox Đơn Đăng Ký</h2>
        <p className="text-sm text-slate-500 mt-1">
          Leads từ form đăng ký vay, liên hệ và vay online trên website client.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.leads.map((lead) => (
          <div key={lead.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4 gap-2">
              <div>
                <h3 className="font-semibold">{lead.full_name}</h3>
                <p className="text-sm text-slate-500 mt-1">{lead.loan_need ?? '—'}</p>
              </div>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors[lead.status]}`}>
                {statusLabels[lead.status]}
              </span>
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
                className={`relative ${updatingId === lead.id ? 'opacity-70' : ''}`}
                aria-busy={updatingId === lead.id}
              >
                <select
                  id={`lead-status-${lead.id}`}
                  value={lead.status}
                  disabled={updatingId === lead.id}
                  onChange={(e) =>
                    handleStatusChange(lead.id, e.target.value as LeadStatus)
                  }
                  className={`${selectClass} ${statusSelectStyles[lead.status]} ${
                    updatingId === lead.id ? 'cursor-wait' : ''
                  }`}
                >
                  {STATUS_OPTIONS.map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                      {statusLabels[statusValue]}
                    </option>
                  ))}
                </select>
                {updatingId === lead.id ? (
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
        ))}
        {data.leads.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl border border-dashed text-sm text-slate-500">
            Chưa có lead. Khách gửi form trên website sẽ hiện tại đây.
          </div>
        )}
      </div>
    </div>
  );
}
