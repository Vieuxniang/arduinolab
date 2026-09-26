"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { LANGUAGES, translate, type Lang } from "@/lib/lab/i18n"
import { Terminal as TerminalIcon } from "lucide-react"

export function LanguageGate() {
  const { confirmLang } = useLab()
  const [sel, setSel] = useState<Lang>("fr")

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 lab-scanlines">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl shadow-primary/5">
        <div className="mb-5 flex items-center gap-3">
          <TerminalIcon className="h-7 w-7 text-primary lab-glow" />
          <div>
            <h1 className="text-xl font-semibold text-primary lab-glow">ArduinoLab</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {translate(sel, "tagline")}
            </p>
          </div>
        </div>

        <pre
          className="mb-5 rounded-md border border-border bg-background p-3 font-mono text-[11px] leading-relaxed"
          style={{ color: "var(--chart-1)" }}
        >
{`> boot ArduinoLab v1.0
> select language / langue
> idioma_`}
        </pre>

        <div className="space-y-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setSel(l.code)}
              className={`flex w-full items-center justify-between rounded-md border px-3.5 py-3 text-sm transition-colors ${
                sel === l.code
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-border text-foreground hover:border-primary/40"
              }`}
            >
              <span className="font-semibold">{l.label}</span>
              <span className="font-mono text-[11px] uppercase text-muted-foreground">
                {l.code}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => confirmLang(sel)}
          className="lab-btn lab-btn-primary mt-5 w-full py-3 text-sm"
        >
          {">"} START
        </button>
      </div>
    </div>
  )
}
