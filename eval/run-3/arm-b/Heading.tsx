import { assets } from "./assets";

type HeadingProps = {
  title?: string;
  subtitle?: string;
};

export default function Heading({
  title = "Home loan",
  subtitle = "HL-24018-091",
}: HeadingProps) {
  return (
    <div className="flex h-[50px] w-full items-start gap-[12px]" data-name="Heading">
      <div className="relative shrink-0 rounded-[16px] bg-[#e7f4eb] backdrop-blur-[25px]">
        <div className="flex items-center justify-center p-[12px]">
          <div className="relative size-[24px] overflow-clip">
            <div className="absolute inset-[8.33%]">
              <div className="absolute inset-[-5%]">
                <img alt="" className="block size-full max-w-none" src={assets.headingIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-w-px flex-1 items-start justify-center gap-[2px]">
        <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[4px]">
          <p className="w-full overflow-hidden text-ellipsis font-['Lato',sans-serif] text-[16px] font-bold leading-[24px] text-[#030712]">
            {title}
          </p>
          <p className="w-full font-['Lato',sans-serif] text-[14px] font-semibold leading-[20px] text-[#374151]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
