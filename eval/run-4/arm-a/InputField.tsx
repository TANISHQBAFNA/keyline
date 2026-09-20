import { assets } from "./assets";

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
    <label className="content-stretch flex flex-col gap-[var(--spacing-4,4px)] items-start w-full" data-name="InputField">
      <span className="font-['Poppins',sans-serif] font-medium leading-[12px] text-[12px] text-[color:var(--text-primary,#111)]">
        {label}
      </span>
      <div className="bg-white border-[1.5px] border-[#a3a3a3] border-solid content-stretch flex items-center rounded-[4px] w-full">
        <span className="bg-[#e8ece9] content-stretch flex h-[34px] items-center justify-center px-[4px] rounded-bl-[4px] rounded-tl-[4px] shrink-0 w-[33px]">
          <span className="overflow-clip relative size-[20px]">
            <img alt="" className="block size-full max-w-none" src={assets.rupeePrefix} />
          </span>
        </span>
        <input
          className="flex-[1_0_0] h-[34px] min-w-px bg-transparent px-[var(--spacing-8,8px)] font-['Poppins',sans-serif] font-medium text-[12px] leading-[18px] text-[color:var(--text-primary,#111)] outline-none"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          aria-label={label}
        />
      </div>
    </label>
  );
}
