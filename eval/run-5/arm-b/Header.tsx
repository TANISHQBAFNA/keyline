const imgCellularConnection =
  "https://www.figma.com/api/mcp/asset/2c0fbfae-bfc5-4a5a-9b28-e50a0ced1501.svg";
const imgWifi =
  "https://www.figma.com/api/mcp/asset/882f569d-689c-463e-9f8e-46394e798ebb.svg";
const imgBattery =
  "https://www.figma.com/api/mcp/asset/b1742778-7677-4134-abe3-a0bc9227ac10.svg";
const imgClose =
  "https://www.figma.com/api/mcp/asset/5e284eb1-aa33-489a-8b2a-281e143acec3.svg";

export function Header() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col items-start backdrop-blur-[5px]"
      data-name="Header"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(231,244,235,0.1) 25%, rgba(231,244,235,0.5) 50%, rgba(231,244,235,0.9) 75%, rgba(231,244,235,0.9) 100%)",
      }}
    >
      <div
        className="relative flex w-full shrink-0 items-center justify-center gap-[6px] px-[16px] py-[11px]"
        data-name="Status bar - iPhone"
      >
        <div className="relative flex h-[22px] min-w-px flex-1 items-center justify-center pt-[2px]">
          <p className="shrink-0 whitespace-nowrap text-center font-['SF_Pro',sans-serif] text-[17px] font-semibold leading-[22px] text-[#030712]">
            9:41
          </p>
        </div>
        <div className="relative h-[37px] w-[125px] shrink-0 rounded-[100px]" />
        <div className="relative flex h-[22px] min-w-px flex-1 items-center justify-center gap-[7px] pt-px">
          <div className="relative h-[12.226px] w-[19.2px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgCellularConnection} />
          </div>
          <div className="relative h-[12.328px] w-[17.142px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgWifi} />
          </div>
          <div className="relative h-[13px] w-[27.328px] shrink-0 overflow-clip">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgBattery} />
          </div>
        </div>
      </div>
      <div className="relative flex w-full shrink-0 items-center justify-between p-[8px]" data-name="Container">
        <div className="size-[48px] shrink-0" data-name="Left Section" />
        <div className="min-w-px flex-1">
          <div className="flex w-full flex-col items-start justify-center">
            <div className="relative flex w-full items-center justify-center px-[30px]" data-name="Heading">
              <p className="shrink-0 whitespace-nowrap text-center font-['Lato',sans-serif] text-[20px] font-bold leading-[28px] text-[#030712]">
                Generate Statement
              </p>
            </div>
            <div className="relative flex w-full items-center justify-center px-[30px]" data-name="Entity">
              <p className="shrink-0 whitespace-nowrap text-center font-['Lato',sans-serif] text-[14px] font-bold leading-[20px] text-[#6b7280]">
                Emaar Consumer vehicles
              </p>
            </div>
          </div>
        </div>
        <button type="button" className="relative shrink-0 cursor-pointer" data-name="Right Section" aria-label="Close">
          <div
            className="relative flex max-h-[48px] max-w-[48px] min-h-[48px] min-w-[48px] items-start rounded-[16px] border border-solid border-[#21552f] bg-[rgba(255,255,255,0.9)] p-[12px] backdrop-blur-[25px]"
            data-name="Secondary Button"
          >
            <div className="relative size-[24px] shrink-0 overflow-clip" data-name="cbx-0502_x-close">
              <div className="absolute inset-1/4 overflow-clip">
                <img alt="" className="block size-full max-w-none" src={imgClose} />
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
