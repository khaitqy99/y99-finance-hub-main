import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingContactDock from "./FloatingContactDock";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [router.asPath]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-md:pt-[var(--site-header-offset,7rem)]">{children}</main>
      <Footer />
      <FloatingContactDock />
    </div>
  );
};

export default SiteLayout;
