import type { ReactNode } from "react";
import { useMounted } from "@/hooks/useMounted";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

/** Renders children only after hydration so SSR markup stays identical on first client paint. */
export function ClientOnly({ children, fallback = null }: Props) {
  const mounted = useMounted();
  return mounted ? children : fallback;
}
