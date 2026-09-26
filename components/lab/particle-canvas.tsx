"use client"

import { useEffect } from "react"
import { particleEmitter } from "@/lib/lab/particles"

export function ParticleCanvas() {
  useEffect(() => {
    return () => {
      particleEmitter?.destroy()
    }
  }, [])

  return null
}
