import { Amount } from "./Amount";

type TotalOutstandingBalanceProps = {
  integer: string;
  decimal?: string;
  currency?: string;
  activeLoans: number;
};

export function TotalOutstandingBalance({
  integer,
  decimal = ".00",
  currency = "AED",
  activeLoans,
}: TotalOutstandingBalanceProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <p className="text-[14px] font-normal leading-5 text-[#d1d5db] whitespace-nowrap">
        Total Outstanding Balance
      </p>
      <div className="flex w-full flex-col items-start gap-0.5">
        <Amount
          integer={integer}
          decimal={decimal}
          currency={currency}
          size="display"
          tone="inverse"
        />
        <p className="text-[14px] leading-5 text-[#d1d5db]">
          across <span className="font-bold text-white">{activeLoans} Active Loans</span>
        </p>
      </div>
    </div>
  );
}
