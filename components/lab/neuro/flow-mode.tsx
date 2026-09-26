'use client'

import { useState, useEffect } from 'react'
import { biometricMonitor } from '@/lib/lab/neuro/biometrics'
import { voiceListener } from '@/lib/lab/neuro/voice-commands'

interface FlowModeProps {
  onExit?: () => void
}

export function FlowMode({ onExit }: FlowModeProps) {
  const [isActive, setIsActive] = useState(true)
  const [stressLevel, setStressLevel] = useState(0.3)
  const [focusScore, setFocusScore] = useState(0.8)
  const [hideUI, setHideUI] = useState(false)

  useEffect(() => {
    voiceListener.onCommand('stop', () => setIsActive(false))
    voiceListener.start()

    const updateInterval = setInterval(() => {
      const data = biometricMonitor.getData()
      setStressLevel(data.stressLevel)
      setFocusScore(data.focusScore)
    }, 1000)

    return () => {
      clearInterval(updateInterval)
      voiceListener.stop()
    }
  }, [])

  if (!isActive) {
    onExit?.()
    return null
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {!hideUI && (
        <div className="absolute top-4 right-4 flex gap-2 text-xs font-mono">
          <div className="text-primary">FOCUS: {Math.round(focusScore * 100)}%</div>
          <div className={stressLevel > 0.6 ? 'text-destructive' : 'text-primary'}>
            STRESS: {Math.round(stressLevel * 100)}%
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary neon-pulse mb-2">FLOW STATE ACTIVE</h2>
            <p className="text-sm text-muted-foreground">Distractions minimized • Focus maximized</p>
          </div>

          <div className="w-full max-w-2xl aspect-video bg-card border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground text-sm">
              <p>Code Editor & Breadboard</p>
              <p className="text-xs mt-2">{"(Press ESC or say 'stop' to exit Flow Mode)"}</p>
            </div>
          </div>

          {stressLevel > 0.7 && (
            <div className="text-center p-4 border border-destructive rounded">
              <p className="text-sm text-destructive">High stress detected. Breathe. Pause if needed.</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground font-mono">
        {'Say "run" to execute • Say "reset" to clear • Say "help" for commands'}
      </div>

      <button
        onClick={() => setHideUI(!hideUI)}
        className="absolute bottom-4 right-4 px-3 py-1 text-xs bg-primary/10 border border-primary rounded hover:bg-primary/20"
      >
        {hideUI ? 'Show UI' : 'Hide UI'}
      </button>
    </div>
  )
}
