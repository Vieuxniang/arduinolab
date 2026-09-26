"use client"

import { useLab } from "@/lib/lab/store"
import { Leaderboard, type LeaderboardEntry } from "../leaderboard"

export function LeaderboardView() {
  const { xp, userLevel } = useLab()

  // Mock leaderboard data with live rankings
  const entries: LeaderboardEntry[] = [
    { rank: 1, name: "CyberNinja42", score: 15240, level: 25, missions: 45, trend: "up" },
    { rank: 2, name: "QuantumLoop", score: 14890, level: 24, missions: 43, trend: "stable" },
    { rank: 3, name: "ElectroMage", score: 14650, level: 23, missions: 42, trend: "down" },
    { rank: 4, name: "VortexCoder", score: 14200, level: 22, missions: 41, trend: "up" },
    { rank: 5, name: "NeonPulse", score: 13920, level: 21, missions: 40, trend: "stable" },
    { rank: 6, name: "You", score: xp, level: parseInt(userLevel.replace("LPI", "")), missions: 15, trend: "up" },
    { rank: 7, name: "SilentHack", score: 8200, level: 18, missions: 35, trend: "down" },
    { rank: 8, name: "NovaStrike", score: 7850, level: 17, missions: 33, trend: "up" },
  ]

  const userRank = entries.find((e) => e.name === "You")?.rank

  return (
    <div className="h-full w-full bg-gradient-to-b from-background via-muted/20 to-background overflow-auto p-4 space-y-4">
      <div className="space-y-2">
        <h1 className="text-lg font-mono text-accent lab-glow">[GLOBAL_TOURNAMENT]</h1>
        <p className="text-xs text-primary/60 font-mono">
          Live rankings - updated in real-time across all pioneers
        </p>
      </div>

      <Leaderboard entries={entries} userRank={userRank} />

      <div className="bg-card/50 border border-primary/30 rounded-none p-3 space-y-2">
        <div className="text-xs font-mono text-primary lab-glow">{"[YOUR_STATS]"}</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="space-y-1">
            <div className="text-primary/50">RANK</div>
            <div className="text-primary font-mono text-lg">#{userRank || "--"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-primary/50">SCORE</div>
            <div className="text-primary font-mono text-lg">{xp}</div>
          </div>
          <div className="space-y-1">
            <div className="text-primary/50">LEVEL</div>
            <div className="text-primary font-mono text-lg">{userLevel}</div>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 border border-accent/40 rounded-none p-3 text-xs text-accent/80 font-mono">
        <div className="font-mono text-accent">[TOURNAMENT_INFO]</div>
        <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
          <p>Weekly challenges active • Complete missions for global points</p>
          <p>Top 10 players earn bonus LAB tokens every Sunday</p>
          <p>Combo streaks multiply your global ranking impact</p>
        </div>
      </div>
    </div>
  )
}
