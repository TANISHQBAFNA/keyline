type AmountProps = {
  value: string;
};

export function Amount({ value }: AmountProps) {
  return (
    <p className="text-[28px] font-semibold leading-8 tracking-[-0.4px] text-[#1A1A1A]">
      {value}
    </p>
  );
}
