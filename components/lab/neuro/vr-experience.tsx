'use client'

import { useState } from 'react'
import { xrDetector } from '@/lib/lab/neuro/ar-vr-detection'
import { Headphones, X } from 'lucide-react'

interface VRExperienceProps {
  missionId?: string
  onExit?: () => void
}

export function VRExperience({ onExit }: VRExperienceProps) {
  const [isSupported] = useState(xrDetector.canVRExperience())
  const [isInitializing, setIsInitializing] = useState(false)

  const startVRSession = async () => {
    setIsInitializing(true)
    try {
      const session = await xrDetector.startVRSession()
      if (session) {
        // VR session started successfully
        console.log('[v0] VR session active')
      }
    } catch (err) {
      console.log('[v0] VR session error:', err)
    }
    setIsInitializing(false)
  }

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <Headphones className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-4">VR not supported on this device</p>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-primary/10 border border-primary rounded hover:bg-primary/20"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-background to-black z-50 flex flex-col items-center justify-center">
      {/* VR Headset Preview */}
      <div className="mb-8 text-center">
        <div className="w-32 h-32 mx-auto mb-4 border-2 border-primary rounded-lg flex items-center justify-center bg-card">
          <Headphones className="w-16 h-16 text-primary opacity-50" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">VR MODE</h1>
        <p className="text-sm text-muted-foreground">Full immersive laboratory experience</p>
      </div>

      {/* Features */}
      <div className="max-w-md space-y-3 mb-8">
        <div className="p-3 bg-card border border-border rounded text-sm">
          <p className="text-primary font-mono mb-1">360° Breadboard Manipulation</p>
          <p className="text-xs text-muted-foreground">Rotate and inspect circuits from all angles</p>
        </div>
        <div className="p-3 bg-card border border-border rounded text-sm">
          <p className="text-primary font-mono mb-1">Spatial Audio</p>
          <p className="text-xs text-muted-foreground">Immersive binaural soundscape</p>
        </div>
        <div className="p-3 bg-card border border-border rounded text-sm">
          <p className="text-primary font-mono mb-1">Hand Tracking</p>
          <p className="text-xs text-muted-foreground">Manipulate components naturally</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={startVRSession}
          disabled={isInitializing}
          className="px-6 py-2 bg-primary text-background font-mono rounded hover:opacity-80 disabled:opacity-50"
        >
          {isInitializing ? 'Initializing...' : 'Enter VR'}
        </button>
        <button
          onClick={onExit}
          className="px-6 py-2 bg-card border border-border rounded hover:bg-background"
        >
          Cancel
        </button>
      </div>

      {/* Warning */}
      <div className="absolute bottom-4 left-4 right-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-500">
        Ensure you have adequate space and remove obstacles before entering VR
      </div>

      <button
        onClick={onExit}
        className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded"
      >
        <X className="w-5 h-5 text-primary" />
      </button>
    </div>
  )
}
