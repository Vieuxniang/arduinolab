export type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night"

export interface TemporalChallenge {
  id: string
  timeOfDay: TimeOfDay
  name: string
  difficulty: number
  reward: number
  description: string
  active: boolean
}

export interface TemporalState {
  realHour: number
  cycleTime: TimeOfDay
  activeChallenges: TemporalChallenge[]
  cycleProgress: number
}

export const TEMPORAL_CHALLENGES: TemporalChallenge[] = [
  {
    id: "dawn_surge",
    timeOfDay: "dawn",
    name: "Dawn Surge",
    difficulty: 2,
    reward: 75,
    description: "Early morning energy boost - speed challenges",
    active: false,
  },
  {
    id: "morning_grind",
    timeOfDay: "morning",
    name: "Morning Grind",
    difficulty: 3,
    reward: 100,
    description: "Morning focus - precision circuit building",
    active: false,
  },
  {
    id: "noon_peak",
    timeOfDay: "afternoon",
    name: "Noon Peak",
    difficulty: 4,
    reward: 150,
    description: "Peak hours - competitive leaderboard rush",
    active: false,
  },
  {
    id: "dusk_descent",
    timeOfDay: "evening",
    name: "Dusk Descent",
    difficulty: 3,
    reward: 120,
    description: "Evening wind-down - community challenges",
    active: false,
  },
  {
    id: "night_nexus",
    timeOfDay: "night",
    name: "Night Nexus",
    difficulty: 5,
    reward: 200,
    description: "Midnight madness - extreme challenges only",
    active: false,
  },
]

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 9) return "dawn"
  if (hour >= 9 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 21) return "evening"
  return "night"
}

export function getTemporalState(): TemporalState {
  const now = new Date()
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const cycleTime = getTimeOfDay(hour)
  const cycleProgress = (minutes % 60) / 60

  return {
    realHour: hour,
    cycleTime,
    activeChallenges: TEMPORAL_CHALLENGES.filter((c) => c.timeOfDay === cycleTime),
    cycleProgress,
  }
}
