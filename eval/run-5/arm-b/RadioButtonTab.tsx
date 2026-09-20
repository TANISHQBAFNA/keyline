type RadioButtonTabProps = {
  options: string[];
  value: string;
  onChange?: (value: string) => void;
};

export function RadioButtonTab({ options, value, onChange }: RadioButtonTabProps) {
  return (
    <div
      className="flex w-full items-center rounded-[16px] border border-solid border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-[4px]"
      data-name="Radio Button Tab"
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange?.(option)}
            className={
              selected
                ? "flex h-[44px] min-w-px flex-1 items-center justify-center overflow-clip rounded-[12px] border border-solid border-[#f3f4f6] bg-white px-[16px] py-[12px] shadow-[0px_0px_3px_0px_#f9fafb]"
                : "flex h-[44px] min-w-px flex-1 cursor-pointer items-center justify-center overflow-clip rounded-[12px] px-[16px] py-[12px]"
            }
            data-name="Radio Button Tab"
            aria-pressed={selected}
          >
            <p
              className={
                selected
                  ? "whitespace-nowrap text-center font-['Lato',sans-serif] text-[16px] font-semibold leading-[24px] text-[#21552f]"
                  : "whitespace-nowrap text-center font-['Lato',sans-serif] text-[14px] font-semibold leading-[20px] text-[#374151]"
              }
            >
              {option}
            </p>
          </button>
        );
      })}
    </div>
  );
}
