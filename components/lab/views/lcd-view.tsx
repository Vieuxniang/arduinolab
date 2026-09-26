"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { LcdSim } from "../sims/lcd-sim"
import { Terminal } from "../terminal"
import { Send } from "lucide-react"

export function LcdView() {
  const { lang } = useLab()
  const [text, setText] = useState("Hello World")
  const [display, setDisplay] = useState<{ l1: string; l2: string }>({
    l1: "ArduinoLab",
    l2: "Ready...",
  })

  const send = () => {
    setDisplay({ l1: text.slice(0, 16), l2: text.slice(16, 32) })
  }

  return (
    <div className="space-y-3 p-3">
      <h2 className="text-base font-semibold text-foreground">
        {translate(lang, "lcd_sim")}
      </h2>

      <LcdSim line1={display.l1} line2={display.l2} />

      <div className="rounded-xl border border-border bg-card p-3.5">
        <label className="lab-label mb-1.5 block">
          {translate(lang, "lcd_text")}
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={32}
          className="w-full rounded-md border border-border bg-background px-2.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />
        <p className="mt-1.5 text-right font-mono text-[11px] text-muted-foreground">
          {text.length}/32
        </p>
      </div>

      <button
        onClick={send}
        className="lab-btn lab-btn-primary w-full py-2.5 text-sm"
      >
        <Send className="h-4 w-4" />
        {translate(lang, "lcd_send")}
      </button>

      <Terminal
        placeholder={translate(lang, "terminal_ready")}
        code={`lcd.clear();
lcd.setCursor(0,0);
lcd.print("${display.l1}");
lcd.setCursor(0,1);
lcd.print("${display.l2}");`}
      />
    </div>
  )
}
