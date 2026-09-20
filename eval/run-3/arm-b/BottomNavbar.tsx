import { assets } from "./assets";

export default function BottomNavbar() {
  return (
    <nav
      className="relative flex w-full shrink-0 flex-col items-start overflow-clip rounded-[32px] border border-solid border-[#f3f4f6] shadow-[0px_0px_8px_1px_rgba(3,7,18,0.1)] backdrop-blur-[25px]"
      data-name="Bottom Navbar"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgb(249,250,251) 0%, rgba(249,250,251,0.9) 50%, rgba(249,250,251,0.5) 75%, rgba(249,250,251,0) 100%)",
      }}
    >
      <div className="flex w-full flex-col items-start gap-[12px] px-[16px] pb-[32px] pt-[16px]">
        <div className="flex h-[52px] w-full items-center justify-center gap-[12px]">
          <div className="flex min-w-px flex-1 flex-col items-start drop-shadow-[0px_0px_4px_rgba(3,7,18,0.1)] backdrop-blur-[25px]">
            <div className="flex w-full items-center justify-between rounded-[16px] border border-solid border-[#d1d5db] bg-white px-[13px] py-[13px]">
              <p className="whitespace-nowrap font-['Lato',sans-serif] text-[16px] font-normal leading-[24px] text-[#6b7280]">
                Search Loans...
              </p>
              <div className="relative size-[24px] shrink-0 overflow-clip">
                <div className="absolute inset-[12.5%]">
                  <div className="absolute inset-[-5.56%]">
                    <img alt="" className="block size-full max-w-none" src={assets.search} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex size-[48px] shrink-0 items-center justify-center rounded-[16px] p-[12px] drop-shadow-[0px_2px_4px_rgba(3,7,18,0.1)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 14% 87%, #12341d 0%, #21552f 100%)",
            }}
          >
            <div className="relative size-[24px] overflow-clip">
              <div className="absolute inset-[12.5%_8.33%]">
                <div className="absolute inset-[-5.56%_-5%]">
                  <img alt="" className="block size-full max-w-none" src={assets.sliders} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-[8px]">
          <a
            href="#home"
            className="flex shrink-0 cursor-pointer flex-col items-center drop-shadow-[0px_0px_4px_rgba(3,7,18,0.1)] backdrop-blur-[25px]"
          >
            <span className="flex items-start rounded-[20px] border border-solid border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-[12px]">
              <span className="relative size-[24px] overflow-clip">
                <span className="absolute inset-[9.45%_12.5%_12.5%_12.5%]">
                  <span className="absolute inset-[-5.34%_-5.56%]">
                    <img alt="" className="block size-full max-w-none" src={assets.home} />
                  </span>
                </span>
              </span>
            </span>
          </a>
          <div className="flex min-w-px flex-1 items-center justify-end rounded-[16px] border border-solid border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-[4px] shadow-[0px_0px_8px_0px_rgba(3,7,18,0.1)] backdrop-blur-[25px]">
            <a href="#accounts" className="flex min-w-[44px] flex-1 items-center justify-center overflow-clip rounded-[12px]">
              <span className="flex min-w-[44px] items-center justify-center px-[10px] py-[12px]">
                <span className="relative size-[20px] overflow-clip">
                  <span className="absolute inset-[12.6%_12.5%_12.5%_12.5%]">
                    <span className="absolute inset-[-6.68%_-6.67%]">
                      <img alt="" className="block size-full max-w-none" src={assets.bank} />
                    </span>
                  </span>
                </span>
              </span>
            </a>
            <a href="#cards" className="flex min-w-[44px] flex-1 items-center justify-center overflow-clip rounded-[12px]">
              <span className="flex min-w-[44px] items-center justify-center px-[10px] py-[12px]">
                <span className="relative size-[20px] overflow-clip">
                  <span className="absolute inset-[20.83%_8.33%]">
                    <span className="absolute inset-[-8.57%_-6%]">
                      <img alt="" className="block size-full max-w-none" src={assets.card} />
                    </span>
                  </span>
                </span>
              </span>
            </a>
            <a href="#deposits" className="flex min-w-[44px] flex-1 items-center justify-center overflow-clip rounded-[12px]">
              <span className="flex min-w-[44px] items-center justify-center px-[10px] py-[12px]">
                <span className="relative size-[20px] overflow-clip">
                  <span className="absolute inset-[12.5%_8.33%]">
                    <span className="absolute inset-[-6.67%_-6%]">
                      <img alt="" className="block size-full max-w-none" src={assets.deposits} />
                    </span>
                  </span>
                </span>
              </span>
            </a>
            <div className="flex h-[44px] min-w-0 flex-[1.4] items-center justify-center overflow-clip rounded-[12px] border border-solid border-[#f3f4f6] bg-white shadow-[0px_0px_3px_0px_#f9fafb]">
              <div className="flex flex-1 items-center justify-center gap-[8px] px-[12px] py-[12px]">
                <div className="relative size-[20px] shrink-0 overflow-clip">
                  <div className="absolute inset-[12.5%_8.33%]">
                    <div className="absolute inset-[-6.67%_-6%]">
                      <img alt="" className="block size-full max-w-none" src={assets.loans} />
                    </div>
                  </div>
                </div>
                <p className="whitespace-nowrap text-center font-['Lato',sans-serif] text-[14px] font-semibold leading-[20px] text-[#21552f]">
                  Loans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
