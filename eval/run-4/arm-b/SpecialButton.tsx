type SpecialButtonProps = {
  children: string;
  onClick?: () => void;
};

export function SpecialButton({ children, onClick }: SpecialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0B2B4A] text-[16px] font-semibold text-white"
    >
      {children}
    </button>
  );
}
