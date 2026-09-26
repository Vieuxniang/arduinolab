"use client"

import { useState } from "react"
import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import {
  GALLERY,
  LEVEL_ORDER,
  LEVEL_LABEL_KEY,
  BADGE_BY_LEVEL,
  type GalleryItem,
  type MissionLevel,
} from "@/lib/lab/missions"
import { Terminal } from "../terminal"
import { Search, Coins, Heart, Code2, X } from "lucide-react"

const BADGE_COLOR: Record<string, string> = {
  beginner: "var(--chart-1)",
  intermediate: "var(--chart-3)",
  expert: "var(--chart-4)",
}

const TIP_AMOUNT = 5

export function GalleryView() {
  const { lang, addLab, canAfford } = useLab()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<MissionLevel | "all">("all")
  const [tips, setTips] = useState<Record<string, number>>({})
  const [tipped, setTipped] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState<GalleryItem | null>(null)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [comments, setComments] = useState<Record<string, string[]>>({})
  const [draft, setDraft] = useState("")

  const items = GALLERY.filter(
    (g) =>
      (filter === "all" || g.level === filter) &&
      (g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.author.toLowerCase().includes(query.toLowerCase())),
  )

  const sendTip = (g: GalleryItem) => {
    if (tipped[g.id] || !canAfford(TIP_AMOUNT)) return
    addLab(-TIP_AMOUNT)
    setTips((t) => ({ ...t, [g.id]: (t[g.id] ?? g.tips) + TIP_AMOUNT }))
    setTipped((t) => ({ ...t, [g.id]: true }))
  }

  return (
    <div className="space-y-3 p-3">
      <h2 className="text-base font-semibold text-foreground">
        {translate(lang, "gallery_title")}
      </h2>

      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={translate(lang, "search")}
          className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", ...LEVEL_ORDER] as (MissionLevel | "all")[]).map((l) => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              filter === l
                ? "border-primary/70 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {l === "all" ? translate(lang, "all_levels") : translate(lang, LEVEL_LABEL_KEY[l])}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((g) => (
          <div key={g.id} className="rounded-xl border border-border bg-card p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{g.title}</h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {translate(lang, "by")} @{g.author}
                </p>
              </div>
              <span
                className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold"
                style={{ color: BADGE_COLOR[g.level], borderColor: BADGE_COLOR[g.level] }}
              >
                {translate(lang, BADGE_BY_LEVEL[g.level])}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setLiked((value) => ({ ...value, [g.id]: !value[g.id] }))}
                className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${liked[g.id] ? "border-primary/70 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                aria-label={liked[g.id] ? "Retirer le soutien" : "Soutenir ce projet"}
              >
                <Heart className="h-3 w-3" fill={liked[g.id] ? "currentColor" : "none"} />
                {liked[g.id] ? "SOUTENU" : "SOUTENIR"}
              </button>
              <button
                onClick={() => setOpen(g)}
                className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:border-primary/50"
              >
                <Code2 className="h-3 w-3" />
                {translate(lang, "view_solution")}
              </button>
              <button
                onClick={() => sendTip(g)}
                disabled={tipped[g.id] || !canAfford(TIP_AMOUNT)}
                className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-50"
                style={{ color: "var(--chart-4)" }}
              >
                <Heart className="h-3 w-3" fill={tipped[g.id] ? "var(--chart-4)" : "none"} />
                {tipped[g.id] ? translate(lang, "tipped") : `${translate(lang, "send_tip")} ${TIP_AMOUNT}`}
              </button>
              <span className="ml-auto flex items-center gap-1 font-mono text-[11px]" style={{ color: "var(--chart-4)" }}>
                <Coins className="h-3 w-3" />
                {(tips[g.id] ?? g.tips)} LAB
              </span>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/70 p-3"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full rounded-xl border border-border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{open.title}</h3>
              <button
                onClick={() => setOpen(null)}
                aria-label="close"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Terminal placeholder={translate(lang, "terminal_ready")} code={open.code} />
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">COMMUNAUTÉ // ENCOURAGEMENTS</span>
                <span className="font-mono text-[11px] text-muted-foreground">{(comments[open.id] ?? []).length} message(s)</span>
              </div>
              <div className="mb-2.5 space-y-1.5">
                {(comments[open.id] ?? []).slice(-3).map((comment, index) => (
                  <p key={`${comment}-${index}`} className="rounded-r-md border-l-2 border-primary/50 bg-background px-2.5 py-1.5 text-xs text-muted-foreground">@apprenant · {comment}</p>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value.slice(0, 120))}
                  placeholder="Encourage ce créateur..."
                  className="min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229 && draft.trim()) {
                      setComments((value) => ({ ...value, [open.id]: [...(value[open.id] ?? []), draft.trim()] }))
                      setDraft("")
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (!draft.trim()) return
                    setComments((value) => ({ ...value, [open.id]: [...(value[open.id] ?? []), draft.trim()] }))
                    setDraft("")
                  }}
                  className="lab-btn lab-btn-secondary px-3 text-[11px]"
                >ENVOYER</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
