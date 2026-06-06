import { useMemo, useState } from "react";
import Link from "next/link";
import { ClientOnly } from "@/components/ClientOnly";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { formatVnd } from "@/lib/format-vnd";

function sliderPlaceholder(percent: number) {
  return (
    <div
      className="relative flex w-full touch-none select-none items-center"
      aria-hidden
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute h-full bg-primary"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <div className="block h-5 w-5 shrink-0 rounded-full border-2 border-primary bg-background" />
    </div>
  );
}

const LoanCalculator = () => {
  const [amount, setAmount] = useState(3_000_000);
  const [months, setMonths] = useState(6);
  const rate = 1.099; // monthly %

  const monthly = useMemo(() => {
    const interest = (amount * rate) / 100;
    const principal = amount / months;
    return Math.round(principal + interest);
  }, [amount, months]);

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center rounded-2xl md:rounded-[2rem] overflow-hidden bg-gradient-hero p-4 sm:p-6 md:p-14 shadow-card">
          <div className="text-primary-foreground space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/20">
              <Calculator className="h-4 w-4" /> Công cụ tính lãi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
              Ước tính khoản vay <span className="text-accent">trong vài giây</span>
            </h2>
            <p className="text-primary-foreground/85 text-base md:text-lg">
              Chọn số tiền và kỳ hạn mong muốn để xem khoản trả góp hàng tháng. Lãi suất chỉ mang tính tham khảo.
            </p>
            <ul className="text-primary-foreground/90 text-xs sm:text-sm space-y-1.5 pt-2">
              <li>• Lãi suất 1.099%/tháng</li>
              <li>• Kỳ hạn linh hoạt từ 3 - 9 tháng</li>
              <li>• KHÔNG thu phí trước hồ sơ, KHÔNG phí ẩn.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-card p-4 sm:p-6 md:p-8 shadow-2xl space-y-5 md:space-y-7">
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">Số tiền cần vay</label>
                <span className="text-sm font-bold text-primary">{formatVnd(amount)}</span>
              </div>
              <ClientOnly fallback={sliderPlaceholder(0)}>
                <Slider value={[amount]} min={3_000_000} max={300_000_000} step={1_000_000} onValueChange={(v) => setAmount(v[0])} />
              </ClientOnly>
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>3 triệu</span><span>300 triệu</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">Kỳ hạn vay</label>
                <span className="text-sm font-bold text-primary">{months} tháng</span>
              </div>
              <ClientOnly fallback={sliderPlaceholder(((months - 3) / 6) * 100)}>
                <Slider value={[months]} min={3} max={9} step={1} onValueChange={(v) => setMonths(v[0])} />
              </ClientOnly>
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>3 tháng</span><span>9 tháng</span>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-soft p-5 border border-primary/10">
              <div className="text-sm text-muted-foreground">Trả góp hàng tháng (ước tính)</div>
              <div className="text-3xl md:text-4xl font-extrabold text-primary mt-1">{formatVnd(monthly)}</div>
            </div>

            <Button variant="hero" size="xl" className="w-full" asChild>
              <Link href="/vay-tien-online">Đăng ký vay ngay</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;
