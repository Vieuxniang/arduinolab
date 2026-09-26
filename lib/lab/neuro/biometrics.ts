export interface BiometricData {
  heartRate: number
  stressLevel: number
  focusScore: number
  engagementLevel: number
  emotionalState: 'calm' | 'focused' | 'stressed' | 'flow' | 'overwhelmed'
}

export interface FacialEmotionData {
  happiness: number
  concentration: number
  frustration: number
  confidence: number
  mood: 'positive' | 'neutral' | 'negative'
}

export class BiometricMonitor {
  private heartRate = 70
  private stressLevel = 0.3
  private focusScore = 0.5
  private engagementLevel = 0.6
  private emotionalState: BiometricData['emotionalState'] = 'calm'
  private historyBuffer: BiometricData[] = []
  private maxHistoryLength = 300
  private simulationInterval: ReturnType<typeof setInterval> | null = null

  constructor() {
    // Only simulate in the browser; the module is also imported during SSR.
    if (typeof window !== 'undefined') {
      this.simulateHeartRateVariation()
    }
  }

  private simulateHeartRateVariation() {
    if (this.simulationInterval !== null) return
    // Simulate realistic heart rate variation between 60-100 bpm
    this.simulationInterval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 10
      this.heartRate = Math.max(60, Math.min(100, this.heartRate + variation))

      // Stress increases with heart rate
      this.stressLevel = Math.max(0, Math.min(1, (this.heartRate - 60) / 40))

      // Focus can be affected by stress (inverted bell curve)
      if (this.stressLevel < 0.3) this.focusScore = 0.9
      else if (this.stressLevel < 0.6) this.focusScore = Math.max(0.4, 1 - this.stressLevel)
      else this.focusScore = Math.max(0.1, 1 - this.stressLevel * 1.5)

      this.updateEmotionalState()
      this.recordSample()
    }, 1000)
  }

  private updateEmotionalState() {
    if (this.stressLevel > 0.75) {
      this.emotionalState = 'overwhelmed'
    } else if (this.stressLevel > 0.6) {
      this.emotionalState = 'stressed'
    } else if (this.focusScore > 0.8 && this.engagementLevel > 0.8) {
      this.emotionalState = 'flow'
    } else if (this.focusScore > 0.7) {
      this.emotionalState = 'focused'
    } else {
      this.emotionalState = 'calm'
    }
  }

  private recordSample() {
    this.historyBuffer.push({
      heartRate: this.heartRate,
      stressLevel: this.stressLevel,
      focusScore: this.focusScore,
      engagementLevel: this.engagementLevel,
      emotionalState: this.emotionalState,
    })

    if (this.historyBuffer.length > this.maxHistoryLength) {
      this.historyBuffer.shift()
    }
  }

  setEngagement(level: number) {
    this.engagementLevel = Math.max(0, Math.min(1, level))
  }

  getData(): BiometricData {
    return {
      heartRate: Math.round(this.heartRate),
      stressLevel: parseFloat(this.stressLevel.toFixed(2)),
      focusScore: parseFloat(this.focusScore.toFixed(2)),
      engagementLevel: parseFloat(this.engagementLevel.toFixed(2)),
      emotionalState: this.emotionalState,
    }
  }

  getHistory(minutes: number = 5): BiometricData[] {
    const samples = Math.min(minutes * 60, this.historyBuffer.length)
    return this.historyBuffer.slice(-samples)
  }

  getAverageStress(minutes: number = 5): number {
    const history = this.getHistory(minutes)
    if (history.length === 0) return 0
    const sum = history.reduce((acc, d) => acc + d.stressLevel, 0)
    return Math.round((sum / history.length) * 100) / 100
  }
}

export class FacialEmotionDetector {
  private emotions: FacialEmotionData = {
    happiness: 0,
    concentration: 0,
    frustration: 0,
    confidence: 0,
    mood: 'neutral',
  }
  private simulationInterval: ReturnType<typeof setInterval> | null = null

  // Simulates facial recognition data (would integrate with ml5.js or face-api.js in production)
  simulateEmotionDetection() {
    if (this.simulationInterval !== null) return
    this.simulationInterval = setInterval(() => {
      this.emotions = {
        happiness: Math.random() * 0.8,
        concentration: 0.5 + Math.random() * 0.5,
        frustration: Math.random() * 0.4,
        confidence: 0.6 + Math.random() * 0.4,
        mood: this.determineMood(),
      }
    }, 2000)
  }

  stopEmotionDetection() {
    if (this.simulationInterval !== null) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = null
    }
  }

  private determineMood(): 'positive' | 'neutral' | 'negative' {
    const sentiment = this.emotions.happiness - this.emotions.frustration
    if (sentiment > 0.3) return 'positive'
    if (sentiment < -0.3) return 'negative'
    return 'neutral'
  }

  getEmotions(): FacialEmotionData {
    return this.emotions
  }

  getDominantEmotion(): keyof Omit<FacialEmotionData, 'mood'> {
    const { happiness, concentration, frustration, confidence } = this.emotions
    const emotions = { happiness, concentration, frustration, confidence }
    const ranked = Object.entries(emotions).sort(([, a], [, b]) => b - a)
    return (ranked[0]?.[0] as keyof Omit<FacialEmotionData, 'mood'>) ?? 'concentration'
  }
}

export const biometricMonitor = new BiometricMonitor()
export const facialDetector = new FacialEmotionDetector()
