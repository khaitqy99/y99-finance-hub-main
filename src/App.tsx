import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/site/SiteLayout";
import Index from "./pages/Index.tsx";
import LoanProduct from "./pages/LoanProduct.tsx";
import News from "./pages/News.tsx";
import NewsDetail from "./pages/NewsDetail.tsx";
import About from "./pages/About.tsx";
import Recruitment from "./pages/Recruitment.tsx";
import Stores from "./pages/Stores.tsx";
import Contact from "./pages/Contact.tsx";
import VayTienOnline from "./pages/VayTienOnline.tsx";
import DangKyVayNgay from "./pages/DangKyVayNgay.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Disclaimer from "./pages/Disclaimer.tsx";
import InterestFeePolicy from "./pages/InterestFeePolicy.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/cho-vay-cam-co/:slug" element={<LoanProduct />} />
            <Route path="/ban-tin" element={<News />} />
            <Route path="/ban-tin/:slug" element={<NewsDetail />} />
            <Route path="/ve-y99" element={<About />} />
            <Route path="/tuyen-dung" element={<Recruitment />} />
            <Route path="/he-thong-cua-hang" element={<Stores />} />
            <Route path="/lien-he" element={<Contact />} />
            <Route path="/vay-tien-online" element={<VayTienOnline />} />
            <Route path="/dang-ky-vay-ngay" element={<DangKyVayNgay />} />
            <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
            <Route path="/tuyen-bo-mien-tru-trach-nhiem" element={<Disclaimer />} />
            <Route path="/tuyen-bo-mien-tru" element={<Disclaimer />} />
            <Route path="/mien-tru-trach-nhiem" element={<Disclaimer />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/chinh-sach-lai-suat-phi-dich-vu" element={<InterestFeePolicy />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
