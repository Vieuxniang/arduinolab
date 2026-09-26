/**
 * @deprecated - Replaced by VoiceAssistant component
 * This file is kept as a backup but AiBot is no longer used in lab-app.tsx
 * Use VoiceAssistant instead for the LAB-AI interface
 */
"use client"

import { useState } from "react"
import { Sparkles, Send } from "lucide-react"
import { labAI } from "@/lib/lab/voice-ai"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"

interface AiBotProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export function AiBot({ position = "bottom-right" }: AiBotProps) {
  const { lang, soundEnabled } = useLab()
  const [isOpen, setIsOpen] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  const messages = [
    { label: "Welcome", key: "welcome" as const },
    { label: "Start Mission", key: "mission_start" as const },
    { label: "Success!", key: "success" as const },
    { label: "Error Help", key: "error" as const },
    { label: "Combo!", key: "combo" as const },
  ]

  const handleSpeak = (key: "welcome" | "mission_start" | "success" | "error" | "combo") => {
    if (soundEnabled && labAI) {
      setSpeaking(true)
      labAI.speak(key)
      setTimeout(() => setSpeaking(false), 3000)
    }
  }

  return (
    <div className={`fixed z-30 ${positionClasses[position]}`}>
      {/* Chat bubble */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-64 border-2 border-primary/50 bg-card rounded-lg shadow-2xl shadow-black/50 p-4 mb-2">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-primary font-mono flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              LAB-AI Assistant
            </h3>
            <p className="text-xs text-muted-foreground">
              {translate(lang, "app_name")} guide. Select a command to hear a message.
            </p>
          </div>

          <div className="space-y-2 mb-3">
            {messages.map((msg) => (
              <button
                key={msg.key}
                onClick={() => handleSpeak(msg.key)}
                disabled={speaking}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded border transition-all ${
                  speaking
                    ? "border-muted-foreground/30 text-muted-foreground cursor-not-allowed"
                    : "border-primary/30 text-primary hover:border-primary hover:bg-primary/10"
                }`}
              >
                <Send className="w-3 h-3 inline mr-1" />
                {msg.label}
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-2 text-[11px] text-muted-foreground">
            {soundEnabled ? "🔊 Sound enabled" : "🔇 Sound disabled in settings"}
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all shadow-lg ${
          isOpen
            ? "bg-primary/30 border-primary shadow-primary/50"
            : "bg-card border-primary/50 hover:border-primary hover:bg-primary/10"
        } ${speaking && "animate-pulse"}`}
        aria-label="LAB-AI Assistant"
        title="LAB-AI Assistant"
      >
        <Sparkles className={`w-6 h-6 text-primary ${speaking ? "animate-spin" : ""}`} />
      </button>

      {/* Label */}
      <div className="text-xs text-primary/60 mt-2 text-center font-mono font-bold">
        {isOpen ? "OPEN" : "AI"}
      </div>
    </div>
  )
}
