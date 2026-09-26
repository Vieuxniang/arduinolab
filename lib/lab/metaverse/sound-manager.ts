export type SoundEffect =
  | "notification"
  | "success"
  | "error"
  | "coin"
  | "warp"
  | "server_hum"
  | "synthwave"
  | "mining"

export interface SoundConfig {
  volume: number
  enabled: boolean
  ambience: boolean
}

export class SoundManager {
  private audioContext: AudioContext | null = null
  private ambienceInterval: ReturnType<typeof setInterval> | null = null
  private config: SoundConfig = { volume: 0.5, enabled: true, ambience: true }

  async init() {
    if (!this.audioContext) {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (AudioContextCtor) {
        this.audioContext = new AudioContextCtor()
      }
    }
  }

  private createOscillator(frequency: number, duration: number) {
    if (!this.audioContext) return

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.frequency.value = frequency
    osc.type = "sine"
    gain.gain.setValueAtTime(this.config.volume, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    )

    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    osc.start()
    osc.stop(this.audioContext.currentTime + duration)
  }

  playSfx(effect: SoundEffect) {
    if (!this.config.enabled || !this.audioContext) return

    const patterns: Record<SoundEffect, { freq: number; dur: number }[]> = {
      notification: [{ freq: 880, dur: 0.1 }, { freq: 1100, dur: 0.1 }],
      success: [
        { freq: 523, dur: 0.1 },
        { freq: 659, dur: 0.1 },
        { freq: 784, dur: 0.2 },
      ],
      error: [
        { freq: 200, dur: 0.2 },
        { freq: 150, dur: 0.2 },
      ],
      coin: [
        { freq: 1047, dur: 0.05 },
        { freq: 1318, dur: 0.1 },
      ],
      warp: [
        { freq: 2000, dur: 0.05 },
        { freq: 1500, dur: 0.05 },
      ],
      server_hum: [{ freq: 110, dur: 0.5 }],
      synthwave: [{ freq: 440, dur: 0.2 }],
      mining: [{ freq: 220, dur: 0.15 }, { freq: 165, dur: 0.15 }],
    }

    patterns[effect]?.forEach((p) => this.createOscillator(p.freq, p.dur))
  }

  startAmbience(timeOfDay: string) {
    if (!this.config.ambience) return

    const frequencies: Record<string, number> = {
      dawn: 432,
      morning: 528,
      afternoon: 440,
      evening: 392,
      night: 220,
    }

    const freq = frequencies[timeOfDay] || 440
    this.stopAmbience()
    this.ambienceInterval = setInterval(() => {
      this.createOscillator(freq + Math.random() * 20 - 10, 0.3)
    }, 2000)
  }

  stopAmbience() {
    if (this.ambienceInterval !== null) {
      clearInterval(this.ambienceInterval)
      this.ambienceInterval = null
    }
  }

  setConfig(config: Partial<SoundConfig>) {
    this.config = { ...this.config, ...config }
  }
}

export const soundManager = new SoundManager()
