import { assets } from "./assets";

type SpecialButtonProps = {
  label?: string;
  onClick?: () => void;
};

export default function SpecialButton({ label = "Pay", onClick }: SpecialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col items-center gap-[12px] rounded-[32px] border border-solid border-[#f3f4f6] bg-white px-[13px] py-[25px] drop-shadow-[0px_0px_1.5px_#f9fafb]"
      data-name="Special Button"
    >
      <div className="relative shrink-0 rounded-[16px] bg-[#e7f4eb] backdrop-blur-[25px]">
        <div className="flex items-center justify-center p-[12px]">
          <div className="relative size-[24px] overflow-clip">
            <div className="absolute inset-[20.83%]">
              <div className="absolute inset-[-7.14%]">
                <img alt="" className="block size-full max-w-none" src={assets.plusIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="whitespace-nowrap text-center font-['Lato',sans-serif] text-[14px] font-bold leading-[20px] text-[#21552f]">
        {label}
      </p>
    </button>
  );
}
