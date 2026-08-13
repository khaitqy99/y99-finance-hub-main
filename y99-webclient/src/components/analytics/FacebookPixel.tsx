import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FB_PIXEL_ID } from "@/lib/analytics/fb-pixel";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function FacebookPixel() {
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = () => {
      window.fbq?.("track", "PageView");
    };

    router.events.on("routeChangeComplete", onRouteChange);
    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [router.events]);

  return (
    <Script id="facebook-pixel" strategy="afterInteractive">
      {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');
      `}
    </Script>
  );
}
