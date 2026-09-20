import { RadioButtonTab } from "./RadioButtonTab";

const imgChevronDown =
  "https://www.figma.com/api/mcp/asset/778f2b8a-b0cb-4bf9-9af4-459d32883447.svg";

type DurationProps = {
  mode: string;
  onModeChange?: (value: string) => void;
};

export function Duration({ mode, onModeChange }: DurationProps) {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-[16px]" data-name="Duration">
      <RadioButtonTab
        options={["By Duration", "By Fiscal Year"]}
        value={mode}
        onChange={onModeChange}
      />
      <button
        type="button"
        className="relative flex w-full shrink-0 cursor-pointer flex-col items-start gap-[8px]"
        data-name="Input Field"
      >
        <div className="relative flex h-[21px] w-full shrink-0 items-center gap-[4px] px-[4px]">
          <p className="whitespace-nowrap text-left font-['Lato',sans-serif] text-[14px] font-normal leading-[20px] text-[#374151]">
            Duration
          </p>
        </div>
        <div className="relative w-full">
          <div className="relative flex w-full items-center justify-between rounded-[16px] border border-solid border-[#d1d5db] p-[13px]">
            <div className="pointer-events-none absolute inset-0 rounded-[16px] bg-white" />
            <div className="relative min-w-px flex-1 overflow-clip">
              <p className="whitespace-nowrap text-left font-['Lato',sans-serif] text-[16px] font-bold leading-[24px] text-[#030712]">
                Monthly
              </p>
            </div>
            <div className="relative size-[24px] shrink-0 overflow-clip" data-name="Calendar Icon">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgChevronDown} />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_1px_1px_2px_0px_rgba(3,7,18,0.1),inset_-1px_-1px_2px_0px_rgba(3,7,18,0.1)]" />
          </div>
        </div>
      </button>
    </div>
  );
}
