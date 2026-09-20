import { assets } from "./assets";

type HeaderProps = {
  title?: string;
  onBack?: () => void;
};

export default function Header({ title = "Pay now", onBack }: HeaderProps) {
  return (
    <header
      className="relative flex w-full shrink-0 flex-col items-start backdrop-blur-[5px]"
      data-name="Header"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(231,244,235,0.1) 25%, rgba(231,244,235,0.5) 50%, rgba(231,244,235,0.9) 75%, rgba(231,244,235,0.9) 100%)",
      }}
    >
      <div className="flex w-full items-center justify-center gap-[6px] px-[16px] py-[11px]">
        <div className="flex h-[22px] min-w-px flex-1 items-center justify-center pt-[2px]">
          <p className="whitespace-nowrap text-center text-[17px] font-[590] leading-[22px] text-[#030712]">
            9:41
          </p>
        </div>
        <div className="h-[37px] w-[92px] shrink-0 rounded-[100px]" />
        <div className="flex h-[22px] min-w-px flex-1 items-center justify-center gap-[7px] pt-px">
          <div className="relative h-[12.226px] w-[19.2px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={assets.cellular} />
          </div>
          <div className="relative h-[12.328px] w-[17.142px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={assets.wifi} />
          </div>
          <div className="relative h-[13px] w-[27.328px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={assets.battery} />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between p-[8px]">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex size-[48px] shrink-0 cursor-pointer items-center"
        >
          <span className="flex size-[48px] max-h-[48px] max-w-[48px] items-start rounded-[16px] border border-solid border-[#21552f] bg-[rgba(255,255,255,0.9)] p-[12px] backdrop-blur-[25px]">
            <span className="relative size-[24px] overflow-clip">
              <span className="absolute left-[37.5%] right-[37.5%] top-1/2 aspect-[6/12] -translate-y-1/2">
                <span className="absolute inset-[-8.33%_-16.67%]">
                  <img alt="" className="block size-full max-w-none" src={assets.chevronLeft} />
                </span>
              </span>
            </span>
          </span>
        </button>
        <div className="flex min-w-px flex-1 flex-col items-center justify-center">
          <div className="flex w-full items-center justify-center px-[30px]">
            <p className="whitespace-nowrap text-center font-['Lato',sans-serif] text-[20px] font-bold leading-[28px] text-[#030712]">
              {title}
            </p>
          </div>
        </div>
        <div className="size-[48px] shrink-0" />
      </div>
    </header>
  );
}
