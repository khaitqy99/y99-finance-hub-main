export type AdminUserRow = {
  id: string;
  email: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};
