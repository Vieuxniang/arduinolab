"use client"

import dynamic from "next/dynamic"
import { useState, useRef, useEffect } from "react"
import { useLab } from "@/lib/lab/store"
import type { Mission } from "@/lib/lab/missions"
import { Header } from "./header"
import { BottomNav, type Tab } from "./bottom-nav"
import { LanguageGate } from "./language-gate"
import { SettingsSheet } from "./settings-sheet"
import { ParticleCanvas } from "./particle-canvas"
import { VoiceAssistant } from "./voice-assistant"
import { useVoiceControl } from "./use-voice-control"
import { GenerativeMusic } from "@/lib/lab/neuro/generative-music"
import { HomeView } from "./views/home-view"
import { LedView } from "./views/led-view"
import { SensorView } from "./views/sensor-view"
import { MotorView } from "./views/motor-view"
import { LcdView } from "./views/lcd-view"
import { IotView } from "./views/iot-view"
import { GalleryView } from "./views/gallery-view"
import { MissionsView } from "./views/missions-view"
import { MissionRunner } from "./views/mission-runner"
import { LeaderboardView } from "./views/leaderboard-view"

// Optional advanced features (lazy-load to prevent startup failures)
const MetaverseHub = dynamic(() => import("./views/metaverse-hub").then(m => ({ default: m.MetaverseHub })), { ssr: false })

export function LabApp() {
  const { ready, langChosen, soundEnabled } = useLab()
  const [tab, setTab] = useState<Tab>("home")
  const [mission, setMission] = useState<Mission | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const musicRef = useRef<GenerativeMusic | null>(null)

  // Voice control
  const { isListening, toggleListening } = useVoiceControl({
    onCommand: (command) => {
      if (command === 'run') {
        console.log("[v0] Voice command: RUN")
      } else if (command === 'stop') {
        setMission(null)
      } else if (command === 'reset') {
        console.log("[v0] Voice command: RESET")
      }
    },
  })

  // Initialize ambient music
  useEffect(() => {
    if (typeof window === "undefined" || !soundEnabled) {
      musicRef.current?.stopZenMusic()
      musicRef.current = null
      return
    }

    const music = new GenerativeMusic()
    musicRef.current = music
    music.startZenMusic()

    return () => {
      music.stopZenMusic()
      if (musicRef.current === music) musicRef.current = null
    }
  }, [soundEnabled])

  // Simplified gesture handling without external dependencies
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let touchStartX = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0]?.clientX ?? 0
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? 0
      const delta = touchEndX - touchStartX

      if (Math.abs(delta) > 50) {
        const tabs: Tab[] = ["home", "metaverse", "led", "sensor", "motor", "lcd", "iot", "gallery", "missions", "leaderboard"]
        const currentIdx = tabs.indexOf(tab)

        if (delta > 0 && currentIdx > 0) {
          const prev = tabs[currentIdx - 1]
          if (prev) setTab(prev)
        } else if (delta < 0 && currentIdx < tabs.length - 1) {
          const next = tabs[currentIdx + 1]
          if (next) setTab(next)
        }
      }
    }

    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [tab])

  if (!ready) {
    return (
      <div className="grid h-screen w-full place-items-center bg-background">
        <div className="text-center">
          <div className="text-primary lab-glow text-sm font-mono">{">"} initializing...</div>
        </div>
      </div>
    )
  }

  if (!langChosen) return <LanguageGate />

  const selectMission = (m: Mission) => setMission(m)
  const changeTab = (t: Tab) => {
    setMission(null)
    setTab(t)
  }

  return (
    <div ref={containerRef} className="flex h-[100dvh] w-full flex-col bg-background grid-bg relative">
      <ParticleCanvas />
      <VoiceAssistant />

      <Header 
        onSettings={() => setShowSettings(true)}
        onVoiceToggle={toggleListening}
        voiceActive={isListening}
      />

      <main className="flex-1 overflow-hidden">
        {mission ? (
          <MissionRunner mission={mission} onBack={() => setMission(null)} />
        ) : (
          <div className="h-full w-full overflow-auto">
            {tab === "home" && <HomeView onSelect={selectMission} />}
            {tab === "metaverse" && <MetaverseHub />}
            {tab === "led" && <LedView />}
            {tab === "sensor" && <SensorView />}
            {tab === "motor" && <MotorView />}
            {tab === "lcd" && <LcdView />}
            {tab === "iot" && <IotView />}
            {tab === "gallery" && <GalleryView />}
            {tab === "missions" && <MissionsView onSelect={selectMission} />}
            {tab === "leaderboard" && <LeaderboardView />}
          </div>
        )}
      </main>

      <BottomNav active={tab} onChange={changeTab} />

      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  )
}
