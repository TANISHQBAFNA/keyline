import type { ReactNode } from "react";

type HeadingProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  titleSize?: "lg" | "md";
  className?: string;
};

export function Heading({
  title,
  subtitle,
  icon,
  titleSize = "md",
  className,
}: HeadingProps) {
  const titleClass =
    titleSize === "lg"
      ? "text-[20px] font-bold leading-7 text-[#030712]"
      : "text-[16px] font-bold leading-6 text-[#030712]";
  const subtitleClass =
    titleSize === "lg"
      ? "text-[16px] font-semibold leading-6 text-[#374151]"
      : "text-[14px] font-semibold leading-5 text-[#374151]";

  return (
    <div
      className={`flex w-full items-center gap-3 ${className ?? ""}`}
      data-name="Heading"
    >
      {icon}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className={`${titleClass} w-full overflow-hidden text-ellipsis`}>
          {title}
        </p>
        {subtitle ? (
          <p className={`${subtitleClass} w-full whitespace-pre-wrap`}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
