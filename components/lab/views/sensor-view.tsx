"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { Terminal } from "../terminal"
import { Thermometer, Sun, Activity } from "lucide-react"

function Slider({
  label,
  value,
  min,
  max,
  unit,
  color,
  icon,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  color: string
  icon: React.ReactNode
  onChange: (v: number) => void
}) {
  return (
    <div className="border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        style={{ accentColor: color }}
      />
    </div>
  )
}

export function SensorView() {
  const { lang } = useLab()
  const [temp, setTemp] = useState(22)
  const [light, setLight] = useState(540)
  const [motion, setMotion] = useState(0)

  return (
    <div className="space-y-3 p-3">
      <h2 className="text-base font-semibold text-foreground">
        {translate(lang, "sensors")}
      </h2>

      <Slider
        label={translate(lang, "temperature")}
        value={temp}
        min={-10}
        max={50}
        unit="°C"
        color="var(--chart-4)"
        icon={<Thermometer className="h-3.5 w-3.5" />}
        onChange={setTemp}
      />
      <Slider
        label={translate(lang, "light")}
        value={light}
        min={0}
        max={1023}
        unit=" lx"
        color="var(--chart-3)"
        icon={<Sun className="h-3.5 w-3.5" />}
        onChange={setLight}
      />

      <div className="border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            {translate(lang, "motion")}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: motion ? "var(--chart-1)" : "var(--muted-foreground)" }}
          >
            {motion ? translate(lang, "detected") : translate(lang, "none")}
          </span>
        </div>
        <button
          onClick={() => setMotion((m) => (m ? 0 : 1))}
          className={`w-full border py-2 text-xs font-bold ${
            motion
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground"
          }`}
        >
          {motion ? "PIR: HIGH" : "PIR: LOW"}
        </button>
      </div>

      <Terminal
        placeholder={translate(lang, "terminal_ready")}
        code={`int temp = ${temp}; // celsius
int light = ${light}; // analog
int motion = ${motion}; // PIR
Serial.print("T:"); Serial.println(temp);
Serial.print("L:"); Serial.println(light);
Serial.print("M:"); Serial.println(motion);`}
      />
    </div>
  )
}
