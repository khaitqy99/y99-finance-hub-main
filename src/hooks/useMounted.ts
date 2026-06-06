import { useEffect, useState } from "react";

/** True after the first client paint — avoids SSR/client DOM mismatches for client-only widgets. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
