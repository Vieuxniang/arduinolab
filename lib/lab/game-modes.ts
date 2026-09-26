export type GameMode = "standard" | "timeAttack" | "combo"

export interface ComboStreak {
  count: number
  multiplier: number
  lastMissionTime: number
  active: boolean
}

export interface TimeAttackChallenge {
  missionId: string
  timeLimit: number
  startTime: number
  endTime: number
  completed: boolean
  baseReward: number
}

export interface GameState {
  mode: GameMode
  combo: ComboStreak
  timeAttack?: TimeAttackChallenge
  totalComboXP: number
}

export const createComboStreak = (): ComboStreak => ({
  count: 0,
  multiplier: 1,
  lastMissionTime: 0,
  active: false,
})

export const calculateComboMultiplier = (streak: number): number => {
  return 1 + Math.floor(streak / 3) * 0.5
}

export const checkComboExpired = (lastTime: number, windowMs = 300000): boolean => {
  return Date.now() - lastTime > windowMs
}

export const startTimeAttack = (missionId: string, timeSeconds = 60): TimeAttackChallenge => ({
  missionId,
  timeLimit: timeSeconds * 1000,
  startTime: Date.now(),
  endTime: Date.now() + timeSeconds * 1000,
  completed: false,
  baseReward: 50,
})

export const calculateTimeAttackBonus = (challenge: TimeAttackChallenge): number => {
  if (!challenge.completed) return 0
  // Time actually used to finish, capped at the limit. `endTime` is the
  // deadline (startTime + timeLimit), so deriving "time used" from it would
  // always yield the full limit and a constant bonus.
  const timeUsed = Math.min(
    Math.max(Date.now() - challenge.startTime, 0),
    challenge.timeLimit,
  )
  const ratio = timeUsed / challenge.timeLimit
  return Math.max(10, Math.floor(challenge.baseReward * (2 - ratio)))
}

export const isTimeAttackValid = (challenge: TimeAttackChallenge): boolean => {
  return Date.now() < challenge.endTime
}
