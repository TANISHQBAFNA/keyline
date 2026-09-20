const imgBank =
  "https://www.figma.com/api/mcp/asset/1f93d639-4aa2-4cde-bfdc-eb5c5ae5d010.svg";
const imgStar =
  "https://www.figma.com/api/mcp/asset/6db9c65a-69ca-433e-898a-354920168d44.svg";
const imgChevron =
  "https://www.figma.com/api/mcp/asset/0f18abb9-6058-4809-a167-6bb9386e7841.svg";

export function AccountSelector() {
  return (
    <div
      className="relative flex h-[48px] w-full shrink-0 items-center rounded-[32px] drop-shadow-[0px_0px_1.5px_#f9fafb]"
      data-name="Account Selector"
    >
      <div className="relative min-w-px flex-1" data-name="Container">
        <div className="flex size-full items-center justify-end gap-[8px]">
          <div className="relative flex min-w-px flex-1 items-center gap-[12px]" data-name="Heading">
            <div
              className="relative shrink-0 rounded-[16px] bg-[#e7f4eb] backdrop-blur-[25px]"
              data-name="Size=Large(48px)"
            >
              <div className="relative flex items-center justify-center p-[12px]">
                <div className="relative size-[24px] shrink-0 overflow-clip">
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgBank} />
                </div>
                <div className="absolute left-[35px] top-[-3px] size-[16px] overflow-clip" data-name="cbx-0653_star-01">
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgStar} />
                </div>
              </div>
            </div>
            <div className="min-w-px flex-1">
              <div className="flex w-full flex-col items-start justify-center gap-[4px]">
                <p className="w-full overflow-hidden text-ellipsis font-['Lato',sans-serif] text-[16px] font-bold leading-[24px] text-[#030712]">
                  Business Current Account
                </p>
                <p className="w-full font-['Lato',sans-serif] text-[14px] font-semibold leading-[20px] text-[#374151]">
                  AE45 1234 5678 9012 3456 • AED
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="relative flex max-h-[48px] max-w-[48px] min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center overflow-clip rounded-[16px] px-[16px] py-[12px]"
            data-name="Tertiary Button"
            aria-label="Select account"
          >
            <div className="relative size-[24px] shrink-0 overflow-clip">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgChevron} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
