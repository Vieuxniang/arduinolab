'use client'

import { useEffect, useRef } from 'react'

interface SignalFlowProps {
  isActive: boolean
}

export function SignalFlow({ isActive }: SignalFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isActive) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      hue: number
    }> = []

    const createParticles = () => {
      // Create signal flows from random components
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height
      const endX = Math.random() * canvas.width
      const endY = Math.random() * canvas.height

      for (let i = 0; i < 5; i++) {
        particles.push({
          x: startX,
          y: startY,
          vx: (endX - startX) / 30 + (Math.random() - 0.5) * 2,
          vy: (endY - startY) / 30 + (Math.random() - 0.5) * 2,
          life: 1,
          hue: Math.random() * 60 + 120, // Green to cyan range
        })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles = particles.filter((p) => p.life > 0)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02

        const opacity = p.life * 0.8
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${opacity})`
        ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`
        ctx.shadowBlur = 10

        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      if (Math.random() < 0.3) {
        createParticles()
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
