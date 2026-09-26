"use client"

import { useLab } from "@/lib/lab/store"
import { LANGUAGES, translate } from "@/lib/lab/i18n"
import { X, Coins, Zap, Trophy, Volume2, VolumeX, Sparkles } from "lucide-react"

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { lang, setLang, uid, xp, lab, userLevel, soundEnabled, toggleSound } = useLab()

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70" onClick={onClose}>
      <div
        className="w-full rounded-t-2xl border-t border-border bg-card p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {translate(lang, "settings")}
          </h2>
          <button
            onClick={onClose}
            aria-label="close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border bg-background p-2.5">
            <Trophy className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-1 font-mono text-sm font-semibold text-foreground">
              {userLevel}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-2.5">
            <Zap className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-1 font-mono text-sm font-semibold text-foreground">
              {xp}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-2.5">
            <Coins className="mx-auto h-4 w-4" style={{ color: "var(--chart-4)" }} />
            <div
              className="mt-1 font-mono text-sm font-semibold"
              style={{ color: "var(--chart-4)" }}
            >
              {lab.toFixed(1)}
            </div>
          </div>
        </div>

        <p className="lab-label mb-2">{translate(lang, "language")}</p>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-md border py-2.5 text-xs font-semibold transition-colors ${
                lang === l.code
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <p className="lab-label mb-2">LAB-AI Control Panel</p>
        <div className="mb-4 rounded-lg border border-border bg-background p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">
                {soundEnabled ? "🔊 ON" : "🔇 OFF"}
              </span>
            </div>
            <button
              onClick={toggleSound}
              className={`px-2 py-1 text-xs border rounded transition-colors ${
                soundEnabled
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary/30 text-muted-foreground"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Toggle voice guidance for all missions and events
          </p>
        </div>

        <div className="rounded-md border border-border bg-background p-2.5 font-mono text-[11px] text-muted-foreground">
          <span className="text-foreground">{translate(lang, "uid")}:</span> {uid}
        </div>
      </div>
    </div>
  )
}
