"use client"

import { useEffect, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { LabProvider } from "@/lib/lab/store"
import { LabApp } from "@/components/lab/lab-app"

export default function HomePage() {
  // Pi authentication must be complete before this renders (enforced by AppWrapper).
  usePiAuth()

  // Stable per-device identifier persisted locally, tied to the authenticated session.
  const [uid, setUid] = useState("")
  
  useEffect(() => {
    try {
      let id = localStorage.getItem("arduinolab.uid")
      if (!id) {
        id = "pi_" + Math.random().toString(36).slice(2, 10)
        localStorage.setItem("arduinolab.uid", id)
      }
      setUid(id)
    } catch {
      setUid("pi_" + Math.random().toString(36).slice(2, 10))
    }
  }, [])

  if (!uid) {
    return (
      <div className="grid h-screen w-full place-items-center bg-background">
        <div className="text-primary lab-glow text-sm font-mono">{">"} init...</div>
      </div>
    )
  }

  return (
    <LabProvider uid={uid}>
      <LabApp />
    </LabProvider>
  )
}
