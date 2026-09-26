"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import { LANGUAGES, type Lang } from "./i18n"
import { MISSIONS, type MissionLevel, LEVEL_ORDER } from "./missions"
import { labAI } from "./voice-ai"
import { usePiAuth } from "@/contexts/pi-auth-context"

const PROGRESS_KEY = "arduinolab.progress"
const STARTING_LAB = 100
const SAVE_DELAY = 1200

const SUPPORTED_LANGS = LANGUAGES.map((l) => l.code)

function isSupportedLang(value: unknown): value is Lang {
  return typeof value === "string" && SUPPORTED_LANGS.includes(value as Lang)
}

interface LabState {
  lang: Lang
  xp: number
  lab: number
  completed: number[]
  langChosen: boolean
}

interface ComboStreak {
  count: number
  multiplier: number
  active: boolean
  lastMissionTime: number
}

interface LabContextType {
  ready: boolean
  uid: string
  lang: Lang
  setLang: (l: Lang) => void
  langChosen: boolean
  confirmLang: (l: Lang) => void
  xp: number
  lab: number
  completed: number[]
  userLevel: string
  totalMissions: number
  level: number
  gameMode: "standard" | "timeAttack"
  combo: ComboStreak
  soundEnabled: boolean
  toggleSound: () => void
  isCompleted: (id: number) => boolean
  isLevelComplete: (level: MissionLevel) => boolean
  isUnlocked: (id: number) => boolean
  canAfford: (cost: number) => boolean
  completeMission: (id: number) => void
  spendForMission: (cost: number) => boolean
  addLab: (amount: number) => void
  updateCombo: (count: number) => void
  setGameMode: (mode: "standard" | "timeAttack") => void
}

const LabContext = createContext<LabContextType | undefined>(undefined)

function levelFromXp(xp: number): string {
  return "LPI" + (1 + Math.floor(xp / 300))
}

export function LabProvider({ uid, children }: { uid: string; children: ReactNode }) {
  const { sdk } = usePiAuth()
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<LabState>({
    lang: "fr",
    xp: 0,
    lab: STARTING_LAB,
    completed: [],
    langChosen: false,
  })
  const [combo, setCombo] = useState<ComboStreak>({ count: 0, multiplier: 1, active: false, lastMissionTime: 0 })
  const [gameMode, setGameMode] = useState<"standard" | "timeAttack">("standard")
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Synchronous mirror of `state`. React runs state updaters lazily, so they
  // must stay pure and cannot be used for control flow; all mutations go
  // through `commitState`, which lets callbacks both read the current value
  // and report the outcome of the update they perform.
  const stateRef = useRef(state)
  const commitState = useCallback((updater: (s: LabState) => LabState) => {
    const next = updater(stateRef.current)
    stateRef.current = next
    setState(next)
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!sdk) {
      setReady(true)
      return
    }

    sdk.state.get(PROGRESS_KEY).then((record) => {
      if (cancelled) return
      const blob = record?.blob
      if (blob && typeof blob === "object") {
        const parsed = blob as Partial<LabState>
        commitState((current) => ({
          ...current,
          lang: isSupportedLang(parsed.lang) ? parsed.lang : current.lang,
          xp: typeof parsed.xp === "number" && Number.isFinite(parsed.xp) && parsed.xp >= 0 ? parsed.xp : current.xp,
          lab: typeof parsed.lab === "number" && Number.isFinite(parsed.lab) && parsed.lab >= 0 ? parsed.lab : current.lab,
          completed: Array.isArray(parsed.completed)
            ? parsed.completed.filter((id): id is number => Number.isInteger(id) && id >= 0 && id <= 45).slice(0, 45)
            : current.completed,
          langChosen: parsed.langChosen === true,
        }))
      }
      setReady(true)
    }).catch(() => setReady(true))

    return () => { cancelled = true }
  }, [sdk, commitState])

  useEffect(() => {
    if (!ready || !sdk) return
    const timer = window.setTimeout(() => {
      sdk.state.set(PROGRESS_KEY, {
        lang: state.lang,
        xp: Math.max(0, state.xp),
        lab: Math.max(0, state.lab),
        completed: state.completed.filter((id) => Number.isInteger(id)).slice(0, 45),
        langChosen: state.langChosen,
      }).catch(() => {
        // Keep the current in-memory progress; a later state change retries the save.
      })
    }, SAVE_DELAY)
    return () => window.clearTimeout(timer)
  }, [sdk, ready, state])

  const setLang = useCallback((l: Lang) => {
    commitState((s) => ({ ...s, lang: l }))
  }, [commitState])

  const confirmLang = useCallback((l: Lang) => {
    commitState((s) => ({ ...s, lang: l, langChosen: true }))
  }, [commitState])

  const isCompleted = useCallback(
    (id: number) => state.completed.includes(id),
    [state.completed],
  )

  const isLevelComplete = useCallback(
    (level: MissionLevel) => {
      const ids = MISSIONS.filter((m) => m.level === level).map((m) => m.id)
      return ids.every((id) => state.completed.includes(id))
    },
    [state.completed],
  )

  const isUnlocked = useCallback(
    (id: number) => {
      const m = MISSIONS.find((x) => x.id === id)
      if (!m) return false
      const idx = LEVEL_ORDER.indexOf(m.level)
      if (idx === 0) return true
      const prevLevel = LEVEL_ORDER[idx - 1]
      const prevIds = MISSIONS.filter((x) => x.level === prevLevel).map((x) => x.id)
      return prevIds.every((pid) => state.completed.includes(pid))
    },
    [state.completed],
  )

  const canAfford = useCallback((cost: number) => state.lab >= cost, [state.lab])

  const completeMission = useCallback((id: number) => {
    const current = stateRef.current
    if (current.completed.includes(id)) return
    const m = MISSIONS.find((x) => x.id === id)
    if (!m) return

    commitState((s) => ({
      ...s,
      completed: [...s.completed, id],
      xp: s.xp + m.xp,
      lab: s.lab + Math.round(m.cost * 1.5),
    }))

    // Trigger LAB-AI success event (kept outside the state updater, which
    // must remain pure — React may invoke it more than once).
    if (soundEnabled) {
      setTimeout(() => labAI?.speak("success"), 300)
    }
  }, [commitState, soundEnabled])

  const spendForMission = useCallback(
    (cost: number) => {
      const current = stateRef.current
      if (current.lab < cost) return false
      commitState((s) => ({ ...s, lab: s.lab - cost }))
      return true
    },
    [commitState],
  )

  const addLab = useCallback((amount: number) => {
    commitState((s) => ({ ...s, lab: s.lab + amount }))
  }, [commitState])

  const updateCombo = useCallback((count: number) => {
    setCombo({
      count,
      multiplier: 1 + Math.floor(count / 3) * 0.5,
      active: count > 0,
      lastMissionTime: Date.now(),
    })
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  const value: LabContextType = {
    ready,
    uid,
    lang: state.lang,
    setLang,
    langChosen: state.langChosen,
    confirmLang,
    xp: state.xp,
    lab: state.lab,
    completed: state.completed,
    userLevel: levelFromXp(state.xp),
    totalMissions: MISSIONS.length,
    level: 1 + Math.floor(state.xp / 300),
    gameMode,
    combo,
    soundEnabled,
    toggleSound,
    isCompleted,
    isLevelComplete,
    isUnlocked,
    canAfford,
    completeMission,
    spendForMission,
    addLab,
    updateCombo,
    setGameMode,
  }

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>
}

export function useLab() {
  const ctx = useContext(LabContext)
  if (!ctx) throw new Error("useLab must be used within LabProvider")
  return ctx
}
