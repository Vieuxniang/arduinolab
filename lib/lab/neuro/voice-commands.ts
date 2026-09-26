export type VoiceCommand = 'run' | 'stop' | 'reset' | 'undo' | 'next' | 'back' | 'help' | 'menu'

// Minimal Web Speech API typings (not shipped with the DOM lib used here).
interface SpeechRecognitionResultLike {
  isFinal: boolean
  [index: number]: { transcript: string }
}

interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const vendorWindow = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return vendorWindow.SpeechRecognition ?? vendorWindow.webkitSpeechRecognition
}

export interface VoiceRecognitionConfig {
  continuous: boolean
  interimResults: boolean
  language: string
}

export class VoiceCommandListener {
  private recognition: SpeechRecognitionLike | null = null
  private isListening = false
  private commandCallbacks: Record<VoiceCommand, () => void> = {
    run: () => {},
    stop: () => {},
    reset: () => {},
    undo: () => {},
    next: () => {},
    back: () => {},
    help: () => {},
    menu: () => {},
  }

  constructor() {
    const SpeechRecognition = getSpeechRecognitionCtor()
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.setupRecognition()
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'

    this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result) continue
        const transcript = result[0]?.transcript.toLowerCase() ?? ''

        if (result.isFinal) {
          this.processCommand(transcript)
        }
      }
    }

    this.recognition.onerror = (event: { error: string }) => {
      console.log('[v0] Voice recognition error:', event.error)
    }
  }

  private processCommand(transcript: string) {
    const commandMap: Record<string, VoiceCommand> = {
      'run': 'run',
      'execute': 'run',
      'start': 'run',
      'stop': 'stop',
      'pause': 'stop',
      'reset': 'reset',
      'clear': 'reset',
      'undo': 'undo',
      'next': 'next',
      'forward': 'next',
      'back': 'back',
      'previous': 'back',
      'help': 'help',
      'menu': 'menu',
    }

    for (const [keyword, command] of Object.entries(commandMap)) {
      if (transcript.includes(keyword)) {
        this.commandCallbacks[command]?.()
        break
      }
    }
  }

  onCommand(command: VoiceCommand, callback: () => void) {
    this.commandCallbacks[command] = callback
  }

  start() {
    if (this.recognition && !this.isListening) {
      this.recognition.start()
      this.isListening = true
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isActive() {
    return this.isListening
  }
}

export const voiceListener = new VoiceCommandListener()
