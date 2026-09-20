type AmountProps = {
  label?: string;
  value?: string;
  currency?: string;
};

export default function Amount({
  label = "Outstanding Balance",
  value = "2,40,000",
  currency = "INR",
}: AmountProps) {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]" data-name="Amount">
      <div className="flex h-[21px] w-full items-center gap-[4px]">
        <p className="whitespace-nowrap font-['Lato',sans-serif] text-[14px] font-normal leading-[20px] text-[#21552f]">
          {label}
        </p>
      </div>
      <div className="flex w-full items-center overflow-clip">
        <div className="flex items-center gap-[2px]">
          <p className="whitespace-nowrap font-['Lato',sans-serif] text-[24px] font-bold leading-[32px] text-[#21552f]">
            ₹{value}
          </p>
          <p
            className="whitespace-nowrap font-['Lato',sans-serif] text-[20px] font-bold leading-[28px] text-[#21552f]"
            dir="auto"
          >
            {currency}
          </p>
        </div>
      </div>
    </div>
  );
}
