type AmountSize = "display" | "lg" | "md";

type AmountProps = {
  integer: string;
  decimal?: string;
  currency?: string;
  size?: AmountSize;
  tone?: "inverse" | "brand";
  className?: string;
};

const sizeClasses: Record<
  AmountSize,
  { amount: string; currency: string }
> = {
  display: {
    amount: "text-[32px] font-bold leading-none",
    currency: "text-[24px] font-bold leading-8",
  },
  lg: {
    amount: "text-[24px] font-bold leading-8",
    currency: "text-[20px] font-bold leading-7",
  },
  md: {
    amount: "text-[20px] font-bold leading-7",
    currency: "text-[16px] font-bold leading-6",
  },
};

export function Amount({
  integer,
  decimal = ".00",
  currency = "AED",
  size = "lg",
  tone = "brand",
  className = "",
}: AmountProps) {
  const color = tone === "inverse" ? "text-white" : "text-[#21552f]";
  const classes = sizeClasses[size];

  return (
    <div className={`flex items-end gap-1 ${className}`}>
      <span className={`${classes.amount} ${color} whitespace-nowrap`}>
        {integer}
        {decimal}
      </span>
      <span className={`${classes.currency} ${color} whitespace-nowrap`} dir="auto">
        {currency}
      </span>
    </div>
  );
}
