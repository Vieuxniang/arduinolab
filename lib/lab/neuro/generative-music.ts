export class GenerativeMusic {
  private audioContext: AudioContext | null = null
  private oscillators: OscillatorNode[] = []
  private gainNodes: GainNode[] = []
  private modulationIntervals: ReturnType<typeof setInterval>[] = []
  private isPlaying = false

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new window.AudioContext()
    }
  }

  startZenMusic() {
    if (!this.audioContext || this.isPlaying) return

    this.isPlaying = true
    const now = this.audioContext.currentTime
    const baseFreq = 432 // Healing frequency

    // Create harmonic layers for zen mode
    const frequencies = [
      baseFreq,
      baseFreq * 1.25, // Major third
      baseFreq * 1.5, // Perfect fifth
      baseFreq * 2, // Octave
    ]

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext!.createOscillator()
      const gain = this.audioContext!.createGain()

      osc.type = index % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.05, now + 0.5)

      osc.connect(gain)
      gain.connect(this.audioContext!.destination)

      osc.start(now)
      this.oscillators.push(osc)
      this.gainNodes.push(gain)

      // Modulate frequency gently (cleared in stopZenMusic)
      const intervalId = setInterval(() => {
        const variation = Math.sin(Date.now() / 5000) * freq * 0.05
        osc.frequency.linearRampToValueAtTime(freq + variation, this.audioContext!.currentTime + 0.1)
      }, 500)
      this.modulationIntervals.push(intervalId)
    })
  }

  stopZenMusic() {
    if (!this.audioContext || !this.isPlaying) return

    this.isPlaying = false
    this.modulationIntervals.forEach((id) => clearInterval(id))
    this.modulationIntervals = []
    const now = this.audioContext.currentTime

    this.oscillators.forEach((osc) => {
      osc.stop(now + 0.5)
    })

    this.gainNodes.forEach((gain) => {
      gain.gain.linearRampToValueAtTime(0, now + 0.5)
    })

    this.oscillators = []
    this.gainNodes = []
  }

  playBiofeedbackTone(frequency: number = 528) {
    if (!this.audioContext) return

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const now = this.audioContext.currentTime

    osc.frequency.value = frequency
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc.connect(gain)
    gain.connect(this.audioContext.destination)

    osc.start(now)
    osc.stop(now + 0.5)
  }

  playSuccessTone() {
    this.playBiofeedbackTone(528) // Love frequency
    setTimeout(() => this.playBiofeedbackTone(639), 150) // Communication frequency
  }

  playErrorTone() {
    this.playBiofeedbackTone(174) // Grounding frequency
  }

  isActive() {
    return this.isPlaying
  }
}

export const generativeMusic = new GenerativeMusic()
