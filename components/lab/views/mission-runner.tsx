"use client"

import { useMemo, useState, useEffect } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { type Mission, BADGE_BY_LEVEL } from "@/lib/lab/missions"
import { generateCode, starterCodeForSim, type BlockType } from "@/lib/lab/code-gen"
import { labAI } from "@/lib/lab/voice-ai"
import { BlockEditor } from "../block-editor"
import { Terminal } from "../terminal"
import { LedSim } from "../sims/led-sim"
import { MotorSim } from "../sims/motor-sim"
import { LcdSim } from "../sims/lcd-sim"
import { ArrowLeft, Play, Footprints, RotateCcw, Check, Coins, Zap } from "lucide-react"

const BADGE_COLOR: Record<string, string> = {
  beginner: "var(--chart-1)",
  intermediate: "var(--chart-3)",
  expert: "var(--chart-4)",
}

export function MissionRunner({
  mission,
  onBack,
}: {
  mission: Mission
  onBack: () => void
}) {
  const { lang, isCompleted, completeMission, spendForMission, canAfford, soundEnabled } = useLab()
  const done = isCompleted(mission.id)
  const [sequence, setSequence] = useState<BlockType[]>([])
  const [running, setRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const [code, setCode] = useState<string | null>(null)
  const [paid, setPaid] = useState(done)
  const [validated, setValidated] = useState(false)

  // Trigger mission start audio
  useEffect(() => {
    if (soundEnabled && !done) {
      const timer = window.setTimeout(() => labAI?.speak("mission_start"), 500)
      return () => window.clearTimeout(timer)
    }
  }, [done, soundEnabled])

  // visual sim state derived from executed blocks
  const execBlocks = stepIndex >= 0 ? sequence.slice(0, stepIndex + 1) : sequence
  const ledOn = execBlocks.lastIndexOf("led_on") > execBlocks.lastIndexOf("led_off")
  const motorOn = execBlocks.includes("pwm_motor")
  const lcdOn = execBlocks.includes("write_lcd")

  const startCode = useMemo(() => starterCodeForSim(mission.sim), [mission.sim])

  const ensurePaid = () => {
    if (paid) return true
    if (!canAfford(mission.cost)) return false
    const ok = spendForMission(mission.cost)
    if (ok) setPaid(true)
    return ok
  }

  const runAll = () => {
    if (!ensurePaid()) return
    if (soundEnabled) {
      labAI?.speak("executing")
    }
    setRunning(true)
    setStepIndex(-1)
    setCode(sequence.length ? generateCode(sequence) : startCode)
    setTimeout(() => setRunning(false), 1500)
  }

  const runStep = () => {
    if (!ensurePaid()) return
    const next = Math.min(stepIndex + 1, sequence.length - 1)
    setStepIndex(next)
    setCode(generateCode(sequence.slice(0, next + 1)))
  }

  const reset = () => {
    setStepIndex(-1)
    setRunning(false)
    setCode(null)
  }

  const validate = () => {
    if (!ensurePaid()) return
    completeMission(mission.id)
    setValidated(true)
  }

  const renderSim = () => {
    switch (mission.sim) {
      case "led":
        return <LedSim on={ledOn} />
      case "motor":
        return <MotorSim speed={motorOn ? 180 : 0} />
      case "lcd":
        return <LcdSim line1={lcdOn ? mission.name.en : ""} line2={lcdOn ? "ArduinoLab" : ""} />
      case "iot":
        return (
          <div className="grid grid-cols-2 gap-2">
            <LedSim on={ledOn} />
            <MotorSim speed={motorOn ? 180 : 0} />
          </div>
        )
      default:
        return (
          <div className="rounded-lg border border-border bg-background p-6 text-center text-xs text-muted-foreground">
            {">"} sensor circuit active
          </div>
        )
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-2">
        <button
          onClick={onBack}
          aria-label="back"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span
          className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            color: BADGE_COLOR[mission.level],
            borderColor: BADGE_COLOR[mission.level],
          }}
        >
          {translate(lang, BADGE_BY_LEVEL[mission.level])}
        </span>
        <h2 className="flex-1 truncate text-sm font-semibold text-foreground">
          {mission.name[lang]}
        </h2>
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {translate(lang, "objective")}: {mission.objective[lang]}
        </p>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="flex items-center gap-1" style={{ color: "var(--chart-4)" }}>
            <Coins className="h-3 w-3" />
            {mission.cost.toFixed(1)} LAB
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Zap className="h-3 w-3" />+{mission.xp} XP
          </span>
          {(done || validated) && (
            <span className="ml-auto flex items-center gap-1 text-primary">
              <Check className="h-3 w-3" />
              {translate(lang, "completed")}
            </span>
          )}
        </div>

        {renderSim()}

        <BlockEditor
          sequence={sequence}
          onAdd={(b) => setSequence((s) => [...s, b])}
          onRemove={(i) => setSequence((s) => s.filter((_, idx) => idx !== i))}
          onClear={() => setSequence([])}
        />

        <div className="grid grid-cols-3 gap-2">
          <button onClick={runAll} className="lab-btn lab-btn-primary py-2.5">
            <Play className="h-3.5 w-3.5" />
            {translate(lang, "run")}
          </button>
          <button onClick={runStep} className="lab-btn lab-btn-secondary py-2.5">
            <Footprints className="h-3.5 w-3.5" />
            {translate(lang, "run_step")}
          </button>
          <button
            onClick={reset}
            className="lab-btn lab-btn-secondary py-2.5 text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {translate(lang, "reset")}
          </button>
        </div>

        {!canAfford(mission.cost) && !paid && (
          <p className="text-center text-[11px] text-destructive">
            {translate(lang, "insufficient")}
          </p>
        )}

        {validated ? (
          <div className="rounded-xl border border-primary/50 bg-primary/10 p-4 text-center">
            <p className="text-sm font-semibold text-primary lab-glow">
              {translate(lang, "mission_done")}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {translate(lang, "earned")}: +{mission.xp} XP / +
              {Math.round(mission.cost * 1.5)} LAB
            </p>
          </div>
        ) : (
          <button
            onClick={validate}
            disabled={done || (!paid && !canAfford(mission.cost))}
            className="lab-btn lab-btn-primary w-full py-2.5 text-sm"
          >
            <Check className="h-4 w-4" />
            {translate(lang, "complete_mission")}
          </button>
        )}
      </div>

      <div className="border-t border-border p-2">
        <Terminal
          placeholder={translate(lang, "terminal_ready")}
          code={code}
          running={running}
        />
      </div>
    </div>
  )
}
