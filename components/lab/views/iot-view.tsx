"use client"

import { useEffect, useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { LedSim } from "../sims/led-sim"
import { MotorSim } from "../sims/motor-sim"
import { Terminal } from "../terminal"
import { RefreshCw, Thermometer, Lightbulb, Fan } from "lucide-react"

export function IotView() {
  const { lang } = useLab()
  const [tick, setTick] = useState(0)
  const [data, setData] = useState({ temp: 24, led: true, speed: 160 })

  const refresh = () => {
    setData({
      temp: Math.round(18 + Math.random() * 16),
      led: Math.random() > 0.4,
      speed: Math.round(60 + Math.random() * 195),
    })
    setTick((t) => t + 1)
  }

  useEffect(() => {
    const id = setInterval(refresh, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {translate(lang, "iot_dashboard")}
        </h2>
        <button
          onClick={refresh}
          className="lab-btn lab-btn-secondary gap-1 px-2.5 py-1.5 text-[11px]"
        >
          <RefreshCw className="h-3 w-3" />
          {translate(lang, "refresh")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Metric
          icon={<Thermometer className="h-4 w-4" />}
          label={translate(lang, "temperature")}
          value={`${data.temp}°`}
          color="var(--chart-4)"
        />
        <Metric
          icon={<Lightbulb className="h-4 w-4" />}
          label="LED"
          value={data.led ? translate(lang, "on") : translate(lang, "off")}
          color={data.led ? "var(--chart-1)" : "var(--muted-foreground)"}
        />
        <Metric
          icon={<Fan className="h-4 w-4" />}
          label={translate(lang, "speed")}
          value={`${data.speed}`}
          color="var(--chart-4)"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <LedSim on={data.led} />
        <MotorSim speed={data.speed} />
      </div>

      <Terminal
        placeholder={translate(lang, "terminal_ready")}
        running
        code={`// telemetry packet #${tick}
publish("temp", ${data.temp});
publish("led", ${data.led ? 1 : 0});
publish("motor", ${data.speed});
delay(3000);`}
      />
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5 text-center">
      <div className="flex justify-center" style={{ color }}>
        {icon}
      </div>
      <div className="mt-1 font-mono text-sm font-semibold text-foreground">
        {value}
      </div>
      <div className="lab-label mt-0.5 truncate">{label}</div>
    </div>
  )
}
