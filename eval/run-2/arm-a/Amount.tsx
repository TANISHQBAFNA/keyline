type AmountSize = "hero" | "lg" | "md";
type AmountTone = "inverse" | "brand";

type AmountProps = {
  integer: string;
  decimal?: string;
  currency?: string;
  size?: AmountSize;
  tone?: AmountTone;
  className?: string;
};

const sizeStyles: Record<
  AmountSize,
  { value: string; currency: string }
> = {
  hero: {
    value: "text-[32px] leading-none font-bold",
    currency: "text-[24px] leading-8 font-bold",
  },
  lg: {
    value: "text-[24px] leading-8 font-bold",
    currency: "text-[20px] leading-7 font-bold",
  },
  md: {
    value: "text-[20px] leading-7 font-bold",
    currency: "text-[16px] leading-6 font-bold",
  },
};

const toneStyles: Record<AmountTone, string> = {
  inverse: "text-white",
  brand: "text-[#21552f]",
};

export function Amount({
  integer,
  decimal = ".00",
  currency = "AED",
  size = "lg",
  tone = "brand",
  className,
}: AmountProps) {
  const sizes = sizeStyles[size];
  const color = toneStyles[tone];

  return (
    <div
      className={`flex items-end gap-1 ${className ?? ""}`}
      data-name="Amount"
    >
      <div className={`flex items-end ${sizes.value} ${color}`}>
        <span>{integer}</span>
        <span>{decimal}</span>
      </div>
      <span className={`${sizes.currency} ${color}`}>{currency}</span>
    </div>
  );
}
