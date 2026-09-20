type IconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function Icon({ src, alt = "", size = 24, className }: IconProps) {
  return (
    <div
      className={`relative shrink-0 overflow-clip ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <img alt={alt} className="block size-full max-w-none" src={src} />
    </div>
  );
}
