import { Icon } from "./Icon";

type SpecialButtonProps = {
  iconSrc: string;
  label: string;
  href?: string;
};

export function SpecialButton({ iconSrc, label, href = "#" }: SpecialButtonProps) {
  return (
    <a
      href={href}
      className="flex min-w-[133px] flex-1 cursor-pointer flex-col items-center gap-3 rounded-[32px] border border-[#f3f4f6] bg-white px-[13px] py-[25px] shadow-[0_0_3px_#f9fafb]"
    >
      <div className="flex items-center justify-center rounded-2xl bg-[#e7f4eb] p-3 backdrop-blur-[25px]">
        <Icon src={iconSrc} size={24} />
      </div>
      <p className="w-full text-center text-[14px] font-bold leading-5 text-[#21552f] whitespace-nowrap">
        {label}
      </p>
    </a>
  );
}
