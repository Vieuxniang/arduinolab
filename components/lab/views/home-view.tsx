"use client"

import { useLab } from "@/lib/lab/store"
import { translate, type Lang } from "@/lib/lab/i18n"
import { MISSIONS, type Mission } from "@/lib/lab/missions"
import { MissionCard } from "../mission-card"
import { Terminal } from "../terminal"
import { PredictiveDashboard, type PredictiveIssue } from "../predictive-dashboard"
import { Coins, Zap, Trophy, Brain, Check, RotateCcw, Sparkles } from "lucide-react"
import { useState } from "react"

export function HomeView({ onSelect }: { onSelect: (m: Mission) => void }) {
  const { lang, uid, xp, lab, completed, totalMissions, userLevel } = useLab()

  const nextMission = MISSIONS.find((m) => !completed.includes(m.id))
  const recommended = MISSIONS.filter((m) => !completed.includes(m.id)).slice(0, 3)
  const pct = Math.round((completed.length / totalMissions) * 100)
  const diagnostics: PredictiveIssue[] = [
    completed.length > 0
      ? { type: "ok", message: lang === "fr" ? "Progression synchronisée et stable" : "Progress is synced and stable", code: "STATE_OK" }
      : { type: "warning", message: lang === "fr" ? "Lance une première mission pour activer ton profil" : "Complete a first mission to activate your profile", code: "BOOTSTRAP" },
    lab < 10
      ? { type: "warning", message: lang === "fr" ? "Réserve LAB faible : privilégie les missions gratuites" : "Low LAB reserve: prioritize low-cost missions", code: "LAB_LOW" }
      : { type: "ok", message: lang === "fr" ? "Réserve LAB suffisante pour expérimenter" : "LAB reserve is ready for experiments", code: "LAB_READY" },
    pct >= 75
      ? { type: "ok", message: lang === "fr" ? "Objectif avancé presque atteint" : "Advanced milestone nearly reached", code: "LEVEL_UP" }
      : { type: "warning", message: lang === "fr" ? "Conseil : alterne LED, capteurs et moteurs" : "Tip: alternate LED, sensor, and motor missions", code: "VARIETY" },
  ]

  return (
    <div className="space-y-3 p-3">
      <div className="rounded-xl border border-border bg-card p-4 lab-scanlines">
        <p className="lab-label">
          {translate(lang, "welcome")}, {uid.slice(0, 14)}
        </p>
        <p className="mt-1 text-sm font-semibold text-primary lab-glow">
          {translate(lang, "tagline")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card icon={<Trophy className="h-4 w-4" />} value={userLevel} label={translate(lang, "level")} color="var(--chart-1)" />
        <Card icon={<Zap className="h-4 w-4" />} value={String(xp)} label={translate(lang, "xp")} color="var(--chart-1)" />
        <Card icon={<Coins className="h-4 w-4" />} value={lab.toFixed(1)} label={translate(lang, "lab_wallet")} color="var(--chart-4)" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{translate(lang, "quick_progress")}</span>
          <span className="font-mono font-semibold text-foreground">
            {completed.length}/{totalMissions}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-background">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">
          {translate(lang, "recommended")}
        </h2>
        <div className="space-y-2">
          {recommended.map((m) => (
            <MissionCard key={m.id} mission={m} onSelect={onSelect} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 lab-scanlines">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {lang === "fr" ? "Modules avancés" : "Advanced modules"}
          </div>
          <span className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            LIVE_SCAN
          </span>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
          {lang === "fr" ? "Diagnostic prédictif, parcours adaptatif et recommandations en temps réel." : "Predictive diagnostics, adaptive learning, and real-time recommendations."}
        </p>
        <PredictiveDashboard issues={diagnostics} />
      </div>

      <Terminal
        placeholder={translate(lang, "terminal_ready")}
        code={`> next: "${nextMission?.name.en ?? "—"}"
> level: ${userLevel}
> progress: ${pct}%
> ready_`}
      />

      <MiniChallenge lang={lang} />
    </div>
  )
}

function MiniChallenge({ lang }: { lang: Lang }) {
  const questions = lang === "fr"
    ? [
        { q: "Quel fil doit toujours être commun au circuit ?", a: ["GND", "DATA", "USB"], correct: 0 },
        { q: "Quel composant produit de la lumière ?", a: ["LED", "Servo", "LCD"], correct: 0 },
        { q: "PWM sert surtout à contrôler…", a: ["La vitesse", "La masse", "Le nom"], correct: 0 },
      ]
    : [
        { q: "Which wire should be shared by the circuit?", a: ["GND", "DATA", "USB"], correct: 0 },
        { q: "Which component produces light?", a: ["LED", "Servo", "LCD"], correct: 0 },
        { q: "PWM mainly controls…", a: ["Speed", "Ground", "Name"], correct: 0 },
      ]
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const question = questions[index]
  const finished = question === undefined

  const choose = (choice: number) => {
    if (question === undefined || answer !== null) return
    setAnswer(choice)
    if (choice === question.correct) setScore((value) => value + 1)
    window.setTimeout(() => {
      setIndex((value) => value + 1)
      setAnswer(null)
    }, 650)
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
    setAnswer(null)
  }

  return (      <div className="rounded-xl border border-border bg-card p-4 lab-scanlines">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Brain className="h-4 w-4 text-primary" />
            {lang === "fr" ? "Défi rapide" : "Quick challenge"}
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            {finished ? `${score}/${questions.length}` : `${index + 1}/${questions.length}`}
          </span>
        </div>
      {question === undefined ? (
        <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/10 p-3.5">
          <div>
            <p className="text-sm font-semibold text-primary">{score === questions.length ? "Perfect run" : "Nice build"}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{lang === "fr" ? "Prêt pour une mission ?" : "Ready for a mission?"}</p>
          </div>
          <button onClick={restart} className="lab-btn lab-btn-secondary gap-1 px-2.5 py-2 text-[11px]">
            <RotateCcw className="h-3 w-3" /> {lang === "fr" ? "Rejouer" : "Replay"}
          </button>
        </div>
      ) : (
        <>
          <p className="mb-2.5 text-sm text-foreground">{question.q}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {question.a.map((choice, choiceIndex) => {
              const selected = answer === choiceIndex
              const correct = choiceIndex === question.correct
              return (
                <button key={choice} onClick={() => choose(choiceIndex)} className={`rounded-md border px-2 py-2.5 text-xs font-medium transition-colors ${selected ? (correct ? "border-primary bg-primary/20 text-primary" : "border-destructive bg-destructive/20 text-destructive") : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                  {selected && correct ? <Check className="mx-auto mb-0.5 h-3 w-3" /> : null}{choice}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function Card({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: string
  label: string
  color: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5 text-center">
      <div className="flex justify-center" style={{ color }}>
        {icon}
      </div>
      <div className="mt-1 truncate font-mono text-sm font-semibold text-foreground">
        {value}
      </div>
      <div className="lab-label mt-0.5 truncate">{label}</div>
    </div>
  )
}
