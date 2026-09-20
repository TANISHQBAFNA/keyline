type SpecialButtonProps = {
  label?: string;
  onClick?: () => void;
};

export default function SpecialButton({ label = "Pay", onClick }: SpecialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-[var(--action-primary-bg,#12341d)] content-stretch flex gap-[var(--spacing-8,8px)] items-center justify-center px-[var(--spacing-24,24px)] py-[var(--spacing-8,8px)] relative rounded-[var(--spacing-4,4px)] w-full"
      data-name="SpecialButton"
    >
      <span className="font-['Poppins',sans-serif] font-medium leading-[22px] text-[15px] text-center text-[color:var(--text-on-action,white)] whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
