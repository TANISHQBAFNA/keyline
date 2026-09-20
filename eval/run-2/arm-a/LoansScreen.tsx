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
    <MainCard href={href} variant="default">
      <div className="flex w-full flex-col items-start gap-4">
        <Heading
          icon={<StyleIcon src={iconSrc} />}
          subtitle={accountId}
          title={title}
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
            <p className="text-[14px] font-normal leading-5 text-[#374151]">
              Due Date
            </p>
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

      <div className="absolute left-1/2 top-[123px] flex h-[944px] w-[440px] -translate-x-1/2 flex-col items-center gap-4 overflow-x-clip overflow-y-auto p-2">
        <MainCard variant="hero">
          <TotalOutstandingBalance
            hint="across 2 Active Loans"
            integer="1,418,100"
          />
        </MainCard>

        <div className="flex w-full items-start gap-3">
          <SpecialButton
            href="#apply"
            icon={<StyleIcon src={imgPlus} />}
            label="Apply For New Loan"
          />
          <SpecialButton
            icon={<StyleIcon src={imgBankNote} />}
            label="Settled Loans History"
          />
        </div>

        <MainCard className="overflow-hidden" variant="promo">
          <div className="relative flex w-full flex-col items-start justify-center gap-6">
            <Heading
              subtitle={`Extend your credit limit up to 1.2M AED \nbased on your current performance.`}
              title="Need more capital?"
              titleSize="lg"
            />
            <p className="text-[14px] font-bold leading-5 text-[#3a6fe2] underline">
              Apply Now
            </p>
            <div className="pointer-events-none absolute bottom-[-26px] left-[255px] size-[167px] overflow-hidden">
              <img
                alt=""
                className="absolute top-[-6.9%] left-[-7.93%] h-[114.73%] w-[111.59%] max-w-none"
                src={imgFactory}
              />
            </div>
          </div>
        </MainCard>

        <LoanListCard
          accountId="LC-042-90287"
          dueDate="13 Jun 2026"
          href="#loan-business-growth"
          iconSrc={imgTrendUp}
          nextPayment="42,500"
          outstanding="1,250,000"
          title="Business Growth Loans"
        />

        <LoanListCard
          accountId="AC-98234-772"
          dueDate="05 May 2026"
          iconSrc={imgCpuChip}
          nextPayment="8,100"
          outstanding="168,100"
          title="Equipment Financing"
        />

        <div className="h-[164px] w-full shrink-0" />
      </div>

      <BottomNavbar />
    </div>
  );
}
