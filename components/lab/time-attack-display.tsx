"use client"

import { useEffect, useState } from "react"
import type { TimeAttackChallenge } from "@/lib/lab/game-modes"
import { Clock } from "lucide-react"

interface Props {
  challenge: TimeAttackChallenge
  onTimeUp?: () => void
}

export function TimeAttackDisplay({ challenge, onTimeUp }: Props) {
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit)
  const [critical, setCritical] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, challenge.endTime - Date.now())
      setTimeLeft(remaining)
      setCritical(remaining < 10000)

      if (remaining === 0) {
        onTimeUp?.()
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [challenge, onTimeUp])

  const seconds = Math.ceil(timeLeft / 1000)
  const percentage = (timeLeft / challenge.timeLimit) * 100

  return (
    <div className={`fixed top-20 left-4 z-40 ${critical ? "animate-pulse" : ""}`}>
      <div className={`flex items-center gap-2 px-4 py-2 border-2 rounded-none ${
        critical ? "bg-destructive/20 border-destructive" : "bg-accent/10 border-accent"
      }`}>
        <Clock className={`w-5 h-5 ${critical ? "text-destructive" : "text-accent"}`} />
        <div className="font-mono">
          <div className={critical ? "text-destructive lab-glow" : "text-accent"}>{seconds}s</div>
          <div className="w-20 h-1 bg-primary/20 mt-1 relative overflow-hidden">
            <div
              className={`h-full transition-all ${
                critical ? "bg-destructive" : "bg-accent"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
