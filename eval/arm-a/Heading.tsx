import { ReactNode } from "react";

type HeadingProps = {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  titleSize?: "sm" | "md" | "lg";
  align?: "start" | "center";
  className?: string;
};

const titleSizeClasses = {
  sm: "text-[16px] font-bold leading-6 text-[#030712]",
  md: "text-[20px] font-bold leading-7 text-[#030712]",
  lg: "text-[20px] font-bold leading-7 text-[#030712]",
};

export function Heading({
  title,
  subtitle,
  icon,
  titleSize = "sm",
  align = "start",
  className = "",
}: HeadingProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon}
      <div className={`flex min-w-0 flex-1 flex-col justify-center gap-1 ${alignClass}`}>
        <p className={`${titleSizeClasses[titleSize]} w-full overflow-hidden text-ellipsis`}>
          {title}
        </p>
        {subtitle ? (
          <div className="w-full text-[14px] font-semibold leading-5 text-[#374151]">
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}
