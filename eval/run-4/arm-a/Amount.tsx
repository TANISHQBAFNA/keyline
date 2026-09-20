type AmountProps = {
  value?: string;
  caption?: string;
};

export default function Amount({
  value = "₹2,40,000",
  caption = "Outstanding balance",
}: AmountProps) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start w-full" data-name="Amount">
      <p className="font-['Poppins',sans-serif] font-medium leading-[16px] text-[14px] text-[color:var(--text-primary,#111)]">
        {value}
      </p>
      <p className="font-['Poppins',sans-serif] font-normal leading-[16px] text-[11px] text-[color:var(--text-primary,#111)]">
        {caption}
      </p>
    </div>
  );
}
