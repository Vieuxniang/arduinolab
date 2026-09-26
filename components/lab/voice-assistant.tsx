"use client"

import { useEffect, useState, useRef } from "react"
import { Volume2, Sparkles } from "lucide-react"
import { labAI } from "@/lib/lab/voice-ai"
import { useLab } from "@/lib/lab/store"

export function VoiceAssistant() {
  const { soundEnabled, lang, xp, completed, totalMissions, userLevel, combo } = useLab()
  const [speaking, setSpeaking] = useState(false)
  const [coachNote, setCoachNote] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPosition({ x: Math.max(12, window.innerWidth - 80), y: Math.max(80, window.innerHeight - 200) })
  }, [])

  // Monitor speaking status
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeaking(labAI?.isActive() ?? false)
    }, 250)
    return () => clearInterval(interval)
  }, [])

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (menuOpen) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // Keep within viewport
      const maxX = window.innerWidth - 64
      const maxY = window.innerHeight - 64

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset, position])

  const askCoach = (topic: "next" | "debug" | "focus") => {
    const remaining = Math.max(0, totalMissions - completed.length)
    const notes = {
      next: lang === "fr"
        ? `Tu es ${userLevel}. Il reste ${remaining} mission${remaining > 1 ? "s" : ""}. Commence par une mission LED courte, puis teste ton montage étape par étape.`
        : `You are ${userLevel}. ${remaining} mission${remaining === 1 ? " remains" : " missions remain"}. Start with a short LED mission, then test your circuit step by step.`,
      debug: lang === "fr"
        ? "Conseil dépannage : vérifie d'abord l'alimentation, puis la masse GND, les connexions et enfin la valeur du capteur. Une seule modification à la fois."
        : "Debug tip: check power first, then GND, connections, and finally the sensor value. Change one thing at a time.",
      focus: lang === "fr"
        ? `Objectif du jour : gagner de l'XP avec régularité. Ton combo actuel est ${combo.count}. Respire, lis l'objectif, puis construis le circuit avant de coder.`
        : `Today's goal: earn XP consistently. Your current combo is ${combo.count}. Read the objective, build the circuit, then code.`,
    }
    setCoachNote(notes[topic])
    if (soundEnabled && labAI) labAI.speak(topic === "debug" ? "error" : topic === "focus" ? "combo" : "mission_start")
  }

  const triggerWelcome = () => {
    if (soundEnabled && labAI) {
      labAI.speak("welcome")
    }
    setMenuOpen(false)
  }

  const triggerMissionStart = () => {
    if (soundEnabled && labAI) {
      labAI.speak("mission_start")
    }
    setMenuOpen(false)
  }

  const triggerSuccess = () => {
    if (soundEnabled && labAI) {
      labAI.speak("success")
    }
    setMenuOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-50 cursor-grab active:cursor-grabbing"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? "none" : "all 0.2s ease-out",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main button */}
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-md shadow-black/40 transition-all pointer-events-auto ${
          speaking
            ? "bg-primary/30 border-primary shadow-lg shadow-primary/50 neon-pulse"
            : "bg-card border-primary/50 hover:border-primary hover:bg-primary/10"
        } ${!soundEnabled && "opacity-50"}`}
        onClick={(e) => {
          e.stopPropagation()
          setMenuOpen(!menuOpen)
        }}
      >
        {speaking ? (
          <Volume2 className="w-6 h-6 text-primary animate-spin" />
        ) : (
          <Sparkles className="w-6 h-6 text-primary" />
        )}
      </div>

      {/* Label */}
      <div className="mt-2 rounded-full bg-card/95 px-2 py-0.5 text-center font-mono text-xs font-semibold text-primary/80">
        LAB-AI
      </div>

      {/* Menu dropdown */}
      {menuOpen && (
        <div className="absolute bottom-20 -left-56 w-64 border-2 border-primary/70 bg-black/95 shadow-2xl shadow-primary/40 rounded-lg overflow-visible z-50 backdrop-blur-sm pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-3 space-y-2 pointer-events-auto">
            {/* Header */}
            <div className="pb-2 border-b border-primary/30">
              <h3 className="text-xs font-bold text-primary font-mono">
                ⚡ LAB-AI VOICE COMMANDS
              </h3>
              <p className="mt-1 text-[11px] text-primary/70">Select a command to hear guidance</p>
            </div>

            {coachNote && (
              <div className="rounded-md border border-primary/40 bg-primary/10 p-3 text-xs leading-relaxed text-primary">
                <div className="mb-1 font-bold">COACH // {xp} XP</div>
                {coachNote}
              </div>
            )}

            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => askCoach("next")} className="rounded-md border border-primary/40 px-2 py-2 text-[10px] font-mono text-primary hover:bg-primary/20">NEXT</button>
              <button onClick={() => askCoach("debug")} className="rounded-md border border-primary/40 px-2 py-2 text-[10px] font-mono text-primary hover:bg-primary/20">DEBUG</button>
              <button onClick={() => askCoach("focus")} className="rounded-md border border-primary/40 px-2 py-2 text-[10px] font-mono text-primary hover:bg-primary/20">FOCUS</button>
            </div>

            {/* Commands */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                triggerWelcome()
              }}
              className="w-full text-left px-3 py-3 text-xs font-mono text-primary hover:bg-primary/20 border border-primary/40 rounded transition-all hover:border-primary hover:shadow-md hover:shadow-primary/30 cursor-pointer pointer-events-auto"
            >
              <div className="font-bold">✓ Welcome</div>
              <div className="text-[11px] text-primary/60">Start intro message</div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                triggerMissionStart()
              }}
              className="w-full text-left px-3 py-3 text-xs font-mono text-primary hover:bg-primary/20 border border-primary/40 rounded transition-all hover:border-primary hover:shadow-md hover:shadow-primary/30 cursor-pointer pointer-events-auto"
            >
              <div className="font-bold">▶ Mission Start</div>
              <div className="text-[11px] text-primary/60">New mission begins</div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                triggerSuccess()
              }}
              className="w-full text-left px-3 py-3 text-xs font-mono text-primary hover:bg-primary/20 border border-primary/40 rounded transition-all hover:border-primary hover:shadow-md hover:shadow-primary/30 cursor-pointer pointer-events-auto"
            >
              <div className="font-bold">✦ Success</div>
              <div className="text-[11px] text-primary/60">Mission completed</div>
            </button>

            {/* Status footer */}
            <div className="pt-2 border-t border-primary/30 text-[11px]">
              <div className="text-primary/60">
                Sound: <span className={soundEnabled ? "text-primary font-bold" : "text-primary/40"}>
                  {soundEnabled ? "🔊 ENABLED" : "🔇 DISABLED"}
                </span>
              </div>
              <div className="text-primary/40 mt-1">
                Toggle in Settings to enable/disable
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag hint */}
      {isDragging && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-primary/60">
          Release to place
        </div>
      )}
    </div>
  )
}
