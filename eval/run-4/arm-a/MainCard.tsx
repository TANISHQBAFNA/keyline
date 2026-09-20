import { assets } from "./assets";
import Amount from "./Amount";
import Heading from "./Heading";

type MainCardProps = {
  heading?: string;
  amount?: string;
  caption?: string;
};

export default function MainCard({
  heading = "Home loan",
  amount = "₹2,40,000",
  caption = "Outstanding balance",
}: MainCardProps) {
  return (
    <section
      className="bg-white border border-solid border-[#e2e2e2] content-stretch flex flex-col gap-[8px] items-start p-[16px] relative rounded-[8px] w-full"
      data-name="MainCard"
    >
      <div className="content-stretch flex gap-[16px] items-start w-full">
        <div
          className="bg-[#e8ece9] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[40px]"
          data-name="card__icon"
        >
          <span className="overflow-clip relative size-[24px]">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={assets.cardGlyphBg} />
            <img alt="" className="absolute inset-[8%] size-[84%] max-w-none" src={assets.loanB} />
          </span>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--spacing-4,4px)] items-start min-w-px">
          <Heading>{heading}</Heading>
          <Amount value={amount} caption={caption} />
        </div>
      </div>
    </section>
  );
}
