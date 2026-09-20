import { Icon } from "./Icon";
import {
  imgBank,
  imgCoins,
  imgCreditCard,
  imgHome,
  imgPiggyBank,
  imgSearch,
  imgSliders,
} from "./assets";

export function BottomNavbar() {
  return (
    <nav
      className="absolute bottom-0 left-0 flex w-[440px] flex-col items-start overflow-clip rounded-[32px] border border-[#f3f4f6] shadow-[0_0_8px_1px_rgba(3,7,18,0.1)] backdrop-blur-[25px] [background-image:linear-gradient(0deg,#f9fafb_0%,rgba(249,250,251,0.9)_50%,rgba(249,250,251,0.5)_75%,rgba(249,250,251,0)_100%)]"
      data-name="Bottom Navbar"
    >
      <div className="flex w-full flex-col items-start gap-3 px-4 pb-8 pt-4">
        <div className="flex h-[52px] w-full items-center justify-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-[#d1d5db] bg-white px-[13px] py-[13px] shadow-[0_0_4px_rgba(3,7,18,0.1)]">
            <p className="text-[16px] font-normal leading-6 text-[#6b7280]">
              Search Loans...
            </p>
            <Icon src={imgSearch} size={24} />
          </div>
          <button
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-[0_2px_4px_rgba(3,7,18,0.1),0_4px_4px_rgba(3,7,18,0.1)] [background-image:linear-gradient(180deg,#12341d_0%,#21552f_100%)]"
            type="button"
          >
            <Icon src={imgSliders} size={24} />
          </button>
        </div>

        <div className="flex w-full items-center gap-2">
          <a
            className="flex shrink-0 flex-col items-center"
            href="#home"
          >
            <div className="flex items-start rounded-[20px] border border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-3 backdrop-blur-[25px]">
              <Icon src={imgHome} size={24} />
            </div>
          </a>

          <div className="flex min-w-0 flex-1 items-center justify-end rounded-2xl border border-[#d1d5db] bg-[rgba(231,244,235,0.9)] p-1 shadow-[0_0_8px_rgba(3,7,18,0.1)] backdrop-blur-[25px]">
            <a
              className="flex max-w-16 min-w-11 flex-1 items-center justify-center px-[22px] py-3"
              href="#accounts"
            >
              <Icon src={imgBank} size={20} />
            </a>
            <a
              className="flex max-w-16 min-w-11 flex-1 items-center justify-center px-[22px] py-3"
              href="#cards"
            >
              <Icon src={imgCreditCard} size={20} />
            </a>
            <a
              className="flex max-w-16 min-w-11 flex-1 items-center justify-center px-[22px] py-3"
              href="#deposits"
            >
              <Icon src={imgPiggyBank} size={20} />
            </a>
            <div className="flex h-11 min-w-[160px] flex-1 items-center justify-center gap-2 overflow-clip rounded-xl border border-[#f3f4f6] bg-white px-4 py-3 shadow-[0_0_3px_#f9fafb]">
              <Icon src={imgCoins} size={20} />
              <p className="text-center text-[14px] font-semibold leading-5 text-[#21552f]">
                Loans
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
