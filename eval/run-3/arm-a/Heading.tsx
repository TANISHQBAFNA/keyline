import { assets } from "./assets";

type HeadingProps = {
  title?: string;
  subtitle?: string;
};

export default function Heading({
  title = "Home loan",
  subtitle,
}: HeadingProps) {
  return (
    <div className="flex h-[50px] w-full items-center gap-[12px]" data-name="Heading">
      <div
        className="relative shrink-0 rounded-[16px] bg-[#e7f4eb] backdrop-blur-[25px]"
        data-name="Style Icon"
      >
        <div className="flex items-center justify-center p-[12px]">
          <div className="relative size-[24px] overflow-clip" data-name="cbx-0111_trend-up-01">
            <img alt="" className="block size-full max-w-none" src={assets.trendUp} />
          </div>
        </div>
      </div>
      <div className="min-w-px flex-1" data-name="Container">
        <div className="flex flex-col items-start justify-center gap-[4px]" data-name="Header">
          <p
            className="w-full overflow-hidden text-ellipsis text-[16px] font-bold leading-[24px] text-[#030712]"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {title}
          </p>
          {subtitle ? (
            <p
              className="w-full text-[14px] font-semibold leading-[20px] text-[#374151]"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
