export function BottomButtonGroup() {
  return (
    <div
      className="absolute bottom-0 left-0 flex w-[440px] flex-col items-start gap-4 rounded-[32px] border border-solid border-[#f3f4f6] px-4 pb-8 pt-4 shadow-[0px_0px_8px_0px_rgba(3,7,18,0.1)] backdrop-blur-[25px]"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgb(249,250,251) 0%, rgba(249,250,251,0.9) 50%, rgba(249,250,251,0.5) 75%, rgba(249,250,251,0) 100%)",
      }}
    >
      <div className="relative isolate flex w-full shrink-0 items-start gap-4">
        <button
          type="submit"
          className="relative z-[1] flex h-12 min-h-12 min-w-px flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3 shadow-[0px_2px_4px_rgba(3,7,18,0.1),0px_4px_4px_rgba(3,7,18,0.1)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 14% 87%, #12341d 0%, #21552f 100%)",
          }}
        >
          <span className="whitespace-nowrap text-center text-[14px] font-bold leading-5 text-white">
            Submit
          </span>
        </button>
      </div>
    </div>
  );
}
