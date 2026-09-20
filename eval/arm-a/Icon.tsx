type IconProps = {
  src: string;
  size?: number;
  alt?: string;
  className?: string;
};

export function Icon({ src, size = 24, alt = "", className = "" }: IconProps) {
  return (
    <div
      className={`relative shrink-0 overflow-clip ${className}`}
      style={{ width: size, height: size }}
    >
      <img alt={alt} src={src} width={size} height={size} className="block size-full max-w-none" />
    </div>
  );
}
