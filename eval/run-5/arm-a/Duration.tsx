import { chevronDownIcon } from "./assets";

export function Duration() {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-4">
      <div className="flex w-full shrink-0 items-center rounded-2xl border border-solid border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-1">
        <div className="flex h-[44px] min-w-px flex-1 items-center justify-center overflow-clip rounded-xl border border-solid border-[#f3f4f6] bg-white shadow-[0px_0px_3px_#f9fafb,0px_0px_3px_#f9fafb]">
          <div className="flex h-full min-w-px flex-1 items-center justify-center gap-2 px-4 py-3">
            <p className="whitespace-nowrap text-center text-[16px] font-semibold leading-6 text-[#21552f]">
              By Duration
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-11 min-w-px flex-1 flex-col items-center justify-center overflow-clip rounded-xl"
        >
          <span className="flex min-h-px w-full flex-1 items-center justify-center gap-2 px-4 py-3">
            <span className="whitespace-nowrap text-center text-[14px] font-semibold leading-5 text-[#374151]">
              By Fiscal Year
            </span>
          </span>
        </button>
      </div>

      <button type="button" className="flex w-full shrink-0 flex-col items-start gap-2">
        <div className="flex h-[21px] w-full shrink-0 items-center gap-1 px-1">
          <p className="whitespace-nowrap text-left text-[14px] font-normal leading-5 text-[#374151]">
            Duration
          </p>
        </div>
        <div className="relative flex w-full items-center justify-between rounded-2xl border border-solid border-[#d1d5db] p-[13px]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white" />
          <div className="relative min-w-px flex-1 overflow-clip">
            <p className="whitespace-nowrap text-left text-[16px] font-bold leading-6 text-[#030712]">
              Monthly
            </p>
          </div>
          <div className="relative size-6 shrink-0 overflow-clip">
            <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
              <div className="absolute inset-[-16.67%_-8.33%]">
                <img alt="" className="block size-full max-w-none" src={chevronDownIcon} />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_1px_1px_2px_0px_rgba(3,7,18,0.1),inset_-1px_-1px_2px_0px_rgba(3,7,18,0.1)]" />
        </div>
      </button>
    </div>
  );
}
