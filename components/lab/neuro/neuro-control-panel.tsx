'use client'

import { useState } from 'react'
import { Settings, Zap, Volume2, Eye, Headphones, BookOpen } from 'lucide-react'

interface NeuroControlPanelProps {
  onFlowMode?: () => void
  onZenMode?: () => void
  onARMode?: () => void
  onVRMode?: () => void
  onJournal?: () => void
}

export function NeuroControlPanel({
  onFlowMode,
  onZenMode,
  onARMode,
  onVRMode,
  onJournal,
}: NeuroControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {isOpen && (
        <div className="absolute bottom-12 right-0 flex flex-col gap-2 bg-card border border-border rounded-lg p-2 backdrop-blur">
          <button
            onClick={() => {
              onFlowMode?.()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded text-sm text-primary transition"
            title="Minimalist focus mode"
          >
            <Zap className="w-4 h-4" />
            Flow Mode
          </button>

          <button
            onClick={() => {
              onZenMode?.()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded text-sm text-primary transition"
            title="Untimed zen meditation"
          >
            <Volume2 className="w-4 h-4" />
            Zen Mode
          </button>

          <button
            onClick={() => {
              onARMode?.()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded text-sm text-primary transition"
            title="Project circuit on desk"
          >
            <Eye className="w-4 h-4" />
            AR Mode
          </button>

          <button
            onClick={() => {
              onVRMode?.()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded text-sm text-primary transition"
            title="Full immersion VR"
          >
            <Headphones className="w-4 h-4" />
            VR Mode
          </button>

          <button
            onClick={() => {
              onJournal?.()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded text-sm text-primary transition"
            title="Learning journal"
          >
            <BookOpen className="w-4 h-4" />
            Journal
          </button>

          <div className="h-px bg-border my-1" />

          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-muted-foreground hover:text-primary px-3 py-1"
          >
            Close
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-background hover:opacity-80 transition shadow-lg"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}
