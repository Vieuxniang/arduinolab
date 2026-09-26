"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { LedSim } from "../sims/led-sim"
import { Terminal } from "../terminal"
import { generateCode } from "@/lib/lab/code-gen"
import { Power } from "lucide-react"

export function LedView() {
  const { lang } = useLab()
  const [on, setOn] = useState(false)

  return (
    <div className="space-y-3 p-3">
      <h2 className="text-base font-semibold text-foreground">
        {translate(lang, "led_sim")}
      </h2>
      <LedSim on={on} />

      <div className="flex items-center justify-between border border-border bg-card p-3">
        <span className="text-xs text-muted-foreground">
          {translate(lang, "led_state")}
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: on ? "var(--chart-1)" : "var(--muted-foreground)" }}
        >
          {on ? translate(lang, "on") : translate(lang, "off")}
        </span>
      </div>

      <button
        onClick={() => setOn((v) => !v)}
        className={`flex w-full items-center justify-center gap-2 border py-3 text-sm font-bold ${
          on
            ? "border-muted-foreground text-muted-foreground"
            : "border-primary bg-primary text-primary-foreground"
        }`}
      >
        <Power className="h-4 w-4" />
        {on ? translate(lang, "led_off") : translate(lang, "led_on")}
      </button>

      <Terminal
        placeholder={translate(lang, "terminal_ready")}
        code={generateCode(on ? ["led_on"] : ["led_off"])}
      />
    </div>
  )
}
