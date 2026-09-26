"use client"

import { useEffect, useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { Coins, Volume2, VolumeX, Mic, MicOff } from "lucide-react"
import { ArduinoPayButton } from "./arduino-pay-button"

interface HeaderProps {
  onSettings: () => void
  onVoiceToggle?: () => void
  voiceActive?: boolean
}

export function Header({ onSettings, onVoiceToggle, voiceActive = false }: HeaderProps) {
  const { lang, userLevel, xp, lab, completed, totalMissions, soundEnabled, toggleSound } = useLab()
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
    update()
    const id = setInterval(update, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="border-b border-border bg-card lab-scanlines">
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={onSettings}
          className="flex items-center gap-2 text-left"
          aria-label={translate(lang, "settings")}
        >
          <span className="grid h-7 w-7 place-items-center rounded-md border border-primary/60 text-xs font-bold text-primary">
            A
          </span>
          <span className="text-sm font-semibold tracking-tight text-primary lab-glow">
            {translate(lang, "app_name")}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onVoiceToggle}
            className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
              voiceActive
                ? "border-accent/60 text-accent bg-accent/10 animate-pulse"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Voice control"
            title="Voice control (SAY: run, stop, reset)"
          >
            {voiceActive ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={toggleSound}
            className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
              soundEnabled
                ? "border-primary/50 text-primary hover:border-primary bg-primary/10"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            aria-label={soundEnabled ? "Mute" : "Unmute"}
            title={soundEnabled ? translate(lang, "sound_on") : translate(lang, "sound_off")}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{time}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-border border-t border-border text-center">
        <Stat label={translate(lang, "level")} value={userLevel} />
        <Stat label={translate(lang, "xp")} value={String(xp)} />
        <Stat
          label="LAB"
          value={lab.toFixed(1)}
          icon={<Coins className="h-3 w-3" style={{ color: "var(--chart-4)" }} />}
        />
        <Stat label={translate(lang, "progress")} value={`${completed.length}/${totalMissions}`} />
      </div>
      <div className="border-t border-border px-3 py-2">
        <ArduinoPayButton />
      </div>
    </header>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="px-1 py-2">
      <div className="flex items-center justify-center gap-1 font-mono text-sm font-semibold tabular-nums text-foreground">
        {icon}
        {value}
      </div>
      <div className="lab-label mt-0.5 text-center">{label}</div>
    </div>
  )
}
