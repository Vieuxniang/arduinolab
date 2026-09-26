'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { getEnvironmentForLevel, getEnvironmentConfig } from '@/lib/lab/neuro/environments'

interface DynamicEnvironmentProps {
  level: number
}

export function DynamicEnvironment({ level }: DynamicEnvironmentProps) {
  const [bgStyle, setBgStyle] = useState<CSSProperties>({})
  const [particleOpacity, setParticleOpacity] = useState(0.1)

  useEffect(() => {
    const theme = getEnvironmentForLevel(level)
    const config = getEnvironmentConfig(theme)

    const nextStyle: CSSProperties = {
      background: `linear-gradient(135deg, ${config.bgGradient[0]} 0%, ${config.bgGradient[1]} 100%)`,
      backgroundAttachment: 'fixed',
    }

    if (config.vignette) {
      nextStyle.boxShadow = 'inset 0 0 120px rgba(0, 0, 0, 0.6)'
    }

    setBgStyle(nextStyle)

    // Adjust particle opacity based on level progression
    const baseOpacity = 0.1 + (level % 5) * 0.05
    setParticleOpacity(Math.min(baseOpacity, 0.3))
  }, [level])

  return (
    <>
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 -z-10"
        style={bgStyle}
      />

      {/* Animated Grid Overlay */}
      <div
        className="fixed inset-0 -z-10 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: particleOpacity,
              animation: `float ${8 + i * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </>
  )
}
