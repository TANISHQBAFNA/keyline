type InputFieldProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function InputField({
  label = "Amount to pay",
  value = "2,40,000",
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]" data-name="Input Field">
      <div className="flex h-[21px] w-full items-center gap-[4px]">
        <p className="whitespace-nowrap font-['Lato',sans-serif] text-[14px] font-normal leading-[20px] text-[#374151]">
          {label}
        </p>
      </div>
      <label className="flex w-full cursor-text flex-col items-start gap-[2px] drop-shadow-[0px_0px_4px_rgba(3,7,18,0.1)] backdrop-blur-[25px]">
        <div className="flex w-full items-center justify-between rounded-[16px] border border-solid border-[#d1d5db] bg-white px-[13px] py-[13px]">
          <input
            type="text"
            inputMode="numeric"
            aria-label={label}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            className="min-w-px flex-1 bg-transparent font-['Lato',sans-serif] text-[16px] font-bold leading-[24px] text-[#030712] outline-none"
          />
        </div>
      </label>
    </div>
  );
}
