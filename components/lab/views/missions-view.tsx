"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import {
  MISSIONS,
  LEVEL_ORDER,
  LEVEL_LABEL_KEY,
  type Mission,
  type MissionLevel,
} from "@/lib/lab/missions"
import { MissionCard, LevelTag } from "../mission-card"

export function MissionsView({ onSelect }: { onSelect: (m: Mission) => void }) {
  const { lang, completed, isLevelComplete } = useLab()
  const [filter, setFilter] = useState<MissionLevel | "all">("all")

  const levels: (MissionLevel | "all")[] = ["all", ...LEVEL_ORDER]

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {translate(lang, "all_missions")}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {completed.length}/{MISSIONS.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              filter === l
                ? "border-primary/70 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {l === "all"
              ? translate(lang, "all_levels")
              : translate(lang, LEVEL_LABEL_KEY[l])}
          </button>
        ))}
      </div>

      {LEVEL_ORDER.filter((l) => filter === "all" || filter === l).map((level) => {
        const items = MISSIONS.filter((m) => m.level === level)
        const doneCount = items.filter((m) => completed.includes(m.id)).length
        return (
          <div key={level} className="space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <LevelTag level={level} />
              <span className="font-mono text-[11px] text-muted-foreground">
                {doneCount}/{items.length}
                {isLevelComplete(level) ? " ✓" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items.map((m) => (
                <MissionCard key={m.id} mission={m} onSelect={onSelect} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
