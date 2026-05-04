import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const loanProducts = [
  { to: "/cho-vay-cam-co/vay-tien-bang-cavet-xe-may", label: "Vay bằng cà vẹt xe máy" },
  { to: "/cho-vay-cam-co/vay-tien-bang-cavet-oto", label: "Vay bằng cà vẹt ô tô" },
  { to: "/cho-vay-cam-co/vay-bang-icloud", label: "Vay bằng iCloud" },
];

const mainNav = [
  { to: "/ve-y99", label: "Về Y99" },
  { to: "/he-thong-cua-hang", label: "Hệ thống cửa hàng" },
  { to: "/ban-tin", label: "Tin tức" },
];

const topBarNav = [
  { to: "/tuyen-dung", label: "Tuyển dụng" },
  { to: "/lien-he", label: "Liên hệ" },
];

const languages = ["Tiếng Việt", "English"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(languages[0]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top info bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container h-8 flex items-center justify-between gap-4 text-xs font-medium">
          <div className="hidden md:block flex-1 overflow-hidden whitespace-nowrap pr-4 font-bold">
            <span className="inline-block pl-[100%] animate-marquee-x">
              Y99 hỗ trợ cầm đồ uy tín, cung cấp dịch vụ cầm đồ online minh bạch, an toàn, tiện lợi - linh hoạt, không giới hạn khoảng cách.
            </span>
          </div>
          <div className="flex items-center gap-3">
            {topBarNav.map((n, idx) => (
              <div key={n.to} className="flex items-center gap-3">
                {idx > 0 && <span className="opacity-70">|</span>}
                <NavLink to={n.to} className={({ isActive }) => cn("hover:opacity-80 transition-smooth", isActive && "underline")}>
                  {n.label}
                </NavLink>
              </div>
            ))}
            <span className="opacity-70">|</span>
            <div className="inline-flex items-center rounded-full border border-primary-foreground/30 p-0.5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLanguage(lang)}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full transition-smooth",
                    activeLanguage === lang
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/80 hover:text-primary-foreground",
                  )}
                  aria-pressed={activeLanguage === lang}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            <img src={logo} alt="Y99 Finance" className="h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 text-sm font-semibold text-foreground/80 flex-1">
            <NavLink
              to={mainNav[0].to}
              className={({ isActive }) => cn("hover:text-primary transition-smooth", isActive && "text-primary")}
            >
              {mainNav[0].label}
            </NavLink>

            {/* Cho vay cầm cố dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-primary transition-smooth py-2">
                Cho vay cầm cố <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="w-72 rounded-2xl bg-card border border-border shadow-card p-2">
                  {loanProducts.map((p) => (
                    <NavLink
                      key={p.to}
                      to={p.to}
                      className={({ isActive }) =>
                        cn(
                          "block px-4 py-2.5 rounded-xl text-sm hover:bg-secondary hover:text-primary transition-smooth",
                          isActive && "bg-secondary text-primary",
                        )
                      }
                    >
                      {p.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {mainNav.slice(1).map((n) => (
              <div key={n.to} className="flex items-center">
                <NavLink
                  to={n.to}
                  className={({ isActive }) => cn("hover:text-primary transition-smooth", isActive && "text-primary")}
                >
                  {n.label}
                </NavLink>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="cta" size="lg" className="gap-2 hidden sm:inline-flex" asChild>
              <a href="tel:1900575792"><Phone className="h-4 w-4" /> 1900575792</a>
            </Button>
            <button
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container py-4 space-y-1">
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cho vay cầm cố</div>
              {loanProducts.map((p) => (
                <NavLink
                  key={p.to}
                  to={p.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn("block px-3 py-2.5 rounded-lg text-sm hover:bg-secondary", isActive && "bg-secondary text-primary font-semibold")
                  }
                >
                  {p.label}
                </NavLink>
              ))}
              <div className="h-px bg-border my-2" />
              {mainNav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn("block px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary", isActive && "bg-secondary text-primary")
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
