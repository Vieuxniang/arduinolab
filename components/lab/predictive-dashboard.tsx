"use client"

import { AlertTriangle, CheckCircle2, Zap } from "lucide-react"

export interface PredictiveIssue {
  type: "warning" | "error" | "ok"
  message: string
  code?: string
}

export function PredictiveDashboard({ issues }: { issues: PredictiveIssue[] }) {
  const errorCount = issues.filter((i) => i.type === "error").length
  const warningCount = issues.filter((i) => i.type === "warning").length
  const okCount = issues.filter((i) => i.type === "ok").length

  return (
    <div className="space-y-2 rounded-lg border border-border bg-background/50 p-3">
      <div className="mb-2 font-mono text-[11px] text-muted-foreground">{"[CIRCUIT_DIAGNOSTICS]"}</div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-primary" />
          <span className="text-primary/70">OK: {okCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-yellow-500" />
          <span className="text-yellow-500/70">WARN: {warningCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-destructive" />
          <span className="text-destructive/70">ERR: {errorCount}</span>
        </div>
      </div>

      <div className="space-y-1 max-h-32 overflow-auto">
        {issues.map((issue, i) => (
          <div
            key={i}
            className={`font-mono text-[11px] p-1.5 border-l-2 ${
              issue.type === "error"
                ? "border-destructive text-destructive/80 bg-destructive/5"
                : issue.type === "warning"
                  ? "border-yellow-500 text-yellow-600/80 bg-yellow-500/5"
                  : "border-primary text-primary/60 bg-primary/5"
            }`}
          >
            {issue.message}
            {issue.code && <div className="mt-0.5 text-[10px] opacity-60">{issue.code}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
