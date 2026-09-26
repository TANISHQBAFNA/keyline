export function Stat({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

export function HealthChip({
  tone,
  label,
}: {
  tone: "ok" | "watch" | "risk";
  label: string;
}) {
  return (
    <span className={`health-chip health-chip--${tone}`}>
      <span className="health-chip__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
