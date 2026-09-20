import { Icon } from "./Icon";
import { imgBattery, imgCellular, imgChevronDown, imgWifi } from "./assets";

export function Header() {
  return (
    <header
      className="absolute left-1/2 top-0 flex w-[440px] -translate-x-1/2 flex-col items-start backdrop-blur-[5px] [background-image:linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(231,244,235,0.1)_25%,rgba(231,244,235,0.5)_50%,rgba(231,244,235,0.9)_75%,rgba(231,244,235,0.9)_100%)]"
      data-name="Header"
    >
      <div className="flex w-full items-center justify-center gap-1.5 px-4 py-[11px]">
        <div className="flex h-[22px] flex-1 items-center justify-center pt-0.5">
          <p className="text-center text-[17px] font-semibold leading-[22px] text-[#030712]">
            9:41
          </p>
        </div>
        <div className="h-[37px] w-[125px] shrink-0 rounded-[100px]" />
        <div className="flex h-[22px] flex-1 items-center justify-center gap-[7px] pt-px">
          <div className="relative h-[12.226px] w-[19.2px] shrink-0 overflow-clip">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={imgCellular}
            />
          </div>
          <div className="relative h-[12.328px] w-[17.142px] shrink-0 overflow-clip">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={imgWifi}
            />
          </div>
          <div className="relative h-[13px] w-[27.328px] shrink-0 overflow-clip">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={imgBattery}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between p-2">
        <div className="size-12 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <p className="px-[30px] text-center text-[20px] font-bold leading-7 text-[#030712]">
            Loans
          </p>
          <button
            className="flex cursor-pointer items-center justify-center gap-1"
            type="button"
          >
            <span className="text-center text-[14px] font-bold leading-5 text-[#3a6fe2] underline">
              Emaar Consumer vehicles
            </span>
            <Icon src={imgChevronDown} size={20} />
          </button>
        </div>
        <div className="size-12 shrink-0" />
      </div>
    </header>
  );
}
