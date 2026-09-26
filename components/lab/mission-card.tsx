"use client"

import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import {
  type Mission,
  BADGE_BY_LEVEL,
  LEVEL_LABEL_KEY,
} from "@/lib/lab/missions"
import { Coins, Lock, Check, Zap } from "lucide-react"

const BADGE_COLOR: Record<string, string> = {
  beginner: "var(--chart-1)",
  intermediate: "var(--chart-3)",
  expert: "var(--chart-4)",
}

export function MissionCard({
  mission,
  onSelect,
}: {
  mission: Mission
  onSelect: (m: Mission) => void
}) {
  const { lang, isCompleted, isUnlocked, canAfford } = useLab()
  const done = isCompleted(mission.id)
  const unlocked = isUnlocked(mission.id)
  const affordable = canAfford(mission.cost)
  const badgeColor = BADGE_COLOR[mission.level]

  return (
    <button
      onClick={() => unlocked && onSelect(mission)}
      disabled={!unlocked}
      className={`relative w-full rounded-xl border bg-card p-3.5 text-left transition-colors ${
        done
          ? "border-primary/60"
          : unlocked
            ? "border-border hover:border-primary/50"
            : "border-border opacity-50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ color: badgeColor, borderColor: badgeColor }}
          >
            {translate(lang, BADGE_BY_LEVEL[mission.level])}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            #{String(mission.id).padStart(2, "0")}
          </span>
        </div>
        {done ? (
          <Check className="h-4 w-4 text-primary" />
        ) : !unlocked ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : null}
      </div>

      <h3 className="mt-2 text-sm font-semibold text-foreground">{mission.name[lang]}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {translate(lang, "objective")}: {mission.objective[lang]}
      </p>

      <div className="mt-2.5 flex items-center justify-between font-mono text-xs">
        <span className="flex items-center gap-1" style={{ color: "var(--chart-4)" }}>
          <Coins className="h-3 w-3" />
          {mission.cost.toFixed(1)} LAB
        </span>
        <span className="flex items-center gap-1 text-primary">
          <Zap className="h-3 w-3" />+{mission.xp} XP
        </span>
      </div>

      {!unlocked && (
        <p className="mt-2 text-[11px] text-destructive">
          {translate(lang, "unlock_prev")}
        </p>
      )}
      {unlocked && !affordable && !done && (
        <p className="mt-2 text-[11px] text-destructive">
          {translate(lang, "insufficient")}
        </p>
      )}
    </button>
  )
}

export function LevelTag({ level }: { level: Mission["level"] }) {
  const { lang } = useLab()
  return (
    <span
      className="text-[11px] font-semibold tracking-wide"
      style={{ color: BADGE_COLOR[level] }}
    >
      {translate(lang, LEVEL_LABEL_KEY[level])}
    </span>
  )
}
