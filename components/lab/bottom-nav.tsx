"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import {
  Home,
  Lightbulb,
  Thermometer,
  Fan,
  MonitorSmartphone,
  Radio,
  Users,
  ListChecks,
  Trophy,
  Zap,
  Menu,
  X,
} from "lucide-react"

export type Tab =
  | "home"
  | "led"
  | "sensor"
  | "motor"
  | "lcd"
  | "iot"
  | "gallery"
  | "missions"
  | "leaderboard"
  | "metaverse"

const TABS: { id: Tab; icon: typeof Home; key: string }[] = [
  { id: "home", icon: Home, key: "tab_home" },
  { id: "metaverse", icon: Zap, key: "tab_metaverse" },
  { id: "led", icon: Lightbulb, key: "tab_led" },
  { id: "sensor", icon: Thermometer, key: "tab_sensor" },
  { id: "motor", icon: Fan, key: "tab_motor" },
  { id: "lcd", icon: MonitorSmartphone, key: "tab_lcd" },
  { id: "iot", icon: Radio, key: "tab_iot" },
  { id: "gallery", icon: Users, key: "tab_gallery" },
  { id: "missions", icon: ListChecks, key: "tab_missions" },
  { id: "leaderboard", icon: Trophy, key: "tab_leaderboard" },
]

// Primary tabs shown at bottom
const PRIMARY_TABS = ["home", "metaverse", "missions", "gallery", "leaderboard"]

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (t: Tab) => void
}) {
  const { lang } = useLab()
  const [showDrawer, setShowDrawer] = useState(false)

  const primaryTabs = TABS.filter((t) => PRIMARY_TABS.includes(t.id))
  const secondaryTabs = TABS.filter((t) => !PRIMARY_TABS.includes(t.id))

  const handleTabChange = (tab: Tab) => {
    onChange(tab)
    setShowDrawer(false)
  }

  return (
    <>
      <nav className="border-t border-border bg-card relative z-10">
        <div className="flex items-center">
          {/* Primary tabs */}
          <div className="flex flex-1">
            {primaryTabs.map((t) => {
              const Icon = t.icon
              const isActive = active === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(t.id)}
                  className={`relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 border-r border-border px-1 transition-colors last:border-r-0 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={translate(lang, t.key)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    aria-hidden
                    className={`absolute top-0 h-0.5 w-8 rounded-b bg-primary transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.75} />
                  <span className="text-[10px] font-medium leading-none tracking-tight">
                    {translate(lang, t.key)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* More button */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 border-l border-border px-3 transition-colors ${
              showDrawer
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="More tabs"
          >
            {showDrawer ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="text-[10px] font-medium leading-none tracking-tight">
              +{secondaryTabs.length}
            </span>
          </button>
        </div>
      </nav>

      {/* Drawer */}
      {showDrawer && (
        <div className="grid grid-cols-5 gap-1.5 border-t border-border bg-card p-2">
          {secondaryTabs.map((t) => {
            const Icon = t.icon
            const isActive = active === t.id
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border px-1 transition-colors ${
                  isActive
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                aria-label={translate(lang, t.key)}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.75} />
                <span className="text-[10px] font-medium leading-tight tracking-tight text-center">
                  {translate(lang, t.key)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
