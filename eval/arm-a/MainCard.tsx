import { ReactNode } from "react";

type MainCardVariant = "summary" | "info" | "default";

type MainCardProps = {
  children: ReactNode;
  variant?: MainCardVariant;
  href?: string;
  className?: string;
};

const variantClasses: Record<MainCardVariant, string> = {
  summary:
    "border border-[#f3f4f6] p-4 rounded-[24px] overflow-clip",
  info: "bg-[#e3f2ff] border border-[#f3f4f6] p-4 rounded-[24px] shadow-[0_0_3px_#f9fafb]",
  default:
    "bg-white border border-[#f3f4f6] p-4 rounded-[24px] shadow-[0_0_3px_#f9fafb]",
};

export function MainCard({
  children,
  variant = "default",
  href,
  className = "",
}: MainCardProps) {
  const classes = `flex w-full shrink-0 flex-col items-center ${variantClasses[variant]} ${className}`;
  const style =
    variant === "summary"
      ? {
          backgroundImage:
            "linear-gradient(64deg, rgb(18, 52, 29) 3.6%, rgb(33, 85, 47) 98%)",
        }
      : undefined;

  const inner = (
    <div className="flex w-full flex-col items-start" data-name="Slot">
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className={`cursor-pointer ${classes}`} style={style}>
        {inner}
      </a>
    );
  }

  return (
    <div className={classes} style={style}>
      {inner}
    </div>
  );
}
