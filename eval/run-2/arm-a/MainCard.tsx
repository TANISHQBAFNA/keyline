import type { ReactNode } from "react";

type MainCardVariant = "hero" | "promo" | "default";

type MainCardProps = {
  children: ReactNode;
  variant?: MainCardVariant;
  href?: string;
  className?: string;
};

const variantClass: Record<MainCardVariant, string> = {
  hero: "overflow-clip border border-[#f3f4f6] p-4 [background-image:linear-gradient(64deg,#12341d_3.6%,#21552f_98%)]",
  promo:
    "border border-[#f3f4f6] bg-[#e3f2ff] p-4 shadow-[0_0_1.5px_#f9fafb]",
  default:
    "border border-[#f3f4f6] bg-white p-4 shadow-[0_0_1.5px_#f9fafb]",
};

export function MainCard({
  children,
  variant = "default",
  href,
  className,
}: MainCardProps) {
  const classes = `relative flex w-full shrink-0 flex-col items-center rounded-[24px] ${variantClass[variant]} ${className ?? ""}`;

  const slot = (
    <div className="flex w-full flex-col items-start" data-name="Slot">
      {children}
    </div>
  );

  if (href) {
    return (
      <a className={classes} data-name="Main Card" href={href}>
        {slot}
      </a>
    );
  }

  return (
    <div className={classes} data-name="Main Card">
      {slot}
    </div>
  );
}
