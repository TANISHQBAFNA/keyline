type NavId = "home" | "loans" | "pay" | "more";

type BottomNavbarProps = {
  active?: NavId;
};

const ITEMS: { id: NavId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "loans", label: "Loans" },
  { id: "pay", label: "Pay" },
  { id: "more", label: "More" },
];

export function BottomNavbar({ active = "loans" }: BottomNavbarProps) {
  return (
    <nav className="flex h-[64px] shrink-0 items-stretch border-t border-[#E4E7EC] bg-white">
      {ITEMS.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            className="flex flex-1 flex-col items-center justify-center gap-1"
          >
            <span
              className={`block size-5 rounded-md ${
                selected ? "bg-[#0B2B4A]" : "bg-[#C8CDD6]"
              }`}
            />
            <span
              className={`text-[11px] font-medium leading-4 ${
                selected ? "text-[#0B2B4A]" : "text-[#6B7280]"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
