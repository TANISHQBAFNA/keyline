type HeadingProps = {
  children: string;
};

export function Heading({ children }: HeadingProps) {
  return (
    <p className="text-[16px] font-medium leading-6 text-[#1A1A1A]">{children}</p>
  );
}
