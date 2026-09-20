import { Header } from "./Header";
import { MainCard } from "./MainCard";
import { AccountSelector } from "./AccountSelector";
import { Duration } from "./Duration";
import { InputField } from "./InputField";
import { BottomButtonGroup } from "./BottomButtonGroup";

export default function GenerateStatementScreen() {
  return (
    <div className="relative size-full min-h-[956px] w-[440px] bg-[#f3f4f6] font-[Lato,sans-serif]">
      <div className="absolute left-1/2 top-[123px] flex h-[567px] w-[440px] -translate-x-1/2 flex-col items-center gap-4 overflow-clip p-2">
        <MainCard>
          <AccountSelector />
        </MainCard>
        <MainCard>
          <Duration />
          <InputField
            label="File Format"
            options={["PDF", "Excel", "CSV"]}
            selected="Excel"
          />
          <InputField
            label="Consolidation Type"
            options={["Individual", "Consolidated"]}
            selected="Consolidated"
          />
        </MainCard>
      </div>
      <Header />
      <BottomButtonGroup />
    </div>
  );
}
