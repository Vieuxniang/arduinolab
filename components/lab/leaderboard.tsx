"use client"

import { Trophy } from "lucide-react"

export interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  level: number
  missions: number
  trend: "up" | "down" | "stable"
}

interface Props {
  entries: LeaderboardEntry[]
  userRank?: number
}

export function Leaderboard({ entries, userRank }: Props) {
  return (
    <div className="bg-card/50 border border-accent/40 rounded-none p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm text-accent font-mono lab-glow">
        <Trophy className="w-4 h-4" />
        <span>GLOBAL RANKINGS</span>
      </div>

      <div className="space-y-1 max-h-48 overflow-auto">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between text-xs p-2 border-l-2 ${
              entry.rank === userRank
                ? "bg-primary/10 border-primary text-primary"
                : "border-primary/20 text-primary/70 hover:text-primary/90"
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="font-mono w-6">#{entry.rank}</span>
              <span className="truncate">{entry.name}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-right">
              <div>
                <div className="text-primary">{entry.score}</div>
                <div className="text-[11px] text-muted-foreground">pts</div>
              </div>
              <div className="w-4 text-center">
                {entry.trend === "up" && <span className="text-primary">↑</span>}
                {entry.trend === "down" && <span className="text-destructive">↓</span>}
                {entry.trend === "stable" && <span className="text-primary/50">−</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
