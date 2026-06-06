import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/site/SiteLayout";
import { CmsProvider, type CmsInitialState } from "@/context/CmsContext";

const Sonner = dynamic(() => import("@/components/ui/sonner").then((m) => m.Toaster), { ssr: false });

const queryClient = new QueryClient();

interface AppShellProps {
  children?: ReactNode;
  withLayout?: boolean;
  cmsInitial?: CmsInitialState;
}

const AppShell = ({ children, withLayout = true, cmsInitial }: AppShellProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClientOnly>
        <Toaster />
      </ClientOnly>
      <Sonner />
      {withLayout ? (
        <CmsProvider initial={cmsInitial}>
          <SiteLayout>{children}</SiteLayout>
        </CmsProvider>
      ) : (
        children
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppShell;
