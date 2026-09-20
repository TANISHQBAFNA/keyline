import type { ReactNode } from "react";
import Amount from "./Amount";
import Heading from "./Heading";

type MainCardProps = {
  children?: ReactNode;
};

export default function MainCard({ children }: MainCardProps) {
  return (
    <section
      className="relative flex w-full flex-col items-center rounded-[24px] border border-solid border-[#f3f4f6] bg-white p-[16px] drop-shadow-[0px_0px_1.5px_#f9fafb]"
      data-name="Main Card"
    >
      <div className="flex w-full flex-col items-start gap-[16px]" data-name="Slot">
        {children ?? (
          <>
            <Heading title="Home loan" />
            <Amount label="Outstanding Balance" value="2,40,000" currency="₹" />
          </>
        )}
      </div>
    </section>
  );
}
