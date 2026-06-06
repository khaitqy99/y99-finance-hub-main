'use client';

import { useCallback, useEffect, useState } from 'react';
import { Modal } from '@/components/Modal';
import { usersApi } from '@/lib/users/api-client';
import type { AdminUserRow } from '@/lib/users/types';
import { Edit2, Plus, Trash2, UserCheck, UserX } from 'lucide-react';

type FormState = {
  id?: string;
  email: string;
  display_name: string;
  password: string;
  is_active: boolean;
};

const emptyForm = (): FormState => ({
  email: '',
  display_name: '',
  password: '',
  is_active: true,
});

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

function userInitials(name: string, email: string) {
  const source = (name || email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Tải danh sách thất bại');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const openCreate = () => {
    setEditing(emptyForm());
    setIsModalOpen(true);
  };

  const openEdit = (user: AdminUserRow) => {
    setEditing({
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      password: '',
      is_active: user.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await usersApi.update(editing.id, {
          display_name: editing.display_name,
          is_active: editing.is_active,
          ...(editing.password ? { password: editing.password } : {}),
        });
      } else {
        if (!editing.password) {
          alert('Vui lòng nhập mật khẩu cho tài khoản mới');
          return;
        }
        await usersApi.create({
          email: editing.email,
          password: editing.password,
          display_name: editing.display_name,
        });
      }
      setIsModalOpen(false);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminUserRow) => {
    if (!confirm(`Xóa tài khoản ${user.email}?`)) return;
    try {
      await usersApi.delete(user.id);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
      : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Quản lý người dùng</h2>
          <p className="text-sm text-slate-500 mt-1">
            Tài khoản đăng nhập admin. Chưa có phân quyền — mọi user đều truy cập đầy đủ.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm text-slate-50"
        >
          <Plus size={16} className="mr-2" /> Thêm người dùng
        </button>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden text-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="h-10 px-4 text-left">Tên hiển thị</th>
              <th className="h-10 px-4 text-left">Email</th>
              <th className="h-10 px-4 text-left">Trạng thái</th>
              <th className="h-10 px-4 text-left">Đăng nhập gần nhất</th>
              <th className="h-10 px-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Chưa có người dùng. Thêm tài khoản đầu tiên hoặc tạo user trong Supabase Auth.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="p-4 font-medium">{user.display_name || '—'}</td>
                  <td className="p-4 text-slate-600">{user.email}</td>
                  <td className="p-4">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <UserCheck size={12} /> Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        <UserX size={12} /> Vô hiệu
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">{formatDate(user.last_sign_in_at)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openEdit(user)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 text-rose-600 ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing?.id ? 'Sửa người dùng' : 'Thêm người dùng'}
        description={
          editing?.id
            ? 'Cập nhật tên hiển thị, mật khẩu hoặc trạng thái tài khoản.'
            : 'Tạo tài khoản admin mới — mọi user hiện có quyền truy cập đầy đủ CMS.'
        }
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              {editing?.id ? (
                editing.is_active ? (
                  <>
                    <span className="font-medium text-emerald-700">Đang hoạt động</span>
                    {' · '}
                    Có thể đăng nhập admin portal
                  </>
                ) : (
                  <>
                    <span className="font-medium text-amber-700">Đã vô hiệu hóa</span>
                    {' · '}
                    Không thể đăng nhập cho đến khi bật lại
                  </>
                )
              ) : (
                'Mật khẩu tối thiểu 8 ký tự · Email không đổi sau khi tạo'
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
                form="user-form"
                disabled={saving}
                className="h-9 min-w-[100px] px-4 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Đang lưu…' : editing?.id ? 'Lưu thay đổi' : 'Tạo tài khoản'}
              </button>
            </div>
          </div>
        }
      >
        <form id="user-form" onSubmit={handleSave} className="space-y-6 text-sm">
          {editing?.id ? (
            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {userInitials(editing.display_name, editing.email)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">
                  {editing.display_name || editing.email.split('@')[0]}
                </p>
                <p className="truncate text-sm text-slate-500">{editing.email}</p>
              </div>
              {editing.is_active ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <UserCheck size={12} />
                  Hoạt động
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-600">
                  <UserX size={12} />
                  Vô hiệu
                </span>
              )}
            </div>
          ) : null}

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Thông tin tài khoản
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="user-email" className="text-sm font-medium text-slate-900">
                  Email đăng nhập
                </label>
                <input
                  id="user-email"
                  required
                  disabled={Boolean(editing?.id)}
                  placeholder="admin@y99.vn"
                  type="email"
                  autoComplete="email"
                  value={editing?.email ?? ''}
                  onChange={(e) => setEditing({ ...editing!, email: e.target.value })}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500`}
                />
                {editing?.id ? (
                  <p className="text-xs text-slate-500">Email gắn với tài khoản Supabase, không thể đổi.</p>
                ) : null}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="user-display-name" className="text-sm font-medium text-slate-900">
                  Tên hiển thị
                </label>
                <input
                  id="user-display-name"
                  placeholder="VD: Nguyễn Văn Admin"
                  autoComplete="name"
                  value={editing?.display_name ?? ''}
                  onChange={(e) => setEditing({ ...editing!, display_name: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {editing?.id ? 'Đổi mật khẩu' : 'Mật khẩu'}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {editing?.id
                  ? 'Để trống nếu không muốn thay đổi mật khẩu hiện tại.'
                  : 'Dùng mật khẩu mạnh — tối thiểu 8 ký tự.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="user-password" className="text-sm font-medium text-slate-900">
                {editing?.id ? 'Mật khẩu mới' : 'Mật khẩu'}
              </label>
              <input
                id="user-password"
                placeholder={editing?.id ? '••••••••' : 'Nhập mật khẩu'}
                type="password"
                required={!editing?.id}
                autoComplete={editing?.id ? 'new-password' : 'new-password'}
                minLength={editing?.id ? undefined : 8}
                value={editing?.password ?? ''}
                onChange={(e) => setEditing({ ...editing!, password: e.target.value })}
                className={inputClass}
              />
            </div>
          </section>

          {editing?.id ? (
            <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Trạng thái tài khoản</p>
                  <p className="text-xs text-slate-500">
                    Tắt để chặn đăng nhập mà không xóa tài khoản.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editing.is_active}
                  onClick={() => setEditing({ ...editing, is_active: !editing.is_active })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                    editing.is_active ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                      editing.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </section>
          ) : null}
        </form>
      </Modal>
    </div>
  );
}
