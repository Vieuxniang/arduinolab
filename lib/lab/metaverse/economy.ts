export interface EconomyTransaction {
  id: string
  from: string
  to: string
  amount: number
  type: "mission" | "mining" | "trade" | "purchase" | "tip"
  timestamp: number
  details: string
}

export interface MiningJob {
  id: string
  userId: string
  challengeId: string
  startTime: number
  endTime: number
  difficulty: number
  reward: number
  completed: boolean
}

export interface Marketplace {
  listings: Array<{
    id: string
    seller: string
    itemId: string
    itemType: "skin" | "component" | "blueprint"
    price: number
    active: boolean
  }>
}

export interface WalletBalance {
  lab: number
  minedLab: number
  totalEarned: number
}

export function createMiningJob(
  userId: string,
  challengeId: string,
  durationMs: number = 300000
): MiningJob {
  const difficulty = Math.random() * 10
  const baseReward = Math.floor(difficulty * 2)

  return {
    id: Math.random().toString(36).slice(2, 10),
    userId,
    challengeId,
    startTime: Date.now(),
    endTime: Date.now() + durationMs,
    difficulty,
    reward: baseReward,
    completed: false,
  }
}

export function calculateMiningReward(job: MiningJob): number {
  if (!job.completed) return 0
  // Reward faster completion: the bonus shrinks as the real time used
  // approaches the job duration. (The previous formula used the planned
  // duration endTime - startTime as "elapsed" time, which is constant per job
  // and grew with slower completion.)
  const durationMs = Math.max(1, job.endTime - job.startTime)
  const elapsedMs = Math.min(Math.max(Date.now() - job.startTime, 0), durationMs)
  const speedBonus = 1 - elapsedMs / durationMs
  return Math.floor(job.reward * (0.5 + speedBonus))
}

export function createTransaction(
  from: string,
  to: string,
  amount: number,
  type: EconomyTransaction["type"],
  details: string
): EconomyTransaction {
  return {
    id: Math.random().toString(36).slice(2, 10),
    from,
    to,
    amount,
    type,
    timestamp: Date.now(),
    details,
  }
}
