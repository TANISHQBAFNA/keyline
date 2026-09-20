type HeaderProps = {
  title: string;
  onBack?: () => void;
};

export function Header({ title, onBack }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 bg-white px-4">
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className="flex size-10 items-center justify-center"
      >
        <span className="block size-[10px] -translate-x-0.5 rotate-45 border-b-2 border-l-2 border-[#1A1A1A]" />
      </button>
      <h1 className="text-[18px] font-semibold leading-6 tracking-[-0.2px] text-[#1A1A1A]">
        {title}
      </h1>
    </header>
  );
}
