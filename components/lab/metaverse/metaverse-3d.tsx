"use client"

import { useEffect, useRef } from "react"

export function Metaverse3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const canvas = document.createElement("canvas")
    containerRef.current.appendChild(canvas)
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight

    let animationId: number
    let rotation = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#0a0e27"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#00ff88"
      ctx.globalAlpha = 0.3

      for (let i = 0; i < 5; i++) {
        const radius = 50 + i * 30
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.fillStyle = "#00ffff"
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + rotation
        const x = canvas.width / 2 + Math.cos(angle) * 150
        const y = canvas.height / 2 + Math.sin(angle) * 150
        ctx.fillRect(x - 5, y - 5, 10, 10)
      }

      rotation += 0.02

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      canvas.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-background"
      style={{ minHeight: "400px" }}
    />
  )
}
