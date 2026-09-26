"use client"

import { useLab } from "@/lib/lab/store"
import { translate } from "@/lib/lab/i18n"
import { PALETTE, type BlockType } from "@/lib/lab/code-gen"
import { Plus, X, GripVertical } from "lucide-react"

export function BlockEditor({
  sequence,
  onAdd,
  onRemove,
  onClear,
}: {
  sequence: BlockType[]
  onAdd: (b: BlockType) => void
  onRemove: (index: number) => void
  onClear: () => void
}) {
  const { lang } = useLab()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const t = e.dataTransfer.getData("block") as BlockType
    if (t) onAdd(t)
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="lab-label mb-1.5">
          {translate(lang, "blocks_palette")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PALETTE.map((b) => (
            <button
              key={b.type}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("block", b.type)}
              onClick={() => onAdd(b.type)}
              className="flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
              style={{ borderColor: b.color, color: b.color }}
            >
              <Plus className="h-3 w-3" />
              {translate(lang, b.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <p className="lab-label">
            {translate(lang, "blocks_sequence")} ({sequence.length})
          </p>
          {sequence.length > 0 && (
            <button onClick={onClear} className="text-[11px] text-destructive">
              {translate(lang, "clear")}
            </button>
          )}
        </div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="min-h-24 space-y-1 rounded-md border border-dashed border-border bg-background p-2"
        >
          {sequence.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              {translate(lang, "drag_here")}
            </p>
          ) : (
            sequence.map((b, i) => {
              const meta = PALETTE.find((p) => p.type === b)!
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-xs"
                  style={{ borderColor: meta.color }}
                >
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-medium" style={{ color: meta.color }}>
                    {translate(lang, meta.labelKey)}
                  </span>
                  <button
                    onClick={() => onRemove(i)}
                    aria-label="remove"
                    className="flex h-6 w-6 items-center justify-center rounded text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
