"use client"

import { useState } from "react"
import { TrendingUp, Coins, Pickaxe } from "lucide-react"
import type { WalletBalance, MiningJob } from "@/lib/lab/metaverse/economy"
import { createMiningJob, calculateMiningReward } from "@/lib/lab/metaverse/economy"

export function EconomyDashboard({ userId = "user1" }: { userId?: string }) {
  const [wallet, setWallet] = useState<WalletBalance>({
    lab: 150,
    minedLab: 45,
    totalEarned: 195,
  })
  const [miningJobs, setMiningJobs] = useState<MiningJob[]>([])

  const startMining = () => {
    const job = createMiningJob(userId, "challenge_1")
    setMiningJobs((prev) => [...prev, job])

    setTimeout(() => {
      setMiningJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, completed: true } : j
        )
      )
      const reward = calculateMiningReward({ ...job, completed: true })
      setWallet((prev) => ({
        ...prev,
        lab: prev.lab + reward,
        minedLab: prev.minedLab + reward,
        totalEarned: prev.totalEarned + reward,
      }))
    }, 5000)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card border border-border p-3 rounded">
          <div className="flex items-center gap-1 mb-1">
            <Coins className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">BALANCE</span>
          </div>
          <p className="text-sm text-primary lab-glow">{wallet.lab} LAB</p>
        </div>

        <div className="bg-card border border-border p-3 rounded">
          <div className="flex items-center gap-1 mb-1">
            <Pickaxe className="h-3 w-3 text-accent" />
            <span className="text-xs text-muted-foreground">MINED</span>
          </div>
          <p className="text-sm text-accent">{wallet.minedLab} LAB</p>
        </div>

        <div className="bg-card border border-border p-3 rounded">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-chart-2" />
            <span className="text-xs text-muted-foreground">TOTAL</span>
          </div>
          <p className="text-sm text-chart-2">{wallet.totalEarned} LAB</p>
        </div>
      </div>

      <button
        onClick={startMining}
        className="w-full bg-primary text-primary-foreground py-2 px-3 rounded text-sm hover:opacity-80 transition flex items-center justify-center gap-2"
      >
        <Pickaxe className="h-4 w-4" />
        START MINING CHALLENGE
      </button>

      {miningJobs.length > 0 && (
        <div className="bg-card border border-border p-3 rounded">
          <p className="text-xs text-muted-foreground mb-2">ACTIVE JOBS</p>
          {miningJobs.map((job) => (
            <div
              key={job.id}
              className="mb-2 rounded-md bg-background/60 p-2 text-xs text-foreground"
            >
              <div className="flex justify-between">
                <span>{job.completed ? "✓ COMPLETED" : "MINING..."}</span>
                <span className="text-primary">+{job.reward} LAB</span>
              </div>
              <div className="w-full bg-muted h-1 mt-1 rounded overflow-hidden">
                <div
                  className="bg-primary h-full transition-all"
                  style={{
                    width: job.completed
                      ? "100%"
                      : `${((Date.now() - job.startTime) / (job.endTime - job.startTime)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
