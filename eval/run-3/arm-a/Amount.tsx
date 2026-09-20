type AmountProps = {
  label?: string;
  value?: string;
  currency?: string;
};

export default function Amount({
  label = "Outstanding Balance",
  value = "2,40,000",
  currency = "₹",
}: AmountProps) {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]" data-name="Amount">
      <div className="flex h-[21px] w-full items-center gap-[4px]" data-name="Container">
        <p
          className="whitespace-nowrap text-left text-[14px] font-normal leading-[20px] text-[#374151]"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {label}
        </p>
      </div>
      <div className="flex w-full items-end gap-[2px]" data-name="Amount">
        <span
          className="whitespace-nowrap text-left text-[20px] font-bold leading-[28px] text-[#21552f]"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {currency}
        </span>
        <span
          className="whitespace-nowrap text-left text-[24px] font-bold leading-[32px] text-[#21552f]"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
