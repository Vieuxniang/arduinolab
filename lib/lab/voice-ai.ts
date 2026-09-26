export class LabAI {
  private synth = window.speechSynthesis
  private voiceActive = false

  private responses = {
    welcome: "Welcome to ArduinoLab. I am LAB-AI, your guide. Let's build something amazing.",
    mission_start: "Mission starting. Listen carefully to understand what you need to do.",
    block_added: "Block added successfully. You can add more blocks or execute your code.",
    executing: "Executing code now. Watch the simulation carefully.",
    success: "Mission completed! Great job. You earned LAB tokens and experience points.",
    error: "Oops! There was an error in your code. Let me help you fix it.",
    combo: "Combo streak active! You're on fire. Keep going for multiplied rewards.",
    time_attack: "Time Attack mode activated. Solve this before time runs out!",
  }

  speak(key: keyof typeof this.responses, rate = 0.9) {
    if (this.voiceActive) this.synth.cancel()

    const text = this.responses[key]
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = 0.8
    utterance.volume = 1

    this.voiceActive = true
    utterance.onend = () => {
      this.voiceActive = false
    }

    this.synth.speak(utterance)
  }

  stop() {
    this.synth.cancel()
    this.voiceActive = false
  }

  isActive() {
    return this.voiceActive
  }
}

export const labAI = typeof window !== "undefined" ? new LabAI() : null
