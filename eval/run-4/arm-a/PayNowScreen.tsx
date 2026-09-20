import { useState } from "react";
import BottomNavbar from "./BottomNavbar";
import Header from "./Header";
import InputField from "./InputField";
import MainCard from "./MainCard";
import SpecialButton from "./SpecialButton";

export default function PayNowScreen() {
  const [amount, setAmount] = useState("2,40,000");

  return (
    <div
      className="bg-[var(--surface-default,#fff)] content-stretch flex flex-col relative w-[360px] min-h-[640px] font-['Poppins',sans-serif]"
      data-name="PayNowScreen"
    >
      <Header title="Pay now" />
      <main className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-stretch px-[16px] py-[24px] w-full">
        <MainCard heading="Home loan" amount="₹2,40,000" caption="Outstanding balance" />
        <InputField label="Amount to pay" value={amount} onChange={setAmount} />
        <SpecialButton label="Pay" />
      </main>
      <BottomNavbar activeId="pay" />
    </div>
  );
}
