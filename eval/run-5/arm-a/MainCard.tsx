import type { ReactNode } from "react";

export function MainCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-center rounded-[24px] border border-solid border-[#f3f4f6] bg-white p-4 shadow-[0px_0px_1.5px_#f9fafb,0px_0px_1.5px_#f9fafb]">
      <div className="relative flex w-full shrink-0 flex-col items-start gap-4">
        {children}
      </div>
    </div>
  );
}
