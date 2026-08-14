import { useRouter } from "next/router";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Đẩy pageview khi đổi route (SPA). Script GTM nằm trong `_document` Head. */
export function GoogleTagManager() {
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = (url: string) => {
      window.dataLayer?.push({
        event: "pageview",
        page: url,
      });
    };

    router.events.on("routeChangeComplete", onRouteChange);
    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [router.events]);

  return null;
}
