import { useState } from "react";
import Amount from "./Amount";
import BottomNavbar from "./BottomNavbar";
import Header from "./Header";
import Heading from "./Heading";
import InputField from "./InputField";
import MainCard from "./MainCard";
import SpecialButton from "./SpecialButton";

export default function PayNowScreen() {
  const [amountToPay, setAmountToPay] = useState("2,40,000");

  return (
    <div className="relative mx-auto flex h-[800px] w-[360px] flex-col overflow-hidden bg-white">
      <Header title="Pay now" />
      <main className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[8px] pb-[12px] pt-[8px]">
        <MainCard>
          <Heading title="Home loan" subtitle="HL-24018-091" />
          <Amount label="Outstanding Balance" value="2,40,000" currency="INR" />
        </MainCard>
        <InputField
          label="Amount to pay"
          value={amountToPay}
          onChange={setAmountToPay}
        />
        <SpecialButton label="Pay" />
      </main>
      <BottomNavbar />
    </div>
  );
}
