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
      <div
        className="flex w-full shrink-0 items-center justify-center gap-[6px] px-[16px] py-[11px]"
        data-name="Status bar - iPhone"
      >
        <div className="flex h-[22px] min-w-px flex-1 items-center justify-center pt-[2px]" data-name="Time">
          <p
            className="shrink-0 whitespace-nowrap text-center text-[17px] leading-[22px] text-[#030712]"
            style={{ fontFamily: "SF Pro, system-ui, sans-serif", fontWeight: 590 }}
          >
            9:41
          </p>
        </div>
        <div className="h-[37px] w-[125px] shrink-0 rounded-[100px]" data-name="Dynamic Island spacer" />
        <div
          className="flex h-[22px] min-w-px flex-1 items-center justify-center gap-[7px] pt-px"
          data-name="Levels"
        >
          <div className="relative h-[12.226px] w-[19.2px] shrink-0 overflow-clip" data-name="Cellular Connection">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={assets.cellular} />
          </div>
          <div className="relative h-[12.328px] w-[17.142px] shrink-0 overflow-clip" data-name="Wifi">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={assets.wifi} />
          </div>
          <div className="relative h-[13px] w-[27.328px] shrink-0 overflow-clip" data-name="Battery">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={assets.battery} />
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between p-[8px]" data-name="Container">
        <button
          type="button"
          className="relative shrink-0 cursor-pointer"
          data-name="Left Section"
          aria-label="Back"
          onClick={onBack}
        >
          <div
            className="flex size-[48px] max-h-[48px] max-w-[48px] min-h-[48px] min-w-[48px] items-start rounded-[16px] border border-solid border-[#21552f] bg-[rgba(255,255,255,0.9)] p-[12px] backdrop-blur-[25px]"
            data-name="Secondary Button"
          >
            <div className="relative size-[24px] overflow-clip" data-name="Button Icon">
              <img alt="" className="block size-full max-w-none" src={assets.chevronLeft} />
            </div>
          </div>
        </button>

        <div className="min-w-px flex-1">
          <div className="flex w-full items-center justify-center px-[30px]" data-name="Heading">
            <p
              className="shrink-0 whitespace-nowrap text-center text-[20px] font-bold leading-[28px] text-[#030712]"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              {title}
            </p>
          </div>
        </div>

        <div className="relative size-[48px] shrink-0" data-name="Right Section" />
      </div>
    </header>
  );
}
