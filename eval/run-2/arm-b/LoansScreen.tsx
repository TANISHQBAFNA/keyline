import type { ReactNode } from "react";

/** Loans list — graph inventory: Header, Main Card (slot), Heading, Amount, Total Outstanding Balance, Special Button, Bottom Navbar. Counts from orient god-node degrees (Main Card / Heading / Special Button ×12 graph-wide); screen uses 1 Header, 4 Main Cards, 3 Headings, 5 Amounts, 1 Total Outstanding Balance, 2 Special Buttons, 1 Bottom Navbar. */

function Amount({
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
  const color = tone === "inverse" ? "text-white" : "text-emerald-900";
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

function Heading({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex h-[50px] w-full items-center gap-3" data-name="Heading">
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-base font-bold leading-6 text-gray-950">{title}</p>
        {subtitle ? <p className="text-sm font-semibold leading-5 text-gray-700">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function TotalOutstandingBalance() {
  return (
    <div className="flex w-full flex-col items-start gap-2" data-name="Total Outstanding Balance">
      <p className="text-sm leading-5 text-gray-300">Total Outstanding Balance</p>
      <Amount integer="1,418,100" size="lg" tone="inverse" />
      <p className="text-sm leading-5 text-gray-300">
        across <span className="font-bold text-white">2 Active Loans</span>
      </p>
    </div>
  );
}

function MainCard({
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
      ? "bg-gradient-to-br from-emerald-950 to-emerald-800"
      : variant === "info"
        ? "bg-sky-50"
        : "bg-white";

  return (
    <div
      className={`relative w-full overflow-clip rounded-3xl border border-gray-100 p-4 shadow-sm ${bg} ${className}`}
      data-name="Main Card"
    >
      <div className="flex w-full flex-col items-start" data-name="Slot">
        {children}
      </div>
    </div>
  );
}

function StyleGlyph({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-900">
      {children}
    </div>
  );
}

function SpecialButton({ label, glyph }: { label: string; glyph: string }) {
  return (
    <button
      className="flex min-w-[133px] flex-1 cursor-pointer flex-col items-center gap-3 rounded-[32px] border border-gray-100 bg-white px-[13px] py-[25px] shadow-sm"
      data-name="Special Button"
      type="button"
    >
      <StyleGlyph>{glyph}</StyleGlyph>
      <p className="text-center text-sm font-bold leading-5 text-emerald-900">{label}</p>
    </button>
  );
}

function Header() {
  return (
    <header
      className="absolute left-1/2 top-0 z-10 flex w-[390px] -translate-x-1/2 flex-col bg-gradient-to-b from-emerald-50 via-emerald-50/80 to-transparent"
      data-name="Header"
    >
      <div className="flex w-full items-center justify-between px-6 py-3">
        <p className="text-[17px] font-semibold leading-[22px] text-gray-950">9:41</p>
        <div className="flex items-center gap-1.5 text-gray-950">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-gray-950" />
          <span className="inline-block h-2.5 w-3.5 rounded-sm bg-gray-950" />
          <span className="inline-block h-3 w-6 rounded-sm border border-gray-950" />
        </div>
      </div>
      <div className="flex w-full items-center justify-between p-2">
        <div className="size-12 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <p className="px-[30px] text-center text-xl font-bold leading-7 text-gray-950">Loans</p>
          <button className="text-sm font-bold leading-5 text-blue-600 underline" type="button">
            Primary account
          </button>
        </div>
        <div className="size-12 shrink-0" />
      </div>
    </header>
  );
}

function BottomNavbar() {
  return (
    <nav
      className="absolute bottom-0 left-0 z-10 flex w-[390px] flex-col overflow-clip rounded-t-[32px] border border-gray-100 bg-gray-50/90 shadow-lg backdrop-blur"
      data-name="Bottom Navbar"
    >
      <div className="flex w-full flex-col gap-3 px-4 pb-8 pt-4">
        <div className="flex h-[52px] w-full items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-gray-300 bg-white px-[13px] py-[13px]">
            <p className="text-base leading-6 text-gray-500">Search Loans...</p>
            <span className="text-gray-500" aria-hidden>
              ⌕
            </span>
          </div>
          <button
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-950 to-emerald-800 text-white shadow"
            type="button"
            aria-label="Filters"
          >
            ☰
          </button>
        </div>
        <div className="flex w-full items-center gap-2">
          <button
            className="flex items-center rounded-[20px] border border-gray-300 bg-emerald-50 p-3"
            type="button"
            aria-label="Home"
          >
            ⌂
          </button>
          <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-gray-300 bg-emerald-50 p-1">
            <button className="flex flex-1 items-center justify-center py-3" type="button" aria-label="Accounts">
              🏦
            </button>
            <button className="flex flex-1 items-center justify-center py-3" type="button" aria-label="Cards">
              💳
            </button>
            <button className="flex flex-1 items-center justify-center py-3" type="button" aria-label="Savings">
              🐷
            </button>
            <div className="flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <span aria-hidden>◉</span>
              <span className="text-sm font-semibold leading-5 text-emerald-900">Loans</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function LoansScreen() {
  return (
    <div className="relative mx-auto h-[844px] w-[390px] overflow-hidden bg-gray-100 font-sans">
      <div className="absolute left-1/2 top-[108px] flex h-[736px] w-[390px] -translate-x-1/2 flex-col items-center gap-4 overflow-x-clip overflow-y-auto p-2">
        <MainCard variant="brand">
          <TotalOutstandingBalance />
        </MainCard>

        <div className="flex w-full items-start gap-3">
          <SpecialButton glyph="+" label="Apply For New Loan" />
          <SpecialButton glyph="☰" label="Settled Loans History" />
        </div>

        <MainCard variant="info">
          <div className="flex w-full flex-col items-start gap-4">
            <Heading title="Need more capital?" subtitle="Extend credit based on current performance." />
            <p className="text-sm font-bold leading-5 text-blue-600 underline">Apply Now</p>
          </div>
        </MainCard>

        <MainCard>
          <div className="flex w-full flex-col gap-4">
            <Heading icon={<StyleGlyph>↗</StyleGlyph>} subtitle="LC-042-90287" title="Business Growth Loans" />
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-5 text-gray-700">Outstanding Balance</p>
              <Amount integer="1,250,000" size="md" />
            </div>
            <div className="flex w-full items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-gray-700">Next Payment</p>
                <Amount integer="42,500" size="sm" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-gray-700">Due Date</p>
                <p className="text-base font-bold leading-6 text-gray-950">13 Jun 2026</p>
              </div>
            </div>
          </div>
        </MainCard>

        <MainCard>
          <div className="flex w-full flex-col gap-4">
            <Heading icon={<StyleGlyph>⚙</StyleGlyph>} subtitle="AC-98234-772" title="Equipment Financing" />
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-5 text-emerald-900">Outstanding Balance</p>
              <Amount integer="168,100" size="md" />
            </div>
            <div className="flex w-full items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-gray-700">Next Payment</p>
                <Amount integer="8,100" size="sm" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm leading-5 text-gray-700">Due Date</p>
                <p className="text-base font-bold leading-6 text-gray-950">05 May 2026</p>
              </div>
            </div>
          </div>
        </MainCard>

        <div className="h-[164px] w-full shrink-0" aria-hidden />
      </div>

      <Header />
      <BottomNavbar />
    </div>
  );
}
