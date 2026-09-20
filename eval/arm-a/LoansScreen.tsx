import { Amount } from "./Amount";
import { BottomNavbar } from "./BottomNavbar";
import { Header } from "./Header";
import { Heading } from "./Heading";
import { Icon } from "./Icon";
import { MainCard } from "./MainCard";
import { SpecialButton } from "./SpecialButton";
import { TotalOutstandingBalance } from "./TotalOutstandingBalance";
import {
  imgBankNote,
  imgCpuChip,
  imgFactory,
  imgPlus,
  imgTrendUp,
} from "./assets";

function StyleIcon({ src }: { src: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-2xl bg-[#e7f4eb] p-3 backdrop-blur-[25px]">
      <Icon src={src} size={24} />
    </div>
  );
}

function LoanListCard({
  iconSrc,
  title,
  accountId,
  outstanding,
  nextPayment,
  dueDate,
  href,
}: {
  iconSrc: string;
  title: string;
  accountId: string;
  outstanding: string;
  nextPayment: string;
  dueDate: string;
  href?: string;
}) {
  return (
    <MainCard variant="default" href={href}>
      <div className="flex w-full flex-col items-start gap-4">
        <Heading
          title={title}
          subtitle={accountId}
          icon={<StyleIcon src={iconSrc} />}
        />

        <div className="flex w-full flex-col items-start gap-2">
          <p className="text-[14px] font-normal leading-5 text-[#374151]">
            Outstanding Balance
          </p>
          <Amount integer={outstanding} size="lg" tone="brand" />
        </div>

        <div className="flex w-full items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
            <p className="text-[14px] font-normal leading-5 text-[#374151]">
              Next Payment
            </p>
            <Amount integer={nextPayment} size="md" tone="brand" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
            <p className="text-[14px] font-normal leading-5 text-[#374151]">Due Date</p>
            <p className="text-[16px] font-bold leading-6 text-[#030712] whitespace-nowrap">
              {dueDate}
            </p>
          </div>
        </div>
      </div>
    </MainCard>
  );
}

export default function LoansScreen() {
  return (
    <div className="relative mx-auto h-[956px] w-[440px] overflow-hidden bg-[#f3f4f6] font-[Lato,sans-serif]">
      <Header />

      <div className="absolute left-1/2 top-[123px] flex h-[833px] w-[440px] -translate-x-1/2 flex-col items-center gap-4 overflow-x-clip overflow-y-auto p-2">
        <MainCard variant="summary">
          <TotalOutstandingBalance integer="1,418,100" activeLoans={2} />
        </MainCard>

        <div className="flex w-full items-start gap-3">
          <SpecialButton iconSrc={imgPlus} label="Apply For New Loan" />
          <SpecialButton iconSrc={imgBankNote} label="Settled Loans History" />
        </div>

        <MainCard variant="info" className="relative overflow-hidden">
          <div className="relative z-10 flex w-full flex-col items-start justify-center gap-6">
            <Heading
              title="Need more capital?"
              titleSize="lg"
              subtitle={
                <span className="text-[16px] font-semibold leading-6 text-[#374151]">
                  Extend your credit limit up to 1.2M AED
                  <br />
                  based on your current performance.
                </span>
              }
            />
            <a
              href="#apply"
              className="text-center text-[14px] font-bold leading-5 text-[#3a6fe2] underline"
            >
              Apply Now
            </a>
          </div>
          <div className="pointer-events-none absolute bottom-[-26px] left-[255px] size-[167px] overflow-hidden">
            <img
              alt=""
              src={imgFactory}
              width={167}
              height={167}
              className="absolute left-[-8%] top-[-7%] h-[115%] w-[112%] max-w-none"
            />
          </div>
        </MainCard>

        <LoanListCard
          iconSrc={imgTrendUp}
          title="Business Growth Loans"
          accountId="LC-042-90287"
          outstanding="1,250,000"
          nextPayment="42,500"
          dueDate="13 Jun 2026"
          href="#loan-lc-042-90287"
        />

        <LoanListCard
          iconSrc={imgCpuChip}
          title="Equipment Financing"
          accountId="AC-98234-772"
          outstanding="168,100"
          nextPayment="8,100"
          dueDate="05 May 2026"
        />

        <div className="h-[164px] w-full shrink-0" aria-hidden />
      </div>

      <BottomNavbar />
    </div>
  );
}
