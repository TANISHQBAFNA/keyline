import { Heading } from "./Heading";
import { Icon } from "./Icon";
import { imgBattery, imgCellular, imgChevronDown, imgWifi } from "./assets";

export function Header() {
  return (
    <header
      className="absolute left-1/2 top-0 z-10 flex w-[440px] -translate-x-1/2 flex-col items-start backdrop-blur-[5px]"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(231,244,235,0.1) 25%, rgba(231,244,235,0.5) 50%, rgba(231,244,235,0.9) 75%, rgba(231,244,235,0.9) 100%)",
      }}
    >
      <div className="flex w-full items-center justify-center gap-1.5 px-4 py-[11px]">
        <div className="flex h-[22px] flex-1 items-center justify-center pt-0.5">
          <p className="text-center text-[17px] font-semibold leading-[22px] text-[#030712]">
            9:41
          </p>
        </div>
        <div className="h-[37px] w-[125px] rounded-full" />
        <div className="flex h-[22px] flex-1 items-center justify-center gap-[7px] pt-px">
          <div className="relative h-[12.226px] w-[19.2px] shrink-0 overflow-clip">
            <img
              alt=""
              src={imgCellular}
              width={19.2}
              height={12.226}
              className="absolute inset-0 block size-full max-w-none"
            />
          </div>
          <div className="relative h-[12.328px] w-[17.142px] shrink-0 overflow-clip">
            <img
              alt=""
              src={imgWifi}
              width={17.142}
              height={12.328}
              className="absolute inset-0 block size-full max-w-none"
            />
          </div>
          <div className="relative h-[13px] w-[27.328px] shrink-0 overflow-clip">
            <img
              alt=""
              src={imgBattery}
              width={27.328}
              height={13}
              className="absolute inset-0 block size-full max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between p-2">
        <div className="size-12 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <Heading
            title="Loans"
            titleSize="md"
            align="center"
            className="w-full justify-center px-[30px]"
          />
          <button
            type="button"
            className="flex items-center justify-center gap-1"
          >
            <span className="text-center text-[14px] font-bold leading-5 text-[#3a6fe2] underline whitespace-nowrap">
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
