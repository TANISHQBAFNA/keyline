import { assets } from "./assets";

type Tab = {
  id: string;
  label: string;
  src: string;
};

const tabs: Tab[] = [
  { id: "home", label: "Home", src: assets.home },
  { id: "loans", label: "Loans", src: assets.bank },
  { id: "pay", label: "Pay", src: assets.wallet },
  { id: "more", label: "More", src: assets.grid },
];

type BottomNavbarProps = {
  activeId?: string;
  onSelect?: (id: string) => void;
};

export default function BottomNavbar({ activeId = "pay", onSelect }: BottomNavbarProps) {
  return (
    <nav
      className="bg-[#e8ece9] content-stretch flex items-stretch justify-between px-[8px] py-[8px] w-full"
      data-name="BottomNavbar"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect?.(tab.id)}
            className="content-stretch flex flex-1 flex-col gap-[4px] items-center justify-center py-[4px]"
          >
            <span className="overflow-clip relative size-[24px]">
              <img alt="" className="block size-full max-w-none" src={tab.src} />
            </span>
            <span
              className={`font-['Poppins',sans-serif] text-[11px] leading-[16px] ${
                active
                  ? "font-medium text-[color:var(--action-primary-bg,#12341d)]"
                  : "font-normal text-[color:var(--text-secondary,#626262)]"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
