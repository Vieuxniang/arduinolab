"use client"

import type { ComboStreak } from "@/lib/lab/game-modes"
import { Flame } from "lucide-react"

interface Props {
  combo: ComboStreak
}

export function ComboIndicator({ combo }: Props) {
  if (!combo.active || combo.count === 0) return null

  return (
    <div className="fixed top-20 right-4 z-40 animate-pulse">
      <div className="flex items-center gap-2 bg-destructive/10 border-2 border-destructive px-4 py-2 rounded-none">
        <Flame className="w-5 h-5 text-destructive neon-pulse" />
        <div className="font-mono text-sm">
          <div className="text-destructive lab-glow">COMBO x{combo.count}</div>
          <div className="text-[11px] text-destructive/70">Multiplier: {combo.multiplier.toFixed(1)}x</div>
        </div>
      </div>
    </div>
  )
}
