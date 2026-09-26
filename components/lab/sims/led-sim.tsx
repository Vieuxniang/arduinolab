"use client"

export function LedSim({ on }: { on: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <svg viewBox="0 0 240 140" className="mx-auto w-full max-w-xs" role="img" aria-label="LED breadboard">
        {/* breadboard */}
        <rect x="10" y="20" width="220" height="100" fill="#0d120d" stroke="#1b3a22" />
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={i}
            x1={20 + i * 20}
            y1={28}
            x2={20 + i * 20}
            y2={112}
            stroke="#16271a"
            strokeWidth="1"
          />
        ))}
        {/* power rails */}
        <line x1="14" y1="28" x2="226" y2="28" stroke="#ff3b3b" strokeWidth="1.5" opacity="0.5" />
        <line x1="14" y1="112" x2="226" y2="112" stroke="#00ff41" strokeWidth="1.5" opacity="0.5" />

        {/* resistor */}
        <rect x="60" y="64" width="40" height="12" fill="#1b3a22" stroke="#00ff41" />
        <line x1="40" y1="70" x2="60" y2="70" stroke="#00ff41" strokeWidth="2" />
        <line x1="100" y1="70" x2="130" y2="70" stroke="#00ff41" strokeWidth="2" />

        {/* LED */}
        <line x1="160" y1="70" x2="160" y2="100" stroke="#00ff41" strokeWidth="2" />
        <line x1="130" y1="70" x2="160" y2="70" stroke="#00ff41" strokeWidth="2" />
        {on && (
          <circle cx="160" cy="55" r="22" fill="#00ff41" opacity="0.25">
            <animate attributeName="r" values="20;26;20" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
        <circle
          cx="160"
          cy="55"
          r="11"
          fill={on ? "#00ff41" : "#0d120d"}
          stroke={on ? "#00ff41" : "#1b3a22"}
          strokeWidth="2"
          style={on ? { filter: "drop-shadow(0 0 8px #00ff41)" } : undefined}
        />
        <line x1="160" y1="44" x2="160" y2="20" stroke="#00ff41" strokeWidth="2" />
      </svg>
    </div>
  )
}
