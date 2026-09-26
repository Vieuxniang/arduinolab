"use client"

import { useEffect, useRef, useState } from "react"

interface TerminalProps {
  code?: string | null
  placeholder: string
  running?: boolean
}

export function Terminal({ code, placeholder, running }: TerminalProps) {
  const [shown, setShown] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!code) {
      setShown("")
      return
    }
    setShown("")
    let i = 0
    const id = setInterval(() => {
      i += 3
      setShown(code.slice(0, i))
      if (i >= code.length) clearInterval(id)
    }, 12)
    return () => clearInterval(id)
  }, [code])

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [shown])

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-1.5">
        <span className="h-2 w-2 rounded-full bg-destructive" />
        <span className="h-2 w-2 rounded-full" style={{ background: "var(--chart-4)" }} />
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">arduino@lab:~</span>
        {running && (
          <span className="ml-auto font-mono text-[11px] text-primary">● RUN</span>
        )}
      </div>
      <div
        ref={ref}
        className="max-h-44 overflow-auto p-2.5 text-xs leading-relaxed"
        style={{ color: "var(--chart-1)" }}
      >
        {code ? (
          <pre className="whitespace-pre-wrap font-mono">
            {shown}
            <span className="lab-cursor">_</span>
          </pre>
        ) : (
          <span className="text-primary">
            {placeholder}
            <span className="lab-cursor">_</span>
          </span>
        )}
      </div>
    </div>
  )
}
