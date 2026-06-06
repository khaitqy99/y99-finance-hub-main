import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, MapPin, Clock, Search } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ProductHeroVisual from "@/components/site/ProductHeroVisual";

const StoreLocatorLeaflet = dynamic(
  () => import("@/components/site/StoreLocatorLeaflet").then((m) => m.StoreLocatorLeaflet),
  { ssr: false },
);
import imgStores from "@/assets/page-stores.webp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { districtsForProvince, provincesFromStores, type StoreLocation } from "@/data/storeLocations";
import { useCms } from "@/context/CmsContext";

const ALL = "__all__";

function applyFilters(
  stores: StoreLocation[],
  q: string,
  province: string,
  district: string,
): StoreLocation[] {
  const needle = q.trim().toLowerCase();
  return stores.filter((s) => {
    if (province && province !== ALL && s.province !== province) return false;
    if (district && district !== ALL && s.district !== district) return false;
    if (!needle) return true;
    const blob = [s.name, s.address, s.province, s.district, s.phone].join(" ").toLowerCase();
    return blob.includes(needle);
  });
}

const Stores = () => {
  const { stores: storeLocations } = useCms();
  const [draftQ, setDraftQ] = useState("");
  const [draftProvince, setDraftProvince] = useState(ALL);
  const [draftDistrict, setDraftDistrict] = useState(ALL);
  const [appliedQ, setAppliedQ] = useState("");
  const [appliedProvince, setAppliedProvince] = useState(ALL);
  const [appliedDistrict, setAppliedDistrict] = useState(ALL);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const provinces = useMemo(() => provincesFromStores(storeLocations), [storeLocations]);
  const districtOptions = useMemo(
    () => districtsForProvince(storeLocations, draftProvince === ALL ? null : draftProvince),
    [draftProvince, storeLocations],
  );

  const filtered = useMemo(
    () => applyFilters(storeLocations, appliedQ, appliedProvince, appliedDistrict),
    [storeLocations, appliedQ, appliedProvince, appliedDistrict],
  );

  useEffect(() => {
    if (focusedId && !filtered.some((s) => s.id === focusedId)) {
      setFocusedId(null);
    }
  }, [filtered, focusedId]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedQ(draftQ);
    setAppliedProvince(draftProvince);
    setAppliedDistrict(draftDistrict);
    setFocusedId(null);
  };

  const onProvinceChange = (v: string) => {
    setDraftProvince(v);
    setDraftDistrict(ALL);
  };

  const focusStore = useCallback((id: string) => {
    setFocusedId(id);
    const row = rowRefs.current.get(id);
    row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const onMarkerSelect = useCallback((id: string) => {
    setFocusedId(id);
    const row = rowRefs.current.get(id);
    row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Hệ thống cửa hàng"
        title={
          <>
            Y99 đã có mặt tại <span className="text-accent">Cần Thơ</span> và{" "}
            <span className="text-accent">Bắc Ninh</span>, sắp tới sẽ mở rộng để gần bạn hơn.
          </>
        }
        titleClassName="max-w-3xl !text-2xl md:!text-3xl lg:!text-4xl !leading-[1.6] md:!leading-[1.7]"
        description="Tìm phòng giao dịch Y99 gần bạn nhất để được tư vấn và hỗ trợ vay nhanh trong 15 phút."
        crumbs={[{ label: "Hệ thống cửa hàng" }]}
        media={<ProductHeroVisual src={imgStores} alt="Hệ thống cửa hàng Y99" />}
      />

      <section className="py-10 md:py-14">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-6">
            Phòng giao dịch
          </h2>

          <form
            onSubmit={onSearch}
            className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end lg:gap-4 mb-8"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="sr-only">Địa chỉ cần tìm</label>
              <Input
                placeholder="Nhập địa chỉ cần tìm"
                value={draftQ}
                onChange={(e) => setDraftQ(e.target.value)}
                className="h-12 rounded-xl border-border/70 bg-background"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:gap-4 gap-3 flex-1">
              <div className="min-w-[160px] lg:min-w-[180px]">
                <Select value={draftProvince} onValueChange={onProvinceChange}>
                  <SelectTrigger className="h-12 rounded-xl border-border/70 bg-background">
                    <SelectValue placeholder="Tỉnh/ Thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Tất cả tỉnh/thành</SelectItem>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[160px] lg:min-w-[180px]">
                <Select value={draftDistrict} onValueChange={setDraftDistrict}>
                  <SelectTrigger className="h-12 rounded-xl border-border/70 bg-background">
                    <SelectValue placeholder="Quận/ Huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Tất cả quận/huyện</SelectItem>
                    {districtOptions.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="h-12 px-8 rounded-xl font-bold gap-2 shrink-0">
              <Search className="h-4 w-4" />
              Tìm kiếm
            </Button>
          </form>

          <div className="rounded-2xl md:rounded-3xl border border-border/60 bg-card shadow-card overflow-hidden">
            <div className="grid min-h-[380px] h-[min(720px,88vh)] max-h-[min(720px,88vh)] grid-rows-[minmax(0,1fr)_minmax(0,0.95fr)] lg:h-[min(640px,calc(100vh-12rem))] lg:max-h-[min(640px,calc(100vh-12rem))] lg:min-h-[480px] lg:grid-rows-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="flex min-h-0 flex-col border-b border-border/60 lg:h-full lg:border-b-0 lg:border-r">
                <div className="shrink-0 border-b border-border/60 bg-muted/30 px-4 py-3 md:px-5">
                  <p className="text-sm font-bold text-foreground">
                    Danh sách PGD ({filtered.length})
                  </p>
                </div>
                <div className="store-locator-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  {filtered.map((s) => (
                    <div
                      key={s.id}
                      ref={(el) => {
                        if (el) rowRefs.current.set(s.id, el);
                        else rowRefs.current.delete(s.id);
                      }}
                      className={`px-4 py-4 md:px-5 border-b border-border/50 last:border-b-0 transition-colors ${
                        focusedId === s.id ? "bg-primary/8 ring-inset ring-1 ring-primary/25" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 pt-0.5 text-primary">
                          <MapPin className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <h3 className="font-bold text-foreground leading-snug">{s.name}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              <span className="font-semibold text-foreground/80">Địa chỉ: </span>
                              {s.address}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground/80 shrink-0">Hotline: </span>
                              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-primary font-medium hover:underline">
                                {s.phone}
                              </a>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                              <span>
                                <span className="font-semibold text-foreground/80">Giờ mở cửa: </span>
                                {s.hours}
                              </span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => focusStore(s.id)}
                            className="inline-flex items-center gap-0.5 text-sm font-bold text-primary hover:underline pt-1"
                          >
                            XEM VỊ TRÍ
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p className="px-5 py-12 text-center text-muted-foreground text-sm">
                      Không tìm thấy phòng giao dịch phù hợp. Thử đổi bộ lọc hoặc từ khóa.
                    </p>
                  )}
                </div>
              </div>

              <div className="relative flex min-h-0 flex-col bg-muted/20 p-3 md:p-4 lg:h-full">
                <div className="min-h-0 flex-1">
                  <StoreLocatorLeaflet
                    stores={filtered}
                    focusedId={focusedId}
                    onMarkerSelect={onMarkerSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Stores;
