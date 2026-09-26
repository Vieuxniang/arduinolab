"use client"

import { useEffect, useState } from "react"
import { Clock, Zap } from "lucide-react"
import {
  getTemporalState,
  type TemporalState,
} from "@/lib/lab/metaverse/temporal-cycle"

export function TemporalChallenges() {
  const [temporal, setTemporal] = useState<TemporalState | null>(null)

  useEffect(() => {
    const updateTemporal = () => setTemporal(getTemporalState())
    updateTemporal()
    const interval = setInterval(updateTemporal, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!temporal) return null

  return (
    <div className="bg-card border border-border p-4 rounded space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="text-primary text-sm font-mono">
          {temporal.cycleTime.toUpperCase()} CYCLE
        </h3>
      </div>

      <div className="w-full bg-muted h-1 rounded overflow-hidden">
        <div
          className="bg-primary h-full transition-all"
          style={{ width: `${temporal.cycleProgress * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {temporal.activeChallenges.map((challenge) => (
          <div key={challenge.id} className="rounded-md bg-background/60 p-2 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-primary">{challenge.name}</span>
              <span className="text-accent flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {challenge.reward} LAB
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              {challenge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
