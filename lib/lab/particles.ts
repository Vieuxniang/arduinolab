export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  emoji?: string
  color?: string
}

export class ParticleEmitter {
  private particles: Particle[] = []
  private container: HTMLDivElement | null = null
  private animationId: number | null = null

  constructor() {
    if (typeof document !== "undefined") {
      this.container = document.createElement("div")
      this.container.style.position = "fixed"
      this.container.style.top = "0"
      this.container.style.left = "0"
      this.container.style.width = "100%"
      this.container.style.height = "100%"
      this.container.style.pointerEvents = "none"
      this.container.style.zIndex = "9999"
      document.body.appendChild(this.container)
    }
  }

  emit(x: number, y: number, count = 8, emoji = "✨") {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 2 + Math.random() * 3
      this.particles.push({
        id: Math.random().toString(36).slice(2),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        emoji,
      })
    }

    if (!this.animationId) this.animate()
  }

  private animate() {
    const container = this.container
    if (!container) return

    this.particles = this.particles.filter((p) => p.life > 0)

    this.particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.1 // gravity
      p.life -= 0.02

      const el = document.getElementById(`particle-${p.id}`)
      if (el) {
        el.style.left = p.x + "px"
        el.style.top = p.y + "px"
        el.style.opacity = String(p.life)
      }
    })

    const currentIds = new Set(this.particles.map((p) => p.id))
    Array.from(container.children).forEach((el) => {
      const id = el.id.replace("particle-", "")
      if (!currentIds.has(id)) el.remove()
    })

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate())
    } else {
      this.animationId = null
    }
  }

  render() {
    const container = this.container
    if (!container) return

    const containerIds = new Set(Array.from(container.children).map((el) => el.id))

    this.particles.forEach((p) => {
      if (containerIds.has(`particle-${p.id}`)) return

      const el = document.createElement("div")
      el.id = `particle-${p.id}`
      el.style.position = "fixed"
      el.style.left = p.x + "px"
      el.style.top = p.y + "px"
      el.style.fontSize = "20px"
      el.style.pointerEvents = "none"
      el.style.zIndex = "9999"
      el.textContent = p.emoji || "✨"
      container.appendChild(el)
    })
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId)
    this.container?.remove()
  }
}

export const particleEmitter = typeof window !== "undefined" ? new ParticleEmitter() : null
