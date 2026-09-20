type InputFieldProps = {
  label?: string;
  defaultValue?: string;
  prefix?: string;
};

export default function InputField({
  label = "Amount to pay",
  defaultValue = "2,40,000",
  prefix = "₹",
}: InputFieldProps) {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]" data-name="Input Field">
      <div className="flex h-[21px] w-full items-center gap-[4px]" data-name="Container">
        <p
          className="whitespace-nowrap text-[14px] font-normal leading-[20px] text-[#374151]"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {label}
        </p>
      </div>
      <div
        className="flex w-full items-center justify-between rounded-[16px] border border-solid border-[#d1d5db] bg-white px-[13px] py-[13px]"
        data-name="Text Input"
      >
        <span
          className="shrink-0 text-[20px] font-bold leading-[28px] text-[#21552f]"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {prefix}
        </span>
        <input
          type="text"
          inputMode="decimal"
          defaultValue={defaultValue}
          aria-label={label}
          className="min-w-px flex-1 bg-transparent text-[16px] font-bold leading-[24px] text-[#21552f] outline-none"
          style={{ fontFamily: "Lato, sans-serif" }}
        />
      </div>
    </div>
  );
}
