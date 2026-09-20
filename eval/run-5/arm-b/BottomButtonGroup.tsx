export function BottomButtonGroup() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col items-start gap-[16px] rounded-[32px] border border-solid border-[#f3f4f6] px-[16px] pb-[32px] pt-[16px] shadow-[0px_0px_8px_0px_rgba(3,7,18,0.1)] backdrop-blur-[25px]"
      data-name="Bottom Button Group"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgb(249,250,251) 0%, rgba(249,250,251,0.9) 50%, rgba(249,250,251,0.5) 75%, rgba(249,250,251,0) 100%)",
      }}
    >
      <div className="relative flex w-full shrink-0 items-start gap-[16px]" data-name="Button Stack">
        <button
          type="button"
          className="relative z-[1] flex h-[48px] min-h-[48px] min-w-px flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[16px] px-[24px] py-[12px] drop-shadow-[0px_2px_4px_rgba(3,7,18,0.1),0px_4px_4px_rgba(3,7,18,0.1)]"
          style={{ backgroundColor: "#21552f" }}
          data-name="Button 1"
        >
          <p className="shrink-0 whitespace-nowrap text-center font-['Lato',sans-serif] text-[14px] font-bold leading-[20px] text-white">
            Submit
          </p>
        </button>
      </div>
    </div>
  );
}
