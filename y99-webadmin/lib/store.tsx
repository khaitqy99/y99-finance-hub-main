'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cmsApi } from '@/lib/cms/api-client';
import type { AdminData, LeadStatus, SiteSettingsRow } from '@/lib/cms/types';

export type { LeadStatus };

interface AdminContextProps {
  data: AdminData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateSettings: (settings: Partial<SiteSettingsRow>) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
}

const AdminContext = createContext<AdminContextProps | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const next = await cmsApi.loadAll();
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const updateSettings = async (settings: Partial<SiteSettingsRow>) => {
    await cmsApi.saveSettings(settings);
    await refresh();
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    await cmsApi.updateLeadStatus(id, status);
    await refresh();
  };

  return (
    <AdminContext.Provider value={{ data, loading, error, refresh, updateSettings, updateLeadStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminStore() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdminStore must be used within AdminProvider');
  return context;
}
