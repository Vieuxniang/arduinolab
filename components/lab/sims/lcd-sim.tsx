"use client"

export function LcdSim({ line1, line2 }: { line1: string; line2?: string }) {
  const cells = 16
  const fmt = (s: string) => s.slice(0, cells).padEnd(cells, " ")
  return (
    <div className="grid place-items-center rounded-lg border border-border bg-background p-4">
      <div
        className="border-4 p-3"
        style={{ borderColor: "#1b3a22", background: "#031a08" }}
      >
        {[fmt(line1 || ""), fmt(line2 || "")].map((line, li) => (
          <div key={li} className="flex gap-[2px]">
            {line.split("").map((ch, ci) => (
              <span
                key={ci}
                className="grid h-5 w-3 place-items-center text-[11px] font-bold"
                style={{
                  color: "#00ff41",
                  background: "#062810",
                  textShadow: "0 0 4px #00ff41",
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
