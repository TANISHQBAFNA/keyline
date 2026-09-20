import { bankIcon, starIcon, arrowDownRightIcon } from "./assets";

export function AccountSelector() {
  return (
    <div className="relative flex h-12 w-full shrink-0 items-center rounded-[32px] shadow-[0px_0px_1.5px_#f9fafb,0px_0px_1.5px_#f9fafb]">
      <div className="flex min-w-px flex-1 items-center justify-end gap-2">
        <div className="flex min-w-px flex-1 items-center gap-3">
          <div className="relative shrink-0 rounded-2xl bg-[#e7f4eb] backdrop-blur-[25px]">
            <div className="relative flex items-center justify-center p-3">
              <div className="relative size-6 shrink-0 overflow-clip">
                <div className="absolute inset-[12.5%]">
                  <div className="absolute inset-[-5.56%]">
                    <img alt="" className="block size-full max-w-none" src={bankIcon} />
                  </div>
                </div>
              </div>
              <div className="absolute left-[35px] top-[-3px] size-4 overflow-clip">
                <div className="absolute inset-[10.96%_10.73%_14.16%_10.73%]">
                  <div className="absolute inset-[-4.17%_-3.98%]">
                    <img alt="" className="block size-full max-w-none" src={starIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-1">
            <p className="w-full overflow-hidden text-ellipsis text-[16px] font-bold leading-6 text-[#030712]">
              Business Current Account
            </p>
            <p className="w-full text-[14px] font-semibold leading-5 text-[#374151]">
              AE45 1234 5678 9012 3456 • AED
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Change account"
          className="flex size-12 max-h-12 max-w-12 min-h-12 min-w-12 shrink-0 flex-col items-center justify-center overflow-clip rounded-2xl px-4 py-3"
        >
          <span className="relative size-6 overflow-clip">
            <span className="absolute inset-[29.17%]">
              <span className="absolute inset-[-10%]">
                <img alt="" className="block size-full max-w-none" src={arrowDownRightIcon} />
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
