import type { ReactNode } from "react";

type InputFieldProps = {
  label: string;
  children: ReactNode;
};

export function InputField({ label, children }: InputFieldProps) {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-[8px]" data-name="Input Field">
      <div className="relative flex h-[21px] w-full shrink-0 items-center gap-[4px]">
        <p className="whitespace-nowrap font-['Lato',sans-serif] text-[14px] font-normal leading-[20px] text-[#374151]">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}
