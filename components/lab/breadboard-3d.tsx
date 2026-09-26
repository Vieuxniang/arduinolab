"use client"

import { useEffect, useRef } from "react"

interface Props {
  ledOn?: boolean
  motorSpeed?: number
  sensorValue?: number
}

export function Breadboard3D({ ledOn = false, motorSpeed = 0, sensorValue = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight

    const render = () => {
      ctx.fillStyle = "#0f1e3a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw breadboard
      ctx.strokeStyle = "#1a2f4a"
      ctx.lineWidth = 2
      const boardX = canvas.width / 2 - 100
      const boardY = canvas.height / 2 - 80
      ctx.strokeRect(boardX, boardY, 200, 160)

      // Draw holes
      ctx.fillStyle = "#0a0e27"
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
          ctx.beginPath()
          ctx.arc(boardX + 20 + col * 18, boardY + 20 + row * 30, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw LED
      if (ledOn) {
        ctx.fillStyle = "#ff0000"
        ctx.shadowColor = "rgba(255, 0, 0, 0.6)"
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.arc(boardX + 50, boardY + 50, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Draw motor indicator
      if (motorSpeed > 0) {
        ctx.save()
        ctx.translate(boardX + 150, boardY + 80)
        ctx.rotate((motorSpeed / 255) * Math.PI * 2)
        ctx.strokeStyle = "#00ff88"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(15, 0)
        ctx.stroke()
        ctx.restore()
      }

      // Draw sensor value
      ctx.fillStyle = "#00ff88"
      ctx.font = "12px monospace"
      ctx.fillText(`Sensor: ${sensorValue}%`, boardX + 10, boardY + 155)

      requestAnimationFrame(render)
    }

    containerRef.current.appendChild(canvas)
    render()

    return () => {
      canvas.remove()
    }
  }, [ledOn, motorSpeed, sensorValue])

  return (
    <div
      ref={containerRef}
      className="w-full h-48 bg-gradient-to-b from-muted/30 to-muted/10 border border-primary/30 rounded-none flex items-center justify-center grid-bg"
    >
      <div className="text-primary/40 text-xs font-mono">3D Breadboard Simulator</div>
    </div>
  )
}
