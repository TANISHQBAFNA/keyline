type InputFieldProps = {
  label: string;
  options: string[];
  selected: string;
};

export function InputField({ label, options, selected }: InputFieldProps) {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-2">
      <div className="flex h-[21px] w-full max-w-[360px] shrink-0 items-center gap-1">
        <p className="whitespace-nowrap text-[14px] font-normal leading-5 text-[#374151]">
          {label}
        </p>
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex w-full shrink-0 items-center rounded-2xl border border-solid border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-1"
      >
        {options.map((option) => {
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={
                isSelected
                  ? "flex h-[44px] min-w-px flex-1 items-center justify-center overflow-clip rounded-xl border border-solid border-[#f3f4f6] bg-white shadow-[0px_0px_3px_#f9fafb,0px_0px_3px_#f9fafb]"
                  : "flex h-11 min-w-px flex-1 flex-col items-center justify-center overflow-clip rounded-xl"
              }
            >
              <span className="flex h-full min-w-px w-full flex-1 items-center justify-center gap-2 px-4 py-3">
                <span
                  className={
                    isSelected
                      ? "whitespace-nowrap text-center text-[16px] font-semibold leading-6 text-[#21552f]"
                      : "whitespace-nowrap text-center text-[14px] font-semibold leading-5 text-[#374151]"
                  }
                >
                  {option}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
