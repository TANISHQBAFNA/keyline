import { cellularConnectionIcon, wifiIcon, batteryIcon, closeIcon } from "./assets";

export function Header() {
  return (
    <header
      className="absolute left-1/2 top-0 flex w-[440px] -translate-x-1/2 flex-col items-start backdrop-blur-[5px]"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(231,244,235,0.1) 25%, rgba(231,244,235,0.5) 50%, rgba(231,244,235,0.9) 75%, rgba(231,244,235,0.9) 100%)",
      }}
    >
      <div className="flex w-full items-center justify-center gap-[6px] px-4 py-[11px]">
        <div className="flex h-[22px] min-w-px flex-1 items-center justify-center pt-[2px]">
          <p className="text-center text-[17px] font-semibold leading-[22px] text-[#030712]">
            9:41
          </p>
        </div>
        <div className="h-[37px] w-[125px] shrink-0 rounded-[100px]" />
        <div className="flex h-[22px] min-w-px flex-1 items-center justify-center gap-[7px] pt-px">
          <div className="relative h-[12.226px] w-[19.2px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={cellularConnectionIcon} />
          </div>
          <div className="relative h-[12.328px] w-[17.142px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={wifiIcon} />
          </div>
          <div className="relative h-[13px] w-[27.328px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={batteryIcon} />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between p-2">
        <div className="size-12 shrink-0" />
        <div className="flex min-w-px flex-1 flex-col items-start justify-center">
          <div className="flex w-full items-center justify-center px-[30px]">
            <h1 className="whitespace-nowrap text-center text-[20px] font-bold leading-[28px] text-[#030712]">
              Generate Statement
            </h1>
          </div>
          <div className="flex w-full items-center justify-center px-[30px]">
            <p className="whitespace-nowrap text-center text-[14px] font-bold leading-5 text-[#6b7280]">
              Emaar Consumer vehicles
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close"
          className="flex shrink-0 items-center"
        >
          <span className="flex size-12 max-h-12 max-w-12 min-h-12 min-w-12 items-start rounded-2xl border border-solid border-[#21552f] bg-[rgba(255,255,255,0.9)] p-3 backdrop-blur-[25px]">
            <span className="relative size-6 overflow-clip">
              <span className="absolute inset-1/4">
                <span className="absolute inset-[-8.33%]">
                  <img alt="" className="block size-full max-w-none" src={closeIcon} />
                </span>
              </span>
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}
