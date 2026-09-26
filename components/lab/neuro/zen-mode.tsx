'use client'

import { useState, useEffect } from 'react'
import { Music, X } from 'lucide-react'

interface ZenModeProps {
  missionId: string
  onExit?: () => void
}

export function ZenMode({ onExit }: ZenModeProps) {
  const [isActive, setIsActive] = useState(true)
  const [musicPlaying, setMusicPlaying] = useState(true)
  const [breathingPhase, setBreathingPhase] = useState(0)

  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathingPhase((p) => (p + 1) % 4)
    }, 4000)

    return () => clearInterval(breathInterval)
  }, [])

  const getBreathingText = () => {
    switch (breathingPhase) {
      case 0:
        return 'Breathe in...'
      case 1:
        return 'Hold...'
      case 2:
        return 'Breathe out...'
      default:
        return 'Pause...'
    }
  }

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 0:
        return 'scale-100'
      case 1:
        return 'scale-110'
      case 2:
        return 'scale-95'
      default:
        return 'scale-100'
    }
  }

  if (!isActive) {
    onExit?.()
    return null
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-secondary to-background z-50 flex flex-col items-center justify-center">
      {/* Breathing Circle */}
      <div className={`w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center transition-transform duration-4000 ${getBreathingScale()}`}>
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-primary font-mono">{getBreathingText()}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2 neon-pulse">ZEN MODE</h1>
        <p className="text-sm text-muted-foreground mb-4">No time limits • Immersive focus • Generative music</p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Music className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">{musicPlaying ? 'Music playing' : 'Music paused'}</span>
        </div>

        <button
          onClick={() => setMusicPlaying(!musicPlaying)}
          className="px-4 py-2 text-sm bg-primary/10 border border-primary rounded hover:bg-primary/20 transition"
        >
          {musicPlaying ? 'Pause Music' : 'Play Music'}
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setIsActive(false)}
        className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded transition"
      >
        <X className="w-5 h-5 text-primary" />
      </button>

      {/* Ambient Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid-bg w-full h-full" />
      </div>
    </div>
  )
}
