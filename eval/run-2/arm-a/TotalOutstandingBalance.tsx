import { Amount } from "./Amount";

type TotalOutstandingBalanceProps = {
  integer: string;
  decimal?: string;
  currency?: string;
  hint?: string;
  className?: string;
};

export function TotalOutstandingBalance({
  integer,
  decimal = ".00",
  currency = "AED",
  hint = "across 2 Active Loans",
  className,
}: TotalOutstandingBalanceProps) {
  return (
    <div
      className={`flex w-full flex-col items-start gap-2 ${className ?? ""}`}
      data-name="Total Outstanding Balance"
    >
      <p className="text-[14px] font-normal leading-5 text-[#d1d5db]">
        Total Outstanding Balance
      </p>
      <Amount
        integer={integer}
        decimal={decimal}
        currency={currency}
        size="hero"
        tone="inverse"
      />
      <p className="text-[14px] font-normal leading-5 text-[#d1d5db]">
        across{" "}
        <span className="font-bold text-white">
          {hint.replace(/^across\s+/, "")}
        </span>
      </p>
    </div>
  );
}
