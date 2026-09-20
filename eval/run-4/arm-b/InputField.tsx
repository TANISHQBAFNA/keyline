type InputFieldProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
};

export function InputField({ label, value, onChange }: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium leading-4 text-[#5C6370]">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-12 w-full rounded-xl border border-[#E4E7EC] bg-white px-4 text-[16px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
      />
    </label>
  );
}
