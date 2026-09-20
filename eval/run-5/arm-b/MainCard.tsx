import type { ReactNode } from "react";

type MainCardProps = {
  children: ReactNode;
};

export function MainCard({ children }: MainCardProps) {
  return (
    <div
      className="relative flex w-full flex-col items-center rounded-[24px] border border-solid border-[#f3f4f6] bg-white p-[16px] drop-shadow-[0px_0px_1.5px_#f9fafb]"
      data-name="Main Card"
    >
      <div className="relative flex w-full shrink-0 flex-col items-start" data-name="Slot">
        {children}
      </div>
    </div>
  );
}
