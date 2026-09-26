import { useState, useEffect, useCallback, useRef } from 'react'

interface UseVoiceControlOptions {
  onCommand?: (command: string) => void
  enabled?: boolean
}

// The DOM lib used by this project does not ship SpeechRecognition typings.
interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onend: (() => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

export function useVoiceControl({ onCommand, enabled = true }: UseVoiceControlOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null)

  // Keep the latest callback in a ref so the recognition instance can be
  // created once (recreating it on every render would loop forever and abort
  // any listening session in progress).
  const onCommandRef = useRef(onCommand)
  useEffect(() => {
    onCommandRef.current = onCommand
  }, [onCommand])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const vendorWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor
      webkitSpeechRecognition?: SpeechRecognitionCtor
    }
    const SpeechRecognition =
      vendorWindow.SpeechRecognition ?? vendorWindow.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = false
    rec.lang = 'en-US'

    rec.onstart = () => setIsListening(true)
    rec.onend = () => setIsListening(false)

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i]?.[0]?.transcript
        if (chunk) transcript += chunk.toLowerCase()
      }

      // Command detection
      if (transcript.includes('run') || transcript.includes('execute')) {
        onCommandRef.current?.('run')
      } else if (transcript.includes('stop') || transcript.includes('pause')) {
        onCommandRef.current?.('stop')
      } else if (transcript.includes('reset') || transcript.includes('clear')) {
        onCommandRef.current?.('reset')
      } else if (transcript.includes('help')) {
        onCommandRef.current?.('help')
      }
    }

    rec.onerror = () => {
      setIsListening(false)
    }

    setRecognition(rec)

    return () => {
      rec.abort()
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (!recognition || !enabled) return

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }, [recognition, isListening, enabled])

  return {
    isListening,
    toggleListening,
    isSupported: !!recognition,
  }
}
