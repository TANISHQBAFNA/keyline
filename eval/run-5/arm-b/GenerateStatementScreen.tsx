import { useState } from "react";
import { AccountSelector } from "./AccountSelector";
import { BottomButtonGroup } from "./BottomButtonGroup";
import { Duration } from "./Duration";
import { Header } from "./Header";
import { InputField } from "./InputField";
import { MainCard } from "./MainCard";
import { RadioButtonTab } from "./RadioButtonTab";

export default function GenerateStatementScreen() {
  const [durationMode, setDurationMode] = useState("By Duration");
  const [fileFormat, setFileFormat] = useState("Excel");
  const [consolidationType, setConsolidationType] = useState("Consolidated");

  return (
    <div
      className="relative mx-auto flex h-[956px] w-[440px] flex-col overflow-hidden bg-[#f9fafb]"
      data-name="Generate Statement"
    >
      <Header />
      <div className="relative flex min-h-0 flex-1 flex-col gap-[16px] px-[8px] pt-[8px]" data-name="Body">
        <MainCard>
          <AccountSelector />
        </MainCard>
        <MainCard>
          <div className="flex w-full flex-col items-start gap-[16px]">
            <Duration mode={durationMode} onModeChange={setDurationMode} />
            <InputField label="File Format">
              <RadioButtonTab
                options={["PDF", "Excel", "CSV"]}
                value={fileFormat}
                onChange={setFileFormat}
              />
            </InputField>
            <InputField label="Consolidation Type">
              <RadioButtonTab
                options={["Individual", "Consolidated"]}
                value={consolidationType}
                onChange={setConsolidationType}
              />
            </InputField>
          </div>
        </MainCard>
      </div>
      <BottomButtonGroup />
    </div>
  );
}
