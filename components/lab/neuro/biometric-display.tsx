'use client'

import { useEffect, useState } from 'react'
import { biometricMonitor, facialDetector, type BiometricData } from '@/lib/lab/neuro/biometrics'
import { Heart, Zap, Brain, Gauge } from 'lucide-react'

export function BiometricDisplay() {
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 70,
    stressLevel: 0.3,
    focusScore: 0.5,
    engagementLevel: 0.6,
    emotionalState: 'calm',
  })

  useEffect(() => {
    facialDetector.simulateEmotionDetection()

    const interval = setInterval(() => {
      setBiometrics(biometricMonitor.getData())
    }, 1000)

    return () => {
      clearInterval(interval)
      facialDetector.stopEmotionDetection()
    }
  }, [])

  const getStressColor = () => {
    if (biometrics.stressLevel < 0.3) return 'text-primary'
    if (biometrics.stressLevel < 0.6) return 'text-yellow-500'
    return 'text-destructive'
  }

  const getFocusColor = () => {
    if (biometrics.focusScore > 0.7) return 'text-primary'
    if (biometrics.focusScore > 0.4) return 'text-yellow-500'
    return 'text-muted-foreground'
  }

  return (
    <div className="flex gap-3 text-xs font-mono p-2 bg-card/50 border border-border rounded backdrop-blur">
      {/* Heart Rate */}
      <div className="flex items-center gap-1">
        <Heart className={`w-3.5 h-3.5 ${biometrics.stressLevel > 0.6 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
        <span>{biometrics.heartRate} bpm</span>
      </div>

      {/* Stress Level */}
      <div className="flex items-center gap-1">
        <Zap className={`w-3.5 h-3.5 ${getStressColor()}`} />
        <span>{Math.round(biometrics.stressLevel * 100)}%</span>
      </div>

      {/* Focus Score */}
      <div className="flex items-center gap-1">
        <Brain className={`w-3.5 h-3.5 ${getFocusColor()}`} />
        <span>{Math.round(biometrics.focusScore * 100)}%</span>
      </div>

      {/* Engagement */}
      <div className="flex items-center gap-1">
        <Gauge className="w-3.5 h-3.5 text-primary" />
        <span>{Math.round(biometrics.engagementLevel * 100)}%</span>
      </div>

      {/* State */}
      <div className="ml-2 px-2 py-0.5 bg-primary/10 rounded text-primary text-xs uppercase">
        {biometrics.emotionalState}
      </div>
    </div>
  )
}
