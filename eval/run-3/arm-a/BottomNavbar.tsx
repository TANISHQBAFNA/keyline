import { assets } from "./assets";

export default function BottomNavbar() {
  return (
    <nav
      className="relative flex w-full flex-col items-start overflow-clip rounded-[32px] border border-solid border-[#f3f4f6] shadow-[0px_0px_8px_1px_rgba(3,7,18,0.1)] backdrop-blur-[25px]"
      data-name="Bottom Navbar"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgb(249,250,251) 0%, rgba(249,250,251,0.9) 50%, rgba(249,250,251,0.5) 75%, rgba(249,250,251,0) 100%)",
      }}
    >
      <div className="flex w-full flex-col items-start px-[16px] pb-[32px] pt-[16px]" data-name="Navigation">
        <div className="mb-[12px] flex h-[52px] w-full items-center justify-center gap-[12px]" data-name="Search Bar">
          <div
            className="flex min-w-px flex-1 items-center justify-between rounded-[16px] border border-solid border-[#d1d5db] bg-white px-[13px] py-[13px] drop-shadow-[0px_0px_4px_rgba(3,7,18,0.1)]"
            data-name="Input Field"
          >
            <p
              className="whitespace-nowrap text-[16px] font-normal leading-[24px] text-[#6b7280]"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Search...
            </p>
            <div className="relative size-[24px] overflow-clip" data-name="cbx-0549_search-md">
              <img alt="" className="block size-full max-w-none" src={assets.search} />
            </div>
          </div>
          <div
            className="flex size-[48px] shrink-0 items-center justify-center rounded-[16px] p-[12px] shadow-[0px_2px_4px_rgba(3,7,18,0.1),0px_4px_4px_rgba(3,7,18,0.1)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgb(18,52,29) 0%, rgb(33,85,47) 100%)",
            }}
            data-name="Primary Button"
          >
            <div className="relative size-[24px] overflow-clip" data-name="cbx-0781_sliders-01">
              <img alt="" className="block size-full max-w-none" src={assets.sliders} />
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-[8px]" data-name="Tab">
          <a
            className="flex shrink-0 cursor-pointer flex-col items-center"
            data-name="Navbar Button"
          >
            <div className="flex items-start rounded-[20px] border border-solid border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-[12px] backdrop-blur-[25px]">
              <div className="relative size-[24px] overflow-clip" data-name="home-02">
                <img alt="" className="block size-full max-w-none" src={assets.home} />
              </div>
            </div>
          </a>

          <div className="flex min-w-px flex-1 items-center justify-end rounded-[16px] border border-solid border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-[4px] shadow-[0px_0px_8px_0px_rgba(3,7,18,0.1)] backdrop-blur-[25px]">
            <a className="flex min-w-[44px] flex-1 items-center justify-center overflow-clip rounded-[12px]">
              <div className="flex min-w-[44px] items-center justify-center px-[8px] py-[12px]">
                <div className="relative size-[20px] overflow-clip" data-name="cbx-0332_bank">
                  <img alt="" className="block size-full max-w-none" src={assets.bank} />
                </div>
              </div>
            </a>
            <a className="flex min-w-[44px] flex-1 items-center justify-center overflow-clip rounded-[12px]">
              <div className="flex min-w-[44px] items-center justify-center px-[8px] py-[12px]">
                <div className="relative size-[20px] overflow-clip" data-name="cbx-0347_credit-card-01">
                  <img alt="" className="block size-full max-w-none" src={assets.creditCard} />
                </div>
              </div>
            </a>
            <a className="flex min-w-[44px] flex-1 items-center justify-center overflow-clip rounded-[12px]">
              <div className="flex min-w-[44px] items-center justify-center px-[8px] py-[12px]">
                <div className="relative size-[20px] overflow-clip" data-name="cbx-0386_piggy-bank-01">
                  <img alt="" className="block size-full max-w-none" src={assets.piggyBank} />
                </div>
              </div>
            </a>
            <div
              className="flex h-[44px] min-w-0 flex-[1.4] items-center justify-center overflow-clip rounded-[12px] border border-solid border-[#f3f4f6] bg-white shadow-[0px_0px_3px_0px_#f9fafb]"
              data-name="Tab 04"
            >
              <div className="flex items-center justify-center gap-[8px] px-[12px] py-[12px]">
                <div className="relative size-[20px] overflow-clip" data-name="cbx-0343_coins-stacked-03">
                  <img alt="" className="block size-full max-w-none" src={assets.coins} />
                </div>
                <p
                  className="whitespace-nowrap text-center text-[14px] font-semibold leading-[20px] text-[#21552f]"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
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
