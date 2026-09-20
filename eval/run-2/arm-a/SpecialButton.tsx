import type { ReactNode } from "react";

type SpecialButtonProps = {
  label: string;
  icon: ReactNode;
  href?: string;
  className?: string;
};

export function SpecialButton({
  label,
  icon,
  href,
  className,
}: SpecialButtonProps) {
  const classes = `flex min-w-[133px] flex-1 cursor-pointer flex-col items-center gap-3 rounded-[32px] border border-[#f3f4f6] bg-white px-[13px] py-[25px] shadow-[0_0_1.5px_#f9fafb] ${className ?? ""}`;

  const inner = (
    <>
      {icon}
      <p className="w-full text-center text-[14px] font-bold leading-5 text-[#21552f] whitespace-nowrap">
        {label}
      </p>
    </>
  );

  if (href) {
    return (
      <a className={classes} data-name="Special Button" href={href}>
        {inner}
      </a>
    );
  }

  return (
    <button className={classes} data-name="Special Button" type="button">
      {inner}
    </button>
  );
}
