"use client"

export function MotorSim({ speed }: { speed: number }) {
  // speed 0-255 -> duration
  const dur = speed === 0 ? 0 : Math.max(0.2, 2 - (speed / 255) * 1.8)
  return (
    <div className="grid place-items-center rounded-lg border border-border bg-background p-6">
      <svg viewBox="0 0 120 120" className="h-32 w-32" role="img" aria-label="PWM motor">
        <circle cx="60" cy="60" r="50" fill="#0d120d" stroke="#1b3a22" strokeWidth="2" />
        <g
          style={{
            transformOrigin: "60px 60px",
            animation: dur ? `lab-spin ${dur}s linear infinite` : "none",
          }}
        >
          <rect x="56" y="14" width="8" height="46" fill="var(--chart-4)" />
          <rect x="56" y="60" width="8" height="46" fill="var(--chart-4)" opacity="0.5" />
          <rect x="14" y="56" width="46" height="8" fill="var(--chart-4)" opacity="0.7" />
          <rect x="60" y="56" width="46" height="8" fill="var(--chart-4)" opacity="0.3" />
        </g>
        <circle cx="60" cy="60" r="10" fill="#000" stroke="var(--chart-4)" strokeWidth="2" />
      </svg>
    </div>
  )
}
