import type { ReactNode } from "react";
import {
  imgBank,
  imgBankNote,
  imgBattery,
  imgCellular,
  imgChevronDown,
  imgCoins,
  imgCpuChip,
  imgCreditCard,
  imgFactory,
  imgHome,
  imgPiggy,
  imgPlus,
  imgSearch,
  imgSliders,
  imgTrendUp,
  imgWifi,
} from "./assets";

function Icon({
  src,
  size = 24,
  alt = "",
}: {
  src: string;
  size?: number;
  alt?: string;
}) {
  return (
    <div className="relative overflow-clip shrink-0" style={{ width: size, height: size }}>
      <img alt={alt} className="block size-full max-w-none" src={src} />
    </div>
  );
}

function StyleIcon({ src }: { src: string }) {
  return (
    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#e7f4eb] backdrop-blur-[25px]">
      <Icon src={src} size={24} />
    </div>
  );
}

export function Amount({
  integer,
  decimal = ".00",
  ccy = "AED",
  tone = "brand",
  size = "md",
}: {
  integer: string;
  decimal?: string;
  ccy?: string;
  tone?: "brand" | "inverse";
  size?: "lg" | "md" | "sm";
}) {
  const color = tone === "inverse" ? "text-white" : "text-[#21552f]";
  const num =
    size === "lg" ? "text-[32px] leading-none" : size === "md" ? "text-2xl leading-8" : "text-xl leading-7";
  const ccySize =
    size === "lg" ? "text-2xl leading-8" : size === "md" ? "text-xl leading-7" : "text-base leading-6";

  return (
    <div className={`flex items-end gap-0.5 ${color}`} data-name="Amount">
      <span className={`font-bold ${num}`}>{integer}</span>
      <span className={`font-bold ${num}`}>{decimal}</span>
      <span className={`font-bold ${ccySize}`}>{ccy}</span>
    </div>
  );
}

export function Heading({
  title,
  subtitle,
  iconSrc,
}: {
  title: string;
  subtitle?: string;
  iconSrc?: string;
}) {
  return (
    <div className="flex h-[50px] w-full items-center gap-3" data-name="Heading">
      {iconSrc ? <StyleIcon src={iconSrc} /> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-base font-bold leading-6 text-[#030712]">{title}</p>
        {subtitle ? (
          <p className="text-sm font-semibold leading-5 text-[#374151]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export function TotalOutstandingBalance() {
  return (
    <div className="flex w-full flex-col items-start gap-2" data-name="Total Outstanding Balance">
      <p className="text-sm leading-5 text-[#d1d5db]">Total Outstanding Balance</p>
      <Amount integer="1,418,100" size="lg" tone="inverse" />
      <p className="text-sm leading-5 text-[#d1d5db]">
        across <span className="font-bold text-white">2 Active Loans</span>
      </p>
    </div>
  );
}

export function MainCard({
  children,
  variant = "surface",
  className = "",
}: {
  children: ReactNode;
  variant?: "surface" | "brand" | "info";
  className?: string;
}) {
  const bg =
    variant === "brand"
      ? "bg-[linear-gradient(64deg,#12341d_3.6%,#21552f_98%)]"
      : variant === "info"
        ? "bg-[#e3f2ff]"
        : "bg-white";

  return (
    <div
      className={`relative w-full overflow-clip rounded-[24px] border border-[#f3f4f6] p-4 shadow-[0_0_1.5px_#f9fafb] ${bg} ${className}`}
      data-name="Main Card"
    >
      <div className="flex w-full flex-col items-start" data-name="Slot">
        {children}
      </div>
    </div>
  );
}

export function SpecialButton({
  label,
  iconSrc,
}: {
  label: string;
  iconSrc: string;
}) {
  return (
    <button
      className="flex min-w-[133px] flex-1 cursor-pointer flex-col items-center gap-3 rounded-[32px] border border-[#f3f4f6] bg-white px-[13px] py-[25px] shadow-[0_0_1.5px_#f9fafb]"
      data-name="Special Button"
      type="button"
    >
      <StyleIcon src={iconSrc} />
      <p className="text-center text-sm font-bold leading-5 text-[#21552f]">{label}</p>
    </button>
  );
}

export function Header() {
  return (
    <header
      className="absolute left-1/2 top-0 flex w-[440px] -translate-x-1/2 flex-col backdrop-blur-[5px]"
      data-name="Header"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(231,244,235,0.1) 25%, rgba(231,244,235,0.5) 50%, rgba(231,244,235,0.9) 75%, rgba(231,244,235,0.9) 100%)",
      }}
    >
      <div className="flex w-full items-center justify-center gap-1.5 px-4 py-[11px]">
        <div className="flex h-[22px] flex-1 items-center justify-center pt-0.5">
          <p className="text-center text-[17px] font-semibold leading-[22px] text-[#030712]">9:41</p>
        </div>
        <div className="h-[37px] w-[125px] rounded-full" />
        <div className="flex h-[22px] flex-1 items-center justify-center gap-[7px] pt-px">
          <div className="relative h-[12.226px] w-[19.2px]">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgCellular} />
          </div>
          <div className="relative h-[12.328px] w-[17.142px]">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgWifi} />
          </div>
          <div className="relative h-[13px] w-[27.328px]">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgBattery} />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between p-2">
        <div className="size-12 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <p className="px-[30px] text-center text-xl font-bold leading-7 text-[#030712]">Loans</p>
          <button className="flex items-center justify-center gap-1" type="button">
            <span className="text-sm font-bold leading-5 text-[#3a6fe2] underline">
              Emaar Consumer vehicles
            </span>
            <Icon src={imgChevronDown} size={20} />
          </button>
        </div>
        <div className="size-12 shrink-0" />
      </div>
    </header>
  );
}

export function BottomNavbar() {
  return (
    <nav
      className="absolute bottom-0 left-0 flex w-[440px] flex-col overflow-clip rounded-[32px] border border-[#f3f4f6] shadow-[0_0_8px_1px_rgba(3,7,18,0.1)] backdrop-blur-[25px]"
      data-name="Bottom Navbar"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgb(249,250,251) 0%, rgba(249,250,251,0.9) 50%, rgba(249,250,251,0.5) 75%, rgba(249,250,251,0) 100%)",
      }}
    >
      <div className="flex w-full flex-col gap-3 px-4 pb-8 pt-4">
        <div className="flex h-[52px] w-full items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-[#d1d5db] bg-white px-[13px] py-[13px]">
            <p className="text-base leading-6 text-[#6b7280]">Search Loans...</p>
            <Icon src={imgSearch} size={24} />
          </div>
          <button
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-[0_2px_4px_rgba(3,7,18,0.1),0_4px_4px_rgba(3,7,18,0.1)]"
            style={{
              backgroundImage: "linear-gradient(180deg, #12341d 0%, #21552f 100%)",
            }}
            type="button"
          >
            <Icon src={imgSliders} size={24} />
          </button>
        </div>
        <div className="flex w-full items-center gap-2">
          <button
            className="flex items-center rounded-[20px] border border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-3 backdrop-blur-[25px]"
            type="button"
          >
            <Icon src={imgHome} size={24} />
          </button>
          <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-1 shadow-[0_0_8px_rgba(3,7,18,0.1)] backdrop-blur-[25px]">
            <button className="flex max-w-16 flex-1 items-center justify-center px-[22px] py-3" type="button">
              <Icon src={imgBank} size={20} />
            </button>
            <button className="flex max-w-16 flex-1 items-center justify-center px-[22px] py-3" type="button">
              <Icon src={imgCreditCard} size={20} />
            </button>
            <button className="flex max-w-16 flex-1 items-center justify-center px-[22px] py-3" type="button">
              <Icon src={imgPiggy} size={20} />
            </button>
            <div className="flex h-11 min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#f3f4f6] bg-white px-4 py-3 shadow-[0_0_3px_#f9fafb]">
              <Icon src={imgCoins} size={20} />
              <span className="text-sm font-semibold leading-5 text-[#21552f]">Loans</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function LoansScreen() {
  return (
    <div className="relative size-full min-h-[956px] w-[440px] overflow-hidden bg-[#f3f4f6] font-sans">
      <div className="absolute left-1/2 top-[123px] flex h-[944px] w-[440px] -translate-x-1/2 flex-col items-center gap-4 overflow-y-auto overflow-x-clip p-2">
        <MainCard variant="brand">
          <TotalOutstandingBalance />
        </MainCard>

        <div className="flex w-full items-start gap-3">
          <SpecialButton iconSrc={imgPlus} label="Apply For New Loan" />
          <SpecialButton iconSrc={imgBankNote} label="Settled Loans History" />
        </div>

        <MainCard className="overflow-visible" variant="info">
          <div className="relative flex w-full flex-col items-start justify-center gap-6">
            <div className="flex w-full items-start gap-3" data-name="Heading">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-xl font-bold leading-7 text-[#030712]">Need more capital?</p>
                <p className="text-base font-semibold leading-6 text-[#374151]">
                  Extend your credit limit up to 1.2M AED
                  <br />
                  based on your current performance.
                </p>
              </div>
            </div>
            <p className="text-sm font-bold leading-5 text-[#3a6fe2] underline">Apply Now</p>
            <div className="pointer-events-none absolute bottom-[-26px] left-[255px] size-[167px] overflow-hidden">
              <img
                alt=""
                className="absolute left-[-7.93%] top-[-6.9%] h-[114.73%] w-[111.59%] max-w-none"
                src={imgFactory}
              />
            </div>
          </div>
        </MainCard>

        <MainCard>
          <div className="flex w-full flex-col gap-4">
            <Heading iconSrc={imgTrendUp} subtitle="LC-042-90287" title="Business Growth Loans" />
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-5 text-[#374151]">Outstanding Balance</p>
              <Amount integer="1,250,000" size="md" />
            </div>
            <div className="flex w-full items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-[#374151]">Next Payment</p>
                <Amount integer="42,500" size="sm" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-[#374151]">Due Date</p>
                <p className="text-base font-bold leading-6 text-[#030712]">13 Jun 2026</p>
              </div>
            </div>
          </div>
        </MainCard>

        <MainCard>
          <div className="flex w-full flex-col gap-4">
            <Heading iconSrc={imgCpuChip} subtitle="AC-98234-772" title="Equipment Financing" />
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-5 text-[#21552f]">Outstanding Balance</p>
              <Amount integer="168,100" size="md" />
            </div>
            <div className="flex w-full items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-[#374151]">Next Payment</p>
                <Amount integer="8,100" size="sm" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-[#374151]">Due Date</p>
                <p className="text-base font-bold leading-6 text-[#030712]">05 May 2026</p>
              </div>
            </div>
          </div>
        </MainCard>

        <div className="h-[164px] w-full shrink-0" />
      </div>

      <Header />
      <BottomNavbar />
    </div>
  );
}
