export type MediaItem = {
  id?: string;
  path: string;
  url: string;
  name: string;
  size: number | null;
  created_at: string | null;
  alt_text?: string;
};
