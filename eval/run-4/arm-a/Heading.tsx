type HeadingProps = {
  children?: string;
};

export default function Heading({ children = "Home loan" }: HeadingProps) {
  return (
    <p
      className="font-['Poppins',sans-serif] font-semibold leading-[24px] text-[16px] text-[color:var(--text-primary,#111)] whitespace-nowrap"
      data-name="Heading"
    >
      {children}
    </p>
  );
}
