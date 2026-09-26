import type { Mission } from "./missions"

export interface UserLevel {
  xp: number
  level: number
  completedMissionIds: string[]
}

export interface DifficultyProfile {
  minBlocks: number
  maxBlocks: number
  enabledSensors: string[]
  enableMotor: boolean
  enableLCD: boolean
  conceptsIntroduced: string[]
}

export const getDifficultyProfile = (userLevel: number): DifficultyProfile => {
  if (userLevel < 5) {
    return {
      minBlocks: 1,
      maxBlocks: 3,
      enabledSensors: [],
      enableMotor: false,
      enableLCD: false,
      conceptsIntroduced: ["digital_output", "led"],
    }
  } else if (userLevel < 10) {
    return {
      minBlocks: 2,
      maxBlocks: 5,
      enabledSensors: ["temperature"],
      enableMotor: false,
      enableLCD: false,
      conceptsIntroduced: ["analog_input", "conditional"],
    }
  } else if (userLevel < 20) {
    return {
      minBlocks: 3,
      maxBlocks: 8,
      enabledSensors: ["temperature", "light", "motion"],
      enableMotor: true,
      enableLCD: false,
      conceptsIntroduced: ["pwm", "loops", "variables"],
    }
  } else {
    return {
      minBlocks: 4,
      maxBlocks: 12,
      enabledSensors: ["temperature", "light", "motion"],
      enableMotor: true,
      enableLCD: true,
      conceptsIntroduced: ["functions", "arrays", "advanced_timing"],
    }
  }
}

export const generateAdaptiveMission = (
  userLevel: number,
  previousMissions: string[]
): Partial<Mission> => {
  const profile = getDifficultyProfile(userLevel)

  const topics = [
    "Control a LED with a button",
    "Read temperature and display on LCD",
    "Create a PWM motor controller",
    "Build a motion-triggered alarm",
    "Design a light-responsive system",
    "Create a multi-sensor dashboard",
    "Build a timer using delay loops",
    "Control multiple outputs with one input",
  ]

  const filteredTopics = topics.filter((_, i) => !previousMissions.includes(String(i)))
  const topicIndex = Math.floor(Math.random() * Math.max(1, filteredTopics.length))
  const topic =
    filteredTopics[topicIndex] ??
    topics[topicIndex % topics.length] ??
    "Control a LED with a button"

  const level: Mission["level"] =
    userLevel < 5 ? "beginner" : userLevel < 15 ? "intermediate" : "expert"

  const baseCost = userLevel < 5 ? 10 : userLevel < 15 ? 25 : 50
  const cost = baseCost + Math.floor(Math.random() * 15)
  const xp = Math.floor(cost * 2 + userLevel * 5)

  const sim: Mission["sim"] = profile.enableLCD
    ? "lcd"
    : profile.enableMotor
      ? "motor"
      : "led"

  return {
    name: { fr: topic, en: topic, es: topic },
    objective: {
      fr: `Maîtrise ce circuit : ${topic.toLowerCase()}. Utilise l'éditeur de blocs pour construire ta solution.`,
      en: `Master this circuit by ${topic.toLowerCase()}. Use the block editor to build your solution.`,
      es: `Domina este circuito: ${topic.toLowerCase()}. Usa el editor de bloques para construir tu solución.`,
    },
    level,
    cost,
    xp,
    sim,
  }
}

export const generateLearningPath = (userLevel: number): string[] => {
  if (userLevel < 5) return ["led_basics", "button_input", "digital_logic"]
  if (userLevel < 10) return ["analog_sensors", "conditionals", "loop_basics"]
  if (userLevel < 20) return ["pwm_motors", "multi_sensor", "timing_advanced"]
  return ["functions", "interrupts", "communications", "advanced_control"]
}
