import { useState } from "react";
import { Amount } from "./Amount";
import { BottomNavbar } from "./BottomNavbar";
import { Header } from "./Header";
import { Heading } from "./Heading";
import { InputField } from "./InputField";
import { MainCard } from "./MainCard";
import { SpecialButton } from "./SpecialButton";

export default function PayNowScreen() {
  const [amountToPay, setAmountToPay] = useState("₹2,40,000");

  return (
    <div className="mx-auto flex min-h-screen w-[360px] flex-col bg-[#F4F5F7]">
      <Header title="Pay now" />
      <main className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-4">
        <MainCard>
          <Heading>Home loan</Heading>
          <Amount value="₹2,40,000" />
        </MainCard>
        <InputField
          label="Amount to pay"
          value={amountToPay}
          onChange={setAmountToPay}
        />
        <SpecialButton>Pay</SpecialButton>
      </main>
      <BottomNavbar active="loans" />
    </div>
  );
}
