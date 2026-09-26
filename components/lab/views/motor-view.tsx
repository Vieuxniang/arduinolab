"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { MotorSim } from "../sims/motor-sim"
import { Terminal } from "../terminal"

export function MotorView() {
  const { lang } = useLab()
  const [speed, setSpeed] = useState(128)
  const duty = Math.round((speed / 255) * 100)

  return (
    <div className="space-y-3 p-3">
      <h2 className="text-base font-semibold text-foreground">
        {translate(lang, "motor_sim")}
      </h2>

      <MotorSim speed={speed} />

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border bg-card p-2.5 text-center">
          <div className="font-mono text-lg font-semibold text-foreground">{speed}</div>
          <div className="lab-label mt-0.5">PWM</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-2.5 text-center">
          <div className="font-mono text-lg font-semibold text-foreground">{duty}%</div>
          <div className="lab-label mt-0.5">{translate(lang, "duty")}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-3.5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{translate(lang, "speed")}</span>
          <span className="font-mono font-semibold text-foreground">
            {speed} / 255
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={255}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: "var(--chart-4)" }}
        />
      </div>

      <Terminal
        placeholder={translate(lang, "terminal_ready")}
        code={`int speed = ${speed}; // 0-255
analogWrite(MOTOR_PIN, speed);
// duty cycle: ${duty}%`}
      />
    </div>
  )
}
