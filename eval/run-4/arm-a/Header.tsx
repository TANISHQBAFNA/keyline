import { assets } from "./assets";

type HeaderProps = {
  title?: string;
  onBack?: () => void;
};

export default function Header({ title = "Pay now", onBack }: HeaderProps) {
  return (
    <header
      className="bg-[#e8ece9] content-stretch flex gap-[16px] h-[50px] items-center px-[16px] py-[8px] relative w-full"
      data-name="Header"
    >
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className="bg-[#f6f6f6] border-[1.5px] border-[#12341d] border-solid content-stretch flex h-[32px] items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0"
        data-name="back-button"
      >
        <span className="overflow-clip relative shrink-0 size-[16px]">
          <img alt="" className="block size-full max-w-none" src={assets.backChevron} />
        </span>
      </button>
      <div className="content-stretch flex flex-[1_0_0] h-full items-center min-w-px">
        <h1 className="font-['Poppins',sans-serif] font-semibold leading-[20px] text-[14px] text-[color:var(--text-primary,#111)]">
          {title}
        </h1>
      </div>
    </header>
  );
}
