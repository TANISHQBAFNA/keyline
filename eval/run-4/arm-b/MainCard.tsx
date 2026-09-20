import type { ReactNode } from "react";

type MainCardProps = {
  children: ReactNode;
};

export function MainCard({ children }: MainCardProps) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
      {children}
    </section>
  );
}
