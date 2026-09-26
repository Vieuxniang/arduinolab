export interface LearningEntry {
  id: string
  missionId: string
  timestamp: number
  duration: number
  difficulty: number
  concepts: string[]
  keyLearnings: string[]
  challenges: string[]
  summary: string
  emotionalState: string
  successRate: number
}

export interface JournalSummary {
  totalSessions: number
  totalLearningTime: number
  conceptsMastered: string[]
  conceptsInProgress: string[]
  averageDifficulty: number
  improvementTrend: number
  weeklyInsights: string[]
}

const CONCEPTS: Record<string, string[]> = {
  led: ['basic_circuits', 'voltage_current', 'resistors'],
  sensor: ['analog_input', 'signal_conditioning', 'calibration'],
  motor: ['pwm_control', 'power_electronics', 'mechanical_systems'],
  lcd: ['serial_communication', 'display_protocols', 'text_rendering'],
  iot: ['wireless_protocols', 'data_transmission', 'network_topology'],
}

export class LearningJournal {
  private entries: LearningEntry[] = []

  recordMission(
    missionId: string,
    duration: number,
    difficulty: number,
    successRate: number,
    emotionalState: string
  ) {
    const concepts = this.extractConcepts(missionId)
    const keyLearnings = this.generateKeyLearnings(missionId, concepts, successRate)
    const challenges = this.identifyChallenges(missionId, successRate)
    const summary = this.generateSummary(missionId, keyLearnings, challenges)

    const entry: LearningEntry = {
      id: `entry_${Date.now()}`,
      missionId,
      timestamp: Date.now(),
      duration,
      difficulty,
      concepts,
      keyLearnings,
      challenges,
      summary,
      emotionalState,
      successRate,
    }

    this.entries.push(entry)
    this.persistToStorage()
  }

  private extractConcepts(missionId: string): string[] {
    for (const [type, concepts] of Object.entries(CONCEPTS)) {
      if (missionId.includes(type)) {
        return concepts
      }
    }
    return ['general_electronics', 'problem_solving']
  }

  private generateKeyLearnings(missionId: string, concepts: string[], successRate: number): string[] {
    const learnings: string[] = []

    if (successRate > 0.8) {
      learnings.push(`Mastered ${concepts[0] || 'key concept'}`)
    }

    if (missionId.includes('led')) {
      learnings.push('Understood voltage-current relationships')
    } else if (missionId.includes('sensor')) {
      learnings.push('Learned signal processing techniques')
    } else if (missionId.includes('motor')) {
      learnings.push('Grasped PWM control mechanisms')
    }

    return learnings
  }

  private identifyChallenges(_missionId: string, successRate: number): string[] {
    const challenges: string[] = []

    if (successRate < 0.6) {
      challenges.push('Circuit logic needs review')
    }
    if (successRate < 0.4) {
      challenges.push('Consider revisiting fundamentals')
    }

    return challenges
  }

  private generateSummary(missionId: string, learnings: string[], challenges: string[]): string {
    let summary = `Completed ${missionId} mission. `
    summary += learnings.length > 0 ? `Key learnings: ${learnings[0]}.` : 'Practice needed.'
    if (challenges.length > 0) {
      summary += ` Challenge: ${challenges[0]}`
    }
    return summary
  }

  getRecentEntries(limit: number = 10): LearningEntry[] {
    return this.entries.slice(-limit).reverse()
  }

  generateWeeklySummary(): JournalSummary {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const weekEntries = this.entries.filter((e) => e.timestamp > weekAgo)

    const allConcepts = new Set<string>()
    weekEntries.forEach((e) => e.concepts.forEach((c) => allConcepts.add(c)))

    const totalTime = weekEntries.reduce((sum, e) => sum + e.duration, 0)
    const avgDifficulty = weekEntries.length > 0 ? weekEntries.reduce((sum, e) => sum + e.difficulty, 0) / weekEntries.length : 0

    const successRates = weekEntries.map((e) => e.successRate)
    const improvementTrend =
      successRates.length > 1
        ? (successRates[successRates.length - 1] ?? 0) - (successRates[0] ?? 0)
        : 0

    return {
      totalSessions: weekEntries.length,
      totalLearningTime: totalTime,
      conceptsMastered: Array.from(allConcepts),
      conceptsInProgress: Array.from(allConcepts).slice(0, 2),
      averageDifficulty: avgDifficulty,
      improvementTrend,
      weeklyInsights: this.generateInsights(weekEntries),
    }
  }

  private generateInsights(entries: LearningEntry[]): string[] {
    const insights: string[] = []

    if (entries.length > 5) {
      insights.push('Great consistency! Keep practicing daily.')
    }

    const avgSuccess = entries.reduce((sum, e) => sum + e.successRate, 0) / entries.length
    if (avgSuccess > 0.85) {
      insights.push('Excellent progress! Ready for advanced challenges.')
    }

    return insights
  }

  private persistToStorage() {
    try {
      localStorage.setItem('lab.journal', JSON.stringify(this.entries))
    } catch (e) {
      console.log('[v0] Journal storage error:', e)
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('lab.journal')
      if (stored) {
        this.entries = JSON.parse(stored)
      }
    } catch (e) {
      console.log('[v0] Journal load error:', e)
    }
  }
}

export const learningJournal = new LearningJournal()
